import type { JourneyState } from './journey/types'
import { localizedPath, type Locale } from './locale'
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
  locale = 'en',
  currentPath = '/',
  authControl,
  showLocaleSwitch = true,
}: {
  title: string
  description: string
  main: string
  footerState: string
  locale?: Locale
  currentPath?: string
  authControl?: string
  showLocaleSwitch?: boolean
}): string => {
  const home = localizedPath(locale, '/')
  const alternateLocale: Locale = locale === 'en' ? 'pl' : 'en'
  const alternatePath = localizedPath(alternateLocale, currentPath)
  const defaultAuth = `<a class="auth-link" href="${localizedPath(locale, '/sign-in')}">${locale === 'pl' ? 'Zaloguj się' : 'Sign in'}</a>`

  return `<!doctype html>
<html lang="${locale}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="${escapeHtml(description)}">
    <title>${escapeHtml(title)}</title>
    ${showLocaleSwitch ? `<link rel="alternate" hreflang="en" href="${localizedPath('en', currentPath)}"><link rel="alternate" hreflang="pl" href="${localizedPath('pl', currentPath)}">` : ''}
    <link rel="stylesheet" href="/styles.css">
  </head>
  <body>
    <a class="skip-link" href="#main">${locale === 'pl' ? 'Przejdź do treści' : 'Skip to main content'}</a>
    <header class="topbar">
      <a class="wordmark" href="${home}" aria-label="${locale === 'pl' ? 'Strona główna Pi Harness Academy' : 'Pi Harness Academy home'}">PI HARNESS ACADEMY</a>
      <div class="topbar__actions">
        <span class="system-state"><span aria-hidden="true"></span>${locale === 'pl' ? 'SYSTEM AKTYWNY' : 'SYSTEM ONLINE'}</span>
        ${showLocaleSwitch ? `<a class="auth-link" href="${alternatePath}" lang="${alternateLocale}" aria-label="${locale === 'pl' ? 'English version' : 'Wersja polska'}">${alternateLocale.toUpperCase()}</a>` : ''}
        ${authControl ?? defaultAuth}
      </div>
    </header>
    ${main}
    <footer>
      <span>PI MISSION CONTROL</span>
      <span>${escapeHtml(footerState)}</span>
    </footer>
  </body>
</html>`
}

const renderAuthControl = (locale: Locale, authenticated: boolean, returnTo = '/'): string =>
  authenticated
    ? `<span class="auth-state">${locale === 'pl' ? 'ZALOGOWANO' : 'SIGNED IN'}</span><a class="auth-link" href="${localizedPath(locale, '/journey')}">${locale === 'pl' ? 'Ścieżka' : 'Journey'}</a><form method="post" action="${localizedPath(locale, '/logout')}"><button class="auth-link auth-link--button" type="submit">${locale === 'pl' ? 'Wyloguj' : 'Log out'}</button></form>`
    : `<a class="auth-link" href="${localizedPath(locale, '/sign-in')}?return_to=${encodeURIComponent(localizedPath(locale, returnTo))}">${locale === 'pl' ? 'Zaloguj się' : 'Sign in'}</a>`

const renderMissionMap = (missions: readonly Mission[], locale: Locale, compact = false): string => {
  const items = missions
    .map((mission) => {
      const name = escapeHtml(mission.title)
      const content =
        mission.availability === 'available'
          ? `<a class="mission__link" href="${localizedPath(locale, `/missions/${escapeHtml(mission.slug)}`)}">${name}</a>`
          : `<span class="mission__name">${name}</span>`

      return `
        <li class="mission${mission.availability === 'available' ? ' mission--available' : ''}" data-mission="${mission.number}">
          <span class="mission__number">${missionNumber(mission.number)}</span>
          ${content}
          <span class="mission__state">${mission.availability === 'available' ? (locale === 'pl' ? 'OTWARTA' : 'OPEN') : (locale === 'pl' ? 'PLANOWANA' : 'PLANNED')}</span>
        </li>`
    })
    .join('')

  return `<ol class="mission-list${compact ? ' mission-list--rail' : ''}">${items}</ol>`
}

