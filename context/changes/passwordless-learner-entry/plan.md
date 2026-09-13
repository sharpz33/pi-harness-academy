# Implementation Plan: Passwordless Learner Entry

## Overview

Deliver a production passwordless login vertical slice within two days. A visitor enters an email address, receives a one-time link, confirms login, returns to the public Academy, sees their authenticated state, and can log out. D1 stores learners, one-time login tokens, and revocable sessions.

Build locally first, then wire production D1 and email after explicit cloud approvals. Timebox Cloudflare Email Sending onboarding to 60 minutes; if it blocks delivery, replace only the mail adapter with the fastest approved transactional provider.

## Current State Analysis

The authentication worktree starts from `a08c9d0`, where the Worker renders one public page and has no database, email binding, migration, authentication route, or session state. The production Worker exists, but D1 and Email Sending remain explicitly deferred.

A sibling branch, `feat/public-heist-mission`, is five local commits ahead of its remote and substantially refactors `src/index.ts`, `src/styles.ts`, and tests while adding `src/views.ts`, `src/missions.ts`, and `context/foundation/roadmap.md`. Integrating that completed work before changing shared UI files avoids building authentication against an obsolete shell and then resolving large avoidable conflicts.

## Desired End State

On the public Worker:

- all lessons and mission instructions remain readable anonymously;
- a visitor can request a passwordless email link;
- a valid link opens a confirmation screen without consuming the token on `GET`;
- confirmation creates one 30-day revocable session and redirects to `/` or a safe relative `return_to` path;
- reused, expired, malformed, or concurrently replayed tokens fail closed;
- the homepage shows signed-in state and a `POST` logout action;
- D1 contains no raw login or session tokens;
- production delivery works through Cloudflare Email Sending or one approved fallback provider.

### Key findings

- `src/index.ts:19-36` currently owns middleware and routes in one file; auth needs small policy, persistence, delivery, and view boundaries.
- `src/index.test.ts:4` establishes response-level Hono tests that can cover anonymous and authenticated routes.
- `wrangler.jsonc:24` contains only a commented D1 example; no runtime binding exists.
- `package.json:7-12` already defines one `npm run check` gate and Cloudflare type generation.
- `AGENTS.md:7` forbids gating lesson knowledge behind authentication.
- `AGENTS.md:14` requires explicit approval for Cloudflare resources and production deploys.
- `AGENTS.md:32` records D1 and Email Sending as unconfigured.
- `context/foundation/prd.md:91-95` makes passwordless email a must-have while preserving retry and expiry feedback.
- `context/changes/deployment/verification.md:49` confirms that D1, Email Sending, custom domain, and OTP were deferred from the first deploy.
- The user approved production login, plans to buy a sender domain on 2026-09-13, and approved a provider fallback.

## What We Are NOT Doing

- No private mission-progress CRUD in this change.
- No companion profile authorization, checkpoint verification, readiness score, proof, LinkedIn sharing, or badge.
- No admin panel, MFA, passkeys, account-management page, email change, or account recovery.
- No idle session timeout, session-device list, suspicious-login notification, or multi-provider failover.
- No preview database environment or automated production deployment.
- No broad analytics or logging of email addresses, raw URLs, tokens, cookies, or request bodies.
- No refactor unrelated to authentication or the minimum homepage login state.
- No production resource creation, DNS change, email send, migration, or deployment without the required approval.

## Implementation Approach

Use first-party Hono routes, Workers Web Crypto, D1, and a narrow `AuthMailer` interface. Do not add an authentication framework. Create learners when a login link is requested because that yields the simplest two-day data model; expired empty learners may be cleaned later.

Use 256-bit random login and session tokens, store SHA-256 hashes only, and keep magic links valid for 10 minutes. A `GET` verifies enough to render confirmation but does not mutate state. A same-origin `POST` creates a session from an eligible token and consumes that token in one D1 batch. A unique `source_login_token_id` prevents concurrent replay. Sessions expire after 30 days and are revocable through logout.

Use a Cloudflare Email Sending adapter first. Wrangler's local email simulator supplies the development capture path. Keep provider-specific calls inside one module so the fallback changes delivery code and binding configuration, not routes, token policy, or D1.

