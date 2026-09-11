---
verified_at: 2026-09-11T15:42:34+02:00
status: passed
repository: https://github.com/sharpz33/pi-harness-academy
public_url: https://pi-harness-academy.lukasz-f4c.workers.dev
deployed_commit: 89041c7b04a4f0d266b3b1e5db8c056426c2b823
cloudflare_version: fb295add-266f-4f90-9b73-5dd0d3209c3a
---

# First Deployment Verification

## Source and CI

- Public repository exists with `main` as the default branch.
- Branch protection requires the `check` status, requires pull requests, resolves conversations, and blocks force-push and branch deletion.
- CI run for the deployed commit completed successfully.
- CI executes `npm ci`, typechecking, Vitest, and a Wrangler deployment dry-run.

## Pre-Deployment Gate

- Worktree was clean and matched `origin/main`.
- Selected commit: `89041c7b04a4f0d266b3b1e5db8c056426c2b823`.
- `npm run deploy -- --dry-run` passed.
- Bundle size: 25.84 KiB raw / 10.51 KiB gzip.
- No Worker bindings were present.
- The target Worker did not exist before deployment.
- The user explicitly approved creation of the production Worker and public endpoint.

## Deployment Result

- Worker: `pi-harness-academy`.
- Version: `fb295add-266f-4f90-9b73-5dd0d3209c3a`.
- URL: <https://pi-harness-academy.lukasz-f4c.workers.dev>.
- Worker startup time reported by Wrangler: 4 ms.

## HTTP Verification

- `/` returned HTTP/2 200 and `text/html; charset=UTF-8`.
- `/styles.css` returned HTTP/2 200 and `text/css; charset=UTF-8`.
- The page contained the expected `Pi Harness Academy` title and all 12 mission markers.
- CSP, `X-Content-Type-Options`, and `X-Frame-Options` headers were present.
- A filtered Wrangler error tail remained empty during verification requests.

## Deferred

- A dedicated least-privilege Cloudflare deploy token for GitHub Actions.
- Automatic production deployment after successful CI on `main`.
- Rollback test after a second Worker version exists.
- D1, Email Sending, custom domain, and OTP.
