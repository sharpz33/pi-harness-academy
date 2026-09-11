---
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
---

## Why this stack

A solo developer shipping a public learning application in one week needs minimal infrastructure and strong HTTP conventions without a client-side application framework. Hono supplies typed routing, middleware, request handling, and server-rendered HTML while staying native to Cloudflare Workers. Small vanilla TypeScript enhancements handle checkpoint polling, mission tabs, and success transitions. D1 stores accounts, opaque sessions, device authorization, progress, and proof; Email Sending delivers passwordless links. GitHub Actions runs quality checks and deploys automatically after merge to main. Hono passes all four agent-friendly gates and has verified bootstrapper support; limited familiarity with Hono-specific practice is compensated by current documentation, automated tests, and review.
