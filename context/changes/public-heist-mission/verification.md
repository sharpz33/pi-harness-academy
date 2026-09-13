# Verification: Public The Heist Mission

**Date:** 2026-09-12
**Scope:** Local release candidate; no production deployment

## Automated verification

| Check | Command | Outcome |
| --- | --- | --- |
| Clean install | `npm ci` | Passed; 73 packages installed, 0 vulnerabilities reported. npm warned that lifecycle scripts for three locked transitive packages are not allowlisted. No approval was added. |
| Typecheck, tests, dry-run bundle | `npm run check` | Passed; TypeScript passed, 13 tests passed, and Wrangler dry-run produced a 49.24 KiB bundle with no bindings. |
| Dependency audit | `npm audit --audit-level=low` | Passed; 0 vulnerabilities. |
| Diff validation | `git diff --check` | Passed. |
| Route smoke test | Local Wrangler plus `curl` | Passed: `/` 200, `/missions/the-heist` 200 with four evidence controls, `/mission.js` JavaScript, and unknown mission 404. |
| Publication scan | Added-file and added-line scans described below | Passed; no secret-shaped values, private absolute paths, transcript content, or `.ai/` files found. |

## Publication scan

- Scan the entire branch diff plus untracked change artifacts proposed for publication.
- Reject secret-shaped values, private absolute home paths, and private-key blocks.
- Confirm the proposed file list contains no `.ai/` path.
- Treat documented forbidden filenames such as `auth.json` and `history.jsonl` as safety contract names, not file content.

## Manual verification

| Check | Status | Evidence |
| --- | --- | --- |
| Keyboard navigation and copy controls | Passed | User confirmed Phase 2 manual testing. |
| Clipboard fallback | Passed | User confirmed selected-text fallback and visible feedback. |
| Ephemeral evidence state | Passed | User confirmed four-check unlock and refresh reset. |
| Desktop and mobile layout | Passed | User accepted the responsive workspace without a fake terminal. |
| Disposable Claude-style and Codex-style fixtures | Deferred | User explicitly deferred this check; run against fixtures, never real profiles. |
| Source fixture immutability | Deferred | User explicitly deferred the pre/post byte comparison. |
| Final publication diff | Deferred | User explicitly chose to proceed without final publication approval. |

Production URL checks remain omitted until a separate deployment approval is granted.
