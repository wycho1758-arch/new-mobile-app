# Design.md And Codex Plan Reinforcement Update Plan

Date: 2026-06-13
Mode: implementation in progress
Scope: `.evidence/reviews/20260613-codex-cli-role-skill-analysis/**`

## Execution Progress

This section records the implementation status for this plan. It is updated as each phase completes so the work remains auditable against the approved plan.

| Phase | Status | Evidence |
| --- | --- | --- |
| Plan review | PASS | `design-md-and-codex-plan-reinforcement-update-plan-review.json` returned `GO` with findings `0`. |
| Sub-agent sidecar review | PASS | Read-only sub-agents confirmed Design/Stitch continuity and Mobile/Backend packet gaps; their findings were incorporated into Phase 1 edits. |
| Confluence sync decision | PASS | Local SoT says live Confluence publish/update is external platform work requiring explicit page IDs, current versions, diff summary, reviewer evidence, and explicit user approval; this evidence-doc update does not require live Confluence sync. |
| Phase 1 English docs | DONE | Updated `00`, `02`, `04`, `05`, `07`, and `08` English docs. |
| English reviewer | PASS | `english-design-md-plan-packet-update-review.json` returned `GO` with findings `0`. |
| Phase 2 Korean mirrors | DONE | Updated `ko/00`, `ko/02`, `ko/04`, `ko/05`, `ko/07`, and `ko/08` after English reviewer `GO`. |
| Korean reviewer | PASS | `korean-design-md-plan-packet-update-review.json` returned `GO` with findings `0` after validation command parity cleanup. |
| Final validation and reviewer | PASS | Content scan and gates passed; `final-design-md-plan-packet-bilingual-review.json` returned `GO` with findings `0`. Scoped diff/status checked before completion report. |

## User Request

추가 확인 대상:

1. `02-design-codex-use-skill-analysis.md`
   - 사용자가 최초에 `DESIGN.md` 또는 `design.md` 디자인 시스템을 선택하게 해야 한다.
   - 선택된 `DESIGN.md`를 기준으로 Stitch 동일 프로젝트 안에서 확장해야 한다.
   - `DESIGN.md` 일관성이 깨지는 것은 큰 이슈로 취급해야 한다.
   - 이 관점을 반영한 추가 보강 필요성을 냉철하게 판단해야 한다.
2. `04-mobile-app-dev-codex-use-skill-analysis.md`, `05-backend-api-integrator-codex-use-skill-analysis.md`
   - Codex plan으로 항상 SoT 기준의 계획을 수립해야 한다.
   - 계획은 아주 구체적인 요구사항 전달을 포함해야 한다.
   - reviewer 최종 점검 후 보고해야 한다.
   - 실제 개발 완료 후 최종 완료 보고 전에 reviewer를 실행해야 한다.
   - 완료 보고된 내용은 `git diff`로 확인해 보고해야 한다.
   - 이 내용이 모두 포함되어 있는지 SoT 기준으로 추가 점검해야 한다.
3. 그 외 작성된 파일도 같은 기준으로 추가 수정 필요 여부를 검토해야 한다.

## SoT Basis

Local SoT:

- `AGENTS.md`
  - TDD required.
  - Native UI uses NativeWind, React Native primitives, semantic design tokens.
  - `packages/contracts` is the API request/response SoT.
  - PR/workflow gates and evidence requirements apply.
- `.agents/skills/wm/SKILL.md`
  - `$wm` plans must be SoT-grounded.
  - Stay read-only until the initial plan is established.
  - Material planning decisions must route to read-only reviewer/researcher/gate-advisor when practical.
  - Completed implementation plan must be reviewed before implementation starts.
  - Actual completed work must be reviewed against approved plan, `git diff`, command output, and evidence before Done.
  - Before final user completion report, run `git diff` for changed paths and `git status --short`.
- `mobile-app-dev-team/02-role-souls/design-soul.md`
  - Design must handle `DESIGN.md` decisions before final handoff.
  - Stitch-backed artifacts are canonical.
  - Missing `DESIGN.md` decision is an escalation trigger.
  - Do not use non-Stitch design authoring as canonical output.
- `mobile-app-dev-team/05-work-processes.md`
  - Design must confirm `DESIGN.md`, prepare P0, stop for P0 approval, generate exactly two Stitch options, prepare P1, stop for P1 approval, then extract/publish.
  - `$wm` must establish scope, owner, affected paths, tests, evidence path, gate impact, and SoT sources before implementation.
  - `$wm` routes material planning decisions to read-only custom agents when practical.
  - Request read-only reviewer evidence after local checks.