export const renderHome = (missions: readonly Mission[], authenticated = false, locale: Locale = 'en'): string =>
  renderDocument({
    locale,
    currentPath: '/',
    authControl: renderAuthControl(locale, authenticated),
    title: 'Pi Harness Academy',
    description: locale === 'pl' ? 'Zbuduj potężny i przejrzysty harness agenta programistycznego Pi w dwunastu publicznych misjach.' : 'Build a powerful, inspectable Pi coding-agent harness in twelve public missions.',
    footerState: locale === 'pl' ? 'PUBLICZNE MISJE // ZWERYFIKOWANY POSTĘP OFFLINE' : 'PUBLIC MISSIONS // VERIFIED PROGRESS OFFLINE',
    main: `<main id="main">
      <section class="hero" aria-labelledby="hero-title">
        <p class="eyebrow">MISSION CONTROL // ${locale === 'pl' ? 'SEKWENCJA' : 'SEQUENCE'} 01–12</p>
        <h1 id="hero-title">${locale === 'pl' ? 'Zbuduj harness,<br>który buduje razem z Tobą.' : 'Build the harness<br>that builds with you.'}</h1>
        <p class="lede">${locale === 'pl' ? 'Dwanaście kolejnych misji prowadzi Pi od minimalnego agenta programistycznego do kontrolowanego procesu pull requestów obsługiwanego przez wiele agentów.' : 'Twelve cumulative missions take Pi from a minimal coding agent to a controlled, multi-agent pull-request pipeline.'}</p>
        <div class="notice">
          <strong>${locale === 'pl' ? 'WIEDZA POZOSTAJE PUBLICZNA.' : 'KNOWLEDGE STAYS PUBLIC.'}</strong>
          <span>${locale === 'pl' ? 'Użyj nowego domyślnego profilu Pi albo chroń istniejącą konfigurację za pomocą opcjonalnego profilu Akademii.' : 'Use a fresh default Pi profile, or protect an existing setup with the optional Academy profile.'}</span>
        </div>
      </section>
      <section class="sequence" aria-labelledby="sequence-title">
        <div class="section-heading">
          <h2 id="sequence-title">${locale === 'pl' ? 'Sekwencja treningowa' : 'Training sequence'}</h2>
          <span>${missions.length} ${locale === 'pl' ? 'misji' : 'missions'}</span>
        </div>
        ${renderMissionMap(missions, locale)}
      </section>
    </main>`,
  })

