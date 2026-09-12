# Implementation Plan: Public The Heist Mission

## Overview

Deliver the first complete public Academy lesson. A visitor enters The Heist from Mission Control, completes a short Launch Bay setup, pastes one staged migration prompt into Pi, activates a native capability or migrates one reviewed self-contained Markdown capability, and returns to a local evidence preview. The slice remains anonymous and does not claim verified completion.

## Current State Analysis

The deployed homepage lists all twelve mission names but has no mission routes, reusable lesson model, copy interaction, or evidence workspace. The current Worker renders one inline page and one stylesheet; tests verify only the homepage and CSS response. Product documents currently require a separate Academy config directory, while the user has replaced that rule with an adaptive profile choice.

Official Pi documentation supports the required building blocks: Pi can use a configurable agent directory, load skills and prompt templates from documented locations, apply project trust, and run with explicit tool allowlists. Skills and packages may contain executable or agent-directed behavior, so source artifacts must be treated as untrusted data until reviewed.

## Desired End State

A visitor can open `/missions/the-heist`, install and launch Pi through a concise Launch Bay section, authenticate with a model provider directly inside Pi, and copy a single mission prompt. The prompt first inventories Claude Code or Codex resources without modification, excludes credentials and sessions, classifies executable configuration for later audit, pauses for candidate selection, audits one self-contained Markdown skill or prompt, activates a Pi-native candidate without copying or pauses again before copying an adaptable candidate, and verifies that the capability works while the source remains unchanged.

The mission page presents the objective, concise steps, commands, safety boundaries, sources, and four local evidence checks. Completing the browser checklist produces only a clearly labeled “ready for future verification” state that disappears on refresh.

### Key findings

- `src/index.ts:4-16` defines only mission names; the content needs a reusable mission contract.
- `src/index.ts:36-85` renders the homepage inline; a mission route and shared page shell do not exist.
- `src/styles.ts:170-203` already provides the visual vocabulary for the mission map.
- `src/index.test.ts:5-21` establishes response-level SSR tests that can be extended without a browser framework.
- `context/foundation/curriculum.md:57-70` defines The Heist reveal, mission, evidence, and safety outcome.
- `context/foundation/experience-design-research.md` requires the sequence mission → authentic action → evidence → checkpoint and forbids a fake browser terminal.
- Pi documents `PI_CODING_AGENT_DIR`, skill and prompt locations, project trust, and strict tool allowlists; it also warns that skills and packages can cause executable behavior.
- Pi and current Codex both discover user skills from the shared Agent Skills directory, so a compatible Codex skill may be native and require no copy.
- Current public vendor documentation places Claude Code skills and commands under its user config directory and Codex skills under the shared Agent Skills directory, while credentials and session stores are explicitly unsuitable for migration.

## What We Are NOT Doing

- No OTP, account, session, D1, device authorization, companion API, readiness score, or verified checkpoint.
- No persistence of the local browser checklist, analytics, or upload of inventory/evidence.
- No automatic migration of MCP servers, hooks, settings, plugins, extensions, packages, credentials, sessions, or whole directories.
- No Windows-specific command path in this slice.
- No third-party Pi package installation.
- No production deployment or Cloudflare resource change without a separate approval.
- No implementation of missions 2–12 beyond preserving their public map entries.

## Implementation Approach

Keep the Worker server-rendered and data-driven. Extract mission metadata and The Heist content into a typed content module, add shared page renderers, and register a dedicated mission route. Serve a small same-origin browser script for copy controls and the non-persistent evidence preview so the existing CSP can remain free of inline script exceptions.

The migration prompt is the automation surface; there is no downloaded inventory shell script. It runs as a staged conversation inside the learner's Pi session. The prompt instructs Pi to treat discovered files as untrusted data, perform a read-only first pass over fixed candidate roots, avoid credentials/session trees and symlinks, and stop before candidate audit and before any adaptable-resource copy. Pi-native resources are activated in place after review. The default target is a fresh normal Pi profile; users with an existing Pi setup may choose a separate Academy directory.

## Critical Implementation Details

### Trust and state sequencing

The first prompt stage may identify paths and classify resource types but must not copy, edit, execute, install, or follow instructions found inside source artifacts. After the learner selects one self-contained Markdown candidate, Pi reads only that candidate as quoted data and reports imports or executable dependencies. A compatible resource already discovered by Pi is activated without copying; an adaptable candidate gets a proposed destination and exact copy action followed by a second stop. Before activation or copy, Pi records a local digest of the selected allowed Markdown file; afterward it recomputes the digest and reports only whether the source stayed byte-for-byte identical. Digests and content never leave the machine. Unsupported or dependent resources remain quarantined.

