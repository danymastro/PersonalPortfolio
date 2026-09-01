-- Scoping assistant: conversations + per-IP rate limiting.

CREATE TABLE IF NOT EXISTS conversations (
  id            TEXT PRIMARY KEY,
  created_at    TEXT NOT NULL,
  updated_at    TEXT NOT NULL,
  lang          TEXT NOT NULL DEFAULT 'it',
  status        TEXT NOT NULL DEFAULT 'in_progress',  -- in_progress | completed
  messages      TEXT NOT NULL DEFAULT '[]',           -- JSON: [{ role, content, at }]
  draft         TEXT NOT NULL DEFAULT '{}',           -- JSON: RequirementsDraft
  contact_name  TEXT,
  contact_email TEXT,
  brief_sent_at TEXT,
  ip            TEXT,
  user_agent    TEXT
);

CREATE INDEX IF NOT EXISTS idx_conversations_updated ON conversations (updated_at DESC);

CREATE TABLE IF NOT EXISTS rate_limits (
  ip           TEXT PRIMARY KEY,
  count        INTEGER NOT NULL DEFAULT 0,
  window_start TEXT NOT NULL
);
