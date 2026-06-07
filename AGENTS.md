# AGENTS.md

This repository is the mobile app template runtime for WonderMove mobile agents.

## Required Rules

- TDD required: write or update tests before implementation changes.
- No hardcoding customer app names, bundle IDs, API URLs, tokens, or credentials.
- No direct push to `main`; use a branch and PR.
- Do not modify `openclaw-cloud` from this repository.
- RN UI uses NativeWind + React Native primitives + semantic design tokens; web-only shadcn/ui is N/A for React Native screens (apply shadcn/ui only to optional web console).

## Codex Runtime Paths

- Native Codex CLI repo skills: `.agents/skills/<skill-name>/SKILL.md`
- Native Codex CLI custom agents: `.codex/agents/<agent-name>.toml`
- Native Codex CLI hooks: `.codex/hooks.json` and `.codex/hooks/`
- Runtime evals and evidence: `evals/{skills,agents,hooks}/`
- OpenClaw generated-agent package tests simulate install to `/workspace/skills/<skill-slug>/`; `.agents/skills` is not the pod install path.

## Repository Structure

Monorepo layout (top-level):

- `apps/mobile/` — Expo Router app (template core)
- `apps/api/` — optional Hono + Drizzle backend (include only when a new backend is required; see §15 01-8)
- `packages/contracts/` — shared zod schemas and TypeScript types (single SoT for all API contracts)
- `infra/clawpod/` — EAS Robot token k8s Secret and agent-runner Job examples
- `docs/` — SETUP.md, CREDENTIALS.md, design-references/ (awesome-design-md vendored)
- `.github/workflows/` — quality-gate.yml (PR gate: pnpm turbo run lint test)
- `.agents/`, `.codex/`, `evals/`, `scripts/` — existing codex runtime layer (preserved, do not modify)

## Build / Test / Lint Commands

```
# Install all workspace dependencies
pnpm install

# Run lint and test across all workspaces (apps/mobile, apps/api if present)
pnpm turbo run lint test

# Run codex runtime verification (validate / test:hooks / test:openclaw)
pnpm run test:runtime

# Start mobile dev server
pnpm --filter mobile start

# Run api tests only (when apps/api is present)
pnpm --filter @template/api test
```

## Conventions & PR Expectations

- `packages/contracts` is the single SoT for all API request/response types and shared domain schemas. Never declare ad-hoc duplicates in app or api code.
- Database columns use snake_case; TypeScript variables and API fields use camelCase. Convert at the boundary.
- Commit messages follow Conventional Commits (`feat:`, `fix:`, `test:`, `refactor:`, `docs:`, `chore:`).
- All changes go through a branch + PR. The quality-gate workflow must pass before merge.

## Constraints (do-not)

- Do not push directly to `main`.
- Do not hardcode customer app names, bundle IDs, API URLs, tokens, or credentials.
- Do not use shadcn/ui for React Native screens (NativeWind + RN primitives only; shadcn/ui applies only to optional `apps/console`).
- Do not modify `openclaw-cloud` from this repository.
- `apps/api` import direction: routes → services → db only. Reverse imports are forbidden.
- API request/response types must be defined exclusively in `packages/contracts`. Ad-hoc type declarations outside contracts are forbidden.
- Migrations must use non-interactive procedure only: `drizzle-kit generate` (schema diff, no DB connection needed) + programmatic `migrate()` (idempotent, history-table based). Interactive `migrate dev` or CLI-applied migrations are forbidden.

## Definition of Done / Verification

Before opening a PR, verify both:

1. Workspace lint and tests pass: `pnpm turbo run lint test`
2. Codex runtime artifacts are intact: `pnpm run test:runtime`

Both commands must exit 0.
