# PR6 SoT Drift Detection Implementation Checkpoint

Date: 2026-06-11  
Baseline: `eae0382 docs: record PR6 drift detection plan review`  
Scope: repo-internal/offline PR6 implementation only

## Implemented

- Added `scripts/validate-project-environment.mjs` with offline drift validation.
- Added `validate:project-environment` and composed it into `pnpm run test:runtime`.
- Added RED/green fixtures under `evals/local-harness/project-environment/fixtures/` for:
  - package manager drift,
  - mobile dependency drift across the named plan cases: `expo`, `react-native`, `nativewind`, `tailwindcss`, `@playwright/test`, and `lightningcss`,
  - MCP `@latest` for `mobile-mcp` and `stitch-mcp`,
  - MCP pin drift,
  - quality-gate script detection drift,
  - local snapshot metadata drift,
  - valid current repo facts.
- Updated `.github/workflows/quality-gate.yml` runtime-change detection for `scripts/validate-project-environment.mjs`.
- Strengthened `scripts/validate-project-environment.mjs` so CI runtime-change detection must include `validate-project-environment` inside the workflow `grep -Eq` pattern, not merely somewhere in the workflow file.
- Updated `PROJECT_ENVIRONMENT.md`, `REPO_OPERATIONS.md`, and `scripts/validate-repo-operations.mjs` for the new gate composition and validator responsibility.

## TDD Evidence

RED check before implementation:

```text
node scripts/validate-project-environment.mjs --self-test
```

Exited 1 as expected because `scripts/validate-project-environment.mjs` did not exist yet.

First GREEN run exposed a parser bug rather than a fixture failure:

```text
node scripts/validate-project-environment.mjs --self-test
```

Exited 1:

```text
- valid-current.json: valid fixture failed:
  - package.json packageManager mismatch: expected .
- Workspace packages: , got pnpm@9.15.9
```

The parser was corrected to capture the first backtick value on the `Package manager:` line.

Reviewer(xhigh) first final pass returned `GO` with Low findings only:

- fixture coverage was thinner than the approved TDD matrix,
- CI runtime-change detection validation used a broad substring check.

Both Low findings were resolved before commit by adding the named mobile dependency and `stitch-mcp@latest` fixtures, and by checking the workflow runtime-change `grep -Eq` pattern directly.

## Verification

All commands below exited 0 after implementation:

```text
node scripts/validate-project-environment.mjs --self-test
node scripts/validate-project-environment.mjs
node scripts/validate-repo-operations.mjs
node scripts/validate-team-doc.mjs
pnpm run test:runtime
pnpm run test:local-harness
pnpm turbo run lint test
git diff --check
find . -maxdepth 1 \( -name CLAUDE.md -o -name .claude -o -name .claude-state \) -print
```

## Boundaries Preserved

Not run:

- live Confluence/Atlassian fetch, publish, update, page mutation, or page version probing,
- Railway health checks,
- EAS commands or `EXPO_TOKEN` use/probing,
- mobile-mcp, simulator, emulator, or device operations,
- pod rollout,
- webhook or branch-protection changes,
- Secret/token provisioning,
- GitHub issue creation or scheduled workflow with issue-writing side effects,
- external platform/runtime repository mutation,
- Confluence live publish,
- release readiness or store-submit automation.

This checkpoint proves repo-local offline drift validation only. It does not prove live SoT freshness, live Confluence state, Railway health, EAS state, native behavior, OrbStack/OpenClaw pod execution, webhook routing, branch protection, or release approval.
