# PR1 Work-Unit Status Machine Implementation Checkpoint - 2026-06-10

## Scope

Baseline HEAD: `85984dd41c776ddbed3b4784ba9b921ba60a93fb`

Approved preimplementation plan:

- `docs/plans/active/20260610-pr1-work-unit-status-machine-preimplementation-plan.md`

xhigh preimplementation review:

- `.evidence/reviews/pr1-work-unit-status-machine-preimplementation-xhigh-rereview-20260610.md`
- verdict: `GO`
- exact next action: add RED fixtures/tests first, then implement the passive `wu-status/v1` validator/status machine.

## Implemented

- Added passive work-unit status validator:
  - `scripts/lib/work-unit-machine.mjs`
  - `scripts/validate-work-units.mjs`
- Added RED/GREEN self-test fixtures:
  - `evals/work-units/fixtures/valid/minimal-status/status.json`
  - `evals/work-units/fixtures/invalid/unknown-schema/status.json`
  - `evals/work-units/fixtures/invalid/work-unit-id-mismatch/status.json`
  - `evals/work-units/fixtures/invalid/illegal-stage-owner/status.json`
  - `evals/work-units/fixtures/invalid/missing-reviewer-envelope/status.json`
  - `evals/work-units/fixtures/invalid/owner-reviewer-self-approval/status.json`
  - `evals/work-units/fixtures/invalid/gatekeeper-misuse/status.json`
  - `evals/work-units/fixtures/invalid/non-append-only-events/status.json`
  - `evals/work-units/fixtures/invalid/ignored-evidence-path/status.json`
- Added sample durable status artifact:
  - `docs/plans/work-units/sample-role-handoff/status.json`
- Wired the validator into runtime gates:
  - `package.json`: `validate:work-units`; `test:runtime` now includes it.
  - `scripts/validate-repo-operations.mjs`: active runtime composition updated.
  - `.github/workflows/quality-gate.yml`: runtime-change detection now includes `evals/work-units/**`, `scripts/lib/**`, and `scripts/validate-work-units.mjs`.
- Updated operating docs:
  - `PROJECT_ENVIRONMENT.md`: runtime script and CI trigger facts.
  - `REPO_OPERATIONS.md`: active runtime composition and validator responsibility.
  - `docs/plans/work-units/README.md`: `status.json` added to work-unit schema and described as passive, non-orchestrating state.

## TDD Evidence

RED check before implementation:

```text
$ node scripts/validate-work-units.mjs --self-test
Error: Cannot find module '/Users/tw.kim/Documents/AGA/test/new-mobile-app/scripts/validate-work-units.mjs'
exit 1
```

GREEN narrow checks after implementation:

```text
$ node scripts/validate-work-units.mjs --self-test
Validated work-unit status fixtures.
exit 0

$ node scripts/validate-work-units.mjs
Validated work-unit status artifacts.
exit 0

$ node scripts/validate-repo-operations.mjs
Validated repo operations policy ownership.
exit 0
```

Runtime gate:

```text
$ pnpm run test:runtime
Validated 11 skills, 13 agents, and 4 hook events.
Codex headless review helper self-test passed.
Validated repo operations policy ownership.
Validated current team-doc managed docs.
Validated work-unit status fixtures.
Validated work-unit status artifacts.
Passed 44 hook fixture tests.
exit 0
```

Local harness:

```text
$ pnpm run test:local-harness
clean-tree-guard self-test passed
codex-preflight self-test passed
codex-preflight accepted /opt/homebrew/bin/codex (codex-cli 0.137.0)
Validated 11 skills, 13 agents, and 4 hook events.
Codex headless review helper self-test passed.
Validated repo operations policy ownership.
Validated current team-doc managed docs.
Validated work-unit status fixtures.
Validated work-unit status artifacts.
Passed 44 hook fixture tests.
Tasks: 6 successful, 6 total
self-test all passed
local harness all passed
exit 0
```

Workspace lint/test:

```text
$ pnpm turbo run lint test
Packages in scope: @template/api, @template/contracts, mobile
Tasks: 6 successful, 6 total
exit 0
```

## Scope Boundaries

Included:

