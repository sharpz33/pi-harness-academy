# Pi Ecosystem — Wow Research

**Researched:** 2026-09-10
**Purpose:** Identify source-backed Pi projects and demonstrations that can inspire an exciting learning arc. This is research input, not the final curriculum.

## Executive finding

The exciting story of Pi is not configuration. It is progressive transformation:

> A tiny coding-agent core can become a browser operator, an IDE-aware engineer, a voice-controlled assistant, a parallel software team, an autonomous experiment loop, or a self-modifying harness whose behavior remains inspectable as code.

The curriculum should reveal a new category of possibility at every step. Settings, trust, context management, and safety should be learned only when they unlock or protect a visible capability.

## Selection principles

A strong academy step should satisfy most of these:

1. Produce a visible or surprising result quickly.
2. Solve a problem an experienced coding-agent user already recognizes.
3. Reveal a reusable Pi extension seam rather than one package-specific trick.
4. Leave behind a working artifact or capability.
5. Increase ambition compared with the previous step.
6. Include safety proportional to the capability being unlocked.

Installing a large third-party package is evidence of what is possible, but should not automatically become a learner requirement. Pi packages execute with the user's permissions and must be reviewed and pinned before use.

## People and projects worth studying

### Mario Zechner / the Pi project — Pi as a programmable terminal application

Sources:

- https://github.com/earendil-works/pi
- https://github.com/earendil-works/pi/tree/main/packages/coding-agent/examples/extensions

Standout official examples:

- `doom-overlay/`: playable DOOM rendered inside a floating Pi terminal overlay.
- `space-invaders.ts`: real-time animation, collision state, and continuous keyboard input.
- `tic-tac-toe.ts`: the human and agent interact with shared game state through UI and tool calls.
- `questionnaire.ts`: an agent-callable structured wizard instead of free-form chat.
- `plan-mode/`: an extension becomes an entire operating mode with policy, state, commands, and UI.
- `gondolin/`: built-in filesystem and shell operations are redirected into a micro-VM.
- `interactive-shell.ts`: Pi yields terminal control to full-screen applications and resumes afterward.

Why it matters:

The games are spectacle, but their real lesson is that Pi's interface, input handling, tool policy, execution backend, and operating modes are replaceable. Pi can become an application platform around the agent loop.

Curriculum signal: use one immediate visual mutation early to destroy the assumption that Pi is merely another chat CLI.

### Ilovepixelart — `pi-code`

Sources:

- https://github.com/ilovepixelart/pi-code
- https://pi.dev/packages/pi-code

Capability:

- Reads existing Claude-style rules, commands, skills, hooks, agents, MCP configuration, and output styles.
- Adds checkpoints, rewind, memory, web access, subagents, goal loops, todos, and plan mode.

Why it matters:

For the academy's primary persona, the strongest immediate promise may be: existing Claude Code assets can appear inside Pi instead of being manually recreated. This turns migration from a rewrite into a controlled import and then exposes each capability as optional.

Caveats:

- Broad executable and compatibility surface.
- One maintainer and very rapid releases.
- A recent checkpoint regression reportedly created very large local stores before being fixed.
- Must be pinned, reviewed, and treated as optional inspiration rather than a silent dependency.

Curriculum signal: an import inventory or compatibility reveal could be the opening earthquake, even if the academy implements a smaller, safer version rather than requiring `pi-code`.

### Alex Yang — `agegr/pi-web`

Source: https://github.com/agegr/pi-web

Capability:

A local browser frontend for existing Pi state: sessions, branching, context usage, Git diffs, file previews, worktrees, provider/model configuration, extensions, and skills.

Why it matters:

One command turns terminal Pi into a rich local agent cockpit without migrating sessions. The same underlying harness can have radically different interfaces.

Caveat:

Localhost operation is straightforward; remote exposure is high risk because the agent can operate with local process permissions.

Curriculum signal: interface is a replaceable skin over the harness, not the harness itself.

### Andrea Corvi / StreetCoding — `a-streetcoder/agent-deck`

Sources:

- https://github.com/a-streetcoder/agent-deck
- https://agentdeck.site/

Capability:

A native macOS cockpit using Pi RPC: multiple sessions, custom agents, skills and prompts, issue-driven work, Git worktrees, memory, models, and review-before-merge flows.