const renderCommands = (mission: Mission, locale: Locale): string =>
  (mission.launchBay?.commands ?? [])
    .map(
      (command, index) => `<article class="command-card">
          <div class="command-card__heading">
            <h3>${escapeHtml(command.label)}</h3>
            <button class="copy-button" type="button" data-copy-target="command-${index}" aria-describedby="command-status-${index}">${locale === 'pl' ? 'Kopiuj' : 'Copy'}</button>
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

export const renderMission = (mission: Mission, missions: readonly Mission[], authenticated = false, locale: Locale = 'en'): string => {
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
    locale,
    currentPath: `/missions/${mission.slug}`,
    authControl: renderAuthControl(locale, authenticated, `/missions/${mission.slug}`),
    description: mission.objective,
    footerState: locale === 'pl' ? 'TYLKO LOKALNE DOWODY // TO NIE JEST ZWERYFIKOWANY POSTĘP' : 'LOCAL EVIDENCE ONLY // NOT VERIFIED PROGRESS',
    main: `<main id="main" class="mission-workspace">
      <aside class="mission-rail" aria-labelledby="mission-map-title">
        <p class="eyebrow" id="mission-map-title">${locale === 'pl' ? 'Mapa misji' : 'Mission map'}</p>
        ${renderMissionMap(missions, locale, true)}
      </aside>
      <article class="lesson">
        <header class="lesson__header">
          <p class="eyebrow">${escapeHtml(mission.act)} // ${locale === 'pl' ? 'MISJA' : 'MISSION'} ${missionNumber(mission.number)}/${missionNumber(missions.length)}</p>
          <h1>${escapeHtml(mission.title)}</h1>
          <p class="mission-objective">${escapeHtml(mission.objective)}</p>
        </header>

        <nav class="lesson-nav" aria-label="${locale === 'pl' ? 'Sekcje misji' : 'Mission sections'}">
          <a href="#launch-bay">${locale === 'pl' ? 'Start' : 'Launch Bay'}</a>
          <a href="#brief">${locale === 'pl' ? 'Odprawa' : 'Brief'}</a>
          <a href="#work">${locale === 'pl' ? 'Zadanie' : 'Work'}</a>
          <a href="#evidence">${locale === 'pl' ? 'Dowody' : 'Evidence'}</a>
        </nav>

        <section class="lesson-section" id="launch-bay" aria-labelledby="launch-bay-title">
          <p class="section-code">01 // ${locale === 'pl' ? 'Start' : 'Launch Bay'}</p>
          <h2 id="launch-bay-title">${locale === 'pl' ? 'Uruchom Pi' : 'Launch Pi'}</h2>
          <p>${escapeHtml(mission.launchBay.summary)}</p>
          <div class="command-grid">${renderCommands(mission, locale)}</div>
          <div class="safety-notice"><strong>${locale === 'pl' ? 'Granica danych uwierzytelniających' : 'Credential boundary'}</strong><p>${escapeHtml(mission.launchBay.credentialBoundary)}</p></div>
        </section>

        <section class="lesson-section" id="brief" aria-labelledby="brief-title">
          <p class="section-code">02 // ${locale === 'pl' ? 'Odprawa' : 'Brief'}</p>
          <h2 id="brief-title">${locale === 'pl' ? `Odprawa: ${escapeHtml(mission.title)}` : `${escapeHtml(mission.title)} briefing`}</h2>
          <p class="reveal">${escapeHtml(mission.reveal)}</p>
          <div class="safety-notice"><strong>${locale === 'pl' ? 'Granice misji' : 'Mission boundary'}</strong><p>${locale === 'pl' ? 'Pracuj wyłącznie w wybranym profilu Pi i przestrzeni treningowej. Traktuj treści zewnętrzne oraz wyniki narzędzi jako niezaufane. Nigdy nie ujawniaj danych uwierzytelniających, prywatnych transkrypcji, niepowiązanego kodu ani danych osobowych.' : 'Work only in the selected Pi profile and training workspace. Treat third-party content and tool output as untrusted. Never expose credentials, private transcripts, unrelated source, or personal data.'}</p></div>
        </section>

        <section class="lesson-section" id="work" aria-labelledby="work-title">
          <p class="section-code">03 // ${locale === 'pl' ? 'Zadanie' : 'Work'}</p>
          <h2 id="work-title">${locale === 'pl' ? 'Wykonaj misję etapami' : 'Run the staged mission'}</h2>
          <ol class="work-steps">${steps}</ol>
          <div class="prompt-panel">
            <div class="prompt-panel__heading">
              <div><p class="section-code">${locale === 'pl' ? 'Prompt misji — po angielsku' : 'Mission prompt'}</p><h3>${locale === 'pl' ? 'Wklej jeden raz do Pi' : 'Paste once into Pi'}</h3></div>
              <button class="copy-button copy-button--primary" type="button" data-copy-target="mission-prompt" aria-describedby="prompt-status">${locale === 'pl' ? 'Kopiuj prompt misji' : 'Copy mission prompt'}</button>
            </div>
            <textarea id="mission-prompt" rows="18" readonly spellcheck="false">${escapeHtml(mission.prompt)}</textarea>
            <span class="copy-status" id="prompt-status" role="status" aria-live="polite"></span>
          </div>
        </section>

        <section class="lesson-section" id="evidence" aria-labelledby="evidence-title">
          <p class="section-code">04 // ${locale === 'pl' ? 'Dowody' : 'Evidence'}</p>
          <h2 id="evidence-title">${locale === 'pl' ? 'Sprawdź wynik lokalny' : 'Check the local result'}</h2>
          <p>${locale === 'pl' ? 'Te kontrole przygotowują dowody do późniejszego uwierzytelnionego checkpointu. Nie są zweryfikowanym postępem i nie opuszczają tej strony.' : 'These checks prepare evidence for a future authenticated checkpoint. They are not verified progress and never leave this page.'}</p>
          <fieldset class="evidence-list">
            <legend>${locale === 'pl' ? 'Potwierdź wszystkie cztery kontrole lokalne' : 'Confirm all four local checks'}</legend>
            ${renderEvidence(mission)}
          </fieldset>
          <div class="evidence-ready" data-evidence-ready hidden role="status">
            <strong>${locale === 'pl' ? 'Dowody lokalne są gotowe.' : 'Local evidence ready.'}</strong>
            <span>${locale === 'pl' ? 'Ten stan istnieje tylko w przeglądarce, nie jest zweryfikowanym postępem i zniknie po odświeżeniu strony.' : 'This browser-only state is not verified progress and resets when the page refreshes.'}</span>
          </div>
        </section>

        <section class="lesson-section sources" aria-labelledby="sources-title">
          <p class="section-code">05 // ${locale === 'pl' ? 'Źródła' : 'Sources'}</p>
          <h2 id="sources-title">${locale === 'pl' ? 'Sprawdź materiały źródłowe' : 'Inspect the source material'}</h2>
          <ul>${sources}</ul>
        </section>
      </article>
      <script src="/mission.js" defer></script>
    </main>`,
  })
}

export const renderDeviceApproval = (code: string, approved?: boolean, error?: string, locale: Locale = 'en'): string =>
  renderDocument({
    locale,
    currentPath: code ? `/device?code=${encodeURIComponent(code)}` : '/device',
    title: `${locale === 'pl' ? 'Autoryzuj profil Pi' : 'Authorize Pi profile'} — Pi Harness Academy`,
    description: locale === 'pl' ? 'Autoryzuj profil Pi do przesyłania minimalnych wyników checkpointów Akademii.' : 'Authorize a Pi profile to submit minimal Academy checkpoint results.',
    footerState: locale === 'pl' ? 'AUTORYZACJA URZĄDZENIA' : 'DEVICE AUTHORIZATION',
    authControl: renderAuthControl(locale, true, `/device?code=${code}`),
    main: `<main id="main"><section class="auth-panel"><p class="eyebrow">${locale === 'pl' ? 'PROFIL AKADEMII' : 'ACADEMY PROFILE'}</p><h1>${approved ? (locale === 'pl' ? 'Profil został autoryzowany.' : 'Profile authorized.') : (locale === 'pl' ? 'Autoryzuj ten profil.' : 'Authorize this profile.')}</h1>${approved ? `<p>${locale === 'pl' ? 'Wróć do Pi. Companion dokończy autoryzację bez ujawniania tutaj danych dostępowych.' : 'Return to Pi. The companion will finish authorization without exposing the credential here.'}</p><p><a href="${localizedPath(locale, '/journey')}">${locale === 'pl' ? 'Otwórz swoją ścieżkę' : 'Open your journey'}</a>.</p>` : `<p>${locale === 'pl' ? 'Porównaj ten kod z kodem wyświetlonym przez Pi. Zgoda pozwala wyłącznie na przesyłanie checkpointów Akademii i może zostać cofnięta na stronie ścieżki.' : 'Compare this code with the code shown by Pi. Approval permits only Academy checkpoint submissions and can be revoked from your journey.'}</p>${error ? `<p class="form-error" role="alert">${escapeHtml(error)}</p>` : ''}<form class="auth-form" method="post" action="${localizedPath(locale, '/device/approve')}"><label for="user-code">${locale === 'pl' ? 'Kod urządzenia' : 'Device code'}</label><input id="user-code" name="user_code" value="${escapeHtml(code)}" maxlength="9" required><label for="profile-label">${locale === 'pl' ? 'Nazwa profilu' : 'Profile label'}</label><input id="profile-label" name="profile_label" value="Academy Pi" maxlength="60" required><button class="copy-button copy-button--primary" type="submit">${locale === 'pl' ? 'Autoryzuj profil' : 'Authorize profile'}</button></form>`}</section></main>`,
  })

export const renderJourney = (state: JourneyState, missions: readonly Mission[], locale: Locale = 'en'): string => {
  const completed = new Set(state.completedSlugs)
  const next = missions.find(({ slug }) => !completed.has(slug))
  const readiness = Math.round((completed.size / missions.length) * 100)
  const rows = missions.map((mission) => {
    const isNext = mission.slug === next?.slug
    const title = isNext
      ? `<a href="${localizedPath(locale, `/missions/${escapeHtml(mission.slug)}`)}">${escapeHtml(mission.title)}</a>`
      : escapeHtml(mission.title)
    const status = completed.has(mission.slug) ? (locale === 'pl' ? 'ZWERYFIKOWANA' : 'VERIFIED') : isNext ? (locale === 'pl' ? 'NASTĘPNA' : 'NEXT') : (locale === 'pl' ? 'ZABLOKOWANA' : 'LOCKED')
    return `<li><strong>${missionNumber(mission.number)} ${title}</strong> — ${status}</li>`
  }).join('')
  const devices = state.devices.length > 0
    ? state.devices.map((device) => `<li><span>${escapeHtml(device.profileLabel)}</span><form method="post" action="${localizedPath(locale, '/journey/devices/revoke')}"><input type="hidden" name="device_id" value="${escapeHtml(device.id)}"><button class="auth-link auth-link--button" type="submit">${locale === 'pl' ? 'Cofnij dostęp' : 'Revoke'}</button></form></li>`).join('')
    : `<li>${locale === 'pl' ? 'Nie autoryzowano jeszcze żadnego profilu Pi.' : 'No authorized Pi profile yet.'}</li>`
  const proof = state.proof
    ? `<p>${locale === 'pl' ? `Publiczne potwierdzenie jest aktywne: <a href="${localizedPath(locale, `/proof/${escapeHtml(state.proof.publicId)}`)}">zobacz potwierdzenie</a>.` : `Your public proof is active: <a href="/proof/${escapeHtml(state.proof.publicId)}">view proof</a>.`}</p><form method="post" action="${localizedPath(locale, '/journey/proof/revoke')}"><button class="auth-link auth-link--button" type="submit">${locale === 'pl' ? 'Wyłącz publiczne potwierdzenie' : 'Revoke public proof'}</button></form>`
    : completed.size === missions.length
      ? `<form class="auth-form" method="post" action="${localizedPath(locale, '/journey/proof')}"><label for="display-name">${locale === 'pl' ? 'Publiczna nazwa' : 'Public display name'}</label><input id="display-name" name="display_name" maxlength="60" required><button class="copy-button copy-button--primary" type="submit">${locale === 'pl' ? 'Opublikuj potwierdzenie ukończenia' : 'Publish completion proof'}</button></form>`
      : `<p>${locale === 'pl' ? 'Potwierdzenie ukończenia odblokuje się po zaliczeniu wszystkich dwunastu checkpointów.' : 'Completion proof unlocks after all twelve verified checkpoints.'}</p>`
  return renderDocument({
    locale,
    currentPath: '/journey',
    title: `${locale === 'pl' ? 'Twoja ścieżka' : 'Your journey'} — Pi Harness Academy`,
    description: locale === 'pl' ? 'Prywatny zweryfikowany postęp Akademii i autoryzowane profile Pi.' : 'Private verified Academy progress and authorized Pi profiles.',
    footerState: locale === 'pl' ? 'PRYWATNA ZWERYFIKOWANA ŚCIEŻKA' : 'PRIVATE VERIFIED JOURNEY',
    authControl: renderAuthControl(locale, true),
    main: `<main id="main"><section class="auth-panel journey-panel"><p class="eyebrow">${locale === 'pl' ? 'ZWERYFIKOWANA ŚCIEŻKA' : 'VERIFIED JOURNEY'}</p><h1>${readiness}% ${locale === 'pl' ? 'gotowości.' : 'ready.'}</h1><p>${next ? `${locale === 'pl' ? 'Następna misja' : 'Next mission'}: <a href="${localizedPath(locale, `/missions/${escapeHtml(next.slug)}`)}">${escapeHtml(next.title)}</a>.` : (locale === 'pl' ? 'Wszystkie dwanaście misji zostało zweryfikowanych.' : 'All twelve missions are verified.')}</p><h2>${locale === 'pl' ? 'Połącz Pi' : 'Connect Pi'}</h2><p>${locale === 'pl' ? 'Sprawdź <a href="https://github.com/sharpz33/pi-harness-academy/tree/verified-journey-v0.2.0/companion">kod companion</a>, a następnie zainstaluj przypięte wydanie w wybranym profilu Pi.' : 'Review the <a href="https://github.com/sharpz33/pi-harness-academy/tree/verified-journey-v0.2.0/companion">companion source</a>, then install the pinned release in your selected Pi profile.'}</p><pre tabindex="0"><code>pi install git:github.com/sharpz33/pi-harness-academy@verified-journey-v0.2.0</code></pre><p>${locale === 'pl' ? 'Uruchom <code>/academy-connect</code> w Pi. Gdy misja zapisze dozwolony plik dowodowy, uruchom <code>/academy-check &lt;mission-slug&gt;</code>. Checkpointy odblokowują się po kolei.' : 'Run <code>/academy-connect</code> in Pi. After each mission writes its allowlisted evidence file, run <code>/academy-check &lt;mission-slug&gt;</code>. Checkpoints unlock in order.'}</p><h2>${locale === 'pl' ? 'Stan misji' : 'Mission state'}</h2><ol>${rows}</ol><h2>${locale === 'pl' ? 'Autoryzowane profile' : 'Authorized profiles'}</h2><ul>${devices}</ul><p><a href="${localizedPath(locale, '/device')}">${locale === 'pl' ? 'Wpisz kod urządzenia ręcznie' : 'Enter a device code manually'}</a></p><h2>${locale === 'pl' ? 'Potwierdzenie ukończenia' : 'Completion proof'}</h2>${proof}<p><a href="${localizedPath(locale, '/journey/delete')}">${locale === 'pl' ? 'Usuń zweryfikowany postęp' : 'Delete verified progress'}</a></p></section></main>`,
  })
}

export const renderCompletionProof = (proof: { publicId: string; displayName: string }, locale: Locale = 'en'): string => {
  const url = `https://piacade.my/proof/${proof.publicId}`
  const linkedIn = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
  return renderDocument({
    locale,
    currentPath: `/proof/${proof.publicId}`,
    title: `${proof.displayName} ${locale === 'pl' ? 'ukończył(a)' : 'completed'} Pi Harness Academy`,
    description: locale === 'pl' ? 'Publiczne potwierdzenie ukończenia Pi Harness Academy.' : 'Public completion proof for Pi Harness Academy.',
    footerState: locale === 'pl' ? 'ZWERYFIKOWANE UKOŃCZENIE' : 'VERIFIED COMPLETION',
    authControl: `<a class="auth-link" href="${localizedPath(locale, '/')}">${locale === 'pl' ? 'Publiczne misje' : 'Public missions'}</a>`,
    main: `<main id="main"><section class="auth-panel"><p class="eyebrow">${locale === 'pl' ? 'ZWERYFIKOWANE UKOŃCZENIE' : 'VERIFIED COMPLETION'}</p><h1>${escapeHtml(proof.displayName)} ${locale === 'pl' ? 'ukończył(a)' : 'completed'} Pi Harness Academy.</h1><p>${locale === 'pl' ? 'To publiczne potwierdzenie oznacza ukończenie wszystkich dwunastu zweryfikowanych misji. Nie ujawnia adresu e-mail ani szczegółowego postępu.' : 'This public proof confirms completion of all twelve verified missions. It exposes no email address or detailed progress.'}</p><label for="proof-link">${locale === 'pl' ? 'Link do publicznego potwierdzenia' : 'Public proof link'}</label><input id="proof-link" value="${escapeHtml(url)}" readonly><button class="copy-button copy-button--primary" type="button" data-copy-target="proof-link" aria-describedby="proof-status">${locale === 'pl' ? 'Kopiuj link' : 'Copy proof link'}</button><span class="copy-status" id="proof-status" role="status" aria-live="polite"></span><p><a href="${escapeHtml(linkedIn)}" rel="noopener noreferrer">${locale === 'pl' ? 'Udostępnij na LinkedIn' : 'Share on LinkedIn'}</a></p></section><script src="/mission.js" defer></script></main>`,
  })
}

