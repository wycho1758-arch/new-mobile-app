---
docType: "procedure"
sourcePageId: "1373667425"
sourceTitle: "01-3. Workflows — Case A~H"
sourceVersion: "2"
sourceHeading: "Case D. API-backed feature"
---

# Case D. API-backed feature

Workflow for features that need both a mobile screen and a backend/API contract.

## Participants

- Design — defines the screen and its states.
- Mobile Architect and Backend/API Integrator — jointly review the contract.
- Mobile App Dev — implements.
- QA/Release — Maestro flow plus evidence.
- Product/Planning has no direct action in Case D execution; it defines the task earlier during decomposition (Case B).

## Procedure

1. Design defines the screen and its states.
2. Freeze the contract with `mobile-api-contract`.
3. Backend/API Integrator decides whether a backend change is required.
4. If a backend change is needed, split it into a separate backend task/PR.
5. Mobile App Dev implements against the mock or the finalized API.
6. QA/Release adds a contract-based Maestro flow and records EAS Workflows run results in `.evidence/<task-id>.json`.
7. Gatekeeper checks the PR, SHA, EAS, Maestro, and evidence.

## Completion criteria

- API contract document exists.
- Mobile and backend PRs are linked to each other.
- Differences between the mock and the real API are recorded.
- Maestro flow passes.
- Author and approver are different.
- Auth/token/tenant/payment impact review is complete (Backend/API Integrator — symmetric with Case E).
- Screen spec matches the implementation (Design reviews against design intent).

## Source

- Page ID: 1373667425
- Source heading: Case D. API-backed feature
- Source version: 2
