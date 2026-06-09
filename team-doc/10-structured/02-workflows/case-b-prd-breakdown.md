---
docType: "procedure"
sourcePageId: "1373667425"
sourceTitle: "01-3. Workflows — Case A~H"
sourceVersion: "2"
sourceHeading: "Case B. PRD 접수와 Epic/Task 분해"
---

# Case B. PRD 접수와 Epic/Task 분해

Turn PRD input into Epic, Story, and role-owned Tasks with acceptance and evidence requirements.

## Goal

Convert a user-provided PRD into an agent-executable backlog.

## Participants

- Product/Planning — leads.
- Design, Mobile Architect, Backend/API Integrator, QA/Release — review.

## Procedure

1. Run the `mobile-prd-to-execution` skill.
2. Create the Confluence PRD or document SoT.
3. Create Jira Epic/Story.
4. Create Tasks.
5. Create the feature room.
6. Assign each task an owner role, expected output, and evidence requirement.

## Done conditions

- Epics and Stories link back to PRD acceptance criteria.
- Tasks are split by role.
- Whether an API is needed is flagged.
- QA/Release tasks are not omitted.
- A scope decision log exists (accepted / deferred / non-goal records).
- Work items touching production submit, payment, PII, external dispatch, or legal carry a human-gate marker.

## Source

- Page ID: 1373667425
- Source heading: Case B. PRD 접수와 Epic/Task 분해
- Source version: 2
