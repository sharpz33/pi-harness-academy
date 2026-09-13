---
verified_at: 2026-09-13T13:31:25+02:00
status: passed
public_url: https://piacade.my
deployed_commit: cec9fc2e928c709619be5d2e863a301d15525b1b
cloudflare_version: bbdeba13-851e-4679-a977-1e54a0a90a4a
email_provider: Cloudflare Email Sending
---

# Passwordless Learner Entry Verification

## Release gate

- Pull requests #3 and #4 were merged through protected `main` after the required CI check passed.
- Final CI passed on the deployed merge commit.
- `npm ci`, typechecking, 37 Vitest tests, Wrangler dry-run, dependency audit, patch formatting, and publication secret scans passed.
- Production D1 migration `0001_passwordless_auth.sql` was applied before deployment.
- The user explicitly approved production resources, email sends, merges, and both deployments.

## Deployment

- Worker: `pi-harness-academy`.
- Public URL: <https://piacade.my>.
- D1 binding: `pi-harness-academy-prod`.
- Final version: `bbdeba13-851e-4679-a977-1e54a0a90a4a`.
- Previous working rollback version: `8cc2a77d-95c7-4b64-a2e5-429cead0ff89`.
- Worker rollback does not reverse the additive D1 migration or data changes.

## Production smoke matrix

- Anonymous homepage, sign-in page, and The Heist mission returned HTTP 200.
- The homepage exposed all twelve mission markers.
- An approved external mailbox received a real login message through Cloudflare Email Sending.
- Verification GET displayed confirmation without authenticating; explicit confirmation created the session and redirected to a clean URL.
- Refresh and navigation to The Heist preserved signed-in state.
- Anonymous mission sign-in retained the mission return path.
- Reusing the consumed link failed closed.
- Logout cleared the browser state, and a separate private browser remained anonymous.
- Public lesson access remained available without authentication.
- Login pages returned `Cache-Control: no-store` and `Referrer-Policy: no-referrer`.
- CSP, frame, and content-type protections remained present.
- A filtered Wrangler error tail connected without reporting unexpected runtime errors during the observation window.
- Production D1 aggregate counts matched the approved smoke activity; no row content was read into evidence.

## Release-blocker fix

The first deployment showed anonymous controls on a mission page despite a valid session. The deadline rule classified this as a session-persistence blocker. PR #4 added authenticated mission controls and return-path coverage, passed 37 tests and CI, and was redeployed after approval. The user confirmed the final mission page retained the session and exposed logout.

## Accepted deferrals

- Progress CRUD, companion authorization, badges, MFA, and account management remain outside this slice.
- Automatic deployment remains disabled.
- Persistent production observability and automated auth-data pruning remain deferred until usage evidence requires them.
- Workers Paid may be downgraded before renewal after confirming Email Sending requirements and current usage.

## Operational retry path

For delivery failures, inspect Email Sending status and filtered Worker logs without exposing recipient or token data. Keep the generic learner response. If Cloudflare Email Sending becomes unsuitable, replace only the `AuthMailer` adapter with an approved transactional provider, store credentials as Worker secrets, rerun the complete gate, and request deployment approval.
