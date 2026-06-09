# PRD Fixture: Case B PRD Decomposition

## Request

Add a member check-in screen that shows a member profile, current check-in status, and a check-in button. The screen needs API data and must be verifiable in preview before production.

## Acceptance Criteria

- Default, loading, empty, error, and permission-denied states are defined before implementation.
- API contract is fixed before Mobile App Dev consumes it.
- QA/Release owns Maestro evidence and preview readiness.
- Production submit is out of scope and requires a separate human approval if later requested.

## Non-Goals

- Do not implement mobile UI in this planning fixture.
- Do not modify external platform/runtime repositories.
- Do not create Jira, Tasks, or Confluence side effects.
