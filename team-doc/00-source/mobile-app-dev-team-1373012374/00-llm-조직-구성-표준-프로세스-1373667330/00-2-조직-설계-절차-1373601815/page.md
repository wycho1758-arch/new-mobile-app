---
pageId: "1373601815"
sourceTitle: "00-2. 조직 설계 절차"
sourceVersion: "unknown"
sourceUrl: "https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1373601815"
fetchedAt: "2026-06-09T03:41:15.000Z"
syncStatus: "synced"
---

| 목적 | 새 도메인(개발, HR, marketing 등)의 LLM 조직을 구성할 때 따르는 표준 절차 6단계를 정의한다. 사용자와 LLM이 이 순서대로 진행하면 도메인 인스턴스 섹션 1개가 완성된다. |
| --- | --- |
| Upstream | 00-1 원칙과 제약, 00-3 산출물 표준 |
| --- | --- |
| Downstream | 각 도메인 인스턴스 — 인스턴스 측 Upstream 필드로 기록 |
| --- | --- |
| 관련 DEC-ID | DEC-002 (거버넌스 게이트는 non-LLM), DEC-009 (한도 수치는 dry run에서 확정) |
| --- | --- |
| 출처 | docs/reports/20260605-mobile-llm-organization-wellmade-operating-plan.md §6 (도메인 무관 일반화 신규 저작) |
| --- | --- |

## 절차 6단계

| 단계 | 내용 | 완료 기준 |
| --- | --- | --- |
| 1. 조직 설계 확정 | 도메인의 가치사슬(요구 접수 → 산출 → 검증 → 공개)에서 역할을 도출하고, 역할 분리 기준을 적용하고, human gate 목록을 확정한다 | 역할 목록·분리 근거·human gate 기준이 결정 레지스트리(00-4)에 기록됨 |
| 2. skill 2-pack 분리 | skill을 두 위치로 나눈다: (a) 조직 운영 pack — 생성된 agents의 workspace/user 위치에 설치, 기획·분해·조율용. (b) 작업 repo pack — 작업 저장소에 체크인, 구현·검증·공개용 | 각 skill에 00-3 명세 표준의 필수 필드가 채워지고 배치 위치가 확정됨 |
| 3. SOUL.md 작성 | 00-3의 공통 골격 9섹션 기반으로 공통 base + 역할별 SOUL.md를 작성한다. 생성 flow(Soul Builder)의 입력이다 | 역할별 책임·금지가 상호 구분되고 handoff·증거 규칙이 공통 포함됨 |
| 4. non-LLM gate 설계 | 거버넌스 판정자는 LLM agent가 아니라 결정적 script + 저장소 required check로 만든다 (00-3 evidence/gate 계약 준수) | 판정 술어가 script 단일 SoT에 있고, LLM 판단이 실패 판정을 뒤집을 수 없음 |
| 5. dry run | 작은 실제 요구 1건을 조직이 끝까지 처리한다 (접수 → 분해 → 산출 → gate → 공개 직전까지). 실패·rework·escalation 흐름을 검증한다 | 전 workflow 1회 통과 + 실패 흐름 검증 + 한도(rework cap 등) 수치 실측 확정 |
| 6. 확장 승격 | dry run에서 반복적으로 필요가 실측된 것만 플랫폼 제품 기능 확장 요청으로 승격한다. 처음부터 넣으면 오버스펙이다 | 승격 항목별 dry run 근거가 결정 레지스트리에 기록됨 |

## 역할 분리 기준

* **계약 경계 분리**: 두 책임 사이에 고정된 계약(contract)이 필요하면 역할을 분리한다. 산출자가 계약을 임의로 바꾸는 구조를 막는다.
* **작성자-승인자 분리**: 같은 산출물의 author와 approver는 동일 agent일 수 없다. 역할 수를 줄이더라도 이 분리는 유지한다.
* **거버넌스 비-LLM**: pass/fail 판정 역할은 LLM agent로 만들지 않는다. 판정은 결정적 장치, LLM은 수정 작업만 담당한다.
* **최소 역할 수**: 위 기준을 충족하는 최소 인원으로 시작한다. dry run에서 단독 기여도가 낮은 역할은 축소 후보다.

## 새 인스턴스 섹션 만들기

절차를 완료하면 본 스페이스에 \[NN\] 도메인 섹션을 추가하고, 첫 인스턴스(\[01\])의 페이지 구성(방향과 제약 / 조직 구성과 역할 / Workflows / Skills / 산출물 템플릿 / 진행 계획 / 검증 근거)을 패턴으로 따른다. 내용은 복사하지 않고 이 절차로 새로 도출한다.