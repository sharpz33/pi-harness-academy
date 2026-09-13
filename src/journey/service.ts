import { generateToken, hashToken, isTokenShapeValid } from '../auth/crypto'
import type { Mission } from '../missions'
import {
  DEVICE_AUTH_TTL_MS,
  DEVICE_CREDENTIAL_TTL_MS,
  type CheckpointResult,
  type DeviceRequest,
  type JourneyState,
  type JourneyStore,
} from './types'

const USER_CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

const generateUserCode = (): string => {
  const bytes = new Uint8Array(8)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (byte) => USER_CODE_ALPHABET[byte % USER_CODE_ALPHABET.length]).join('')
}

const normalizeUserCode = (value: string): string => value.trim().toUpperCase().replaceAll('-', '')
const normalizeLabel = (value: string): string => value.trim().replace(/\s+/g, ' ').slice(0, 60)

export class JourneyService {
  constructor(
    private readonly store: JourneyStore,
    private readonly missions: readonly Mission[],
    private readonly now: () => number = Date.now,
    private readonly token: () => string = generateToken,
    private readonly userCode: () => string = generateUserCode,
  ) {}

  async requestDevice(origin: string): Promise<DeviceRequest> {
    const deviceCode = this.token()
    const userCode = this.userCode()
    const now = this.now()
    await this.store.createAuthorization({
      id: crypto.randomUUID(),
      deviceCodeHash: await hashToken(deviceCode),
      userCode,
      createdAt: now,
      expiresAt: now + DEVICE_AUTH_TTL_MS,
    })
    const verificationUri = `${origin}/device`
    return {
      deviceCode,
      userCode,
      verificationUri,
      verificationUriComplete: `${verificationUri}?code=${encodeURIComponent(userCode)}`,
      expiresIn: DEVICE_AUTH_TTL_MS / 1000,
      interval: 3,
    }
  }

  async approveDevice(userCode: string, learnerId: string, profileLabel: string): Promise<boolean> {
    const code = normalizeUserCode(userCode)
    const label = normalizeLabel(profileLabel)
    if (!/^[A-HJ-NP-Z2-9]{8}$/.test(code) || label.length < 2) return false
    return this.store.approveAuthorization(code, learnerId, label, this.now())
  }

  async exchangeDevice(deviceCode: string): Promise<
    | { status: 'authorized'; credential: string; expiresIn: number }
    | { status: 'pending' | 'invalid_or_expired' }
  > {
    if (!isTokenShapeValid(deviceCode)) return { status: 'invalid_or_expired' }
    const now = this.now()
    const deviceCodeHash = await hashToken(deviceCode)
    const authorization = await this.store.findApprovedAuthorization(deviceCodeHash, now)
    if (!authorization) return { status: 'pending' }

    const credential = this.token()
    const consumed = await this.store.consumeAuthorization({
      authorization,
      deviceCodeHash,
      credentialId: crypto.randomUUID(),
      credentialTokenHash: await hashToken(credential),
      now,
      expiresAt: now + DEVICE_CREDENTIAL_TTL_MS,
    })
    return consumed
      ? { status: 'authorized', credential, expiresIn: DEVICE_CREDENTIAL_TTL_MS / 1000 }
      : { status: 'invalid_or_expired' }
  }

  async authenticateDevice(credential: string) {
    if (!isTokenShapeValid(credential)) return null
    return this.store.findDevice(await hashToken(credential), this.now())
  }

  async submitCheckpoint(deviceCredential: string, missionSlug: string, passedChecks: unknown): Promise<CheckpointResult | null> {
    const device = await this.authenticateDevice(deviceCredential)
    if (!device) return null

    const mission = this.missions.find(({ slug }) => slug === missionSlug)
    if (!mission?.evidence || !Array.isArray(passedChecks) || !passedChecks.every((item) => typeof item === 'string')) {
      return this.result('failed', await this.store.getJourney(device.learnerId, this.now()), ['invalid_checkpoint'])
    }

    const expected = mission.evidence.map(({ id }) => id)
    const supplied = [...new Set(passedChecks)]
    const missingChecks = expected.filter((id) => !supplied.includes(id))
    const hasUnknown = supplied.some((id) => !expected.includes(id))
    const journey = await this.store.getJourney(device.learnerId, this.now())

    if (missingChecks.length > 0 || hasUnknown) {
      return this.result('failed', journey, hasUnknown ? [...missingChecks, 'unknown_check'] : missingChecks)
    }

    const previous = this.missions[mission.number - 2]
    if (previous && !journey.completedSlugs.includes(previous.slug)) {
      return this.result('locked', journey)
    }

    await this.store.completeMission(device.learnerId, device.id, mission.slug, this.now())
    const completedSlugs = journey.completedSlugs.includes(mission.slug)
      ? journey.completedSlugs
      : [...journey.completedSlugs, mission.slug]
    return this.result('passed', { ...journey, completedSlugs })
  }

  getJourney(learnerId: string): Promise<JourneyState> {
    return this.store.getJourney(learnerId, this.now())
  }

  revokeDevice(learnerId: string, deviceId: string): Promise<boolean> {
    return this.store.revokeDevice(learnerId, deviceId, this.now())
  }

  deleteProgress(learnerId: string): Promise<void> {
    return this.store.deleteProgress(learnerId, this.now())
  }

  async publishProof(learnerId: string, displayName: string) {
    const name = normalizeLabel(displayName)
    if (name.length < 2) return null
    const journey = await this.store.getJourney(learnerId, this.now())
    if (new Set(journey.completedSlugs).size !== this.missions.length) return null
    return this.store.publishProof(learnerId, this.token(), name, this.now())
  }

  findProof(publicId: string) {
    return isTokenShapeValid(publicId) ? this.store.findProof(publicId) : Promise.resolve(null)
  }

  revokeProof(learnerId: string): Promise<void> {
    return this.store.revokeProof(learnerId, this.now())
  }

  private result(status: CheckpointResult['status'], journey: JourneyState, missingChecks?: string[]): CheckpointResult {
    const completed = new Set(journey.completedSlugs)
    const nextMission = this.missions.find(({ slug }) => !completed.has(slug))?.slug ?? null
    return {
      status,
      readiness: Math.round((completed.size / this.missions.length) * 100),
      completedSlugs: [...completed],
      nextMission,
      ...(missingChecks ? { missingChecks } : {}),
    }
  }
}
