# PR2 CI pnpm Action Pin Fix Implementation Checkpoint

Date: 2026-06-11
Branch: `feat/mobile-app-template`
PR: https://github.com/Wondermove-Inc/new-mobile-app/pull/2

## Scope

Fix the draft PR quality-gate setup failure caused by duplicate pnpm version
sources:

- root `package.json`: `packageManager: pnpm@9.15.9`
- `.github/workflows/quality-gate.yml`: `pnpm/action-setup@v4` with
  `version: 9`

The fix is limited to repo CI/runtime SoT alignment. It does not change mobile
app behavior, customer app configuration, external platform settings, branch
protection, EAS, pods, secrets, or live Confluence state.

## Reviewer Precheck

`wm-implementation-reviewer` xhigh preimplementation re-review:

- File: `.evidence/reviews/pr2-ci-pnpm-action-pin-fix-preimplementation-xhigh-rereview-20260611.md`
- JSON: `.evidence/reviews/pr2-ci-pnpm-action-pin-fix-preimplementation-xhigh-rereview-20260611.json`
- Verdict: `GO`
- Findings: 0

## RED Baseline

Before removing the workflow `version` input, the new validator guard failed on
the current repo state as intended:

- `node scripts/validate-project-environment.mjs --self-test` failed because
  `valid-current.json` represented the still-invalid workflow state.
- `node scripts/validate-project-environment.mjs` failed with:
  `quality-gate.yml must not set pnpm/action-setup version when package.json packageManager pins pnpm`

## Implemented Changes

- Removed `with: { version: 9 }` from `.github/workflows/quality-gate.yml`.
- Added `qualityGateSetsPnpmActionVersion()` to
  `scripts/validate-project-environment.mjs`.
- Added validator error when `package.json` pins pnpm and the quality-gate
  workflow also sets a `pnpm/action-setup` version input.
- Added invalid fixture:
  `evals/local-harness/project-environment/fixtures/invalid-quality-gate-pnpm-action-version.json`.
- Documented the CI pnpm SoT rule in `PROJECT_ENVIRONMENT.md`.

## Local Verification

After the implementation:

- `node scripts/validate-project-environment.mjs --self-test` passed.
- `node scripts/validate-project-environment.mjs` passed.
- `pnpm run test:runtime` passed.
- `pnpm turbo run lint test` passed.
- `pnpm run test:local-harness` passed.
- `git diff --check` passed.

## Remote Status

Before this fix is pushed, PR #2 remote quality gate is still failed at
`pnpm/action-setup@v4` setup for run `27296989075`. A new remote result must be
collected after pushing the fix.

## Non-Claims

- This does not claim live EAS, native device, Maestro, mobile-mcp, pod rollout,
  branch protection, webhook, Secret/token, or external platform readiness.
- This does not make production submit automatic.
- This does not treat RN Web evidence as native evidence.
