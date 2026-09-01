/**
 * Shared types for the terminal scoping assistant.
 * Adapted (and trimmed to ~6 areas) from reqscope's src/lib/types.ts.
 */

export type Lang = "it" | "en";

export type ChatRole = "assistant" | "user";

export interface ChatMsg {
  role: ChatRole;
  content: string;
  at: string; // ISO timestamp
}

/**
 * Lightweight requirements draft — kept small on purpose: this is cold traffic,
 * not a committed client sitting through a full interview.
 */
export interface RequirementsDraft {
  /** What problem the project solves, and why now. */
  objective: string;
  /** Kind of project (web platform, internal tool, mobile app, AI automation, brand launch, …). */
  projectType: string;
  /** Who will use it in practice + the core things each type of user must be able to do. */
  targetUsersAndFeatures: string[];
  /** Tools/software already in use that the new product should talk to. */
  integrations: string[];
  /** Budget range + desired timeline, in the visitor's own words. */
  budgetAndTimeline: string;
  /** What the visitor would see change in their activity if the project works. */
  successCriteria: string[];
  /** Things the visitor said they don't know yet, or spontaneous technical preferences. */
  openQuestions: string[];
}

export const EMPTY_DRAFT: RequirementsDraft = {
  objective: "",
  projectType: "",
  targetUsersAndFeatures: [],
  integrations: [],
  budgetAndTimeline: "",
  successCriteria: [],
  openQuestions: [],
};

/** Areas counted by the progress indicator (openQuestions is not a coverage area). */
export const DRAFT_SECTIONS: { key: keyof RequirementsDraft; label: Record<Lang, string> }[] = [
  { key: "objective", label: { it: "Obiettivo", en: "Goal" } },
  { key: "projectType", label: { it: "Tipo di progetto", en: "Project type" } },
  { key: "targetUsersAndFeatures", label: { it: "Utenti e funzioni", en: "Users & features" } },
  { key: "integrations", label: { it: "Integrazioni", en: "Integrations" } },
  { key: "budgetAndTimeline", label: { it: "Budget e tempi", en: "Budget & timeline" } },
  { key: "successCriteria", label: { it: "Criteri di successo", en: "Success criteria" } },
];

export interface AssistantTurn {
  replyToUser: string;
  updatedDraft: RequirementsDraft;
  isComplete: boolean;
}

export type ConversationStatus = "in_progress" | "completed";

export interface ConversationRow {
  id: string;
  created_at: string;
  updated_at: string;
  lang: Lang;
  status: ConversationStatus;
  messages: string; // JSON ChatMsg[]
  draft: string; // JSON RequirementsDraft
  contact_name: string | null;
  contact_email: string | null;
  brief_sent_at: string | null;
  ip: string | null;
  user_agent: string | null;
}

export interface Conversation {
  id: string;
  createdAt: string;
  updatedAt: string;
  lang: Lang;
  status: ConversationStatus;
  messages: ChatMsg[];
  draft: RequirementsDraft;
  contactName: string | null;
  contactEmail: string | null;
  briefSentAt: string | null;
  ip: string | null;
  userAgent: string | null;
}

/** Bindings + vars available to the Pages Functions in this project. */
export interface Env {
  DB: D1Database;
  GEMINI_API_KEY?: string;
  GEMINI_MODEL?: string;
  RESEND_API_KEY?: string;
  CONTACT_RECEIVER_EMAIL?: string;
  FROM_EMAIL?: string;
  LEADS_USER?: string;
  LEADS_PASSWORD?: string;
}
