import { describe, expect, it, vi } from 'vitest'
import type { AuthApplication } from './auth/types'
import { SESSION_COOKIE } from './auth/types'
import { app, createApp, missions } from './index'

const expectSecurityHeaders = (response: { headers: { get(name: string): string | null } }) => {
  expect(response.headers.get('content-security-policy')).toContain("default-src 'self'")
  expect(response.headers.get('content-security-policy')).not.toContain("'unsafe-inline'")
  expect(response.headers.get('referrer-policy')).toBe('strict-origin-when-cross-origin')
  expect(response.headers.get('x-content-type-options')).toBe('nosniff')
  expect(response.headers.get('x-frame-options')).toBe('DENY')
}

describe('public academy shell', () => {
  it('links The Heist and renders all twelve public missions', async () => {
    const response = await app.request('http://academy.local/')
    const body = await response.text()

    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toContain('text/html')
    expectSecurityHeaders(response)
    expect(body).toContain('<title>Pi Harness Academy</title>')
    expect(body.match(/data-mission=/g)).toHaveLength(missions.length)
    expect(body).toContain('href="/missions/the-heist"')
    expect(body).toContain('The Gauntlet')
  })

  it('serves the stylesheet with an explicit content type', async () => {
    const response = await app.request('http://academy.local/styles.css')

    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toContain('text/css')
    expectSecurityHeaders(response)
    expect(await response.text()).toContain('--signal: #b8ff3d')
  })
})

describe('passwordless learner entry', () => {
  const createFakeAuth = (overrides: Partial<AuthApplication> = {}): AuthApplication => ({
    issueLogin: vi.fn(async () => 'sent' as const),
    inspectLogin: vi.fn(async () => 'valid' as const),
    confirmLogin: vi.fn(async () => ({ status: 'authenticated' as const, sessionToken: 's'.repeat(43), returnTo: '/' })),
    findSession: vi.fn(async () => ({ learnerId: 'learner-1' })),
    logout: vi.fn(async () => undefined),
    ...overrides,
  })

  const submit = (path: string, body: URLSearchParams, auth: AuthApplication, cookie?: string) =>
    createApp(auth).request(`https://academy.example${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Origin: 'https://academy.example',
        ...(cookie ? { Cookie: cookie } : {}),
      },
      body,
    })

  it('renders an uncached sign-in form without gating public lessons', async () => {
    const signIn = await createApp(createFakeAuth()).request('https://academy.example/sign-in?return_to=/missions/the-heist')
    const mission = await createApp(createFakeAuth()).request('https://academy.example/missions/the-heist')

    expect(signIn.status).toBe(200)
    expect(signIn.headers.get('cache-control')).toBe('no-store')
    expect(signIn.headers.get('referrer-policy')).toBe('no-referrer')
    expect(await signIn.text()).toContain('action="/auth/requests"')
    expect(mission.status).toBe(200)
  })

  it('requests a link and returns a neutral acknowledgement', async () => {
    const auth = createFakeAuth()
    const response = await submit(
      '/auth/requests',
      new URLSearchParams({ email: 'learner@example.com', return_to: '/missions/the-heist' }),
      auth,
    )

    expect(response.status).toBe(202)
    expect(response.headers.get('cache-control')).toBe('no-store')
    expect(auth.issueLogin).toHaveBeenCalledWith('learner@example.com', '/missions/the-heist')
    expect(await response.text()).toContain('Check your inbox.')
  })

  it.each([
    ['rate_limited', 429, 'Too many requests.'],
    ['delivery_failed', 503, 'We could not send the link.'],
  ] as const)('renders neutral %s feedback', async (result, expectedStatus, marker) => {
    const auth = createFakeAuth({ issueLogin: vi.fn(async () => result) })
    const response = await submit('/auth/requests', new URLSearchParams({ email: 'learner@example.com' }), auth)

    expect(response.status).toBe(expectedStatus)
    expect(await response.text()).toContain(marker)
  })

  it('does not consume a token on verification GET', async () => {
    const auth = createFakeAuth()
    const response = await createApp(auth).request(`https://academy.example/auth/verify?token=${'a'.repeat(43)}`)

    expect(response.status).toBe(200)
    expect(response.headers.get('referrer-policy')).toBe('no-referrer')
    expect(auth.inspectLogin).toHaveBeenCalledOnce()
    expect(auth.confirmLogin).not.toHaveBeenCalled()
  })

  it('confirms login with a hardened cookie and shows signed-in state', async () => {
    const auth = createFakeAuth()
    const response = await submit('/auth/verify', new URLSearchParams({ token: 'a'.repeat(43) }), auth)
    const cookie = response.headers.get('set-cookie') ?? ''
    const home = await createApp(auth).request('https://academy.example/', { headers: { Cookie: `${SESSION_COOKIE}=${'s'.repeat(43)}` } })

    expect(response.status).toBe(303)
    expect(response.headers.get('location')).toBe('/')
    expect(cookie).toContain(`${SESSION_COOKIE}=`)
    expect(cookie).toContain('HttpOnly')
    expect(cookie).toContain('Secure')
    expect(cookie).toContain('SameSite=Lax')
    expect(await home.text()).toContain('SIGNED IN')
  })

  it('shows authenticated controls on a mission page', async () => {
    const auth = createFakeAuth()
    const response = await createApp(auth).request('https://academy.example/missions/the-heist', {
      headers: { Cookie: `${SESSION_COOKIE}=${'s'.repeat(43)}` },
    })
    const body = await response.text()

    expect(response.status).toBe(200)
    expect(auth.findSession).toHaveBeenCalledWith('s'.repeat(43))
    expect(body).toContain('SIGNED IN')
    expect(body).toContain('action="/logout"')
  })

  it('revokes the session and clears the cookie on logout', async () => {
    const auth = createFakeAuth()
    const cookie = `${SESSION_COOKIE}=${'s'.repeat(43)}`
    const response = await submit('/logout', new URLSearchParams(), auth, cookie)

    expect(response.status).toBe(303)
    expect(auth.logout).toHaveBeenCalledWith('s'.repeat(43))
    expect(response.headers.get('set-cookie')).toContain('Max-Age=0')
  })

  it('rejects cross-origin form posts', async () => {
    const auth = createFakeAuth()
    const response = await createApp(auth).request('https://academy.example/logout', {
      method: 'POST',
      headers: { Origin: 'https://attacker.example', 'Content-Type': 'application/x-www-form-urlencoded' },
    })

    expect(response.status).toBe(403)
    expect(auth.logout).not.toHaveBeenCalled()
  })
})

