---
project: Pi Harness Academy
version: 1
status: active
created: 2026-09-11
updated: 2026-09-11
prd_version: 1
main_goal: speed
top_blocker: time
milestone_id: complete-verified-academy-journey
milestone_seq: 1
milestone_status: open
---

# Roadmap: Pi Harness Academy

> Derived from `context/foundation/prd.md` v1, `context/foundation/curriculum.md`, and the automatically inspected codebase.
> Edit in place; archive when superseded.
> Items are listed in dependency order. The At a glance table is the index.

## Milestone

**M-1: Complete verified Academy journey** — Status: open

- **Goal:** Deliver the complete public twelve-mission path, account-backed progress, companion verification, and privacy-preserving completion sharing.
- **Source materials:** `context/foundation/prd.md` v1 and `context/foundation/curriculum.md`.
- **Done when:** every F-NN and S-NN below is `done`, every required mission is publicly readable, and the complete verified journey passes its acceptance checks.
- **Scope anchors:** US-01–US-02 and FR-001–FR-010. FR-011 remains optional and parked.

## Vision recap

Developers moving from more prescriptive coding harnesses need a guided way to assemble only the Pi capabilities and safeguards they choose. The Academy keeps all knowledge public while using an isolated profile, minimal evidence, and private synchronized progress to make the twelve-step journey verifiable without turning signup into the product goal.

## North star

A north star is the smallest end-to-end result that proves the product's central promise works.

**S-04: Pass The Heist checkpoint and unlock X-Ray Vision** — This is the first result that exercises public learning, learner identity, profile authorization, minimal evidence, domain validation, persistent progress, readiness, and sequential unlocking together.

## At a glance

| ID | Change ID | Outcome (user can …) | Prerequisites | PRD refs | Status |
| --- | --- | --- | --- | --- | --- |
| S-01 | public-heist-mission | read and perform the complete public The Heist mission | — | US-01, FR-001 | planning |
| S-02 | passwordless-learner-entry | authenticate by email and see their own verified-journey starting state | — | US-01, US-02, FR-007 | blocked |
| S-03 | academy-profile-authorization | authorize and revoke one isolated Academy Pi profile | S-02 | US-01, FR-003 | blocked |
| S-04 | first-verified-checkpoint | receive pass or fail for The Heist and unlock X-Ray Vision only after valid evidence | S-01, S-02, S-03 | US-01, FR-004, FR-005, FR-006 | blocked |
| S-05 | private-progress-sync | view, update, delete, and resume only their own synchronized progress | S-04 | US-02, FR-002, FR-008 | proposed |
| S-06 | verified-act-one | complete verified missions 2–4 with current readiness and recommendations | S-05 | US-01, FR-001, FR-004, FR-005, FR-006 | blocked |
| S-07 | verified-act-two | complete verified missions 5–8 with current readiness and recommendations | S-06 | US-01, FR-001, FR-004, FR-005, FR-006 | blocked |
| S-08 | verified-act-three | complete verified missions 9–12, including the fail-closed Gauntlet | S-07 | US-01, FR-001, FR-004, FR-005, FR-006 | blocked |
| S-09 | privacy-safe-completion-proof | explicitly publish or revoke a completion proof without exposing email or detailed progress | S-05, S-08 | US-01, FR-002, FR-009 | blocked |
| S-10 | completion-sharing | copy the proof link and open prepared LinkedIn sharing | S-09 | US-01, FR-010 | proposed |

## Streams

| Stream | Theme | Chain | Note |
| --- | --- | --- | --- |
| A | Public learning and verification | `S-01` → `S-04` → `S-06` → `S-07` → `S-08` | Delivers the shortest sequence from first public mission to all twelve verified capabilities. |
| B | Identity and private progress | `S-02` → `S-03` → `S-05` | Joins Stream A at S-04, then makes later progress private, durable, and resumable. |
| C | Completion and sharing | `S-09` → `S-10` | Joins Streams A and B after S-08 and S-05 are complete. |

## Baseline

What is already present in the codebase as of 2026-09-11:

- **Frontend:** present — a public server-rendered Mission Control shell and stylesheet exist in `src/index.ts` and `src/styles.ts`.
- **Backend / API:** present — the Worker serves the homepage and stylesheet from `src/index.ts`.
- **Data:** absent — the selected database has no binding, migration, or access path.
- **Authorization:** absent — no passwordless login, session, device authorization, or route guard exists.
- **Deployment / infrastructure:** present — the public Worker, pull-request CI, branch protection, and manual production workflow exist.
- **Observability:** partial — manual filtered runtime tailing works, but persistent production telemetry is not configured.

## Foundations

