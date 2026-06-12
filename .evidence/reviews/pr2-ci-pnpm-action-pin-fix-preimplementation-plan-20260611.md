# PR2 CI pnpm Action Pin Fix Preimplementation Plan

## Scope

Fix the remote GitHub Actions failure on draft PR #2:

- PR: https://github.com/Wondermove-Inc/new-mobile-app/pull/2
- Failing workflow: `Quality gate / check`
- Failing step: `pnpm/action-setup@v4`
- Failing run: https://github.com/Wondermove-Inc/new-mobile-app/actions/runs/27296989075
- Current branch head before fix: `cea2f38 docs: record draft pr open checkpoint`

This is a repo-scoped CI bootstrap fix. It does not change app features, runtime
behavior, live platform configuration, branch protection, GitHub settings,
secrets, EAS, devices, pods, Confluence, Railway, Stitch/GCloud, release, or
store submission.

## Observed Failure

GitHub Actions stops before install/tests:

```text
Error: Multiple versions of pnpm specified:
  - version 9 in the GitHub Action config with the key "version"
  - version pnpm@9.15.9 in the package.json with the key "packageManager"
Remove one of these versions to avoid version mismatch errors like ERR_PNPM_BAD_PM_VERSION
```

Current conflicting sources:

- `package.json` declares `packageManager: pnpm@9.15.9`.
- `.github/workflows/quality-gate.yml` uses `pnpm/action-setup@v4` with
  `with: { version: 9 }`.

## SoT Basis

- `AGENTS.md` defines `.github/workflows/quality-gate.yml` as the PR gate and
  says the quality-gate workflow must pass before merge.
- `PROJECT_ENVIRONMENT.md` defines the package manager as `pnpm@9.15.9` from
  root `package.json`.
- `PROJECT_ENVIRONMENT.md` defines the GitHub quality gate commands:
  `pnpm run test:runtime`, `pnpm turbo run lint test`, and conditional
  `pnpm run test:local-harness`.
- `REPO_OPERATIONS.md` assigns offline project/runtime drift checks to
  `scripts/validate-project-environment.mjs`, including package manager pin and
  quality-gate runtime path detection.
- `REPO_OPERATIONS.md` says local validation does not prove GitHub branch
  protection or external platform state.

Sidecar sub-agent conclusion:

- Root cause is the duplicate pnpm version source.
- Safest repo-scoped fix is to remove the `version: 9` input from
  `pnpm/action-setup@v4`.
- Add a `validate-project-environment` fixture/check first so this does not
  regress.
- Confluence update is not required for this repo-scoped CI bootstrap fix; live
  Confluence publication remains human-gated external work.

## Planned Changes

TDD / validator-first order:

1. Add fixture
   `evals/local-harness/project-environment/fixtures/invalid-quality-gate-pnpm-action-version.json`
   that mutates the quality gate to include a `pnpm/action-setup@v4` `version`
   input and expects a deterministic failure.
2. Update `scripts/validate-project-environment.mjs` so it fails when:
   - root `package.json.packageManager` pins `pnpm@...`; and
   - `.github/workflows/quality-gate.yml` configures `pnpm/action-setup@v4` with
     a `version` input.
3. Run the validator before fixing the workflow and record the expected RED
   failure on the current workflow.
4. Remove the duplicate `with: { version: 9 }` from
   `.github/workflows/quality-gate.yml`, leaving `packageManager` as the single
   pnpm version SoT.
5. Update `PROJECT_ENVIRONMENT.md` CI notes to document that the quality gate
   must use the root `packageManager` pin and must not set a duplicate
   `pnpm/action-setup` version.

## Expected Verification

Local:

- `node scripts/validate-project-environment.mjs --self-test`
- `node scripts/validate-project-environment.mjs`
- `pnpm run test:runtime`
- `pnpm turbo run lint test`
- `pnpm run test:local-harness`
- `git diff --check`

Remote after commit/push:

- `gh pr checks 2 --watch=false`
- If checks are pending, poll until complete or report pending without claiming
  pass.

## Non-Claims

This fix only addresses the observed CI bootstrap conflict. It does not prove:

- later install/test steps will pass until remote CI runs them;
- branch protection or required-check enforcement;
- deployed backend API reachability;
- native/device/EAS/mobile-mcp proof;
- pod execution, webhook routing, Secret/token setup, release readiness, or store
  submission.

## Reviewer Request

Reviewer should decide whether this plan may proceed and whether the proposed
validator-first fix is the correct smallest repo-scoped action.