- `mobile-app-dev-team/10-github-artifact-workflow.md`
  - Design owns `01-design/*` and `design-pub-html/<YYYY-MM-DD>/<work-unit-id>/`.
  - Mobile App Dev owns `04-mobile-app/*`; command output must include exit status.
  - Backend/API Integrator owns `03-contract-api/*`.
  - Durable handoff must go through committed GitHub branch/PR or merged repo artifact, not pod-local state.
- `.agents/skills/design-mobile-design-handoff/SKILL.md`
  - Required inputs include current `DESIGN.md`, relevant Stitch link or Stitch project context.
  - It requests `DESIGN.md` decision before Stitch generation.
  - It requires current `DESIGN.md` plus selected design reference.
- `.agents/skills/design-stitch-mcp-operating-rules/SKILL.md`
  - Required sequence loads current `DESIGN.md`, selected design reference, and Stitch project context.
  - It creates or selects a Stitch project and applies design-system context from `DESIGN.md`.
  - Manifest records Stitch project id or share link when available.
  - `DESIGN.md` is the design-system SoT.
- `.agents/skills/mobile-app-dev-workflow/SKILL.md`
  - Current repo-local skill is thin: it requires design/API inputs, tests first, evidence output, but does not explicitly require pre-implementation reviewer, final reviewer before Done, `git diff`, `git status --short`, or `04-mobile-app/*`.
- `.agents/skills/mobile-backend-api-integrator-workflow/SKILL.md`
  - Current repo-local skill is thin: it requires contract boundary and evidence, but does not explicitly require pre-implementation reviewer, final reviewer before Done, `git diff`, `git status --short`, or `03-contract-api/*`.

Official/public Stitch references checked for this plan:

- Google Labs DESIGN.md post: `DESIGN.md` in Stitch lets design rules be exported/imported across projects so Stitch can understand design-system reasoning and generate interfaces matching the brand.
  - Source: https://blog.google/innovation-and-ai/models-and-research/google-labs/stitch-design-md/
  - Evidence in this plan: this URL and its checked claim must be copied into the later Design doc update or a `design-researcher` evidence file.
- Google Codelab for Stitch MCP: instructs creating/naming a Stitch project, verifying project listing through MCP, fetching design metadata, and generating `DESIGN.md`.
  - Source: https://codelabs.developers.google.com/design-to-code-with-antigravity-stitch
  - Evidence in this plan: this URL and its checked claim must be copied into the later Design doc update or a `design-researcher` evidence file.
- Google AI Developers Forum Stitch Prompt Guide: supports high-level start, then screen-by-screen refinement; recommends specific incremental changes and UI/UX terms.
  - Source: https://discuss.ai.google.dev/t/stitch-prompt-guide/83844
  - Evidence in this plan: this URL and its checked claim must be copied into the later Design doc update or a `design-researcher` evidence file.

## Cold Findings

### Finding 1: Design.md consistency is under-specified in `02-design`

Current `02-design-codex-use-skill-analysis.md` already requires:

- read-only planning around `DESIGN.md`, P0/P1, reviewer, and diff/status;
- `current DESIGN.md` in SoT intake;
- prompt template field: `Design-system context: use current DESIGN.md and selected approved reference`;
- stop on unresolved `DESIGN.md`.

However, this is still not enough for the user's concern.

Missing or weak:

- No explicit user-facing first step requiring the user to choose/approve the initial design system or `DESIGN.md`.
- No explicit statement that the chosen `DESIGN.md` becomes the design-system baseline for the work unit or product surface.
- No explicit requirement that new Stitch screens must extend the same Stitch project when the work is a continuation of an existing design.
- No explicit rule that switching Stitch project, replacing `DESIGN.md`, changing design tokens, or generating off-system screens is a high-risk/blocking inconsistency.
- No manifest-level requirement to record `design_system_baseline`, `design_md_source`, `design_md_hash_or_version`, `stitch_project_id/share_link`, and whether the generation extended or forked the project.
- No eval recommendation for `DESIGN.md` drift or cross-project continuation failure.

