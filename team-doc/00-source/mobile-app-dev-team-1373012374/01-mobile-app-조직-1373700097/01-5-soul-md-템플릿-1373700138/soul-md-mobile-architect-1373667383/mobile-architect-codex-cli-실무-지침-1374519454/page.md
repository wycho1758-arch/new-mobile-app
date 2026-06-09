---
pageId: "1374519454"
sourceTitle: "Mobile Architect Codex CLI 실무 지침"
sourceVersion: "unknown"
sourceUrl: "https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1374519454"
fetchedAt: "2026-06-09T03:41:15.000Z"
syncStatus: "synced"
---

| 항목 | 내용 |
| --- | --- |
| 목적 | Mobile Architect SOUL.md에 연결되는 Codex CLI 실무 지침 |
| Parent [SOUL.md](http://SOUL.md) | Mobile Architect (`1373667383`) |
| Linked skill | `mobile-architect-codex-practice` (`1374421132`) |
| Summary | Mobile Codex CLI 실무 지침서 (`1374519410`) |

## KO

이 역할은 architecture boundary, dependency, navigation/state/API, EAS/release 영향이 있을 때 `mobile-architect-codex-practice`를 사용한다.

* 교차 역할 영향이 큰 ADR/contract 결정은 Plan mode로 시작한다.
* ADR/risk note를 작성하고 승인되지 않은 dependency/template deviation을 막는다.
* 구현 완료 후 실제 `git diff`가 ADR/risk decision과 일치하는지 검토한다.
* release 관련 변경은 QA/Release와 EAS strategy를 co-review한다.

## EN

This role uses `mobile-architect-codex-practice` when architecture boundary, dependency, navigation/state/API, or EAS/release impact exists.

* Start cross-role ADR/contract decisions in Plan mode.
* Write ADR/risk notes and prevent unapproved dependency/template deviation.
* After implementation, review whether actual `git diff` matches the ADR/risk decision.
* Co-review release-related changes and EAS strategy with QA/Release.
