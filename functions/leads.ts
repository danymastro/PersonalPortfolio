/**
 * GET /leads — password-protected (HTTP Basic Auth) dashboard for the scoping
 * assistant conversations. Server-rendered HTML, no SPA involvement.
 *
 *   /leads                       → list
 *   /leads?id=<conversationId>   → detail (transcript + structured brief)
 *   /leads?id=<id>&format=md     → download brief as Markdown
 */

import type { Env } from "./_shared/types";
import { requireBasicAuth } from "./_shared/auth";
import { escapeHtml } from "./_shared/http";
import { getConversation, listConversations } from "./_shared/d1";
import { draftToHtml, draftToMarkdown } from "./_shared/requirements";

const PAGE_CSS = `
  *{box-sizing:border-box}
  body{margin:0;font-family:'Space Grotesk',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:#FFFDF5;color:#0f172a;padding:32px 20px}
  .wrap{max-width:960px;margin:0 auto}
  h1{font-size:24px;margin:0 0 4px}
  .muted{color:#64748b;font-size:13px}
  a{color:#2563EB}
  table{width:100%;border-collapse:collapse;margin-top:20px;background:#fff;border:2px solid #000;border-radius:12px;overflow:hidden}
  th,td{padding:10px 12px;text-align:left;font-size:13px;border-bottom:1px solid #e2e8f0}
  th{background:#FDE047;font-size:11px;text-transform:uppercase;letter-spacing:0.05em}
  tr:last-child td{border-bottom:none}
  tr:hover td{background:#FEF9C3}
  .badge{display:inline-block;padding:2px 8px;border:1px solid #000;border-radius:999px;font-size:11px;font-weight:700}
  .b-progress{background:#BFDBFE}
  .b-completed{background:#86EFAC}
  .b-brief{background:#F9A8D4}
  .card{background:#fff;border:2px solid #000;border-radius:12px;padding:20px;margin-top:20px}
  .msg{margin:0 0 8px;padding:10px 12px;border:1px solid #000;border-radius:8px;white-space:pre-wrap;font-size:14px;line-height:1.5}
  .m-ai{background:#F3F4F6}
  .m-user{background:#FEF9C3}
  .back{display:inline-block;margin-bottom:16px;font-size:13px}
  .btn{display:inline-block;padding:6px 12px;border:2px solid #000;border-radius:8px;background:#D0FF71;color:#000;text-decoration:none;font-size:12px;font-weight:700}
`;

function shell(title: string, inner: string): Response {
  const html = `<!doctype html><html lang="it"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>${escapeHtml(title)}</title><style>${PAGE_CSS}</style></head>
<body><div class="wrap">${inner}</div></body></html>`;
  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
  });
}

function fmt(iso: string): string {
  return new Date(iso).toLocaleString("it-IT", { dateStyle: "short", timeStyle: "short" });
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  const unauthorized = requireBasicAuth(request, env);
  if (unauthorized) return unauthorized;

  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  if (!id) {
    const rows = await listConversations(env);
    const body = `
      <h1>Lead — assistente terminale</h1>
      <p class="muted">${rows.length} conversazioni · più recenti in alto</p>
      <table>
        <thead><tr><th>Aggiornata</th><th>Lingua</th><th>Messaggi</th><th>Stato</th><th>Email</th><th></th></tr></thead>
        <tbody>
          ${
            rows.length === 0
              ? `<tr><td colspan="6" class="muted">Ancora nessuna conversazione.</td></tr>`
              : rows
                  .map(
                    (r) => `<tr>
                      <td>${fmt(r.updatedAt)}</td>
                      <td>${r.lang}</td>
                      <td>${r.messageCount}</td>
                      <td><span class="badge ${
                        r.status === "completed" ? "b-completed" : "b-progress"
                      }">${r.status === "completed" ? "completata" : "in corso"}</span>${
                      r.briefSentAt ? ' <span class="badge b-brief">brief inviato</span>' : ""
                    }</td>
                      <td>${r.contactEmail ? escapeHtml(r.contactEmail) : "—"}</td>
                      <td><a href="/leads?id=${encodeURIComponent(r.id)}">apri ↗</a></td>
                    </tr>`
                  )
                  .join("")
          }
        </tbody>
      </table>`;
    return shell("Lead — assistente", body);
  }

  const conv = await getConversation(env, id);
  if (!conv) return shell("Non trovata", `<p><a class="back" href="/leads">← lista</a></p><p>Conversazione non trovata.</p>`);

  if (url.searchParams.get("format") === "md") {
    const md = draftToMarkdown(conv.draft, {
      contactName: conv.contactName,
      contactEmail: conv.contactEmail,
      lang: conv.lang,
      generatedAt: new Date(),
    });
    return new Response(md, {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Content-Disposition": `attachment; filename="brief-${conv.id.slice(0, 8)}.md"`,
        "Cache-Control": "no-store",
      },
    });
  }

  const transcript = conv.messages.length
    ? conv.messages
        .map(
          (m) =>
            `<div class="msg ${m.role === "assistant" ? "m-ai" : "m-user"}"><strong style="display:block;font-size:11px;color:#555;margin-bottom:4px;">${
              m.role === "assistant" ? "AI" : "Visitatore"
            } · ${fmt(m.at)}</strong>${escapeHtml(m.content)}</div>`
        )
        .join("")
    : `<p class="muted">Nessun messaggio.</p>`;

  const body = `
    <a class="back" href="/leads">← lista</a>
    <h1>Conversazione ${escapeHtml(conv.id.slice(0, 8))}</h1>
    <p class="muted">
      Creata ${fmt(conv.createdAt)} · aggiornata ${fmt(conv.updatedAt)} · lingua ${conv.lang} ·
      stato ${conv.status}${conv.briefSentAt ? ` · brief inviato ${fmt(conv.briefSentAt)}` : ""}
    </p>
    <p class="muted">Contatto: ${conv.contactName ? escapeHtml(conv.contactName) : "—"} ${
      conv.contactEmail ? `&lt;${escapeHtml(conv.contactEmail)}&gt;` : ""
    }</p>

    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <h2 style="margin:0;font-size:16px;">Brief strutturato</h2>
        <a class="btn" href="/leads?id=${encodeURIComponent(conv.id)}&amp;format=md">Scarica .md</a>
      </div>
      <div style="margin-top:12px;">${draftToHtml(conv.draft)}</div>
    </div>

    <div class="card">
      <h2 style="margin:0 0 12px;font-size:16px;">Trascrizione</h2>
      ${transcript}
    </div>`;

  return shell(`Conversazione ${conv.id.slice(0, 8)}`, body);
};
