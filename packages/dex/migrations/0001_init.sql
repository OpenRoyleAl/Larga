-- Larga Dex v1
CREATE TABLE IF NOT EXISTS users (
  user_id TEXT PRIMARY KEY,
  handle TEXT UNIQUE NOT NULL,
  created_at TEXT NOT NULL,
  github_login TEXT,
  github_url TEXT,
  github_repos INTEGER,
  cursor_url TEXT,
  pet_json TEXT,
  tokens_in INTEGER NOT NULL DEFAULT 0,
  tokens_out INTEGER NOT NULL DEFAULT 0,
  hops INTEGER NOT NULL DEFAULT 0,
  failovers INTEGER NOT NULL DEFAULT 0,
  graphs INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS handle_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  handle TEXT NOT NULL,
  from_at TEXT NOT NULL,
  to_at TEXT
);

CREATE TABLE IF NOT EXISTS facts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  kind TEXT NOT NULL,
  detail TEXT NOT NULL,
  at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS facts_user ON facts(user_id, at);

CREATE TABLE IF NOT EXISTS kettle (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  remaining INTEGER NOT NULL DEFAULT 0,
  note TEXT
);

INSERT OR IGNORE INTO kettle (id, remaining, note) VALUES (1, 0, 'Sponsor pot — same rules for every Pilot. Not a rank boost.');
