# PR5 Native Evidence Ladder Preimplementation Review Prompt

You are `wm-implementation-reviewer` using high-depth review. Review the PR5 preimplementation plan before implementation starts.

## Scope To Review

- Active plan: `docs/plans/active/20260611-pr5-native-evidence-ladder-preimplementation-plan.md`
- Parent plan: `docs/plans/active/20260610-wm-mobile-template-runtime-goal-plan.md`
- Current HEAD: `cf3bdbe feat: add pod bootstrap preflight`
- PR5 is planning-only at this checkpoint. No PR5 implementation has started.

## Required SoT Inputs

Read and compare against:

- `AGENTS.md`
- `PROJECT_ENVIRONMENT.md`
- `team-doc/mobile-app-dev-team/06-gates-and-evidence.md`
- `team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md`
- `.agents/skills/e2e-test/SKILL.md`
- `apps/mobile/eas.json`
- `apps/mobile/.eas/workflows/e2e-test-android.yml`
- `apps/mobile/.maestro/home.yml`
- `scripts/validate-work-units.mjs`
- `scripts/lib/work-unit-machine.mjs`

## Review Questions

1. Does the plan align with the repo purpose: a reusable WonderMove/ClawPod mobile app template runtime, not a single customer app?
2. Is it correct to continue with PR5 offline evidence ladder after PR4 final GO?
3. Are the allowed implementation paths limited to repo-internal strategy docs, validators, fixtures, offline ingest, and skill docs?
4. Are live EAS, token use, EAS live auth checks, live package creation, workflow execution, mobile-mcp/device runs, pod rollout, webhook, branch protection, store submit, external platform mutation, and Confluence live publish correctly excluded?
5. Is the evidence ladder model sufficient to prevent RN Web/local/offline proof from being misrepresented as native proof?
6. Is the TDD plan adequate, including invalid/valid fixtures and EAS redaction self-test?
7. Are the expected gates sufficient for the planned runtime/script/doc changes?

## Required Output

Return findings first. Then include exactly one fenced JSON reviewer envelope with:

- `verdict`: `GO`, `NO_GO`, `NEEDS_HUMAN`, or `BLOCKED`
- `reviewer`: `wm-implementation-reviewer`
- `mode`: `plan`
- `scope`
- `findings`
- `checks_reviewed`
- `residual_risks`
- `next_action`

Use `GO` only if there are no Critical/High/Medium findings and all required checks are PASS or source-backed NOT_APPLICABLE. Treat missing SoT verification as BLOCKED. Treat human/ops-only live execution needs as NEEDS_HUMAN only if the offline plan itself tries to run them. If you mention review depth, put it in prose or residual risks, not in the `mode` field.
