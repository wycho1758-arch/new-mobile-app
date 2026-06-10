# PR2 Human-Gate Envelope Implementation Checkpoint

## Scope

Implemented PR2 `human-gate/v1` validation inside the reviewed repo-internal scope.

No mobile app, API, contracts, live EAS, pod, webhook, Secret/token, branch protection, or live Confluence publish work was performed.

## Baseline

- Branch: `feat/mobile-app-template`
- Starting implementation baseline: `e2eb31d docs: record PR2 human gate plan review`
- Preimplementation xhigh GO: `.evidence/reviews/pr2-human-gate-envelope-preimplementation-xhigh-20260610.md`

## Changed Paths

- `scripts/lib/work-unit-machine.mjs`
- `scripts/validate-work-units.mjs`
- `evals/work-units/fixtures/valid/human-gate-approved/**`
- `evals/work-units/fixtures/valid/human-gate-rejected/**`
- `evals/work-units/fixtures/valid/human-gate-deferred/**`
- `evals/work-units/fixtures/invalid/human-gate-agent-approver/**`
- `evals/work-units/fixtures/invalid/human-gate-bare-decision-reference/**`
- `evals/work-units/fixtures/invalid/human-gate-unknown-category/**`
- `evals/work-units/fixtures/invalid/human-gate-failed-risk-missing-ref/**`
- `evals/work-units/fixtures/invalid/human-gate-missing-decision-reference/**`
- `evals/work-units/fixtures/invalid/human-gate-ignored-evidence-link/**`
- `evals/work-units/fixtures/invalid/human-gate-path-traversal/**`
- `evals/work-units/fixtures/invalid/human-gate-resume-without-approval/**`
- `evals/work-units/fixtures/invalid/human-gate-missing-decision-file/**`
- `team-doc/mobile-app-dev-team/06-gates-and-evidence.md`
- `team-doc/mobile-app-dev-team/10-github-artifact-workflow.md`
- `docs/plans/work-units/README.md`

## TDD Evidence

RED command:

```text
node scripts/validate-work-units.mjs --self-test
exit 1
```

Expected failing invalid fixtures before implementation:

- `human-gate-agent-approver`
- `human-gate-bare-decision-reference`
- `human-gate-failed-risk-missing-ref`
- `human-gate-ignored-evidence-link`
- `human-gate-missing-decision-file`
- `human-gate-missing-decision-reference`
- `human-gate-path-traversal`
- `human-gate-resume-without-approval`
- `human-gate-unknown-category`

GREEN commands:

```text
node scripts/validate-work-units.mjs --self-test
exit 0
Validated work-unit status fixtures.

node scripts/validate-work-units.mjs
exit 0
Validated work-unit status artifacts.

node scripts/validate-team-doc.mjs
exit 0
Validated current team-doc managed docs.

pnpm run test:runtime
exit 0
Validated 11 skills, 13 agents, and 4 hook events.
Codex headless review helper self-test passed.
Validated repo operations policy ownership.
Validated current team-doc managed docs.
Validated work-unit status fixtures.
Validated work-unit status artifacts.
Passed 44 hook fixture tests.

pnpm run test:local-harness
exit 0
clean-tree-guard self-test passed
codex-preflight self-test passed
codex-preflight accepted /opt/homebrew/bin/codex (codex-cli 0.137.0)
test:runtime passed
pnpm turbo run lint test: 6 successful, 6 total
self-test all passed
local harness all passed

rerun after xhigh fix
exit 0
clean-tree-guard self-test passed
codex-preflight self-test passed
test:runtime passed
pnpm turbo run lint test: 6 successful, 6 total
self-test all passed
local harness all passed

git diff --check
exit 0
```

## xhigh Rereview Fix

Initial final xhigh review returned `NO_GO` because `decision_reference` accepted
a bare PR URL. The validator now requires a concrete GitHub `#issuecomment-...`
or `#pullrequestreview-...` anchor, and `human-gate-bare-decision-reference`
covers the regression.

Focused repro after the fix:

```text
bare PR URL validation
exit 0
[
  "<human-gate>: decision_reference must be a GitHub issue comment or pull request review URL"
]

anchored issue comment validation
exit 0
[]
```

## Implemented Behavior

- `human-gate/v1` decision envelopes are validated for schema, gate id, category, decision, scope, approver identity, GitHub decision reference, timestamp, residual risk array, evidence links, and failed-check reference for `failed-gate-risk`.
- Work-unit `human_gates[]` entries are validated for category, blocking stage, state, decision path, and matching decision file.
- `blocked-human` status requires at least one human gate.
- `in-progress` work with human gates requires matching `approved` decisions.
- Role names, reviewer/custom agent names, Release Gatekeeper/System, LLM, and pod identities are rejected as approvers.
- Ignored evidence paths and path traversal are rejected from human gate evidence links.
- `validate-work-units.mjs` now validates decision files under `00-product-planning/human-gates/*.json` and `05-qa-release/human-approval.json` together with `status.json`.

## Confluence Decision

No live Confluence publish was performed. The repo SoT docs changed locally, but live Confluence publish/update remains a human-gated external update requiring explicit target page IDs, current versions, proposed body changes, and reviewer evidence.
