# Final planning review request — entry-point case taxonomy (v2, corrected)

You are `po-planning-reviewer`. Verify the CORRECTED report claim set below against the repo SoT and emit exactly one machine-readable verdict envelope at the end. This v2 incorporates the prior review's single MEDIUM finding (P-4 over-classified as fully absent). Confirm the P-4 correction is now accurate and check that no claim is stated as SoT-grounded beyond what the files literally support. Operate read-only.

## Context
A prior review (`.evidence/reviews/20260614-entry-case-sot-review-xhigh.md`) returned NO_GO with one MEDIUM finding: P-4 (app/EAS/OTA rollback) must not be classified as fully absent because rollback governance is partially defined. This v2 fixes that and reframes the user's 5 input cases as a report-derived taxonomy rather than SoT-named cases.

## Corrected claims to verify

### Common entry point
- All user input enters Product/Planning (CPO) intake first, then branches unclear→office-hours / broad→work-unit-sizing / ready→prd-to-execution / pre-exec→completeness-review. Source: `.agents/skills/po-work-unit-planning-and-agent-sprint/SKILL.md:8`; `mobile-app-dev-team/05-work-processes.md:3-12`.

### The user's 5 cases = REPORT-DERIVED taxonomy (not SoT-named)
SoT names these input categories: modification request, issue/bug/failure request, direct implementation language, proactive report, plus broad/ready/unclear PRD routing. The labels "PRD 전달 / 추가 요청 / 오류·버그 / 신규기능(화면 유무)" are the report's own grouping mapped onto SoT categories.
- C1 PRD: ready+bounded→po-prd-to-execution; broad→work-unit sizing first. `po-work-unit-planning...SKILL.md:29`.
- C2 additional text request = modification request → within-approved-scope / scope-change / human-gate / non-goal. `...SKILL.md:31`.
- C3 error/bug text = issue/bug/failure request → bug-fix / failure-rework / release-evidence-gap / human-gate / symptom-without-evidence; bug-fix adds narrowest failing test first. `...SKILL.md:32`; `05-work-processes.md:40`.
- C4 new feature WITH screen: Design §2 (DESIGN.md decision → P0 gate → 2 Stitch options → P1 gate → extraction → design-reviewer). DESIGN TRIGGER is "layout/interaction/visual-hierarchy matters", NOT literally "has a screen". `design-mobile-design-handoff/SKILL.md:35`.
- C5 new feature WITHOUT screen (CORRECTED v3): Design is typically not triggered (no layout/interaction/visual-hierarchy). Routing is RELEVANCE-BASED, NOT a fixed path: Mobile Architect only when architecture/runtime/route-state/API/releaseability risk exists (`05-work-processes.md:10`); Backend/API only when an API-backed task or contract uncertainty exists (`05-work-processes.md:28`); Implementation always proceeds through the relevant owning operating role (`05-work-processes.md:35,41`). Completeness-review builds the role matrix with "relevant roles" only (`po-planning-completeness-review/SKILL.md:28-29,35`). SoT defines NO explicit Design NOT_APPLICABLE state; design relevance is an inference, flagged as gap P-1.
- C6 work-unit decision enum: PRODUCT_GOAL/MVP_INCREMENT/AGENT_SPRINT/VERTICAL_SLICE/STORY_WORK_ITEM/EXECUTION_TASK/ONE_DAY_STEP. `...SKILL.md:43`.

### Expanded SoT-backed routing (E1-E16) — unchanged, all cited previously
E1 contract-only→§3; E2 backend service→§3.4 (migration/deploy/smoke/rollback note/service evidence); E3 architecture→Mobile Architect ADR/route-state/EAS; E4 design-system→DESIGN.md decision states; E5 refactor→modification-request+tests/reviewer; E6 QA/E2E→evidence ladder L0-L3; E7 release/store→production-submit human gate (Railway cannot prove store/production/native); E8 gate failure→failure loop, attempt>=3 retry-exhausted; E9 human-gate 8 categories; E10 OUT_OF_SCOPE/NON_GOAL; E11 NEEDS_USER_CLARIFICATION; E12 AGENT_SPRINT; E13 direct-impl needs accepted packet+READY_FOR_EXECUTION; E14 proactive triage 6 states, no auto-exec; E15 RUNTIME_CAPABILITY_BLOCKED; E16 docs/plans/work-units/<id>/ durable handoff.

### Risks R1-R10 — unchanged, all cited previously (chat not SoT; no self-implement; no human-gate bypass; no ad-hoc contracts; evidence-backed done; RN Web not native proof; silence not approval; no prediction; status.json role-mismatch/retry-exhausted; no external repo edits).

### Gaps (corrected)
- P-1 Design relevance/NOT_APPLICABLE rule not formally defined. ABSENT.
- P-2 cross-work-unit prioritization/conflict not defined. ABSENT.
- P-3 emergency production hotfix fast-path not defined (production-submit always needs human gate). ABSENT.
- **P-4 (CORRECTED) app/EAS/OTA rollback = PARTIALLY DEFINED, procedure incomplete — NOT absent.** Defined parts: live-readiness approval envelope requires `rollback_owner` + `rollback_plan` (`15-human-ops-live-readiness-annex.md:47-48`); external rollback owned by approving human/ops owner (`15-...:134`); backend rollback-note artifact (`10-github-artifact-workflow.md:195`, `05-work-processes.md:31`); NativeWind v5 explicit rollback criteria (`PROJECT_ENVIRONMENT.md:104-106`). Residual gap = complete app/EAS/OTA rollback runbook: concrete procedure, owner flow, EAS Update channel rollback, store rollback/mitigation, QA evidence.

## Required output
End with exactly one fenced ```json reviewer verdict envelope (verdict/reviewer/mode/scope/findings/checks_reviewed/residual_risks/next_action). reviewer must equal po-planning-reviewer. mode=final. Read-only review so lint/test/runtime/local-harness are NOT_APPLICABLE.
