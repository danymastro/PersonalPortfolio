/**
 * POST /api/brief — visitor explicitly asks Danilo for a quote.
 *
 * Body:  { conversationId: string, contactEmail: string, contactName?: string }
 * Reply: { ok: true }
 *
 * Saves the contact details on the conversation and emails the brief to Danilo.
 */

import type { Env } from "../_shared/types";
import { json, preflight } from "../_shared/http";
import { getConversation, saveConversation } from "../_shared/d1";
import { sendBriefEmail } from "../_shared/email";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const onRequestOptions: PagesFunction<Env> = async () => preflight();

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  let body: { conversationId?: unknown; contactEmail?: unknown; contactName?: unknown };
  try {
    body = await request.json();
  } catch {
    return json({ error: "JSON non valido" }, 400);
  }

  const conversationId = typeof body.conversationId === "string" ? body.conversationId : "";
  const contactEmail =
    typeof body.contactEmail === "string" ? body.contactEmail.trim().slice(0, 200) : "";
  const contactName =
    typeof body.contactName === "string" ? body.contactName.trim().slice(0, 120) : "";

  if (!conversationId) return json({ error: "Conversazione mancante" }, 400);
  if (!EMAIL_RE.test(contactEmail)) return json({ error: "Email non valida" }, 400);

  const conversation = await getConversation(env, conversationId);
  if (!conversation) return json({ error: "Conversazione non trovata" }, 404);

  const nowIso = new Date().toISOString();
  await saveConversation(env, conversationId, {
    contactEmail,
    contactName: contactName || null,
    briefSentAt: nowIso,
  });

  const full = {
    ...conversation,
    contactEmail,
    contactName: contactName || null,
    briefSentAt: nowIso,
  };
  context.waitUntil(sendBriefEmail(env, full, "requested"));

  return json({ ok: true });
};
