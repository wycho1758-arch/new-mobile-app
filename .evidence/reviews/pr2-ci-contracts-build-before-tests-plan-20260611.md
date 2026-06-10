# PR2 CI Contracts Build Before Tests Plan

Date: 2026-06-11
Branch: `feat/mobile-app-template`
PR: https://github.com/Wondermove-Inc/new-mobile-app/pull/2

## Observed Failure

After commit `2b791c1`, the PR #2 quality gate no longer fails in
`pnpm/action-setup@v4`. The new remote run proceeds through install and
`pnpm run test:runtime`, then fails in `pnpm turbo run lint test`.

Remote run:

- Run: `27297908812`
- Job: `80635487339`
- Failed step: `Run pnpm turbo run lint test`
- Failed task: `@template/api#test`
- Error: Vite/Vitest cannot resolve the `@template/contracts` package entry.

## Root Cause Hypothesis

`packages/contracts/package.json` intentionally exports runtime JavaScript from
`./dist/index.js`. Clean CI does not have ignored local build output under
`packages/contracts/dist`, but `turbo.json` currently defines only `lint` and
`test` tasks with no `test -> ^build` dependency. Local runs can pass when
ignored `dist` artifacts exist from an earlier build.

## SoT Inputs

- `AGENTS.md`: this repo is the WonderMove mobile agents mobile app template
  runtime; TDD and branch/PR quality gates are required.
- `PROJECT_ENVIRONMENT.md`: `pnpm turbo run lint test` is a required root gate,
  `packages/contracts` is the single API contract SoT, and API Docker builds
  must build contracts before API runtime use.
- `packages/contracts/package.json`: runtime export is `./dist/index.js`.
- `apps/api/package.json`: API tests depend on `@template/contracts`.
- `turbo.json`: current task graph lacks a build dependency before tests.

## Proposed Fix

Validator-first:

1. Extend `scripts/validate-project-environment.mjs` to read `turbo.json`.
2. Add a deterministic check that `turbo.json` declares:
   - a `build` task with `dist/**` output coverage;
   - `test.dependsOn` includes `^build`.
3. Add a failing fixture that removes the `test -> ^build` dependency.

Implementation:

4. Update `turbo.json` with:
   - `build.outputs: ["dist/**"]`
   - `test.dependsOn: ["^build"]`
5. Update `PROJECT_ENVIRONMENT.md` to document that workspace tests build
   dependency package artifacts first in clean CI.

## Verification

RED sequence before the `turbo.json` graph fix:

- First extend `scripts/validate-project-environment.mjs` and add the fixture,
  while leaving current `turbo.json` unchanged.
- Then `node scripts/validate-project-environment.mjs --self-test` should fail
  against current `turbo.json`.
- Then `node scripts/validate-project-environment.mjs` should fail against
  current `turbo.json`.

After implementation:

- `node scripts/validate-project-environment.mjs --self-test`
- `node scripts/validate-project-environment.mjs`
- `pnpm run test:runtime`
- `pnpm turbo run lint test`
- `pnpm run test:local-harness`
- `git diff --check`
- push and re-check PR #2 remote Quality gate.

## Non-Scope

- Do not change app behavior, API schemas, contracts source, customer config,
  secrets, live EAS, device/mobile-mcp, branch protection, or external platform
  state.
- Do not treat this as proof of native readiness.