describe('The Heist mission workspace', () => {
  it('renders the complete lesson publicly', async () => {
    const response = await app.request('http://academy.local/missions/the-heist')
    const body = await response.text()

    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toContain('text/html')
    expect(response.headers.get('set-cookie')).toBeNull()
    expect(response.headers.get('www-authenticate')).toBeNull()
    expectSecurityHeaders(response)
    expect(body).toContain('<title>The Heist — Pi Harness Academy</title>')
    expect(body).toContain('01 // Launch Bay')
    expect(body).toContain('Copy mission prompt')
    expect(body).toContain('STOP 1')
    expect(body).toContain('STOP 2')
    expect(body).toContain('Pi quick start')
    expect(body.match(/data-evidence-check/g)).toHaveLength(4)
    expect(body).toContain('not verified progress')
    expect(body).toContain('<script src="/mission.js" defer></script>')
    expect(body).toContain('href="/sign-in?return_to=%2Fmissions%2Fthe-heist"')
  })

  it.each(['unknown-mission', 'x-ray-vision'])('returns 404 for unavailable mission %s', async (slug) => {
    const response = await app.request(`http://academy.local/missions/${slug}`)

    expect(response.status).toBe(404)
    expect(response.headers.get('content-type')).toContain('text/html')
    expectSecurityHeaders(response)
    expect(await response.text()).toContain('Mission not found.')
  })

  it('serves an ephemeral same-origin client script', async () => {
    const response = await app.request('http://academy.local/mission.js')
    const body = await response.text()

    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toContain('text/javascript')
    expect(response.headers.get('cache-control')).toBe('public, max-age=3600')
    expectSecurityHeaders(response)
    expect(body).toContain("navigator.clipboard.writeText")
    expect(body).toContain("evidenceChecks.length === 4")
    expect(body).toContain("evidenceReady.hidden = !isReady")
    expect(body).toContain("Text selected—copy it manually.")
    expect(body).not.toMatch(/localStorage|sessionStorage|indexedDB|document\.cookie/)
    expect(body).not.toMatch(/\bfetch\s*\(|XMLHttpRequest|sendBeacon|WebSocket/)
  })
})
