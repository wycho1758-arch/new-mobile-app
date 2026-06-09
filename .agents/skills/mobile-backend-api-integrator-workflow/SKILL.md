---
name: mobile-backend-api-integrator-workflow
description: Use when defining or updating mobile-facing backend API contracts, request/response schemas, auth/session behavior, mocks, fixtures, error mapping, or API integration risks for the new mobile app repo. This thin write-side wrapper applies Backend/API Integrator ownership using the repo SoT domains for API contracts and gatekeeper boundaries; it must not be used for review-only tasks, UI implementation ownership or secret exposure.
---

# Mobile Backend API Integrator Workflow

Use this as a thin write-side role workflow for Backend/API Integrator work that mobile implementation depends on.

Review-only contract tasks must use the read-only `mobile-contract-reviewer` custom agent or code-review mode instead of this workflow.

## Required Inputs

- Task ID and consuming screen/flow.
- Backend source, endpoint draft, or existing API docs.
- Auth/session requirements and tenant/payment/PII risk notes.
- Mock or fixture requirements.

## Workflow

1. Identify the consuming mobile flow and contract boundary.
2. Read `references/sot.md` if the task lacks Confluence/source links.
3. Define request, response, error, loading, retry, and auth/session behavior.
4. Create or update mock fixtures before Mobile App Dev implementation consumes them.
5. Record risks, breaking changes, and owner for unresolved backend work.
6. Run contract/schema checks and record evidence.

## Forbidden

- Letting Mobile App Dev infer API shape from UI code.
- Exposing secrets, tokens, or private customer data.
- Silently changing UX decisions.
- Self-approving contract changes without reviewer evidence.

## Required Evals

- Positive: API contract and fixture request triggers this skill.
- Negative: pure UI styling task does not trigger this skill.
- Negative: review-only contract review request does not trigger this skill.
- Risk: tenant/payment/PII prompt produces explicit risk notes and next owner.