No separate foundation is justified yet. Data, authentication, and evidence contracts are introduced inside the first user-visible slice that consumes each capability. Cross-cutting work may be promoted here only if planning proves that a named slice cannot be planned, secured, or verified without it.

## Slices

### S-01: Public The Heist mission

- **Outcome:** A visitor can read the complete The Heist lesson, perform its isolated-profile mission, and understand the checkpoint evidence without signing in.
- **Change ID:** public-heist-mission
- **PRD refs:** US-01, FR-001
- **Prerequisites:** —
- **Parallel with:** S-02
- **Blockers:** —
- **Unknowns:** —
- **Risk:** The lesson must produce an authentic Pi capability rather than becoming static documentation with no executable mission.
- **Status:** planning

### S-02: Passwordless learner entry

- **Outcome:** A visitor can authenticate by email, retain their place, and see only their own verified-journey starting state with clear expiry and retry feedback.
- **Change ID:** passwordless-learner-entry
- **PRD refs:** US-01, US-02, FR-007
- **Prerequisites:** —
- **Parallel with:** S-01
- **Blockers:** Production email delivery depends on an approved sender and deliverability test.
- **Unknowns:**
  - Which delivery, expiry, retry, and provider-fallback behavior is acceptable for launch? — Owner: user. Block: yes.
- **Risk:** Treating a locally generated link as success would hide the external dependency that can block every verified learner.
- **Status:** blocked

### S-03: Isolated Academy profile authorization

- **Outcome:** An authenticated learner can authorize and revoke one isolated Academy Pi profile without handling an API key manually.
- **Change ID:** academy-profile-authorization
- **PRD refs:** US-01, FR-003
- **Prerequisites:** S-02
- **Parallel with:** —
- **Blockers:** —
- **Unknowns:**
  - What expiry, rotation, revocation, and secure local-storage policy governs the scoped device credential? — Owner: user. Block: yes.
- **Risk:** A credential that is too durable or too broad would turn an educational companion into an account-security liability.
- **Status:** blocked

### S-04: First verified checkpoint

- **Outcome:** An authorized learner receives explicit per-check pass or fail for The Heist, and only a valid passing result records progress, updates readiness, recommends the next action, and unlocks X-Ray Vision.
- **Change ID:** first-verified-checkpoint
- **PRD refs:** US-01, FR-004, FR-005, FR-006
- **Prerequisites:** S-01, S-02, S-03
- **Parallel with:** —
- **Blockers:** —
- **Unknowns:**
  - Which deterministic checks and minimal fields prove The Heist without transmitting prohibited machine data? — Owner: user. Block: yes.
- **Risk:** This is the first complete validation of the domain rule; accepting ambiguous or excessive evidence would invalidate the rest of the sequence.
- **Status:** blocked

### S-05: Private synchronized progress

- **Outcome:** An authenticated learner can view, update, explicitly delete, and resume only their own progress across devices without duplicate or regressed completions.
- **Change ID:** private-progress-sync
- **PRD refs:** US-02, FR-002, FR-008
- **Prerequisites:** S-04
- **Parallel with:** —
- **Blockers:** —
- **Unknowns:** —
- **Risk:** Ownership mistakes or non-monotonic updates could expose another learner's state or erase valid capability evidence.
- **Status:** proposed

### S-06: Verified Act I

- **Outcome:** A learner can complete X-Ray Vision, Eyes & Hands, and The Time Machine with minimal per-mission evidence, sequential unlocking, readiness, and next recommendations.
- **Change ID:** verified-act-one
- **PRD refs:** US-01, FR-001, FR-004, FR-005, FR-006
- **Prerequisites:** S-05
- **Parallel with:** —
- **Blockers:** Reviewed and compatible Pi capability packages may be required by individual missions.
- **Unknowns:**
  - Which exact allowlisted checks and result fields validate missions 2–4? — Owner: user. Block: yes.
- **Risk:** Package incompatibility or overbroad browser artifacts could break the cumulative profile or leak machine data.
- **Status:** blocked

### S-07: Verified Act II

- **Outcome:** A learner can complete Total Recall, Hindsight, The Forge, and Clone Protocol with minimal per-mission evidence and cumulative progress.
- **Change ID:** verified-act-two
- **PRD refs:** US-01, FR-001, FR-004, FR-005, FR-006
- **Prerequisites:** S-06
- **Parallel with:** —
- **Blockers:** Reviewed and compatible Pi capability packages may be required by individual missions.
- **Unknowns:**
  - Which exact allowlisted checks and result fields validate missions 5–8? — Owner: user. Block: yes.
- **Risk:** Memory, reflection, extension, and delegation evidence must remain inspectable without uploading transcripts or file contents.
- **Status:** blocked

### S-08: Verified Act III

