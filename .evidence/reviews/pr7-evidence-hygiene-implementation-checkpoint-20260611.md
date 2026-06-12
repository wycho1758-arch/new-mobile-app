# PR7 Evidence Hygiene And Preflight Hardening Implementation Checkpoint

Date: 2026-06-11
Baseline: `e609116 docs: record PR7 evidence hygiene plan review`
Scope: repo-internal/offline PR7 implementation only

## Implemented

- Added `scripts/lib/secret-patterns.mjs` and reused it from:
  - `scripts/validate-team-doc.mjs`
  - `scripts/validate-team-doc-archive.mjs`
  - `scripts/validate-evidence-hygiene.mjs`
- Added `scripts/validate-evidence-hygiene.mjs` with offline validation for:
  - forbidden durable evidence paths: `.evidence/local/`, `.evidence/tmp/`, `.evidence/**/*.log`, `.evidence/**/raw/`,
  - `.evidence/e2e-test/<YYYYMMDD-HHMMSS>-<slug>/` directory naming,
  - shared secret-pattern scanning with file and line reporting.
- Added evidence hygiene fixtures under `evals/local-harness/evidence-hygiene/fixtures/`.
- Added Design-role-only Stitch status checks to `scripts/codex-preflight.mjs --pod`.
  - Design role checks local ADC/project status only.
  - Non-Design roles skip Stitch checks.
  - Output records redacted status only and never prints credential paths, project IDs, tokens, or config values.
- Added preflight fixtures for:
  - Design missing Stitch prerequisites,
  - Design configured Stitch prerequisites with redacted output,
  - Non-Design Stitch skip.
- Wired `validate:evidence-hygiene` into `package.json`, `pnpm run test:runtime`, `.github/workflows/quality-gate.yml`, `PROJECT_ENVIRONMENT.md`, `REPO_OPERATIONS.md`, `scripts/validate-repo-operations.mjs`, and `scripts/validate-project-environment.mjs`.
- Redacted a pre-existing secret-like `API_BEARER_TOKEN` command value in `.evidence/api-app-run-check/api.md`; no token value is recorded in this checkpoint.
- First final xhigh review returned `GO` with one Low fixture-coverage finding. Follow-up implementation tightened `scripts/codex-preflight.mjs --self-test` to support multiple forbidden output assertions and added an ADC credential-path redaction assertion to the Design Stitch fixture.

## TDD Evidence

RED check before implementation:

```text
node scripts/validate-evidence-hygiene.mjs --self-test
```

Exited 1 as expected because `scripts/validate-evidence-hygiene.mjs` did not exist yet.

The first current-tree hygiene run after adding the validator caught a real existing evidence hygiene issue:

```text
node scripts/validate-evidence-hygiene.mjs
```

Exited 1 and reported `.evidence/api-app-run-check/api.md:23` as a probable `api-bearer-token` finding. The value was redacted without printing it.

## Verification

All commands below exited 0 after implementation:

```text
node scripts/validate-evidence-hygiene.mjs --self-test
node scripts/validate-evidence-hygiene.mjs
node scripts/codex-preflight.mjs --self-test
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

Follow-up verification after closing the xhigh Low finding also exited 0:

```text
node scripts/codex-preflight.mjs --self-test
node scripts/validate-evidence-hygiene.mjs
node scripts/validate-evidence-hygiene.mjs --self-test
pnpm run test:runtime
node scripts/validate-project-environment.mjs
node scripts/validate-repo-operations.mjs
node scripts/validate-team-doc.mjs
git diff --check
pnpm turbo run lint test
pnpm run test:local-harness
```

## Boundaries Preserved

Not run:

- live Stitch MCP invocation,
- Google Cloud API call, `gcloud auth` mutation, ADC login, project creation, or service enablement,
- mobile-mcp, simulator, emulator, or device operations,
- live Confluence/Atlassian fetch, publish, update, page mutation, or page version probing,
- Railway health checks,
- EAS commands or `EXPO_TOKEN` use/probing,
- pod rollout,
- webhook or branch-protection changes,
- Secret/token provisioning,
- GitHub issue creation or scheduled workflow with issue-writing side effects,
- external platform/runtime repository mutation,
- release readiness or store-submit automation.

This checkpoint proves repo-local offline evidence hygiene and local preflight status validation only. It does not prove live Stitch service enablement, Google Cloud state, mobile-mcp/device behavior, live Confluence state, Railway health, EAS state, OrbStack/OpenClaw pod execution, webhook routing, branch protection, or release approval.
