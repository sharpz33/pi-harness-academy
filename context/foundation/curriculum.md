---
project: "Pi Harness Academy"
status: locked-draft
created: 2026-09-10
updated: 2026-09-10
steps: 12
---

# Pi Harness Academy — Curriculum

## Promise

Start by reclaiming one capability from an existing coding harness. Finish with an autonomous engineering fleet that implements a task, survives independent reviews and verification, and merges its own pull request.

The curriculum teaches Pi through escalating capabilities, not through a tour of configuration files. Its purpose is useful learning and genuine enjoyment, not account conversion. All knowledge remains publicly readable; an account provides the technical identity required for companion-verified progress. Sharing exists only as an optional invitation for others to join the fun.

## Learning rhythm

Every step follows the same rhythm:

```text
WOW → mission → inspect the mechanism → personal upgrade → checkpoint
```

Early steps activate reviewed, pinned capabilities quickly. Middle steps inspect and modify them. Later steps require original extension and orchestration work. Each retained capability compounds into the final mission.

## Isolated cumulative profile

All required work runs through an isolated Academy profile:

```bash
PI_CODING_AGENT_DIR="$HOME/.pi-academy" pi
```

The learner's normal Pi profile and source Claude Code or Codex setup remain unchanged. The Academy profile is authorized through a revocable browser-based device flow and never receives or reuses model-provider credentials from the Academy service.

Retain across steps:

- reviewed skills, prompts, extensions, tools, policies, and memory;
- learner-created artifacts and workflow definitions;
- decisions about why each capability was included.

Remove or quarantine after demonstrations:

- novelty-only packages;
- disposable files and repositories;
- incompatible or unreviewed experiments.

Never migrate automatically:

- credentials or secret values;
- executable hooks, MCP commands, plugins, or extensions without review;
- private session transcripts.

## Act I — Your agent mutates

### Step 1: The Heist

**Reveal:** Your favorite capability from Claude Code or Codex can run inside an isolated Pi without replacing or modifying the source setup.

**Mission:** Perform a read-only inventory, classify resources as native, adaptable, quarantined, or forbidden, then migrate one selected capability into the Academy profile.

**Completion checkpoint:**

- at least one selected capability executes successfully in the Academy Pi profile;
- the source harness configuration remains unchanged;
- no credential value or unreviewed executable configuration was copied or executed;
- the learner can identify what was migrated and what was deliberately left behind.

**Mechanics learned by necessity:** isolated config directory, resource scopes, project trust, instructions, skills or prompts, package review.

### Step 2: X-Ray Vision

**Reveal:** Pi receives semantic code intelligence and can react to diagnostics in the same editing loop.

**Mission:** Use language intelligence to trace a symbol through a training repository, make a non-trivial change, and close the resulting diagnostic loop.

**Completion checkpoint:**

- Pi locates a definition and at least one semantic reference without relying only on text search;
- Pi performs the requested change;
- relevant diagnostics are captured after the edit;
- the final state has no unresolved diagnostic introduced by the mission.

**Mechanics learned by necessity:** native tools, extension tools, bounded tool output, language-server lifecycle, feedback attached to edits.

### Step 3: Eyes & Hands

**Reveal:** Pi operates the real application it is building and returns visual evidence.

**Mission:** Give Pi controlled browser access, ask it to reproduce a defect in a training application, implement a correction, and rerun the user flow.

**Completion checkpoint:**

- Pi navigates and completes the specified browser interaction without the learner clicking on its behalf;
- Pi captures evidence of the failing state;
- Pi changes the application and repeats the same interaction;
- a final screenshot or equivalent browser artifact demonstrates the corrected behavior;
- sensitive values are absent from captured output and artifacts.

**Mechanics learned by necessity:** structured browser tools, semantic element references, stale-state recovery, artifact handling, redaction.

### Step 4: The Time Machine

**Reveal:** Pi can explore competing implementations without gambling the working state.

**Mission:** Start from one task, create two isolated solution branches, compare evidence from both, retain the stronger result, and prove rollback works.

