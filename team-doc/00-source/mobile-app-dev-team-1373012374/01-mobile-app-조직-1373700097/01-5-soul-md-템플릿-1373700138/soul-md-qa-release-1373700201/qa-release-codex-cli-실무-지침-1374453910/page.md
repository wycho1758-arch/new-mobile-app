---
pageId: "1374453910"
sourceTitle: "QA Release Codex CLI 실무 지침"
sourceVersion: "unknown"
sourceUrl: "https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1374453910"
fetchedAt: "2026-06-09T03:41:15.000Z"
syncStatus: "synced"
---

| 항목 | 내용 |
| --- | --- |
| 목적 | QA/Release SOUL.md에 연결되는 Codex CLI 실무 지침 |
| Parent [SOUL.md](http://SOUL.md) | QA/Release (`1373700201`) |
| Linked skill | `mobile-qa-release-codex-practice` (`1374519432`) |
| Summary | Mobile Codex CLI 실무 지침서 (`1374519410`) |

## KO

이 역할은 QA/gate failure, release evidence, rework cap, production submit 준비 시 `mobile-qa-release-codex-practice`를 사용한다.

* 교차 역할 영향이 큰 release/gate 판단은 Plan mode로 시작한다.
* 실패를 implementation, contract, test, environment, scope로 분류한다.
* rework_count와 cap을 기록한다.
* failed gate를 pass로 재라벨하지 않는다.
* production submit 또는 risk acceptance는 human approval 없이는 진행하지 않는다.
* 완료 전 evidence와 `git diff`/PR 상태를 비교한다.

## EN

This role uses `mobile-qa-release-codex-practice` for QA/gate failure, release evidence, rework caps, and production submit preparation.

* Start cross-role release/gate decisions in Plan mode.
* Classify failures as implementation, contract, test, environment, or scope.
* Record rework_count and cap.
* Do not relabel failed gates as pass.
* Do not proceed with production submit or risk acceptance without human approval.
* Before completion, compare evidence against `git diff` and PR status.
