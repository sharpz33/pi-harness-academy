import { LOGIN_REQUEST_LIMIT, type AuthStore, type LoginChallenge, type LoginInspection, type SessionIdentity } from './types'

export class D1AuthStore implements AuthStore {
  constructor(private readonly db: D1Database) {}

  async createLoginChallenge(email: string, challenge: LoginChallenge, windowStartsAt: number): Promise<'created' | 'rate_limited'> {
    const recent = await this.db
      .prepare(`SELECT COUNT(*) AS count
        FROM login_tokens AS token
        JOIN learners AS learner ON learner.id = token.learner_id
        WHERE learner.email_normalized = ? AND token.created_at >= ? AND token.revoked_at IS NULL`)
      .bind(email, windowStartsAt)
      .first<{ count: number }>()

    if ((recent?.count ?? 0) >= LOGIN_REQUEST_LIMIT) {
      return 'rate_limited'
    }

    const results = await this.db.batch([
      this.db
        .prepare('INSERT INTO learners (id, email_normalized, created_at) VALUES (?, ?, ?) ON CONFLICT(email_normalized) DO NOTHING')
        .bind(challenge.learnerId, email, challenge.createdAt),
      this.db
        .prepare(`INSERT INTO login_tokens
          (id, learner_id, token_hash, return_to, created_at, expires_at)
          SELECT ?, id, ?, ?, ?, ? FROM learners WHERE email_normalized = ?`)
        .bind(challenge.id, challenge.tokenHash, challenge.returnTo, challenge.createdAt, challenge.expiresAt, email),
    ])

    if (results[1]?.meta.changes !== 1) {
      throw new Error('Failed to create login challenge')
    }

    return 'created'
  }

  async inspectLoginToken(tokenHash: string, now: number): Promise<LoginInspection | null> {
    return this.db
      .prepare(`SELECT id, learner_id AS learnerId, return_to AS returnTo
        FROM login_tokens
        WHERE token_hash = ? AND consumed_at IS NULL AND revoked_at IS NULL AND expires_at > ?`)
      .bind(tokenHash, now)
      .first<LoginInspection>()
  }

  async consumeLoginToken(input: {
    inspection: LoginInspection
    loginTokenHash: string
    sessionId: string
    sessionTokenHash: string
    now: number
    expiresAt: number
  }): Promise<boolean> {
    const results = await this.db.batch([
      this.db
        .prepare(`INSERT INTO sessions
          (id, learner_id, token_hash, source_login_token_id, created_at, expires_at)
          SELECT ?, learner_id, ?, id, ?, ?
          FROM login_tokens
          WHERE id = ? AND token_hash = ? AND consumed_at IS NULL AND revoked_at IS NULL AND expires_at > ?`)
        .bind(
          input.sessionId,
          input.sessionTokenHash,
          input.now,
          input.expiresAt,
          input.inspection.id,
          input.loginTokenHash,
          input.now,
        ),
      this.db
        .prepare(`UPDATE login_tokens SET consumed_at = ?
          WHERE id = ? AND token_hash = ? AND consumed_at IS NULL AND revoked_at IS NULL AND expires_at > ?`)
        .bind(input.now, input.inspection.id, input.loginTokenHash, input.now),
    ])

    return results[0]?.meta.changes === 1 && results[1]?.meta.changes === 1
  }

  async revokeLoginToken(tokenHash: string, now: number): Promise<void> {
    await this.db
      .prepare('UPDATE login_tokens SET revoked_at = ? WHERE token_hash = ? AND consumed_at IS NULL AND revoked_at IS NULL')
      .bind(now, tokenHash)
      .run()
  }

  async findSession(sessionTokenHash: string, now: number): Promise<SessionIdentity | null> {
    return this.db
      .prepare(`SELECT learner_id AS learnerId
        FROM sessions
        WHERE token_hash = ? AND revoked_at IS NULL AND expires_at > ?`)
      .bind(sessionTokenHash, now)
      .first<SessionIdentity>()
  }

  async revokeSession(sessionTokenHash: string, now: number): Promise<void> {
    await this.db
      .prepare('UPDATE sessions SET revoked_at = ? WHERE token_hash = ? AND revoked_at IS NULL')
      .bind(now, sessionTokenHash)
      .run()
  }
}