export const renderDeleteProgress = (locale: Locale = 'en'): string =>
  renderDocument({
    locale,
    currentPath: '/journey/delete',
    title: `${locale === 'pl' ? 'Usuń postęp' : 'Delete progress'} — Pi Harness Academy`,
    description: locale === 'pl' ? 'Trwale usuń prywatny zweryfikowany postęp Akademii.' : 'Permanently delete your private verified Academy progress.',
    footerState: locale === 'pl' ? 'OPERACJA DESTRUKCYJNA' : 'DESTRUCTIVE ACTION',
    authControl: renderAuthControl(locale, true),
    main: `<main id="main"><section class="auth-panel"><p class="eyebrow">${locale === 'pl' ? 'OPERACJA DESTRUKCYJNA' : 'DESTRUCTIVE ACTION'}</p><h1>${locale === 'pl' ? 'Usunąć cały zweryfikowany postęp?' : 'Delete all verified progress?'}</h1><p>${locale === 'pl' ? 'Tej operacji nie można cofnąć. Autoryzowane profile pozostaną połączone, ale ukończone misje i poziom gotowości zostaną usunięte.' : 'This cannot be undone. Authorized profiles remain connected but all mission completions and readiness are removed.'}</p><form class="auth-form" method="post" action="${localizedPath(locale, '/journey/delete')}"><button class="copy-button copy-button--primary" type="submit">${locale === 'pl' ? 'Trwale usuń postęp' : 'Permanently delete progress'}</button></form><p><a href="${localizedPath(locale, '/journey')}">${locale === 'pl' ? 'Anuluj' : 'Cancel'}</a></p></section></main>`,
  })

