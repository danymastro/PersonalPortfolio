/**
 * POST /api/assistant — one turn of the terminal scoping assistant.
 *
 * Body:  { conversationId?: string, message: string, lang?: "it" | "en" }
 * Reply: { conversationId, reply, progress, isComplete }
 *
 * The authoritative transcript lives in D1; the client only sends the new message
 * plus the conversationId it received on the first turn.
 */

import type { ChatMsg, Env, Lang } from "../_shared/types";
import { json, preflight, clientIp } from "../_shared/http";
import { checkRateLimit, createConversation, getConversation, saveConversation } from "../_shared/d1";
import { runInterviewTurn } from "../_shared/gemini";
import { computeProgress } from "../_shared/requirements";
import { sendBriefEmail } from "../_shared/email";

const MAX_MESSAGE_LEN = 2000;
const MAX_MESSAGES_PER_CONVERSATION = 40;
const RATE_MAX = 40; // messages
const RATE_WINDOW_SECONDS = 900; // per 15 min per IP

export const onRequestOptions: PagesFunction<Env> = async () => preflight();

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  let body: { conversationId?: unknown; message?: unknown; lang?: unknown };
  try {
    body = await request.json();
  } catch {
    return json({ error: "JSON non valido" }, 400);
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (!message) return json({ error: "Messaggio vuoto" }, 400);
  if (message.length > MAX_MESSAGE_LEN) return json({ error: "Messaggio troppo lungo" }, 400);

  const lang: Lang = body.lang === "en" ? "en" : "it";
  const ip = clientIp(request);

  if (!env.GEMINI_API_KEY) {
    return json({ error: "Assistente non configurato" }, 503);
  }

  const allowed = await checkRateLimit(env, ip, RATE_MAX, RATE_WINDOW_SECONDS);
  if (!allowed) return json({ error: "Troppi messaggi, riprova tra qualche minuto." }, 429);

  const requestedId = typeof body.conversationId === "string" ? body.conversationId : "";
  let conversation =
    requestedId && requestedId.length <= 64 ? await getConversation(env, requestedId) : null;

  if (conversation?.status === "completed") {
    return json({
      conversationId: conversation.id,
      reply:
        lang === "en"
          ? "This conversation is already wrapped up — Danilo has the summary and will follow up by email."
          : "Questa conversazione è già conclusa: Danilo ha il riepilogo e ti risponderà via email.",
      progress: computeProgress(conversation.draft, lang),
      isComplete: true,
    });
  }

  if (!conversation) {
    conversation = await createConversation(env, {
      id: crypto.randomUUID(),
      lang,
      ip,
      userAgent: request.headers.get("User-Agent"),
    });
  }

  if (conversation.messages.length >= MAX_MESSAGES_PER_CONVERSATION) {
    return json({ error: "Conversazione troppo lunga, scrivi direttamente dal form contatti." }, 429);
  }

  const now = new Date().toISOString();
  const userMsg: ChatMsg = { role: "user", content: message, at: now };
  const messages: ChatMsg[] = [...conversation.messages, userMsg];

  const history = messages.map((m) => ({
    role: (m.role === "assistant" ? "model" : "user") as "model" | "user",
    text: m.content,
  }));

  let turn;
  try {
    turn = await runInterviewTurn(env, history, conversation.draft, lang);
  } catch (err) {
    console.error("runInterviewTurn failed:", err);
    // Persist the user message anyway so nothing is lost.
    await saveConversation(env, conversation.id, { messages });
    return json({ error: "L'assistente non ha risposto, riprova." }, 502);
  }

  const assistantMsg: ChatMsg = {
    role: "assistant",
    content: turn.replyToUser,
    at: new Date().toISOString(),
  };
  const finalMessages = [...messages, assistantMsg];
  const justCompleted = turn.isComplete && conversation.status !== "completed";

  await saveConversation(env, conversation.id, {
    messages: finalMessages,
    draft: turn.updatedDraft,
    status: turn.isComplete ? "completed" : "in_progress",
  });

  if (justCompleted) {
    const full = { ...conversation, messages: finalMessages, draft: turn.updatedDraft };
    context.waitUntil(sendBriefEmail(env, full, "completed"));
  }

  return json({
    conversationId: conversation.id,
    reply: turn.replyToUser,
    progress: computeProgress(turn.updatedDraft, lang),
    isComplete: turn.isComplete,
  });
};
