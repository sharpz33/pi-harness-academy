---
project: Pi Harness Academy
researched_at: 2026-09-11T14:45:51+02:00
recommended_platform: Cloudflare Workers
runner_up: Cloudflare Workers with external transactional email
context_type: mvp
tech_stack:
  language: TypeScript
  framework: Hono
  runtime: Cloudflare Workers
---

# Infrastructure Decision

## Recommendation

**Deploy on Cloudflare Workers.**

Cloudflare is the only candidate that runs the selected Hono/Workers/D1 stack without a runtime or database migration. It also matches the developer's existing experience, keeps the Worker and managed data services with one provider, supports CLI-driven operations, and provides a low-cost path for an after-hours MVP. Use Workers Paid because arbitrary Email Sending recipients require it; treat Email Sending as a launch risk until account access and deliverability are tested.

## Platform Comparison

Scoring uses Pass = 2, Partial = 1, Fail = 0. Compatibility with the frozen stack is a hard filter and is not included in the numerical total.

| Platform | CLI-first | Managed/serverless | Agent-readable docs | Stable deploy API | MCP/integration | Total | Frozen-stack compatibility |
|---|---|---|---|---|---|---:|---|
| Cloudflare | Pass | Pass | Pass | Pass | Pass | 10/10 | Native |
| Vercel | Pass | Pass | Pass | Pass | Pass | 10/10 | Requires runtime and D1 migration |
| Netlify | Partial | Pass | Pass | Pass | Pass | 9/10 | Requires adapter and D1 migration |
| Fly.io | Pass | Partial | Pass | Pass | Pass | 9/10 | Requires Node/container and database migration |
| Railway | Partial | Partial | Partial | Pass | Pass | 7/10 | Requires Node and database migration |
| Render | Partial | Pass | Pass | Pass | Pass | 9/10 | Requires Node and database migration |

Cloudflare provides `wrangler` for deploys, logs, versions, and rollback; Workers and D1 are managed services; Cloudflare publishes `llms.txt`, `llms-full.txt`, and Markdown documentation. Workers Paid starts at USD 5/month and includes usage far above the expected initial traffic. D1 is GA. Email Sending is public beta and requires Workers Paid plus a sending domain on Cloudflare DNS.

Vercel has strong preview, rollback, logs, CLI, and hosted MCP support. It is disqualified for the current stack because D1 bindings are unavailable and commercial use requires a runtime/database redesign; Pro starts at USD 20/month.

Netlify has an official Hono Edge adapter, documented CLI, hosted MCP, deploy previews, and a GA serverless database. Rollback is available through UI or REST API rather than a dedicated CLI command. Its email integration still requires an external email provider, and adopting it would replace the current Worker and D1 setup.

Fly.io offers excellent `flyctl` and MCP operations and supports persistent Machines, but this application does not need persistent processes. Moving there requires a Node/container target and a different database; managed Postgres creates a much higher baseline cost than D1.

Railway offers fast deployment, an official Hono guide, usage-based pricing, and MCP. Arbitrary rollback remains dashboard-oriented, and its standard database templates are explicitly self-managed, increasing operational work for a solo MVP.

Render provides managed services, an official CLI and MCP server, an API for deployment and rollback, and managed Postgres. It still requires a Node service and database migration, while its free tier has cold starts and temporary free Postgres unsuitable for this authentication flow.

### Approved Deployment Paths

#### 1. Cloudflare Workers + D1 + Email Sending (Recommended)

Native fit for Hono, D1, Workers runtime, Wrangler, and the desired single-provider architecture. It wins on migration cost, existing familiarity, operating cost, and deployment simplicity.

#### 2. Cloudflare Workers + D1 + External Transactional Email (Fallback)

Keep the Worker runtime, D1 data model, deployment flow, and application architecture unchanged. Replace only the provider-neutral mail adapter if Cloudflare Email Sending account access, limits, or deliverability fail the launch test.

No alternative hosting platform is approved for this MVP. Netlify, Vercel, Fly.io, Railway, and Render remain evaluated-and-rejected candidates in the comparison above; the deadline does not justify a runtime or database migration. If a platform-level fallback becomes necessary, evaluate AWS as a new decision rather than promoting one of these rejected candidates.

## Anti-Bias Cross-Check: Cloudflare Workers

### Devil's Advocate — Weaknesses

1. Email Sending remains public beta; arbitrary recipients require Workers Paid, Cloudflare DNS, sender onboarding, and sufficient account reputation.
2. A new account's daily email limit or poor Gmail, Outlook, or Yahoo deliverability can block OTP even when application code is correct.
3. D1 executes queries serially within one database; missing indexes can increase rows read, latency, and quota consumption.
4. Worker rollback restores code routing but does not undo D1 migrations, data writes, bindings, or secret changes.
5. Node-oriented libraries may require `nodejs_compat` or remain incompatible with the Workers runtime.

### Pre-Mortem — How This Could Fail

The team implemented the complete authentication flow before testing Email Sending on the actual Cloudflare account and domain. Onboarding required Workers Paid, DNS changes, and a higher daily sending limit, while messages to some mailbox providers landed in spam. Because the auth code was tightly coupled to the beta service, switching providers shortly before the deadline caused a costly rewrite.

