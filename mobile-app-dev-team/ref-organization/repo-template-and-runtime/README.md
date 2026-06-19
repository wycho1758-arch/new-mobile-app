# Repo Template And Runtime

Status: current-project example
Source class: index
Upstream SoT:

- `AGENTS.md`
- `PROJECT_ENVIRONMENT.md`

Downstream consumers:

- Future repo template and runtime pages.
- New organization template pages.

Last reviewed date: 2026-06-10
Reviewer evidence: .evidence/reviews/ref-organization-checkpoint-2-xhigh-20260610.md

## Purpose


## Consolidated Former Files

- `ci-eas-railway.md` -> consolidated below
- `mobile-runtime.md` -> consolidated below
- `optional-api.md` -> consolidated below
- `repo-target-tree.md` -> consolidated below

## CI EAS Railway

Former file: `ci-eas-railway.md`

### Quality Gate

The current GitHub quality gate includes:

- `pnpm run test:runtime`
- `pnpm turbo run lint test`
- conditional `pnpm run test:local-harness`

### EAS

EAS workflows are current-project release surfaces. Store-facing release actions still need recorded human approval.

### Railway

Railway can provide API deploy, health, domain, logs, and RN Web API URL evidence. Railway evidence does not prove full mobile release readiness.

### Reuse Rule

Future organizations must verify their own CI, EAS, Railway, store, or deployment provider paths before copying this example.

## Mobile Runtime

Former file: `mobile-runtime.md`

### Current Project Example

The current mobile baseline uses Expo SDK 56, React Native, NativeWind, Expo Router, stable `testID` selectors, and mobile-mcp for local visual QA/device automation when a simulator or device is available.

This is a current-project example, not a universal runtime mandate for every future organization.

### Reuse Rule

When creating another mobile organization, verify its runtime versions, styling system, selectors, and device automation from that repo's SoT before copying any command or gate.

## Optional API

Former file: `optional-api.md`

### Current Project Example

`apps/api` is optional and used only when a new backend is required.

`packages/contracts` is the single source of truth for mobile-facing API request/response schemas and shared domain types.

The current API layering direction is:

```text
routes -> services -> db
```

Reverse imports are forbidden.

### Reuse Rule

Future organizations may omit `apps/api` when integrating with an existing backend, but they still need a contract owner and evidence for mock-vs-real drift.

## Repo Target Tree

Former file: `repo-target-tree.md`

### Current Project Example

Current repo paths include:

- `apps/mobile`
- `apps/api`
- `packages/contracts`
- `.agents/skills`
- `.codex/agents`
- `.codex/hooks.json`
- `.codex/config.toml`
- `evals/`
- `.evidence/`
- `mobile-app-dev-team/`

This is a current-project example. future organizations may have different repo layouts.

### Reuse Rule

Keep the ownership concepts, not necessarily the exact paths. If the repo layout changes, update SoT, validators, evidence paths, and handoff docs together.
