PRAGMA foreign_keys = ON;

CREATE TABLE device_authorizations (
  id TEXT PRIMARY KEY,
  device_code_hash TEXT NOT NULL UNIQUE,
  user_code TEXT NOT NULL UNIQUE,
  learner_id TEXT,
  profile_label TEXT,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  approved_at INTEGER,
  consumed_at INTEGER,
  FOREIGN KEY (learner_id) REFERENCES learners(id) ON DELETE CASCADE
);

CREATE INDEX device_authorizations_expiry_idx
  ON device_authorizations (expires_at);

CREATE TABLE device_credentials (
  id TEXT PRIMARY KEY,
  learner_id TEXT NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  profile_label TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  last_used_at INTEGER,
  revoked_at INTEGER,
  FOREIGN KEY (learner_id) REFERENCES learners(id) ON DELETE CASCADE
);

CREATE INDEX device_credentials_learner_idx
  ON device_credentials (learner_id, revoked_at);

CREATE TABLE mission_progress (
  learner_id TEXT NOT NULL,
  mission_slug TEXT NOT NULL,
  device_credential_id TEXT NOT NULL,
  completed_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (learner_id, mission_slug),
  FOREIGN KEY (learner_id) REFERENCES learners(id) ON DELETE CASCADE,
  FOREIGN KEY (device_credential_id) REFERENCES device_credentials(id) ON DELETE RESTRICT
);

CREATE INDEX mission_progress_learner_completed_idx
  ON mission_progress (learner_id, completed_at);