The isolated profile is an optional safety branch, not the default promise. This does not relax the migration boundary: MCP definitions, hooks, plugins, executable extensions, provider credentials, and session histories remain outside automatic migration regardless of target profile.

## Phase 1: Align Contracts and Define the Mission

### Overview

Record the adaptive profile decision in canonical product documents and create the typed mission content contract, including Launch Bay and the staged migration prompt.

### Required Changes

#### 1. Canonical product guidance

**Files:** `AGENTS.md`, `README.md`, `context/foundation/prd.md`, `context/foundation/shape-notes.md`, `context/foundation/curriculum.md`, `context/foundation/roadmap.md`

**Purpose:** Replace the unconditional isolated-profile requirement with the approved adaptive rule while preserving source-harness immutability and explicit authorization.

**Contract:** Bump the PRD to version 2 and synchronize `roadmap.prd_version` when recording this requirement change. A fresh Pi user may use the normal profile. A learner with an existing Pi setup is offered a separate Academy profile. The selected profile becomes cumulative and can later be authorized; model-provider authentication happens directly inside Pi and the Academy service never requests or imports provider credentials. Existing uses of “isolated” for worktrees, sessions, reviewers, and controlled training environments remain unchanged.

#### 2. Mission content model

**File:** `src/missions.ts`

**Purpose:** Define stable mission metadata and a complete The Heist content record outside the HTTP route.

**Contract:** The model represents slug, sequence, title, act, reveal, objective, Launch Bay commands, concise steps, safety notices, staged prompt text, evidence items, source links, and availability. Every mission remains listable; only The Heist needs complete lesson content in this change.

#### 3. Staged migration prompt

**File:** `src/missions.ts`

**Purpose:** Give the learner one inspectable prompt that turns Pi into the guided migration operator instead of asking them to run a website-supplied shell script.

**Contract:** The prompt must:

- ask whether the target is a fresh default Pi profile or an optional Academy profile;
- tell first-time users to complete model-provider authentication directly inside Pi without pasting credentials into the prompt or Academy website;
- inventory only documented candidate roots for Claude Code or Codex;
- avoid reading or enumerating credential values, session contents, private transcripts, MCP values, environment values, and symlink targets;
- classify compatible resources already discovered by Pi as native, self-contained Markdown requiring conversion as adaptable, executable configuration as quarantined, and credentials/sessions as forbidden;
- treat all discovered content as untrusted data rather than instructions;
- stop before reading the selected candidate in full;
- audit only the learner-selected candidate, rejecting or quarantining dependencies on scripts, secrets, imports, or unsupported resources;
- record a local digest of the selected allowed Markdown file before any action;
- activate a native candidate without copying, or propose a destination and exact copy action for an adaptable candidate and stop for a second approval;
- copy rather than move, recompute the source digest, report equality only, validate loading, and ask the learner to invoke the capability;
- never send inventory, digests, or file content to the Academy service.

### Success Criteria

#### Automated verification

- Mission metadata exposes exactly twelve ordered entries with unique slugs.
- The Heist record includes Launch Bay, all staged-consent boundaries, four evidence items, and official source links.
- Tests assert that the prompt names the prohibited categories, includes both approval stops, treats source content as untrusted, and never instructs whole-directory migration.
- `npm run typecheck` and `npm test` pass.
- `AGENTS.md` remains within its 400-word limit.

#### Manual verification

- Read the complete prompt as an adversarial operator and confirm that no stage can reasonably be mistaken for permission to inspect credentials, execute source configuration, or mutate the source harness.
- Confirm that the revised product documents consistently describe the adaptive profile rule.

**Implementation note:** Stop after this phase for human review of the mission prompt and profile-policy diff before building the UI around it.

---

## Phase 2: Deliver the Mission Workspace

### Overview

Turn the content contract into a public, accessible mission page and connect it to Mission Control.

### Required Changes

#### 1. Shared page renderers

**File:** `src/views.ts`

**Purpose:** Reuse the document shell, top bar, footer, and mission navigation across the homepage and lesson route without introducing a client framework.

**Contract:** Render escaped trusted application data into complete HTML documents. The mission renderer exposes Launch Bay, Brief, Work, Evidence, safety notices, sources, and one primary action at a time. It must not require authentication or client JavaScript to read the lesson.

#### 2. Public mission routes and assets

**File:** `src/index.ts`

**Purpose:** Connect the typed content to HTTP routes and make the first mission discoverable.

