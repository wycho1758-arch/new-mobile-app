# PR2 CI Contracts Build Before Tests Implementation Review Prompt

You are Reviewer(xhigh) for the WonderMove mobile app template runtime repo.
Review the current uncommitted implementation for PR #2 CI recovery.

## Required Output

Return the repository's JSON review envelope. Use supported finding owners only:
`Product/Planning`, `Design`, `Architect`, `Backend/API Integrator`,
`Mobile App Dev`, `QA/Release`, `Gatekeeper`, `DevOps`, or `Security`.

## Context

Repo purpose: reusable mobile app template runtime for WonderMove mobile agents,
not a single customer app.

Remote run `27297908812` now passes setup/install/`test:runtime` and fails in
`pnpm turbo run lint test` because `@template/api#test` cannot resolve
`@template/contracts` from a clean checkout.

Root cause under review:

- `packages/contracts/package.json` exports runtime JS from `./dist/index.js`.
- `apps/api` imports `@template/contracts`.
- clean CI lacks ignored local `packages/contracts/dist` output.
- old `turbo.json` did not build upstream packages before tests.

Plan evidence:

- `.evidence/reviews/pr2-ci-contracts-build-before-tests-plan-20260611.md`
- `.evidence/reviews/pr2-ci-contracts-build-before-tests-plan-xhigh-rereview-20260611.md`

Implementation checkpoint:

- `.evidence/reviews/pr2-ci-contracts-build-before-tests-implementation-checkpoint-20260611.md`

## Files To Review

- `turbo.json`
- `scripts/validate-project-environment.mjs`
- `evals/local-harness/project-environment/fixtures/invalid-turbo-test-missing-build-dependency.json`
- `PROJECT_ENVIRONMENT.md`
- `.evidence/reviews/pr2-ci-contracts-build-before-tests-implementation-checkpoint-20260611.md`

## Review Questions

1. Is the change aligned with the repo SoT and current project direction:
   reusable template runtime, deterministic gates, durable evidence, and no
   external/live mutation?
2. Is the fix scoped to the observed PR #2 remote failure?
3. Does the validator/fixture prevent regression of the clean-CI build graph
   failure?
4. Are the recorded RED/GREEN checks sufficient for commit and push?
5. Are there any NO_GO findings that must be fixed before push?

Important: do not claim the remote PR Quality gate is fixed yet; this commit
has not been pushed.
