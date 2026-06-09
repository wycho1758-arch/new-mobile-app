---
pageId: "1374355727"
sourceTitle: "Backend API Integrator Codex CLI 실무 지침"
sourceVersion: "unknown"
sourceUrl: "https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1374355727"
fetchedAt: "2026-06-09T03:41:15.000Z"
syncStatus: "synced"
---

| 항목 | 내용 |
| --- | --- |
| 목적 | Backend/API Integrator SOUL.md에 연결되는 Codex CLI 실무 지침 |
| Parent [SOUL.md](http://SOUL.md) | Backend/API Integrator (`1373700180`) |
| Linked skill | `mobile-backend-api-integrator-codex-practice` (`1374453888`) |
| Summary | Mobile Codex CLI 실무 지침서 (`1374519410`) |

## KO

이 역할은 API contract, mock-vs-real boundary, auth/session/error shape가 관련될 때 `mobile-backend-api-integrator-codex-practice`를 사용한다.

* 교차 역할 영향이 큰 API contract 결정은 Plan mode로 시작한다.
* 구현 전 API contract SoT를 확인한다.
* mock으로 진행 가능한 범위와 실제 backend dependency를 구분한다.
* backend unavailable 상태에서는 추측 구현 대신 mitigation과 owner decision을 기록한다.
* 완료 후 diff를 API contract와 비교하고 contract drift를 보고한다.

## EN

This role uses `mobile-backend-api-integrator-codex-practice` when API contract, mock-vs-real boundary, or auth/session/error shape is involved.

* Start cross-role API contract decisions in Plan mode.
* Check API contract SoT before implementation.
* Separate mock-ready scope from real backend dependency.
* If backend is unavailable, record mitigation and owner decision instead of guessing.
* After completion, compare diff against the API contract and report contract drift.
