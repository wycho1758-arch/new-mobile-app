# PR2 CI Contracts Build Before Tests Implementation Checkpoint

Date: 2026-06-11
Branch: `feat/mobile-app-template`
PR: https://github.com/Wondermove-Inc/new-mobile-app/pull/2

## Scope

Fix the second PR #2 remote Quality gate failure after `2b791c1`.

The first CI failure, duplicate pnpm pinning in `pnpm/action-setup@v4`, was
resolved enough for the new remote run to pass setup, install, and
`pnpm run test:runtime`. The remaining failure is in `pnpm turbo run lint test`
when clean CI runs `@template/api#test` before `@template/contracts` has built
its runtime `dist/index.js` export.

## Reviewer Precheck

`wm-implementation-reviewer` xhigh plan re-review:

- File: `.evidence/reviews/pr2-ci-contracts-build-before-tests-plan-xhigh-rereview-20260611.md`
- JSON: `.evidence/reviews/pr2-ci-contracts-build-before-tests-plan-xhigh-rereview-20260611.json`
- Verdict: `GO`
- Findings: 0

## RED Baseline

After adding `turbo.json` validation and the invalid fixture, but before fixing
`turbo.json`, the validator failed as expected:

```text
node scripts/validate-project-environment.mjs --self-test
exit 1
- valid-current.json: valid fixture failed:
  - turbo.json tasks.build.outputs must include dist/** for workspace package build artifacts
  - turbo.json tasks.test.dependsOn must include ^build so clean CI builds workspace package exports before tests

node scripts/validate-project-environment.mjs
exit 1
- turbo.json tasks.build.outputs must include dist/** for workspace package build artifacts
- turbo.json tasks.test.dependsOn must include ^build so clean CI builds workspace package exports before tests
```

## Implemented Changes

- Added `turbo.json` to `scripts/validate-project-environment.mjs` input.
- Added validator checks for:
  - `tasks.build.outputs` containing `dist/**`;
  - `tasks.test.dependsOn` containing `^build`.
- Added fixture:
  `evals/local-harness/project-environment/fixtures/invalid-turbo-test-missing-build-dependency.json`.
- Updated `turbo.json`:
  - `build.outputs: ["dist/**"]`;
  - `test.dependsOn: ["^build"]`.
- Updated `PROJECT_ENVIRONMENT.md` to document that tests build upstream
  package runtime exports first.

## Local Verification

After implementation:

```text
node scripts/validate-project-environment.mjs --self-test
exit 0
Validated project environment fixtures.

node scripts/validate-project-environment.mjs
exit 0
Validated project environment drift checks.

git diff --check
exit 0

pnpm run test:runtime
exit 0
Passed runtime validators and 44 hook fixture tests.

pnpm turbo run lint test
exit 0
@template/contracts:build ran before dependent package tests.
Tasks: 7 successful, 7 total.

pnpm run test:local-harness
exit 0
local harness all passed.
```

## Remote Status

Remote PR #2 Quality gate remains failed at run `27297908812` until this fix is
committed, pushed, and a new run is collected.

## Non-Claims

- This does not change app behavior, API schemas, customer configuration,
  secrets, live EAS, devices, mobile-mcp, branch protection, webhooks, or other
  external platform state.
- This does not prove native readiness.
