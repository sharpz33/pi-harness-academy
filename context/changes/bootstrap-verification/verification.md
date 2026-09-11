---
bootstrapped_at: 2026-09-11T11:54:21Z
starter_id: hono
starter_name: Hono
project_name: pi-harness-academy
language_family: js
package_manager: npm
cwd_strategy: subdir-then-move
bootstrapper_confidence: verified
phase_3_status: ok
audit_command: "npm audit --json"
---

# Bootstrap Verification

## Hand-off

```yaml
starter_id: hono
package_manager: npm
project_name: pi-harness-academy
hints:
  language_family: js
  team_size: solo
  deployment_target: cloudflare-workers
  ci_provider: github-actions
  ci_default_flow: auto-deploy-on-merge
  bootstrapper_confidence: verified
  path_taken: custom
  quality_override: false
  self_check_answers:
    typed: true
    from_official_starter: true
    conventions: true
    docs_current: true
    can_judge_agent: false
  has_auth: true
  has_payments: false
  has_realtime: false
  has_ai: false
  has_background_jobs: false
```

A solo developer shipping a public learning application in one week needs minimal infrastructure and strong HTTP conventions without a client-side application framework. Hono supplies typed routing, middleware, request handling, and server-rendered HTML while staying native to Cloudflare Workers. Small vanilla TypeScript enhancements handle checkpoint polling, mission tabs, and success transitions. D1 stores accounts, opaque sessions, device authorization, progress, and proof; Email Sending delivers passwordless links. GitHub Actions runs quality checks and deploys automatically after merge to main. Hono passes all four agent-friendly gates and has verified bootstrapper support; limited familiarity with Hono-specific practice is compensated by current documentation, automated tests, and review.

## Pre-scaffold verification

| Signal | Value | Severity | Notes |
| --- | --- | --- | --- |
| npm package | `create-hono` v0.19.5 published 2026-08-30 | fresh | Resolved from the starter command |
| GitHub repository | not run | n/a | The registry card uses `https://hono.dev`, not a GitHub documentation URL |

## Scaffold log

**Resolved invocation**: `npm create hono@0.19.5 .bootstrap-scaffold -- --template cloudflare-workers --pm npm --install`
**Strategy**: subdir-then-move
**Exit code**: 0
**Files moved**: 2235, including installed dependencies
**Conflicts (.scaffold siblings)**: none; `.gitignore` was append-merged
**.gitignore handling**: append-merged
**.bootstrap-scaffold cleanup**: deleted
**Cloudflare deploy dry-run**: passed
**Local smoke test**: passed — `GET /` returned `Hello Hono!`

The registry command selected Hono's `nodejs` template even though the hand-off selected Cloudflare Workers. The user approved replacing that command with the official `cloudflare-workers` template and using a temporary directory so the existing Git repository, `AGENTS.md`, and `context/` remained untouched. Project identifiers generated from the temporary directory name were normalized to `pi-harness-academy` after the merge.

## Post-scaffold audit

**Tool**: `npm audit --json`
**Summary**: 0 CRITICAL, 0 HIGH, 0 MODERATE, 0 LOW, 0 INFO
**Direct vs transitive**: not applicable; no findings

#### CRITICAL findings

None.

#### HIGH findings

None.

#### MODERATE findings

None.

#### LOW / INFO findings

None.

## Hints recorded but not acted on

| Hint | Value |
| --- | --- |
| bootstrapper_confidence | `verified` |
| quality_override | `false` |
| path_taken | `custom` |
| self_check_answers | `typed: true; from_official_starter: true; conventions: true; docs_current: true; can_judge_agent: false` |
| team_size | `solo` |
| deployment_target | `cloudflare-workers` |
| ci_provider | `github-actions` |
| ci_default_flow | `auto-deploy-on-merge` |
| has_auth | `true` |
| has_payments | `false` |
| has_realtime | `false` |
| has_ai | `false` |
| has_background_jobs | `false` |

## Next steps

Next: a future skill will set up agent context (`CLAUDE.md`, `AGENTS.md`). For now, the project is scaffolded and verified.

Useful manual steps in the meantime:

- Review the generated project structure and commands.
- Address audit findings according to project risk tolerance; this run has no findings.
- Continue with agent onboarding before implementing product behavior.
