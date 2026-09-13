import { Hono } from 'hono'
import { getCookie, setCookie, deleteCookie } from 'hono/cookie'
import { csrf } from 'hono/csrf'
import { createAuthApplication } from './auth/runtime'
import { safeReturnTo } from './auth/config'
import { SESSION_COOKIE, SESSION_TTL_MS, type AuthApplication } from './auth/types'
import { clientScript } from './client'
import { missions } from './missions'
import { styles } from './styles'
import { renderAuthRequestResult, renderHome, renderMission, renderNotFound, renderSignIn, renderVerifyLogin } from './views'

type AppEnv = { Bindings: CloudflareBindings }

const formValue = (value: unknown): string => (typeof value === 'string' ? value : '')

export const createApp = (authOverride?: AuthApplication) => {
  const app = new Hono<AppEnv>()
  const authFor = (bindings: CloudflareBindings): AuthApplication => authOverride ?? createAuthApplication(bindings)

  app.use('*', csrf())
  app.use('*', async (c, next) => {
    await next()
    c.header('Content-Security-Policy', "default-src 'self'; style-src 'self'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'")
    c.header('Referrer-Policy', c.req.path.startsWith('/auth/') || c.req.path === '/sign-in' ? 'no-referrer' : 'strict-origin-when-cross-origin')
    c.header('X-Content-Type-Options', 'nosniff')
    c.header('X-Frame-Options', 'DENY')

    if (c.req.path.startsWith('/auth/') || c.req.path === '/sign-in' || c.req.path === '/logout') {
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
