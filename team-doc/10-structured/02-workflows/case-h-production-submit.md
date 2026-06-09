---
docType: "procedure"
sourcePageId: "1373667425"
sourceTitle: "01-3. Workflows — Case A~H"
sourceVersion: "2"
sourceHeading: "Case H. Production submit"
---

# Case H. Production submit

Drive App Store / Play Store submission under a controlled human gate.

## Goal

- Submit to App Store / Play Store only under a controlled human gate.

## Participants

- QA/Release — leads.
- Product/Planning — provides human approval.
- Mobile Architect.

## Human gate

- A Security/Privacy checklist performed by a human; this gate is not a separate LLM agent.

## Procedure

1. Collect release candidate evidence.
2. Run payment / PII / external-dispatch / legal / store-policy checks.
3. Obtain human approval.
4. Run EAS Submit. The Confluence template's `build-and-submit.yml` workflow is never auto-triggered — it runs manually only, after the human approval is recorded.
5. Record the result in Confluence / Jira / the room.

## Completion criteria

- Advancement precondition: mobile-gatekeeper required check passing, evidence present, author ≠ approver, and `rework_count` below cap — production additionally requires a recorded human approval.
- Human approval record exists (Product/Planning).
- EAS submit id exists (QA/Release).
- Store status recorded (QA/Release — manually track and record the store review status after submission).
- Rollback / update plan exists (Product/Planning + Mobile Architect, who own release risk and rollback).

## Source

- Page ID: 1373667425
- Source heading: Case H. Production submit
- Source version: 2
