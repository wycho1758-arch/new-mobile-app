---
pageId: "1373634562"
sourceTitle: "mobile-prd-to-execution"
sourceVersion: "unknown"
sourceUrl: "https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1373634562"
fetchedAt: "2026-06-09T03:41:15.000Z"
syncStatus: "synced"
---

| 항목 | 내용 |
| --- | --- |
| 목적 | 사용자가 준 PRD를 Jira Epic/Story와 Tasks 실행 단위로 바꿉니다. |
| Upstream | 01-4 |
| Downstream | 01-3 Case B |
| 관련 DEC-ID | DEC-007 |
| 출처 | 운영계획 §3.1 #1, env-gap §4.2·§7 권고 2 |

## mobile-prd-to-execution

### 목적

* 사용자가 준 PRD를 Jira Epic/Story와 Tasks 실행 단위로 바꿉니다.
* room 생성과 agent 배정까지 이어지는 Product/Planning 표준 workflow입니다.

### 위치

```
organization-runtime skill pack
```

### 대상 [SOUL.md](http://SOUL.md)(role)

| Role | 사용 방식 |
| --- | --- |
| Product/Planning | owner. PRD를 Epic/Story/Task로 분해하고 scope decision log, acceptance criteria, human gate를 정의한다. |
| Design | downstream. screen/design task가 필요한 경우 Design handoff로 이어진다. |
| Mobile Architect | reviewer/downstream. architecture, API, release 영향이 있는 task 분해를 검토한다. |
| Mobile App Dev | downstream. 구현 task receiver이며 PRD scope를 임의 확장하지 않는다. |
| Backend/API Integrator | downstream. backend/API 변경이 필요한 경우 별도 task receiver가 된다. |
| QA/Release | downstream. QA/evidence/release task receiver가 된다. |
| Human owner | human gate 대상. 법무, 결제, PII, 외부 발송, 위험 수용, production submit 승인에 개입한다. |

### 주 사용 agent

* Product/Planning

### 입력

* PRD 원문 또는 Confluence PRD URL
* 목표 플랫폼: iOS, Android, both
* release scope
* non-goals
* 외부 API/백엔드 존재 여부

### 출력

* Jira Epic
* Jira Story 목록
* Tasks 실행 task 목록
* Epic/feature room 생성 지시
* acceptance criteria
* human gate 목록

### 동작

1. PRD에서 사용자 목표, screen, data, integration, release 요구를 분리합니다.
2. 기능 단위를 Epic/Story로 나눕니다.
3. Story를 agent가 수행 가능한 Tasks로 쪼갭니다.
4. 각 task에 owner role, expected output, evidence requirement를 붙입니다.
5. feature room을 만들고 필요한 agent를 초대합니다.

### 금지

* PRD가 애매한데 임의로 scope를 확장하지 않습니다.
* app repo 파일을 직접 만들지 않습니다.
* production submit을 자동 승인하지 않습니다.

### Done-when 작성 규칙

env-gap §4.2의 권고에 따라, 이 skill 출력의 acceptance criteria와 evidence requirement 문구를 Done-when 형식("완료 전 무엇이 참이어야 하는가"의 검증 가능한 조건문)으로 작성합니다.

코딩 에이전트에게 주는 task는 Goal / Context / Constraints / Done-when의 4요소 구조로 작성하며, 그중 Done-when은 "완료 전 무엇이 참이어야 하는가"를 담당합니다. 운영계획상 Done-when의 매핑은 evidence requirement + gatekeeper 항목입니다. Done 기준은 "테스트 통과, 동작 변경, 버그 미재현" 같은 구체적·검증 가능한 조건으로 정의해야 하며, 에이전트는 수락 전 관련 검사를 직접 실행하고 결과를 확인해야 합니다.

이 권고는 신규 필드 추가가 아닙니다. `mobile-prd-to-execution`이 이미 task마다 부여하는 acceptance criteria와 evidence requirement의 작성 문구를 Done-when 형식으로 통일하라는 것이며, Tasks schema 변경은 운영계획 §7의 MVP 제외 항목이므로 건드리지 않습니다.
