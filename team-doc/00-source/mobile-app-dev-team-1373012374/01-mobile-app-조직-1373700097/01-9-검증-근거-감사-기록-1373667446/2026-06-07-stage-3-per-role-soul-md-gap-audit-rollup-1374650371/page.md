---
pageId: "1374650371"
sourceTitle: "2026-06-07 Stage 3 - Per-Role SOUL.md Gap Audit Rollup"
sourceVersion: "unknown"
sourceUrl: "https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1374650371"
fetchedAt: "2026-06-09T03:41:15.000Z"
syncStatus: "synced"
---

# Stage 3 - Per-Role SOUL.md Gap Audit Rollup

| 항목 | 내용 |
| --- | --- |
| Stage | STAGE 3: Per-Role SOUL.md Gap Audit |
| Plan | docs/plans/active/20260607-mobile-soul-main-agent-depth-audit-plan.md |
| Local rollup | docs/reports/mobile-soul-audit/03-role-gap-rollup.md |
| Status | <custom data-type="status" data-id="id-0">Reviewer LGTM</custom> |
| Reviewer | LGTM / QA PASS / unresolved issues 없음 |
| 성격 | 비규범 감사 기록. SOUL.md, skill, workflow, runtime policy를 변경하지 않음. |

## Common Findings

* All six role SOUL.md pages contain the operational content required by the 00-3 9-section standard.
* The role pages use Soul Builder 8-section format, while 00-3 names a 9-section common skeleton. This is a structural SoT gap, not a content absence.
* All six roles include communication and seven-field handoff content.
* No-workflow/no-task/no-room linkage handling is not explicit enough across roles.
* No Gatekeeper SOUL.md should be created.
* No CTO role should be added.
* No standalone role wrapper skills should be created.

## Required Candidate Summary

| Role | Required candidates |
| --- | --- |
| Product/Planning | Unmapped event routing to PRD intake/scope decision/non-goal/human escalation. |
| Design | Case B design review behavior; Case F design failure-owner behavior. |
| Mobile Architect | Case H rollback/update plan co-ownership; unmapped event blocker behavior. |
| Mobile App Dev | Case A app shell verification; Case E integration branch validation; add existing mobile-app-dev-workflow as skill in use. |
| Backend/API Integrator | Case B API review behavior; Case F contract/backend failure-owner behavior; add existing mobile-backend-api-integrator-workflow as skill in use. |
| QA/Release | Case B QA/evidence requirement review behavior. |

## Skill Update Implications

| Item | Classification |
| --- | --- |
| New role wrapper skills | NOT NEEDED / FORBIDDEN by runtime Skills page. |
| mobile-app-dev-workflow mention in Mobile App Dev SOUL.md | REQUIRED candidate; existing skill, not new skill. |
| mobile-backend-api-integrator-workflow mention in Backend/API Integrator SOUL.md | REQUIRED candidate; existing skill, not new skill. |
| Existing MVP and workflow skills | Coverage remains sufficient for Stage 3 findings. |

## Acceptance

| Requirement | Status |
| --- | --- |
| Six role reports produced | PASS |
| Each role checks 9-section coverage | PASS |
| Case A-H direct mapping checked | PASS |
| Events not directly mapped checked | PASS |
| Responsibilities/boundaries/gates/evidence/escalation gaps recorded | PASS |
| Required/optional/not-needed candidates separated | PASS |
| Update skill implications checked | PASS |
| No new workflow/role/skill proposed | PASS |
| Gatekeeper SOUL.md excluded | PASS |