- Passive repo artifact validation for `docs/plans/work-units/*/status.json`.
- Fixture-backed validation for schema, folder id matching, stage/owner/state boundaries, read-only reviewer envelope, owner/reviewer self-approval rejection, Gatekeeper LLM/custom-agent misuse rejection, ignored evidence path rejection, and append-only event sequence checks.
- Runtime and CI path-detection wiring so PR1 validator changes are exercised by repo-local gates.

Not included:

- PR2 human-gate envelope implementation.
- PR3 next-action resolver or orchestration.
- PR5 evidence ladder ingestion.
- Live EAS, Maestro, mobile-mcp, pod rollout, webhook, Secret/token, branch protection, bot account, or external platform changes.
- Customer-specific app name, bundle id, API URL, token, or credential.

## Current Workspace Notes

Targeted PR1 files are modified/untracked as expected:

```text
 M .github/workflows/quality-gate.yml
 M PROJECT_ENVIRONMENT.md
 M REPO_OPERATIONS.md
 M docs/plans/work-units/README.md
 M package.json
 M scripts/validate-repo-operations.mjs
?? docs/plans/work-units/sample-role-handoff/status.json
?? evals/work-units/
?? scripts/lib/
?? scripts/validate-work-units.mjs
```

Root Claude artifacts are absent:

```text
$ find . -maxdepth 2 \( -name 'CLAUDE.md' -o -name '.claude' -o -name '.claude-state' \) -print
<no output>
```

There are other planning/evidence files in the dirty worktree from this goal and concurrent sessions. They are not PR1 validator implementation proof and must be intentionally included or separated before PR packaging.

## xhigh NO_GO Remediation

First implementation review output:

- `.evidence/reviews/pr1-work-unit-status-machine-implementation-xhigh-20260610.md`
- content verdict: `NO_GO`
- helper exit: non-zero because the JSON envelope used unsupported finding owner `Runtime/PR packaging owner`
- blocker found: root `.claude-state/` existed during the review session.

Action taken:

- Removed `.claude-state/file_stats.json`.
- Removed `.claude-state/recent_changes.json`.
- Removed the empty `.claude-state/` directory.

Root artifact absence after cleanup:

```text
$ find . -maxdepth 2 \( -name 'CLAUDE.md' -o -name '.claude' -o -name '.claude-state' \) -print
<no output>
exit 0
```

Post-remediation runtime gate:

```text
$ pnpm run test:runtime
Validated 11 skills, 13 agents, and 4 hook events.
Codex headless review helper self-test passed.
Validated repo operations policy ownership.
Validated current team-doc managed docs.
Validated work-unit status fixtures.
Validated work-unit status artifacts.
Passed 44 hook fixture tests.
exit 0
```

Post-remediation local harness:

```text
$ pnpm run test:local-harness
clean-tree-guard self-test passed
codex-preflight self-test passed
codex-preflight accepted /opt/homebrew/bin/codex (codex-cli 0.137.0)
Validated 11 skills, 13 agents, and 4 hook events.
Codex headless review helper self-test passed.
Validated repo operations policy ownership.
Validated current team-doc managed docs.
Validated work-unit status fixtures.
Validated work-unit status artifacts.
Passed 44 hook fixture tests.
Tasks: 6 successful, 6 total
self-test all passed
local harness all passed
exit 0
```

Post-remediation workspace lint/test:

```text
$ pnpm turbo run lint test
Packages in scope: @template/api, @template/contracts, mobile
Tasks: 6 successful, 6 total
exit 0
```

Review-tool note:

- The xhigh command itself may recreate transient `.claude-state/` while it is running. That is not a PR1 implementation artifact, but it must be removed again before PR packaging or any final local artifact check.

## xhigh Rereview NO_GO Remediation

Second implementation review output:

- `.evidence/reviews/pr1-work-unit-status-machine-implementation-xhigh-rereview-20260610.md`
- verdict: `NO_GO`
- blocker found: current `node scripts/validate-repo-operations.mjs` failed after concurrent Confluence dependency boundary assertions were added.

Action taken:

