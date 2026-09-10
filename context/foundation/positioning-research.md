# Pi Harness Academy — Positioning Research

**Researched:** 2026-09-10
**Purpose:** Evidence and messaging inputs for product positioning and homepage copy.

## Primary pain

Developers lose control over the cost and behavior of a feature-rich coding harness. They pay in context, complexity, and workflow constraints for capabilities they may not need, but moving to Pi exposes a second problem: Pi's minimal core requires them to deliberately reconstruct the capabilities and safeguards they do need.

Token overhead is the clearest symptom, not the complete problem.

## Product insight

Pi's advantage is not simply that it starts smaller. It gives developers ownership of the harness: models, tools, instructions, extensions, session behavior, and interface can be selected or replaced. The useful product is therefore a guided path from minimal core to a deliberate, safe, and efficient personal harness.

Minimalism is the starting point, not the finished setup.

## Source-backed findings

### 1. Pi starts with a deliberately small core

The official Pi documentation describes Pi as a minimal terminal coding harness and states that it exposes four tools by default: `read`, `write`, `edit`, and `bash`. Additional behavior is opt-in through extensions, skills, prompt templates, themes, and packages.

This supports a positioning claim about control over what enters the harness. It does not by itself prove lower total cost for every real task.

### 2. Cold-start payload can be substantially smaller

An independent experiment published on 2026-05-18 captured the first request from Claude Code, OpenCode, and Pi using the same model and provider path for the trivial prompt `just say "hello", nothing else`.

Reported input tokens:

| Harness | Input tokens | Tools exposed | First-turn cost |
|---|---:|---:|---:|
| Claude Code | 28,407 | 27 | $0.0391 |
| OpenCode | 12,374 | 12 | $0.0170 |
| Pi | 2,768 | 5 | $0.0031 |

The experiment attributed most of the difference to the system prompt and tool catalog:

| Component | Claude Code | Pi |
|---|---:|---:|
| System prompt | about 6,600 tokens | about 900 tokens |
| Tool catalog | about 18,900 tokens | about 1,100 tokens |

The tested Pi configuration exposed five tools, while current official Pi documentation states four default tools. Treat the experiment as a dated configuration snapshot, not a permanent product specification.

### 3. Do not claim that Pi is always ten times cheaper

The same experiment showed that prompt caching can greatly reduce the recurring cost difference. In its specific Bedrock and Haiku setup, the estimated steady-state cost of cached Claude Code context was approximately the same as Pi's uncached minimal context.

The experiment covered one cold request in a fake project. It did not measure real-task success, total session cost, latency, or output quality.

Safe claim: Pi can begin with substantially less harness context and lets the developer decide what to add.

Unsafe claim: Pi is always 10x cheaper than Claude Code.

### 4. Pi provides composition and provider choice

Official Pi documentation supports:

- multiple model providers and in-session model selection;
- project and user extensions written in TypeScript;
- custom or replaced tools;
- skills and prompt templates loaded on demand;
- custom providers, UI components, event handlers, and session behavior;
- reusable packages distributed through npm or Git.

This makes control and portability stronger positioning pillars than raw token savings alone.

### 5. The minimal core omits safeguards and product features

Pi explicitly does not ship several features as mandatory built-ins, including a permission popup system, plan mode, sub-agents, MCP, and built-in task lists. Its repository warns that Pi runs with the permissions of the process that launched it and recommends sandboxing or containerization when stronger boundaries are required.

The comparison experiment also found much shorter Pi tool descriptions. Claude Code's longer descriptions included operational and Git safety guidance that Pi did not provide by default.

This creates the academy's key educational job: help a developer add only the capabilities they need while deliberately restoring appropriate guardrails.

## Homepage messaging implications

### Recommended primary promise

Build a Pi coding harness you control — lean where it should be, guarded where it must be.

### Supporting message

Move from Claude Code or Codex to a deliberate Pi setup without guessing which models, instructions, tools, skills, extensions, and safety boundaries to configure first.

### Proof direction

Use the cold-start payload comparison only with its date, experimental setup, and caching caveat. Prefer durable product facts in primary copy:

- minimal default toolset;
- opt-in capabilities;
- multi-provider model support;
- replaceable tools and extensions;
- explicit safety configuration rather than hidden assumptions.

### Messaging to avoid

- "Pi is always 10x cheaper."
- "Claude Code wastes 90% of tokens."
- "Pi is safer by default."
- "Pi replaces every Claude Code or Codex feature out of the box."

## Sources

1. Pi repository and coding-agent documentation: https://github.com/earendil-works/pi
2. Pi local documentation used for feature verification: `@earendil-works/pi-coding-agent/README.md`
3. Independent payload experiment: https://c-daniele.github.io/en/posts/2026-05-18-coding-harness-comparison/
4. OpenAI Codex repository: https://github.com/openai/codex

## Research limitations

- Harnesses and their prompts change quickly; numerical comparisons require a date and version context.
- No equivalent controlled Pi-versus-Codex token measurement was found in the reviewed primary or inspectable sources.
- Search-engine summaries and unsourced benchmark claims were excluded from the conclusions.
