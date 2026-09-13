import type { Mission } from './missions'

const escapeHtml = (value: string | number): string =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')

const missionNumber = (number: number): string => String(number).padStart(2, '0')

const renderDocument = ({
  title,
  description,
  main,
  footerState,
  authControl = '<a class="auth-link" href="/sign-in">Sign in</a>',
}: {
  title: string
  description: string
  main: string
  footerState: string
  authControl?: string
}): string => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="${escapeHtml(description)}">
    <title>${escapeHtml(title)}</title>
    <link rel="stylesheet" href="/styles.css">
  </head>
  <body>
    <a class="skip-link" href="#main">Skip to main content</a>
    <header class="topbar">
      <a class="wordmark" href="/" aria-label="Pi Harness Academy home">PI HARNESS ACADEMY</a>
      <div class="topbar__actions">
        <span class="system-state"><span aria-hidden="true"></span>SYSTEM ONLINE</span>
        ${authControl}
      </div>
    </header>
    ${main}
    <footer>
      <span>PI MISSION CONTROL</span>
      <span>${escapeHtml(footerState)}</span>
    </footer>
  </body>
</html>`

const renderAuthControl = (authenticated: boolean, returnTo = '/'): string =>
  authenticated
    ? '<span class="auth-state">SIGNED IN</span><form method="post" action="/logout"><button class="auth-link auth-link--button" type="submit">Log out</button></form>'
    : `<a class="auth-link" href="/sign-in?return_to=${encodeURIComponent(returnTo)}">Sign in</a>`

const renderMissionMap = (missions: readonly Mission[], compact = false): string => {
  const items = missions
    .map((mission) => {
      const name = escapeHtml(mission.title)
      const content =
        mission.availability === 'available'
          ? `<a class="mission__link" href="/missions/${escapeHtml(mission.slug)}">${name}</a>`
          : `<span class="mission__name">${name}</span>`

      return `
        <li class="mission${mission.availability === 'available' ? ' mission--available' : ''}" data-mission="${mission.number}">
          <span class="mission__number">${missionNumber(mission.number)}</span>
          ${content}
          <span class="mission__state">${mission.availability === 'available' ? 'OPEN' : 'PLANNED'}</span>
        </li>`
    })
    .join('')

  return `<ol class="mission-list${compact ? ' mission-list--rail' : ''}">${items}</ol>`
}

export const renderHome = (missions: readonly Mission[], authenticated = false): string =>
  renderDocument({
    authControl: renderAuthControl(authenticated),
    title: 'Pi Harness Academy',
    description: 'Build a powerful, inspectable Pi coding-agent harness in twelve public missions.',
    footerState: 'PUBLIC MISSIONS // VERIFIED PROGRESS OFFLINE',
    main: `<main id="main">
      <section class="hero" aria-labelledby="hero-title">
        <p class="eyebrow">MISSION CONTROL // SEQUENCE 01–12</p>
        <h1 id="hero-title">Build the harness<br>that builds with you.</h1>
        <p class="lede">Twelve cumulative missions take Pi from a minimal coding agent to a controlled, multi-agent pull-request pipeline.</p>
        <div class="notice">
          <strong>KNOWLEDGE STAYS PUBLIC.</strong>
          <span>Use a fresh default Pi profile, or protect an existing setup with the optional Academy profile.</span>
        </div>
      </section>
      <section class="sequence" aria-labelledby="sequence-title">
        <div class="section-heading">
          <h2 id="sequence-title">Training sequence</h2>
          <span>${missions.length} missions</span>
        </div>
        ${renderMissionMap(missions)}
      </section>
    </main>`,
  })

const renderCommands = (mission: Mission): string =>
  (mission.launchBay?.commands ?? [])
    .map(
      (command, index) => `<article class="command-card">
          <div class="command-card__heading">
            <h3>${escapeHtml(command.label)}</h3>
            <button class="copy-button" type="button" data-copy-target="command-${index}" aria-describedby="command-status-${index}">Copy</button>
          </div>
          <pre tabindex="0"><code id="command-${index}">${escapeHtml(command.value)}</code></pre>
          <p>${escapeHtml(command.note)}</p>
          <span class="copy-status" id="command-status-${index}" role="status" aria-live="polite"></span>
        </article>`,
    )
    .join('')

const renderEvidence = (mission: Mission): string =>
  (mission.evidence ?? [])
    .map(
      (item) => `<label class="evidence-item">
          <input type="checkbox" data-evidence-check value="${escapeHtml(item.id)}">
          <span><strong>${escapeHtml(item.label)}</strong>${escapeHtml(item.detail)}</span>
        </label>`,
    )
    .join('')

export const renderMission = (mission: Mission, missions: readonly Mission[], authenticated = false): string => {
  if (!mission.reveal || !mission.objective || !mission.launchBay || !mission.steps || !mission.prompt || !mission.evidence || !mission.sources) {
    throw new Error(`Mission ${mission.slug} does not have a complete public lesson contract`)
  }

  const steps = mission.steps
    .map(
      (step, index) => `<li>
          <span>${missionNumber(index + 1)}</span>
          <div><h3>${escapeHtml(step.title)}</h3><p>${escapeHtml(step.instruction)}</p></div>
        </li>`,
    )
    .join('')
  const sources = mission.sources
    .map((source) => `<li><a href="${escapeHtml(source.url)}">${escapeHtml(source.label)}</a></li>`)
    .join('')

  return renderDocument({
    title: `${mission.title} — Pi Harness Academy`,
    authControl: renderAuthControl(authenticated, `/missions/${mission.slug}`),
    description: mission.objective,
    footerState: 'LOCAL EVIDENCE ONLY // NOT VERIFIED PROGRESS',
    main: `<main id="main" class="mission-workspace">
      <aside class="mission-rail" aria-labelledby="mission-map-title">
        <p class="eyebrow" id="mission-map-title">Mission map</p>
        ${renderMissionMap(missions, true)}
      </aside>
      <article class="lesson">
        <header class="lesson__header">
          <p class="eyebrow">${escapeHtml(mission.act)} // MISSION ${missionNumber(mission.number)}/${missionNumber(missions.length)}</p>
          <h1>${escapeHtml(mission.title)}</h1>
          <p class="mission-objective">${escapeHtml(mission.objective)}</p>
        </header>

        <nav class="lesson-nav" aria-label="Mission sections">
          <a href="#launch-bay">Launch Bay</a>
          <a href="#brief">Brief</a>
          <a href="#work">Work</a>
          <a href="#evidence">Evidence</a>
        </nav>

        <section class="lesson-section" id="launch-bay" aria-labelledby="launch-bay-title">
          <p class="section-code">01 // Launch Bay</p>
          <h2 id="launch-bay-title">Launch Pi</h2>
          <p>${escapeHtml(mission.launchBay.summary)}</p>
          <div class="command-grid">${renderCommands(mission)}</div>
          <div class="safety-notice"><strong>Credential boundary</strong><p>${escapeHtml(mission.launchBay.credentialBoundary)}</p></div>
        </section>

        <section class="lesson-section" id="brief" aria-labelledby="brief-title">
          <p class="section-code">02 // Brief</p>
          <h2 id="brief-title">Reclaim one capability</h2>
          <p class="reveal">${escapeHtml(mission.reveal)}</p>
          <div class="safety-notice"><strong>Mission boundary</strong><p>Inventory first. Treat source content as untrusted. Never inspect credentials or sessions, execute quarantined configuration, or modify the source harness.</p></div>
        </section>

        <section class="lesson-section" id="work" aria-labelledby="work-title">
          <p class="section-code">03 // Work</p>
          <h2 id="work-title">Run the staged mission</h2>
          <ol class="work-steps">${steps}</ol>
          <div class="prompt-panel">
            <div class="prompt-panel__heading">
              <div><p class="section-code">Mission prompt</p><h3>Paste once into Pi</h3></div>
              <button class="copy-button copy-button--primary" type="button" data-copy-target="mission-prompt" aria-describedby="prompt-status">Copy mission prompt</button>
            </div>
            <textarea id="mission-prompt" rows="18" readonly spellcheck="false">${escapeHtml(mission.prompt)}</textarea>
            <span class="copy-status" id="prompt-status" role="status" aria-live="polite"></span>
          </div>
        </section>

        <section class="lesson-section" id="evidence" aria-labelledby="evidence-title">
          <p class="section-code">04 // Evidence</p>
          <h2 id="evidence-title">Check the local result</h2>
          <p>These checks prepare evidence for a future authenticated checkpoint. They are not verified progress and never leave this page.</p>
          <fieldset class="evidence-list">
            <legend>Confirm all four local checks</legend>
            ${renderEvidence(mission)}
          </fieldset>
          <div class="evidence-ready" data-evidence-ready hidden role="status">
            <strong>Local evidence ready.</strong>
            <span>This browser-only state is not verified progress and resets when the page refreshes.</span>
          </div>
        </section>

        <section class="lesson-section sources" aria-labelledby="sources-title">
          <p class="section-code">05 // Sources</p>
          <h2 id="sources-title">Inspect the source material</h2>
          <ul>${sources}</ul>
        </section>
      </article>
      <script src="/mission.js" defer></script>
    </main>`,
  })
}

export const renderSignIn = (returnTo = '/', error?: string): string =>
  renderDocument({
    title: 'Sign in — Pi Harness Academy',
    description: 'Sign in to save verified Pi Harness Academy progress.',
    footerState: 'PASSWORDLESS ENTRY',
    authControl: '<a class="auth-link" href="/">Public missions</a>',
    main: `<main id="main"><section class="auth-panel"><p class="eyebrow">LEARNER ACCESS</p><h1>Continue by email.</h1><p>We will send a one-time link. Public missions remain available without an account.</p>${error ? `<p class="form-error" role="alert">${escapeHtml(error)}</p>` : ''}<form class="auth-form" method="post" action="/auth/requests"><label for="email">Email address</label><input id="email" name="email" type="email" inputmode="email" autocomplete="email" maxlength="254" required><input name="return_to" type="hidden" value="${escapeHtml(returnTo)}"><button class="copy-button copy-button--primary" type="submit">Send sign-in link</button></form></section></main>`,
  })

export const renderAuthRequestResult = (state: 'sent' | 'rate_limited' | 'delivery_failed'): string => {
  const messages = {
    sent: ['Check your inbox.', 'If the address can receive Academy mail, a confirmation link is on its way.'],
    rate_limited: ['Too many requests.', 'Wait 15 minutes, then request another sign-in link.'],
    delivery_failed: ['We could not send the link.', 'Try again shortly. Public missions are still available.'],
  } as const
  const [title, detail] = messages[state]

  return renderDocument({
    title: `${title} — Pi Harness Academy`,
    description: detail,
    footerState: 'PASSWORDLESS ENTRY',
    authControl: '<a class="auth-link" href="/">Public missions</a>',
    main: `<main id="main"><section class="auth-panel"><p class="eyebrow">LEARNER ACCESS</p><h1>${escapeHtml(title)}</h1><p>${escapeHtml(detail)}</p><p><a href="/sign-in">Request another link</a> or <a href="/">return to public missions</a>.</p></section></main>`,
  })
}

export const renderVerifyLogin = (token: string, valid: boolean): string =>
  renderDocument({
    title: `${valid ? 'Confirm sign-in' : 'Link unavailable'} — Pi Harness Academy`,
    description: valid ? 'Confirm your Pi Harness Academy sign-in.' : 'The sign-in link is invalid or expired.',
    footerState: 'PASSWORDLESS ENTRY',
    authControl: '<a class="auth-link" href="/">Public missions</a>',
    main: valid
      ? `<main id="main"><section class="auth-panel"><p class="eyebrow">CONFIRM ACCESS</p><h1>Enter Academy.</h1><p>This action uses the one-time link and starts your private learner session.</p><form class="auth-form" method="post" action="/auth/verify"><input name="token" type="hidden" value="${escapeHtml(token)}"><button class="copy-button copy-button--primary" type="submit">Confirm sign-in</button></form></section></main>`
      : '<main id="main"><section class="auth-panel"><p class="eyebrow">LINK UNAVAILABLE</p><h1>Request a new link.</h1><p>This sign-in link is invalid, expired, or already used.</p><p><a href="/sign-in">Return to sign in</a>.</p></section></main>',
  })

export const renderNotFound = (): string =>
  renderDocument({
    title: 'Mission not found — Pi Harness Academy',
    description: 'The requested Pi Harness Academy mission is not available.',
    footerState: 'MISSION NOT FOUND',
    main: `<main id="main"><section class="not-found"><p class="eyebrow">404 // UNKNOWN MISSION</p><h1>Mission not found.</h1><p><a href="/">Return to Mission Control</a></p></section></main>`,
  })