Judgement: **보강 필요.** This is not cosmetic. For Design, losing `DESIGN.md` or Stitch project continuity breaks the implementation handoff SoT and can cause Mobile App Dev to implement a visually inconsistent product.

### Finding 2: `04-mobile-app-dev` analysis contains the requested Codex process, but the concrete requirement-transfer wording can be stronger

Current `04-mobile-app-dev-codex-use-skill-analysis.md` already includes:

- read-only pre-checks before implementation;
- implementation plan with affected paths, first test/eval/fixture/validator, selector impact, contract impact, evidence path, gates, reviewer target;
- plan review by `wm-implementation-reviewer` and `wm-contract-reviewer` when API-backed;
- reviewed plan report before implementation;
- tests-first execution;
- final reviewer verification against approved plan, diff, commands, and `04-mobile-app/*`;
- `git diff` and `git status --short` before report.

Missing or weak:

- The analysis can explicitly call this a **Codex implementation plan packet** and require it to be concrete enough for another isolated pod to execute without guessing.
- It should enumerate the "very concrete requirement transfer" fields: accepted task id, exact route/screen, design handoff path, selected option, state matrix lines, API contract path/version, fixtures, selector/testID changes, non-goals, verification commands, evidence path, reviewer output path.
- It should explicitly say final completion report must not be sent until final reviewer GO/acceptable verdict has reviewed actual diff/commands/evidence.
- It should mention that the actual repo-local `.agents/skills/mobile-app-dev-workflow/SKILL.md` is thinner than the analysis and should be reinforced in a later implementation step.

Judgement: **분석 문서에는 대부분 포함되어 있으나, 실사용 skill 보강 계획으로는 더 구체화 필요.**

### Finding 3: `05-backend-api-integrator` analysis contains the requested Codex process, but contract-plan concreteness can be stronger

Current `05-backend-api-integrator-codex-use-skill-analysis.md` already includes:

- read-only classification and SoT intake;
- API plan covering endpoint/schema/auth/session/error/mocks/fixtures/migration/runtime-smoke/rollback/evidence;
- `wm-contract-reviewer` plan review before editing;
- final reviewer verification for `packages/contracts`, duplicate type avoidance, and `03-contract-api/*`;
- `git diff` and `git status --short` before report.

Missing or weak:

- The analysis can explicitly call this a **Codex API contract plan packet**.
- It should require "very concrete requirement transfer" fields: consuming mobile flow, endpoint/method, zod schema names, request/response examples, error mapping, auth/session state, mocks/fixtures, backward compatibility, migration/rollback, service evidence, verification commands, reviewer output path.
- It should explicitly block final completion report until final reviewer checks actual diff/commands/evidence.
- It should mention that the actual repo-local `.agents/skills/mobile-backend-api-integrator-workflow/SKILL.md` is thinner than the analysis and should be reinforced in a later implementation step.

Judgement: **분석 문서에는 대부분 포함되어 있으나, 실제 skill로 이식하기에는 요구사항 전달 packet을 더 명확히 해야 함.**

### Finding 4: Cross-role and reviewer files should be updated for Design.md continuity

Files likely needing additional wording:

- `07-cross-role-skill-agent-implementation-recommendation.md`
  - Add Design-specific implementation requirement for `DESIGN.md` baseline selection, same Stitch project continuation, manifest metadata, and drift eval.
- `08-reviewer-checklist-and-final-verdict.md`
  - Add reviewer checklist item: Design/Stitch docs must prove selected `DESIGN.md` baseline and same-project continuation or explicitly block/fork with approval.
- Korean mirror files under `ko/`
  - If English updates later pass review, update Korean mirrors so the user can understand the same risk and process.

Judgement: **보강 필요.** The package currently treats Stitch prompt quality and P0/P1 gates well, but does not yet make design-system continuity a package-wide reviewer criterion.

## Proposed Update Plan

### Phase 1: English analysis docs update

Update English docs first only after this plan receives reviewer GO.

#### 1. Update `02-design-codex-use-skill-analysis.md`

Add a new subsection under `Stitch Official-Docs And Prompt Contract`:

```text
DESIGN.md Baseline And Same-Project Continuity Contract
```

Required content:

- Before any Stitch generation, ask the user/Product/Planning to choose or approve the design-system baseline:
  - existing repo `DESIGN.md`;
  - imported/generated Stitch `DESIGN.md`;
  - blocked until `UPDATE_DESIGN_MD_REQUIRED` is approved.
