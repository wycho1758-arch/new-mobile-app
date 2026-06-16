# Runtime Surface Structure Checkpoint 3-A Reports xhigh Review Prompt

You are `wm-implementation-reviewer`.

Operate read-only. First read `.codex/agents/wm-implementation-reviewer.toml`
and follow its `developer_instructions` exactly. Do not modify files, do not
run mutating commands, and do not recursively delegate.

Review this `$wm` Checkpoint 3-A report movement against the approved plan and
evidence. Return findings-first prose and exactly one final fenced
machine-readable reviewer JSON envelope. The envelope must use the
`wm-implementation-reviewer` contract from `.codex/agents/wm-implementation-reviewer.toml`.

## Approved Plan And Prior Checkpoint GOs

- Plan now lives at:
  `mobile-app-dev-team/reports/runtime-surface-structure-goal-plan.md`
- Prior plan path before 3-A:
  `mobile-app-dev-team/runtime-surface-structure-goal-plan.md`
- Checkpoint 0 reviewer GO:
  `.evidence/reviews/20260615-runtime-surface-structure-goal-plan-xhigh-rereview.md`
- Checkpoint 1 reviewer GO:
  `.evidence/reviews/20260615-runtime-surface-structure-checkpoint1-xhigh-review.md`
- Checkpoint 2 reviewer GO:
  `.evidence/reviews/20260615-runtime-surface-structure-checkpoint2-xhigh-review.md`

## Checkpoint 3-A Scope

Checkpoint 3 is `Structure rename`. This subcheckpoint is deliberately limited
to the plan's recommended `3-A: reports/ 이동`.

Moved report-class paths:

- `mobile-app-dev-team/reports/team-doc-validator-and-soul-runtime-explainer.md`
- `mobile-app-dev-team/reports/runtime-surface-classification-improvement-report.md`
- `mobile-app-dev-team/reports/runtime-surface-classification-improvement-report-v2.md`
- `mobile-app-dev-team/reports/runtime-surface-structure-goal-plan.md`

Paths to review:

- `mobile-app-dev-team/README.md`
- `mobile-app-dev-team/99-source-map.md`
- `mobile-app-dev-team/reports/*.md`
- `.evidence/reviews/20260615-runtime-surface-structure-checkpoint3a-reports-command-output.md`

Also inspect:

- `git status --short --branch`
- `git diff --cached --name-status`
- `git diff --cached -- mobile-app-dev-team/README.md mobile-app-dev-team/99-source-map.md mobile-app-dev-team/reports .evidence/reviews/20260615-runtime-surface-structure-checkpoint3a-reports-command-output.md`

Note: these reports were already staged as new files in prior approved
checkpoints, so Git may show them as staged additions rather than rename pairs.
Evaluate the current filesystem paths, indexes, and scope boundaries.

## Required Checks Recorded

Evidence path:

- `.evidence/reviews/20260615-runtime-surface-structure-checkpoint3a-reports-command-output.md`

Recorded passing commands:

- `pnpm run validate:team-doc`
- `git diff --check && git diff --cached --check`
- `pnpm run test:runtime`
- `pnpm run test:local-harness`
- `pnpm run validate:evidence-hygiene`

Not-applicable boundaries recorded:

- pod-native smoke scripts
- `mobile-mcp`
- additional API contract tests beyond workspace lint/test
- live OpenClaw pod proof
- runtime source rename proof
- harness narrowing proof
- Confluence/Jira/GitHub branch protection proof

## Review Question

Does Checkpoint 3-A satisfy the approved plan by moving only report-class docs
under `mobile-app-dev-team/reports/`, updating current indexes to those paths,
leaving old names only as historical/crosswalk references, and avoiding any
runtime-source, pod-native, governance, workflow, source-map filename, harness,
or external-platform movement?

Verdict rules:

- Return `GO` only if there are no Critical/High/Medium findings and all
  required checks are PASS or source-backed NOT_APPLICABLE.
- Return `NO_GO` for failed required checks or implementation defects that must
  be fixed before proceeding.
- Return `BLOCKED` for missing required checks.
- Return `NEEDS_HUMAN` only for a true human gate.