- **Outcome:** A learner can complete Council of Minds, The Crew, Escape the Terminal, and the fail-closed Gauntlet in controlled environments and reach verified completion.
- **Change ID:** verified-act-three
- **PRD refs:** US-01, FR-001, FR-004, FR-005, FR-006
- **Prerequisites:** S-07
- **Parallel with:** —
- **Blockers:** Controlled training repository and reviewed orchestration capabilities must be available.
- **Unknowns:**
  - Which exact allowlisted checks and result fields validate missions 9–12? — Owner: user. Block: yes.
- **Risk:** Autonomous execution must fail closed on missing reviews, checks, browser evidence, isolation, timeout, or budget rather than reporting a false completion.
- **Status:** blocked

### S-09: Privacy-safe completion proof

- **Outcome:** A completed learner can explicitly publish or revoke a canonical proof that shows only selected identity and completion, while progress deletion revokes that proof.
- **Change ID:** privacy-safe-completion-proof
- **PRD refs:** US-01, FR-002, FR-009
- **Prerequisites:** S-05, S-08
- **Parallel with:** —
- **Blockers:** —
- **Unknowns:**
  - Which exact learner-selected identity fields may appear on public completion proof? — Owner: user. Block: yes.
- **Risk:** A permissive default could expose identity or leave canonical proof valid after its source data is removed.
- **Status:** blocked

### S-10: Completion sharing

- **Outcome:** A completed learner can copy the canonical proof link and open a prepared LinkedIn share without granting social-platform permissions.
- **Change ID:** completion-sharing
- **PRD refs:** US-01, FR-010
- **Prerequisites:** S-09
- **Parallel with:** —
- **Blockers:** —
- **Unknowns:** —
- **Risk:** Sharing must stay user-controlled and must not introduce tracking or a social API dependency.
- **Status:** proposed

## Backlog Handoff

| Roadmap ID | Change ID | Suggested task title | Ready for `/10x-plan` | Notes |
| --- | --- | --- | --- | --- |
| S-01 | public-heist-mission | Deliver the complete public The Heist mission | yes | First ready vertical slice. |
| S-02 | passwordless-learner-entry | Let a learner enter through passwordless email | no | Resolve delivery and retry behavior first. |
| S-03 | academy-profile-authorization | Authorize and revoke an isolated Academy profile | no | Resolve device credential policy first. |
| S-04 | first-verified-checkpoint | Verify The Heist and unlock X-Ray Vision | no | Resolve the minimal The Heist evidence contract first. |
| S-05 | private-progress-sync | Synchronize learner-owned progress safely | no | Requires S-04. |
| S-06 | verified-act-one | Deliver verified missions 2–4 | no | Define checks after the first checkpoint contract is proven. |
| S-07 | verified-act-two | Deliver verified missions 5–8 | no | Requires S-06 and exact checks. |
| S-08 | verified-act-three | Deliver verified missions 9–12 | no | Requires S-07, controlled environments, and exact checks. |
| S-09 | privacy-safe-completion-proof | Publish privacy-safe completion proof | no | Resolve public identity fields first. |
| S-10 | completion-sharing | Share canonical completion proof | no | Requires S-09. |

## Open Roadmap Questions

1. **What request-rate and data-volume ballparks should guide stack selection for up to 10,000 users?** — Owner: user. Block: —. Current infrastructure selection already targets this scale; the PRD should record the resolution.
2. **Which exact minimal fields may appear on public completion proof?** — Owner: user. Block: S-09.
3. **What expiry, rotation, and local-storage policy protects Academy device credentials?** — Owner: user. Block: S-03.
4. **Which deterministic checks and minimal result fields validate each of the 12 missions?** — Owner: user. Block: S-04, S-06, S-07, S-08.
5. **Which delivery behavior and retry path make passwordless authentication reliable enough for launch?** — Owner: user. Block: S-02.

## Parked

- **In-app payments or checkout** — Parked by PRD §Non-Goals because it does not strengthen learning.
- **Content-management system or administrator panel** — Parked by PRD §Non-Goals; curriculum stays versioned with the product.
- **Community and internal social features** — Parked by PRD §Non-Goals; sharing remains outbound and optional.
- **Streaks, leaderboards, points, and broad gamification** — Parked by PRD §Non-Goals; readiness reflects verified capabilities only.
- **Generated badge image** — FR-011 is optional and remains parked until every required flow passes.
- **Steps 13–15** — Parked until the complete twelve-step definition of done passes.
- **Required Gauntlet run against a learner's repository** — Parked by PRD §Non-Goals; the required run uses the controlled training repository.
- **Tamper-proof certification claims** — Parked because companion evidence comes from a learner-controlled machine.
- **Collection of source code, prompts, secrets, environment values, or private transcripts** — Prohibited by PRD §Non-Goals and privacy requirements.

## Milestone History

## Done