export const renderSignIn = (returnTo = '/', error?: string, locale: Locale = 'en'): string =>
  renderDocument({
    locale,
    currentPath: `/sign-in?return_to=${encodeURIComponent(returnTo)}`,
    title: `${locale === 'pl' ? 'Logowanie' : 'Sign in'} — Pi Harness Academy`,
    description: locale === 'pl' ? 'Zaloguj się, aby zapisywać zweryfikowany postęp w Pi Harness Academy.' : 'Sign in to save verified Pi Harness Academy progress.',
    footerState: locale === 'pl' ? 'LOGOWANIE BEZ HASŁA' : 'PASSWORDLESS ENTRY',
    authControl: `<a class="auth-link" href="${localizedPath(locale, '/')}">${locale === 'pl' ? 'Publiczne misje' : 'Public missions'}</a>`,
    main: `<main id="main"><section class="auth-panel"><p class="eyebrow">${locale === 'pl' ? 'DOSTĘP UCZESTNIKA' : 'LEARNER ACCESS'}</p><h1>${locale === 'pl' ? 'Kontynuuj przez e-mail.' : 'Continue by email.'}</h1><p>${locale === 'pl' ? 'Wyślemy jednorazowy link. Publiczne misje pozostają dostępne bez konta.' : 'We will send a one-time link. Public missions remain available without an account.'}</p>${error ? `<p class="form-error" role="alert">${escapeHtml(error)}</p>` : ''}<form class="auth-form" method="post" action="/auth/requests"><label for="email">${locale === 'pl' ? 'Adres e-mail' : 'Email address'}</label><input id="email" name="email" type="email" inputmode="email" autocomplete="email" maxlength="254" required><input name="return_to" type="hidden" value="${escapeHtml(returnTo)}"><button class="copy-button copy-button--primary" type="submit">${locale === 'pl' ? 'Wyślij link do logowania' : 'Send sign-in link'}</button></form></section></main>`,
  })

