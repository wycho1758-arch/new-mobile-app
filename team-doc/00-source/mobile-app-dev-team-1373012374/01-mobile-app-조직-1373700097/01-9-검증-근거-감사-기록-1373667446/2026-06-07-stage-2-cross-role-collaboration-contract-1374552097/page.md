---
pageId: "1374552097"
sourceTitle: "2026-06-07 Stage 2 - Cross-Role Collaboration Contract"
sourceVersion: "unknown"
sourceUrl: "https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1374552097"
fetchedAt: "2026-06-09T03:41:15.000Z"
syncStatus: "synced"
---

# Stage 2 - Cross-Role Collaboration Contract

| 항목 | 내용 |
| --- | --- |
| Stage | STAGE 2: Cross-Role Collaboration Contract |
| Plan | docs/plans/active/20260607-mobile-soul-main-agent-depth-audit-plan.md |
| Local report | docs/reports/mobile-soul-audit/02-cross-role-collaboration-contract.md |
| Status | <custom data-type="status" data-id="id-0">Reviewer LGTM</custom> |
| Reviewer | LGTM / QA PASS / unresolved issues 없음 |
| 성격 | 비규범 감사 기록. SOUL.md, skill, workflow, runtime policy를 변경하지 않음. |

## Purpose

이 감사는 선택 가능한 workflow, assigned Task, 또는 feature-room linkage가 없는 이벤트에서 6개 main-agent SOUL.md가 공통 협업 규칙을 충분히 제공하는지 확인한다.

## SoT Inputs

* 00-1. 원칙과 제약 (1373601794)
* 00-3. 산출물 표준 (1373765641)
* 01-2. 조직 구성과 역할 (1373765682)
* 01-3. Workflows — Case A\~H (1373667425)
* SOUL.md — Product/Planning (1373798422)
* SOUL.md — Design (1373765702)
* SOUL.md — Mobile Architect (1373667383)
* SOUL.md — Mobile App Dev (1373700159)
* SOUL.md — Backend/API Integrator (1373700180)
* SOUL.md — QA/Release (1373700201)

## Role Contract Summary

| Role | Communication Protocol | Seven-field Handoff Contract | No-workflow behavior |
| --- | --- | --- | --- |
| Product/Planning | PASS | PASS | GAP |
| Design | PASS | PASS | GAP |
| Mobile Architect | PASS | PASS | GAP |
| Mobile App Dev | PASS | PASS | GAP |
| Backend/API Integrator | PASS | PASS | GAP |
| QA/Release | PASS | PASS | GAP |

## Minimal Candidate

Stage 2 identified one required minimal SOUL.md addition candidate. This is not yet applied and remains gated until Stage 7 final proposal.

```
If no assigned Task, workflow, or feature-room linkage exists, treat the work as blocked; report the missing SoT link, owner needed, and next decision, and do not claim Done.
```

## Classification

| Item | Classification | Reason |
| --- | --- | --- |
| Common no-workflow blocker sentence | REQUIRED CANDIDATE | All six SOUL.md pages have generic blocker rules but do not explicitly cover missing workflow/task/room linkage. |
| New workflow | NOT NEEDED | The gap is a stop/report rule, not a repeatable workflow. |
| New role | NOT NEEDED | The six LLM roles plus non-LLM Gatekeeper model remains sufficient. |
| New skill | NOT NEEDED | This is a policy sentence, not a repeatable tool/workflow with input/output artifacts. |
| Gatekeeper SOUL.md | FORBIDDEN | 01-2 states Gatekeeper has no SOUL.md. |

## SoT Role / Channel Disambiguation

| Channel / Artifact | SoT role | Finding |
| --- | --- | --- |
| Confluence / user-provided document | PRD, ADR, release docs, organization policy SoT | No confusion observed. |
| Jira Epic/Story | Product backlog SoT | No confusion observed. |
| Tasks | Agent execution unit | No confusion observed, but missing Task linkage drives the no-workflow gap. |
| GitHub PR | Code and review SoT | No confusion observed. |
| EAS | Build/release evidence SoT | No confusion observed. |
| Maestro | E2E evidence SoT | No confusion observed. |
| .evidence/<task-id>.json | Minimum machine-readable evidence | No confusion observed. |
| Room / feature room | Coordination log only | No confusion observed; the candidate sentence reinforces that missing SoT links are reported in room but not resolved by chat alone. |

## SoT Gaps

* No page explicitly defines role behavior when an event has no selected workflow, assigned Task, or feature-room linkage.
* 00-3 defines a 9-section SOUL.md common skeleton, while role pages are reported as using Soul Builder's 8-section format with communication/handoff content embedded in Communication Style. Content coverage is present, structure ownership is inconsistent and should carry into Stage 3.

## Acceptance

| Requirement | Status |
| --- | --- |
| Six role pages inspected | PASS |
| Communication Protocol coverage checked | PASS |
| Handoff Contract fields checked | PASS |
| No-workflow behavior checked | PASS_WITH_GAP |
| SoT channel role confusion checked | PASS |
| SOUL.md additions classified as required/optional/not needed | PASS |
| No new workflow/role/skill proposed | PASS |
| SoT gaps recorded without guessing | PASS |
