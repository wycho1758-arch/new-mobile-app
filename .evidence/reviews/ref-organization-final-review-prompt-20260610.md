# Ref Organization Final Reviewer Prompt

Reviewer: `wm-implementation-reviewer`
Mode: xhigh / read-only
Date: 2026-06-10

## Objective

Review the completed `$wm` goal:

`team-doc/mobile-app-dev-team/12-ref-organization-goal-plan.md 을 진행하세요.`

The user required:

- Build the reference organization structure under `team-doc/mobile-app-dev-team/`, not `team-doc/10-structured/`.
- Use a reusable structure such as `team-doc/mobile-app-dev-team/ref-organization/` if appropriate.
- Treat `team-doc/10-structured` as initial/historical source material.
- Align with the current project organization where clawpod agents collaborate inside pods and use Codex plus computer-use/tool surfaces.
- Plan and execute by goal checkpoints.
- Review each checkpoint with Reviewer(xhigh).
- Report the plan path.

## Source References

- `AGENTS.md`
- `PROJECT_ENVIRONMENT.md`
- `.agents/skills/wm/SKILL.md`
- `team-doc/mobile-app-dev-team/00-sot-and-principles.md`
- `team-doc/mobile-app-dev-team/01-team-composition.md`
- `team-doc/mobile-app-dev-team/04-skills-and-agents-matrix.md`
- `team-doc/mobile-app-dev-team/06-gates-and-evidence.md`
- `team-doc/mobile-app-dev-team/10-github-artifact-workflow.md`
- `team-doc/mobile-app-dev-team/99-source-map.md`
- `team-doc/10-structured/**`

## Primary Artifacts To Review

- `team-doc/mobile-app-dev-team/12-ref-organization-goal-plan.md`
- `team-doc/mobile-app-dev-team/ref-organization/`
- `team-doc/mobile-app-dev-team/ref-organization/99-source-map-and-migration/old-to-new-crosswalk.md`
- `team-doc/mobile-app-dev-team/ref-organization/99-source-map-and-migration/validator-requirements.md`
- `scripts/validate-team-doc.mjs`
- `team-doc/mobile-app-dev-team/README.md`
- `team-doc/mobile-app-dev-team/99-source-map.md`

## Prior Final Review Blockers To Recheck

1. Missing target documents from the plan/crosswalk:
   - `team-doc/mobile-app-dev-team/ref-organization/00-orientation-and-sot/purpose.md`
   - `team-doc/mobile-app-dev-team/ref-organization/00-orientation-and-sot/sot-priority.md`
   - `team-doc/mobile-app-dev-team/ref-organization/05-skills-agents-and-tools/active-skill-agent-policy.md`
   - `team-doc/mobile-app-dev-team/ref-organization/05-skills-agents-and-tools/skill-placement-policy.md`
   - `team-doc/mobile-app-dev-team/ref-organization/05-skills-agents-and-tools/reviewer-researcher-boundaries.md`
   - `team-doc/mobile-app-dev-team/ref-organization/05-skills-agents-and-tools/optional-tool-adoption.md`
2. Validator did not require those documents and did not verify crosswalk target existence.
3. Full validation was incomplete because `pnpm turbo run lint test` and `pnpm run test:local-harness` had not run after validator changes.
4. Page status blocks still said pending final Reviewer evidence.

## Fixes Claimed

- Added/verified all six missing docs above.
- Updated `scripts/validate-team-doc.mjs` to require those docs.
- Updated `scripts/validate-team-doc.mjs` to check that non-directory ref-organization crosswalk targets exist.
- Added required term coverage for orientation, skill/agent/tool policies, runtime surfaces, handoffs, gates, template guidance, and migration docs.
- Linked `ref-organization/` from the managed team README and source map.
- Left final page `Reviewer evidence:` fields pending until final Reviewer(xhigh) passes.

## Commands Run

- `pnpm run validate:team-doc` passed:
  - `Validated team-doc: 71 source files, 32 structured files.`
- `pnpm run test:runtime` passed:
  - `Validated 11 skills, 13 agents, and 4 hook events.`
  - `Codex headless review helper self-test passed.`
  - `Passed 44 hook fixture tests.`
- `pnpm turbo run lint test` passed:
  - `Tasks: 6 successful, 6 total`
- `pnpm run test:local-harness` passed:
  - `clean-tree-guard self-test passed`
  - `codex-preflight self-test passed`
  - `self-test all passed`
  - `local harness all passed`

## Required Review

Return findings first, ordered by severity, with file references. Verify:

- The output structure satisfies the user-requested location and does not migrate content into `team-doc/10-structured/`.
- `team-doc/10-structured` is treated as historical/initial material, not active current SoT.
- Current project and reusable future-organization guidance are separated clearly.
- Codex runtime, pod-native OpenClaw skill runtime, pod completion hook runtime, and computer-use/tool surfaces are separated clearly.
- Role model, Gatekeeper model, handoff model, gates, evidence rules, and optional tool adoption are source-grounded.
- The validator covers the structure sufficiently, including required documents, status blocks, crosswalk row count, allowed crosswalk statuses, target prefixes, and target existence.
- Checkpoint review evidence exists for the goal plan and checkpoints 1 through 5, and final review can cover checkpoint 6/final state.
- Required commands are sufficient and passed.

At the end, include exactly one fenced reviewer verdict JSON envelope.
