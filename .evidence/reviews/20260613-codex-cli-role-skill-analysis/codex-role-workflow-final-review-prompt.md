# Final Review Prompt: Codex Role Workflow Actual Skill Implementation

You are `wm-implementation-reviewer` performing the final xhigh review for the actual Codex role workflow skill implementation.

Use the repository SoT only. Do not approve based on intent. Review actual files, validators, evals, command evidence, and git status/diff.

## Required SoT

- `AGENTS.md`
- `REPO_OPERATIONS.md`
- `PROJECT_ENVIRONMENT.md`
- `.agents/skills/wm/SKILL.md`
- `mobile-app-dev-team/04-skills-and-agents-matrix.md`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/README.md`
- `mobile-app-dev-team/02-role-souls/*.md`

## Required Evidence

- Approved plan: `.evidence/reviews/20260613-codex-cli-role-skill-analysis/codex-role-workflow-actual-skill-implementation-plan.md`
- Plan reviewer: `.evidence/reviews/20260613-codex-cli-role-skill-analysis/codex-role-workflow-actual-skill-implementation-plan-review.json`
- Phase 1 reviewer: `.evidence/reviews/20260613-codex-cli-role-skill-analysis/codex-role-workflow-phase1-validator-eval-review.json`
- Phase 2 reviewer: `.evidence/reviews/20260613-codex-cli-role-skill-analysis/codex-role-workflow-phase2-skill-implementation-review.json`
- Phase 3 validation: `.evidence/reviews/20260613-codex-cli-role-skill-analysis/codex-role-workflow-actual-skill-verification.md`

## Must Verify

1. The actual applied skill paths are correct:
   - repo-local Codex skill: `.agents/skills/mobile-architect-workflow/SKILL.md`
   - pod-native OpenClaw skill source: `mobile-app-dev-team/09-pod-native-openclaw-skills/codex-role-workflow/SKILL.md`
   - documented pod runtime shape: `/workspace/skills/codex-role-workflow/SKILL.md`
2. Existing role skills were reinforced where required:
   - `.agents/skills/design-mobile-design-handoff/SKILL.md`
   - `.agents/skills/design-stitch-mcp-operating-rules/SKILL.md`
   - `.agents/skills/mobile-app-dev-workflow/SKILL.md`
   - `.agents/skills/mobile-backend-api-integrator-workflow/SKILL.md`
   - `.agents/skills/e2e-test/SKILL.md`
   - `.agents/skills/qa-railway-workflow/SKILL.md`
3. Validators and eval fixtures cover the new/reinforced behavior before final approval.
4. Design workflow preserves selected `DESIGN.md` baseline and same Stitch project continuity unless an approved fork is documented.
5. Mobile App Dev and Backend/API skills require concrete SoT plan packets, plan reviewer, final reviewer, and git diff/status reporting.
6. Backend/API review-only routing uses `wm-contract-reviewer`, not legacy `mobile-contract-reviewer`.
7. QA/Release skills stop on failed gates without human approval and require final reviewer before Done.
8. Phase 3 commands passed:
   - `pnpm run validate:team-doc`
   - `pnpm run test:runtime`
   - `pnpm run test:local-harness`
   - `pnpm turbo run lint test`
9. Current `git diff --stat`, `git diff --name-status`, and `git status --short --branch` are consistent with the stated scope. Flag unrelated/pre-existing dirty files if they affect final report clarity.

Return JSON with:

- `verdict`: `GO` or `NO_GO`
- `findings`: ordered by severity
- `checks_reviewed`
- `residual_risks`
- `next_action`

NO_GO if any required applied skill path is missing, if validators pass without covering the new behavior, if reviewer routing conflicts with `$wm` SoT, if Phase 3 validation is not exit 0, or if final report would misstate committed/merged status.

Envelope validation constraints:

- Every `source_refs` entry must be an actual local `path:line` string.
- Use `.evidence/reviews/20260613-codex-cli-role-skill-analysis/codex-role-workflow-diff-status-scope.md` for diff/status scope findings instead of citing raw command output as a source ref.
- Finding `owner` must be exactly one of: `Product/Planning`, `Design`, `Mobile Architect`, `Mobile App Dev`, `Backend/API Integrator`, `QA/Release`, or `human`.

Runtime-shape review constraint:

- Do not require a physical `/workspace/skills/codex-role-workflow/SKILL.md` file in this local repository review. `AGENTS.md` and `REPO_OPERATIONS.md` define `/workspace/skills/<slug>/SKILL.md` as the pod runtime shape, while the repo-authored source artifact lives under `mobile-app-dev-team/09-pod-native-openclaw-skills/<slug>/`.
- Treat `test -f /workspace/skills/codex-role-workflow/SKILL.md` as source-backed `NOT_APPLICABLE` unless the user explicitly requested live pod packaging or the approved plan included external `/workspace` deployment.
- Do not create or require external runtime files under `/workspace` as part of this local repo implementation review.
