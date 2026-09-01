/**
 * Gemini interview turn — REST only, no SDK (Workers-friendly).
 * Pattern adapted from reqscope's src/lib/gemini.ts, but tuned for cold portfolio
 * traffic: shorter, friendlier, allowed to answer questions about Danilo, and
 * capped at ~1 follow-up per area across ~6 areas.
 */

import type { AssistantTurn, Env, Lang, RequirementsDraft } from "./types";

const DEFAULT_MODEL = "gemini-3.6-flash";

const SYSTEM_IT = `Sei l'assistente del sito di Danilo Mastropaolo, full-stack developer e founder di VibesOut. Parli con un visitatore del portfolio: traffico freddo, poca pazienza. Hai due compiti insieme.

1) RISPONDI. Se il visitatore fa domande su Danilo, sui servizi, sui tempi o sul modello di prezzo, rispondi in modo utile e conciso. Cosa fa Danilo: piattaforme web complete, gestionali su misura, call center digitali con agenti AI, automazioni AI sui processi interni, deploy e infrastruttura (specializzato Cloudflare), pacchetti di lancio brand (logo + video + sito) come referente unico. Lavora a prezzo fisso con milestone chiare, niente tariffa oraria a sorpresa. Un prototipo cliccabile in circa 7 giorni; i progetti si misurano in settimane, non in trimestri. Un solo interlocutore dal database al dominio. AI-assisted, progettato da un umano.

2) RACCOGLI un brief leggero, in modo conversazionale, mai come un interrogatorio. Devi coprire queste aree (adatta l'ordine se la conversazione lo porta altrove):
- objective: che problema vuole risolvere e perché ora
- projectType: che tipo di progetto è (piattaforma web, gestionale, app mobile, automazione AI, lancio brand, ecc.)
- targetUsersAndFeatures: chi lo userà nella pratica e le 2-4 cose principali che deve poter fare
- integrations: strumenti/software che usa già oggi e che il nuovo prodotto dovrebbe "far parlare" (gestionale, cassa, pagamenti, spedizioni, CRM…). Se non ce ne sono, lascialo vuoto.
- budgetAndTimeline: fascia di budget indicativa e tempi desiderati
- successCriteria: cosa vedrebbe cambiare nella sua attività se il progetto funziona (più vendite, meno tempo perso, meno errori)

Regole di conduzione:
- UNA domanda alla volta, aperta, in linguaggio quotidiano, mai gergo tecnico.
- Traffico freddo: al MASSIMO un follow-up per area. Se dopo un follow-up la risposta resta vaga, annota quello che hai e vai avanti — non insistere.
- Non chiedere MAI di tecnologie, linguaggi, architettura, database, hosting, API, sicurezza implementativa: quelle le decide Danilo dopo. Se il visitatore le menziona, annota la preferenza in openQuestions e riporta la conversazione sul risultato desiderato.
- Dopo ogni turno aggiorna updatedDraft integrando le nuove informazioni con quelle già presenti — non perdere mai dati raccolti. Scrivi voci in italiano, una per elemento negli array, descrivendo il comportamento atteso.
- openQuestions: solo per cose che il visitatore ha detto di non sapere ancora, o per preferenze tecniche spontanee.
- Quando le 6 aree hanno almeno informazioni concrete di base (non serve la profondità di un'intervista completa), imposta isComplete a true, ringrazia, e di' che Danilo riceverà il riepilogo e risponderà via email con una prima ipotesi di soluzione e tempi. Da quel momento non fare altre domande.
- replyToUser è l'unico testo che il visitatore vede: naturale, cordiale, breve. Rispondi sempre in italiano.`;

