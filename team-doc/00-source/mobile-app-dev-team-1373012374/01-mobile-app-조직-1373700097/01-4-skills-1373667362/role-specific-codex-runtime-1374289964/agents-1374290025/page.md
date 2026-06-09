---
pageId: "1374290025"
sourceTitle: "Agents"
sourceVersion: "unknown"
sourceUrl: "https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1374290025"
fetchedAt: "2026-06-09T03:41:15.000Z"
syncStatus: "synced"
---

| 항목 | 내용 |
| --- | --- |
| 목적 | Codex CLI project-scoped custom agents/subagents를 정의한다. |
| 경로 | `new-mobile-app/.codex/agents/<agent-name>.toml` |

## 원칙

* custom agent는 skill보다 좁은 역할일 때만 만든다.
* reviewer/research/advisor agent는 read-only sandbox를 기본값으로 둔다.
* `name`, `description`, `developer_instructions`를 필수로 정의한다.
* `[agents].max_depth = 1`을 기본으로 두고 recursive delegation을 금지한다.
* MVP에서는 broad `mobile-dev-executor`를 만들지 않는다.

## 하위 agent

* `mobile-contract-reviewer`
* `mobile-implementation-reviewer`
* `mobile-docs-researcher`
* `mobile-gate-fix-advisor`
