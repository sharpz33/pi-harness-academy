# Public The Heist Mission — Plan Brief

> Full plan: `context/changes/public-heist-mission/plan.md`

## What and Why

Build the first complete public Academy lesson. A visitor launches Pi, pastes one staged prompt, audits and activates a native capability or migrates one self-contained Markdown capability from Claude Code or Codex, runs it, and prepares local evidence without creating an account or uploading machine data.

## Starting Point

Mission Control publicly lists twelve names but has no lesson routes or mission interaction. The Worker already provides a tested server-rendered shell, responsive visual language, security headers, CI, and a public deployment.

## Desired End State

`/missions/the-heist` provides a concise Launch Bay, one inspectable migration prompt, safety boundaries, official sources, and four local evidence checks. A fresh Pi user can use the normal profile; a learner with existing Pi configuration can choose a separate Academy profile. The page never claims that local evidence is verified progress.

## Key Decisions

| Decision | Choice | Why | Source |
| --- | --- | --- | --- |
| First action | Install Pi, launch it, then paste one prompt | The first experience should happen inside the real agent, not a website-supplied scanner | Plan interview |
| Profile | Fresh default profile; optional Academy profile for existing Pi users | Removes unnecessary startup friction without risking an established Pi setup | Plan interview |
| Provider authentication | Performed directly inside Pi | Academy never requests, receives, or imports model credentials | Plan review |
| Migratable resource | Native compatible resource, or one reviewed adaptable Markdown skill/prompt | Avoids copying Codex skills Pi already discovers while keeping executable configuration out of migration | Official docs + plan review |
| Inventory | Pi performs a read-only staged inventory | Keeps the experience Pi-native and inspectable | Plan interview |
| Consent | Stop before candidate audit and before any adaptable-resource copy | A prompt is a guardrail, not a filesystem sandbox | Plan |
| Executable resources | Report and quarantine MCP, hooks, plugins, extensions, and packages | These may contain incompatible commands, environment values, or arbitrary code | Official docs + plan interview |
| Forbidden resources | Never inspect or migrate credentials and sessions | They are unrelated to the learning outcome and may expose secrets or private history | PRD + official docs |
| Evidence | Four ephemeral browser checks | Teaches the future checkpoint contract without impersonating server verification | Roadmap + plan interview |
| Navigation | Dedicated mission route | Establishes the reusable pattern for the remaining eleven lessons | Plan interview |
| Platform | POSIX commands only in this slice | Matches the approved scope and avoids untested Windows instructions | Plan interview |

## Scope

**In scope:**

- Launch Bay installation and profile choice
- The Heist mission content and staged prompt
- Claude Code and Codex resource classification
- Public mission route and homepage entry
- Copy controls and ephemeral Evidence preview
- Safety, route, responsive, and keyboard verification
- Alignment of canonical profile-policy documents

**Out of scope:**

- OTP, D1, companion authorization, and verified progress
- Automatic migration of executable configuration or whole directories
- Windows commands and third-party package installation
- Missions 2–12, production deployment, and new Cloudflare resources

## Architecture / Approach

Typed mission data feeds the server-rendered homepage and lesson route. A small same-origin script handles copy controls and the ephemeral checklist, while the staged local Pi prompt runs `inventory → select → audit → activate native or approve adaptable copy → run → compare source digest`. No browser data is persisted or sent to the service.

## Phases at a Glance

| Phase | Delivers | Key risk |
| --- | --- | --- |
| 1. Contracts and mission | Adaptive profile policy, typed lesson content, staged prompt | Prompt accidentally implies permission to inspect or execute unsafe resources |
| 2. Mission workspace | Public route, navigation, copy controls, Evidence preview | UI could blur local readiness with verified completion |
| 3. Safety and release evidence | Fixtures, hardening, documentation, review record | Tests might validate prose but miss unsafe real-world interpretation |

**Prerequisites:** Existing public Worker shell and approved roadmap item S-01.
**Estimated effort:** Three bounded implementation phases; no calendar estimate is asserted.

## Open Risks and Assumptions

- Prompt instructions cannot enforce filesystem isolation; staged consent and a local pre/post source digest mitigate rather than eliminate that limitation.
- A Codex skill in the shared Agent Skills directory may already be native to Pi and should be activated without copying.
- Skills or prompts with sibling files, scripts, imports, or executable dependencies are not self-contained and must be quarantined.
- Public vendor paths may evolve; source links and classifications require review before release.
- The POSIX-only choice intentionally excludes Windows execution from this slice.

## Success Criteria Summary

- A visitor reaches and reads the complete mission without authentication.
- Pi activates a native capability or migrates one approved adaptable Markdown capability while a local digest confirms the source stayed unchanged and forbidden resources remained unopened.
- The page presents four local evidence checks but never stores or labels them as verified progress.
- Automated checks, publication scan, keyboard review, responsive review, and disposable-fixture safety review pass.
