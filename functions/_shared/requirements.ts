/**
 * Progress computation + document rendering for the requirements draft.
 * Adapted from reqscope's src/lib/progress.ts and src/lib/requirementsDoc.ts.
 */

import { DRAFT_SECTIONS, type Lang, type RequirementsDraft } from "./types";
import { escapeHtml } from "./http";

function isFilled(value: unknown): boolean {
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "string") return value.trim().length > 0;
  if (value && typeof value === "object") return Object.values(value).some(isFilled);
  return false;
}

export interface Progress {
  sections: { key: string; label: string; done: boolean }[];
  completed: number;
  total: number;
}

export function computeProgress(draft: RequirementsDraft, lang: Lang = "it"): Progress {
  const sections = DRAFT_SECTIONS.map((s) => ({
    key: s.key,
    label: s.label[lang],
    done: isFilled(draft[s.key]),
  }));
  return {
    sections,
    completed: sections.filter((s) => s.done).length,
    total: sections.length,
  };
}

export interface DocMeta {
  contactName: string | null;
  contactEmail: string | null;
  lang: Lang;
  generatedAt: Date;
}

function bullets(items: string[]): string {
  return items.length > 0 ? items.map((i) => `- ${i}`).join("\n") : "_Non definito._";
}

export function draftToMarkdown(draft: RequirementsDraft, meta: DocMeta): string {
  return `# Brief progetto — assistente portfolio

Contatto: ${meta.contactName || "—"}${meta.contactEmail ? ` <${meta.contactEmail}>` : ""}
Lingua conversazione: ${meta.lang}
Generato il: ${meta.generatedAt.toLocaleString("it-IT")}

## 1. Obiettivo
${draft.objective || "_Non definito._"}

## 2. Tipo di progetto
${draft.projectType || "_Non definito._"}

## 3. Utenti e funzioni core
${bullets(draft.targetUsersAndFeatures)}

## 4. Strumenti / integrazioni esistenti
${bullets(draft.integrations)}

## 5. Budget e tempistiche
${draft.budgetAndTimeline || "_Non definito._"}

## 6. Criteri di successo
${bullets(draft.successCriteria)}

${draft.openQuestions.length > 0 ? `## Punti da approfondire\n${bullets(draft.openQuestions)}\n` : ""}`;
}

function htmlList(items: string[]): string {
  if (items.length === 0) return `<p style="margin:0;color:#888;font-style:italic;">Non definito.</p>`;
  return `<ul style="margin:0;padding-left:20px;">${items
    .map((i) => `<li style="margin:2px 0;">${escapeHtml(i)}</li>`)
    .join("")}</ul>`;
}

function htmlText(value: string): string {
  return value
    ? `<p style="margin:0;white-space:pre-wrap;">${escapeHtml(value)}</p>`
    : `<p style="margin:0;color:#888;font-style:italic;">Non definito.</p>`;
}

/** Requirements block as an HTML fragment — used in the brief email and the /leads page. */
export function draftToHtml(draft: RequirementsDraft): string {
  const section = (title: string, body: string) =>
    `<div style="margin:0 0 16px;">
       <h3 style="margin:0 0 4px;font-size:13px;text-transform:uppercase;letter-spacing:0.05em;color:#555;">${title}</h3>
       ${body}
     </div>`;

  return `
    ${section("1. Obiettivo", htmlText(draft.objective))}
    ${section("2. Tipo di progetto", htmlText(draft.projectType))}
    ${section("3. Utenti e funzioni core", htmlList(draft.targetUsersAndFeatures))}
    ${section("4. Strumenti / integrazioni esistenti", htmlList(draft.integrations))}
    ${section("5. Budget e tempistiche", htmlText(draft.budgetAndTimeline))}
    ${section("6. Criteri di successo", htmlList(draft.successCriteria))}
    ${draft.openQuestions.length > 0 ? section("Punti da approfondire", htmlList(draft.openQuestions)) : ""}
  `;
}
