# Workflows And Handoffs

Status: reusable template guidance
Source class: index
Upstream SoT:

- `mobile-app-dev-team/05-work-processes.md`
- `mobile-app-dev-team/10-github-artifact-workflow.md`
- `mobile-app-dev-team/_archive/12-ref-organization-goal-plan.md`

Downstream consumers:

- Future workflow and durable handoff pages.
- Gate and evidence pages.

Last reviewed date: 2026-06-10
Reviewer evidence: .evidence/reviews/ref-organization-checkpoint-2-xhigh-20260610.md

## Purpose

This consolidated section keeps the reusable reference-organization guidance in one navigable document. The former per-topic markdown files are listed below and preserved in `mobile-app-dev-team/_archive/ref-organization-preconsolidation-20260612/` for historical traceability.

## Consolidated Former Files

- `durable-github-work-unit.md` -> consolidated below
- `failure-loop.md` -> consolidated below
- `lifecycle-workflow.md` -> consolidated below
- `scenario-overlays-a-h.md` -> consolidated below

## Durable GitHub Work Unit

Former file: `durable-github-work-unit.md`

### Boundary

Pod-isolated role agents must use GitHub branch/commit/PR artifacts for durable handoff. Local workspace state is not a durable handoff.

The durable root is:

```text
docs/plans/work-units/<work-unit-id>/
```

### Required Artifact Fields

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

### Evidence Rule

Work-unit files may summarize canonical evidence, but they do not replace canonical evidence. Link to the original `.evidence/e2e-test/...`, mobile-mcp, Railway, EAS, human approval, or other canonical evidence path.

Do not use ignored local paths as durable handoff channels:

- `.evidence/local/`
- `.evidence/tmp/`
- `.evidence/**/*.log`
- `.evidence/**/raw/`

### Gatekeeper Rule

Release Gatekeeper (System) records deterministic check status from evidence. It does not approve failed gates or replace human approval.

## Failure Loop

Former file: `failure-loop.md`

### Procedure

1. Failed check remains failed.
2. `wm-gate-fix-advisor` or another read-only advisor may classify the failure.
3. The owning implementation workflow fixes the issue.
4. QA/Release reruns or records the relevant evidence.
5. Product/Planning or a human owner handles rework caps, scope decisions, and failed-gate risk acceptance.

### Rules

- Do not relabel a failed gate as passed.
- Do not let a reviewer become the implementation owner.
- Do not let QA/Release accept product risk.
- Do not let implementation roles accept failed-gate risk acceptance.

## Lifecycle Workflow

Former file: `lifecycle-workflow.md`

### Intake And Planning

Product/Planning receives the request, clarifies scope, records non-goals, routes human gates, and creates executable work. Broad or ambiguous requests must stop for planning clarity before implementation.

For pod-isolated role-agent work, create or update `docs/plans/work-units/<work-unit-id>/` before downstream pods need the result.

### Design Readiness

Design receives an approved requirement, confirms the design source decision, prepares P0/P1 scope/evidence gates, creates exactly two design options when using Stitch, and requests Reviewer(xhigh) before Mobile App Dev implementation.

### API Readiness

Backend/API Integrator confirms or updates `packages/contracts`, aligns mocks/fixtures/auth/error mapping, and hands stable contract evidence to Mobile App Dev and QA/Release.

### Implementation

The owning implementation role works tests-first, runs applicable checks, records command output with exit status, and requests Reviewer(xhigh) before Done.

### QA And Release Evidence

QA/Release plans evidence, resets the tested instance, runs RN Web, Maestro, mobile-mcp, Railway, EAS, or manual HUMAN-GATE evidence as applicable, and classifies failures.

### Failure Loop

Failed checks route through the Failure Loop. Risk acceptance after failed gates belongs to Product/Planning or a human owner, not the implementation role.

## Scenario Overlays A-H

Former file: `scenario-overlays-a-h.md`

### Rule

The A-H cases are scenario overlays, not primary navigation. They must be rewritten against current SoT before being used as execution procedure.

### Scenario Index

- Case A: project bootstrap.
- Case B: PRD breakdown.
- Case C: UI-only feature.
- Case D: API-backed feature.
- Case E: backend/API change.
- Case F: gate failure.
- Case G: preview/internal release.
- Case H: production submit.

### Migration Rule

Each scenario must map back to lifecycle workflow, durable GitHub handoff, required gates, human gates, and canonical evidence. If an old scenario conflicts with current SoT, current SoT wins.
