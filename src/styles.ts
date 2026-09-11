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

.mission__name {
  font-family: Arial, Helvetica, sans-serif;
  font-size: clamp(1rem, 2vw, 1.35rem);
  font-weight: 700;
  text-transform: uppercase;
}

.mission:first-child .mission__number,
.mission:first-child .mission__state {
  color: var(--signal);
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
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
  }
}
`
