---
topic: passwordless-learner-entry
researcher: pi
status: complete
researched_at: 2026-09-12
---

# Passwordless Learner Entry Research

## Recommendation

Implement a first-party email magic-link flow with Hono, D1, Web Crypto, and a provider-neutral mail adapter.

Keep public lessons anonymous. Add authentication only for private progress and later companion authorization. Treat email login as convenient low-assurance authentication, not strong identity proof.

Use this flow:

1. Show a same-origin sign-in form.
2. Accept a normalized email and an optional relative return path.
3. Create a 32-byte opaque login token with Web Crypto.
4. Store only its SHA-256 hash and send the raw token through the mail adapter.
5. Return the same acknowledgement for every accepted address.
6. Let `GET` on the emailed link show a confirmation page without consuming the token.
7. Consume the token and create a new session only after a same-origin `POST`.
8. Set a `__Host-` session cookie and redirect to a clean, allowlisted relative URL.

Do not add an authentication framework. The current product needs one login method, one learner role, opaque sessions, and D1 ownership checks. A framework would add provider and runtime risk without removing the need to design the D1 schema, email delivery, or scanner-safe link behavior.

## Current Repository Findings

| Area | Current state | Consequence |
|---|---|---|
| Worker | One Hono entry point in `src/index.ts` | Split auth policy, persistence, mail, and views before adding routes. |
| UI | Server-rendered public shell | Keep sign-in and confirmation server-rendered; no SPA is required. |
| Authentication | Not implemented | Add learner, login-token, and session boundaries. |
| Database | No D1 binding or migrations | Create migrations and a typed `DB` binding before auth code. |
| Email | No `send_email` binding | Keep delivery behind a small interface and support a local capture implementation. |
| Tests | Node-level Hono smoke tests | Inject clock, token generator, repository, and mailer so the auth policy can be tested without cloud services. |
| Deployment | Public Worker exists | Bindings, database creation, sending-domain onboarding, and production deployment remain approval-gated. |
| Security headers | Basic headers exist | Add auth-specific `no-store` and `no-referrer`; retain the public CSP. |

The production URL is recorded in `context/changes/deployment/verification.md`. Do not derive magic-link origins from the request `Host` header. Configure the canonical application origin per environment.

## Cloudflare Findings

### Email Sending

- Arbitrary recipients require Workers Paid and an onboarded sending domain.
- The sender must belong to the onboarded domain.
- Use a `send_email` binding without a fixed destination for learner-selected addresses.
- New accounts receive account-specific daily limits. Public documentation cannot prove current account eligibility or deliverability.
- Local `wrangler dev` simulates sending by default. A remote binding can send real mail, but enabling it can create external side effects.
- Email Sending is suitable for transactional mail. Inbox placement is not guaranteed.

Keep this boundary provider-neutral:

```ts
interface AuthMailer {
  sendLoginLink(message: LoginLinkMessage): Promise<void>
}
```

Use Cloudflare Email Sending in production only after a separate approved onboarding and deliverability check. A local capture mailer should expose the generated link in tests without sending externally. Keep an external transactional provider as the fallback from `context/foundation/infrastructure.md`.

### D1

- Use prepared statements and bound parameters.
- Apply schema changes through Wrangler migrations.
- Add indexes for token hash, session hash, learner ownership, and expiry cleanup.
- `D1Database.batch()` executes statements as one transaction and rolls the batch back when a statement fails.
- A conditional mutation is required for single-use token consumption. Avoid a `SELECT` followed by an unrelated `UPDATE`.
- Verify the selected atomic consume-and-session pattern against local D1 before treating replay protection as complete.

A practical schema boundary is:

| Table | Purpose | Critical constraints |
|---|---|---|
| `learners` | Stable learner identity | Unique normalized email. |
| `login_tokens` | Pending one-time login grants | Unique token hash; purpose; expiry; consumed timestamp; learner reference. |
| `sessions` | Revocable browser sessions | Unique session hash; expiry; learner reference; unique source login token. |

