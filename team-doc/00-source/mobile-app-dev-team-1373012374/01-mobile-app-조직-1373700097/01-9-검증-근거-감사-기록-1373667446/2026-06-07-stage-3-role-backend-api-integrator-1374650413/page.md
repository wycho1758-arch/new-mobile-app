---
pageId: "1374650413"
sourceTitle: "2026-06-07 Stage 3 Role - Backend API Integrator"
sourceVersion: "unknown"
sourceUrl: "https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1374650413"
fetchedAt: "2026-06-09T03:41:15.000Z"
syncStatus: "synced"
---

# Stage 3 Role - Backend/API Integrator

| 항목 | 내용 |
| --- | --- |
| Status | Reviewer LGTM |
| Local report | docs/reports/mobile-soul-audit/03-role-backend-api-integrator.md |
| 성격 | 비규범 감사 기록. SOUL.md 변경 아님. |

## 9-Section Check

All 00-3 required content is present inside Soul Builder 8-section format. Tooling coverage is present through API contract and backend integration skill references.

## Case Mapping

* Direct: Case D/E backend API integration and contract alignment.
* Review/conditional: Case B API feasibility and task split review, Case F when failed task owner.
* Not direct: Case A/G/H unless API contract, backend availability, or release blocker evidence is assigned.

## Required Candidate Updates

* In Case B, review PRD/Story decomposition for API need, contract risk, backend task split, and human-gate implications; do not create product scope.
* If failed task owner in Case F, classify contract/backend/API failure, update contract or fixture evidence, and stop at rework cap for escalation.
* Add existing mobile-backend-api-integrator-workflow as workflow skill in use for Case D/E backend/API integration, with mobile-api-contract as contract skill.

## Optional Candidate

If no selected Case, backend Task owner, contract artifact, or integration target exists, stop execution and report the missing SoT link instead of inventing an API workflow.

## Skill Implication

No new skill is justified. Existing mobile-backend-api-integrator-workflow and mobile-api-contract are sufficient, but SOUL.md should explicitly reference the workflow skill.