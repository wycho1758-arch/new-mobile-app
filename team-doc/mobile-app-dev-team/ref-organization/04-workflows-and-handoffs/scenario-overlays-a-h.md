# Scenario Overlays A-H

Status: historical source migration
Source class: reference
Upstream SoT:

- `team-doc/mobile-app-dev-team/ref-organization/99-source-map-and-migration/old-to-new-crosswalk.md`
- `team-doc/10-structured/02-workflows/`

Downstream consumers:

- Future scenario rewrite work.
- Lifecycle workflow pages.

Last reviewed date: 2026-06-10
Reviewer evidence: .evidence/reviews/ref-organization-checkpoint-5-xhigh-20260610.md

## Rule

The A-H cases are scenario overlays, not primary navigation. They must be rewritten against current SoT before being used as execution procedure.

## Scenario Index

- Case A: project bootstrap.
- Case B: PRD breakdown.
- Case C: UI-only feature.
- Case D: API-backed feature.
- Case E: backend/API change.
- Case F: gate failure.
- Case G: preview/internal release.
- Case H: production submit.

## Migration Rule

Each scenario must map back to lifecycle workflow, durable GitHub handoff, required gates, human gates, and canonical evidence. If an old scenario conflicts with current SoT, current SoT wins.
