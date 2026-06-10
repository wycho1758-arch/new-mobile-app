# Optional API

Status: current-project example
Source class: reference
Upstream SoT:

- `AGENTS.md`
- `PROJECT_ENVIRONMENT.md`

Downstream consumers:

- Backend/API Integrator planning.
- New organization template variables.

Last reviewed date: 2026-06-10
Reviewer evidence: .evidence/reviews/ref-organization-final-rereview-xhigh-20260610.md

## Current Project Example

`apps/api` is optional and used only when a new backend is required.

`packages/contracts` is the single source of truth for mobile-facing API request/response schemas and shared domain types.

The current API layering direction is:

```text
routes -> services -> db
```

Reverse imports are forbidden.

## Reuse Rule

Future organizations may omit `apps/api` when integrating with an existing backend, but they still need a contract owner and evidence for mock-vs-real drift.
