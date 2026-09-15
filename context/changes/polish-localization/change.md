---
change: polish-localization
status: active
created: 2026-09-15
---

# Polish localization

## Outcome

Add a complete Polish Academy experience under `/pl` while preserving every current English URL and behavior.

## Locked decisions

- English remains canonical at the existing unprefixed routes.
- Polish pages use the `/pl` prefix and expose an explicit EN/PL switcher.
- Polish UI, lesson explanations, mission metadata, evidence labels, authentication, Journey, device authorization, deletion, proof, and error pages are translated.
- Executable mission prompts and command values remain byte-for-byte English to preserve their reviewed semantics and checkpoint contracts.
- API routes, mission slugs, evidence IDs, database records, and companion protocol remain language-neutral and unchanged.

## Acceptance criteria

- `/` and every current English route remain unchanged and pass existing tests.
- `/pl` and `/pl/missions/:slug` expose all twelve lessons anonymously in Polish.
- The language switcher preserves the equivalent page, including mission slug and safe return destination.
- Polish authentication returns the learner to the requested Polish page; scanner-safe verification remains side-effect free.
- Polish Journey links, device flow, progress deletion, and proof views preserve learner ownership and current business rules.
- `<html lang>` and titles match the selected locale.
- All localizable browser strings are covered by tests; mission prompts, command values, evidence IDs, and API payloads remain unchanged.
- Desktop and 390 px mobile smoke tests pass without horizontal overflow.

## Non-goals

- Browser-language auto-detection.
- Translating executable mission prompts or shell commands.
- Changing API response language or companion notifications.
- Changing database schema, mission slugs, checkpoint IDs, or readiness rules.
- Replacing the current English root with Polish.
