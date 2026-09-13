import type { ApprovedAuthorization, DeviceAuthorization, DeviceIdentity, JourneyState, JourneyStore } from './types'

export class D1JourneyStore implements JourneyStore {
  constructor(private readonly db: D1Database) {}

  async createAuthorization(input: DeviceAuthorization): Promise<void> {
    await this.db.prepare(`INSERT INTO device_authorizations
      (id, device_code_hash, user_code, created_at, expires_at)
      VALUES (?, ?, ?, ?, ?)`)
      .bind(input.id, input.deviceCodeHash, input.userCode, input.createdAt, input.expiresAt)
      .run()
  }

  async approveAuthorization(userCode: string, learnerId: string, profileLabel: string, now: number): Promise<boolean> {
    const result = await this.db.prepare(`UPDATE device_authorizations
      SET learner_id = ?, profile_label = ?, approved_at = ?
      WHERE user_code = ? AND learner_id IS NULL AND consumed_at IS NULL AND expires_at > ?`)
      .bind(learnerId, profileLabel, now, userCode, now)
      .run()
    return result.meta.changes === 1
  }

  async findApprovedAuthorization(deviceCodeHash: string, now: number): Promise<ApprovedAuthorization | null> {
    return this.db.prepare(`SELECT id, learner_id AS learnerId, profile_label AS profileLabel
      FROM device_authorizations
      WHERE device_code_hash = ? AND learner_id IS NOT NULL AND approved_at IS NOT NULL
        AND consumed_at IS NULL AND expires_at > ?`)
      .bind(deviceCodeHash, now)
      .first<ApprovedAuthorization>()
  }

  async consumeAuthorization(input: {
    authorization: ApprovedAuthorization
    deviceCodeHash: string
    credentialId: string
    credentialTokenHash: string
    now: number
    expiresAt: number
  }): Promise<boolean> {
    const results = await this.db.batch([
      this.db.prepare(`INSERT INTO device_credentials
        (id, learner_id, token_hash, profile_label, created_at, expires_at)
        SELECT ?, learner_id, ?, profile_label, ?, ?
        FROM device_authorizations
        WHERE id = ? AND device_code_hash = ? AND approved_at IS NOT NULL
          AND consumed_at IS NULL AND expires_at > ?`)
        .bind(input.credentialId, input.credentialTokenHash, input.now, input.expiresAt,
          input.authorization.id, input.deviceCodeHash, input.now),
      this.db.prepare(`UPDATE device_authorizations SET consumed_at = ?
        WHERE id = ? AND device_code_hash = ? AND approved_at IS NOT NULL
          AND consumed_at IS NULL AND expires_at > ?`)
        .bind(input.now, input.authorization.id, input.deviceCodeHash, input.now),
    ])
    return results[0]?.meta.changes === 1 && results[1]?.meta.changes === 1
  }

  async findDevice(tokenHash: string, now: number): Promise<DeviceIdentity | null> {
    const device = await this.db.prepare(`SELECT id, learner_id AS learnerId, profile_label AS profileLabel
      FROM device_credentials
      WHERE token_hash = ? AND revoked_at IS NULL AND expires_at > ?`)
      .bind(tokenHash, now)
      .first<DeviceIdentity>()
    if (device) {
      await this.db.prepare('UPDATE device_credentials SET last_used_at = ? WHERE id = ?').bind(now, device.id).run()
    }
    return device
  }

  async completeMission(learnerId: string, deviceId: string, missionSlug: string, now: number): Promise<void> {
    await this.db.prepare(`INSERT INTO mission_progress
      (learner_id, mission_slug, device_credential_id, completed_at, updated_at)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(learner_id, mission_slug) DO UPDATE SET updated_at = excluded.updated_at`)
      .bind(learnerId, missionSlug, deviceId, now, now)
      .run()
  }

  async getJourney(learnerId: string, now: number): Promise<JourneyState> {
    const [progress, devices] = await this.db.batch([
      this.db.prepare('SELECT mission_slug AS missionSlug FROM mission_progress WHERE learner_id = ? ORDER BY completed_at').bind(learnerId),
      this.db.prepare(`SELECT id, profile_label AS profileLabel FROM device_credentials
        WHERE learner_id = ? AND revoked_at IS NULL AND expires_at > ? ORDER BY created_at DESC`).bind(learnerId, now),
    ])
    return {
      completedSlugs: (progress.results as { missionSlug: string }[]).map(({ missionSlug }) => missionSlug),
      devices: devices.results as { id: string; profileLabel: string }[],
    }
  }

  async revokeDevice(learnerId: string, deviceId: string, now: number): Promise<boolean> {
    const result = await this.db.prepare(`UPDATE device_credentials SET revoked_at = ?
      WHERE id = ? AND learner_id = ? AND revoked_at IS NULL`)
      .bind(now, deviceId, learnerId)
      .run()
    return result.meta.changes === 1
  }

  async deleteProgress(learnerId: string): Promise<void> {
    await this.db.prepare('DELETE FROM mission_progress WHERE learner_id = ?').bind(learnerId).run()
  }
}
