# Review Prompt: PR3 Next-Action Resolver Implementation

Date: 2026-06-11
Reviewer: `wm-implementation-reviewer`
Mode: xhigh final implementation review

## Request

Review the completed PR3 implementation against the approved PR3 preimplementation plan, repo SoT, git diff, fixtures, and gate evidence.

## Scope

- Baseline: `f417d79 docs: record PR3 resolver plan review`
- Target: current working tree
- Approved plan: `docs/plans/active/20260611-pr3-next-action-resolver-preimplementation-plan.md`
- Preimplementation xhigh GO: `.evidence/reviews/pr3-next-action-resolver-preimplementation-xhigh-20260611.md`
- Implementation checkpoint: `.evidence/reviews/pr3-next-action-resolver-implementation-checkpoint-20260611.md`

## Changed Areas

- `scripts/work-unit-next.mjs`
- `package.json`
- `.agents/skills/wm-orchestrate/SKILL.md`
- `evals/work-units/fixtures/valid/resolver-*`
- `PROJECT_ENVIRONMENT.md`
- `REPO_OPERATIONS.md`
- `scripts/validate-repo-operations.mjs`
- `team-doc/mobile-app-dev-team/04-skills-and-agents-matrix.md`
- `evals/local-harness/sot/snapshot.json`

## Questions

1. Does the implementation stay inside the xhigh-approved PR3 scope?
2. Does `scripts/work-unit-next.mjs` provide deterministic `wm-next-action/v1` output from validated committed work-unit artifacts?
3. Does it preserve role boundaries, reviewer gates, human gates, and deterministic Release Gatekeeper rules?
4. Does `--apply-transition` stay bounded to validated `status.json` writes and avoid external platform/network behavior?
5. Are the resolver fixtures and self-test sufficient against the approved TDD plan?
6. Are package/runtime/team/local-harness SoT updates consistent with the new runtime validator and `wm-orchestrate` skill?
7. Are required gates adequately run and recorded?
8. Are there any Critical/High/Medium issues blocking commit/PR3 local completion?

## Required Checks Recorded

- `node scripts/work-unit-next.mjs --self-test`: pass
- `node scripts/validate-work-units.mjs --self-test && node scripts/validate-work-units.mjs`: pass
- `node scripts/validate-repo-operations.mjs`: pass
- `node scripts/validate-team-doc.mjs`: pass
- `pnpm run test:runtime`: pass
- `pnpm turbo run lint test`: pass
- `pnpm run test:local-harness`: first fail due to snapshot missing new skill, then pass after snapshot update
- `git diff --check`: pass
- `git diff --cached --check`: pass after staging PR3 implementation files
- `git diff --check`: pass after staging PR3 implementation files
- root `CLAUDE.md`, `.claude/`, `.claude-state/`: absent

## Required Output

Return findings first, then exactly one JSON verdict envelope with:

- `verdict`: `GO`, `NO_GO`, `NEEDS_HUMAN`, or `BLOCKED`
- `reviewer`: `wm-implementation-reviewer`
- `mode`: `final`
- `scope`
- `findings`
- `checks_reviewed`
- `residual_risks`
- `next_action`
