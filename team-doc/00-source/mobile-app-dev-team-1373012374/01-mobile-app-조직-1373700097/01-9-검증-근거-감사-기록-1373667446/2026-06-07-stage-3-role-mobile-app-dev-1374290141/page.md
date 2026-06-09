---
pageId: "1374290141"
sourceTitle: "2026-06-07 Stage 3 Role - Mobile App Dev"
sourceVersion: "unknown"
sourceUrl: "https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1374290141"
fetchedAt: "2026-06-09T03:41:15.000Z"
syncStatus: "synced"
---

# Stage 3 Role - Mobile App Dev

| 항목 | 내용 |
| --- | --- |
| Status | Reviewer LGTM |
| Local report | docs/reports/mobile-soul-audit/03-role-mobile-app-dev.md |
| 성격 | 비규범 감사 기록. SOUL.md 변경 아님. |

## 9-Section Check

All 00-3 required content is present inside Soul Builder 8-section format. Tooling coverage is present through skills and runtime references.

## Case Mapping

* Direct: Case A initial app shell/import verification, Case C and D implementation, Case E mobile integration validation.
* Conditional: Case F when assigned as failed task owner.
* Not direct: Case B, G, H except assigned support or handoff evidence.

## Required Candidate Updates

* For Case A bootstrap, verify initial app shell, template sample behavior, and packages/contracts import resolution before handing off evidence.
* For Case E backend/API-centered changes, validate the mobile integration branch and record the evidence/handoff result.
* Add existing mobile-app-dev-workflow as implementation skill in use for Case C/D; keep mobile-api-contract as contract input.

## Optional Candidate

If no selected Case, Task owner, or SoT artifact exists, stop implementation, report the missing SoT link, and request Product/Planning or Mobile Architect routing.

## Skill Implication

No new skill is justified. Existing mobile-app-dev-workflow and mobile-api-contract are sufficient, but SOUL.md should explicitly reference mobile-app-dev-workflow.