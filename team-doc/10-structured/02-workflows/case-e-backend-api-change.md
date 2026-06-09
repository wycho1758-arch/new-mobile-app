---
docType: "procedure"
sourcePageId: "1373667425"
sourceTitle: "01-3. Workflows — Case A~H"
sourceVersion: "2"
sourceHeading: "Case E. Backend/API 변경 중심 작업"
---

# Case E. Backend/API 변경 중심 작업

Safely deliver the backend/API changes that the mobile app depends on.

**Goal:** Handle mobile-facing backend/API changes in a controlled, compatibility-aware way.

**Participants:**

- Backend/API Integrator — leads
- Mobile Architect, Mobile App Dev, QA/Release — review

**Procedure:**

1. Backend/API Integrator drafts the contract change proposal.
2. Mobile Architect reviews the app-side impact scope.
3. Changes touching payment, PII, external dispatch, or legal are escalated to a human gate (a separate approval distinct from impact review).
4. Implement in the backend repo or backend task.
5. Update API tests and contract fixtures.
6. Mobile App Dev validates on an integration branch.
7. QA/Release runs the E2E smoke.

**Done criteria:**

- A backward-compatibility or migration note exists.
- Auth/token/tenant/payment impact review is complete.
- Mobile integration evidence exists.
- The `mobile-gatekeeper` required check passes, author ≠ approver, and `rework_count` is below the cap.

## Source

- Page ID: 1373667425
- Source heading: Case E. Backend/API 변경 중심 작업
- Source version: 2
