---
pageId: "1374453802"
sourceTitle: "2026-06-07 Stage 1 - Confluence Corpus and SoT Map"
sourceVersion: "unknown"
sourceUrl: "https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1374453802"
fetchedAt: "2026-06-09T03:41:15.000Z"
syncStatus: "synced"
---

# Stage 1 - Confluence Corpus and SoT Map

| 항목 | 내용 |
| --- | --- |
| Stage | STAGE 1: Confluence Corpus and SoT Map |
| Plan | docs/plans/active/20260607-mobile-soul-main-agent-depth-audit-plan.md |
| Local report | docs/reports/mobile-soul-audit/01-confluence-corpus-sot-map.md |
| Status | <custom data-type="status" data-id="id-0">Reviewer LGTM</custom> |
| Reviewer | LGTM / QA PASS / unresolved issues 없음 |
| 성격 | 비규범 감사 기록. SOUL.md, skill, workflow, runtime policy를 변경하지 않음. |

## Live Inventory Result

| 항목 | 값 |
| --- | --- |
| Confluence CQL | `space = "mobileappd" AND type = page ORDER BY title ASC` |
| Observed current page count | 60 |
| 2026-06-07 baseline count | 60 |
| Delta | 0 |
| Root page | mobile-app-dev-team (1373012374) |
| Root descendants | 59 current pages |
| Excluded non-page folders | 환경구축 (1372356612), 조사자료 (1373110273) |

## Classification Count Check

| Category | Count |
| --- | --- |
| Meta standard | 6 |
| Mobile instance | 8 |
| Role SOUL | 6 |
| Skill / Runtime | 10 |
| Runtime aid | 21 |
| Evidence / Template | 6 |
| Template / Noise | 3 |
| Other | 0 |
| Total current pages | 60 |

## Corpus Families

### Meta standard

* mobile-app-dev-team (1373012374)
* \[00\] LLM 조직 구성 표준 프로세스 (1373667330)
* 00-1. 원칙과 제약 (1373601794)
* 00-2. 조직 설계 절차 (1373601815)
* 00-3. 산출물 표준 (1373765641)
* 00-4. 가설·결정 레지스트리 (1373798401)

### Mobile instance

* \[01\] Mobile App 조직 (1373700097)
* 01-1. 방향과 제약 (1373700117)
* 01-2. 조직 구성과 역할 (1373765682)
* 01-3. Workflows — Case A\~H (1373667425)
* 01-4. Skills (1373667362)
* 01-5. SOUL.md 템플릿 (1373700138)
* 01-6. 개발 지침 (root AGENTS.md 확장안) (1373634583)
* 01-7. 진행 계획과 상태 (1373700222)

### Role SOUL

* SOUL.md — Product/Planning (1373798422)
* SOUL.md — Design (1373765702)
* SOUL.md — Mobile Architect (1373667383)
* SOUL.md — Mobile App Dev (1373700159)
* SOUL.md — Backend/API Integrator (1373700180)
* SOUL.md — QA/Release (1373700201)

### Skill / Runtime

* mobile-prd-to-execution (1373634562)
* mobile-design-handoff (1373765661)
* mobile-api-contract (1373765723)
* mobile-qa-release (1373667404)
* mobile-gatekeeper (1373798443)
* Role-specific Codex Runtime (1374289964)
* Skills (1374290005)
* mobile-app-dev-workflow (1374060668)
* mobile-backend-api-integrator-workflow (1374388227)
* mobile-project-bootstrap-workflow (1374421001)

### Runtime aid

* Runtime Path Decision (1374289985)
* codex-cli-native-runtime-paths (1374355481)
* openclaw-generated-agent-runtime-paths (1374191661)
* boram-pod-runtime-evidence (1374191681)
* Agents (1374290025)
* mobile-contract-reviewer (1374355501)
* mobile-implementation-reviewer (1374388247)
* mobile-docs-researcher (1374388267)
* mobile-gate-fix-advisor (1374060688)
* Hooks (1374060648)
* mobile-pretool-policy-hook (1374290046)
* mobile-posttool-evidence-reminder-hook (1374388296)
* mobile-stop-gatekeeper-advisory-hook (1374355521)
* mobile-subagent-context-hook (1374060708)
* Runtime Evaluation and CI Gate (1374355541)
* skill-evaluation-and-ci-gate (1374060728)
* agent-evaluation-and-ci-gate (1374060748)
* hook-evaluation-and-ci-gate (1374355561)
* Optional Subagents and LazyCodex Pattern Reuse (1374290066)
* Rollout Blocker and Resume Conditions (1374355583)
* Rollout PR Evidence (1374355605)

### Evidence / Template

* ClawPod용 Expo + EAS 통합 스타터/보일러플레이트 조사 보고서 (1372815381)
* 01-8. ClawPod Agent용 기본 모바일 앱 프로젝트 템플릿 repo 구성 설계안 (1371963427)
* ClawPod Agent 모바일 템플릿 온라인 서비스 사전 등록 가이드 (1372422154)
* 01-9. 검증 근거·감사 기록 (1373667446)
* 01-3 정합성 조사 검증 근거 (2026-06-06) (1374060594)
* 01-8 템플릿 repo 구현 검증 근거 (2026-06-07) (1374355642)

### Template / Noise

* 템플릿 - 프로젝트 계획 (1373012392)
* 템플릿 - 의사 결정 문서 (1373012405)
* 템플릿 - 미팅 메모 (1373012418)

## Guardrails for Later Stages

* Confluence에 명시된 사실을 우선한다. 없는 내용은 SoT gap으로 기록한다.
* 생성된 agents는 rooms, Tasks, workspace, target work repo에서만 일하며 openclaw-cloud platform source/runtime을 수정하지 않는다.
* 선택적 인프라, 검증되지 않은 자동화, schema/tool 변경은 dry-run 반복 근거 전까지 제안하지 않는다.
* SOUL.md는 9섹션 구조로 감사한다: Identity, System Boundary, Tooling, Source of Truth, Communication Protocol, Handoff Contract, Gate Rules, Human Gate, Non-goals.
* 새 skill 또는 update skill은 반복 가능한 workflow, 구체 입력/출력, 00-3 skill 표준, human/deterministic gate 비우회를 만족할 때만 후보로 남긴다.
* Gatekeeper는 SOUL.md role이 아니며 deterministic predicate/evidence check로만 취급한다.

## Stage 1 Acceptance

| Requirement | Status |
| --- | --- |
| Live current page inventory recorded | PASS |
| Baseline delta recorded | PASS |
| Future stage minimum page sets specified in local report | PASS |
| Template/noise pages classified and excluded with reason | PASS |
| SoT gaps recorded without guessing | PASS |
| No new workflow/role/skill proposed | PASS |

## SoT Gaps

* Complete version/lastModified metadata for every page was not exposed cleanly in connector responses. The local report records missing metadata as SoT gap, not inference.
* The generic Confluence decision template is not treated as decision registry. 00-4. 가설·결정 레지스트리 is the registry page identified for this audit.