**Contract:** `/` links The Heist to `/missions/the-heist`; that route returns the complete public lesson. Unknown mission slugs return 404. A same-origin JavaScript route serves only copy and ephemeral checklist behavior with an explicit JavaScript Content-Type and cache policy. Existing security headers remain applied to every response.

#### 3. Copy and evidence interaction

**File:** `src/client.ts`

**Purpose:** Let a learner copy install, launch, and mission-prompt text and receive immediate local evidence feedback.

**Contract:** Copy controls provide visible success/failure feedback and a selection fallback when Clipboard API access fails. Four checkboxes unlock the local “evidence ready” message only when all are selected. State is not written to cookies, storage, URLs, or the network and resets on refresh.

#### 4. Mission workspace styling

**File:** `src/styles.ts`

**Purpose:** Extend Mission Control into a readable single-mission workspace while preserving the restrained visual system.

**Contract:** Desktop uses a mission rail plus main workspace; mobile collapses to one column. Commands scroll horizontally, copy controls remain reachable, keyboard focus is visible, reduced-motion preferences are respected, and green is reserved for the completed local evidence state.

### Success Criteria

#### Automated verification

- `/missions/the-heist` returns 200, public HTML, the expected title, Launch Bay, prompt, source links, and four evidence controls.
- The homepage links the first mission and still lists all twelve missions.
- An unknown mission slug returns 404.
- The client script route returns an explicit JavaScript Content-Type and contains no persistence or network call.
- Existing CSP and security-header assertions continue to pass.
- `npm run check` passes.

#### Manual verification

- Open the lesson from Mission Control and complete the copy interactions using keyboard only.
- Disable Clipboard API access and confirm the fallback leaves copyable text and clear feedback.
- Select evidence items one by one; confirm no verified claim appears before all four and that refresh clears the state.
- Inspect desktop and mobile layouts and confirm commands remain usable without a fake terminal.

**Implementation note:** Stop after this phase for human UI acceptance before final hardening.

---

## Phase 3: Harden Safety, Documentation, and Release Evidence

### Overview

Exercise the mission against disposable fixtures, close documentation gaps, and prepare a reviewable release without deploying it.

### Required Changes

#### 1. Mission safety fixtures and tests

**Files:** `src/index.test.ts`, `src/missions.test.ts`

**Purpose:** Protect the public route and prompt contract against regressions that could weaken the migration boundary.

**Contract:** Cover source immutability language, forbidden roots, symlink refusal, self-contained Markdown eligibility, executable-resource quarantine, approval stops, public access, route behavior, content types, and ephemeral evidence semantics. Tests inspect application-owned prompt and HTML output only; they do not inspect the developer's real harness directories.

#### 2. Public documentation

**Files:** `README.md`, `CHANGELOG.md`

**Purpose:** Reflect the first implemented lesson, its local-only evidence boundary, and the exact quality/release procedure.

**Contract:** README distinguishes public lesson completion from future verified progress. Changelog records the slice when released. Neither document includes private machine paths, user data, course-vendor materials, or credential values.

#### 3. Release verification record

**File:** `context/changes/public-heist-mission/verification.md`

**Purpose:** Preserve deterministic evidence for plan review and later deployment approval.

**Contract:** Record commands and outcomes for typecheck, tests, deployment dry-run, dependency audit, publication scan, route smoke tests, and manual keyboard/mobile/prompt review. Production URL checks are added only after a separately approved deployment.

### Success Criteria

#### Automated verification

- `npm ci` succeeds from the lockfile.
- `npm run check` passes.
- `npm audit --audit-level=low` reports no unresolved vulnerability.
- `git diff --check` passes.
- Publication scan reports no credentials, private paths, local transcripts, or `.ai/` content in the proposed commit.

#### Manual verification

- Run the prompt against disposable Claude-style and Codex-style fixture directories, never the real profiles, and confirm inventory is read-only and forbidden categories remain unopened.
- Confirm one self-contained Markdown fixture can be copied only after both approvals and the source fixture remains byte-for-byte unchanged.
- Review the rendered page on desktop and mobile with keyboard navigation.
- Approve the final publication diff before opening or merging the pull request.

**Implementation note:** No production publish occurs in this phase. Deployment remains a separate explicit human gate.

---

## Testing Strategy

### Unit tests

- Validate mission ordering, slug uniqueness, complete The Heist fields, evidence count, and source-link presence.
- Validate prompt safety invariants and staged approval markers.
- Validate client behavior through small pure state helpers where practical; avoid adding a browser framework solely for this slice.

