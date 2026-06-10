# Durable GitHub Work Unit

Status: reusable template guidance
Source class: procedure
Upstream SoT:

- `mobile-app-dev-team/10-github-artifact-workflow.md`
- `mobile-app-dev-team/06-gates-and-evidence.md`

Downstream consumers:

- Future work-unit artifact templates.
- QA and gate evidence pages.

Last reviewed date: 2026-06-10
Reviewer evidence: .evidence/reviews/ref-organization-checkpoint-5-xhigh-20260610.md

## Boundary

Pod-isolated role agents must use GitHub branch/commit/PR artifacts for durable handoff. Local workspace state is not a durable handoff.

The durable root is:

```text
docs/plans/work-units/<work-unit-id>/
```

## Required Artifact Fields

Each role artifact must include:

- `status: required | not-applicable | deferred/non-goal`
- PRD acceptance line or explicit non-goal reference
- owner
- input artifact
- output artifact
- acceptance criteria
- evidence requirement
- dependencies/blockers
- open decisions
- next responsible role
- GitHub branch/commit/PR handoff link when work leaves the current pod

## Evidence Rule

Work-unit files may summarize canonical evidence, but they do not replace canonical evidence. Link to the original `.evidence/e2e-test/...`, mobile-mcp, Railway, EAS, human approval, or other canonical evidence path.

Do not use ignored local paths as durable handoff channels:

- `.evidence/local/`
- `.evidence/tmp/`
- `.evidence/**/*.log`
- `.evidence/**/raw/`

## Gatekeeper Rule

Release Gatekeeper (System) records deterministic check status from evidence. It does not approve failed gates or replace human approval.
