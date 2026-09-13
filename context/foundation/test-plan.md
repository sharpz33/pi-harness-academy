---
project: Pi Harness Academy
status: active
updated: 2026-09-13
---

# Test Plan

## Quality objective

Protect the shortest complete learner journey: public lesson → passwordless login → authorized Pi profile → allowlisted checkpoint → private progress and readiness → privacy-safe completion proof.

The product fails closed when identity, authorization, evidence, ordering, ownership, or a required external dependency cannot be established.

## Highest-risk assumptions

| Risk | Failure impact | Primary evidence |
|---|---|---|
| Email delivery or scanner consumption blocks login | Learners cannot save progress | Real-mail production smoke; side-effect-free verification GET; replay test |
| A device credential crosses learner boundaries | Private progress can be modified by another learner | Hashed bearer lookup and learner-bound writes; ownership route/store tests |
| Companion submits private machine data | Source, prompts, paths, or secrets leave the machine | Fixed mission/check allowlists; bounded JSON contract; publication scan |
| Duplicate or out-of-order checkpoints corrupt progression | Readiness and unlocks become false | Idempotency and sequential-lock service tests; local D1 E2E smoke |
| Public content becomes gated by auth | Core learning promise breaks | Anonymous route matrix for all twelve missions |
| Completion proof leaks identity or remains after deletion | Privacy promise breaks | Public-proof rendering test; deletion/revocation E2E smoke |
| Production schema and Worker drift | Tested code cannot execute | Local and remote migrations; Wrangler dry-run; protected-main CI; production smoke |

## Automated layers

### Unit and domain

- Email normalization, expiry, hashing, token shape, throttling, replay, and provider failure.
- Device-code approval, one-time exchange, credential hashing, expiry, and revocation.
- Exact mission evidence allowlists; unknown or missing checks fail closed.
- Sequential mission eligibility and idempotent repeated completion.
- Readiness and next-mission recommendation derive from completed mission slugs.
- Completion proof requires all twelve missions and normalizes the selected display name.
- Progress deletion revokes completion proof.

### HTTP routes

- All twelve lessons return public HTML without cookies or authentication challenges.
- Auth, device, journey, API, and proof responses use `no-store` where state or identity is involved.
- Cross-origin form submissions are rejected.
- Private Journey routes use only the learner identity from the opaque session.
- Checkpoints require a valid bearer device credential.
- Public proof contains selected display name and completion only, with no learner ID, email, or detailed progress.
- Security headers remain present.

### Schema and integration

Apply every migration to fresh local D1. Run local HTTP E2E flows against Wrangler:

1. create and approve device authorization;
2. exchange once for a scoped credential;
3. submit The Heist and verify 8% readiness;
4. repeat submission and verify idempotency;
5. revoke profile and verify the credential receives 401;
6. delete progress and verify readiness returns to 0%;
7. seed all twelve completions, publish proof, verify public privacy, delete progress, and verify proof returns 404.

### Companion package

- Root Pi manifest discovers `companion/index.ts`.
- Extension registers `/academy-connect` and `/academy-check`.
- Mission/check identifiers derive from the canonical curriculum.
- Credential and evidence files reject symlinks, non-files, and oversized input.
- Scoped credential is written atomically with mode `0600`.
- User-visible failures omit absolute paths, raw credentials, and evidence content.
- Install the pinned git tag into a disposable Pi profile before release.

## Manual production gate

1. Verify homepage and all twelve lesson URLs anonymously.
2. Receive and confirm one real passwordless email.
3. Install the pinned companion in the chosen Pi profile.
4. Run `/academy-connect`; compare and approve the short code.
5. Complete The Heist and run `/academy-check the-heist`.
6. Verify Journey shows 8% readiness and X-Ray Vision next.
7. Repeat the checkpoint and verify no duplicate completion.
8. Revoke the Pi profile and verify further submissions fail.
9. In a separate browser, verify private Journey remains inaccessible.
10. Complete a controlled all-mission fixture, publish proof, inspect public fields, revoke/delete, and verify the URL fails closed.
11. Check filtered Worker error logs without capturing tokens, cookies, addresses, or row content.

## Release commands

```sh
npm ci
npm run db:migrate:local
npm run check
npm audit --audit-level=low
git diff --check
```

Run a publication scan for credentials, private addresses, raw auth material, `.env` files, and generated evidence before merge. Production migrations, tags, email sends, and deployments require explicit approval.

## Exit criteria

- Required CI passes on the merge commit.
- Production uses that merge commit and expected D1 migrations.
- The manual journey reaches verified progress through the pinned companion.
- Anonymous lessons still work.
- No unresolved blocker affects login, profile authorization, checkpoint integrity, ownership, readiness, completion proof, or privacy.
