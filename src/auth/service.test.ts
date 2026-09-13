import { describe, expect, it, vi } from 'vitest'
import { AuthService } from './service'
import type { AuthMailer, AuthStore, LoginChallenge, LoginInspection } from './types'

const loginToken = 'a'.repeat(43)
const sessionToken = 'b'.repeat(43)
const now = 2_000_000

const makeStore = (overrides: Partial<AuthStore> = {}) => {
  let challenge: LoginChallenge | undefined
  let consumed = false
  let revokedLoginHash: string | undefined
  let revokedSessionHash: string | undefined

  const store: AuthStore = {
    createLoginChallenge: vi.fn(async (_email, input) => {
      challenge = input
      return 'created' as const
    }),
    inspectLoginToken: vi.fn(async (hash, at): Promise<LoginInspection | null> => {
      if (!challenge || consumed || revokedLoginHash === hash || challenge.tokenHash !== hash || challenge.expiresAt <= at) return null
      return { id: challenge.id, learnerId: challenge.learnerId, returnTo: challenge.returnTo }
    }),
    consumeLoginToken: vi.fn(async () => {
      if (consumed) return false
      consumed = true
      return true
    }),
    revokeLoginToken: vi.fn(async (hash) => {
      revokedLoginHash = hash
    }),
    findSession: vi.fn(async () => ({ learnerId: 'learner-1' })),
    revokeSession: vi.fn(async (hash) => {
      revokedSessionHash = hash
    }),
    ...overrides,
  }

  return {
    store,
    getChallenge: () => challenge,
    getRevokedLoginHash: () => revokedLoginHash,
    getRevokedSessionHash: () => revokedSessionHash,
  }
}

const makeMailer = (error?: Error) => {
  const sendLoginLink = vi.fn(async () => {
    if (error) throw error
  })
  return { mailer: { sendLoginLink } satisfies AuthMailer, sendLoginLink }
}

const makeService = (store: AuthStore, mailer: AuthMailer, currentTime = now) => {
  const tokens = [loginToken, sessionToken]
  let id = 0
  return new AuthService(
    store,
    mailer,
    { appOrigin: 'https://academy.example', from: 'login@academy.example' },
    {
      now: () => currentTime,
      createId: () => `id-${++id}`,
      createToken: () => tokens.shift() ?? 'c'.repeat(43),
      hash: async (token) => `hash:${token}`,
    },
  )
}

describe('passwordless auth service', () => {
  it('normalizes email and stores only a token hash', async () => {
    const state = makeStore()
    const mail = makeMailer()
    const service = makeService(state.store, mail.mailer)

    await expect(service.issueLogin('  LEARNER@Example.COM ', '/missions/the-heist')).resolves.toBe('sent')

    expect(state.store.createLoginChallenge).toHaveBeenCalledWith(
      'learner@example.com',
      expect.objectContaining({ tokenHash: `hash:${loginToken}`, returnTo: '/missions/the-heist' }),
      expect.any(Number),
    )
    expect(JSON.stringify(state.getChallenge())).not.toContain(`"${loginToken}"`)
    expect(mail.sendLoginLink).toHaveBeenCalledWith(
      expect.objectContaining({ to: 'learner@example.com', url: expect.stringContaining(`token=${loginToken}`), expiresInMinutes: 10 }),
    )
  })

  it('rejects invalid emails and unsafe return paths', async () => {
    const state = makeStore()
    const service = makeService(state.store, makeMailer().mailer)

    await expect(service.issueLogin('not-an-email')).resolves.toBe('invalid_email')
    await expect(service.issueLogin('learner@example.com', '//attacker.example')).resolves.toBe('sent')
    expect(state.getChallenge()?.returnTo).toBe('/')
  })

  it('reports rate limiting without sending mail', async () => {
    const state = makeStore({ createLoginChallenge: vi.fn(async () => 'rate_limited' as const) })
    const mail = makeMailer()
    const service = makeService(state.store, mail.mailer)

    await expect(service.issueLogin('learner@example.com')).resolves.toBe('rate_limited')
    expect(mail.sendLoginLink).not.toHaveBeenCalled()
  })

  it('revokes a challenge when delivery fails', async () => {
    const state = makeStore()
    const service = makeService(state.store, makeMailer(new Error('provider unavailable')).mailer)

    await expect(service.issueLogin('learner@example.com')).resolves.toBe('delivery_failed')
    expect(state.getRevokedLoginHash()).toBe(`hash:${loginToken}`)
  })

  it('keeps inspection side-effect free and rejects replay', async () => {
    const state = makeStore()
    const service = makeService(state.store, makeMailer().mailer)
    await service.issueLogin('learner@example.com')

    await expect(service.inspectLogin(loginToken)).resolves.toBe('valid')
    await expect(service.inspectLogin(loginToken)).resolves.toBe('valid')
    await expect(service.confirmLogin(loginToken)).resolves.toEqual({ status: 'authenticated', sessionToken, returnTo: '/' })
    await expect(service.confirmLogin(loginToken)).resolves.toEqual({ status: 'invalid_or_expired' })
  })

  it('fails closed for expired and malformed tokens', async () => {
    const state = makeStore()
    const service = makeService(state.store, makeMailer().mailer, now + 11 * 60 * 1000)

    await expect(service.inspectLogin('short')).resolves.toBe('invalid_or_expired')
    await expect(service.confirmLogin(loginToken)).resolves.toEqual({ status: 'invalid_or_expired' })
  })

  it('hashes session cookies for lookup and logout', async () => {
    const state = makeStore()
    const service = makeService(state.store, makeMailer().mailer)

    await expect(service.findSession(sessionToken)).resolves.toEqual({ learnerId: 'learner-1' })
    await service.logout(sessionToken)

    expect(state.store.findSession).toHaveBeenCalledWith(`hash:${sessionToken}`, now)
    expect(state.getRevokedSessionHash()).toBe(`hash:${sessionToken}`)
  })
})