- Kept the new repo-operations assertions; did not revert concurrent policy work.
- Ensured `package.json` uses advisory/non-test script `sot:provenance-refresh:manual` rather than `test:local-harness:sot-refresh`.
- Removed the hard active-runtime dependency on `docs/confluence/20260608-codex-expo-rn-runtime-sot-update.md` from `scripts/validate-runtime-artifacts.mjs`.
- Kept local harness validation on repo-local offline snapshot/provenance language:
  - `evals/local-harness/README.md`
  - `scripts/test-local-harness.mjs`
- Extended package `validate` pre-cleanup to remove transient `.claude/` and `.claude-state/` before direct runtime artifact validation; direct `scripts/validate-runtime-artifacts.mjs` still rejects root `CLAUDE.md`, `.claude`, and `.claude-state`.
- Updated `PROJECT_ENVIRONMENT.md` to document the expanded transient cleanup.

Post-remediation checks:

```text
$ node scripts/validate-repo-operations.mjs
Validated repo operations policy ownership.
exit 0

$ node scripts/test-local-harness.mjs --self-test --stage all
self-test all passed
exit 0

$ rg -n 'test:local-harness:sot-refresh|Confluence pages listed in `sot/snapshot.json` as the source of truth|^## Confluence Sources$|confluenceRuntimeSotPath|20260608-codex-expo-rn-runtime-sot-update|Confluence runtime SoT update' package.json scripts/validate-runtime-artifacts.mjs evals/local-harness/README.md scripts/test-local-harness.mjs team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md
<no output>
exit 1 (expected no-match)
```

Post-remediation runtime gate:

```text
$ pnpm run test:runtime
Validated 11 skills, 13 agents, and 4 hook events.
Codex headless review helper self-test passed.
Validated repo operations policy ownership.
Validated current team-doc managed docs.
Validated work-unit status fixtures.
Validated work-unit status artifacts.
Passed 44 hook fixture tests.
exit 0
```

Post-remediation local harness:

```text
$ pnpm run test:local-harness
clean-tree-guard self-test passed
codex-preflight self-test passed
codex-preflight accepted /opt/homebrew/bin/codex (codex-cli 0.137.0)
Validated 11 skills, 13 agents, and 4 hook events.
Codex headless review helper self-test passed.
Validated repo operations policy ownership.
Validated current team-doc managed docs.
Validated work-unit status fixtures.
Validated work-unit status artifacts.
Passed 44 hook fixture tests.
Tasks: 6 successful, 6 total
self-test all passed
local harness all passed
exit 0
```

Post-remediation workspace lint/test:

```text
$ pnpm turbo run lint test
Packages in scope: @template/api, @template/contracts, mobile
Tasks: 6 successful, 6 total
exit 0
```

Root artifact absence after latest gates:

```text
$ find . -maxdepth 2 \( -name 'CLAUDE.md' -o -name '.claude' -o -name '.claude-state' \) -print
<no output>
exit 0
```

Current targeted dirty status:

```text
 M .github/workflows/quality-gate.yml
 M PROJECT_ENVIRONMENT.md
 M REPO_OPERATIONS.md
 M docs/plans/work-units/README.md
 M evals/local-harness/README.md
 M package.json
 M scripts/test-local-harness.mjs
 M scripts/validate-repo-operations.mjs
 M scripts/validate-runtime-artifacts.mjs
 M team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md
?? docs/plans/work-units/sample-role-handoff/status.json
?? evals/work-units/
?? scripts/lib/
?? scripts/validate-work-units.mjs
```

## Final xhigh GO And Post-Review Cleanup

Final implementation review output:

- `.evidence/reviews/pr1-work-unit-status-machine-implementation-xhigh-final-rereview-20260610.md`
- `.evidence/reviews/pr1-work-unit-status-machine-implementation-xhigh-final-rereview-20260610.json`
- verdict: `GO`
- findings: none
- exact next permitted step: proceed to PR packaging for PR1 after removing transient review-tool `.claude/` and `.claude-state/` artifacts and recording one final root artifact absence check.

Post-review cleanup:

- Removed `.claude-state/file_stats.json`.
- Removed `.claude-state/recent_changes.json`.
- Removed empty `.claude-state/` and `.claude/` directories.

Final root artifact absence:

```text
$ find . -maxdepth 2 \( -name 'CLAUDE.md' -o -name '.claude' -o -name '.claude-state' \) -print
<no output>
exit 0
```
