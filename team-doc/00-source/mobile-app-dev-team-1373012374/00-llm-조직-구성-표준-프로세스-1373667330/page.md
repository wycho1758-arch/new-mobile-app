---
pageId: "1373667330"
sourceTitle: "[00] LLM 조직 구성 표준 프로세스"
sourceVersion: "3"
sourceUrl: "https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1373667330"
fetchedAt: "2026-06-09T03:41:15.000Z"
syncStatus: "synced"
---

| 목적 | 도메인 무관 LLM 조직 구성 표준 프로세스의 진입점. 원칙·절차·산출물 표준·결정 레지스트리의 인덱스이며, 새 도메인(HR, marketing 등) 조직 구성 시 이 레이어를 그대로 재사용한다. |
| --- | --- |
| Upstream | 없음 (최상위 레이어) |
|  |  |
| Downstream | 00-1 \~ 00-4. 각 도메인 인스턴스 섹션 — 인스턴스 측 페이지의 Upstream 필드로 기록한다 (본 레이어는 인스턴스를 직접 참조하지 않는다) |
|  |  |
| 관련 DEC-ID | DEC-011 (메타 레이어를 현 스페이스 내 최상위 섹션으로 배치) |
|  |  |
| 출처 | docs/reports/20260605-mobile-llm-organization-wellmade-operating-plan.md, docs/reports/20260605-mobile-llm-organization-env-gap-and-dev-guidelines.md §4 (도메인 무관 일반화 신규 저작) |
|  |  |

## 이 레이어가 하는 일

사용자가 admin-portal/admin-api 생성 flow로 새로운 LLM 전문 조직(개발, HR, marketing 등)을 구성할 때 따라야 할 도메인 무관 표준을 정의한다. 사용자와 LLM 모두 이 레이어를 기준 프로세스로 사용한다.

이 레이어의 모든 페이지는 도메인 고유명사를 포함하지 않는다. 특정 도메인의 도구·파일 경로·서비스 이름이 필요한 내용은 해당 도메인 인스턴스 섹션에 속한다.

> **적용 범위 단서 (2026-06-09)**: 본 표준은 ClawPod 플랫폼(admin-portal/admin-api) 위에서 **저장소 기반 소프트웨어를 산출하고 결정적 게이트로 검증하는 agent 조직**을 1차 대상으로 도출되었다(현재 검증된 인스턴스는 1종). 비즈니스 도메인(개발/HR/marketing 등)에는 무관하나 플랫폼·산출물 형태에는 결속된다. HR·marketing 등 비-소프트웨어 도메인으로의 전면 재사용은, 00-3 산출물 표준 중 소프트웨어 특화 항목(AGENTS.md의 build/test/lint, 저장소 required check 등)의 도메인 적합성을 2번째 인스턴스에서 검증한 뒤 확정한다.

## 하위 페이지 인덱스

| 페이지 | 역할 |
| --- | --- |
| 00-1. 원칙과 제약 | 생성 표면 기준 가능/불가, zero-impact 원칙, secret 주입 제약, human gate 분류 기준, SoT 운영 규칙 |
| 00-2. 조직 설계 절차 | 역할 도출 → 분리 기준 → skill 2-pack → [SOUL.md](http://SOUL.md) → non-LLM gate → dry run → 확장 승격 |
| 00-3. 산출물 표준 | [SOUL.md](http://SOUL.md) 공통 골격, skill 명세 표준, evidence/gate 추상 계약, [AGENTS.md](http://AGENTS.md) 6축 원칙, task 4요소 |
| 00-4. 가설·결정 레지스트리 | 결정 1건 = 1행 (DEC-ID, 날짜, 가설/결정, 근거, 상태). 가설 변경 시 영향 추적의 진입점 |

## 페이지 헤더 표준 블록 (전 페이지 공통 규칙)

본 트리의 모든 페이지는 상단에 다음 5개 필드의 표를 고정으로 둔다.

| 필드 | 정의 |
| --- | --- |
| 목적 | 이 페이지가 SoT로 소유하는 내용을 1줄로 기술 |
| Upstream | 이 페이지가 의존하는 페이지 목록. 여기 나열된 페이지가 바뀌면 이 페이지를 재검토해야 한다 |
| Downstream | 이 페이지에 의존하는 페이지 목록. 이 페이지가 바뀌면 여기 나열된 페이지를 재검토해야 한다 |
| 관련 DEC-ID | 이 페이지 내용의 근거가 되는 결정 ID (00-4 레지스트리 행) |
| 출처 | 내용의 원본 (로컬 보고서 경로·섹션 또는 외부 문서) |

규칙:

* **Edge SoT**: 페이지 간 의존 관계의 단일 사실 출처는 각 페이지 헤더의 Upstream/Downstream과 관련 DEC-ID다. 레지스트리(00-4)의 영향 페이지 열은 헤더 전수 스캔으로 도출되는 파생 뷰다.
* **레이어 단방향**: 메타 레이어(00) 페이지는 인스턴스 레이어 페이지를 참조하지 않는다. 인스턴스 → 메타 방향의 Upstream만 허용된다.
* **가설 변경 절차**: 00-4에 결정 행을 추가/상태 변경 → 해당 DEC-ID를 헤더에 가진 페이지를 전수 조회 → 갱신 → 갱신된 페이지의 Downstream을 재귀적으로 재검토.
* **단일 사실 단일 페이지**: 동일 규칙을 두 페이지에 본문으로 중복 기술하지 않는다. 본문 1곳, 나머지는 링크.
* **대칭 의무의 예외**: (1) 섹션 부모 페이지의 Downstream 중 하위 페이지 나열은 트리 포함 관계(인덱스)이고, (2) 근거 저장소 페이지(검증 근거·감사 기록)의 "전 페이지" Downstream은 참조 관계이므로, 두 경우는 상대 페이지의 역방향 Upstream 기재 의무에서 제외한다. 그 외 모든 Downstream 항목 X→Y는 Y의 Upstream에 X(또는 X의 부모 페이지)가 기재되어야 한다.