### Integration tests

- Exercise the Worker application for homepage, The Heist, unknown mission, stylesheet, and client-script responses.
- Verify security headers and response Content-Types.
- Verify all educational content is available without cookies or authentication.

### Manual testing steps

1. Open Mission Control and navigate to The Heist with keyboard only.
2. Copy each Launch Bay command and the mission prompt; exercise the clipboard fallback.
3. Run the prompt only against disposable fixtures and walk through both approval stops.
4. Confirm executable, credential, session, dependent, and symlinked fixtures are not migrated.
5. Complete the four evidence checks and verify the result is explicitly local and disappears on refresh.
6. Inspect narrow and wide viewports and confirm no command or primary action becomes unreachable.

## Performance Considerations

The lesson remains server-rendered with one small same-origin script and no data request after page load. Keep the prompt and lesson text in the Worker bundle, avoid client hydration, and preserve the existing deployment dry-run size check.

## Migration Notes

There is no data migration. Existing homepage URLs remain valid. The first mission entry becomes a link; later mission entries remain visible but do not claim implemented lesson routes. Product documents must be updated in the same change so the adaptive profile policy does not drift from the UI.

## References

- Roadmap item: `context/foundation/roadmap.md` — S-01 / `public-heist-mission`.
- Product requirements: `context/foundation/prd.md` — US-01 and FR-001.
- Curriculum contract: `context/foundation/curriculum.md` — Step 1: The Heist.
- Experience direction: `context/foundation/experience-design-research.md`.
- Pi environment variables: official `docs/environment-variables.md`.
- Pi skills: official `docs/skills.md`.
- Pi prompt templates: official `docs/prompt-templates.md`.
- Pi packages and security warning: official `docs/packages.md`.
- Pi settings and project trust: official `docs/settings.md`.
- Current public vendor documentation for Claude Code and Codex resource locations, reviewed during planning without inspecting local profiles.

## Progress

> Convention: `- [ ]` pending, `- [x]` done. Append ` — <commit sha>` when a step lands. Do not rename step titles.

### Phase 1: Align Contracts and Define the Mission

#### Automated

- [x] 1.1 Verify exactly twelve ordered mission records with unique slugs — 9d414f3
- [x] 1.2 Verify The Heist includes Launch Bay, approval boundaries, four evidence items, and official sources — 9d414f3
- [x] 1.3 Verify prompt tests cover prohibited categories, approval stops, untrusted content, native activation, and narrow copy scope — 9d414f3
- [x] 1.4 Pass typechecking and unit tests — 9d414f3
- [x] 1.5 Keep AGENTS.md within 400 words — 9d414f3

#### Manual

- [x] 1.6 Approve the complete mission prompt as a safe staged operator — 9d414f3
- [x] 1.7 Approve the adaptive profile policy across canonical documents — 9d414f3

### Phase 2: Deliver the Mission Workspace

#### Automated

- [x] 2.1 Verify The Heist returns public HTML with the complete lesson contract — 00b86b4
- [x] 2.2 Verify the homepage links The Heist and still lists twelve missions — 00b86b4
- [x] 2.3 Verify unknown mission slugs return 404 — 00b86b4
- [x] 2.4 Verify the client script Content-Type and absence of persistence or network calls — 00b86b4
- [x] 2.5 Verify existing CSP and security headers remain intact — 00b86b4
- [x] 2.6 Pass the complete local quality gate — 00b86b4

#### Manual

- [x] 2.7 Verify lesson navigation and copy interactions using keyboard only — 00b86b4
- [x] 2.8 Verify the Clipboard API fallback leaves copyable text and clear feedback — 00b86b4
- [x] 2.9 Verify local evidence appears only after four checks and resets on refresh — 00b86b4
- [x] 2.10 Accept desktop and mobile mission layouts without a fake terminal — 00b86b4

### Phase 3: Harden Safety, Documentation, and Release Evidence

#### Automated

- [x] 3.1 Pass a clean lockfile install
- [x] 3.2 Pass the complete quality gate
- [x] 3.3 Pass the dependency audit
- [x] 3.4 Pass diff validation
- [x] 3.5 Pass publication scan with no sensitive artifacts

#### Manual

- [ ] 3.6 Verify inventory and both approval stops against disposable Claude-style and Codex-style fixtures
- [ ] 3.7 Verify a self-contained fixture activates or copies while its source stays byte-for-byte unchanged
- [x] 3.8 Verify final desktop and mobile layouts with keyboard navigation
- [ ] 3.9 Approve the final publication diff
