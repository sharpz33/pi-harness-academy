# Pi Harness Academy

Pi Harness Academy is a public, twelve-mission path for turning a minimal Pi coding agent into a controlled multi-agent pull-request pipeline. Every lesson and mission instruction remains readable without an account. Authentication will protect only verified checkpoints, private progress, readiness, synchronization, and completion proof.

The repository contains Mission Control, all twelve public lessons, production passwordless login, and the Academy companion extension. The companion uses a revocable device credential to submit a fixed allowlist of local checkpoint booleans; it never submits source, paths, prompts, environment values, credentials, or transcripts. Fresh Pi users may follow the Academy in their default profile; learners with an existing Pi setup are offered a separate Academy profile.

## Stack

- TypeScript and Hono
- Cloudflare Workers
- Server-rendered HTML and small vanilla browser enhancements
- Cloudflare D1 and transactional email for the verified journey
- GitHub Actions for checks and deployment through Wrangler

The product and infrastructure decisions are recorded in `context/foundation/`.

- Live application (English): <https://piacade.my>
- Polish version: <https://piacade.my/pl>
- Required CI: <https://github.com/sharpz33/pi-harness-academy/actions/workflows/ci.yml>
- Pinned companion release: [`verified-journey-v0.2.0`](https://github.com/sharpz33/pi-harness-academy/tree/verified-journey-v0.2.0)

## Core product flow

1. Read any of the twelve lessons without an account.
2. Sign in through a scanner-safe passwordless email flow to create a private learner session.
3. Authorize a selected Pi profile with `/academy-connect` and a short code.
4. Complete a mission locally, then submit its allowlisted evidence with `/academy-check <mission-slug>`.
5. Review private progress, readiness, and the recommended next mission.
6. Revoke a profile or explicitly delete progress; after 12/12 missions, optionally publish a revocable completion proof.

The domain CRUD is learner-owned: authorization and checkpoint submission create records, Journey reads them, repeated verified checkpoints update idempotently, and learners can revoke profiles or delete progress. Business rules enforce ownership, sequential unlocking, exact evidence IDs, readiness calculation, next-mission selection, and completion-gated public proof.

## Language versions

English remains available at the original unprefixed routes. Polish pages use `/pl` and provide equivalent public, authentication, Journey, device, deletion, and completion-proof views. Mission prompts, command values, slugs, evidence IDs, and API payloads remain English and language-neutral to preserve their reviewed behavior.

## Local development

Requirements: Node.js 24 or newer and npm.

```sh
npm ci
npm run cf-typegen
npm run db:migrate:local
npm run dev
```

Wrangler prints the local URL and captures passwordless messages through its local Email Sending simulator. The local environment uses an isolated D1 database and does not require production Cloudflare resources.

## Verified journey

After reviewing the pinned companion source, install it in the Pi profile selected for the Academy journey:

```sh
pi install git:github.com/sharpz33/pi-harness-academy@verified-journey-v0.2.0
```

Run `/academy-connect`, approve the matching short code in the browser, complete a mission, then run `/academy-check <mission-slug>`. Checkpoints unlock sequentially. The scoped credential is stored only in the selected Pi profile with restrictive file permissions and can be revoked from the private Journey page.

## Quality and release checks

```sh
npm ci
npm run check
npm audit --audit-level=low
git diff --check
```

`npm run check` runs TypeScript validation, Vitest, and a Wrangler deployment dry-run. Review the publication diff for credentials, private paths, transcripts, and `.ai/` content before requesting deployment approval.

## Deployment safety

Production deployment and cloud-resource creation require explicit human approval. Runtime secrets belong in Cloudflare Workers Secrets and CI credentials belong in GitHub Actions secrets; never commit their values.

The approved first-deployment plan is in `context/changes/deployment/deployment-plan.md`.

## Current mission sequence

1. The Heist
2. X-Ray Vision
3. Eyes & Hands
4. The Time Machine
5. Total Recall
6. Hindsight
7. The Forge
8. Clone Protocol
9. Council of Minds
10. The Crew
11. Escape the Terminal
12. The Gauntlet
