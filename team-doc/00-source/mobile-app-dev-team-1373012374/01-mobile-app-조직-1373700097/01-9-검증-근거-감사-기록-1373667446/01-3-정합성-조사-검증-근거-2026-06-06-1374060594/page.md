---
pageId: "1374060594"
sourceTitle: "01-3 정합성 조사 검증 근거 (2026-06-06)"
sourceVersion: "unknown"
sourceUrl: "https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1374060594"
fetchedAt: "2026-06-09T03:41:15.000Z"
syncStatus: "synced"
---

| 항목 | 내용 |
| --- | --- |
| 목적 | [SOUL.md](http://SOUL.md) 표준화(01-5 v3 체계) 이후 수행한 01-3 Case A\~H 정합성 조사의 검증 근거를 보존한다. 규범 페이지가 아닌 근거 저장소다. |
| Upstream | 없음 (감사 기록) |
| Downstream | 01-3 v2, 01-4 하위 skill 페이지(qa-release v2·gatekeeper v3·design-handoff v2), 01-5 하위 SOUL 4페이지, 01-7 v2 (근거 참조) |
| 관련 DEC-ID | 해당 없음 (근거 원문 — 모든 반영은 기존 DEC-005/007/009와 SOUL 조항의 명시화, DEC 신설 없음) |
| 출처 | 로컬 조사 산출물 `.claude/docs/mobileappd-workflow/` (case-soul-matrix, bootstrap-gaps, skills-case-mapping, gap-report-and-01-3-amendment) |

## 1. 조사 목적과 범위

2026-06-06 [SOUL.md](http://SOUL.md) 7종(공통 base + 6역할)이 admin-portal Soul Builder 표준 8섹션 형식으로 표준화된 후, 그 이전에 작성된 01-3 Case A\~H(v1)가 표준화된 SOUL.md와 정합한지 3-track으로 재검증했다.

| Track | 대상 | 산출 |
| --- | --- | --- |
| A | Case 8건 × [SOUL.md](http://SOUL.md) 7종 (Responsibilities / Decision Making / Boundaries 항목 단위 대조) | 4분류 정합성 매트릭스 |
| B | admin-portal 조직 생성 flow ↔ Case A bootstrap 사이 체인 (코드 SoT 기준) | 미정의 구간(bootstrap gap) 목록 |
| C | 01-4 skill 5종 × Case 8건 (01-3 절차 ↔ 01-4 배치 매트릭스 ↔ skill 명세 3자 대조) | 매핑 검증 + 모순 목록 |

## 2. 검증 방법

* 멀티에이전트 병렬 조사(22 agents): Case 8건 병렬 조사 + Case별 1:1 적대 검증(인용 실재성·판정 타당성·누락·역방향 점검, fix loop 포함), Track B/C 별도 조사 + 통합 적대 검증.
* 모든 판정은 SoT 인용 필수 — [SOUL.md](http://SOUL.md) 원문(EN 실사용본), 01-3/01-4/01-7/01-8 원문, openclaw-cloud 코드(파일:라인). 추정 기반 주장은 검증 단계에서 reject.
* 독립 최종 reviewer 게이트(effort xhigh): 인용 실재성 샘플링(문서당 5건 이상, verbatim 대조), "일치" 판정 보수성 재검증(의심 사례 4건), diff 변경 전 블록의 01-3 원문 일치 검증, 산출물 경계(코드/Confluence 무변경) 확인 — 최종 LGTM, 미해결 0건.
* 반영 계획에 대한 2차 reviewer 게이트(effort high): 갭→페이지 매핑 정확성, 문서 체계 적합성, SOUL 구조 보존, 실행 안전장치, overspec 점검 — 지적 2건(MEDIUM) 해결 후 LGTM.

## 3. 정합성 매트릭스 총괄 (Track A)

| 판정 | 건수 | 의미 |
| --- | --- | --- |
| 일치 | 119 | 01-3 항목이 [SOUL.md](http://SOUL.md) 조항과 부합 |
| 모순 | **0** | SOUL이 금지·배치한 행위를 01-3이 요구하는 경우 — 없음 |
| SOUL\_미언급 | 9 | 01-3이 역할에 요구하나 해당 [SOUL.md](http://SOUL.md)(base 포함)에 근거 조항 없음 (대부분 bootstrap 인프라 소유권 공백) |
| 01-3\_미언급 | 27 | SOUL.md가 소유 선언한 책임/산출물이 01-3에 미반영 |

핵심 결론: 01-3과 [SOUL.md](http://SOUL.md) 7종은 충돌하지 않으며, 조치 필요는 전부 "누락" 유형이다. Case 8건 전부 적대 검증 통과.

## 4. 갭 종합 (GAP-01\~17)

| GAP | 내용 요약 | 심각도 | 해소 위치 |
| --- | --- | --- | --- |
| 01 | skill pack 설치 주체·트리거 미정의 (`createAgentFull`에 설치 단계 없음, install API는 SA/TA 전용) | HIGH | 01-7 v2 Phase 3 bootstrap 표 + qa-release v2 주석 |
| 02 | 신규 mobile repo 생성 + workspace 연결 미정의 | HIGH | 01-7 v2 Phase 3 bootstrap 표 (01-8 §11 결정 연계) |
| 03 | GitHub required check 등록 주체 미정의 (repo admin — agent 표면 밖) | HIGH | 01-7 v2 + 01-3 v2 Case A 완료 주석 |
| 04 | EXPO_TOKEN 등 외부 자격증명 Secret 주입 경로 미정의 | HIGH | 01-7 v2 (01-8 §8 연계) |
| 05 | `.evidence/README.md`·gatekeeper 레이어 준비 owner 부재 | HIGH | 01-3 v2 Case A 절차(3) + 01-7 v2 |
| 06 | Case A 템플릿 변수 입력 주체 불명 (P/P SOUL 근거 없음) | MEDIUM | 01-3 v2 Case A 절차(1) |
| 07 | Case D에 BAI 안전성 검증(auth/token/tenant/payment) 누락 | MEDIUM | 01-3 v2 Case D 완료 + Case E escalation 절차 |
| 08 | Case E·G·H에 gatekeeper/author≠approver 게이트 미명시 | MEDIUM | 01-3 v2 각 완료 조건 |
| 09 | gatekeeper "주 사용 agent" 4종 vs SOUL 전 역할 의무 정의 불일치 | MEDIUM | mobile-gatekeeper v3 주석 |
| 10 | SOUL Skills 섹션의 skill 식별자 미호명 4건 | MEDIUM | SOUL 4페이지 (Design·QA/Release·Mobile Architect·Mobile App Dev) |
| 11 | Case H store status·rollback 계획 owner 부재 | MEDIUM | 01-3 v2 Case H 완료 owner 부기 |
| 12 | Case C reviewer 주체 미지정 + Case D Design 검토 누락 | MEDIUM | 01-3 v2 Case C/D |
| 13 | SOUL 소유 산출물(ADR, scope decision log, UX acceptance, unit test 등) Case 미반영 | MEDIUM | 01-3 v2 Case A/B/C |
| 14 | Case D "6역할 전원" 선언 vs P/P 무역할 + design-handoff Downstream Case B 미기재 | LOW | 01-3 v2 Case D 참여 + design-handoff v2 |
| 15 | (조치 불요 — 설계 정합 확인: Case B gatekeeper 미참조 정상, Case A 순서는 task_pr:false 경로로 해소, 무매핑 Case 없음) | LOW | 기록만 |
| 16 | Case F failure-honest 미명시 + feature room/Tasks 보드 준비 주체 + `.agents/skills` 체크인 주체 | LOW\~MEDIUM | 01-3 v2 Case F + 01-7 v2 Phase 3/4 |
| 17 | mobile-qa-release Downstream에 Case E 누락 | MEDIUM | mobile-qa-release v2 |

## 5. 반영 / 보류 구분

**반영 (2026-06-06)**: 01-3 v2 (diff 9개 그룹), mobile-qa-release v2, mobile-gatekeeper v3, mobile-design-handoff v2, SOUL 4페이지 (GAP-10 식별자 줄, EN+KO), 01-7 v2 (Phase 3 bootstrap 표 + Phase 4 비고), 본 페이지 신설.

**보류 (사유 포함)**:

| 항목 | 사유 |
| --- | --- |
| bootstrap 인프라 자동화(skill install/repo 생성/secret 주입/required check 등록) 코드화 | Zero-impact(00-1 §2) + 오버스펙 금지(§6). dry run에서 반복 필요 실측 후 Phase 5 제품 기능으로 승격 |
| store status 자동 모니터링 / rollback 자동화 | MVP 제외 항목(Sentry 상시 활성 등) 도입 금지 — owner 부기(수동 기록)로만 해소 |
| Tasks schema 변경·hard gate화 | 운영계획 §7 명시 제외 — gate 강제력은 GitHub required check |

## 6. 원본 산출물 위치

상세 매트릭스(Case별 전 row + 인용)와 갭 상세 분석은 운영자 로컬 `.claude/docs/mobileappd-workflow/`의 4개 문서가 원본이다 (analysis/case-soul-matrix.md, analysis/bootstrap-gaps.md, analysis/skills-case-mapping.md, report/gap-report-and-01-3-amendment.md). 본 페이지는 그 요약 보존본이며, 수치·GAP 체계는 원본과 동일하다.