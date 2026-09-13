---
change_id: passwordless-learner-entry
updated: 2026-09-13
production_worker: pi-harness-academy
public_origin: https://piacade.my
sender: noreply@piacade.my
zone_status: active
database: pi-harness-academy-prod
mail_provider: cloudflare-email-sending
---

# Passwordless Login Production Runbook

## Current Resources

| Resource | State |
|---|---|
| Cloudflare zone `piacade.my` | Active on Cloudflare nameservers. |
| Production D1 `pi-harness-academy-prod` | Created in EEUR; auth migration applied. |
| Worker `pi-harness-academy` | Deployed from protected `main`. |
| Custom domain `piacade.my` | Active production route. |
| Email Sending | `piacade.my` onboarded; one approved Gmail delivery succeeded. |

## Required Order

1. Replace Porkbun authoritative nameservers with `beau.ns.cloudflare.com` and `tessa.ns.cloudflare.com`.
2. Wait until Cloudflare reports the zone as active.
3. Enable Workers Paid only after confirming the displayed price.
4. Onboard `piacade.my` in Email Sending and verify `noreply@piacade.my` is accepted.
5. Run the final local gate and review the publication diff.
6. Ask before applying `0001_passwordless_auth.sql` to production D1.
7. Apply the migration and verify schema metadata without reading learner data.
8. Ask before the first real email test.
9. Send one login link to a user-approved mailbox and complete the flow.
10. Ask before deploying the Worker with D1, Email Sending, and the custom domain.
11. Verify `https://piacade.my`, security headers, login, replay rejection, logout, and public lesson access.

## Circuit Breaker

Give Cloudflare Email Sending at most 60 minutes after the zone becomes active. If arbitrary-recipient delivery still does not work:

- stop Cloudflare troubleshooting;
- select one approved transactional provider;
- store its credential only as a Worker secret;
- replace only the `AuthMailer` adapter and binding configuration;
- rerun the complete local gate before requesting deployment.

## Safety and Rollback

- Never print or commit tokens, cookies, test mailbox addresses, API credentials, or raw magic links.
- Keep production deployment manual.
- Worker rollback does not roll back D1 schema or data.
- Current production: commit `cec9fc2e928c709619be5d2e863a301d15525b1b`, Worker version `bbdeba13-851e-4679-a977-1e54a0a90a4a`.
- Previous working rollback version: `8cc2a77d-95c7-4b64-a2e5-429cead0ff89`.
- Use a forward fix for the additive auth migration; do not run destructive rollback SQL.
- Record the deployed commit and Worker version in `CHANGELOG.md` and verification evidence.
