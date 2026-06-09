---
pageId: "1374421079"
sourceTitle: "Product Planning Operational Skills Summary"
sourceVersion: "unknown"
sourceUrl: "https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1374421079"
fetchedAt: "2026-06-09T03:41:15.000Z"
syncStatus: "synced"
---

# Product Planning Operational Skills Summary

This page summarizes Product/Planning operational skills under [SOUL.md Product/Planning](https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1373798422). The pages below are documentation updates for mobile app planning operations and do not change local source code, runtime skill packs, Jira automation, or human-gate rules.

## 업데이트 배경

기존 summary는 요구사항 구체화와 PRD 분해 후 completeness review를 연결했지만, Product/Planning이 실제로 어떤 크기와 형태의 작업 단위를 agent에게 넘겨야 하는지는 별도 기준으로 드러나지 않았다. 전체 제품 범위를 한 번에 실무 agent에게 전달하면 모호한 완료 조건, 과도한 병렬성, 누락된 의존성 때문에 실패 확률이 높아진다. 그래서 `mobile-work-unit-planning-and-agent-sprint`를 추가해 MVP-first, bounded work unit, agent sprint, vertical slice, proactive improvement intake의 판단 기준을 Product/Planning 하위 skill로 분리했다.

새 skill은 실무자 agent가 cron 또는 event trigger로 능동형 개선 보고를 올리는 흐름도 다룬다. 다만 이 보고는 실행 지시가 아니라 Product/Planning intake로 들어오는 제안이다. Product/Planning이 reject, non-goal, backlog candidate, sprint improvement, human decision required 중 하나로 triage하기 전에는 Jira 실행, 코드 변경, SOUL.md 변경, scope 변경이 자동으로 진행되지 않는다.

## Created Skill Pages

| Skill | Purpose | Page |
| --- | --- | --- |
| mobile-requirement-office-hours | Clarifies ambiguous requirements before PRD decomposition and decides whether Product/Planning can proceed. | [mobile-requirement-office-hours](https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1374519364) |
| mobile-work-unit-planning-and-agent-sprint | Defines bounded work-unit sizing, MVP-first approval, agent sprint boundaries, and proactive practitioner improvement report intake. | [mobile-work-unit-planning-and-agent-sprint](https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1374650456) |
| mobile-planning-completeness-review | Reviews completed planning output with responsible agents before execution starts. | [mobile-planning-completeness-review](https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1374519387) |

## Related Existing Skill

| Skill | Relationship | Page |
| --- | --- | --- |
| mobile-prd-to-execution | Downstream decomposition skill. It converts a ready PRD or selected bounded work unit into Jira Epic/Story/Tasks. | [mobile-prd-to-execution](https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1373634562) |

## Process

```
User / Rough request / Partial PRD / Broad product intent
        |
        v
+----------------------------------+
| mobile-requirement-office-hours  |
| - clarify request                |
| - classify risk                  |
| - identify human gates           |
+----------------------------------+
        |
        | READY_FOR_PRD_DECOMPOSITION or bounded planning needed
        v
+---------------------------------------------+
| mobile-work-unit-planning-and-agent-sprint  |
| - choose MVP increment / vertical slice     |
| - define agent sprint boundary              |
| - receive proactive practitioner reports    |
| - triage reports before any execution       |
+---------------------------------------------+
        |
        | READY_FOR_MOBILE_PRD_TO_EXECUTION
        v
+--------------------------+
| mobile-prd-to-execution  |
| - PRD/work unit to Jira  |
| - acceptance/evidence    |
+--------------------------+
        |
        v
+-------------------------------------+
| mobile-planning-completeness-review |
| - role review matrix                |
| - gaps, owners, evidence            |
| - readiness for execution           |
+-------------------------------------+
        |
        | READY_FOR_EXECUTION
        v
Execution agents / Jira tasks / feature room
        |
        | task completion / blocker / failure / release evidence gap / scheduled cron
        v
Practitioner self-inspection report
        |
        +-----------> Product/Planning intake and triage
```

## Decision Boundaries

| Boundary | Rule |
| --- | --- |
| Work-unit sizing | Product/Planning must not pass the full product volume to one execution agent. It selects a bounded MVP increment, agent sprint, vertical slice, story, task, or smaller step. |
| MVP-first expansion | Product-level expansion follows user or human-owner approval of the usable/evidence-backed MVP or a documented decision. |
| Proactive reports | Practitioner reports from cron or event triggers are proposals. They do not automatically create Jira issues, code changes, scope changes, or SOUL.md edits. |
| Human gates | Production submit, payment, PII, external messaging, legal/terms, and risk acceptance remain non-negotiable human gates. |
| A2A/NATS | A2A 1:1 NATS review may be used only when runtime support and evidence exist. Otherwise use feature room, Confluence, or Jira comments. |

## Reference Note

The content is adapted for the current SOUL.md/Confluence/Jira/mobile app development environment. gstack remains comparative prior art for office-hours and plan-review patterns only: [https://github.com/garrytan/gstack](https://github.com/garrytan/gstack). No gstack files, scripts, templates, or repository contents were copied, installed, or vendored.

## Not In Scope

* No local SOUL.md, source code, runtime skill pack, or Jira automation is changed by this documentation update.
* No automatic execution is authorized by cron or proactive reports.
* No additional Product/Planning pages are required unless a future reviewer-gated update explicitly approves them.
