# PR6 SoT Drift Detection Preimplementation: xhigh Review Prompt

Date: 2026-06-11
Reviewer: wm-implementation-reviewer
Mode: plan

## Request

Review the PR6 preimplementation plan before any implementation starts.

Plan path:

- `docs/plans/active/20260611-pr6-sot-drift-detection-preimplementation-plan.md`

Parent/continuation evidence:

- `docs/plans/active/20260610-wm-mobile-template-runtime-goal-plan.md`
- `.evidence/reviews/mobile-template-runtime-direction-midcheck-after-pr5-xhigh-20260611.md`
- `.evidence/reviews/mobile-template-runtime-direction-midcheck-after-pr5-xhigh-20260611.json`

## SoT Sources To Check

- `AGENTS.md`
- `PROJECT_ENVIRONMENT.md`
- `REPO_OPERATIONS.md`
- `team-doc/mobile-app-dev-team/00-sot-and-principles.md`
- `team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md`
- `.github/workflows/quality-gate.yml`
- `package.json`
- `apps/mobile/package.json`
- `.codex/config.toml`
- `evals/local-harness/sot/snapshot.json`

## Review Questions

1. Does the PR6 plan align with the repo purpose as a reusable WonderMove/ClawPod mobile app template runtime?
2. Is the scope correctly limited to offline deterministic SoT drift detection?
3. Does it avoid live Confluence/Atlassian, Railway, EAS, GitHub issue creation, branch protection, webhook, pod rollout, Secret/token, device/mobile-mcp, and release-readiness claims?
4. Is PR7 evidence hygiene/Stitch/mobile-mcp hardening kept out of PR6 unless separately reviewed?
5. Is the TDD plan sufficient to require RED fixtures before implementation?
6. Are the expected gates sufficient for runtime script/package/CI/doc changes?
7. Should implementation start, or must the plan be corrected first?

## Expected Review Output

Return findings first, then exactly one fenced JSON envelope with:

- `verdict`: `GO`, `NO_GO`, `NEEDS_HUMAN`, or `BLOCKED`
- `reviewer`: `wm-implementation-reviewer`
- `mode`: `plan`
- `scope`
- `findings`
- `checks_reviewed`
- `residual_risks`
- `next_action`

Use `GO` only if there are no Critical/High/Medium findings and required checks are source-backed `PASS` or `NOT_APPLICABLE`. This is read-only review evidence; do not edit files or run external platform actions.
