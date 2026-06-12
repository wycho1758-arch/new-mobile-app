# Final Review Request: repo-local git-workflow

Review mode: final
Target: `.agents/skills/git-workflow/SKILL.md`
Baseline: `ab3bb5483db20137f15caca9eadfde15ca90012e`

## Plan And Evidence

- Plan: `.evidence/wm/20260612-repo-local-git-workflow-plan.md`
- Plan GO review: `.evidence/wm/20260612-repo-local-git-workflow-plan-review-r4.md`
- Verification evidence: `.evidence/wm/20260612-repo-local-git-workflow-verification.md`

## Implemented Paths

- `.agents/skills/git-workflow/SKILL.md`
- `evals/skills/git-workflow/positive.prompt.md`
- `evals/skills/git-workflow/negative.prompt.md`
- `evals/skills/git-workflow/review-only-negative.prompt.md`
- `evals/skills/git-workflow/unsafe-main-push-negative.prompt.md`
- `evals/skills/git-workflow/self-approval-negative.prompt.md`
- `evals/skills/git-workflow/issue-mutation-negative.prompt.md`
- `scripts/validate-runtime-artifacts.mjs`
- `evals/local-harness/sot/snapshot.json`
- `mobile-app-dev-team/04-skills-and-agents-matrix.md`
- `PROJECT_ENVIRONMENT.md`

## Required Checks Run

- `node scripts/validate-runtime-artifacts.mjs`: PASS
- `node scripts/test-local-harness.mjs --self-test --stage structure`: PASS
- `node scripts/test-local-harness.mjs --stage structure --json`: PASS
- `pnpm run test:runtime`: PASS
- `pnpm turbo run lint test`: PASS
- `pnpm run test:local-harness`: PASS

## Review Focus

- Confirm the implementation follows the approved plan.
- Confirm tests/evals/validator assertions cover the git workflow safety contract.
- Confirm the skill forbids direct push to `main`, unauthorized force-push, self-approval, failed-gate pass-through, unauthorized issue mutation, and merge/delete branch in `complete`.
- Confirm repo-local Codex placement, skill registry, `PROJECT_ENVIRONMENT.md`, and skill matrix sync are coherent.
- Confirm no mobile UI/API implementation review is needed.
- Account for existing unrelated dirty worktree state. Do not require reverting unrelated user changes.

Return findings-first prose and exactly one reviewer JSON envelope.