Create a session from a valid token in one transactional batch. Insert the session from a conditional `SELECT` on an unexpired, unused token, then mark the same token consumed. Enforce `UNIQUE(source_login_token_id)` so concurrent replays fail and roll back. Inspect affected-row metadata and reject zero-change batches.

Do not confuse D1's Sessions API for read replication with application authentication sessions.

### Workers Runtime

- Use `crypto.getRandomValues()` for opaque tokens and `crypto.subtle.digest()` for stored token hashes.
- Do not use `Math.random()` or store raw login/session tokens.
- Use Hono's cookie helper rather than hand-parsing cookie headers.
- Hono provides CSRF and secure-header middleware without another dependency.
- Cloudflare's Rate Limiting binding supports short fixed windows. Longer per-address throttles need application state such as D1.

## Security Model

### Login tokens

- Generate 256-bit opaque random values.
- Encode tokens in a URL-safe form.
- Store only SHA-256 hashes.
- Scope each token to the login purpose and one learner.
- Expire tokens after a short window; choose the exact launch value during planning.
- Revoke older outstanding login tokens after successful authentication.
- Never log raw query strings, login links, token values, session cookies, or email addresses.

### Scanner-safe verification

Email scanners and link previews can issue `GET` or `HEAD` automatically. Keep those methods side-effect free.

- `GET /auth/verify?token=...` validates enough to render a confirmation form but does not authenticate or consume.
- `POST /auth/verify` performs same-origin validation, atomically consumes the token, creates the session, and redirects.
- Set `Cache-Control: no-store` and `Referrer-Policy: no-referrer` on auth pages.
- Load no third-party scripts, images, analytics, or redirects on token-bearing pages.
- Redirect immediately to a token-free path after successful confirmation.

### Sessions

- Generate a token independently from the login token.
- Store only its hash in D1.
- Set `__Host-pha_session` with `Secure`, `HttpOnly`, `SameSite=Lax`, and `Path=/`; do not set `Domain`.
- Enforce server-side expiry and revocation.
- Rotate the session after authentication and future privilege changes.
- Delete the cookie and revoke the server record on logout.
- Do not place a session token in a URL.

### Abuse controls

- Return one generic acknowledgement whether a learner already exists or mail delivery succeeds.
- Rate-limit issuance by destination hash and network signal without retaining unnecessary raw request data.
- Rate-limit invalid verification attempts.
- Cap outstanding tokens per learner and prune expired tokens and sessions.
- Do not use hard account lockout; it enables denial of service.
- Keep exact thresholds configurable and resolve them during planning after account sending limits are known.

NIST does not consider email an acceptable out-of-band authenticator for higher-assurance authentication. This is acceptable for the Academy's low-risk progress account only if the product makes no strong identity or tamper-proof certification claim.

## Proposed HTTP Boundary

| Route | Method | Anonymous behavior | Authenticated behavior |
|---|---|---|---|
| `/sign-in` | GET | Render email form. | Redirect to the saved destination or dashboard. |
| `/auth/requests` | POST | Validate input, issue token, request email, return generic acknowledgement. | Rotate through the same explicit flow only when reauthentication is required. |
| `/auth/verify` | GET | Render scanner-safe confirmation or expired-link state. | Do not replace the active session on GET. |
| `/auth/verify` | POST | Consume once, create session, set cookie, redirect cleanly. | Rotate the session after successful confirmation. |
| `/logout` | POST | Return a clean signed-out state. | Revoke session and delete cookie. |

Preserve the learner's place with a stored relative `return_to` value. Accept only paths beginning with one `/` and reject protocol-relative paths such as `//example.com`; never accept an arbitrary absolute redirect URL.

## Failure Behavior

