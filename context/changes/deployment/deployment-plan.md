---
project: Pi Harness Academy
status: approved
approved_at: 2026-09-11T14:45:51+02:00
platform: Cloudflare Workers
repository: sharpz33/pi-harness-academy
production_worker: pi-harness-academy
---

# First Deployment Plan

## Decisions

- Deploy the Hono application to Cloudflare Workers.
- Keep D1, Email Sending, the custom domain, and OTP outside this first deployment.
- Use GitHub Actions with Wrangler for CI/CD. Do not enable Cloudflare Builds; this preserves the CI decision in `context/foundation/tech-stack.md` despite the generic course prompt preferring platform-managed auto-deploy.
- Start production deployment as an approved manual workflow. Enable deployment after merge to `main` only after the first deployment and rollback path are verified.
- Treat Cloudflare Workers plus D1 plus an external transactional email adapter as the mail fallback. Do not introduce an alternative hosting platform.

Approval of this plan authorizes local preparation only. Public repository creation and production deployment each require a separate explicit confirmation.

## Known Starting State

- [x] GitHub CLI authentication is active.
- [x] Cloudflare Wrangler authentication is active with a scoped account token.
- [x] The GitHub repository name `sharpz33/pi-harness-academy` is available.
- [x] The Cloudflare Worker `pi-harness-academy` does not exist.
- [x] Local deploy dry-run passes with no bindings.
- [ ] The current Cloudflare token has no confirmed D1 write permission; D1 creation is excluded.
- [ ] No previous Worker deployment exists, so the first release has no platform version to roll back to.

## Phase 1 — Local Publishable Baseline

- [x] Extend `.gitignore` for credential files, private keys, and service-account files.
- [x] Replace the starter response with a minimal server-rendered Pi Mission Control page.
- [x] Add a smoke test, TypeScript checking, and a single `npm run check` inner loop.
- [x] Add GitHub Actions CI for pull requests and `main`: install, typecheck, test, and deploy dry-run.
- [x] Scan all files intended for publication for secrets, private data, absolute local paths, and licensed `.ai/` content.
- [x] Run `npm run check`, `npm audit`, and `git diff --check`.
- [x] Review the full diff and create one local imperative commit.

## Phase 2 — Public GitHub Repository

- [x] Show the exact publication set and verify that `.ai/`, environment files, credentials, and generated local files are absent.
- [x] Ask for explicit approval to create the public repository.
- [x] Create `sharpz33/pi-harness-academy` as public and add it as `origin`.
- [x] Push `main` and verify repository visibility, default branch, and CI status.
- [x] Configure branch protection or rules so the CI check is required before merge.

## Phase 3 — First Production Deployment

- [x] Add a production deployment workflow triggered manually with `workflow_dispatch`.
- [ ] Store only `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` in GitHub Actions secrets; never print their values.
- [ ] Record the exact commit selected for deployment and confirm the Worker name and account.
- [ ] Run and show the final deployment dry-run.
- [ ] Ask explicitly: `Wdrażam pi-harness-academy do PROD na Cloudflare Workers. Potwierdź?`
- [ ] Dispatch the production workflow and wait for a deterministic success result.
- [ ] Verify the returned `workers.dev` URL, HTTP status, HTML Content-Type, expected page title, and runtime logs.
- [ ] Record the deployed commit and URL.
- [ ] After rollback verification, change the production workflow to deploy automatically after successful CI on `main`.

## Rollback and Failure Handling

- Before deployment, keep the deployed Git commit as the source rollback point.
- After the first successful release, use `npx wrangler rollback <VERSION_ID>` for Worker-code rollback and verify the URL again.
- The first deployment has no previous platform version. If validation fails, do not add a custom domain; fix forward from the committed baseline or disable the Worker only after explicit approval.
- Worker rollback never covers D1 data, bindings, secrets, or email-provider state.
- Any missing identity, target mismatch, secret scan finding, failed check, or ambiguous Cloudflare response stops the deployment.

## Deferred Work

- D1 databases and migrations
- Email Sending onboarding and mailbox deliverability test
- OTP and session implementation
- Custom domain and DNS
- Preview database isolation
