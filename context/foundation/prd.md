---
project: "Pi Harness Academy"
version: 1
status: draft
created: 2026-09-10
context_type: greenfield
product_type: web-app
target_scale:
  users: large
  qps: unknown
  data_volume: unknown
timeline_budget:
  mvp_weeks: 1
  hard_deadline: 2026-09-14
  after_hours_only: true
---

# Pi Harness Academy — Product Requirements Document

## Vision & Problem Statement

Developers moving from Claude Code or Codex to Pi want control over what their coding harness loads and how it behaves. Their current harness can impose tools, policies, features, and context they do not need; high cold-start token overhead is the most visible symptom, while unpredictable context cost, workflow rigidity, and ecosystem dependence are broader costs. Today they either accept the defaults of their existing harness, patch behavior through scattered configuration, or reconstruct a Pi setup directly from separate documentation pages. This costs time, produces inconsistent setups, and risks omitting safeguards when moving to Pi's deliberately minimal defaults.

Pi provides a minimal, extensible core rather than a complete, guarded workflow. The opportunity is not minimalism alone: developers need a guided path for selectively adding the capabilities and safety boundaries they actually need without recreating the same uncontrolled overhead they are leaving behind. The product exists to help people learn Pi, use it, and enjoy the experience; it does not optimize for account conversion.

## User & Persona

The primary persona is a developer already using Claude Code or Codex who wants to move to Pi for greater control over context, models, tools, and workflow. They reach for Pi Harness Academy when they notice harness overhead or rigidity, but do not yet know what to configure, in what order, or how to retain necessary guardrails.

## Success Criteria

### Primary

- An authenticated learner with an authorized Academy Pi profile can complete all 12 steps through validated companion checks; each successful checkpoint updates readiness, unlocks the correct next step, and produces a next-action recommendation.
- A learner can authenticate through passwordless email, synchronize isolated progress, and after completing the path create and share public completion proof through a copied link or prepared LinkedIn action.

### Secondary

- A learner can generate a downloadable completion badge image.

### Guardrails

- All 12 steps and mission instructions remain publicly readable; account requirements protect verified progress and device submissions rather than gate educational content.
- Public completion proof exposes neither the learner's email address nor detailed progress; it shows only deliberately selected identity information and the fact of completion.

## User Stories

### US-01: Complete the path and publish completion proof

- **Given** a first-time visitor who can inspect the full curriculum publicly
- **When** they authenticate through passwordless email, authorize their isolated Academy Pi profile, complete the companion-validated checkpoints across all 12 steps, and finish the final mission
- **Then** the correct tracked steps unlock in sequence, readiness and the next recommendation remain current, progress synchronizes in an isolated learner account, and the learner can publish and share completion proof

#### Acceptance Criteria

- The visitor can read every lesson and mission instruction without authenticating.
- A failed or unauthenticated checkpoint submission does not unlock the next tracked step.
- An authorized Academy Pi profile can submit only minimal, allowlisted checkpoint results for its learner account.
- Only an authenticated learner who completed all required checkpoints can publish completion proof.
- Public proof exposes neither email nor detailed progress.

### US-02: Resume synchronized progress on another device

- **Given** an authenticated learner with saved progress
- **When** they authenticate on another device
- **Then** they see their own synchronized step state, readiness, and next recommendation without access to another learner's records

#### Acceptance Criteria

- The latest valid progress is available after authentication.
- Deleting progress changes only the authenticated learner's records and revokes associated public completion proof.
- Repeated valid submissions do not create duplicate completions.

## Functional Requirements

### Learning path and progress

- FR-001: An anonymous visitor can read all 12 required curriculum steps and mission instructions without authenticating. Priority: must-have
  > Socratic: Considered that anonymous completion cannot be reliably attributed to a person. Resolution: keep knowledge public while requiring authentication only for verified checkpoint submission, private progress, readiness, and attributable public proof. Account conversion is not a product objective.
- FR-002: An authenticated learner can create, view, update, and delete only their own private step progress. Priority: must-have
  > Socratic: Considered that destructive deletion can erase hours of work and invalidate public proof. Resolution: omit course restart; require an explicit destructive decision for deletion, scope it to the learner's own data, and revoke associated public proof. External copies already shared remain outside the product's control.
- FR-003: An authenticated learner can authorize and revoke an isolated Academy Pi profile through a browser-based device flow without manually managing an API key. Priority: must-have
  > Socratic: A stolen persistent device credential could submit results as the learner. Resolution: credentials are scoped to Academy checkpoint operations, revocable per profile, and never reused as model-provider credentials; expiry and secure local storage remain implementation requirements.
- FR-004: An authorized Academy Pi profile can run allowlisted, step-specific checks and submit only the minimal result required for checkpoint validation. Priority: must-have
  > Socratic: A learner controls the local machine and can modify the verifier, so local results cannot be treated as high-trust certification. Resolution: describe checks as educational evidence, execute only bundled allowlisted checks, disclose submitted fields, and never collect file contents, paths, prompts, environment values, or secrets.
- FR-005: A learner can receive an explicit pass or fail result for every submitted checkpoint. Priority: must-have
  > Socratic: A single binary result hides which part of a multi-part mission failed. Resolution: return each required check and its status; the checkpoint passes only when every must-pass check succeeds.
- FR-006: A learner can receive the correctly unlocked next tracked step, updated readiness score, and next-action recommendation after progress changes. Priority: must-have
  > Socratic: A score can replace learning with point chasing. Resolution: calculate readiness only from verified mission capabilities, expose the contributing checks, avoid streaks and rankings, and make the recommendation explain the next missing capability.

