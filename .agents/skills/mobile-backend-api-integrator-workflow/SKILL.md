---
name: mobile-backend-api-integrator-workflow
description: Use when defining or updating mobile-facing backend API contracts, request/response schemas, auth/session behavior, mocks, fixtures, error mapping, or API integration risks for the new mobile app repo. This thin write-side wrapper applies Backend/API Integrator ownership using the repo SoT domains for API contracts and gatekeeper boundaries; it must not be used for review-only tasks, UI implementation ownership or secret exposure.
---

# Mobile Backend API Integrator Workflow

Use this as a thin write-side role workflow for Backend/API Integrator work that mobile implementation depends on.

Review-only contract tasks must use the read-only `wm-contract-reviewer` custom agent or code-review mode instead of this workflow.

## Required Inputs

- Task ID and consuming screen/flow.
- Backend source, endpoint draft, or existing API docs.
- Auth/session requirements and tenant/payment/PII risk notes.
- Mock or fixture requirements.
- Work-unit artifact path under `docs/plans/work-units/<work-unit-id>/03-contract-api/`.
- Migration, rollback, runtime smoke, service evidence, and reviewer requirements when backend behavior changes.

## Workflow

1. Identify the consuming mobile flow and contract boundary.
2. Read `references/sot.md` if the task lacks Confluence/source links.
3. Produce a Codex API Contract Plan Packet before contract edits and request the plan reviewer when the change is non-trivial.
4. Define request, response, error, loading, retry, and auth/session behavior.
5. Define or update `packages/contracts` zod schema names and TypeScript exports before app/API consumers use them.
6. Create or update mock fixtures before Mobile App Dev implementation consumes them.
7. Record migration, rollback, runtime smoke, service evidence, risks, breaking changes, and owner for unresolved backend work.
8. Run contract/schema checks and record evidence.
9. Request the final reviewer before reporting Done.
10. Run `git diff` for changed paths and `git status --short`; include the material change summary in the user report.

## Codex API Contract Plan Packet

Every Backend/API Integrator plan must include:

- work-unit ID and `03-contract-api/` artifact path;
- consuming mobile flow and owner;
- endpoint method/path, request schema, response schema, and error schema;
- `packages/contracts` zod schema names and generated TypeScript type impact;
- auth/session behavior, retry behavior, and error mapping;
- mock/fixture paths and compatibility notes for Mobile App Dev;
- migration and rollback assessment;
- runtime smoke command and service evidence path when service behavior changes;
- plan reviewer and final reviewer;
- non-goals, blockers, and human-gate risks;
- completion requirement to report `git diff` and `git status --short`.

If a request is UI implementation, screen styling, or React Native component work, stop and hand off to Mobile App Dev.

## Forbidden

- Letting Mobile App Dev infer API shape from UI code.
- Exposing secrets, tokens, or private customer data.
- Silently changing UX decisions.
- Self-approving contract changes without reviewer evidence.
- Reporting completion before final reviewer evidence, `git diff`, and `git status --short`.

## Required Evals

- Positive: API contract and fixture request triggers this skill.
- Negative: pure UI styling task does not trigger this skill.
- Negative: review-only contract review request does not trigger this skill.
- Risk: tenant/payment/PII prompt produces explicit risk notes and next owner.
