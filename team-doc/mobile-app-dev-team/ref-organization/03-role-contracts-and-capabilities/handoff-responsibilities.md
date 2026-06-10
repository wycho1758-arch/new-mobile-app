# Handoff Responsibilities

Status: reusable template guidance
Source class: reference
Upstream SoT:

- `team-doc/mobile-app-dev-team/10-github-artifact-workflow.md`
- `team-doc/mobile-app-dev-team/05-work-processes.md`
- `team-doc/mobile-app-dev-team/06-gates-and-evidence.md`

Downstream consumers:

- Workflow and durable handoff pages.
- Future work-unit artifact templates.

Last reviewed date: 2026-06-10
Reviewer evidence: .evidence/reviews/ref-organization-checkpoint-4-xhigh-20260610.md

## Required Handoff Fields

Every execution task or durable role artifact must identify:

- owner
- input artifact
- output artifact
- acceptance criteria
- evidence requirement
- dependencies/blockers
- open decisions
- next responsible role

When work leaves the current pod or role runtime, the handoff must also include:

- GitHub branch/commit/PR
- `docs/plans/work-units/<work-unit-id>/`
- exact artifact path
- reviewer evidence path
- command output with exit status when applicable

## Handoff Rule

Local workspace state is not a durable handoff between pod-isolated agents. Use committed GitHub artifacts and work-unit docs for downstream consumption.

## Evidence Rule

Summary files can point to canonical evidence, but they do not replace canonical evidence. For example, work-unit QA summaries must link the actual E2E, mobile-mcp, Railway, EAS, or human approval evidence instead of copying only status claims.
