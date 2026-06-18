# AGENTS.md

## OpenClaw And Codex Skill Routing

- Pod-native OpenClaw skill-only requests use `/workspace/skills/<slug>/SKILL.md` as the runtime shape and are authored under `mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/<slug>/` using skill-creator structure.
- After `git clone` or `git pull` for WonderMove new-mobile-app, use `openclaw-pod-skills-sync` to copy-sync `mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills` into `/workspace/skills`, then run `project-bootstrap`.
- Codex skill or agent requests use `.agents/skills/<skill-name>/SKILL.md` and `.codex/agents/<agent-name>.toml` for primary artifacts; required validators, evals, scripts, and evidence may still be added when the change needs them.
- WonderMove new-mobile-app project requirements, project specifications, PRDs, work requests, planning artifacts, handoffs, or role workflow requests must first resolve the current role, entry case, allowed repo-local Codex skills, required reviewers, and durable artifact stage through `codex-role-workflow`.
- Codex is the default repo-local role-workflow substrate for planning, routing, review, handoff, evidence, hooks, MCP, validators, and implementation when implementation is actually authorized; it is not only a coding tool.
- Do not bypass `human-gate/v1`, evidence requirements, hook-based policy/evidence expectations, or external proof boundaries when routing through `codex-role-workflow`.

This repository is the mobile app template runtime for WonderMove mobile agents.
Repo-wide operating policy ownership is defined in `REPO_OPERATIONS.md`.

For the canonical `skill` / `agent` / `AGENTS.md` term definitions and the
`.agents/` vs `.codex/agents/` directory trap, see `REPO_OPERATIONS.md` →
"Skill, Agent, And AGENTS.md Terminology" rather than relying on the path lists
repeated in this file.

## Project Workspace Defaults

Source text for the OpenClaw runtime root file `/workspace/AGENTS.md`:

Primary project repository:
- Repository: https://github.com/Wondermove-Inc/new-mobile-app.git
- Local path: /workspace/projects/Wondermove-Inc/new-mobile-app

Default behavior:
- For new-mobile-app repository work, use `/workspace/projects/Wondermove-Inc/new-mobile-app` as the working directory.
- After git clone or git pull, run `openclaw-pod-skills-sync`, then run `project-bootstrap`.
- Do not use `/workspace` root as the project repo directory. The root contains agent operating files such as AGENTS.md, SOUL.md, WORKFLOW.md, and TOOLS.md.
- Do not confuse this file with the project-local `/workspace/projects/Wondermove-Inc/new-mobile-app/AGENTS.md`.
- Before installing dependencies or system packages, report what will be installed and wait for explicit approval unless the user already approved that installation.
- After any computer/package installation, report exactly what was installed.

## Required Rules

- TDD required: write or update tests before implementation changes.
- No hardcoding customer app names, bundle IDs, API URLs, tokens, or credentials.
- No direct push to `main`; use a branch and PR.
- Do not modify external platform/runtime repositories from this repository.
- RN UI uses NativeWind + React Native primitives + semantic design tokens; web-only shadcn/ui is N/A for React Native screens (apply shadcn/ui only to optional web console).

## Codex Runtime Paths

- Native Codex CLI repo skills: `.agents/skills/<skill-name>/SKILL.md`
- Native Codex CLI custom agents: `.codex/agents/<agent-name>.toml`
- Native Codex CLI hooks: `.codex/hooks.json` and `.codex/hooks/`
- Native Codex CLI MCP config: `.codex/config.toml`
- Runtime evals and evidence: `evals/{skills,agents,hooks,local-harness}/`
- Runtime stability evidence: `.evidence/`

## Repository Structure

Monorepo layout (top-level):

- `apps/mobile/` — Expo Router app (template core)
- `apps/api/` — optional Hono + Drizzle backend (include only when a new backend is required; see §15 01-8)
- `packages/contracts/` — shared zod schemas and TypeScript types (single SoT for all API contracts)
- `infra/clawpod/` — EAS Robot token k8s Secret and agent-runner Job examples
- `docs/` — SETUP.md, CREDENTIALS.md, design-references/ (awesome-design-md vendored)
- `.github/workflows/` — quality-gate.yml (PR gate: `pnpm run test:runtime`, `pnpm turbo run lint test`, and conditional `pnpm run test:local-harness` for Codex runtime changes)
- `.agents/`, `.codex/`, `evals/`, `scripts/` — Codex runtime layer, maintained through the runtime gates below

