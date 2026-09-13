export const DEVICE_AUTH_TTL_MS = 10 * 60 * 1000
export const DEVICE_CREDENTIAL_TTL_MS = 90 * 24 * 60 * 60 * 1000

export type DeviceAuthorization = {
  id: string
  deviceCodeHash: string
  userCode: string
  createdAt: number
  expiresAt: number
}

export type ApprovedAuthorization = {
  id: string
  learnerId: string
  profileLabel: string
}

export type DeviceIdentity = {
  id: string
  learnerId: string
  profileLabel: string
}

export type CompletionProof = {
  publicId: string
  displayName: string
}

export type JourneyState = {
  completedSlugs: string[]
  devices: { id: string; profileLabel: string }[]
  proof: CompletionProof | null
}

export interface JourneyStore {
  createAuthorization(input: DeviceAuthorization): Promise<void>
  approveAuthorization(userCode: string, learnerId: string, profileLabel: string, now: number): Promise<boolean>
  findApprovedAuthorization(deviceCodeHash: string, now: number): Promise<ApprovedAuthorization | null>
  consumeAuthorization(input: {
    authorization: ApprovedAuthorization
    deviceCodeHash: string
    credentialId: string
    credentialTokenHash: string
    now: number
    expiresAt: number
  }): Promise<boolean>
  findDevice(tokenHash: string, now: number): Promise<DeviceIdentity | null>
  completeMission(learnerId: string, deviceId: string, missionSlug: string, now: number): Promise<void>
  getJourney(learnerId: string, now: number): Promise<JourneyState>
  revokeDevice(learnerId: string, deviceId: string, now: number): Promise<boolean>
  deleteProgress(learnerId: string, now: number): Promise<void>
  publishProof(learnerId: string, publicId: string, displayName: string, now: number): Promise<CompletionProof>
  findProof(publicId: string): Promise<CompletionProof | null>
  revokeProof(learnerId: string, now: number): Promise<void>
}

export type DeviceRequest = {
  deviceCode: string
  userCode: string
  verificationUri: string
  verificationUriComplete: string
  expiresIn: number
  interval: number
}

export interface JourneyApplication {
  requestDevice(origin: string): Promise<DeviceRequest>
  approveDevice(userCode: string, learnerId: string, profileLabel: string): Promise<boolean>
  exchangeDevice(deviceCode: string): Promise<
    | { status: 'authorized'; credential: string; expiresIn: number }
    | { status: 'pending' | 'invalid_or_expired' }
  >
  submitCheckpoint(deviceCredential: string, missionSlug: string, passedChecks: unknown): Promise<CheckpointResult | null>
  getJourney(learnerId: string): Promise<JourneyState>
  revokeDevice(learnerId: string, deviceId: string): Promise<boolean>
  deleteProgress(learnerId: string): Promise<void>
  publishProof(learnerId: string, displayName: string): Promise<CompletionProof | null>
  findProof(publicId: string): Promise<CompletionProof | null>
  revokeProof(learnerId: string): Promise<void>
}

export type CheckpointResult = {
  status: 'passed' | 'failed' | 'locked'
  readiness: number
  completedSlugs: string[]
  nextMission: string | null
  missingChecks?: string[]
}