At the same time, local and preview environments did not have isolated D1 databases. A preview deployment wrote test accounts into production. A later Worker rollback restored application code but did not reverse the schema migration or contaminated data. Recovery took longer because there was no migration ledger or restore procedure.

Finally, progress queries that were fast with seed data lacked indexes. As records accumulated, D1 rows-read usage and response time increased. The project missed its target not because Workers could not handle the traffic, but because email deliverability, environment isolation, and data rollback were treated as platform defaults instead of launch-critical work that required explicit tests and procedures.

### Unknown Unknowns

- Preview deployments do not isolate D1 automatically; every environment needs an explicit database binding and database ID.
- Exhausting D1 Free daily quotas causes queries to fail until midnight UTC rather than transparently billing an overage.
- `wrangler rollback` does not restore database state, bindings, secrets, or external email state.
- `package.json` permits Wrangler `^4.110.0`, while the current locked installation runs 4.131.0; CI must use `npm ci` and dependency upgrades must be deliberate.
- Email Sending's account-specific limit and real mailbox placement cannot be inferred from public documentation; both require live tests.

## Operational Story

- **Preview deploys**: GitHub Actions will create PR previews in a non-production Worker environment with a separate D1 database. Fork previews must not receive secrets. Preview infrastructure is not configured yet.
- **Secrets**: Store runtime secrets with `npx wrangler secret put <NAME>` and CI credentials in GitHub Actions secrets. Use a scoped Cloudflare API token; never commit values or expose them in logs. Rotate by writing a replacement and redeploying after human approval.
- **Rollback**: Run `npx wrangler rollback` for the preceding Worker version or `npx wrangler rollback <VERSION_ID>` for a selected version. Handle D1 rollback through a separately reviewed forward migration or restore procedure.
- **Approval**: An agent may run local checks, deployment dry-runs, and read-only log commands. A human must approve production publication, cloud-resource creation, secret rotation, custom-domain changes, and destructive database operations.
- **Logs**: Use `npx wrangler tail --status error --format json` for live read-only runtime diagnostics. GitHub Actions logs are the source for pipeline failures; persistent Workers Logs must be enabled deliberately if retention beyond live tailing is needed.

## Risk Register

| Risk | Source | Likelihood | Impact | Mitigation |
|---|---|---:|---:|---|
| Email Sending unavailable or delayed | Research finding | M | H | Test account eligibility, domain onboarding, limits, and one OTP to Gmail, Outlook, and Yahoo before building the full auth flow. Keep the mail boundary provider-neutral. |
| OTP delivered to spam | Pre-mortem | M | H | Configure SPF, DKIM, and DMARC as required; test mailbox placement and show an explicit retry/expiry path. |
| Preview writes production data | Unknown unknowns | M | H | Use separate D1 databases and bindings per environment; fail CI if a preview references a production database ID. |
| Worker rollback leaves incompatible schema | Devil's advocate | M | H | Use forward-compatible migrations, record every migration, back up before destructive changes, and test rollback procedures. |
| D1 query cost or latency spike | Devil's advocate | L | M | Add indexes for ownership and progress lookups; test query plans and rows-read behavior with representative data. |
| Wrangler behavior drifts | Unknown unknowns | L | M | Use `npm ci` in CI, review lockfile updates, and rerun deploy dry-run after upgrades. |
| Node package fails on Workers | Devil's advocate | M | M | Prefer Web APIs and Workers-native libraries; verify every new dependency locally before adoption. |
| Over-privileged CI token | Research finding | L | H | Create a scoped deploy token, keep production deployment environment-protected, and rotate after suspected exposure. |

## Getting Started

1. Run `npm ci`, `npm audit`, and `npm run deploy -- --dry-run` with the locked Hono/Wrangler scaffold.
2. Confirm the intended Cloudflare account with `npx wrangler whoami`; do not create resources until the deployment plan is approved.
3. After approval, create separate development, preview, and production D1 databases, declare their bindings in `wrangler.jsonc`, and run `npm run cf-typegen`.
4. Onboard the sending domain to Email Sending, verify the account limit, and perform deliverability tests before coupling OTP to the provider.
5. Add GitHub Actions checks and a protected production deploy using a least-privilege Cloudflare API token; deploy only after human approval of the persisted plan.

## Evidence

- [Cloudflare Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/)
- [Cloudflare D1 pricing](https://developers.cloudflare.com/d1/platform/pricing/)
- [Cloudflare Email Sending](https://developers.cloudflare.com/email-service/)
- [Cloudflare Worker rollbacks](https://developers.cloudflare.com/workers/versions-and-deployments/rollbacks/)
- [Cloudflare AI-consumable documentation](https://developers.cloudflare.com/style-guide/how-we-docs/ai-consumability/)
- [Hono on Cloudflare Workers](https://developers.cloudflare.com/workers/framework-guides/web-apps/more-web-frameworks/hono/)
- [Netlify credit pricing](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/credit-based-pricing-plans/)
- [Vercel pricing](https://vercel.com/pricing)
- [Fly.io pricing](https://fly.io/pricing/)
- [Railway pricing](https://docs.railway.com/pricing)
- [Render pricing](https://render.com/pricing)

## Out of Scope

The following were not evaluated in this research:

- Docker image configuration
- CI/CD pipeline setup
- Production-scale architecture (multi-region, HA, DR)