Why it matters:

It shows Pi as a runtime beneath a polished control plane for parallel engineering work. Resource assignment and isolated worktrees become visible instead of hidden in terminal commands.

Caveats:

- Young project, concentrated maintenance.
- Apple Silicon and recent macOS only.
- Worktree isolation is not an operating-system sandbox.

Curriculum signal: Pi can power products and control planes, not just terminal sessions.

### Mitch Fultz — `fitchmultz/pi-agent-browser-native`

Source: https://github.com/fitchmultz/pi-agent-browser-native

Capability:

A native browser automation tool with compact semantic snapshots, stable element references, screenshots, downloads, recordings, profiles, Electron attachment, stale-reference handling, and recursive secret redaction.

Why it matters:

This turns Pi into an agent that can inspect and operate the application it is building. More importantly, the wrapper demonstrates that a useful tool is not merely a shell command: it needs bounded output, recoverable references, redaction, artifacts, and explicit policy.

Caveats:

- High setup complexity and several external prerequisites.
- Pre-1.0 integration surface.

Curriculum signal: a browser feedback loop is one of the strongest practical superpowers and an excellent bridge from coding to autonomous verification.

### Samuel Painter — `samfoy/pi-lsp-extension`

Source: https://github.com/samfoy/pi-lsp-extension

Capability:

LSP diagnostics, types, definitions, references, symbols, completion, rename previews, and structural search/rewrites. Diagnostics can be appended directly after edits.

Why it matters:

Pi can receive IDE-grade semantic feedback in the same edit loop instead of relying only on text search and later test runs. This creates a visibly smarter coding agent.

Caveats:

- Requires language-server installation and setup.
- Claims depend on the quality and readiness of each underlying server.

Curriculum signal: extensions can close the agent's feedback loop at the tool boundary.

### Nico Bailon — `nicobailon/pi-subagents`

Source: https://github.com/nicobailon/pi-subagents

Capability:

Specialist child agents, parallel execution, background missions, review loops, schedules, worktrees, persistent FleetView, transcript inspection, and mid-run steering.

Why it matters:

One Pi session becomes an observable fleet. A parent can delegate research, implementation, and review, then inspect or redirect running children.

Caveats:

- Parallelism multiplies token cost and permission risk.
- More agents do not automatically improve correctness.

Curriculum signal: delegation becomes compelling only after the learner has tools, context, and safety boundaries worth delegating.

### Baochun Li — `baochunli/pi-collaborating-agents`

Source: https://github.com/baochunli/pi-collaborating-agents

Capability:

Parallel agents can message one another, reserve files, expose status in an `/agents` overlay, and collect results. Conflicting Pi `write` and `edit` operations can be blocked through cooperative reservations.

Why it matters:

This goes beyond parent-child delegation and resembles a small distributed software team with communication and ownership.

Caveats:

- Reservations are cooperative extension policy, not filesystem locks.
- Shell commands and external tools can bypass them.

Curriculum signal: once multiple agents collaborate, coordination and conflict policy become first-class product features.

### Dave — `davebcn87/pi-autoresearch`

Source: https://github.com/davebcn87/pi-autoresearch

Capability:

An autonomous experiment loop generates an idea, changes code, runs a benchmark, keeps improvements, reverts regressions, records results, and continues.

Why it matters:

This is one of the strongest end-state ideas because improvement is selected by an external metric rather than by the agent praising its own output. The agent can search an implementation space while preserving evidence and rollback.

Caveats:

- Safe only when the metric is meaningful and the experiment boundary is constrained.
- Optimizing a weak metric can produce confidently wrong outcomes.

Curriculum signal: autonomy becomes credible when every loop has an objective evaluator, a journal, and rollback.

### Qredence — `fleet-pi`

Source: https://github.com/Qredence/fleet-pi

Capability:

A persistent workspace with Plan, Agent, and Harness modes where Pi can create skills, prompts, and tools, run evaluations, keep durable plans and memory, and expose a web UI.

Why it matters:

Pi becomes the architect of its own future working environment. Adaptations remain reviewable repository artifacts instead of hidden model state.

Caveats:

