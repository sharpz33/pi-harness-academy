# Polish localization plan

## Slice 1 — locale contract and public shell

- Add a typed `en | pl` locale contract and locale-aware URL helpers.
- Add `/pl`, `/pl/sign-in`, `/pl/missions/:slug`, `/pl/journey`, `/pl/device`, `/pl/journey/delete`, and `/pl/proof/:publicId` page routes.
- Keep APIs and mutation endpoints shared; preserve locale through explicit safe return paths.
- Add an EN/PL switcher and locale-correct `<html lang>`.

## Slice 2 — Polish curriculum copy

- Add Polish titles, acts, reveals, objectives, launch instructions, mission steps, evidence labels, details, and source labels for all twelve missions.
- Keep every prompt, command value, slug, evidence ID, and source URL unchanged.
- Render Polish navigation and section chrome around the unchanged English prompt with an explicit language note.

## Slice 3 — private and authentication flows

- Translate sign-in, request result, scanner-safe verification, device approval, Journey, deletion confirmation, completion proof, and not-found pages.
- Ensure login return paths and all private redirects remain under `/pl` when the flow starts there.
- Preserve no-store and no-referrer headers for prefixed private routes.

## Slice 4 — verification

- Add route tests for anonymous Polish access, equivalent language links, prompt identity, auth redirects, Journey ownership, and proof privacy.
- Run `npm run check`, dependency audit, secret scan, and `git diff --check`.
- Run CDP smoke across all twelve Polish missions at desktop and 390 px mobile widths.
- Review representative Polish pages before requesting merge and production deployment approval.
