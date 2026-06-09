# PRD Fixture: Case A Bootstrap

## Scope

Create a new mobile app repository instance from the approved template and verify the organization operating layer is ready.

## Non-Goals

- Do not implement application features.
- Do not modify external platform/runtime repositories.
- Do not create GitHub repositories, branch protection, Confluence pages, Jira issues, Tasks, or EAS secrets from this fixture.
- Do not record token or secret values.

## Required Routing

- Product/Planning records repo purpose, initial scope, non-goals, and open decisions.
- Operator(human) owns repo creation, template variable input, organization-runtime skill install, required check registration, branch protection, and secret injection.
- Mobile Architect checks template defaults and records deviations as ADR-style evidence.
- QA/Release checks EAS/Maestro/evidence readiness.
- Mobile App Dev checks initial app shell and `packages/contracts` import.
- Gatekeeper remains non-LLM deterministic check only.
