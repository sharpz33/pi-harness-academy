import { describe, expect, it, vi } from 'vitest'
import { hashToken } from '../auth/crypto'
import { missions } from '../missions'
import { JourneyService } from './service'
import type { JourneyStore } from './types'

const now = 1_800_000_000_000
const token = 't'.repeat(43)
const credential = 'c'.repeat(43)

const createStore = (): JourneyStore => ({
  createAuthorization: vi.fn(),
  approveAuthorization: vi.fn().mockResolvedValue(true),
  findApprovedAuthorization: vi.fn().mockResolvedValue({ id: 'authorization-1', learnerId: 'learner-1', profileLabel: 'Academy Pi' }),
  consumeAuthorization: vi.fn().mockResolvedValue(true),
  findDevice: vi.fn().mockResolvedValue({ id: 'device-1', learnerId: 'learner-1', profileLabel: 'Academy Pi' }),
  completeMission: vi.fn(),
  getJourney: vi.fn().mockResolvedValue({ completedSlugs: [], devices: [] }),
  revokeDevice: vi.fn().mockResolvedValue(true),
  deleteProgress: vi.fn(),
})

const createService = (store = createStore(), generatedTokens = [token, credential]) => {
  let index = 0
  return { store, service: new JourneyService(store, missions, () => now, () => generatedTokens[index++] ?? credential, () => 'ABCDEFGH') }
}

describe('verified journey service', () => {
  it('creates a short-lived device request without storing the raw code', async () => {
    const { store, service } = createService()
    const result = await service.requestDevice('https://academy.example')

    expect(result.deviceCode).toBe(token)
    expect(result.userCode).toBe('ABCDEFGH')
    expect(result.verificationUriComplete).toBe('https://academy.example/device?code=ABCDEFGH')
    expect(store.createAuthorization).toHaveBeenCalledWith(expect.objectContaining({
      deviceCodeHash: await hashToken(token),
      userCode: 'ABCDEFGH',
      expiresAt: now + 10 * 60 * 1000,
    }))
    expect(JSON.stringify(vi.mocked(store.createAuthorization).mock.calls)).not.toContain(token)
  })

  it('rejects malformed approval input before touching storage', async () => {
    const { store, service } = createService()

    expect(await service.approveDevice('bad', 'learner-1', 'x')).toBe(false)
    expect(store.approveAuthorization).not.toHaveBeenCalled()
  })

  it('exchanges an approved one-time code for a hashed scoped credential', async () => {
    const store = createStore()
    const { service } = createService(store, [credential])
    const result = await service.exchangeDevice(token)

    expect(result).toEqual({ status: 'authorized', credential, expiresIn: 90 * 24 * 60 * 60 })
    expect(store.findApprovedAuthorization).toHaveBeenCalledWith(await hashToken(token), now)
    expect(store.consumeAuthorization).toHaveBeenCalledWith(expect.objectContaining({
      credentialTokenHash: await hashToken(credential),
      expiresAt: now + 90 * 24 * 60 * 60 * 1000,
    }))
  })

  it('passes The Heist only with the exact allowlisted checks', async () => {
    const { store, service } = createService()
    const checks = missions[0].evidence?.map(({ id }) => id) ?? []
    const result = await service.submitCheckpoint(credential, 'the-heist', checks)

    expect(result).toEqual(expect.objectContaining({ status: 'passed', readiness: 8, nextMission: 'x-ray-vision' }))
    expect(store.completeMission).toHaveBeenCalledWith('learner-1', 'device-1', 'the-heist', now)
  })

  it('fails closed for missing or unknown checkpoint fields', async () => {
    const { store, service } = createService()
    const result = await service.submitCheckpoint(credential, 'the-heist', ['capability-executed', 'invented'])

    expect(result).toEqual(expect.objectContaining({ status: 'failed', readiness: 0 }))
    expect(result?.missingChecks).toContain('unknown_check')
    expect(store.completeMission).not.toHaveBeenCalled()
  })

  it('keeps later missions locked until the previous mission is complete', async () => {
    const { store, service } = createService()
    const checks = missions[1].evidence?.map(({ id }) => id) ?? []
    const result = await service.submitCheckpoint(credential, 'x-ray-vision', checks)

    expect(result).toEqual(expect.objectContaining({ status: 'locked', nextMission: 'the-heist' }))
    expect(store.completeMission).not.toHaveBeenCalled()
  })

  it('rejects an invalid device credential', async () => {
    const { store, service } = createService()

    expect(await service.submitCheckpoint('invalid', 'the-heist', [])).toBeNull()
    expect(store.findDevice).not.toHaveBeenCalled()
  })
})
