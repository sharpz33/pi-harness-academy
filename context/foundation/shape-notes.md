---
project: "Pi Harness Academy"
context_type: greenfield
created: 2026-09-10
updated: 2026-09-10
timeline_budget:
  mvp_weeks: 1
checkpoint:
  current_phase: 5
  phases_completed: [1, 2, 3, 4]
  gray_areas_resolved:
    - topic: context type
      decision: greenfield — the product application is being built from scratch
    - topic: primary persona
      decision: developer already using Claude Code or Codex who wants to move to Pi
    - topic: primary pain
      decision: loss of control over the harness; token cost is a visible symptom, not the whole problem
    - topic: anonymous access
      decision: all lesson content and mission instructions are public; an OTP account and authorized Academy profile are required for verified checkpoints, progress, readiness, and completion proof
    - topic: roles
      decision: flat model with anonymous visitor and authenticated learner; no administrator role in MVP
    - topic: completion sharing
      decision: public completion link, LinkedIn sharing, and link copying are must-have; generated badge image is nice-to-have
    - topic: authentication utility
      decision: authentication provides the technical identity required to authorize an Academy Pi profile, submit checkpoint results, store private progress, synchronize devices, and publish completion proof
    - topic: product philosophy
      decision: optimize for learner autonomy, useful learning, and enjoyment; never treat signup conversion as a product goal or use coercive gates
    - topic: MVP guardrails
      decision: preserve public access to all educational content; account requirements protect verified progress rather than gate knowledge; public completion proof must not expose email or detailed progress
    - topic: final curriculum capability
      decision: an autonomous multi-agent PR gauntlet performs implementation, independent reviews, corrections, verification, approval, and merge without a human in the execution loop
    - topic: final gauntlet environment
      decision: the required checkpoint runs in a controlled training repository; after completion the learner may optionally run the same mission in their own repository
    - topic: curriculum learning pattern
      decision: hybrid progression — activate a reviewed capability quickly, inspect and modify it, then build original capabilities and compose them into an autonomous system
    - topic: twelve-step curriculum arc
      decision: capability-first Hitchcock arc from The Heist through autonomous multi-agent PR Gauntlet; exact scope and checkpoints are locked in curriculum.md
  frs_drafted: 11
  quality_check_status: pending
---

# Pi Harness Academy — Shape Notes

## Vision & Problem Statement

Developers moving from Claude Code or Codex to Pi want control over what their coding harness loads and how it behaves. Their current harness can impose tools, policies, features, and context they do not need; high cold-start token overhead is the most visible symptom, while unpredictable context cost, workflow rigidity, and ecosystem dependence are broader costs.

Pi provides a minimal, extensible core rather than a complete, guarded workflow. The opportunity is not minimalism alone: developers need a guided path for selectively adding the capabilities and safety boundaries they actually need without recreating the same uncontrolled overhead they are leaving behind.

Today they either accept the defaults of their existing harness, patch behavior through scattered configuration, or reconstruct a Pi setup directly from separate documentation pages. This costs time, produces inconsistent setups, and risks omitting safeguards when moving to Pi's deliberately minimal defaults.

The product exists to help people learn Pi, use it, and enjoy the experience. It does not optimize for account conversion. All educational content remains public. Authentication supplies the technical identity needed for verified checkpoints, private progress, device synchronization, and completion proof; sharing is an optional invitation to help someone else have the same experience.

## User & Persona

The primary persona is a developer already using Claude Code or Codex who wants to move to Pi for greater control over context, models, tools, and workflow. They reach for Pi Harness Academy when they notice harness overhead or rigidity, but do not yet know what to configure, in what order, or how to retain necessary guardrails.

## Access Control

An anonymous visitor can read all lesson content and mission instructions. Anonymous visitors cannot submit verified checkpoint results, create private progress records, receive account-backed readiness, or publish completion proof.

Passwordless email authentication creates a learner account. The learner authorizes an isolated Academy Pi profile through a device flow. The companion extension may open the system browser without requiring a browser-automation extension; it always displays a URL and short code as a fallback. The resulting revocable device credential is scoped to Academy operations and is unrelated to model-provider credentials.

The MVP uses a flat access model: anonymous visitor and authenticated learner. It has no administrator role. An authenticated learner can create, read, update, and delete only their own private progress. Every private progress operation enforces ownership at the data boundary. Authorized Academy profiles can submit only allowlisted checkpoint results for that learner.

An authenticated learner who completes the path can create a public completion link and prepared LinkedIn share copy. A generated badge image is a nice-to-have after the core definition of done. The public completion view exposes only an identity deliberately selected by the learner and the fact of completion; it never exposes the learner's email address or detailed progress.

## Success Criteria

### Primary

- An authenticated learner with an authorized Academy Pi profile can complete all 12 steps through validated companion checks; each successful checkpoint updates readiness, unlocks the correct next step, and produces a next-action recommendation.
- A learner can authenticate through passwordless email, synchronize isolated progress, and after completing the path create and share public completion proof through a copied link or prepared LinkedIn action.

### Secondary

- A learner can generate a downloadable completion badge image.

### Guardrails

- All 12 steps and mission instructions remain publicly readable; account requirements protect verified progress and device submissions rather than gate educational content.
- Public completion proof exposes neither the learner's email address nor detailed progress; it shows only deliberately selected identity information and the fact of completion.

### First Complete User Flow

1. The developer opens the public homepage and can inspect the promise, the 12-step path, and every lesson without authenticating.
2. To begin the verified journey, they authenticate through passwordless email.
3. They authorize the isolated Academy Pi profile through a browser-based device flow.
4. They perform the mission and invoke the companion checkpoint command.
5. The companion runs allowlisted checks and submits a minimal result for the authenticated learner.
6. The product displays pass or fail; a pass updates readiness, unlocks the next tracked step, and recommends the next action.
7. The learner repeats the flow through all 12 steps with synchronized private progress.
8. After completion, the learner receives a completion badge, a public proof link, and prepared LinkedIn sharing.

## Curriculum Scope

The required 12-step curriculum and completion checkpoint for each step are defined in `context/foundation/curriculum.md`:

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

The sequence is cumulative and runs in an isolated Academy profile. The final required mission uses a controlled training repository; running the same autonomous workflow against the learner's own repository is optional.

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