- Record the selected baseline as the work-unit design-system SoT.
- For continuation work, use the same Stitch project/project id/share link as the existing approved design unless a reviewer-approved fork is explicitly recorded.
- Treat design-system drift as high risk:
  - changed tokens without approval;
  - generation in a different Stitch project without approved fork reason;
  - prompt contradicting `DESIGN.md`;
  - output styles not traceable to `DESIGN.md`;
  - missing manifest baseline metadata.
- Add stop conditions:
  - no selected `DESIGN.md`;
  - baseline `DESIGN.md` conflicts with selected Stitch project;
  - same-project continuation impossible and no approved fork;
  - Design reviewer flags drift.
- Add manifest/handoff metadata requirements:
  - `design_system_baseline`;
  - `design_md_source_path_or_url`;
  - `design_md_hash_or_version` when practical;
  - `stitch_project_id_or_share_link`;
  - `extends_existing_project: true|false`;
  - `fork_reason`;
  - `drift_check_result`;
  - `design_reviewer_verdict_path`.
- Add prompt template field:
  - `Design-system baseline: extend the approved DESIGN.md and same Stitch project; do not change visual tokens, typography, spacing, component shape language, or brand tone unless the plan explicitly includes an approved design-system update.`
- Add acceptance/eval requirements for:
  - missing `DESIGN.md` baseline stop;
  - mismatched Stitch project stop;
  - unapproved token/theme drift stop;
  - approved fork path records fork reason and reviewer evidence.

#### 2. Update `00-index-and-executive-verdict.md`

Update package-level Design summary so it does not understate the new risk.

Required content:

- In the Role Coverage Matrix, change Design from "existing skills may need minor handoff wording only" to a stronger statement:
  - existing Design skills are strong but must be reinforced for `DESIGN.md` baseline selection, same Stitch project continuation, manifest metadata, and drift blocking.
- In Recommended Implementation Priority, add Design.md/Stitch continuity reinforcement as an explicit item before or alongside existing Design skill reinforcement.
- Add one sentence near the Primary Gap or Mandatory Codex Operating Contract:
  - For Design, the selected `DESIGN.md` baseline and same Stitch project are part of the Design SoT; unapproved drift must block handoff.

#### 3. Update `04-mobile-app-dev-codex-use-skill-analysis.md`

Add a short subsection under `Role-Specific Codex Operating Reinforcement`:

```text
Codex Implementation Plan Packet
```

Required content:

- Plan must be concrete enough for another isolated pod to implement without guessing.
- Required fields:
  - accepted task/work-unit id;
  - exact route/screen/component;
  - design handoff path and selected Design option;
  - relevant state matrix entries;
  - API contract/mock/fixture path;
  - architecture note path if route/runtime/state impact exists;
  - test/eval/fixture to add first;
  - selector/testID impact;
  - non-goals and stop conditions;
  - verification commands;
  - evidence path;
  - plan reviewer output path;
  - final reviewer output path.
- Explicitly state:
  - no code edit before reviewed plan report;
  - no final completion report before final reviewer checks actual diff/commands/evidence;
  - completion report must summarize `git diff` and `git status --short`.
- Add note that actual `.agents/skills/mobile-app-dev-workflow/SKILL.md` needs later reinforcement because it currently lacks the full reviewer/diff/`04-mobile-app/*` contract.

#### 4. Update `05-backend-api-integrator-codex-use-skill-analysis.md`

Add a short subsection under `Role-Specific Codex Operating Reinforcement`:

```text
Codex API Contract Plan Packet
```

Required content:

- Plan must be concrete enough for Mobile App Dev and QA/Release to consume without guessing.
- Required fields:
  - work-unit id and consuming mobile flow;
  - work type classification;
  - endpoint/method/path;
  - zod schema names in `packages/contracts`;
  - request/response examples;
  - auth/session/error mapping;
  - mocks/fixtures and fixture ownership;
  - compatibility/breaking-change assessment;
  - migration/rollback/service evidence if scoped;
  - verification commands;
  - evidence path;
  - plan reviewer output path;
  - final reviewer output path.
- Explicitly state:
  - no contract/API edit before reviewed plan report;
  - no final completion report before final reviewer checks actual diff/commands/evidence;
  - completion report must summarize `git diff` and `git status --short`.
