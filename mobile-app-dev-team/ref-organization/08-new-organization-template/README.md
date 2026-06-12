# New Organization Template

Status: reusable template guidance
Source class: index
Upstream SoT:

- `mobile-app-dev-team/07-new-team-template-guide.md`
- `mobile-app-dev-team/_archive/12-ref-organization-goal-plan.md`

Downstream consumers:

- Future team creation work.
- Product/Planning migration and planning workflows.

Last reviewed date: 2026-06-10
Reviewer evidence: .evidence/reviews/ref-organization-checkpoint-2-xhigh-20260610.md

## Purpose

This consolidated section keeps the reusable reference-organization guidance in one navigable document. The former per-topic markdown files are listed below and preserved in `mobile-app-dev-team/_archive/ref-organization-preconsolidation-20260612/` for historical traceability.

## Consolidated Former Files

- `checklist.md` -> consolidated below
- `create-new-team-guide.md` -> consolidated below
- `variable-map.md` -> consolidated below

## Checklist

Former file: `checklist.md`

### Readiness Checklist

- Source inputs frozen.
- Runtime surfaces separated.
- Roles and gates separated.
- Durable handoff defined.
- Skills and agents mapped to actual runtime paths.
- Evidence paths defined.
- Human gates listed.
- Reviewer(xhigh) completed.
- Validation commands passed.

### Stop Conditions

Stop if source priority is unclear, runtime path ownership is ambiguous, deterministic gates are treated as LLM roles, or validation cannot prove the claimed structure.

## Create New Team Guide

Former file: `create-new-team-guide.md`

### Procedure

1. Freeze Source Inputs.
2. Define Team Shape.
3. Write Role SOUL.md Files.
4. Create Capability Matrix.
5. Create Skill/Agent Matrix.
6. Define Process.
7. Add Validation.
8. Run Reviewer(xhigh).

### Rules

- Separate current managed docs from historical source exports.
- Separate runtime surfaces before authoring skills or agents.
- Keep deterministic gates separate from LLM roles.
- Add validators before relying on new structure.

## Variable Map

Former file: `variable-map.md`

### Variables

| Variable | Meaning |
| --- | --- |
| `organization_name` | Human-readable team or organization name. |
| `repo_root` | Repository root for current SoT and validation. |
| `managed_docs_root` | Current managed docs path. |
| `runtime_surfaces` | Repo-local, pod-native, pod-local, external, and human-gated surfaces. |
| `role_families` | Stable role groupings and Operating Role values. |
| `human_gates` | Decisions that require recorded human approval. |
| `evidence_paths` | Canonical evidence locations. |

### Rule

Never hardcode customer app names, bundle IDs, API URLs, tokens, or credentials into reusable templates.