export const renderAuthRequestResult = (state: 'sent' | 'rate_limited' | 'delivery_failed', locale: Locale = 'en'): string => {
  const messages = locale === 'pl' ? {
    sent: ['Sprawdź skrzynkę.', 'Jeśli podany adres może odbierać wiadomości Akademii, link potwierdzający jest już w drodze.'],
    rate_limited: ['Zbyt wiele prób.', 'Odczekaj 15 minut, a następnie poproś o kolejny link do logowania.'],
    delivery_failed: ['Nie udało się wysłać linku.', 'Spróbuj ponownie za chwilę. Publiczne misje nadal są dostępne.'],
  } as const : {
    sent: ['Check your inbox.', 'If the address can receive Academy mail, a confirmation link is on its way.'],
    rate_limited: ['Too many requests.', 'Wait 15 minutes, then request another sign-in link.'],
    delivery_failed: ['We could not send the link.', 'Try again shortly. Public missions are still available.'],
  } as const
  const [title, detail] = messages[state]

  return renderDocument({
    locale,
    currentPath: '/sign-in',
    title: `${title} — Pi Harness Academy`,
    description: detail,
    footerState: locale === 'pl' ? 'LOGOWANIE BEZ HASŁA' : 'PASSWORDLESS ENTRY',
    authControl: `<a class="auth-link" href="${localizedPath(locale, '/')}">${locale === 'pl' ? 'Publiczne misje' : 'Public missions'}</a>`,
    main: `<main id="main"><section class="auth-panel"><p class="eyebrow">${locale === 'pl' ? 'DOSTĘP UCZESTNIKA' : 'LEARNER ACCESS'}</p><h1>${escapeHtml(title)}</h1><p>${escapeHtml(detail)}</p><p><a href="${localizedPath(locale, '/sign-in')}">${locale === 'pl' ? 'Poproś o kolejny link' : 'Request another link'}</a> ${locale === 'pl' ? 'lub' : 'or'} <a href="${localizedPath(locale, '/')}">${locale === 'pl' ? 'wróć do publicznych misji' : 'return to public missions'}</a>.</p></section></main>`,
  })
}