- Ambitious but less widely adopted than the major orchestration packages.
- Self-modification without tests and rollback becomes configuration drift.

Curriculum signal: this is a strong candidate for the final brain-explosion concept—an agent that helps build and evaluate its own harness.

### Runchr Works — `pi-hindsight`

Source: https://github.com/runchr-works/pi-hindsight

Capability:

After work completes, a background Pi fork reviews the interaction, extracts reusable patterns with confidence, stores them, and injects relevant lessons before later tasks.

Why it matters:

The harness can improve from its own operating history rather than depending on a manually maintained monolithic instruction file.

Caveats:

- New and experimental.
- Reflection can reinforce mistakes unless patterns remain inspectable and removable.

Curriculum signal: memory should culminate in evidence-backed adaptation, not indiscriminate transcript hoarding.

### Elpapi42 — `pi-observational-memory`

Source: https://github.com/elpapi42/pi-observational-memory

Capability:

Continuous source-backed observations and background distillation make long sessions survive repeated compaction; recalled summaries can be traced to source evidence.

Why it matters:

It addresses a pain every heavy agent user knows: context compression erases rationale and rejected approaches. The goal is not a bigger prompt but durable, attributable memory.

Curriculum signal: context management becomes exciting when framed as giving the agent continuity across days rather than teaching a compaction command.

### Shaftoe — `pi-coding-agent-action`

Source: https://github.com/shaftoe/pi-coding-agent-action

Capability:

Issue or pull-request comments invoke Pi for reviews, fixes, and maintenance inside GitHub-compatible CI workflows.

Why it matters:

Pi leaves the developer's terminal and becomes an event-driven engineering worker. The trigger, permissions, artifacts, and approval boundary become part of the harness.

Curriculum signal: deployment of the harness can mean embedding it into the software-delivery system, not deploying another chat interface.

### Earendil Works — `pi-chat`

Source: https://github.com/earendil-works/pi-chat

Capability:

Persistent Pi-powered workers connected to messaging channels, with skills, memory, attachments, secret exchange, and isolated Gondolin micro-VMs.

Why it matters:

This is a credible example of Pi's ideas expanding into an always-available agent system while preserving isolated execution boundaries.

Curriculum signal: Pi can be the engine inside agents that live outside the terminal.

## Additional high-wow directions

These projects are compelling but require stronger compatibility or security verification before recommendation:

- `badlogic/pi-doom`: maximal visual surprise; possible current API drift.
- `yukukotani/pi-voice`: global push-to-talk and spoken feedback; older package scope and uncertain current compatibility.
- `khimaros/pi-omni`: continuous bidirectional browser voice with local-model options.
- `BillJr99/AutoGUI`: screenshot/accessibility-tree desktop control and browser automation; experimental and high privilege.
- `ygncode/pi-web`: operate Pi from a phone or tablet through a browser.
- `pithings/pi-vscode`: live editor selections, diagnostics, symbols, and package management around a Pi TUI; promising but early and possibly stale.
- `QuintinShaw/pi-dynamic-workflows`: generated orchestration programs with journaled resume, worktree isolation, model routing, and cost accounting.
- `harms-haus/pi-subagent-tasks`: task DAGs, bounded concurrency, worktrees, and worker-reviewer gate loops.
- `samfoy/pi-ralph`: bounded planner/builder/reviewer loops with persistent iteration history.
- `shog-lab/pi-mind`: inspectable Markdown/YAML memory with hybrid retrieval and approval before generated skills influence future work.

## Seven escalating wow vectors

These are experience categories, not proposed lesson titles.

### 1. Instant metamorphosis

A tiny installation or import visibly changes what Pi is: existing agent assets appear, a new cockpit opens, or the TUI becomes an unexpected interactive application.

Emotional beat: "This is not another fixed coding CLI."

Evidence: `pi-code`, `pi-web`, Agent Deck, official DOOM and custom-UI examples.

### 2. New senses

Pi gains direct browser, IDE, voice, screenshot, or desktop perception.

Emotional beat: "It can see the same system I see."

Evidence: browser-native, LSP extension, Pi VS Code, Pi Voice, AutoGUI.

### 3. Closed feedback loops

Pi edits, observes diagnostics or browser behavior, and corrects itself without waiting for the human to translate every failure.

