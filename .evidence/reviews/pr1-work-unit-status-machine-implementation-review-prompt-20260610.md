# xhigh Review Prompt - PR1 Work-Unit Status Machine Implementation

You are `wm-implementation-reviewer` in read-only mode. Review the PR1 implementation checkpoint against the repo SoT and the approved preimplementation plan.

Return a JSON envelope with:

- `verdict`: `GO`, `NO_GO`, `NEEDS_HUMAN`, or `BLOCKED`
- `reviewer`
- `mode`: `implementation`
- `scope`
- `findings`
- `checks_reviewed`
- `residual_risks`
- `next_action`

Review targets:

- `AGENTS.md`
- `PROJECT_ENVIRONMENT.md`
- `REPO_OPERATIONS.md`
- `team-doc/mobile-app-dev-team/05-work-processes.md`
- `team-doc/mobile-app-dev-team/06-gates-and-evidence.md`
- `team-doc/mobile-app-dev-team/10-github-artifact-workflow.md`
- `docs/plans/active/20260610-wm-mobile-template-runtime-goal-plan.md`
- `docs/plans/active/20260610-pr1-work-unit-status-machine-preimplementation-plan.md`
- `.evidence/reviews/pr1-work-unit-status-machine-preimplementation-xhigh-rereview-20260610.md`
- `.evidence/reviews/pr1-work-unit-status-machine-implementation-checkpoint-20260610.md`
- `scripts/lib/work-unit-machine.mjs`
- `scripts/validate-work-units.mjs`
- `evals/work-units/fixtures/**/status.json`
- `docs/plans/work-units/README.md`
- `docs/plans/work-units/sample-role-handoff/status.json`
- `package.json`
- `scripts/validate-repo-operations.mjs`
- `.github/workflows/quality-gate.yml`

Required checks:

- Confirm TDD order: RED fixture/check existed before implementation and GREEN checks passed after implementation.
- Confirm the implementation is bounded to PR1 passive `wu-status/v1` validation/status artifact work.
- Confirm it does not implement PR2 human-gate envelopes, PR3 orchestration/next-action resolver, PR5 evidence ladder ingestion, live/native/EAS/pod/platform behavior, or customer-specific identities/secrets.
- Confirm runtime gate wiring is complete: `package.json`, `scripts/validate-repo-operations.mjs`, `.github/workflows/quality-gate.yml`, `PROJECT_ENVIRONMENT.md`, and `REPO_OPERATIONS.md`.
- Confirm validator behavior covers schema, folder id matching, stage/owner/state boundaries, read-only reviewer envelope, owner/reviewer self-approval rejection, Gatekeeper misuse rejection, ignored evidence path rejection, and append-only event sequence checks.
- Confirm recorded gates are sufficient for PR1 scope: `node scripts/validate-work-units.mjs --self-test`, `node scripts/validate-work-units.mjs`, `node scripts/validate-repo-operations.mjs`, `pnpm run test:runtime`, `pnpm run test:local-harness`, and `pnpm turbo run lint test`.
- Confirm root Claude artifacts are absent after the approved cleanup.
- Treat current dirty worktree planning/evidence artifacts as packaging risk only unless they invalidate PR1.

If GO, state the exact next permitted step. If not GO, list blocking findings with file/path references.
