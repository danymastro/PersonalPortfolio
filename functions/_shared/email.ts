/**
 * Brief email — sends the scoping-assistant transcript + structured brief to Danilo.
 * Resend integration mirrors functions/api/contact.ts (including the mock path when
 * RESEND_API_KEY is missing).
 */

import type { Conversation, Env } from "./types";
import { draftToHtml } from "./requirements";
import { escapeHtml } from "./http";

export interface SendBriefResult {
  ok: boolean;
  mock?: boolean;
  id?: string;
  error?: string;
}

function transcriptHtml(conv: Conversation): string {
  if (conv.messages.length === 0) {
    return `<p style="margin:0;color:#888;font-style:italic;">Nessun messaggio.</p>`;
  }
  return conv.messages
    .map((m) => {
      const who = m.role === "assistant" ? "AI" : "Visitatore";
      const bg = m.role === "assistant" ? "#F3F4F6" : "#FEF9C3";
      return `<div style="margin:0 0 8px;padding:10px 12px;background:${bg};border:1px solid #000;border-radius:8px;">
        <div style="font-size:11px;font-weight:bold;color:#555;margin-bottom:4px;">${who}</div>
        <div style="white-space:pre-wrap;font-size:14px;line-height:1.5;">${escapeHtml(m.content)}</div>
      </div>`;
    })
    .join("");
}

export async function sendBriefEmail(
  env: Env,
  conv: Conversation,
  trigger: "completed" | "requested"
): Promise<SendBriefResult> {
  const receiverEmail = env.CONTACT_RECEIVER_EMAIL || "danilo.mastropaolo05@gmail.com";
  const fromEmail = env.FROM_EMAIL || "Portfolio Assistant <onboarding@resend.dev>";
  const apiKey = env.RESEND_API_KEY;

  const triggerLabel =
    trigger === "completed" ? "conversazione completata dall'AI" : "preventivo richiesto dal visitatore";
  const subject = `🤖 Nuovo brief dall'assistente${conv.contactName ? ` — ${conv.contactName}` : ""}`;

  const html = `
    <div style="font-family:Arial,sans-serif;background:#FFFDF5;padding:24px;border:2px solid #000;border-radius:12px;max-width:680px;margin:0 auto;">
      <h2 style="margin-top:0;font-size:22px;border-bottom:2px solid #000;padding-bottom:10px;">Brief dall'assistente del terminale</h2>
      <p style="font-size:14px;margin:8px 0;"><strong>Trigger:</strong> ${triggerLabel}</p>
      <p style="font-size:14px;margin:8px 0;"><strong>Contatto:</strong> ${
        conv.contactName ? escapeHtml(conv.contactName) : "—"
      } ${
        conv.contactEmail
          ? `&lt;<a href="mailto:${escapeHtml(conv.contactEmail)}">${escapeHtml(conv.contactEmail)}</a>&gt;`
          : ""
      }</p>
      <p style="font-size:14px;margin:8px 0;"><strong>Lingua:</strong> ${conv.lang} &nbsp;·&nbsp; <strong>Conversazione:</strong> ${conv.id}</p>

      <div style="margin-top:20px;padding:16px;background:#fff;border:1px solid #000;border-radius:8px;">
        <h3 style="margin-top:0;">Brief strutturato</h3>
        ${draftToHtml(conv.draft)}
      </div>

      <div style="margin-top:20px;padding:16px;background:#fff;border:1px solid #000;border-radius:8px;">
        <h3 style="margin-top:0;">Trascrizione</h3>
        ${transcriptHtml(conv)}
      </div>

      <p style="margin-top:24px;font-size:12px;color:#888;">Assistente di scoping · danilomastropaolo.com/leads</p>
    </div>
  `;

  if (!apiKey) {
    console.warn("RESEND_API_KEY non impostata: brief non inviato (mock).");
    return { ok: true, mock: true };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: fromEmail,
        to: [receiverEmail],
        ...(conv.contactEmail ? { reply_to: conv.contactEmail } : {}),
        subject,
        html,
      }),
    });
    if (!res.ok) {
      const detail = await res.json().catch(() => ({}));
      console.error("Resend error:", detail);
      return { ok: false, error: "Resend request failed" };
    }
    const data = (await res.json()) as { id?: string };
    return { ok: true, id: data.id };
  } catch (err) {
    console.error("sendBriefEmail error:", err);
    return { ok: false, error: err instanceof Error ? err.message : "unknown" };
  }
}
