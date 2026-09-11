# Pi Harness Academy — Experience Design Research

**Reviewed:** 2026-09-11

## Conclusion

“Hitchcock arc” is not an established UX or instructional-design pattern. Pi Harness Academy uses it as internal shorthand for a suspense-driven mastery loop:

> Brief the mission → act in the real environment → receive evidence → pass a verified checkpoint → reveal a fair complication → bank visible progress.

The product should compose proven mechanics instead of cloning one reference. The target experience is quiet like Pi, scenario-driven like Agent Breaker and Advent of Code, verified like CodeCrafters and GitHub Skills, operational like PortSwigger Academy, and inspectable like Prompt Airlines.

## Primary reference set

### Pi

URL: https://pi.dev

Borrow:

- sparse editorial hierarchy;
- one primary sentence per screen;
- executable commands as first-class interface elements;
- evidence placed beside product claims;
- monochrome hierarchy built from typography, spacing, rules, and indentation;
- concise negative positioning;
- automatic light and dark presentation.

Do not copy Pi’s slogans, figure treatment, playful page-manipulation interaction, or exact page structure. Academy needs orientation, progress, verification, failure, and recovery states absent from a marketing page.

### Lakera Agent Breaker

URL: https://play.lakera.ai/agent-breaker

Borrow:

- scenario card → authentic action surface → measurable outcome;
- immediately understandable first objective;
- later missions that add tools, memory, permissions, ingestion surfaces, and consequences;
- separate presentation of objective and action vector;
- mission escalation through system changes rather than harder wording.

Do not copy fictional applications, branding, objectives, scoring thresholds, leaderboards, or an exclusively adversarial-security framing.

### Advent of Code

URL: https://adventofcode.com/

Borrow:

- narrative continuity;
- compact progress artifact;
- verified completion followed by a hidden second reveal;
- anticipation of the next complication.

Do not copy its appearance, seasonal calendar, prose density, speed competition, or puzzle content.

### CodeCrafters

URL: https://codecrafters.io/challenges

Borrow:

- authentic local work;
- remote stage verification;
- structured test output;
- next stage unlocked by evidence rather than self-report.

Do not require Git as the first interaction or hide all verifier logic behind an opaque pass/fail result.

### GitHub Skills

URL: https://skills.github.com/

Borrow:

- learning inside the authentic tool;
- external automation that verifies a real action;
- progressive reveal after verified completion.

Do not copy multi-tab context switching, delayed feedback, or dependence on notifications.

### PortSwigger Web Security Academy — LLM attacks

URL: https://portswigger.net/web-security/llm-attacks

Borrow:

- one concrete system per lab;
- completion through an observable state change;
- visible learning-path progress and difficulty;
- durable verified completion.

Do not copy dense global navigation, destructive motifs, or solutions positioned beside an active attempt.

### Prompt Airlines

URL: https://promptairlines.com/

Borrow:

- an “under the hood” evidence view;
- visible agent behavior instead of a mysterious score;
- capabilities introduced as later challenges unlock.

Do not copy its theme, CTF flag syntax as the universal verifier, or hidden-state exposition that reveals solutions.

## Additional AI references

- Lakera Gandalf: https://gandalf.lakera.ai/
- HackAPrompt: https://www.hackaprompt.com/
- Tensor Trust: https://tensortrust.ai/
- Microsoft LLMail-Inject: https://github.com/microsoft/llmail-inject-challenge
- Microsoft AI Red Teaming Playground Labs: https://github.com/microsoft/AI-Red-Teaming-Playground-Labs
- Hugging Face Agents Course: https://huggingface.co/agents-course
- Microsoft AI Agents for Beginners: https://github.com/microsoft/ai-agents-for-beginners
- Kodwai: https://www.kodwai.com/
- Terminal-Bench: https://www.tbench.ai/
- Injection Arena: https://injection-arena.agentpostmortem.com/

Terminal-Bench is primarily a verifier-design reference. Hugging Face Agents Course and Kodwai are useful references for build-oriented progression and working with a real local agent rather than a toy browser editor.

## Information architecture

Use:

> Track → Mission → Checkpoint → Attempt → Evidence

Avoid an LMS hierarchy of courses, modules, chapters, pages, quizzes, currencies, streaks, and leaderboards.

Each mission exposes:

- one-sentence objective;
- why it matters;
- available actions;
- constraints;
- progressively disclosed hints;
- named completion checks;
- the next complication only after success.

## Original layout direction

### Public homepage

Use Pi’s sparse editorial language:

- one strong promise;
- one installation/start command;
- a compact map of the 12 missions;
- short capability demonstrations with real evidence;
- one clear route into the first mission.

### Mission workspace — desktop

Use two permanent regions, not three dense panes:

```text
┌──────────────────────────────────────────────────────────────┐
│ PI HARNESS ACADEMY   ACT II   MISSION 05/12   PROFILE: LIVE │
├───────────────┬──────────────────────────────────────────────┤
│ MISSION MAP   │  05 / TOTAL RECALL                           │
│               │  One sentence describing the new capability.│
│ ✓ Heist       │                                              │
│ ✓ X-Ray       │  [ Brief ] [ Workbench ] [ Evidence ]        │
│ ✓ Hands       │                                              │
│ ✓ Time        │  Copy: /academy-check                        │
│ ● Recall      │                                              │
│ ○ Hindsight   ├──────────────────────────────────────────────┤
│ …             │ CHECKS  ✓ profile  ✓ memory  ○ fresh recall │
└───────────────┴──────────────────────────────────────────────┘
```

- Header: identity, act, mission count, Academy-profile state.
- Narrow mission rail: titles and state only.
- Main workspace: Brief, Workbench, and Evidence views.
- Workbench: instructions and copyable local Pi commands, never a fake browser terminal.
- Evidence: individual companion assertions, diagnostics, and submitted fields.
- One primary action at a time.

### Mission workspace — mobile

- Single column.
- Sticky one-sentence objective and check count.
- Tabs: Brief / Work / Evidence.
- Mission map in a drawer or sheet.
- Copy and verify actions remain reachable without scrolling through the full lesson.
- Command output scrolls horizontally without shrinking type.

## Visual language

- Near-black and warm off-white foundations.
- Grayscale for normal hierarchy.
- One Pi-derived accent for active states.
- Green only for verified success.
- Amber only for incomplete evidence.
- Red only for actionable failure or destructive operations.
- One-pixel rules, modest radii, restrained shadows, and no decorative gradients.
- Readable sans serif for explanation; monospace for commands, identifiers, checks, and evidence.
- No neon cyberpunk, fake CRT, generic AI sparkles, currencies, streaks, or confetti.
- Motion communicates execution, check transitions, and newly revealed state.

## Narrative rule

Suspense reveals the stakes before action. Surprise withholds the exact form of the next fair complication. Payoff lets the learner’s demonstrated capability resolve the tension.

Later missions may introduce a new tool, context source, permission boundary, memory layer, reviewer, or failure mode. They must not arbitrarily erase previously verified progress.
