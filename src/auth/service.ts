import { isEmailValid, normalizeEmail, safeReturnTo, type AuthConfig } from './config'
import { generateToken, hashToken, isTokenShapeValid } from './crypto'
import {
  LOGIN_REQUEST_WINDOW_MS,
  LOGIN_TOKEN_TTL_MS,
  SESSION_TTL_MS,
  type AuthApplication,
  type AuthMailer,
  type AuthStore,
  type ConfirmResult,
  type IssueResult,
  type SessionIdentity,
} from './types'

export type AuthServiceOptions = {
  now?: () => number
  createId?: () => string
  createToken?: () => string
  hash?: (token: string) => Promise<string>
}

export class AuthService implements AuthApplication {
  private readonly now: () => number
  private readonly createId: () => string
  private readonly createToken: () => string
  private readonly hash: (token: string) => Promise<string>

  constructor(
    private readonly store: AuthStore,
    private readonly mailer: AuthMailer,
    private readonly config: AuthConfig,
    options: AuthServiceOptions = {},
  ) {
    this.now = options.now ?? Date.now
    this.createId = options.createId ?? (() => crypto.randomUUID())
    this.createToken = options.createToken ?? generateToken
    this.hash = options.hash ?? hashToken
  }

  async issueLogin(emailInput: string, returnToInput?: string): Promise<IssueResult> {
    const email = normalizeEmail(emailInput)
    if (!isEmailValid(email)) {
      return 'invalid_email'
    }

    const now = this.now()
    const rawToken = this.createToken()
    const tokenHash = await this.hash(rawToken)
    const created = await this.store.createLoginChallenge(
      email,
      {
        id: this.createId(),
        learnerId: this.createId(),
        tokenHash,
        returnTo: safeReturnTo(returnToInput),
        createdAt: now,
        expiresAt: now + LOGIN_TOKEN_TTL_MS,
      },
      now - LOGIN_REQUEST_WINDOW_MS,
    )

    if (created === 'rate_limited') {
      return 'rate_limited'
    }

    const url = new URL('/auth/verify', this.config.appOrigin)
    url.searchParams.set('token', rawToken)

    try {
      await this.mailer.sendLoginLink({
        to: email,
        url: url.toString(),
        expiresInMinutes: LOGIN_TOKEN_TTL_MS / 60_000,
      })
    } catch {
      await this.store.revokeLoginToken(tokenHash, now)
      return 'delivery_failed'
    }

    return 'sent'
  }

  async inspectLogin(token: string): Promise<'valid' | 'invalid_or_expired'> {
    if (!isTokenShapeValid(token)) {
      return 'invalid_or_expired'
    }

    const inspection = await this.store.inspectLoginToken(await this.hash(token), this.now())
    return inspection ? 'valid' : 'invalid_or_expired'
  }

  async confirmLogin(token: string): Promise<ConfirmResult> {
    if (!isTokenShapeValid(token)) {
      return { status: 'invalid_or_expired' }
    }

    const now = this.now()
    const loginTokenHash = await this.hash(token)
    const inspection = await this.store.inspectLoginToken(loginTokenHash, now)
    if (!inspection) {
      return { status: 'invalid_or_expired' }
    }

    const sessionToken = this.createToken()
    const consumed = await this.store.consumeLoginToken({
      inspection,
      loginTokenHash,
      sessionId: this.createId(),
      sessionTokenHash: await this.hash(sessionToken),
      now,
      expiresAt: now + SESSION_TTL_MS,
    })

    return consumed
      ? { status: 'authenticated', sessionToken, returnTo: safeReturnTo(inspection.returnTo) }
      : { status: 'invalid_or_expired' }
  }

  async findSession(sessionToken: string): Promise<SessionIdentity | null> {
    if (!isTokenShapeValid(sessionToken)) {
      return null
    }

    return this.store.findSession(await this.hash(sessionToken), this.now())
  }

  async logout(sessionToken: string): Promise<void> {
    if (!isTokenShapeValid(sessionToken)) {
      return
    }

    await this.store.revokeSession(await this.hash(sessionToken), this.now())
  }
}