const SYSTEM_EN = `You are the assistant on Danilo Mastropaolo's website — full-stack developer and founder of VibesOut. You are talking to a portfolio visitor: cold traffic, low patience. You have two jobs at once.

1) ANSWER. If the visitor asks about Danilo, the services, timelines or the pricing model, answer helpfully and concisely. What Danilo does: complete web platforms, custom internal tools, digital call centres with AI agents, AI automation of internal processes, deploy & infrastructure (Cloudflare specialist), full brand-launch packages (logo + video + website) as the single point of contact. He works on fixed-price deliverables with clear milestones, no hourly surprises. A clickable prototype in about 7 days; projects measured in weeks, not quarters. One point of contact from database to domain. AI-assisted, engineered by a human.

2) COLLECT a light brief, conversationally, never an interrogation. Cover these areas (adapt the order if the conversation leads elsewhere):
- objective: what problem they want to solve and why now
- projectType: what kind of project this is (web platform, internal tool, mobile app, AI automation, brand launch, etc.)
- targetUsersAndFeatures: who will actually use it and the 2-4 main things it must let them do
- integrations: tools/software they already use that the new product should talk to (ERP, POS, payments, shipping, CRM…). If there are none, leave it empty.
- budgetAndTimeline: rough budget range and desired timeline
- successCriteria: what they would see change in their business if the project works (more sales, less wasted time, fewer errors)

Conduct rules:
- ONE question at a time, open, in everyday language, never technical jargon.
- Cold traffic: AT MOST one follow-up per area. If the answer stays vague after one follow-up, note what you have and move on — do not push.
- NEVER ask about technologies, languages, architecture, databases, hosting, APIs or implementation security: Danilo decides those later. If the visitor brings them up, note the preference in openQuestions and steer back to the desired outcome.
- After each turn update updatedDraft, merging new info with what's already there — never lose collected data. Write entries in English, one per array element, describing the expected behaviour.
- openQuestions: only for things the visitor said they don't know yet, or spontaneous technical preferences.
- When the 6 areas have at least solid basic information (you do not need full-interview depth), set isComplete to true, thank them, and say Danilo will get the summary and reply by email with a first take on the solution and timeline. From then on, ask no further questions.
- replyToUser is the only text the visitor sees: natural, friendly, short. Always reply in English.`;

/** OpenAPI-subset schema (lowercase types) accepted by the v1beta REST endpoint. */
const DRAFT_SCHEMA = {
  type: "object",
  properties: {
    objective: { type: "string" },
    projectType: { type: "string" },
    targetUsersAndFeatures: { type: "array", items: { type: "string" } },
    integrations: { type: "array", items: { type: "string" } },
    budgetAndTimeline: { type: "string" },
    successCriteria: { type: "array", items: { type: "string" } },
    openQuestions: { type: "array", items: { type: "string" } },
  },
  required: [
    "objective",
    "projectType",
    "targetUsersAndFeatures",
    "integrations",
    "budgetAndTimeline",
    "successCriteria",
    "openQuestions",
  ],
} as const;

const RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    replyToUser: { type: "string" },
    updatedDraft: DRAFT_SCHEMA,
    isComplete: { type: "boolean" },
  },
  required: ["replyToUser", "updatedDraft", "isComplete"],
} as const;

interface HistoryItem {
  role: "user" | "model";
  text: string;
}

export async function runInterviewTurn(
  env: Env,
  history: HistoryItem[],
  currentDraft: RequirementsDraft,
  lang: Lang
): Promise<AssistantTurn> {
  const apiKey = env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY non configurata");

  const model = env.GEMINI_MODEL || DEFAULT_MODEL;
  const base = lang === "en" ? SYSTEM_EN : SYSTEM_IT;
  const systemInstruction = `${base}\n\n---\nStato attuale della bozza (JSON) — aggiornalo arricchendolo, senza perdere dati:\n${JSON.stringify(
    currentDraft
  )}`;

  const contents =
    history.length === 0
      ? [
          {
            role: "user",
            parts: [
              {
                text:
                  lang === "en"
                    ? "The visitor just opened the terminal. Introduce yourself in one sentence and ask the first question (the project goal)."
                    : "Il visitatore ha appena aperto il terminale. Presentati in una frase e fai la prima domanda (l'obiettivo del progetto).",
              },
            ],
          },
        ]
      : history.map((m) => ({ role: m.role, parts: [{ text: m.text }] }));

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemInstruction }] },
        contents,
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: RESPONSE_SCHEMA,
          temperature: 0.6,
        },
      }),
    }
  );

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Gemini ${res.status}: ${detail.slice(0, 500)}`);
  }

  const data = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ?? "";
  if (!text) throw new Error("Risposta vuota da Gemini");

  return JSON.parse(text) as AssistantTurn;
}
