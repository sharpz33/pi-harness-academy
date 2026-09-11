import { describe, expect, it } from 'vitest'
import { app, missions } from './index'

describe('public academy shell', () => {
  it('renders all public missions', async () => {
    const response = await app.request('http://academy.local/')
    const body = await response.text()

    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toContain('text/html')
    expect(response.headers.get('content-security-policy')).toContain("default-src 'self'")
    expect(body).toContain('<title>Pi Harness Academy</title>')
    expect(body.match(/data-mission=/g)).toHaveLength(missions.length)
    expect(body).toContain('The Heist')
    expect(body).toContain('The Gauntlet')
  })

  it('serves the stylesheet with an explicit content type', async () => {
    const response = await app.request('http://academy.local/styles.css')

    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toContain('text/css')
    expect(await response.text()).toContain('--signal: #b8ff3d')
  })
})
