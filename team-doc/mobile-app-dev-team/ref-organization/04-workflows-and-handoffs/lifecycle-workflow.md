# Lifecycle Workflow

Status: reusable template guidance
Source class: procedure
Upstream SoT:

- `team-doc/mobile-app-dev-team/05-work-processes.md`
- `team-doc/mobile-app-dev-team/10-github-artifact-workflow.md`

Downstream consumers:

- Future workflow pages.
- Durable handoff and gate/evidence pages.

Last reviewed date: 2026-06-10
Reviewer evidence: .evidence/reviews/ref-organization-checkpoint-5-xhigh-20260610.md

## Intake And Planning

Product/Planning receives the request, clarifies scope, records non-goals, routes human gates, and creates executable work. Broad or ambiguous requests must stop for planning clarity before implementation.

For pod-isolated role-agent work, create or update `docs/plans/work-units/<work-unit-id>/` before downstream pods need the result.

## Design Readiness

Design receives an approved requirement, confirms the design source decision, prepares P0/P1 scope/evidence gates, creates exactly two design options when using Stitch, and requests Reviewer(xhigh) before Mobile App Dev implementation.

## API Readiness

Backend/API Integrator confirms or updates `packages/contracts`, aligns mocks/fixtures/auth/error mapping, and hands stable contract evidence to Mobile App Dev and QA/Release.

## Implementation

The owning implementation role works tests-first, runs applicable checks, records command output with exit status, and requests Reviewer(xhigh) before Done.

## QA And Release Evidence

QA/Release plans evidence, resets the tested instance, runs RN Web, Maestro, mobile-mcp, Railway, EAS, or manual HUMAN-GATE evidence as applicable, and classifies failures.

## Failure Loop

Failed checks route through the Failure Loop. Risk acceptance after failed gates belongs to Product/Planning or a human owner, not the implementation role.
