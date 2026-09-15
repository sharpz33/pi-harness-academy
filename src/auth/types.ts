export const LOGIN_TOKEN_TTL_MS = 10 * 60 * 1000
export const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000
export const LOGIN_REQUEST_WINDOW_MS = 15 * 60 * 1000
export const LOGIN_REQUEST_LIMIT = 3
export const SESSION_COOKIE = '__Host-pha_session'

export type LoginChallenge = {
  id: string
  learnerId: string
  tokenHash: string
  returnTo: string
  createdAt: number
  expiresAt: number
}

export type LoginInspection = {
  id: string
  learnerId: string
  returnTo: string
}

export type SessionIdentity = {
  learnerId: string
}

export interface AuthStore {
  createLoginChallenge(email: string, challenge: LoginChallenge, windowStartsAt: number): Promise<'created' | 'rate_limited'>
  inspectLoginToken(tokenHash: string, now: number): Promise<LoginInspection | null>
  consumeLoginToken(input: {
    inspection: LoginInspection
    loginTokenHash: string
    sessionId: string
    sessionTokenHash: string
    now: number
    expiresAt: number
  }): Promise<boolean>
  revokeLoginToken(tokenHash: string, now: number): Promise<void>
  findSession(sessionTokenHash: string, now: number): Promise<SessionIdentity | null>
  revokeSession(sessionTokenHash: string, now: number): Promise<void>
}

export type LoginLinkMessage = {
  to: string
  url: string
  expiresInMinutes: number
  locale: 'en' | 'pl'
}

export interface AuthMailer {
  sendLoginLink(message: LoginLinkMessage): Promise<void>
}

export type IssueResult = 'sent' | 'invalid_email' | 'rate_limited' | 'delivery_failed'

export type ConfirmResult =
  | { status: 'authenticated'; sessionToken: string; returnTo: string }
  | { status: 'invalid_or_expired' }

export interface AuthApplication {
  issueLogin(email: string, returnTo?: string): Promise<IssueResult>
  inspectLogin(token: string): Promise<'valid' | 'invalid_or_expired'>
  confirmLogin(token: string): Promise<ConfirmResult>
  findSession(sessionToken: string): Promise<SessionIdentity | null>
  logout(sessionToken: string): Promise<void>
}
