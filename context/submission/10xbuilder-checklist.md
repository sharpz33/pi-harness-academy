# 10xBuilder Submission Checklist

## Fixed deadline

- Submission target: 2026-09-14 18:00.
- Hard deadline: 2026-09-14 23:59.
- Production URL: <https://piacade.my>.
- Repository: <https://github.com/sharpz33/pi-harness-academy>.

## Product evidence

- [x] Public homepage exposes twelve missions.
- [x] Every lesson is readable anonymously.
- [x] Passwordless email login works in production.
- [x] Session persistence, logout, throttling, and consumed-link replay are verified.
- [x] Pi companion installs from a pinned git tag.
- [x] Revocable profile authorization and bearer-scoped checkpoint API are deployed.
- [x] Private progress, readiness, next action, and explicit deletion are implemented.
- [x] Completion-gated public proof, revocation, link copy, and LinkedIn share are implemented.
- [x] Companion v0.2.0 merge, migrations, tag, deployment, and production smoke are complete.
- [x] Controlled local D1 journey reaches 8% readiness with The Heist verified and X-Ray Vision next.
- [ ] Full production learner journey reaches 8% readiness through `/academy-check the-heist`.
- [x] Current course `mvp-check` is unavailable in the course project, Downloads, and local project tree; the repository quality gate is recorded and used instead.
- [ ] Submission sent and confirmation captured.

## Required repository artifacts

- [x] `context/foundation/shape-notes.md`
- [x] `context/foundation/prd.md`
- [x] `context/foundation/infrastructure.md`
- [x] `context/foundation/roadmap.md`
- [x] `context/foundation/test-plan.md`
- [x] `AGENTS.md`

## M1–M3 application map

| Course area | Project evidence |
|---|---|
| M1 — shaping and product boundaries | `context/foundation/shape-notes.md`, `prd.md`, `tech-stack.md`, public-first/auth-for-private-progress decision |
| M1 — implementation context | `AGENTS.md`, foundation docs, scoped change plans and verification records |
| M2 — roadmap and iterative delivery | `context/foundation/roadmap.md`, protected PRs, small production slices, blocker-only fix after smoke |
| M2 — secure external dependencies | D1 migrations, Email Sending runbook, manual cloud gates, pinned companion release |
| M3 — risk-based testing | `context/foundation/test-plan.md`, auth and domain tests, local D1 E2E smoke, production smoke evidence |
| M3 — quality gate | GitHub required CI, TypeScript, Vitest, Wrangler dry-run, dependency audit, secret scan |

## Screenshot shot list

- [x] Full public homepage with all twelve missions marked OPEN.
- [x] Full The Heist lesson with mission prompt and evidence section.
- [x] Passwordless sign-in screen.
- [x] Private Journey on a controlled local D1 account showing one verified mission, 8% readiness, and X-Ray Vision next.
- [x] GitHub Actions required check passing on the final deployed `main` commit.
- [ ] Optional device authorization screen using only a synthetic or expired code.
- [ ] Optional public completion-proof fixture using only a deliberately selected display name.

Generated screenshots remain in ignored local output and are not committed. Each selected image must be reviewed for email, cookies, live codes, tokens, local paths, account IDs, and browser-profile identity before upload.

## Active 10xBuilder form map

| Exact field | Required | Submission value or evidence |
|---|---:|---|
| `Email` | yes | Enter directly in Baserow; do not store in Git. |
| `Imię i nazwisko/ Full Name` | yes | Enter directly in Baserow; do not store in Git. |
| `Typ projektu/ Project Type` | yes | `Własny projekt` |
| Promotional-use consent | yes | Yes, explicitly confirmed by the user. |
| `Repozytorium projektu na GitHub/ Project Repository on GitHub` | yes | <https://github.com/sharpz33/pi-harness-academy> |
| `Publiczny adres opublikowanej aplikacji` | no | <https://piacade.my> |
| `Screenshot: Ekran logowania` | no | Full sign-in page. |
| `Screenshot: Strona główna / Ekran po zalogowaniu` | yes | Full public homepage. |
| `Screenshot: Główna funkcjonalność nr 1` | yes | Full The Heist mission. |
| `Screenshot: Główna funkcjonalność nr 2` | yes | Private verified Journey. |
| `Screenshot: Poprawnie działający test lub zestaw testów` | yes | Successful required GitHub Actions check. |
| `Załączniki niestandardowe` | no | Leave empty unless the final review identifies a specific gap. |
| `Twój komentarz` | yes | Polish product, Pi companion, privacy, architecture, and quality summary prepared locally. |

Do not submit until the final production smoke, screenshot review, exact submission commit tag, and user approval are complete.

## Final verification — 2026-09-14

- Fresh local D1 applied migrations `0001`–`0003` successfully.
- `npm ci`, TypeScript, 55 Vitest tests, Wrangler dry-run, dependency audit, secret scan, and `git diff --check` passed.
- Required `check` status passed on deployed `main` commit `080bb9516345540d55c2dd3f66819567b7280d0c`.
- Production smoke passed for twelve public mission routes, all mission prompts and four-check evidence sections, anonymous homepage access, private Journey redirect, unknown proof rejection, and security headers.
- Authenticated Journey evidence was captured from a controlled local D1 integration account; it contains no real learner identity or production credential.