| Failure | User-visible behavior | Internal behavior |
|---|---|---|
| Invalid email | Show a field error without echoing sensitive data into logs. | Do not create a token. |
| Mail provider failure | Show the same neutral acknowledgement initially; offer retry guidance. | Record a redacted operational failure and leave no usable token if delivery was not accepted. |
| Expired or consumed link | Show one invalid-or-expired state with a fresh-request action. | Do not reveal whether the account exists. |
| Concurrent replay | One request may succeed; all others fail closed. | Unique constraint or conditional mutation rolls back the replay. |
| Missing D1 or mail binding | Fail fast outside an explicit local test mode. | Do not silently downgrade verified authentication. |
| Invalid return path | Redirect to a fixed same-origin default. | Do not preserve attacker-controlled input. |

## Test Targets

Prioritize these tests before cloud onboarding:

1. Public missions remain readable without a session.
2. Email normalization and validation reject malformed input.
3. Issuance stores hashes, never raw login tokens.
4. Request responses do not reveal account existence or provider outcome.
5. `GET` verification does not consume the token or create a session.
6. The first valid `POST` creates one session; replay fails.
7. Expired tokens fail closed.
8. Session cookies include the required attributes.
9. Logout revokes the server session and clears the cookie.
10. External and protocol-relative return paths are rejected.
11. Auth pages return `no-store` and `no-referrer`.
12. Missing bindings fail explicitly.

Add a local D1 integration test for concurrent token replay. Pure unit tests cannot prove SQLite constraints and batch behavior.

## Planning Constraints

- Deliver the login boundary before private progress CRUD.
- Keep lessons public and do not add an auth wall to `/` or mission content.
- Keep mail, token policy, persistence, and HTML views in separate small modules.
- Use existing Hono capabilities before adding dependencies.
- Do not create D1 databases, onboard a domain, enable remote email, add production bindings, or deploy without explicit approval.
- Do not claim deliverability until one approved live test covers the intended mailbox providers.

## Open Decisions

1. Which Cloudflare-managed domain or subdomain will send login mail?
2. Does the current account have Workers Paid, Email Sending eligibility, and sufficient D1 permissions?
3. What exact login-token and session lifetimes should launch use?
4. What exact per-address and network rate limits fit the account-specific sending quota?
5. Should the first implementation stop at local capture plus D1, or include approved live Email Sending onboarding?
6. What same-origin destination should replace an invalid or absent `return_to` value?

These decisions belong in the implementation plan or an approved infrastructure step. Do not infer them from the current Worker URL.

## Sources

- [Cloudflare Email Sending Workers API](https://developers.cloudflare.com/email-service/api/send-emails/workers-api/)
- [Cloudflare Email Sending bindings](https://developers.cloudflare.com/email-service/configuration/send-bindings/)
- [Cloudflare Email Sending local development](https://developers.cloudflare.com/email-service/local-development/sending/)
- [Cloudflare Email Sending limits](https://developers.cloudflare.com/email-service/platform/limits/)
- [Cloudflare Email Sending pricing](https://developers.cloudflare.com/email-service/platform/pricing/)
- [Cloudflare D1 database API](https://developers.cloudflare.com/d1/worker-api/d1-database/)
- [Cloudflare D1 prepared statements](https://developers.cloudflare.com/d1/worker-api/prepared-statements/)
- [Cloudflare D1 migrations](https://developers.cloudflare.com/d1/reference/migrations/)
- [Cloudflare D1 index guidance](https://developers.cloudflare.com/d1/best-practices/use-indexes/)
- [Cloudflare Workers Web Crypto](https://developers.cloudflare.com/workers/runtime-apis/web-crypto/)
- [Cloudflare Workers rate-limit binding](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/)
- [Hono cookie helper](https://hono.dev/docs/helpers/cookie)
- [Hono CSRF middleware](https://hono.dev/docs/middleware/builtin/csrf)
- [OWASP Forgot Password Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html)
- [OWASP Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- [OWASP CSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- [NIST SP 800-63B](https://pages.nist.gov/800-63-4/sp800-63b.html)

## Handoff

Plan a local-first implementation around D1 migrations, a provider-neutral mailer, scanner-safe magic-link confirmation, opaque hashed sessions, and replay-focused tests. Keep cloud onboarding and production deployment as explicit approval gates.