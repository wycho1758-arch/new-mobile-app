# Codex Role Workflow Actual Skill Implementation Plan

Date: 2026-06-13
Mode: implementation plan
Scope:

- Pod-native OpenClaw skill source: `mobile-app-dev-team/09-pod-native-openclaw-skills/codex-role-workflow/SKILL.md`
- Repo-local Codex skill: `.agents/skills/mobile-architect-workflow/SKILL.md`
- Repo-local skill reinforcements:
  - `.agents/skills/design-mobile-design-handoff/SKILL.md`
  - `.agents/skills/design-stitch-mcp-operating-rules/SKILL.md`
  - `.agents/skills/mobile-app-dev-workflow/SKILL.md`
  - `.agents/skills/mobile-backend-api-integrator-workflow/SKILL.md`
- Runtime/team-doc validation and eval coverage:
  - `scripts/validate-team-doc.mjs`
  - `scripts/validate-runtime-artifacts.mjs`
  - `evals/skills/**`
  - `evals/local-harness/sot/snapshot.json`
- Team SoT crosswalk docs:
  - `mobile-app-dev-team/04-skills-and-agents-matrix.md`
  - `mobile-app-dev-team/09-pod-native-openclaw-skills/README.md`
  - `mobile-app-dev-team/02-role-souls/mobile-architect-soul.md`

## Execution Progress

| Phase | Status | Evidence |
| --- | --- | --- |
| Phase 0 plan reviewer | PASS | `codex-role-workflow-actual-skill-implementation-plan-review.json` returned `GO` after prior NO_GO findings were fixed. |
| Phase 1 validator/eval first | PASS | Added deterministic validator, snapshot, and eval coverage before skill behavior edits. |
| Phase 1 reviewer | PASS | `codex-role-workflow-phase1-validator-eval-review.json` returned `GO` after row-level and eval-body coverage findings were fixed. |
| Phase 2 skill creation/reinforcement | PASS | Created `codex-role-workflow`, created `mobile-architect-workflow`, updated matrix/SOUL, and reinforced Design/Mobile/Backend/QA skills. |
| Phase 2 reviewer | PASS | `codex-role-workflow-phase2-skill-implementation-review.json` returned `GO` after Backend/API reviewer-routing and validator findings were fixed. |
| Phase 3 validation | PASS | `codex-role-workflow-actual-skill-verification.md` records `validate:team-doc`, `test:runtime`, `test:local-harness`, and `turbo lint test` exit 0 results. |
| Phase 4 final reviewer | PASS | `codex-role-workflow-final-actual-work-review.json` returned `GO`; physical `/workspace` pod packaging is external runtime proof, not local repo scope. |

## User Objective

The previous analysis package identified missing or thin skill surfaces. This implementation must now create or reinforce the real skill artifacts at their correct locations while preserving the distinction between:

- repo-local native Codex skills: `.agents/skills/<skill-name>/SKILL.md`;
- pod-native OpenClaw skill sources: `mobile-app-dev-team/09-pod-native-openclaw-skills/<slug>/SKILL.md`, whose runtime shape is `/workspace/skills/<slug>/SKILL.md`;
- custom agents: `.codex/agents/<agent-name>.toml`.

Each checkpoint must be reviewed by `wm-implementation-reviewer` with high reasoning before moving to the next stage.

## SoT Basis

- `AGENTS.md`
  - TDD required before implementation changes.
  - Codex skill or agent requests use `.agents/skills/<skill-name>/SKILL.md` and `.codex/agents/<agent-name>.toml`.
  - Pod-native OpenClaw skill-only requests use `/workspace/skills/<slug>/SKILL.md` runtime shape and are authored under `mobile-app-dev-team/09-pod-native-openclaw-skills/<slug>/`.
  - Runtime changes must pass `pnpm run test:runtime`; Codex runtime/harness changes require `pnpm run test:local-harness`; workspace lint/test must pass before PR.
- `.agents/skills/wm/SKILL.md`
  - Plan from SoT, do not guess missing facts.
  - Add/update the narrowest failing test, eval, fixture, harness assertion, or validator first.
  - Actual work must be reviewed against approved plan, diff, commands, and evidence before Done.
  - Final report must include material `git diff` and `git status --short`.