**Completion checkpoint:**

- two alternatives originate from the same baseline and remain isolated;
- each alternative produces a diff and verification result;
- the comparison records why one alternative wins;
- the rejected alternative can be removed without affecting the winner;
- the retained worktree is clean and reproducible after rollback testing.

**Mechanics learned by necessity:** session branching, Git worktrees, checkpoints, comparison artifacts, rollback boundaries.

## Act II — Your agent becomes alive

### Step 5: Total Recall

**Reveal:** A fresh Pi session remembers project rationale rather than receiving the entire old transcript.

**Mission:** Record a decision, rejected alternative, and unresolved thread; close the session; then resume the work from a fresh session with source-backed recall.

**Completion checkpoint:**

- a fresh session retrieves the decision, rejected alternative, and unresolved thread;
- recalled statements point to inspectable source evidence;
- no full historical transcript is injected as the memory mechanism;
- the learner can correct or remove an inaccurate memory.

**Mechanics learned by necessity:** session persistence, compaction boundaries, inspectable memory, selective retrieval, provenance.

### Step 6: Hindsight

**Reveal:** Pi can inspect its own operating history and convert repeated friction into a reusable improvement.

**Mission:** Analyze completed sessions, identify one repeated failure or manual correction, and turn it into an inspectable lesson or proposed harness change.

**Completion checkpoint:**

- the analysis cites at least two source incidents supporting the detected pattern;
- one reusable lesson or change proposal is created as a reviewable artifact;
- the artifact describes when it applies and when it does not;
- a subsequent task demonstrates that the improvement is available;
- the improvement can be disabled or deleted.

**Mechanics learned by necessity:** session events, reflection, confidence and evidence, durable lessons, selective context injection.

### Step 7: The Forge

**Reveal:** Pi builds a missing capability for itself and begins using it without being replaced by another product.

**Mission:** Describe one capability missing from the learner's harness. Have Pi implement it as an extension, tool, command, hook, or interface component, then reload and exercise it.

**Completion checkpoint:**

- Pi creates an original, inspectable capability rather than only installing a package;
- the capability loads without startup errors;
- Pi invokes it successfully in a realistic task;
- failure and cleanup behavior are demonstrated;
- the capability is scoped to the Academy profile and can be removed cleanly.

**Mechanics learned by necessity:** extension lifecycle, events, custom tools or commands, UI integration, state, reload, cleanup.

### Step 8: Clone Protocol

**Reveal:** One Pi session can delegate specialist work without flooding its own context.

**Mission:** Define a focused specialist, delegate a bounded investigation, and consume only its evidence-backed result in the parent session.

**Completion checkpoint:**

- parent and specialist execute in separate sessions or context windows;
- the specialist has a narrower role and tool surface than the parent;
- the specialist returns a durable artifact or structured result;
- the parent receives a bounded summary rather than the full child transcript;
- the result includes enough evidence for the parent to verify it.

**Mechanics learned by necessity:** child sessions, role definitions, tool allowlists, result contracts, context isolation.

## Act III — Your agent becomes an organization

### Step 9: Council of Minds

**Reveal:** Independent models can disagree productively and be judged by evidence rather than brand or confidence.

**Mission:** Give the same decision problem to multiple isolated agents using different models or providers, preserve blind responses, and have an arbiter compare them against explicit criteria.

**Completion checkpoint:**

- at least two agents answer without seeing one another's work;
- model and provider identity are recorded for each response;
- the arbiter evaluates claims against shared criteria and cited evidence;
- disagreement remains visible in the final artifact;
- the selected recommendation explains why it won.

**Mechanics learned by necessity:** provider-neutral models, isolated prompts, model routing, structured judgments, correlated-error awareness.

### Step 10: The Crew

**Reveal:** Specialist agents collaborate on one code change while preserving ownership and avoiding conflicting edits.

**Mission:** Assign research, implementation, and review to separate agents working through isolated worktrees and explicit communication.

**Completion checkpoint:**