export const renderVerifyLogin = (token: string, valid: boolean, locale: Locale = 'en'): string =>
  renderDocument({
    locale,
    currentPath: '/auth/verify',
    showLocaleSwitch: false,
    title: `${valid ? (locale === 'pl' ? 'Potwierdź logowanie' : 'Confirm sign-in') : (locale === 'pl' ? 'Link niedostępny' : 'Link unavailable')} — Pi Harness Academy`,
    description: valid ? (locale === 'pl' ? 'Potwierdź logowanie do Pi Harness Academy.' : 'Confirm your Pi Harness Academy sign-in.') : (locale === 'pl' ? 'Link do logowania jest nieprawidłowy lub wygasł.' : 'The sign-in link is invalid or expired.'),
    footerState: locale === 'pl' ? 'LOGOWANIE BEZ HASŁA' : 'PASSWORDLESS ENTRY',
    authControl: `<a class="auth-link" href="${localizedPath(locale, '/')}">${locale === 'pl' ? 'Publiczne misje' : 'Public missions'}</a>`,
    main: valid
      ? `<main id="main"><section class="auth-panel"><p class="eyebrow">${locale === 'pl' ? 'POTWIERDŹ DOSTĘP' : 'CONFIRM ACCESS'}</p><h1>${locale === 'pl' ? 'Wejdź do Akademii.' : 'Enter Academy.'}</h1><p>${locale === 'pl' ? 'Ta operacja zużyje jednorazowy link i rozpocznie prywatną sesję uczestnika.' : 'This action uses the one-time link and starts your private learner session.'}</p><form class="auth-form" method="post" action="/auth/verify"><input name="token" type="hidden" value="${escapeHtml(token)}"><input name="locale" type="hidden" value="${locale}"><button class="copy-button copy-button--primary" type="submit">${locale === 'pl' ? 'Potwierdź logowanie' : 'Confirm sign-in'}</button></form></section></main>`
      : `<main id="main"><section class="auth-panel"><p class="eyebrow">${locale === 'pl' ? 'LINK NIEDOSTĘPNY' : 'LINK UNAVAILABLE'}</p><h1>${locale === 'pl' ? 'Poproś o nowy link.' : 'Request a new link.'}</h1><p>${locale === 'pl' ? 'Ten link jest nieprawidłowy, wygasł albo został już użyty.' : 'This sign-in link is invalid, expired, or already used.'}</p><p><a href="${localizedPath(locale, '/sign-in')}">${locale === 'pl' ? 'Wróć do logowania' : 'Return to sign in'}</a>.</p></section></main>`,
  })

export const renderNotFound = (locale: Locale = 'en'): string =>
  renderDocument({
    locale,
    title: `${locale === 'pl' ? 'Nie znaleziono misji' : 'Mission not found'} — Pi Harness Academy`,
    description: locale === 'pl' ? 'Wybrana misja Pi Harness Academy nie jest dostępna.' : 'The requested Pi Harness Academy mission is not available.',
    footerState: locale === 'pl' ? 'NIE ZNALEZIONO MISJI' : 'MISSION NOT FOUND',
    main: `<main id="main"><section class="not-found"><p class="eyebrow">404 // ${locale === 'pl' ? 'NIEZNANA MISJA' : 'UNKNOWN MISSION'}</p><h1>${locale === 'pl' ? 'Nie znaleziono misji.' : 'Mission not found.'}</h1><p><a href="${localizedPath(locale, '/')}">${locale === 'pl' ? 'Wróć do Mission Control' : 'Return to Mission Control'}</a></p></section></main>`,
  })
