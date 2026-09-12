export const styles = `
:root {
  color-scheme: dark;
  --background: #0a0a0a;
  --panel: #111111;
  --line: #303030;
  --muted: #969696;
  --text: #f4f4f0;
  --signal: #b8ff3d;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

* {
  box-sizing: border-box;
}

html {
  background: var(--background);
}

body {
  min-width: 320px;
  margin: 0;
  color: var(--text);
  background:
    linear-gradient(var(--line) 1px, transparent 1px),
    linear-gradient(90deg, var(--line) 1px, transparent 1px),
    var(--background);
  background-size: 48px 48px;
}

a {
  color: inherit;
}

.skip-link {
  position: fixed;
  top: 0;
  left: 1rem;
  z-index: 10;
  padding: 0.75rem 1rem;
  color: var(--background);
  background: var(--signal);
  transform: translateY(-120%);
}

.skip-link:focus {
  transform: translateY(0);
}

.topbar,
footer {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem clamp(1rem, 4vw, 4rem);
  border-bottom: 1px solid var(--line);
  background: var(--background);
  font-size: 0.75rem;
  letter-spacing: 0.08em;
}

.wordmark {
  font-weight: 800;
  text-decoration: none;
}

.system-state {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--signal);
}

.system-state span {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: currentColor;
  box-shadow: 0 0 12px currentColor;
}

main {
  width: min(1180px, calc(100% - 2rem));
  margin: 0 auto;
  background: var(--background);
  border-inline: 1px solid var(--line);
}

.hero,
.sequence {
  padding: clamp(2rem, 7vw, 6rem);
}

.hero {
  min-height: 66vh;
  display: grid;
  align-content: center;
  border-bottom: 1px solid var(--line);
}

.eyebrow,
.section-heading span {
  margin: 0 0 1.5rem;
  color: var(--signal);
  font-size: 0.75rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

h1,
h2,
p {
  margin-top: 0;
}

h1 {
  max-width: 16ch;
  margin-bottom: 1.5rem;
  font-family: Arial, Helvetica, sans-serif;
  font-size: clamp(3rem, 9vw, 7.5rem);
  line-height: 0.86;
  letter-spacing: -0.065em;
  text-transform: uppercase;
}

.lede {
  max-width: 64ch;
  color: var(--muted);
  font-family: Arial, Helvetica, sans-serif;
  font-size: clamp(1rem, 2vw, 1.25rem);
  line-height: 1.55;
}

.notice {
  display: grid;
  gap: 0.5rem;
  max-width: 760px;
  margin-top: 2rem;
  padding: 1rem;
  border: 1px solid var(--signal);
  background: color-mix(in srgb, var(--signal) 5%, var(--background));
  font-size: 0.8rem;
  line-height: 1.5;
}

.notice strong {
  color: var(--signal);
}

.section-heading {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.section-heading h2 {
  font-family: Arial, Helvetica, sans-serif;
  font-size: clamp(1.75rem, 4vw, 3rem);
  letter-spacing: -0.04em;
  text-transform: uppercase;
}

.section-heading span {
  margin: 0;
}

.mission-list {
  margin: 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid var(--line);
}

.mission {
  display: grid;
  grid-template-columns: 3rem 1fr auto;
  gap: 1rem;
  align-items: center;
  min-height: 4.5rem;
  border-bottom: 1px solid var(--line);
}

.mission__number,
.mission__state {
  color: var(--muted);
  font-size: 0.7rem;
  letter-spacing: 0.08em;
}

.mission__name,
.mission__link {
  font-family: Arial, Helvetica, sans-serif;
  font-size: clamp(1rem, 2vw, 1.35rem);
  font-weight: 700;
  text-transform: uppercase;
}

.mission__link {
  width: fit-content;
  text-decoration-thickness: 1px;
  text-underline-offset: 0.3em;
}

.mission--available .mission__number,
.mission--available .mission__state,
.mission--available .mission__link {
  color: var(--signal);
}

button,
a,
input,
textarea,
pre[tabindex] {
  outline-offset: 4px;
}

button:focus-visible,
a:focus-visible,
input:focus-visible,
textarea:focus-visible,
pre[tabindex]:focus-visible {
  outline: 2px solid var(--signal);
}

.mission-workspace {
  display: grid;
  grid-template-columns: minmax(13rem, 0.28fr) minmax(0, 1fr);
  width: min(1440px, calc(100% - 2rem));
}

.mission-rail {
  padding: 2rem 1.25rem;
  border-right: 1px solid var(--line);
}

.mission-list--rail .mission {
  grid-template-columns: 2rem minmax(0, 1fr);
  gap: 0.5rem;
  min-height: 3.5rem;
}

.mission-list--rail .mission__name,
.mission-list--rail .mission__link {
  font-size: 0.78rem;
}

.mission-list--rail .mission__state {
  grid-column: 2;
  padding-bottom: 0.65rem;
  font-size: 0.6rem;
}

.lesson {
  min-width: 0;
}

.lesson__header,
.lesson-section {
  padding: clamp(2rem, 6vw, 5rem);
  border-bottom: 1px solid var(--line);
}

.lesson__header h1 {
  margin-bottom: 1.5rem;
}

.mission-objective,
.reveal {
  max-width: 62ch;
  color: var(--text);
  font-family: Arial, Helvetica, sans-serif;
  font-size: clamp(1.15rem, 2.2vw, 1.6rem);
  line-height: 1.5;
}

.lesson-nav {
  position: sticky;
  top: 0;
  z-index: 3;
  display: flex;
  gap: 1.5rem;
  overflow-x: auto;
  padding: 1rem clamp(1rem, 6vw, 5rem);
  border-bottom: 1px solid var(--line);
  background: var(--background);
  font-size: 0.72rem;
  text-transform: uppercase;
}

.lesson-nav a {
  white-space: nowrap;
  text-underline-offset: 0.3em;
}

.lesson-section h2,
.not-found h1 {
  font-family: Arial, Helvetica, sans-serif;
  font-size: clamp(2rem, 5vw, 4rem);
  letter-spacing: -0.045em;
  text-transform: uppercase;
}

.lesson-section > p:not(.section-code) {
  max-width: 70ch;
  color: var(--muted);
  font-family: Arial, Helvetica, sans-serif;
  line-height: 1.65;
}

.section-code {
  margin-bottom: 0.75rem;
  color: var(--signal);
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.command-grid {
  display: grid;
  gap: 1rem;
  margin-top: 2rem;
}

.command-card,
.prompt-panel,
.safety-notice,
.evidence-item,
.evidence-ready {
  border: 1px solid var(--line);
  background: var(--panel);
}

.command-card {
  padding: 1rem;
}

.command-card__heading,
.prompt-panel__heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.command-card h3,
.prompt-panel h3 {
  margin: 0;
  font-size: 0.9rem;
}

.command-card p {
  margin-bottom: 0;
  color: var(--muted);
  font-family: Arial, Helvetica, sans-serif;
  font-size: 0.85rem;
  line-height: 1.5;
}

pre,
textarea {
  width: 100%;
  color: var(--text);
  background: var(--background);
  border: 1px solid var(--line);
  font: inherit;
  line-height: 1.55;
}

pre {
  overflow-x: auto;
  margin: 1rem 0;
  padding: 1rem;
}

pre code {
  white-space: pre;
}

textarea {
  display: block;
  margin-top: 1rem;
  padding: 1rem;
  resize: vertical;
}

.copy-button {
  flex: 0 0 auto;
  padding: 0.65rem 0.9rem;
  color: var(--text);
  background: transparent;
  border: 1px solid var(--muted);
  font: inherit;
  font-size: 0.7rem;
  text-transform: uppercase;
  cursor: pointer;
}

.copy-button--primary {
  color: var(--background);
  background: var(--signal);
  border-color: var(--signal);
  font-weight: 800;
}

.copy-status {
  display: block;
  min-height: 1.2em;
  margin-top: 0.65rem;
  color: var(--signal);
  font-size: 0.72rem;
}

.copy-status[data-state="error"] {
  color: #ffbf5f;
}

.safety-notice {
  margin-top: 1.5rem;
  padding: 1rem;
  border-left: 3px solid #ffbf5f;
}

.safety-notice strong {
  color: #ffbf5f;
  font-size: 0.75rem;
  text-transform: uppercase;
}

.safety-notice p {
  margin: 0.5rem 0 0;
  font-family: Arial, Helvetica, sans-serif;
  line-height: 1.55;
}

.work-steps {
  margin: 2rem 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid var(--line);
}

.work-steps li {
  display: grid;
  grid-template-columns: 2.5rem 1fr;
  gap: 1rem;
  padding: 1.25rem 0;
  border-bottom: 1px solid var(--line);
}

.work-steps li > span {
  color: var(--signal);
  font-size: 0.7rem;
}

.work-steps h3 {
  margin: 0 0 0.5rem;
  font-family: Arial, Helvetica, sans-serif;
}

.work-steps p {
  margin: 0;
  color: var(--muted);
  font-family: Arial, Helvetica, sans-serif;
  line-height: 1.55;
}

.prompt-panel {
  padding: clamp(1rem, 3vw, 2rem);
}

.evidence-list {
  display: grid;
  gap: 0.75rem;
  margin: 2rem 0 0;
  padding: 0;
  border: 0;
}

.evidence-list legend {
  margin-bottom: 1rem;
  font-size: 0.75rem;
  text-transform: uppercase;
}

.evidence-item {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1rem;
  padding: 1rem;
  cursor: pointer;
}

.evidence-item input {
  width: 1.1rem;
  height: 1.1rem;
  margin: 0.15rem 0 0;
  accent-color: var(--signal);
}

.evidence-item span {
  display: grid;
  gap: 0.4rem;
  color: var(--muted);
  font-family: Arial, Helvetica, sans-serif;
  font-size: 0.9rem;
  line-height: 1.45;
}

.evidence-item strong {
  color: var(--text);
}

.evidence-ready {
  display: grid;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 1rem;
  border-color: #58d68d;
  color: #58d68d;
}

.evidence-ready[hidden] {
  display: none;
}

.evidence-ready span {
  color: var(--text);
  font-family: Arial, Helvetica, sans-serif;
  font-size: 0.85rem;
}

.sources ul {
  display: grid;
  gap: 0.75rem;
  padding-left: 1.25rem;
}

.sources a {
  text-underline-offset: 0.25em;
}

.not-found {
  min-height: 70vh;
  padding: clamp(2rem, 7vw, 6rem);
}

footer {
  border-top: 1px solid var(--line);
  border-bottom: 0;
  color: var(--muted);
}

@media (max-width: 620px) {
  .topbar,
  footer {
    align-items: flex-start;
    flex-direction: column;
  }

  main {
    width: 100%;
    border-inline: 0;
  }

  .hero,
  .sequence {
    padding: 2rem 1rem;
  }

  .hero {
    min-height: 72vh;
  }

  .section-heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .mission {
    grid-template-columns: 2.25rem 1fr;
  }

  .mission__state {
    grid-column: 2;
  }

  .mission-workspace {
    display: block;
    width: 100%;
  }

  .mission-rail {
    padding: 1.5rem 1rem;
    border-right: 0;
    border-bottom: 1px solid var(--line);
  }

  .mission-list--rail {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .mission-list--rail .mission {
    padding: 0.5rem;
  }

  .lesson__header,
  .lesson-section {
    padding: 2.5rem 1rem;
  }

  .lesson-nav {
    padding-inline: 1rem;
  }

  .command-card__heading,
  .prompt-panel__heading {
    align-items: stretch;
    flex-direction: column;
  }

  .copy-button {
    width: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
  }
}
`