Apply a simple launch throttle: no more than three login tokens per normalized email in 15 minutes. Do not add network-rate infrastructure until the account-specific email quota is known. Return an explicit neutral retry error when the provider rejects delivery; never reveal whether an account existed before the request.

## Critical Implementation Details

### Branch sequencing

Do not edit the old inline homepage first. Integrate the clean `feat/public-heist-mission` work into this branch, resolve shared-file conflicts once, run `npm run check`, and then implement auth against its extracted views and mission routes. Preserve the public mission behavior and local evidence boundary.

### Token and session sequencing

Keep `GET /auth/verify` side-effect free because mailbox scanners may follow links. On `POST`, insert a session through a conditional `SELECT` from an unexpired, unused token, then mark that token consumed in the same D1 batch. Require one inserted session row before setting the cookie. The unique source-token constraint makes a concurrent second batch fail or produce zero changes.

If email delivery is rejected, invalidate the newly created token before returning a neutral retry screen. Never derive the magic-link origin from `Host`; use a configured canonical application origin.

## Phase 1: Build the Local Authentication Vertical Slice

### Overview

Bring the auth branch onto the completed public-mission baseline, add the D1 schema and passwordless domain logic, expose the minimum UI, and prove the security invariants locally.

### Required Changes

#### 1. Integrate the current public-mission baseline

**Files:** Git history plus files changed by `feat/public-heist-mission`

**Purpose:** Prevent auth work from targeting the obsolete single-page shell.

**Contract:** Start from a clean worktree. Integrate all five local commits currently ahead of `origin/feat/public-heist-mission` using a non-destructive merge or rebase chosen at implementation time. Preserve the completed mission routes, views, styles, tests, and context artifacts. Run the existing gate before auth edits. Do not push or merge to `main` without a separate user request.

#### 2. Add the authentication schema and local bindings

**Files:** `migrations/0001_passwordless_auth.sql`, `wrangler.jsonc`, generated Cloudflare binding types, `package.json`

**Purpose:** Define the smallest persistent model and repeatable local setup.

**Contract:** Add:

- `learners`: opaque ID, unique normalized email, creation timestamp;
- `login_tokens`: opaque ID, learner reference, unique token hash, safe relative return path, created/expiry/consumed timestamps;
- `sessions`: opaque ID, learner reference, unique session hash, unique source login-token reference, created/expiry/revoked timestamps;
- indexes for login-token hash and expiry, session hash and expiry, and learner ownership lookup.

Enable foreign keys in the migration. Add local migration and query scripts without embedding credentials or production database IDs. Configure `DB`, `EMAIL`, canonical origin, and sender address names. Use an explicit local placeholder where Wrangler requires an ID; replace it only after production D1 creation. Regenerate binding types after configuration changes.

#### 3. Implement auth policy and persistence

**Files:** `src/auth/config.ts`, `src/auth/crypto.ts`, `src/auth/store.ts`, `src/auth/types.ts`

**Purpose:** Keep token rules and SQL outside route rendering.

**Contract:** Implement:

- conservative email trimming, lowercase normalization, and length/shape validation;
- safe relative-return validation that accepts one leading `/` and rejects `//`, schemes, control characters, and backslashes;
- 32-byte URL-safe random token generation;
- SHA-256 hashing for login and session tokens;
- 10-minute login-token expiry and 30-day absolute session expiry;
- learner upsert and pending-token creation;
- three-per-15-minute issuance check by learner;
- non-consuming token inspection for confirmation pages;
- transactional one-time consume plus session creation;
- session lookup by cookie hash and revocation on logout.

Bind every SQL value. Return typed domain results such as `issued`, `rate_limited`, `invalid_or_expired`, `authenticated`, and `signed_out`; routes must not infer security state from thrown SQL errors.

#### 4. Add the mail boundary

**Files:** `src/auth/mailer.ts`, `src/auth/email.ts`

**Purpose:** Send one transactional login message while retaining a fast provider fallback.

**Contract:** Define one `AuthMailer.sendLoginLink()` interface and one Cloudflare adapter. Construct links only from the configured canonical origin. The message contains the 10-minute validity notice and a plain fallback URL. Do not include private progress or unrelated content. Let Wrangler simulate local sends. Map provider rejection to a typed delivery failure; invalidate the token and show retry guidance.

If the 60-minute production onboarding circuit breaker trips in Phase 2, add one fallback implementation behind this interface. Do not implement both providers in advance.

