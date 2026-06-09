---
pageId: "1374421154"
sourceTitle: "Mobile App Dev Codex CLI 실무 지침"
sourceVersion: "unknown"
sourceUrl: "https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1374421154"
fetchedAt: "2026-06-09T03:41:15.000Z"
syncStatus: "synced"
---

| 항목 | 내용 |
| --- | --- |
| 목적 | Mobile App Dev SOUL.md에 연결되는 Codex CLI 실무 지침 |
| Parent [SOUL.md](http://SOUL.md) | Mobile App Dev (`1373700159`) |
| Linked skill | `mobile-app-dev-codex-practice` (`1374552140`) |
| Summary | Mobile Codex CLI 실무 지침서 (`1374519410`) |

## KO

이 역할은 복잡한 구현 전 `mobile-app-dev-codex-practice`를 사용한다.

* 승인된 task/design/API contract 안에서만 구현한다.
* TDD rule에 따라 실패하는 test를 먼저 작성한 뒤 구현한다(Red→Green→Refactor).
* 완료 전 `git diff`를 task/design/API contract와 대조한다.
* test/build/evidence를 실행하고 결과를 `.evidence/<task-id>.json` 또는 PR evidence에 기록한다.
* text-only design으로 UI 구현을 시작하지 않는다.

## EN

This role uses `mobile-app-dev-codex-practice` before non-trivial implementation.

* Implement only within the approved task/design/API contract.
* Follow TDD by writing a failing test first, then implement (Red→Green→Refactor).
* Before completion, compare `git diff` against the task/design/API contract.
* Run tests/build/evidence and record results in `.evidence/<task-id>.json` or PR evidence.
* Do not start UI implementation from text-only design.
