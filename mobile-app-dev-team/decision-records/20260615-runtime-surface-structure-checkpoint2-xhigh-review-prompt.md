# Runtime Surface Structure Checkpoint 2 xhigh Review Prompt

You are `wm-implementation-reviewer`.

Operate read-only. First read `.codex/agents/wm-implementation-reviewer.toml`
and follow its `developer_instructions` exactly. Do not modify files, do not
run mutating commands, and do not recursively delegate.

Review this `$wm` Checkpoint 2 implementation against the approved plan and
evidence. Return findings-first prose and exactly one final fenced
machine-readable reviewer JSON envelope. The envelope must use the
`wm-implementation-reviewer` contract from `.codex/agents/wm-implementation-reviewer.toml`.

## Approved Plan And Prior Checkpoint GOs

- Plan: `mobile-app-dev-team/runtime-surface-structure-goal-plan.md`
- Checkpoint 0 reviewer GO:
  `.evidence/reviews/20260615-runtime-surface-structure-goal-plan-xhigh-rereview.md`
- Checkpoint 1 reviewer GO:
  `.evidence/reviews/20260615-runtime-surface-structure-checkpoint1-xhigh-review.md`

## Checkpoint 2 Scope

Checkpoint 2 is `Validator split`. It should make
`scripts/validate-team-doc.mjs` a composition wrapper and introduce
surface-specific validators while preserving existing gate strength.

Paths to review:

- `scripts/validate-team-doc.mjs`
- `scripts/validate-team-doc-managed.mjs`
- `scripts/validate-team-doc-structure.mjs`
- `scripts/validate-runtime-sources.mjs`
- `scripts/validate-workflow-docs.mjs`
- `scripts/validate-governance-docs.mjs`
- `scripts/validate-reference-docs.mjs`
- `scripts/lib/team-doc-validation-helpers.mjs`
- `package.json`
- `.github/workflows/quality-gate.yml`
- `scripts/validate-project-environment.mjs`
- `PROJECT_ENVIRONMENT.md`
- `REPO_OPERATIONS.md`
- `mobile-app-dev-team/99-source-map.md`
- `.evidence/reviews/20260615-runtime-surface-structure-checkpoint2-command-output.md`

Also inspect:

- `git status --short --branch`
- `git diff --cached --stat`
- `git diff --cached -- scripts/validate-team-doc.mjs scripts/validate-team-doc-managed.mjs scripts/validate-runtime-sources.mjs scripts/validate-workflow-docs.mjs scripts/validate-governance-docs.mjs scripts/validate-reference-docs.mjs scripts/lib/team-doc-validation-helpers.mjs package.json .github/workflows/quality-gate.yml scripts/validate-project-environment.mjs PROJECT_ENVIRONMENT.md REPO_OPERATIONS.md mobile-app-dev-team/99-source-map.md .evidence/reviews/20260615-runtime-surface-structure-checkpoint2-command-output.md`

## Required Checks Recorded

Evidence path:

- `.evidence/reviews/20260615-runtime-surface-structure-checkpoint2-command-output.md`

Recorded passing commands:

- `for f in scripts/*.mjs scripts/lib/*.mjs; do node --check "$f" || exit 1; done`
- `pnpm run validate:team-doc:structure && pnpm run validate:runtime-sources && pnpm run validate:workflow-docs && pnpm run validate:governance-docs && pnpm run validate:reference-docs`
- `pnpm run validate:team-doc`
- `pnpm run validate:project-environment`
- `node scripts/validate-repo-operations.mjs`
- `git diff --check && git diff --cached --check`
- `pnpm run test:runtime`
- `pnpm run test:local-harness`
- `pnpm run validate:evidence-hygiene`

Not-applicable boundaries recorded:

- `mobile-mcp`
- additional API contract tests beyond workspace lint/test
- live OpenClaw pod proof
- physical path rename proof
- harness narrowing proof
- Confluence/Jira/GitHub branch protection proof

## Review Question

Does Checkpoint 2 satisfy the approved plan by splitting `validate-team-doc`
into surface-specific validators with explicit package scripts and docs, while
preserving existing monolithic checks through a parity backstop and avoiding any
premature physical path rename or harness narrowing?

Verdict rules:

- Return `GO` only if there are no Critical/High/Medium findings and all
  required checks are PASS or source-backed NOT_APPLICABLE.
- Return `NO_GO` for failed required checks or implementation defects that must
  be fixed before proceeding.
- Return `BLOCKED` for missing required checks.
- Return `NEEDS_HUMAN` only for a true human gate.