Emotional beat: "It does not only generate; it verifies."

Evidence: LSP diagnostics after edit, browser automation, test and condition loops.

### 4. Continuity

Pi preserves rationale, evidence, preferences, and unfinished work across compaction and sessions.

Emotional beat: "It remembers why, not only what."

Evidence: observational memory, pi-mind, hindsight, native session trees.

### 5. Multiplication

One session becomes specialists working in parallel with visible state, worktrees, communication, and review.

Emotional beat: "I am no longer operating one agent."

Evidence: pi-subagents, collaborating agents, dynamic workflows, task pools.

### 6. Presence outside the terminal

Pi responds to repository events, messaging, schedules, phone/browser clients, or remote control planes.

Emotional beat: "The harness became part of my engineering system."

Evidence: pi-coding-agent-action, pi-chat, remote/mobile web projects, Agent Deck.

### 7. Evidence-backed self-evolution

Pi proposes or creates changes to code or to its own harness, evaluates them, preserves winners, rejects regressions, and leaves an auditable history.

Emotional beat: "The tool can improve the system that makes the tool effective."

Evidence: pi-autoresearch, fleet-pi, hindsight, dynamic workflows, inspectable memory projects.

## Provisional final capability — The Gauntlet

The selected end-state is an autonomous multi-agent pull-request pipeline with no human in the execution loop after policy configuration:

1. A builder implements the task and opens a pull request.
2. Reviewer A examines the pull request in a fresh context.
3. The builder addresses findings.
4. Reviewer A verifies the corrections.
5. Reviewer B performs an independent blind review without seeing Reviewer A's verdict first.
6. The builder addresses any independent findings.
7. A final verifier runs deterministic tests and browser-level acceptance checks.
8. The pull request is approved and automatically merged only when every required gate passes.

Independence requirements:

- isolated sessions and context windows;
- reviewer access to requirements and the pull-request diff, not builder reasoning;
- blind second review;
- preferably different models or providers for correlated-error reduction;
- builder cannot approve its own work;
- reviewers cannot modify implementation;
- bounded correction loops;
- timeout, unresolved disagreement, failed checks, or missing evidence ends fail-closed without merge.

The human defines the policy and scope before execution but does not approve individual changes inside the run.

The required academy checkpoint executes against a controlled training repository where automatic merge is safe and reproducible. After passing it, the learner may optionally run the same Gauntlet against their own repository with independently configured permissions and branch policy.

## What should not become the course

- A tour of settings screens.
- Twelve independent package installations.
- A clone of Claude Code's feature checklist.
- Unbounded multi-agent demos with no verification.
- Memory that merely stores entire transcripts.
- Self-modification without evaluation, provenance, and rollback.
- Unsafe automation presented as magic.
- Claims that OpenClaw's complete product surface is attributable to Pi alone.

## Selected lesson rhythm

Every step follows a hybrid progression:

```text
WOW → mission → inspect the mechanism → personal upgrade → checkpoint
```

Early steps activate reviewed and pinned capabilities quickly. Middle steps modify and combine them. Later steps require the learner to build original extensions and orchestration. The final system is therefore constructed rather than merely collected from package installations.

## Open design tensions

1. **Opening earthquake:** compatibility/import, spectacular custom UI, or immediate real-world browser control?
2. **Build versus install:** should learners implement small extensions or compose reviewed packages?
3. **Platform breadth:** avoid steps that only work on one operating system unless clearly optional.
4. **Time-to-wow:** the first result should occur in minutes, not after a full configuration lecture.
5. **Safety pacing:** introduce each safeguard immediately before or alongside the power that makes it necessary.
6. **Final reveal:** self-evolving harness is the strongest conceptual ending, but the checkpoint must remain bounded and demonstrable.

## Source reliability notes

- Official Pi examples and documentation are strongest for extension capabilities.
- Repository README claims were checked for maintenance, setup, and obvious limitations where source data was available.
- Community packages are not security-vetted by catalog presence or download count.
- Fast-moving package versions and namespace changes can invalidate exact install instructions.
- OpenClaw historically embedded Pi runtime packages, but its current runtime has been internalized; attribute complete OpenClaw capabilities to OpenClaw, not Pi alone.
