# Passwordless Learner Entry — Short Plan

> Full plan: `context/changes/passwordless-learner-entry/plan.md`
> Research: `context/changes/passwordless-learner-entry/research.md`

## What and Why

Ship production passwordless login within two days so Academy can identify a learner before adding private progress and companion checkpoints. Keep every lesson public; authentication protects only the verified journey.

## Starting Point

The public Worker exists, but D1, email delivery, login routes, and sessions do not. The auth worktree also starts before the completed local `feat/public-heist-mission` work, so integrate that branch before editing shared UI files.

## Desired End State

A visitor requests a magic link, confirms it, returns to Academy with a revocable session, and can log out. Token replay and expiry fail closed, anonymous lessons remain available, and one real mailbox completes the flow on the production Worker.

## Key Decisions

| Decision | Choice | Why | Source |
|---|---|---|---|
| Delivery target | Production login in this change | The project has a two-day completion window. | Plan |
| Storage | Cloudflare D1 | It fits the existing Worker stack and avoids migration. | Research |
| Email | Cloudflare first; 60-minute fallback trigger | Avoid losing the delivery window to onboarding. | Plan |
| Domain | Acquire and configure on 2026-09-13 | No sender domain is currently available. | User |
| Login token | 256-bit opaque token, hashed, 10-minute expiry | Keep the implementation simple and replay window short. | Research / Plan |
| Verification | Safe `GET`, consuming `POST` | Mail scanners must not consume the link. | Research |
| Session | Hashed opaque token, 30-day absolute expiry | Favor low-friction course resume without idle-timeout logic. | Plan |
| Learner creation | Create at link request | Simplify token ownership and D1 transactions under deadline. | Plan |
| Throttle | Three requests per email per 15 minutes | Protect basic quota without adding network infrastructure. | Plan |
| Default return | `/` | Reuse the existing Mission Control route. | Plan |

## Scope

**In scope:**

- D1 learners, login tokens, and sessions;
- email request, confirmation, authenticated shell state, and logout;
- Cloudflare Email Sending plus one fallback adapter only if onboarding fails;
- local tests, production deployment, and end-to-end smoke verification.

**Out of scope:**

- progress CRUD and checkpoint verification;
- account management, MFA, recovery, idle timeout, and session-device UI;
- badges, proof, LinkedIn, analytics, preview database, and automatic deployment;
- hardening that does not block the production login path.

## Architecture

```text
Browser forms
    ↓
Hono auth routes
    ├── auth policy + Web Crypto
    ├── D1 store → learners / login_tokens / sessions
    └── AuthMailer → Cloudflare Email Sending
                       └── approved provider fallback only if blocked
```

Wrangler simulates email locally. Production resources and external sends remain separately approved side effects.

## Phases at a Glance

| Phase | Delivers | Key risk |
|---|---|---|
| 1. Local vertical slice | Schema, routes, token/session policy, UI, tests | Auth branch is behind the public-mission branch. |
| 2. Production wiring | D1, sender domain, email delivery, deployed Worker | Domain or Cloudflare eligibility blocks mail. |
| 3. Smoke gate | Real login evidence and blocker-only fixes | A deployed bundle may still fail delivery or replay behavior. |

**Prerequisites:** Clean integration of `feat/public-heist-mission`; sender domain on 2026-09-13; explicit approvals for Cloudflare resources, DNS, remote migration, email test, secrets, and deployment.

**Estimated effort:** Two days in three phases. Finish Phase 1 before domain onboarding. Give Cloudflare Email Sending at most 60 minutes before switching the mail adapter.

## Open Risks and Assumptions

- `feat/public-heist-mission` has five local commits not yet on its remote; preserve all of them during integration.
- Cloudflare account eligibility, Workers Paid status, D1 permissions, and email quota are still unverified.
- Sender-domain acquisition and DNS propagation may consume the production window.
- If deterministic concurrent D1 testing requires a new harness, prove replay in the mandatory production smoke gate instead of expanding tooling.
- Creating learners at request time can leave empty records; accept this for MVP and prune later if needed.

## Success Summary

- A new learner receives and completes a real production magic-link login.
- Token replay, expiry, logout, and a second browser fail closed.
- Public lessons stay anonymous and the repository contains no auth secrets or raw tokens.
