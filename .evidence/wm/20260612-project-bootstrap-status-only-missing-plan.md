# Project Bootstrap Status-Only Missing Plan

Date: 2026-06-12

## Scope

Update the repo-authored `project-bootstrap` pod-native skill so agents do not
misclassify status-only `missing` values as user blockers.

Affected paths:

- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-preflight.sh`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/references/blocker-resolution-guide.md`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/references/report-template.md`
- `evals/skills/project-bootstrap-agent-setup-smoke.sh`

Out of scope:

- No live pod bootstrap, `pnpm install`, EAS, Railway, Stitch, GitHub mutation,
  or cloud auth.
- No changes to unrelated mobile team document cleanup already present in the
  worktree.

## SoT Inputs

- `AGENTS.md`: pod-native OpenClaw skills are authored under
  `mobile-app-dev-team/09-pod-native-openclaw-skills/<slug>/`; TDD is required;
  runtime changes require `pnpm run test:runtime` and local harness when
  applicable.
- `PROJECT_ENVIRONMENT.md`: `$wm` plans must be SoT-grounded, runtime changes
  require reviewer evidence, and local harness validates runtime structure.
- `.agents/skills/wm/SKILL.md`: plan before implementation, use read-only
  reviewer evidence before and after work, update tests/evals before
  implementation, keep changes repo-scoped.
- `project-bootstrap/SKILL.md`: the skill is an orchestration skill that must
  use status-only reporting for external CLI/account readiness and must not run
  live external actions.
- `project-bootstrap/scripts/project-bootstrap-preflight.sh`: `railway`,
  `gcloud`, and `eas` CLI statuses are always recorded, but missing CLI values
  are not blocker conditions by themselves; role-specific report blockers apply
  only to `design` and `qa-release`.
- `project-bootstrap/references/report-template.md`: current report fields allow
  `missing` for CLI and report status values but do not clearly distinguish
  status-only missing from blocking missing.

## Plan

1. Add a narrow eval case before docs implementation that exercises
   `project-bootstrap-preflight.sh` for `product-planning` with missing
   Railway/gcloud/EAS CLIs and missing `pod-role-bootstrap` report, asserting
   the report can still be `ready_for_bootstrap` with an empty `blockers` array.
2. Add a non-breaking `PROJECT_BOOTSTRAP_SKILLS_ROOT` override to
   `project-bootstrap-preflight.sh`, defaulting to `/workspace/skills`, so the
   eval can create required skill directories under a temp root instead of
   writing to `/workspace`.
3. Update `SKILL.md` to explicitly instruct agents that:
   - status-only `cli.railway`, `cli.gcloud`, and `cli.eas` values are not
     user blockers unless the current role or SoT makes them required;
   - `reports.pod_role_bootstrap: missing` before `pod-role-bootstrap` runs is
     pending evidence, not a user blocker;
   - agents must use the `blockers` array, role flags, and workflow phase to
     decide whether a `missing` value is actionable.
4. Update `blocker-resolution-guide.md` with a dedicated
   "Status-Only Missing Values" section and concrete handling for
   Product/Planning.
5. Update `report-template.md` with interpretation notes for `cli` and
   `reports` fields so generated or human-readable reports preserve the
   distinction.
6. Run focused verification:
   - `bash evals/skills/project-bootstrap-agent-setup-smoke.sh`
   - `bash -n` for the two project-bootstrap scripts
   - `node scripts/validate-team-doc.mjs`
7. Run required runtime gates:
   - `pnpm run test:runtime`
   - `pnpm turbo run lint test`
   - `pnpm run test:local-harness`
8. Run final reviewer against approved plan, git diff, and command output before
   reporting done.

## Plan Review Feedback

Initial reviewer: `wm-implementation-reviewer`

Result: `NO_GO`

Feedback:

- Add the always-required workspace gate `pnpm turbo run lint test` to final
  verification evidence before PR readiness.

Disposition:

- Reflected in the required runtime gates above.

Implementation planning update:

- The preflight eval needs a controlled required-skill directory root. Instead
  of creating `/workspace/skills` on the host, the plan now includes a defaulted
  `PROJECT_BOOTSTRAP_SKILLS_ROOT` override in `project-bootstrap-preflight.sh`.

## Reviewer Routing

Reviewer: `wm-implementation-reviewer`

Question: Does this plan correctly scope the runtime skill update, preserve
agent-owned setup boundaries, and include sufficient tests/evidence to prevent
status-only `missing` values from becoming false user blockers?

Expected evidence path:

- Plan review: `.evidence/reviews/20260612-project-bootstrap-status-only-missing-plan-review.md`
- Final review: `.evidence/reviews/20260612-project-bootstrap-status-only-missing-final-review.md`
