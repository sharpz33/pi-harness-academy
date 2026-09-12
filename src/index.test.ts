import { describe, expect, it } from 'vitest'
import { app, missions } from './index'

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

describe('The Heist mission workspace', () => {
  it('renders the complete lesson publicly', async () => {
    const response = await app.request('http://academy.local/missions/the-heist')
    const body = await response.text()

    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toContain('text/html')
    expect(response.headers.get('set-cookie')).toBeNull()
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
  })

  it('returns 404 for an unknown mission slug', async () => {
    const response = await app.request('http://academy.local/missions/unknown-mission')

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
    expect(body).not.toMatch(/localStorage|sessionStorage|indexedDB|document\.cookie/)
    expect(body).not.toMatch(/\bfetch\s*\(|XMLHttpRequest|sendBeacon|WebSocket/)
  })
})
