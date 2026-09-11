import { Hono } from 'hono'
import { styles } from './styles'

const missions = [
  'The Heist',
  'X-Ray Vision',
  'Eyes & Hands',
  'The Time Machine',
  'Total Recall',
  'Hindsight',
  'The Forge',
  'Clone Protocol',
  'Council of Minds',
  'The Crew',
  'Escape the Terminal',
  'The Gauntlet',
] as const

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

app.get('/', (c) => {
  const missionItems = missions
    .map(
      (mission, index) => `
        <li class="mission" data-mission="${index + 1}">
          <span class="mission__number">${String(index + 1).padStart(2, '0')}</span>
          <span class="mission__name">${mission}</span>
          <span class="mission__state">PUBLIC</span>
        </li>`,
    )
    .join('')

  return c.html(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Build a powerful, inspectable Pi coding-agent harness in twelve public missions.">
    <title>Pi Harness Academy</title>
    <link rel="stylesheet" href="/styles.css">
  </head>
  <body>
    <a class="skip-link" href="#main">Skip to missions</a>
    <header class="topbar">
      <a class="wordmark" href="/" aria-label="Pi Harness Academy home">PI HARNESS ACADEMY</a>
      <span class="system-state"><span aria-hidden="true"></span>SYSTEM ONLINE</span>
    </header>
    <main id="main">
      <section class="hero" aria-labelledby="hero-title">
        <p class="eyebrow">MISSION CONTROL // SEQUENCE 01–12</p>
        <h1 id="hero-title">Build the harness<br>that builds with you.</h1>
        <p class="lede">Twelve cumulative missions take Pi from a minimal coding agent to a controlled, multi-agent pull-request pipeline.</p>
        <div class="notice">
          <strong>KNOWLEDGE STAYS PUBLIC.</strong>
          <span>Verified progress will use an isolated Academy profile—never your normal Pi configuration.</span>
        </div>
      </section>
      <section class="sequence" aria-labelledby="sequence-title">
        <div class="section-heading">
          <h2 id="sequence-title">Training sequence</h2>
          <span>${missions.length} missions</span>
        </div>
        <ol class="mission-list">${missionItems}</ol>
      </section>
    </main>
    <footer>
      <span>PI MISSION CONTROL</span>
      <span>PUBLIC SKELETON // AUTH OFFLINE</span>
    </footer>
  </body>
</html>`)
})

export { app, missions }
export default app
