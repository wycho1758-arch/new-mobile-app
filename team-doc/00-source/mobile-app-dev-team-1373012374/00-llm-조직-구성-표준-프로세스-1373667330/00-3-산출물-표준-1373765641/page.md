---
pageId: "1373765641"
sourceTitle: "00-3. 산출물 표준"
sourceVersion: "unknown"
sourceUrl: "https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1373765641"
fetchedAt: "2026-06-09T03:41:15.000Z"
syncStatus: "synced"
---

| 목적 | 조직 설계 절차(00-2)가 만들어내는 산출물 4종 — [SOUL.md](http://SOUL.md), skill 명세, evidence/gate, [AGENTS.md](http://AGENTS.md)·task 작성 — 의 도메인 무관 표준을 정의한다. 인스턴스의 실제 템플릿(영문 원문)은 각 인스턴스 섹션이 소유한다. |
| --- | --- |
| Upstream | 00-1 원칙과 제약 |
|  |  |
| Downstream | 00-2 조직 설계 절차. 각 도메인 인스턴스 — 인스턴스 측 Upstream 필드로 기록 |
|  |  |
| 관련 DEC-ID | DEC-002 (non-LLM gate), DEC-005 (required check 상시 실행 + script 내부 분기), DEC-006 ([AGENTS.md](http://AGENTS.md) 6축), DEC-007 (Done-when 문구), DEC-014 (per-package [AGENTS.md](http://AGENTS.md) 미채택), DEC-019 (오케스트레이션 프레임워크 미채택) |
|  |  |
| 출처 | docs/reports/20260605-mobile-llm-organization-env-gap-and-dev-guidelines.md §4·§5.6(6축 원칙 부분), docs/reports/20260605-mobile-llm-organization-wellmade-operating-plan.md §3·§5 골격 (도메인 무관 일반화 신규 저작) |
|  |  |

## 1. [SOUL.md](http://SOUL.md) 공통 골격 (9섹션)

모든 역할의 SOUL.md는 다음 9섹션을 포함한다. 각 섹션이 담을 내용의 기준만 여기서 정의하고, 역할별 실제 본문은 인스턴스 섹션이 소유한다.

| 섹션 | 담을 내용 |
| --- | --- |
| Identity | 역할 이름, 소속 조직, 1차 목표 |
| System Boundary | 생성·운영 표면(admin-portal/admin-api), 플랫폼 소스 비접근, 작업 장소 한정(rooms/Tasks/workspace/작업 repo) |
| Tooling | 배정된 CLI, bootstrap 설치 원칙, 플랫폼 무수정, secret 비노출 |
| Source of Truth | 산출물 유형별 SoT 매핑 (00-1 §5 분류를 도메인에 적용) |
| Communication Protocol | 시작/차단/handoff/완료 시 room 보고, 증거 링크 의무, 증거 없는 Done 금지 |
| Handoff Contract | task id, owner 역할, 입력/출력 산출물, 증거 경로, 미결 사항, 다음 책임 역할 |
| Gate Rules | 리뷰 요청 전 gate self-check, 결정적 판정 우선, LLM이 실패 판정 번복 불가, author≠approver, rework 한도 |
| Human Gate | 00-1 §4 분류 기준의 도메인 적용 목록 |
| Non-goals | scope 임의 확장 금지, 선택적 인프라 금지, 도메인별 기본 비활성 항목 |

## 2. Skill 명세 표준

skill 1건은 한 가지 일을 잘해야 하며, 결정적 동작이 필요하면 script를 포함한다. 명세 필수 필드:

| 필드 | 기준 |
| --- | --- |
| 목적 | 이 skill이 해결하는 한 가지 workflow |
| 위치 | 조직 운영 pack 또는 작업 repo pack (00-2 단계 2) |
| 주 사용 역할 | 실행 주체와 리뷰 참여 역할 |
| 입력 / 출력 | 구체 산출물 목록 (문서 링크, task, 증거 등) |
| 동작 | 번호 매긴 절차 — 추측 없이 실행 가능한 수준 |
| 금지 | scope 확장, 타 역할 권한 침범, human gate 우회 등 명시적 금지 목록 |

## 3. Evidence / Gate 추상 계약

* **판정은 결정적**: pass/fail은 결정적 script와 저장소 required check가 한다. LLM 판단은 실패한 required check를 뒤집을 수 없다.
* **상시 실행 + 내부 분기**: required check는 모든 변경 요청에서 항상 실행한다. 적용할 검사의 분기(작업 task 연계 여부 등)는 저장소 설정 레벨 skip이 아니라 script 내부에서 결정적으로 판정한다. skip/neutral 상태가 gate를 우회하지 못하게 보강 장치를 둔다.
* **증거 기반 Done**: 모든 task는 기계 판독 가능한 증거를 남기고, gate는 증거의 존재·정합을 검증한다.
* **self-reported 한계 보강**: LLM이 기록한 증거 값은 자기 보고이므로, 한도 검사 등 강제력이 필요한 값은 저장소 이력 같은 결정적 출처로 보강하는 방향을 우선 검토한다.
* **작성자-승인자 분리**: author≠approver를 gate가 검사한다.
* **rework 한도**: 실패 반복 시 자동 재시도를 중지하고 human 결정(중단/재시도/재배정/위험 수용)으로 넘긴다. 한도 수치는 외부 표준을 인용하지 않고 dry run 실측으로 정한다.

## 4. [AGENTS.md](http://AGENTS.md) 작성 원칙 (6축)

작업 repo root의 AGENTS.md는 agent가 작업 전 자동 로드하는 작업 계약이다. 6축을 간결한 outline으로 담는다:

1. repo 구조와 중요 디렉터리
2. 실행 방법
3. build/test/lint 명령
4. 엔지니어링 컨벤션과 PR 기대치
5. 제약·금지(do-not) 규칙
6. Done의 정의와 검증 방법

* 짧고 정확하게 쓴다 — 모호한 규칙으로 가득한 긴 파일보다 낫다.
* 규칙은 미리 추측해 넣지 않고, 반복 실수가 관찰된 후에만 점진 추가한다.
* root 단일 파일로 시작한다. per-package 중첩은 실행기 간 동작 차이 리스크가 있어 채택하지 않는다 (DEC-014).

## 5. Task 작성 표준 (4요소)

| 요소 | 내용 |
| --- | --- |
| Goal | 무엇을 바꾸거나 만들 것인가 |
| Context | 어떤 문서·파일·에러가 중요한가 (SoT 링크) |
| Constraints | 따라야 할 표준 ([AGENTS.md](http://AGENTS.md), [SOUL.md](http://SOUL.md) 경계) |
| Done-when | 완료 전 무엇이 참이어야 하는가 — 검증 가능한 조건문으로 작성. agent는 수락 전 관련 검사를 직접 실행하고 결과를 확인한다 |

## 6. 검증 루프와 패턴 원칙

* agent에게 pass/fail을 산출하는 검사(테스트, build exit code, 린터 등)를 제공하면 agent가 작업→검사→수정 루프를 스스로 닫는다. 검사가 없으면 인간이 검증 루프가 된다 — 검증할 수 없으면 출시하지 않는다.
* task 분해는 단순·조합 가능한 패턴(순차 분해, 역할 라우팅, 평가-개선 루프)으로 충분하다. 별도 오케스트레이션 프레임워크를 도입하지 않는다 (DEC-019).

> **범위 단서 (2026-06-09)**: 본 산출물 표준 중 §3 evidence/gate(저장소 required check·build exit code)와 §4 [AGENTS.md](http://AGENTS.md) 6축(repo 구조·build/test/lint)은 **저장소 기반 소프트웨어를 산출하는 agent 조직**을 전제한다. 비-소프트웨어 도메인 적용 시 해당 항목은 도메인 등가물(예: 산출물 검증 기준·결정적 판정 수단)로 재해석이 필요하다.
