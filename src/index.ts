import { Hono } from 'hono'
import { getCookie, setCookie, deleteCookie } from 'hono/cookie'
import { csrf } from 'hono/csrf'
import { createAuthApplication } from './auth/runtime'
import { safeReturnTo } from './auth/config'
import { SESSION_COOKIE, SESSION_TTL_MS, type AuthApplication } from './auth/types'
import { clientScript } from './client'
import { createJourneyService } from './journey/runtime'
import type { JourneyApplication } from './journey/types'
import { missions } from './missions'
import { styles } from './styles'
import { renderAuthRequestResult, renderDeleteProgress, renderDeviceApproval, renderHome, renderJourney, renderMission, renderNotFound, renderSignIn, renderVerifyLogin } from './views'

type AppEnv = { Bindings: CloudflareBindings }

const formValue = (value: unknown): string => (typeof value === 'string' ? value : '')

export const createApp = (authOverride?: AuthApplication, journeyOverride?: JourneyApplication) => {
  const app = new Hono<AppEnv>()
  const authFor = (bindings: CloudflareBindings): AuthApplication => authOverride ?? createAuthApplication(bindings)
  const journeyFor = (bindings: CloudflareBindings): JourneyApplication => journeyOverride ?? createJourneyService(bindings)

  app.use('*', csrf())
  app.use('*', async (c, next) => {
    await next()
    c.header('Content-Security-Policy', "default-src 'self'; style-src 'self'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'")
    c.header('Referrer-Policy', c.req.path.startsWith('/auth/') || c.req.path.startsWith('/api/') || c.req.path.startsWith('/device') || c.req.path.startsWith('/journey') || c.req.path === '/sign-in' ? 'no-referrer' : 'strict-origin-when-cross-origin')
    c.header('X-Content-Type-Options', 'nosniff')
    c.header('X-Frame-Options', 'DENY')

    if (c.req.path.startsWith('/auth/') || c.req.path.startsWith('/api/') || c.req.path.startsWith('/device') || c.req.path.startsWith('/journey') || c.req.path === '/sign-in' || c.req.path === '/logout') {
      c.header('Cache-Control', 'no-store')
    }
  })

  app.get('/styles.css', (c) => {
    return c.body(styles, 200, {
      'Cache-Control': 'public, max-age=3600',
      'Content-Type': 'text/css; charset=UTF-8',
    })
  })

  app.get('/mission.js', (c) => {
    return c.body(clientScript, 200, {
      'Cache-Control': 'public, max-age=3600',
      'Content-Type': 'text/javascript; charset=UTF-8',
    })
  })

  app.get('/', async (c) => {
    const sessionToken = getCookie(c, SESSION_COOKIE)
    const authenticated = sessionToken ? Boolean(await authFor(c.env).findSession(sessionToken)) : false
    return c.html(renderHome(missions, authenticated))
  })

  app.get('/sign-in', (c) => c.html(renderSignIn(safeReturnTo(c.req.query('return_to')))))

  app.post('/auth/requests', async (c) => {
    const body = await c.req.parseBody()
    const email = formValue(body.email)
    const returnTo = formValue(body.return_to)
    const result = await authFor(c.env).issueLogin(email, returnTo)

    if (result === 'invalid_email') {
      return c.html(renderSignIn(safeReturnTo(returnTo), 'Enter a valid email address.'), 400)
    }

    const status = result === 'delivery_failed' ? 503 : result === 'rate_limited' ? 429 : 202
    return c.html(renderAuthRequestResult(result), status)
  })

  app.get('/auth/verify', async (c) => {
    const token = c.req.query('token') ?? ''
    const valid = (await authFor(c.env).inspectLogin(token)) === 'valid'
    return c.html(renderVerifyLogin(token, valid), valid ? 200 : 400)
  })

  app.post('/auth/verify', async (c) => {
    const body = await c.req.parseBody()
    const result = await authFor(c.env).confirmLogin(formValue(body.token))
    if (result.status === 'invalid_or_expired') {
      return c.html(renderVerifyLogin('', false), 400)
    }

    setCookie(c, SESSION_COOKIE, result.sessionToken, {
      secure: true,
      httpOnly: true,
      sameSite: 'Lax',
      path: '/',
      maxAge: SESSION_TTL_MS / 1000,
    })
    return c.redirect(result.returnTo, 303)
  })

  app.post('/logout', async (c) => {
    const sessionToken = getCookie(c, SESSION_COOKIE)
    if (sessionToken) {
      await authFor(c.env).logout(sessionToken)
    }
    deleteCookie(c, SESSION_COOKIE, { path: '/', secure: true })
    return c.redirect('/', 303)
  })

  app.post('/api/device-authorizations', async (c) => {
    const origin = c.env?.APP_ORIGIN ?? new URL(c.req.url).origin
    return c.json(await journeyFor(c.env).requestDevice(origin), 201)
  })

  app.post('/api/device-authorizations/token', async (c) => {
    const body: { deviceCode?: unknown } = await c.req.json().catch(() => ({}))
    const result = await journeyFor(c.env).exchangeDevice(typeof body.deviceCode === 'string' ? body.deviceCode : '')
    return c.json(result, result.status === 'authorized' ? 200 : result.status === 'pending' ? 202 : 400)
  })

  app.get('/device', async (c) => {
    const code = c.req.query('code') ?? ''
    const sessionToken = getCookie(c, SESSION_COOKIE)
    const session = sessionToken ? await authFor(c.env).findSession(sessionToken) : null
    if (!session) return c.redirect(`/sign-in?return_to=${encodeURIComponent(`/device?code=${code}`)}`, 303)
    return c.html(renderDeviceApproval(code))
  })

  app.post('/device/approve', async (c) => {
    const sessionToken = getCookie(c, SESSION_COOKIE)
    const session = sessionToken ? await authFor(c.env).findSession(sessionToken) : null
    if (!session) return c.redirect('/sign-in?return_to=%2Fdevice', 303)
    const body = await c.req.parseBody()
    const code = formValue(body.user_code)
    const approved = await journeyFor(c.env).approveDevice(code, session.learnerId, formValue(body.profile_label))
    return c.html(renderDeviceApproval(code, approved, approved ? undefined : 'The code is invalid, expired, or already used.'), approved ? 200 : 400)
  })

  app.post('/api/checkpoints/:slug', async (c) => {
    const authorization = c.req.header('Authorization') ?? ''
    const credential = authorization.startsWith('Bearer ') ? authorization.slice(7) : ''
    const body: { passedChecks?: unknown } = await c.req.json().catch(() => ({}))
    const result = await journeyFor(c.env).submitCheckpoint(credential, c.req.param('slug'), body.passedChecks)
    return result ? c.json(result, result.status === 'passed' ? 200 : result.status === 'locked' ? 409 : 422) : c.json({ error: 'unauthorized' }, 401)
  })

  app.get('/journey', async (c) => {
    const sessionToken = getCookie(c, SESSION_COOKIE)
    const session = sessionToken ? await authFor(c.env).findSession(sessionToken) : null
    if (!session) return c.redirect('/sign-in?return_to=%2Fjourney', 303)
    return c.html(renderJourney(await journeyFor(c.env).getJourney(session.learnerId), missions))
  })

  app.post('/journey/devices/revoke', async (c) => {
    const sessionToken = getCookie(c, SESSION_COOKIE)
    const session = sessionToken ? await authFor(c.env).findSession(sessionToken) : null
    if (!session) return c.redirect('/sign-in?return_to=%2Fjourney', 303)
    const body = await c.req.parseBody()
    await journeyFor(c.env).revokeDevice(session.learnerId, formValue(body.device_id))
    return c.redirect('/journey', 303)
  })

  app.get('/journey/delete', async (c) => {
    const sessionToken = getCookie(c, SESSION_COOKIE)
    const session = sessionToken ? await authFor(c.env).findSession(sessionToken) : null
    if (!session) return c.redirect('/sign-in?return_to=%2Fjourney%2Fdelete', 303)
    return c.html(renderDeleteProgress())
  })

  app.post('/journey/delete', async (c) => {
    const sessionToken = getCookie(c, SESSION_COOKIE)
    const session = sessionToken ? await authFor(c.env).findSession(sessionToken) : null
    if (!session) return c.redirect('/sign-in?return_to=%2Fjourney%2Fdelete', 303)
    await journeyFor(c.env).deleteProgress(session.learnerId)
    return c.redirect('/journey', 303)
  })

  app.get('/missions/:slug', async (c) => {
    const mission = missions.find(({ slug, availability }) => slug === c.req.param('slug') && availability === 'available')

    if (!mission) {
      return c.html(renderNotFound(), 404)
    }

    const sessionToken = getCookie(c, SESSION_COOKIE)
    const authenticated = sessionToken ? Boolean(await authFor(c.env).findSession(sessionToken)) : false
    return c.html(renderMission(mission, missions, authenticated))
  })

  return app
}

const app = createApp()

export { app, missions }
export default app
