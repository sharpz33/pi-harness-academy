# Polish localization verification

## Automated

- `npm run check`: passed with 62 tests.
- `npm audit --audit-level=low`: zero vulnerabilities.
- `git diff --check`: passed.
- Twelve English routes remain HTTP 200 and keep English document language.
- Twelve Polish mission routes return HTTP 200 with `lang="pl"`.
- Polish and English catalogs retain identical slugs, prompts, command values, evidence IDs, and source URLs.
- Anonymous Polish Journey redirects to locale-matched sign-in.
- Authenticated Polish Journey renders the same learner-owned progress and no-store policy.
- Polish passwordless requests preserve `/pl` return paths and add locale to the scanner-safe verification link.

## Browser smoke

- All twelve Polish mission pages fit a 390 px viewport without horizontal overflow.
- Representative desktop screenshots reviewed locally: homepage, The Heist, and sign-in.
- EN/PL switcher preserves homepage and mission equivalents.

## Production

Not deployed. Production deployment requires explicit approval after pull-request review and green `main` CI.
