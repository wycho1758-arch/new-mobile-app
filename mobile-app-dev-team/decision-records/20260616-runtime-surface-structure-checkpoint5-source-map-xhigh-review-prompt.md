# xhigh Review Prompt: Runtime Surface Structure Checkpoint 5 Source Map Finalization

You are `wm-implementation-reviewer` in read-only mode.

Review the staged Checkpoint 5 source-map finalization for the
runtime-surface-structure goal plan. Checkpoints 1 through 4 already received
`GO`; do not re-litigate approved prior scope unless Checkpoint 5 introduces a
conflict.

Baseline HEAD:

```text
3551319c01ded8d0996e824699df3953d7b69b92
```

Required goal-plan checkpoint:

```text
Checkpoint 5. Source map and crosswalk finalization

Purpose:
- source-map.md explains every old-to-new path and runtime class.

Targets:
- mobile-app-dev-team/source-map.md
- mobile-app-dev-team/README.md
- mobile-app-dev-team/ref-organization/source-map-and-migration/README.md
- TEAM_DOC_ARCHIVE_MANIFEST.json / TEAM_DOC_ARCHIVE_BUNDLE.jsonl only if
  historical archive sources change.

Required sections:
- Current Repo Sources
- Runtime Surface Classes
- Old-To-New Rename Crosswalk
- Validator Responsibility Crosswalk
- Harness Applicability Crosswalk
- Historical/Archive Crosswalk
- External Proof Boundary

Gate:
- source-map validator
- archive validator if archive paths changed
- pnpm run test:runtime
- Reviewer final GO
```

Checkpoint 5 incremental paths:

```text
.agents/skills/mobile-app-dev-workflow/references/sot.md
.agents/skills/mobile-backend-api-integrator-workflow/references/sot.md
mobile-app-dev-team/99-source-map.md
mobile-app-dev-team/source-map.md
mobile-app-dev-team/README.md
mobile-app-dev-team/governance/sot-and-principles.md
mobile-app-dev-team/ref-organization/README.md
mobile-app-dev-team/ref-organization/source-map-and-migration/README.md
mobile-app-dev-team/reports/runtime-surface-classification-improvement-report.md
mobile-app-dev-team/reports/runtime-surface-classification-improvement-report-v2.md
scripts/validate-reference-docs.mjs
scripts/validate-repo-operations.mjs
scripts/validate-team-doc-managed.mjs
scripts/validate-team-doc-structure.mjs
.evidence/reviews/20260616-runtime-surface-structure-checkpoint5-source-map-command-output.md
```

Evidence to review:

```text
.evidence/reviews/20260616-runtime-surface-structure-checkpoint5-source-map-command-output.md
```

Please verify:

1. `mobile-app-dev-team/99-source-map.md` is removed from the staged index and
   `mobile-app-dev-team/source-map.md` is the current source-map path.
2. `mobile-app-dev-team/source-map.md` contains the required sections:
   `Current Repo Sources`, `Runtime Surface Classes`,
   `Old-To-New Rename Crosswalk`, `Validator Responsibility Crosswalk`,
   `Harness Applicability Crosswalk`, `Historical/Archive Crosswalk`, and
   `External Proof Boundary`.
3. The old-to-new crosswalk includes the structure rename families and runtime
   classes, including current completed paths and compatibility-window paths
   that were not part of this plan.
4. Active references outside the approved goal-plan mapping/risk note,
   validator legacy checks, and the source-map crosswalk row no longer point to
   `99-source-map.md`.
5. Validators reject the legacy filename while still preserving the intended
   compatibility window for out-of-scope future moves such as
   `04-skills-and-agents-matrix.md`,
   `16-pod-environment-bootstrap.md`, and
   `17-orbstack-pod-config-values.md`.
6. `TEAM_DOC_ARCHIVE_MANIFEST.json` and `TEAM_DOC_ARCHIVE_BUNDLE.jsonl` are not
   changed by this checkpoint; archive validation is supporting evidence only.
7. Required evidence exists for the RED validator failure, green
   `validate:team-doc`, green `validate:reference-docs`, green
   `test:runtime`, archive validator support, evidence hygiene, stale-reference
   scan, and whitespace checks.
8. The checkpoint does not add app/package/API/native/infra behavior changes.

Return a concise findings-first review and a final verdict of `GO` or `NO_GO`.
Use `GO` only if the source-map finalization is safe and the implementation can
proceed to final full verification.
