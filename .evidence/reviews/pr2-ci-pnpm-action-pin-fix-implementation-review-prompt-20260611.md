# PR2 CI pnpm Action Pin Fix Implementation Review Prompt

You are Reviewer(xhigh) for the WonderMove mobile app template runtime repo.
Review the current uncommitted implementation for PR #2 CI recovery.

## Required Output

Return the repository's JSON review envelope. Use supported finding owners only:
`Product/Planning`, `Design`, `Architect`, `Backend/API Integrator`,
`Mobile App Dev`, `QA/Release`, `Gatekeeper`, `DevOps`, or `Security`.

## Context

Repo purpose: mobile app template runtime for WonderMove mobile agents, not a
single customer app.

Observed remote failure:

- PR: https://github.com/Wondermove-Inc/new-mobile-app/pull/2
- Failed run: `27296989075`
- Failed step: `pnpm/action-setup@v4`
- Cause: workflow sets `with: { version: 9 }` while root `package.json` already
  pins `packageManager: pnpm@9.15.9`.

Preimplementation xhigh review:

- `.evidence/reviews/pr2-ci-pnpm-action-pin-fix-preimplementation-xhigh-rereview-20260611.md`
- verdict `GO`, findings 0.

Implementation checkpoint:

- `.evidence/reviews/pr2-ci-pnpm-action-pin-fix-implementation-checkpoint-20260611.md`

## Files To Review

- `.github/workflows/quality-gate.yml`
- `scripts/validate-project-environment.mjs`
- `evals/local-harness/project-environment/fixtures/invalid-quality-gate-pnpm-action-version.json`
- `PROJECT_ENVIRONMENT.md`
- `.evidence/reviews/pr2-ci-pnpm-action-pin-fix-implementation-checkpoint-20260611.md`

## Implemented Change Summary

- Removed explicit pnpm version input from `pnpm/action-setup@v4`.
- Added validator guard preventing duplicate pnpm version SoT when
  `package.json` has `packageManager: pnpm@...`.
- Added an invalid fixture that mutates `quality-gate.yml` to reintroduce the
  duplicate pnpm action version input.
- Documented the quality-gate pnpm SoT rule in `PROJECT_ENVIRONMENT.md`.

## Local Verification Already Run

- RED before workflow fix:
  - `node scripts/validate-project-environment.mjs --self-test` failed on the
    current invalid workflow.
  - `node scripts/validate-project-environment.mjs` failed with:
    `quality-gate.yml must not set pnpm/action-setup version when package.json packageManager pins pnpm`
- GREEN after workflow fix:
  - `node scripts/validate-project-environment.mjs --self-test` passed.
  - `node scripts/validate-project-environment.mjs` passed.
  - `pnpm run test:runtime` passed.
  - `pnpm turbo run lint test` passed.
  - `pnpm run test:local-harness` passed.
  - `git diff --check` passed.

## Review Questions

1. Is this implementation aligned with the repo SoT and current project
   direction: reusable mobile app template runtime, deterministic gates,
   durable evidence, and no external/live platform mutation?
2. Is the fix appropriately scoped to the actual PR #2 remote failure?
3. Does the validator/fixture prevent the same failure from regressing?
4. Is the change safe to commit and push to PR #2 as a CI recovery commit?
5. Are there any NO_GO findings that must be fixed before push?

Important: Do not claim remote CI is fixed yet. The new remote check has not
run until this commit is pushed.
