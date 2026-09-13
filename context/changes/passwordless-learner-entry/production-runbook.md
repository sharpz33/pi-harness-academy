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
| Production D1 `pi-harness-academy-prod` | Created in EEUR; empty and not migrated. |
| Worker `pi-harness-academy` | Existing production Worker. |
| Custom domain `piacade.my` | Configured locally; not deployed. |
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
- Current recorded production rollback point: commit `89041c7b04a4f0d266b3b1e5db8c056426c2b823`, Worker version `fb295add-266f-4f90-9b73-5dd0d3209c3a`.
- Use a forward fix for the additive auth migration; do not run destructive rollback SQL.
- Record the deployed commit and Worker version in `CHANGELOG.md` and verification evidence.
