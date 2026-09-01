/** D1 access helpers for the scoping-assistant conversations. */

import {
  EMPTY_DRAFT,
  type ChatMsg,
  type Conversation,
  type ConversationRow,
  type ConversationStatus,
  type Env,
  type Lang,
  type RequirementsDraft,
} from "./types";

function rowToConversation(row: ConversationRow): Conversation {
  let messages: ChatMsg[] = [];
  let draft: RequirementsDraft = { ...EMPTY_DRAFT };
  try {
    messages = JSON.parse(row.messages) as ChatMsg[];
  } catch {
    /* keep default */
  }
  try {
    draft = { ...EMPTY_DRAFT, ...(JSON.parse(row.draft) as Partial<RequirementsDraft>) };
  } catch {
    /* keep default */
  }
  return {
    id: row.id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    lang: row.lang,
    status: row.status,
    messages,
    draft,
    contactName: row.contact_name,
    contactEmail: row.contact_email,
    briefSentAt: row.brief_sent_at,
    ip: row.ip,
    userAgent: row.user_agent,
  };
}

export async function getConversation(env: Env, id: string): Promise<Conversation | null> {
  const row = await env.DB.prepare("SELECT * FROM conversations WHERE id = ?").bind(id).first<ConversationRow>();
  return row ? rowToConversation(row) : null;
}

export async function createConversation(
  env: Env,
  init: { id: string; lang: Lang; ip: string | null; userAgent: string | null }
): Promise<Conversation> {
  const now = new Date().toISOString();
  await env.DB.prepare(
    `INSERT INTO conversations (id, created_at, updated_at, lang, status, messages, draft, ip, user_agent)
     VALUES (?, ?, ?, ?, 'in_progress', '[]', ?, ?, ?)`
  )
    .bind(init.id, now, now, init.lang, JSON.stringify(EMPTY_DRAFT), init.ip, init.userAgent)
    .run();
  return {
    id: init.id,
    createdAt: now,
    updatedAt: now,
    lang: init.lang,
    status: "in_progress",
    messages: [],
    draft: { ...EMPTY_DRAFT },
    contactName: null,
    contactEmail: null,
    briefSentAt: null,
    ip: init.ip,
    userAgent: init.userAgent,
  };
}

export async function saveConversation(
  env: Env,
  id: string,
  patch: {
    messages?: ChatMsg[];
    draft?: RequirementsDraft;
    status?: ConversationStatus;
    contactName?: string | null;
    contactEmail?: string | null;
    briefSentAt?: string | null;
  }
): Promise<void> {
  const sets: string[] = ["updated_at = ?"];
  const values: unknown[] = [new Date().toISOString()];

  if (patch.messages !== undefined) {
    sets.push("messages = ?");
    values.push(JSON.stringify(patch.messages));
  }
  if (patch.draft !== undefined) {
    sets.push("draft = ?");
    values.push(JSON.stringify(patch.draft));
  }
  if (patch.status !== undefined) {
    sets.push("status = ?");
    values.push(patch.status);
  }
  if (patch.contactName !== undefined) {
    sets.push("contact_name = ?");
    values.push(patch.contactName);
  }
  if (patch.contactEmail !== undefined) {
    sets.push("contact_email = ?");
    values.push(patch.contactEmail);
  }
  if (patch.briefSentAt !== undefined) {
    sets.push("brief_sent_at = ?");
    values.push(patch.briefSentAt);
  }

  values.push(id);
  await env.DB.prepare(`UPDATE conversations SET ${sets.join(", ")} WHERE id = ?`).bind(...values).run();
}

export interface ConversationSummary {
  id: string;
  createdAt: string;
  updatedAt: string;
  lang: Lang;
  status: ConversationStatus;
  messageCount: number;
  contactEmail: string | null;
  briefSentAt: string | null;
}

export async function listConversations(env: Env, limit = 200): Promise<ConversationSummary[]> {
  const { results } = await env.DB.prepare(
    `SELECT id, created_at, updated_at, lang, status, messages, contact_email, brief_sent_at
     FROM conversations ORDER BY updated_at DESC LIMIT ?`
  )
    .bind(limit)
    .all<Pick<ConversationRow, "id" | "created_at" | "updated_at" | "lang" | "status" | "messages" | "contact_email" | "brief_sent_at">>();

  return (results ?? []).map((r) => {
    let count = 0;
    try {
      count = (JSON.parse(r.messages) as unknown[]).length;
    } catch {
      /* ignore */
    }
    return {
      id: r.id,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
      lang: r.lang,
      status: r.status,
      messageCount: count,
      contactEmail: r.contact_email,
      briefSentAt: r.brief_sent_at,
    };
  });
}

/**
 * Fixed-window rate limit keyed by IP. Returns true when the request is allowed.
 * windowSeconds defines the bucket; max is the ceiling within that bucket.
 */
export async function checkRateLimit(
  env: Env,
  ip: string,
  max: number,
  windowSeconds: number
): Promise<boolean> {
  if (ip === "unknown") return true; // don't punish everyone if the header is missing
  const now = Date.now();
  const row = await env.DB.prepare("SELECT count, window_start FROM rate_limits WHERE ip = ?")
    .bind(ip)
    .first<{ count: number; window_start: string }>();

  if (!row) {
    await env.DB.prepare("INSERT INTO rate_limits (ip, count, window_start) VALUES (?, 1, ?)")
      .bind(ip, new Date(now).toISOString())
      .run();
    return true;
  }

  const windowStart = new Date(row.window_start).getTime();
  if (now - windowStart > windowSeconds * 1000) {
    await env.DB.prepare("UPDATE rate_limits SET count = 1, window_start = ? WHERE ip = ?")
      .bind(new Date(now).toISOString(), ip)
      .run();
    return true;
  }

  if (row.count >= max) return false;

  await env.DB.prepare("UPDATE rate_limits SET count = count + 1 WHERE ip = ?").bind(ip).run();
  return true;
}
