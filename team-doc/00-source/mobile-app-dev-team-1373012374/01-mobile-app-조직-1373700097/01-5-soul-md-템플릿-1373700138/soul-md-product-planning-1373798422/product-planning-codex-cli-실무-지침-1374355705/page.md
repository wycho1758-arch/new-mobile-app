---
pageId: "1374355705"
sourceTitle: "Product Planning Codex CLI 실무 지침"
sourceVersion: "unknown"
sourceUrl: "https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1374355705"
fetchedAt: "2026-06-09T03:41:15.000Z"
syncStatus: "synced"
---

| 항목 | 내용 |
| --- | --- |
| 목적 | Product/Planning SOUL.md에 연결되는 Codex CLI 실무 지침 |
| Parent [SOUL.md](http://SOUL.md) | Product/Planning (`1373798422`) |
| Linked skill | `mobile-product-planning-codex-practice` (`1374355683`) |
| Summary | Mobile Codex CLI 실무 지침서 (`1374519410`) |

## KO

이 역할은 모호한 요구사항을 PRD/Epic/Story/Tasks로 분해하기 전에 `mobile-product-planning-codex-practice`를 사용한다.

Plan mode 계획은 반드시 다음을 포함해야 한다.

* SoT-bound
* no-over-spec
* explicit non-goals
* evidence-based acceptance
* Done-when acceptance criteria

완료 보고 후에는 실제 artifact와 `git diff`/Jira/Confluence/evidence를 대조한다. reviewer 없이 SoT 변경 결정이나 human-gate 자동 승인은 금지한다.

## EN

This role uses `mobile-product-planning-codex-practice` before decomposing ambiguous requirements into PRD/Epic/Story/Tasks.

Plan-mode plans must include:

* SoT-bound scope
* no over-spec
* explicit non-goals
* evidence-based acceptance
* Done-when acceptance criteria

After completion, this role compares actual artifacts with `git diff`, Jira, Confluence, and evidence. SoT-changing decisions or human-gate auto-approval without reviewer are forbidden.