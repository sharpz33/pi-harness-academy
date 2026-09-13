PRAGMA foreign_keys = ON;

CREATE TABLE completion_proofs (
  id TEXT PRIMARY KEY,
  learner_id TEXT NOT NULL UNIQUE,
  public_id TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  revoked_at INTEGER,
  FOREIGN KEY (learner_id) REFERENCES learners(id) ON DELETE CASCADE
);

CREATE INDEX completion_proofs_public_idx
  ON completion_proofs (public_id, revoked_at);
