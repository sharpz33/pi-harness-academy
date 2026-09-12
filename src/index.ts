import { Hono } from 'hono'
import { clientScript } from './client'
import { missions } from './missions'
import { styles } from './styles'
import { renderHome, renderMission, renderNotFound } from './views'

const app = new Hono()

app.use('*', async (c, next) => {
  await next()
  c.header('Content-Security-Policy', "default-src 'self'; style-src 'self'; base-uri 'none'; frame-ancestors 'none'")
  c.header('Referrer-Policy', 'strict-origin-when-cross-origin')
  c.header('X-Content-Type-Options', 'nosniff')
  c.header('X-Frame-Options', 'DENY')
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

app.get('/', (c) => c.html(renderHome(missions)))

app.get('/missions/:slug', (c) => {
  const mission = missions.find(({ slug, availability }) => slug === c.req.param('slug') && availability === 'available')

  if (!mission) {
    return c.html(renderNotFound(), 404)
  }

  return c.html(renderMission(mission, missions))
})

export { app, missions }
export default app
