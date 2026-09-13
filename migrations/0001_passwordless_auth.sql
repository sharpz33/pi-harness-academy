PRAGMA foreign_keys = ON;

CREATE TABLE learners (
  id TEXT PRIMARY KEY,
  email_normalized TEXT NOT NULL UNIQUE,
  created_at INTEGER NOT NULL
);

CREATE TABLE login_tokens (
  id TEXT PRIMARY KEY,
  learner_id TEXT NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  return_to TEXT NOT NULL DEFAULT '/',
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  consumed_at INTEGER,
  revoked_at INTEGER,
  FOREIGN KEY (learner_id) REFERENCES learners(id) ON DELETE CASCADE
);

CREATE INDEX login_tokens_learner_created_idx
  ON login_tokens (learner_id, created_at DESC);

CREATE INDEX login_tokens_expiry_idx
  ON login_tokens (expires_at);

CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  learner_id TEXT NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  source_login_token_id TEXT NOT NULL UNIQUE,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  revoked_at INTEGER,
  FOREIGN KEY (learner_id) REFERENCES learners(id) ON DELETE CASCADE,
  FOREIGN KEY (source_login_token_id) REFERENCES login_tokens(id) ON DELETE CASCADE
);

CREATE INDEX sessions_learner_idx
  ON sessions (learner_id);

CREATE INDEX sessions_expiry_idx
  ON sessions (expires_at);