- Add note that actual `.agents/skills/mobile-backend-api-integrator-workflow/SKILL.md` needs later reinforcement because it currently lacks the full reviewer/diff/`03-contract-api/*` contract.

#### 5. Update `07-cross-role-skill-agent-implementation-recommendation.md`

Add Design.md continuity to cross-role implementation recommendations:

- `codex-role-workflow` must route Design work through selected `DESIGN.md` baseline and same Stitch project.
- `design-mobile-design-handoff` and `design-stitch-mcp-operating-rules` reinforcement must include manifest metadata and drift evals.
- `mobile-app-dev-workflow` and `mobile-backend-api-integrator-workflow` reinforcement should be promoted from generic wording to concrete plan packet requirements.

#### 6. Update `08-reviewer-checklist-and-final-verdict.md`

Add reviewer checks:

- Design/Stitch review must verify selected `DESIGN.md` baseline, source/hash/version, same Stitch project/project id/share link, and drift check.
- Reviewer must fail/NO_GO on unapproved Design.md drift, unapproved Stitch project fork, missing manifest baseline metadata, or prompt contradiction of `DESIGN.md`.
- Mobile App Dev and Backend/API reviewer checks must require concrete Codex plan packet, final reviewer before Done, and diff/status report.

### Phase 2: Korean mirror update

After English docs are updated and English reviewer returns GO:

- Update Korean mirrors:
  - `ko/00-index-and-executive-verdict.ko.md`
  - `ko/02-design-codex-use-skill-analysis.ko.md`
  - `ko/04-mobile-app-dev-codex-use-skill-analysis.ko.md`
  - `ko/05-backend-api-integrator-codex-use-skill-analysis.ko.md`
  - `ko/07-cross-role-skill-agent-implementation-recommendation.ko.md`
  - `ko/08-reviewer-checklist-and-final-verdict.ko.md`
- Korean text must preserve the same meaning, especially:
  - 최초 `DESIGN.md` 선택/승인;
  - 같은 Stitch 프로젝트에서 확장;
  - 디자인 시스템 drift는 high-risk/blocking issue;
  - Codex plan packet의 구체 필드;
  - 최종 reviewer 전 완료 보고 금지;
  - `git diff`/`git status --short` 보고.

### Phase 3: Validation and review

Before final report after implementation:

1. Run content scans:
   - `rg -n "DESIGN.md Baseline|same Stitch project|design_system_baseline|drift|Codex Implementation Plan Packet|Codex API Contract Plan Packet|final reviewer|git diff|git status" .evidence/reviews/20260613-codex-cli-role-skill-analysis`
2. Run evidence/doc gates:
   - `pnpm run validate:evidence-hygiene`
   - `pnpm run test:runtime`
   - `pnpm turbo run lint test`
3. Run final reviewer:
   - `wm-implementation-reviewer` or `design-reviewer` depending on scope split.
   - Recommended: use `wm-implementation-reviewer` for package-wide final review and explicitly ask it to check Design.md continuity and 04/05 Codex plan packet adequacy.
4. Run scoped `git diff` and `git status --short`.
5. Report:
   - changed files;
   - reviewer verdict;
   - command results;
   - diff/status summary;
   - residual risk.

## Explicit Non-Goals

- Do not run Stitch generation in this update.
- Do not modify live Stitch projects or external platform configuration.
- Do not claim local docs prove actual Stitch project continuity.
- Do not implement the actual repo-local skill changes in this planning-only step.
- Do not edit app/API runtime code.

## Risk Classification

- Design.md baseline and same-project continuity: **High**. Drift can invalidate downstream implementation handoff.
- Mobile App Dev Codex plan packet wording: **Medium**. Analysis currently contains most requirements, but stricter packet wording improves pod handoff and reviewer enforceability.
- Backend/API Codex plan packet wording: **Medium**. Analysis currently contains most requirements, but stricter packet wording reduces contract ambiguity.
- Cross-role/reviewer checklist updates: **Medium**. Needed so future reviewers fail drift or insufficient plan packets consistently.

## Reviewer Request

Ask reviewer to verify:

1. Whether this plan correctly identifies that Design.md/same Stitch project continuity is a real gap in `02-design`.
2. Whether 04/05 already contain the core Codex planning/reviewer/diff process and whether the proposed packet-level reinforcement is justified.
3. Whether cross-role/reviewer docs must be updated.
4. Whether the plan is SoT-grounded and sufficiently detailed to execute later.
