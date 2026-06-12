# PO Runtime Application Evidence

Date: 2026-06-09

## Scope

Applied Product/Planning SOUL and child operational skill sources as repo-local Codex runtime adapters using required `po-*` names.

## Source Crosswalk

- `po-requirement-office-hours` -> `mobile-requirement-office-hours` page `1374519364`
- `po-work-unit-planning-and-agent-sprint` -> `mobile-work-unit-planning-and-agent-sprint` page `1374650456`
- `po-prd-to-execution` -> `mobile-prd-to-execution` page `1373634562`
- `po-planning-completeness-review` -> `mobile-planning-completeness-review` page `1374519387`
- Parent SOUL: Product/Planning page `1373798422`

## Changed Runtime Surface

- Added Product/Planning adapters:
  - `.agents/skills/po-requirement-office-hours/SKILL.md`
  - `.agents/skills/po-work-unit-planning-and-agent-sprint/SKILL.md`
  - `.agents/skills/po-prd-to-execution/SKILL.md`
  - `.agents/skills/po-planning-completeness-review/SKILL.md`
- Added Product/Planning read-only reviewer/researcher agents:
  - `.codex/agents/po-planning-reviewer.toml`
  - `.codex/agents/po-scope-gate-reviewer.toml`
  - `.codex/agents/po-docs-researcher.toml`
- Added matching Product/Planning eval fixtures under `evals/skills/po-{requirement-office-hours,work-unit-planning-and-agent-sprint,prd-to-execution,planning-completeness-review}/`.
- Added matching Product/Planning agent eval fixtures under `evals/agents/po-{planning-reviewer,scope-gate-reviewer,docs-researcher}/`.
- Updated runtime validator, headless reviewer allowlist, `$wm` reviewer routing docs, local harness skill allowlist, Product/Planning local harness task-readiness checks, and `PROJECT_ENVIRONMENT.md`.

## Verification

- `node scripts/validate-runtime-artifacts.mjs`: FAIL only on current root Claude artifacts outside the `po-*` change set:
  - `CLAUDE.md`
  - `.claude`
- `pnpm run test:runtime`: FAIL at `validate` for the same current root Claude artifacts.
- `node scripts/test-local-harness.mjs --self-test --stage product-planning && node scripts/test-local-harness.mjs --stage product-planning`: PASS.
- `node scripts/test-local-harness.mjs --self-test --stage all && node scripts/test-local-harness.mjs --stage all`: PASS.
- `pnpm run test:local-harness`: FAIL at nested `pnpm run test:runtime` for the same current root Claude artifacts. Preflight passed before the failure.
- `pnpm turbo run lint test`: PASS.
- `pnpm run test:hooks`: PASS, 40 hook fixture tests.

## Reviewer Evidence

- Plan review: `.evidence/po-runtime-application/plan-review.md`
- Final review: `.evidence/po-runtime-application/final-review.md`

## Blocker

The root Claude runtime artifacts are present in the current worktree and are rejected by `scripts/validate-runtime-artifacts.mjs`. They were not removed because they may be user-owned worktree state.

Unrelated worktree changes, including Stitch MCP activation files, Design `po-*` adapter files, mobile web/E2E files, and `.codex/config.toml`, are present in the shared worktree. They are not part of this Product/Planning runtime scope and should be split or reviewed separately before PR readiness is claimed.

## Reviewer Follow-up Fix

The final reviewer found that Case B task fixtures and local harness checks allowed task packets without `Done-when` acceptance criteria or open-decision tracking. The Product/Planning local harness now requires `doneWhen` and `openDecisions` for every Case B task, the expected Case B fixture includes those fields for all owner roles, and `selftest.invalid-missing-task-readiness.json` prevents regression.

The final reviewer also found that Product/Planning custom agents had static validator registration but no agent prompt eval fixtures. The validator now applies agent eval fixture checks to all `po-*` custom agents, including `po-planning-reviewer`, `po-scope-gate-reviewer`, and `po-docs-researcher`.

The final reviewer then found that Case B task packets did not make PRD acceptance-line mapping or concrete evidence paths machine-checkable. The Product/Planning local harness now requires non-empty `acceptanceRefs` in `prd.case-b.fixture.md:<line>` format and concrete evidence paths or URLs, rejects placeholder paths such as `.evidence/<task-id>.json`, the expected Case B fixture includes those fields for every owner role, and `selftest.invalid-missing-acceptance-evidence.json` prevents regression.
