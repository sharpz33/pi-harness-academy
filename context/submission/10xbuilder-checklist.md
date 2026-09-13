# 10xBuilder Submission Checklist

## Fixed deadline

- Submission target: 2026-09-14 20:00.
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
- [ ] Final companion v0.2.0 merge, migration, tag, and production smoke complete.
- [ ] Full user journey reaches 8% readiness through `/academy-check the-heist`.
- [ ] Final `mvp-check` completed with no certification blocker.
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

Capture after final deployment at desktop and mobile widths:

1. Homepage with all twelve missions marked OPEN.
2. The Heist lesson with mission prompt and evidence section.
3. Passwordless sign-in screen.
4. Device authorization screen with a synthetic or expired code only; never capture a live device code.
5. Private Journey showing one verified mission, 8% readiness, and X-Ray Vision next; crop all browser/account identity.
6. Public completion-proof fixture containing only a deliberately selected display name.
7. GitHub Actions required check passing on final `main` commit.

Store generated screenshots outside Git unless the submission explicitly requires committed images. Redact addresses, cookies, codes, tokens, local paths, account IDs, and browser profile identity.

## Form data still needed

Nie mam w plikach dokładnych nazw pól aktywnego formularza 10xBuilder. Before submission, copy the field labels into this file and map each field to existing evidence instead of guessing answers.