- researcher, builder, and reviewer operate in independent sessions;
- implementation work occurs in an isolated worktree;
- file ownership or reservations prevent conflicting Pi edits;
- review findings are returned to the builder rather than silently fixed by the reviewer;
- the integrated result passes the mission's deterministic checks;
- transcripts and role outputs remain inspectable.

**Mechanics learned by necessity:** parallel agents, messaging, worktrees, file reservations, role permissions, integration gates.

### Step 11: Escape the Terminal

**Reveal:** Pi becomes a persistent engineering worker that can be triggered from outside its interactive terminal.

**Mission:** Configure one external trigger—repository event, issue comment, or phone-accessible message—to start a bounded Pi mission in isolation and return the result to the initiating channel.

**Completion checkpoint:**

- the mission starts while no interactive Pi terminal session is driving it;
- trigger identity and requested scope are recorded;
- execution occurs in a constrained repository and environment;
- the initiating channel receives status and a durable result link or artifact;
- timeout and failure produce a visible failed state rather than silent continuation.

**Mechanics learned by necessity:** headless or RPC operation, event triggers, persistent workers, delivery channels, minimal permissions, sandboxing.

### Step 12: The Gauntlet

**Reveal:** A requirement becomes a merged pull request only after surviving implementation, independent reviews, corrections, deterministic verification, and browser acceptance—with no human in the execution loop.

**Required mission:** Run the complete Gauntlet against the controlled Academy training repository. After passing, the learner may optionally repeat it in their own repository under separately configured policy.

**Execution sequence:**

1. Builder implements the task and opens a pull request.
2. Reviewer A reviews the pull request in a fresh context.
3. Builder addresses blocking findings.
4. Reviewer A verifies the corrections.
5. Reviewer B performs a blind independent review without seeing Reviewer A's verdict first.
6. Builder addresses any new blocking findings.
7. Final Verifier runs deterministic tests and browser-level acceptance checks.
8. The pull request is approved and automatically merged only if every required gate passes.

**Completion checkpoint:**

- a pull request is created from the supplied requirement;
- builder and reviewers use isolated sessions and role-specific permissions;
- Reviewer B's first verdict is produced blind;
- reviewers report findings but cannot modify implementation;
- the builder cannot approve its own pull request;
- every blocking finding is corrected and rechecked;
- deterministic checks and browser acceptance evidence pass;
- the pull request is automatically approved and merged without a human action inside the run;
- the final report links the requirement, agent outputs, reviews, corrections, checks, pull request, and merge commit.

**Fail-closed conditions:**

- failed or missing deterministic check;
- unresolved blocking review finding;
- reviewer disagreement not resolved by policy;
- absent browser evidence where required;
- exceeded correction limit, timeout, or budget;
- missing role isolation or permission boundary.

Any fail-closed condition ends the mission without merge.

**Mechanics learned by necessity:** autonomous workflow orchestration, blind review, correction loops, machine gates, browser QA, pull-request policy, automatic merge, audit trail.

## Escalation map

```text
reclaim one capability
→ understand code
→ operate the application
→ experiment without fear
→ remember across days
→ learn from operating history
→ build new powers
→ create a specialist
→ convene independent minds
→ coordinate a team
→ operate outside the terminal
→ autonomously merge verified work
```

## Source inspirations

The curriculum borrows architectural patterns, not guarantees, from:

- https://github.com/ilovepixelart/pi-code
- https://github.com/samfoy/pi-lsp-extension
- https://github.com/fitchmultz/pi-agent-browser-native
- https://github.com/elpapi42/pi-observational-memory
- https://github.com/runchr-works/pi-hindsight
- https://github.com/nicobailon/pi-subagents
- https://github.com/baochunli/pi-collaborating-agents
- https://github.com/shaftoe/pi-coding-agent-action
- https://github.com/earendil-works/pi-chat
- https://github.com/davebcn87/pi-autoresearch
- https://github.com/Qredence/fleet-pi
- official Pi extension examples under `earendil-works/pi`.

Third-party projects require version pinning, source review, and compatibility testing before their exact install instructions become curriculum content.