### Authentication and synchronization

- FR-007: A visitor can authenticate through a passwordless email flow. Priority: must-have
  > Socratic: Delivery failure could block the entire verified path even though the content is public. Resolution: preserve public reading, retain the learner's place during authentication, provide explicit retry and expiry feedback, and treat deliverability as a launch risk requiring testing.
- FR-008: An authenticated learner can synchronize their isolated private progress across devices. Priority: must-have
  > Socratic: Concurrent devices can submit stale or duplicate checkpoint state. Resolution: make valid completion monotonic and idempotent; repeated or older submissions cannot downgrade a completed step, while deletion remains a separate explicit operation.

### Completion proof and sharing

- FR-009: An authenticated learner who completed every required checkpoint can publish completion proof that reveals only deliberately selected identity information and the fact of completion. Priority: must-have
  > Socratic: Public proof can leak identity or remain valid after source progress is deleted. Resolution: publication is explicit, email and detailed progress are never exposed, identity fields are learner-selected, and deleting completion data revokes the canonical proof URL.
- FR-010: A completed learner can copy their public proof link and initiate sharing with prepared LinkedIn content. Priority: must-have
  > Socratic: A platform integration could introduce tracking, permissions, and dependency on an external API unrelated to learning. Resolution: use ordinary public sharing and user-controlled prepared text; do not require social API authorization or track whether the learner publishes it.
- FR-011: A completed learner can generate a downloadable completion badge image. Priority: nice-to-have
  > Socratic: Image generation can consume deadline capacity without strengthening the required learning or verification flow. Resolution: keep it explicitly nice-to-have and ship it only after all must-have acceptance criteria pass.

## Non-Functional Requirements

- After a companion result reaches the service, the learner sees acknowledgement in less than 2 seconds at p95.
- Checkpoint reports contain no file contents, prompts, filesystem paths, environment values, secrets, or private session transcripts.
- Every attempt to read, change, or delete another learner's private progress is denied.
- Deleting progress or revoking completion proof changes the public proof state in less than 10 seconds.
- The primary learning flow remains usable on the latest two major versions of Chrome, Firefox, Safari, and Edge, including mobile viewport sizes.
- Every essential learning and authentication action is operable by keyboard.

## Business Logic

Academy advances a learner only when an authorized Pi profile submits a valid result proving every required check for an eligible mission; progress, readiness, the next recommendation, and permission to publish completion proof derive from the resulting set of verified capabilities.

The rule consumes the learner's authorized profile identity, the current eligible mission, and the minimal result of each allowlisted companion check. A submission fails when authorization, eligibility, result validity, or any required check is missing. Repeated valid submissions are idempotent and cannot downgrade completed capabilities.

A passing result records the verified capability and makes the next tracked mission eligible. Readiness represents the transparent share of required capabilities verified so far, while the recommendation identifies the next eligible missing capability. Completion proof becomes publishable only after all 12 required mission capabilities are verified.

## Access Control

An anonymous visitor can read all lesson content and mission instructions. Anonymous visitors cannot submit verified checkpoint results, create private progress records, receive account-backed readiness, or publish completion proof.

Passwordless email authentication creates a learner account. The learner authorizes an isolated Academy Pi profile through a device flow. The companion extension may open the system browser without requiring a browser-automation extension; it always displays a URL and short code as a fallback. The resulting revocable device credential is scoped to Academy operations and is unrelated to model-provider credentials.

The MVP uses a flat access model: anonymous visitor and authenticated learner. It has no administrator role. An authenticated learner can create, read, update, and delete only their own private progress. Every private progress operation enforces ownership at the data boundary. Authorized Academy profiles can submit only allowlisted checkpoint results for that learner.

An authenticated learner who completes the path can create a public completion link and prepared LinkedIn share copy. A generated badge image is a nice-to-have after the core definition of done. The public completion view exposes only an identity deliberately selected by the learner and the fact of completion; it never exposes the learner's email address or detailed progress.

## Non-Goals

- No in-app payments, subscriptions, or commercial checkout; they do not contribute to the learning outcome. A plain external support link in the footer is optional only after the must-have flow passes.
- No content-management system or administrator panel; the 12-step curriculum is versioned with the product.
- No community feed, comments, follower graph, or internal social network; sharing remains an optional outbound action.
- No streaks, leaderboards, points economy, or broad gamification; readiness reflects verified capabilities only.
- No mandatory generated badge image before the must-have flow passes; image generation remains nice-to-have.
- No steps 13–15 before the complete 12-step definition of done passes.
- No requirement to run the autonomous Gauntlet against a learner's real repository; the required checkpoint uses the controlled training repository.
- No claim that companion results are tamper-proof certification; they are educational evidence from a learner-controlled machine.
- No collection of source code, prompts, environment values, secrets, private transcripts, or unrelated machine data.

## Open Questions

1. **What request-rate and data-volume ballparks should guide stack selection for up to 10,000 users?** — Resolve during stack selection before committing infrastructure.
2. **Which exact minimal fields may appear on public completion proof?** — Resolve before implementing proof publication; email and detailed progress are already prohibited.
3. **What expiry, rotation, and local-storage policy protects Academy device credentials?** — Resolve during security and stack design before implementing device authorization.
4. **Which deterministic checks and minimal result fields validate each of the 12 missions?** — Resolve step by step before curriculum implementation; no check may transmit prohibited content.
5. **Which delivery behavior and retry path make passwordless authentication reliable enough for launch?** — Resolve and test before the authenticated flow is considered complete.
