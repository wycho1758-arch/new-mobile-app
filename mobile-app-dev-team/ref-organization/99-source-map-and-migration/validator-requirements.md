# Validator Requirements

Status: reusable template guidance
Source class: validator planning
Upstream SoT:

- `mobile-app-dev-team/12-ref-organization-goal-plan.md`
- `mobile-app-dev-team/ref-organization/99-source-map-and-migration/old-to-new-crosswalk.md`
- `AGENTS.md`
- `.agents/skills/wm/SKILL.md`

Downstream consumers:

- Future `scripts/validate-team-doc.mjs` changes.
- Checkpoint 2 skeleton and page status header work.
- Checkpoint 6 final validation and index integration.

Last reviewed date: 2026-06-10
Reviewer evidence: .evidence/reviews/ref-organization-checkpoint-1-xhigh-20260610.md

## Purpose

This file defines validator requirements before the full `ref-organization/` content migration begins. It is intentionally a planning artifact, not the validator implementation.

## Minimum Validator Requirements For Future Checkpoints

When `scripts/validate-team-doc.mjs` is updated for `ref-organization/`, it should verify:

1. `mobile-app-dev-team/ref-organization/README.md` exists after Checkpoint 2.
2. Each planned top-level section exists after Checkpoint 2:
   - `00-orientation-and-sot`
   - `01-organization-model`
   - `02-runtime-surfaces`
   - `03-role-contracts-and-capabilities`
   - `04-workflows-and-handoffs`
   - `05-skills-agents-and-tools`
   - `06-gates-evidence-and-audit`
   - `07-repo-template-and-runtime`
   - `08-new-organization-template`
   - `99-source-map-and-migration`
3. Every `ref-organization/**/*.md` page has a page status block or equivalent fields:
   - `Status`
   - `Source class`
   - `Upstream SoT`
   - `Downstream consumers`
   - `Last reviewed date`
   - `Reviewer evidence`
4. `old-to-new-crosswalk.md` references every structured file listed in root
   `TEAM_DOC_ARCHIVE_MANIFEST.json` and backed by
   `TEAM_DOC_ARCHIVE_BUNDLE.jsonl`; do not enumerate the live
   `team-doc/10-structured/` directory for coverage.
5. Crosswalk status values are limited to:
   - `move`
   - `rewrite`
   - `archive-as-scenario`
   - `current-project-example`
   - `drop-with-reason`
6. Every crosswalk row must include a non-empty target or, for `drop-with-reason`, an explicit drop reason.
7. Crosswalk targets must be under `mobile-app-dev-team/ref-organization/` unless the row is `drop-with-reason`.
8. Crosswalk targets should use full repository-relative paths, not section-local shorthand.
9. No `ref-organization` page may describe `team-doc/10-structured/` as current SoT.
   Historical path references must route validation through the root archive files.
10. Runtime surface pages must keep these paths distinct:
   - `.agents/skills/<skill-name>/SKILL.md`
   - `.codex/agents/<agent-name>.toml`
   - `.codex/hooks.json` and `.codex/hooks/`
   - `.codex/config.toml`
   - `/workspace/skills/<slug>/SKILL.md`
   - `/workspace/codex-hooks`
   - computer-use/tool surfaces
11. Pod-native OpenClaw skill pages must not imply `/workspace/skills/<slug>/SKILL.md` is a repo-local `.agents/skills` artifact.
12. Pod Codex completion hook pages must not imply `/workspace/codex-hooks` is a repo-local `.codex/hooks` artifact.
13. Computer-use/tool surface pages must document:
    - owner role or routing owner
    - allowed use cases
    - evidence boundary
    - whether the surface is repo-local, pod-local, external, or human-gated
    - that it is not a repo-local Codex artifact unless a SoT says so
14. Gatekeeper pages must include the no-SOUL invariant:
    - Gatekeeper is non-LLM.
    - Gatekeeper is deterministic.
    - Gatekeeper has no SOUL.md.
    - Gatekeeper cannot replace human approval or accept failed-gate risk.
15. Durable handoff pages must include:
    - `docs/plans/work-units/<work-unit-id>/`
    - GitHub branch/commit/PR handoff
    - canonical evidence links instead of ignored local evidence paths
16. Reviewer/researcher pages must preserve read-only, source-cited, non-recursive constraints.
17. Human gate pages must include production submit, payment, privacy/PII, external messaging, legal/compliance, business/budget decisions, irreversible scope tradeoffs, and failed-gate risk acceptance.
18. No page may include concrete secrets, tokens, customer bundle IDs, customer API URLs, or private endpoints.

## Validation Commands For Future Implementation Checkpoints

Run as applicable:

```text
pnpm run validate:team-doc
pnpm run test:runtime
pnpm turbo run lint test
pnpm run test:local-harness
```

`pnpm run test:local-harness` is required when runtime paths, validators, scripts, `AGENTS.md`, `PROJECT_ENVIRONMENT.md`, or docs/plans scope is touched. Local validation does not prove actual OpenClaw pod execution.

## Checkpoint 1 Note

Checkpoint 1 creates this requirements draft and the crosswalk only. It does not add validator code yet because the full `ref-organization/` skeleton is Checkpoint 2 scope.