## Expo / React Native Runtime Policy

- Current mobile baseline is Expo SDK 56 (`expo ~56.0.9`) with React Native 0.85, NativeWind v5 preview, Tailwind CSS v4, and `expo-dev-client`.
- Environment/runtime changes must keep `PROJECT_ENVIRONMENT.md` and any required local publication/evidence mirror in sync with actual repo settings. Live Confluence publication is a human-gated external update, not a local validation gate.
- Before a mobile environment change is considered done, verify mobile lint/test, `expo install --check`, native run smoke on iOS/Android when available, and Maestro smoke where available.
- Official Expo skills may be introduced in a separate verified step with `npx skills add expo/skills`. Official Expo skills should cover generic Expo/RN workflows; repo skills remain responsible for this project's contracts, role boundaries, evidence, and QA gates.
- `mobile-mcp` is the required local visual QA/device automation MCP. Pin its version in `.codex/config.toml`, do not use `@latest`, do not add it to required CI gates, and do not parallelize simulator/device operations.

## Mobile QA Selectors

- Mobile screens should expose stable kebab-case `testID` values for long-lived automated checks.
- Prefer Maestro `id` selectors over visible-text selectors.
- Update app code, Jest tests, and Maestro flows together when changing a selector.
- Current baseline examples: `home-title`, `counter-value`, `counter-increment-button`.

## Local Harness Scope

- `pnpm run test:local-harness` validates Codex CLI runtime structure, role boundaries, skill/agent/hook configuration, gatekeeper/evidence fixtures, and best-effort headless Codex smoke.
- It is not an app feature test suite and does not prove Jira, Confluence, GitHub branch protection, EAS build/submit, production submit, or external platform/runtime behavior.
- OpenClaw packaging paths such as `/workspace/skills`, `OPENCLAW_ROOT`, generated agent packages, and OpenClaw package result files are outside the active local harness scope.
- Dirty worktree state is not a local harness failure condition; runtime edits must remain locally verifiable while in progress.

## Build / Test / Lint Commands

```
# Install all workspace dependencies
pnpm install

# Run lint and test across all workspaces (apps/mobile, apps/api if present)
pnpm turbo run lint test

# Run codex runtime verification (validate / test:hooks)
pnpm run test:runtime

# Run full Codex local harness for runtime-related PRs
pnpm run test:local-harness

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
- Codex runtime changes under `.agents/`, `.codex/`, `evals/{skills,agents,hooks,local-harness}/`, or runtime scripts must pass the conditional local harness gate.

## Constraints (do-not)

- Do not push directly to `main`.
- Do not hardcode customer app names, bundle IDs, API URLs, tokens, or credentials.
- Do not use shadcn/ui for React Native screens (NativeWind + RN primitives only; shadcn/ui applies only to optional `apps/console`).
- Do not modify external platform/runtime repositories from this repository.
- `apps/api` import direction: routes → services → db only. Reverse imports are forbidden.
- API request/response types must be defined exclusively in `packages/contracts`. Ad-hoc type declarations outside contracts are forbidden.
- Migrations must use non-interactive procedure only: `drizzle-kit generate` (schema diff, no DB connection needed) + programmatic `migrate()` (idempotent, history-table based). Interactive `migrate dev` or CLI-applied migrations are forbidden.

## Definition of Done / Verification

Before opening a PR, verify:

1. Workspace lint and tests pass: `pnpm turbo run lint test`
2. Codex runtime artifacts are intact: `pnpm run test:runtime`
3. For Codex runtime changes, local harness passes: `pnpm run test:local-harness`
4. For mobile environment/runtime changes, verify `pnpm --filter mobile exec expo install --check`, `pnpm --filter mobile lint`, `pnpm --filter mobile test`, `pnpm --filter mobile run doctor`, and `codex mcp list`
5. For mobile UI/runtime changes with an available simulator or device, run local `mobile-mcp` visual QA/device automation serially and record the result in PR evidence

Applicable commands must exit 0.
