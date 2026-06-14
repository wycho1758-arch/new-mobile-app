# Decision Records

This directory stores durable, repo-local decision records that active managed
team documents cite as Source of Truth support.

Directory path: `mobile-app-dev-team/decision-records/`

Use this directory for source-cited planning, scope, design, architecture,
runtime, gate, or reviewer decisions that must remain tracked with
`mobile-app-dev-team/` documents.

Do not use this directory for local scratch evidence, raw logs, secrets, live
platform proof, or temporary reviewer output. Local reviewer scratch output and
tool evidence belongs outside tracked source control unless an accepted SoT
requires a durable tracked artifact.

The repository ignores `.evidence/**`; durable managed-doc decisions that must
be tracked should live here instead of under `.evidence/`.

Migrated records:

- `20260614-entry-case-cp2-p1-decision.md` — Design relevance and P-1
  `not-applicable` criteria decision.
- `20260614-entry-case-risk2-runtime-binding-decision.md` — partial runtime
  binding decision for `01-design` `not-applicable` non-goal evidence.
- `20260614-entry-case-cp3-decision.md` — cross-work-unit prioritization and
  expedited hotfix governance decision.
- `20260614-followup1-precise-rule-decision.md` — `production-submit`
  rollback field validation decision.