#### 5. Add auth routes and authenticated shell state

**Files:** `src/index.ts`, `src/views.ts`, `src/styles.ts`, optional `src/auth/routes.ts`

**Purpose:** Expose the complete learner-visible entry flow without gating lessons.

**Contract:** Add:

- `GET /sign-in` — render an accessible email form;
- `POST /auth/requests` — validate, throttle, issue, send, and render acknowledgement or neutral retry;
- `GET /auth/verify?token=...` — render confirmation or invalid/expired state without consuming;
- `POST /auth/verify` — verify same-origin form submission, consume once, set session cookie, and redirect cleanly;
- `POST /logout` — revoke the current session and delete the cookie.

Use `__Host-pha_session` with `Secure`, `HttpOnly`, `SameSite=Lax`, and `Path=/`, without `Domain`. Add `Cache-Control: no-store` and `Referrer-Policy: no-referrer` to token-bearing and authenticated responses. Keep third-party assets off verification pages. Show only a masked or generic signed-in indicator on the homepage; do not render the learner's full email.

Retain all anonymous mission routes and existing CSP behavior. Use progressive server-rendered forms and keyboard-visible focus styles; do not add a client framework.

#### 6. Add focused tests

**Files:** `src/auth/*.test.ts`, `src/index.test.ts`, optional local D1 verification fixture

**Purpose:** Prove the minimum invariants that cannot be deferred safely.

**Contract:** Cover:

- anonymous mission access remains unchanged;
- valid and invalid email normalization;
- safe and unsafe return paths;
- stored values are hashes rather than raw tokens;
- `GET` verification does not consume or authenticate;
- first valid `POST` creates one session;
- replay and expiry fail closed;
- cookie attributes are correct;
- logout revokes the session and clears the cookie;
- rate limiting blocks the fourth request in the window;
- missing bindings fail explicitly;
- provider rejection invalidates the pending token and returns neutral retry guidance.

Prefer injected clock, token generator, store, and mailer boundaries for deterministic route tests. Apply the migration to local D1 as a schema gate. If a deterministic concurrent-D1 harness cannot be added quickly, record replay concurrency as a mandatory production smoke case instead of building a new test framework.

### Success Criteria

#### Automated Verification

- The public-mission baseline passes before auth edits: `npm run check`.
- Local D1 migration applies cleanly through the new package script.
- Auth and route tests pass: `npm test`.
- Type checking passes: `npm run typecheck`.
- Full gate passes with configured local bindings: `npm run check`.
- Dependency audit reports no unresolved critical blocker: `npm audit`.
- Patch formatting passes: `git diff --check`.

#### Manual Verification

- A local user requests a link, retrieves it from Wrangler's simulator, confirms, returns to `/`, sees signed-in state, and logs out.
- Anonymous users can still open `/` and all implemented public mission pages.
- Opening the verification URL without confirming does not create a session.
- Reusing the link after confirmation shows the invalid-or-expired state.

**Implementation note:** Stop after this phase only for a fast manual local-flow confirmation. Do not wait for domain purchase to begin Phase 1.

## Phase 2: Wire Production D1 and Email Delivery

### Overview

Create only the production resources required by the approved login slice, connect real delivery, and deploy after separate action-level confirmations.

### Required Changes

#### 1. Run the cloud safety and account preflight

**Files:** `context/changes/passwordless-learner-entry/production-runbook.md`

**Purpose:** Make the irreversible and billable actions explicit before execution.

**Contract:** Before any Cloudflare action, read `~/Projects/clients/039.autofirma/COSTSEC/docs/CLOUD_SAFETY.md`. Verify the target account, Workers Paid status, D1 permissions, sender-domain ownership, Email Sending eligibility, current quota, Worker name, and expected cost. Record commands with secret names only. Do not record token values or private account metadata.

#### 2. Create and migrate production D1

**Files:** `wrangler.jsonc`, generated binding types, production runbook

**Purpose:** Give the deployed Worker persistent auth storage.

**Contract:** Ask for explicit approval naming the D1 database before creation. Record the returned non-secret database ID in Wrangler configuration, apply the reviewed migration remotely after a second explicit confirmation, and verify tables/indexes without reading learner data. Capture rollback constraints: Worker rollback does not undo D1 migrations.

#### 3. Activate transactional email with a circuit breaker

