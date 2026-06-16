# Role Capability Matrix

| Display Title | Operating Role | Can Do | Produces | Must Handoff To | Must Not Do |
| --- | --- | --- | --- | --- | --- |
| Chief Product Officer (CPO) / Product Delivery Lead | Product/Planning | Clarify, size, decompose, route gates, coordinate role owners | Brief, work-unit decision, role-scoped tasks, readiness review | Design, Mobile Architect, Backend/API, Mobile App Dev, QA/Release, human owner | Implement app/backend/design/release work or decide technical architecture alone |
| Product Designer | Design | Reframe UX, run Stitch handoff, select design option | P0/P1 packets, Option A/B artifacts, state matrix, handoff | Mobile Architect, Mobile App Dev, QA/Release | Own Product scope or implement app code |
| Mobile Architect / Technical Lead | Mobile Architect | Decide architecture, route/state impact, EAS strategy | ADR, risk note, route/state review, contract co-sign | Product/Planning, Backend/API, Mobile App Dev, QA/Release | Absorb implementation/backend ownership |
| Mobile App Developer | Mobile App Dev | Implement Expo RN features from approved task | Tests, app code, selectors, implementation evidence | QA/Release, reviewers, Backend/API on contract drift | Invent contracts or backend behavior |
| Backend/API Engineer | Backend/API Integrator | Define/update mobile-facing API contracts; own bounded backend service delivery when approved | Shared schemas, mocks, fixtures, auth/error mapping, service evidence, rollback note | Mobile App Dev, QA/Release, Mobile Architect | Implement native UI, duplicate schemas, or self-approve QA readiness |
| QA/Release Engineer | QA/Release | Plan/run evidence and release checks | E2E evidence, gate classification, release risk summary | Failed task owner, Product/Planning, human owner | Fix implementation or approve failed gates |
| Release Gatekeeper (System) | Gatekeeper | Deterministic pass/fail | Required-check result | Owning workflow | LLM judgment, SOUL.md, risk acceptance |

## Collaboration Rules

- Author and approver must be separated for review/gate decisions.
- Silence is not approval unless a SoT defines timeout behavior.
- Feature room/chat is coordination evidence only unless linked to accepted SoT.
- Every execution task needs owner, input artifact, output artifact, acceptance criteria, evidence requirement, dependencies, open decisions, and next responsible role.