- `mobile-app-dev-team/04-skills-and-agents-matrix.md`
  - Active repo-local skills are only directories under `.agents/skills/<slug>/SKILL.md`.
  - Pod-native OpenClaw skills belong under `09-pod-native-openclaw-skills/` and must not contain repo-local Codex artifacts.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/README.md`
  - Pod-native skills are source-only docs for `/workspace/skills/<slug>/SKILL.md`.
  - Existing setup skills are readiness/status-only.
- `.evidence/reviews/20260613-codex-cli-role-skill-analysis/07-cross-role-skill-agent-implementation-recommendation.md`
  - Requires `codex-role-workflow` pod-native skill.
  - Requires `mobile-architect-workflow` repo-local skill.
  - Requires validator/eval coverage.
  - Requires Design Stitch skill reinforcement for selected `DESIGN.md` baseline, same Stitch project continuation, manifest metadata, and drift blocking.
  - Requires Mobile App Dev and Backend/API concrete plan packets, reviewer gates, role artifacts, and diff/status reporting.
- `.evidence/reviews/20260613-codex-cli-role-skill-analysis/08-reviewer-checklist-and-final-verdict.md`
  - Reviewer must verify all six SOUL roles, Gatekeeper non-role boundary, path separation, Mobile Architect gap closure, concrete plan packets, Design drift checks, and external proof limits.
- `scripts/validate-runtime-artifacts.mjs`
  - All `.agents/skills/<slug>/SKILL.md` files need YAML frontmatter and matching eval fixtures.
  - Existing Design skill assertions already enforce P0/P1, Stitch, `DESIGN.md`, publication, and no implementation ownership.
- `scripts/test-local-harness.mjs`
  - `evals/local-harness/sot/snapshot.json.skillTaxonomy.allowedNativeDevSkills` is the local harness allowlist for `.agents/skills`.

## Implementation Phases

### Phase 0: Plan reviewer

Run `wm-implementation-reviewer` on this plan before implementation.

Reviewer must check:

- scope is correct and not smaller than the user objective;
- repo-local vs pod-native paths are separated correctly;
- validator/eval updates precede skill implementation;
- reviewer checkpoints are sufficient;
- Confluence/live external sync is not required because this is local skill/runtime work, not live publication.

### Phase 1: Validator and eval coverage first

Add or update deterministic coverage before changing skill behavior:

1. `scripts/validate-team-doc.mjs`
   - Require `codex-role-workflow` in pod-native README and skill source.
   - Require `codex-role-workflow` to include runtime shape, role identity resolution, role-to-skill matrix, artifact matrix, reviewer routing, human gate handling, secret safety, external proof limits, output report schema, stop conditions, and validation/eval terms.
   - Replace Mobile Architect SOUL expectation from "no dedicated repo-local skill" to `mobile-architect-workflow`.
2. `scripts/validate-runtime-artifacts.mjs`
   - Add `mobile-architect-workflow` to a dedicated required-skill assertion set.
   - Require `mobile-architect-workflow` terms for ADR, route/state impact, runtime/dependency policy, API co-sign, releaseability/EAS strategy, `02-architecture/*`, reviewers, handoff, and stop conditions.
   - Require new Design drift/baseline eval fixtures.
   - Require Design skills to include selected `DESIGN.md` baseline, same Stitch project continuation, manifest metadata, drift stop conditions, approved fork evidence, official source capture, and prompt template requirements.
   - Require Mobile App Dev and Backend/API plan-packet terms.
3. `evals/local-harness/sot/snapshot.json`
   - Add `mobile-architect-workflow` to `allowedNativeDevSkills`.
   - Remove it from `forbiddenRoleWrapperSkills` because the approved plan now makes it a required repo-local role workflow.
4. `evals/skills/mobile-architect-workflow/`
   - Add at least `positive.prompt.md`, `negative.prompt.md`, and `review-only-negative.prompt.md`.
   - Add role-specific positive prompts for route/state impact and API co-sign if practical.
5. `evals/skills/codex-role-workflow/`
   - Add pod-native role bridge prompt fixtures even though this is not a repo-local `.agents/skills` runtime skill:
     - `positive.prompt.md`: role pod after bootstrap maps a resolved role to allowed repo-local skill, reviewer agents, and artifact stage.
     - `role-mismatch-negative.prompt.md`: role mismatch or unknown role stops with `blocked`.
     - `out-of-role-negative.prompt.md`: requested work outside the resolved role stops or hands off.
     - `human-gate-negative.prompt.md`: human-gated or failed-gate risk stops instead of accepting risk.
     - `secret-safety-negative.prompt.md`: secret/token exposure request stops and reports status only.
5. `evals/skills/design-mobile-design-handoff/` and `evals/skills/design-stitch-mcp-operating-rules/`
   - Add missing-baseline negative, mismatched-project negative, unapproved-drift negative, and approved-fork positive prompts.
6. `evals/skills/mobile-app-dev-workflow/`
   - Add plan-packet and stop-condition fixtures before skill reinforcement:
     - `plan-packet-positive.prompt.md`: accepted task, Design handoff, API fixture, architecture note, first test, selector impact, evidence path, plan reviewer, final reviewer, `04-mobile-app/*`, and diff/status reporting.
     - `missing-design-handoff-negative.prompt.md`: UI work without Design handoff blocks instead of guessing.
     - `missing-contract-negative.prompt.md`: API-backed work without contract/mock/fixture blocks or hands off.
7. `evals/skills/mobile-backend-api-integrator-workflow/`
   - Add contract-plan and stop-condition fixtures before skill reinforcement:
     - `api-contract-plan-packet-positive.prompt.md`: consuming mobile flow, endpoint, zod schema, examples, auth/session/error mapping, fixtures, compatibility, service evidence, plan reviewer, final reviewer, `03-contract-api/*`, and diff/status reporting.
     - `ui-request-negative.prompt.md`: UI implementation request stops and hands off to Mobile App Dev.
     - `migration-human-gate-negative.prompt.md`: migration or irreversible service risk requires approval and rollback/service evidence.
8. `evals/skills/e2e-test/` and `evals/skills/qa-railway-workflow/`
   - Add QA/Release reinforcement fixtures before skill reinforcement:
     - `failed-gate-human-approval-negative.prompt.md` for `e2e-test`: failed-gate risk acceptance requires human/Product routing, not QA self-approval.
     - `final-review-diff-status-positive.prompt.md` for `e2e-test`: evidence plan, canonical evidence path, final reviewer, and diff/status report.
     - `failed-deploy-human-gate-negative.prompt.md` for `qa-railway-workflow`: failed deployment or secret/service risk does not become release approval.
     - `final-review-diff-status-positive.prompt.md` for `qa-railway-workflow`: Railway evidence, RN Web API URL handoff, final reviewer, and diff/status report.

Checkpoint reviewer after Phase 1:

- `wm-implementation-reviewer` checks validator/eval coverage before skill edits are treated as complete.

### Phase 2: Actual skill creation and reinforcement

1. Create pod-native OpenClaw skill:
   - `mobile-app-dev-team/09-pod-native-openclaw-skills/codex-role-workflow/SKILL.md`
   - It is a status/dispatch bridge, not an implementation skill.
   - It resolves role identity, maps to repo-local Codex skills/agents/artifacts, blocks on missing SoT/human gates/out-of-role work/secret risk, and outputs `codex-role-workflow/v1`.
2. Update pod-native README:
   - Add `codex-role-workflow` to current skills.
   - Add it to all six role dependency rows because it is the role-aware bridge after bootstrap.
3. Create repo-local Codex skill:
   - `.agents/skills/mobile-architect-workflow/SKILL.md`
   - It owns architecture planning/ADR/risk notes only; it must not implement app/backend/API/QA work.
4. Update team matrix and Mobile Architect SOUL:
   - Add `mobile-architect-workflow` as active repo-local skill.
   - Replace "no dedicated repo-local skill" language with the new skill.
5. Reinforce existing repo-local skills:
   - Design skills: selected `DESIGN.md` baseline, same Stitch project continuation, official Stitch source capture, prompt templates, manifest metadata, drift blocks, approved fork metadata.
   - Mobile App Dev: concrete `Codex Implementation Plan Packet`, tests-first, `04-mobile-app/*`, final reviewer before Done, diff/status.
   - Backend/API: concrete `Codex API Contract Plan Packet`, `03-contract-api/*`, migrations/rollback/service evidence, final reviewer before Done, diff/status.
   - QA/Release existing skills: reinforce `e2e-test` and `qa-railway-workflow` with role-specific evidence planning, failed-gate/human approval stops, final reviewer before Done, canonical evidence links, and diff/status reporting. Do not create a new `qa-release-readiness-workflow` in this pass.

Checkpoint reviewer after Phase 2:

- `wm-implementation-reviewer` checks the actual skill files and path classification.

### Phase 3: Validation

Run:

```text
pnpm run validate:team-doc
pnpm run test:runtime
pnpm run test:local-harness
pnpm turbo run lint test
```

Record command output under `.evidence/reviews/20260613-codex-cli-role-skill-analysis/`.

### Phase 4: Final reviewer and report

Run final `wm-implementation-reviewer` against:

- approved plan;
- all changed files;
- command output evidence;
- `git diff`;
- `git status --short`;
- explicit scope/non-claim review.

Only report completion after the final reviewer returns `GO` for the latest actual work. If the final reviewer returns `NO_GO`, `BLOCKED`, or `NEEDS_HUMAN`, do not report completion; fix findings, request the required human decision, or report the blocked state according to the reviewer verdict.

## Explicit Non-Goals

- Do not create or modify custom agents unless a reviewer explicitly requires it.
- Do not implement `qa-release-readiness-workflow` in this pass; reinforce the existing `e2e-test` and `qa-railway-workflow` QA/Release skills instead, because the analysis allowed existing QA skill reinforcement as the alternative to a new readiness workflow.
- Do not run live Stitch, Confluence, GitHub merge, EAS, Maestro, Railway, mobile-mcp, or app store operations.
- Do not modify app/API runtime behavior.
- Do not claim local validation proves live pod/OpenClaw behavior.
