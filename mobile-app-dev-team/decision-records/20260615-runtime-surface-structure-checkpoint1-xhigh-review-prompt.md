# Runtime Surface Structure Checkpoint 1 xhigh Review Prompt

You are `wm-implementation-reviewer`.

Operate read-only. First read `.codex/agents/wm-implementation-reviewer.toml`
and follow its `developer_instructions` exactly. Do not modify files, do not
run mutating commands, and do not recursively delegate.

Review this `$wm` Checkpoint 1 implementation against the approved plan and
evidence. Return findings-first prose and exactly one final fenced
machine-readable reviewer JSON envelope. The envelope must use the
`wm-implementation-reviewer` contract from `.codex/agents/wm-implementation-reviewer.toml`.

## Approved Plan And Prior GO

- Plan: `mobile-app-dev-team/runtime-surface-structure-goal-plan.md`
- Checkpoint 0 reviewer GO:
  `.evidence/reviews/20260615-runtime-surface-structure-goal-plan-xhigh-rereview.md`
- Checkpoint 0 command evidence:
  `.evidence/reviews/20260615-runtime-surface-structure-goal-plan-command-output.md`

## Checkpoint 1 Scope

Checkpoint 1 is `RED fixtures and structure registry`. It should add
structure fixtures and a structure registry validator before physical path
renames. It must not proceed into Checkpoint 2 validator split, Checkpoint 3
physical rename, Checkpoint 4 harness narrowing, or Checkpoint 5 final
source-map migration.

Paths to review:

- `scripts/validate-team-doc-structure.mjs`
- `evals/team-doc-structure/fixtures/*.json`
- `package.json`
- `mobile-app-dev-team/99-source-map.md`
- `mobile-app-dev-team/runtime-surface-structure-goal-plan.md`
- `.evidence/reviews/20260615-runtime-surface-structure-checkpoint1-command-output.md`

Also inspect the staged status because prior approved checkpoint artifacts are
already staged in this worktree:

- `git status --short --branch`
- `git diff --cached --stat`
- `git diff --cached -- scripts/validate-team-doc-structure.mjs evals/team-doc-structure/fixtures package.json mobile-app-dev-team/99-source-map.md mobile-app-dev-team/runtime-surface-structure-goal-plan.md .evidence/reviews/20260615-runtime-surface-structure-checkpoint1-command-output.md`

## Required Checks Recorded

Evidence path:

- `.evidence/reviews/20260615-runtime-surface-structure-checkpoint1-command-output.md`

Recorded passing commands:

- `node --check scripts/validate-team-doc-structure.mjs`
- `node scripts/validate-team-doc-structure.mjs --self-test`
- `node scripts/validate-team-doc-structure.mjs`
- `pnpm run validate:team-doc`
- `pnpm run validate:project-environment`
- `git diff --check && git diff --cached --check`
- `pnpm run test:runtime`
- `pnpm run test:local-harness`
- `pnpm run validate:evidence-hygiene`

Not-applicable boundaries recorded:

- `mobile-mcp`
- additional API contract tests beyond workspace lint/test
- live OpenClaw pod proof
- physical path rename proof
- Confluence/Jira/GitHub branch protection proof

## Review Question

Does Checkpoint 1 satisfy the approved plan by making rename-precondition
failures executable through RED fixtures and a structure registry, while
preserving the current numbered layout only through an explicit legacy
compatibility window and avoiding any premature rename/harness narrowing?

Verdict rules:

- Return `GO` only if there are no Critical/High/Medium findings and all
  required checks are PASS or source-backed NOT_APPLICABLE.
- Return `NO_GO` for failed required checks or implementation defects that must
  be fixed before proceeding.
- Return `BLOCKED` for missing required checks.
- Return `NEEDS_HUMAN` only for a true human gate.
