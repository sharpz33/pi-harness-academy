# Repository Guidelines

Pi Harness Academy is a TypeScript application built with Hono for Cloudflare Workers. It serves public lessons and verifies progress from an isolated Academy profile.

## Critical product and safety rules

- Keep every lesson and mission instruction publicly readable. Authentication may gate verified checkpoints, private progress, readiness, synchronization, and completion proof, but never the knowledge itself.
- Require both an authenticated learner and an authorized Academy Pi profile for verified checkpoints. Fail closed when identity, authorization, evidence, or a required check is missing.
- Keep the 12-step curriculum capability-first and cumulative. Represent steps as data rendered by one shared lesson engine; badge images remain optional until all must-have flows pass.
- Preserve the isolated Academy profile. Never modify a learner's normal Pi profile or source Claude Code, Codex, or Pi configuration.
- Checkpoint reports may contain only allowlisted results. Never collect file contents, prompts, paths, environment values, secrets, private transcripts, or unrelated machine data.
- Never commit credentials, tokens, `.env` files, licensed course materials, or private customer data. Keep `.ai/` untracked.
- Review and pin every third-party Pi package before recommending or executing it.
- Do not create Cloudflare resources or run a production deployment without explicit approval.

## Commands and quality loop

- `npm install` — install project dependencies.
- `npm run dev` — run the Worker locally with Wrangler.
- `npm run cf-typegen` — regenerate `CloudflareBindings` after changing Worker bindings.
- `npm run deploy -- --dry-run` — validate the deployment bundle without publishing.
- `npm run check` — run typechecking, tests, and the deployment dry-run.
- `npm audit` — check the dependency graph for known vulnerabilities.

The same quality gate runs in `@.github/workflows/ci.yml`. Do not report it as passing unless every command completes successfully.

## Structure and sources of truth

- `@src/index.ts` is the current Worker entry point; `@wrangler.jsonc` owns Worker configuration.
- Read `@context/foundation/shape-notes.md`, `@context/foundation/prd.md`, `@context/foundation/curriculum.md`, and `@context/foundation/tech-stack.md` before changing product behavior.
- Use `@context/foundation/experience-design-research.md` for UX direction and research files for supporting evidence rather than copying them here.
- D1 and Email Sending are unconfigured. Repository, CI, and Worker exist; deployment remains manual until GitHub has a dedicated Cloudflare token.

## Working conventions

Write code, identifiers, code comments, and commits in English. Use imperative commit subjects without `Co-Authored-By` trailers. Do not modify unrelated worktree changes or use destructive Git operations without explicit approval. Record unresolved product decisions instead of inventing facts.
