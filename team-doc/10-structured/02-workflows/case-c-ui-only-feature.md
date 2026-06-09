---
docType: "procedure"
sourcePageId: "1373667425"
sourceTitle: "01-3. Workflows — Case A~H"
sourceVersion: "2"
sourceHeading: "Case C. UI-only feature"
---

# Case C. UI-only feature

Implement a screen or UX change with no backend modifications, gated by design-intent review and Maestro evidence.

## Goal

Build screen/UX work only — no backend or API contract changes are involved.

## Participants

- Design
- Mobile Architect
- Mobile App Dev
- QA/Release

## Procedure

1. Design defines the screen states; QA/Release writes UX acceptance criteria that can be translated into Maestro flows.
2. Mobile Architect confirms the route/state impact is small.
3. Mobile App Dev implements the change and adds appropriate component/unit tests.
4. QA/Release adds a Maestro smoke or targeted flow and records the EAS Workflows run results (workflow run id, build id, Maestro outcome) in `.evidence/<task-id>.json`.
5. Run the `mobile-gatekeeper` self-check, then open the PR.
6. The GitHub required check blocks or allows the merge.

## Completion criteria

- Screen spec matches the implementation (Design reviews the build against design intent).
- Maestro smoke passes.
- Evidence JSON is generated.
- PR review is complete with a non-author reviewer (Mobile Architect or Design), satisfying author ≠ approver.

## Source

- Page ID: 1373667425
- Source heading: Case C. UI-only feature
- Source version: 2