**Files:** `wrangler.jsonc`, `src/auth/mailer.ts`, production runbook; fallback adapter only if required

**Purpose:** Deliver login links to arbitrary learners.

**Contract:** After the user acquires a domain, verify it is controlled in the intended account. Ask before DNS or Email Sending onboarding. Timebox Cloudflare setup and one approved delivery test to 60 minutes.

If Cloudflare cannot send to an arbitrary approved test recipient within the timebox, stop troubleshooting. Select one transactional provider that can be activated fastest with the available domain, store its credential only as a Worker secret, implement its adapter, rerun checks, and perform one approved delivery test. Never use a developer-only sender as evidence of arbitrary-recipient readiness.

#### 4. Deploy the authenticated Worker

**Files:** deployment workflow or local deployment command, `CHANGELOG.md`, production runbook

**Purpose:** Publish the tested vertical slice without bypassing existing safeguards.

**Contract:** Run `npm ci`, `npm run check`, `npm audit`, secret scan, and `git diff --check`. Commit and push through the protected branch flow. Ask explicitly before production deployment. Record deployed commit, Worker version, public URL, D1 binding, mail-provider choice, and non-sensitive verification result. Do not enable automatic deployment in this change.

### Success Criteria

#### Automated Verification

- Production configuration passes `npm run check` and Wrangler dry-run.
- Remote D1 migration reports success for the intended database.
- CI required check passes on the exact deployment commit.
- A secret scan finds no credential values, raw tokens, personal test addresses, or `.env` files in the publication set.

#### Manual Verification

- The user confirms the exact Cloudflare account, D1 database, sender domain, provider, and production Worker before side effects.
- One approved mailbox receives the login email and the link opens the confirmation page.
- Production deployment returns the expected Worker version and public URL.

**Implementation note:** Resource creation, remote migration, DNS changes, secret writes, external email, and deployment each remain explicit side effects. Group confirmations only when the exact operations and targets are shown together.

## Phase 3: Run the Production Smoke Gate

### Overview

Prove the visible login path and highest-risk failure modes on the deployed Worker, then fix only release blockers.

### Required Changes

#### 1. Execute the smoke matrix

**Files:** `context/changes/passwordless-learner-entry/verification.md`

**Purpose:** Distinguish a deployed bundle from a working learner journey.

**Contract:** Record timestamp, deployed commit/version, public URL, provider, and pass/fail without storing the test email, token, cookie, raw link, or D1 row content. Verify:

- anonymous homepage and public mission access;
- successful login request and real email receipt;
- scanner-safe `GET` does not authenticate;
- confirmation authenticates and redirects to a clean URL;
- refresh preserves the session;
- logout revokes it;
- link replay and an expired-link fixture fail closed;
- a second browser without the session remains anonymous;
- security and no-store headers remain present;
- filtered runtime error tail contains no unexpected auth failure or sensitive value.

#### 2. Apply the deadline release rule

**Files:** only files required by a failed smoke case

**Purpose:** Prevent late scope expansion.

**Contract:** Fix only blockers to login, logout, public lesson access, token single-use, session persistence, data isolation, email delivery, or deployment. Record non-blocking hardening as deferred work. Rerun the smallest failed test plus `npm run check`, redeploy only with approval, and repeat the affected smoke cases.

#### 3. Close the change evidence

**Files:** `context/changes/passwordless-learner-entry/verification.md`, `CHANGELOG.md`, `context/foundation/roadmap.md`

**Purpose:** Make completion and remaining risk visible to the next project slice.

**Contract:** Record final evidence, provider choice, accepted deferrals, and operational retry path. Set roadmap item S-02 to `done` only after real email login passes; otherwise leave it blocked with the exact external blocker. Update the change lifecycle only through the implementation/review/archive workflow.

### Success Criteria

#### Automated Verification

- Final `npm run check` passes on the deployed commit.
- Final CI required check passes.
- `git diff --check` and secret scan pass.

#### Manual Verification

- A new learner completes the production email-login flow end to end.
- Anonymous lesson access remains intact.
- Token replay, logout, and isolated-browser checks fail or succeed exactly as specified.
- Verification evidence contains no email address, token, cookie, secret, or raw login URL.

## Testing Strategy

### Unit and Route Tests

