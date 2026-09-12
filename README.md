# Pi Harness Academy

Pi Harness Academy is a public, twelve-mission path for turning a minimal Pi coding agent into a controlled multi-agent pull-request pipeline. Every lesson and mission instruction will remain readable without an account. Authentication will protect only verified checkpoints, private progress, readiness, synchronization, and completion proof.

The repository currently contains the first public Mission Control shell. Authentication, D1 persistence, companion authorization, and checkpoint verification are not implemented yet. Fresh Pi users may follow the Academy in their default profile; learners with an existing Pi setup are offered a separate Academy profile.

## Stack

- TypeScript and Hono
- Cloudflare Workers
- Server-rendered HTML and small vanilla browser enhancements
- Cloudflare D1 and transactional email for the verified journey
- GitHub Actions for checks and deployment through Wrangler

The product and infrastructure decisions are recorded in `context/foundation/`.

## Local development

Requirements: Node.js 24 or newer and npm.

```sh
npm install
npm run dev
```

Wrangler prints the local URL. The application does not require Cloudflare resources for the current public shell.

## Quality checks

```sh
npm run check
```

The check runs TypeScript validation, Vitest, and a Wrangler deployment dry-run. Run `npm audit` separately to inspect known dependency vulnerabilities.

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
