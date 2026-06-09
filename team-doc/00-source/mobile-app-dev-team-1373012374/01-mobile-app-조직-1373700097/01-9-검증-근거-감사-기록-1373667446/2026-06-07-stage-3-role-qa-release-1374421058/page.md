---
pageId: "1374421058"
sourceTitle: "2026-06-07 Stage 3 Role - QA Release"
sourceVersion: "unknown"
sourceUrl: "https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1374421058"
fetchedAt: "2026-06-09T03:41:15.000Z"
syncStatus: "synced"
---

# Stage 3 Role - QA/Release

| 항목 | 내용 |
| --- | --- |
| Status | Reviewer LGTM |
| Local report | docs/reports/mobile-soul-audit/03-role-qa-release.md |
| 성격 | 비규범 감사 기록. SOUL.md 변경 아님. |

## 9-Section Check

All 00-3 required content is present inside Soul Builder 8-section format. Tooling coverage is present through QA/release and evidence-gate responsibilities.

## Case Mapping

* Direct: Case C-H QA evidence, regression, release readiness, and gate enforcement.
* Review/conditional: Case B QA/evidence requirement review.
* Case A: linked through mobile-project-bootstrap-workflow verification evidence, not a separate QA workflow.

## Required Candidate Update

In Case B, review PRD/Story decomposition to confirm QA/Release tasks, evidence requirements, and release-gate concerns are present.

## Optional Candidates

* For Case A bootstrap, verify template smoke evidence only when QA/Release is explicitly assigned to the bootstrap gate.
* If no selected Case, Task owner, release gate, or evidence target exists, stop and report the missing SoT link instead of inventing a QA workflow.

## Skill Implication

No new skill is justified. Existing mobile-qa-release covers Case C-H; Case A remains linked to mobile-project-bootstrap-workflow evidence.