- Normalize and validate email and return paths.
- Generate, encode, and hash tokens deterministically through injected dependencies.
- Enforce token and session expiry with an injected clock.
- Verify route status, headers, redirects, cookie attributes, generic errors, and public-route behavior.
- Test issuance throttle and provider rejection through fake store and mailer implementations.

### D1 Verification

- Apply the migration to a fresh local database.
- Verify unique email, login-token hash, session hash, and source-token constraints.
- Verify conditional session creation and token consumption produce one success and reject replay.
- Apply the same reviewed migration remotely only after approval.

### Manual Production Tests

1. Open the Academy anonymously and verify public content.
2. Request login for the approved test mailbox.
3. Open the link and confirm that `GET` alone has not logged in.
4. Submit confirmation and verify a clean redirect plus persistent signed-in state.
5. Reopen the raw link and verify rejection.
6. Log out and verify the session cannot be reused.
7. Open the site in a separate browser profile and verify it remains anonymous.

## Performance Notes

Use indexed hash lookups for tokens and sessions. Avoid session writes on every authenticated request; a 30-day absolute expiry needs reads only until logout or expiry. Prune expired tokens and sessions manually after launch if volume appears; do not add scheduled jobs before evidence requires them.

## Migration Notes

This is the first application-data migration, so no user data backfill is required. Keep the migration forward-compatible because Worker rollback cannot remove D1 schema safely. Do not include destructive rollback SQL in the launch procedure.

The auth worktree must first incorporate `feat/public-heist-mission`. Its roadmap currently marks S-02 blocked; update it to `planning` during implementation after the branch content exists here. Do not copy the roadmap file independently and create a divergent canonical document.

## References

- Related research: `context/changes/passwordless-learner-entry/research.md`
- Product requirement: `context/foundation/prd.md:91-95`
- Repository safety: `AGENTS.md:7-14`
- Deployment baseline: `context/changes/deployment/verification.md`
- Cloudflare Email Sending Workers API: <https://developers.cloudflare.com/email-service/api/send-emails/workers-api/>
- Cloudflare Email Sending local development: <https://developers.cloudflare.com/email-service/local-development/sending/>
- Cloudflare D1 migrations: <https://developers.cloudflare.com/d1/reference/migrations/>
- Hono cookie helper: <https://hono.dev/docs/helpers/cookie>
- OWASP Session Management Cheat Sheet: <https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html>

## Progress

> Convention: `- [ ]` pending, `- [x]` complete. Append ` — <commit sha>` when a step is implemented. Do not rename step titles.

### Phase 1: Build the Local Authentication Vertical Slice

#### Automated

- [x] 1.1 Public-mission baseline passes before auth edits — 534b344
- [x] 1.2 Local D1 migration applies cleanly — 534b344
- [x] 1.3 Auth and route tests pass — 534b344
- [x] 1.4 Type checking passes — 534b344
- [x] 1.5 Full local quality gate passes — 534b344
- [x] 1.6 Dependency audit has no unresolved critical blocker — 534b344
- [x] 1.7 Patch formatting passes — 534b344

#### Manual

- [x] 1.8 Local magic-link login and logout work through Wrangler simulation — 534b344
- [x] 1.9 Anonymous public content remains available — 534b344
- [x] 1.10 Verification GET is side-effect free — 534b344
- [x] 1.11 Consumed-link replay is rejected — 534b344

### Phase 2: Wire Production D1 and Email Delivery

#### Automated

- [x] 2.1 Production configuration and dry-run pass
- [x] 2.2 Approved remote D1 migration succeeds
- [ ] 2.3 CI passes on the deployment commit
- [x] 2.4 Publication secret scan passes

#### Manual

- [x] 2.5 Production targets and side effects are explicitly approved
- [x] 2.6 Approved mailbox receives a working login link
- [ ] 2.7 Production deployment returns the expected version and URL

### Phase 3: Run the Production Smoke Gate

#### Automated

- [ ] 3.1 Final quality gate passes on the deployed commit
- [ ] 3.2 Final CI required check passes
- [ ] 3.3 Final patch and secret checks pass

#### Manual

- [ ] 3.4 New learner completes production email login end to end
- [ ] 3.5 Anonymous lesson access remains intact
- [ ] 3.6 Replay, logout, and browser-isolation checks match the contract
- [ ] 3.7 Verification evidence contains no sensitive auth material
