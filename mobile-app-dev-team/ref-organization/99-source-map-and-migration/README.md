# Source Map And Migration

Status: historical source migration
Source class: index
Upstream SoT:

- `mobile-app-dev-team/_archive/12-ref-organization-goal-plan.md`
- `mobile-app-dev-team/99-source-map.md`

Downstream consumers:

- Migration checkpoints.
- Future validator and source-map updates.

Last reviewed date: 2026-06-10
Reviewer evidence: .evidence/reviews/ref-organization-checkpoint-2-xhigh-20260610.md

## Purpose

This consolidated section keeps the reusable reference-organization guidance in one navigable document. The former per-topic markdown files are listed below and preserved in `mobile-app-dev-team/_archive/ref-organization-preconsolidation-20260612/` for historical traceability.

## Consolidated Former Files

- `historical-vs-active.md` -> consolidated below
- `old-to-new-crosswalk.md` -> consolidated below
- `source-priority.md` -> consolidated below
- `validator-requirements.md` -> consolidated below

## Historical Vs Active

Former file: `historical-vs-active.md`

### Classes

- active current SoT: current repo rules, runtime paths, managed docs, active skills, and active agents.
- historical source: frozen Confluence exports, `team-doc/00-source`, and prior structured references, with content and metadata validated through `TEAM_DOC_ARCHIVE_MANIFEST.json` and `TEAM_DOC_ARCHIVE_BUNDLE.jsonl`.
- current-project example: facts from the current WonderMove mobile repo used as examples.
- reusable template guidance: generalized procedure for future organizations.

### Rule

`team-doc/10-structured` is historical/reference material for this migration.
Its live directory is not the validation source after archive capture; root
`TEAM_DOC_ARCHIVE_MANIFEST.json` and `TEAM_DOC_ARCHIVE_BUNDLE.jsonl` are the
archive validation source. If historical content conflicts with current managed
docs, current SoT wins.

## Old To New Crosswalk

Former file: `old-to-new-crosswalk.md`

### Purpose

This file freezes how each existing `team-doc/10-structured/**` file will be handled when the reusable reference-organization layer is created under:

```text
mobile-app-dev-team/ref-organization/
```

`team-doc/10-structured/` remains historical/reference input until a later checkpoint rewrites, moves, or archives the material. Do not edit `team-doc/10-structured/**` as part of this checkpoint.

### Status Values

- `move`: carry the material forward with limited rewriting for path/status headers.
- `rewrite`: use the material as input but rewrite around the current SoT and new target structure.
- `archive-as-scenario`: preserve as scenario/example material, not primary navigation.
- `current-project-example`: preserve as a current-project example, not universal guidance.
- `drop-with-reason`: do not migrate as a standalone document; record the reason.

### Crosswalk

| Source file | Status | Target | Reason |
| --- | --- | --- | --- |
| `team-doc/10-structured/readme.md` | rewrite | `mobile-app-dev-team/ref-organization/README.md` | Current root index describes Confluence-character grouping; new root must describe reusable organization-template navigation. |
| `team-doc/10-structured/00-meta-process/readme.md` | rewrite | `mobile-app-dev-team/ref-organization/00-orientation-and-sot/README.md` | Keep as section navigation only after adding page status and current-vs-template rules. |
| `team-doc/10-structured/00-meta-process/page-header-standard.md` | rewrite | `mobile-app-dev-team/ref-organization/00-orientation-and-sot/README.md` | Existing header standard is useful, but the new layer needs status/source-class/upstream/downstream/last-reviewed/reviewer fields through the Checkpoint 2 page status block. |
| `team-doc/10-structured/00-meta-process/process-overview.md` | rewrite | `mobile-app-dev-team/ref-organization/00-orientation-and-sot/README.md` and `mobile-app-dev-team/ref-organization/08-new-organization-template/README.md` | Use as process input, but scope must be constrained by current SoT and validated organization instances. |
| `team-doc/10-structured/01-mobile-org/readme.md` | rewrite | `mobile-app-dev-team/ref-organization/01-organization-model/README.md` | Keep section navigation after removing old mobile-only assumptions. |
| `team-doc/10-structured/01-mobile-org/organization-overview.md` | current-project-example | `mobile-app-dev-team/ref-organization/01-organization-model/README.md` | Preserve the current mobile organization as example input, but future organizations may change role names/counts. |
| `team-doc/10-structured/02-workflows/readme.md` | rewrite | `mobile-app-dev-team/ref-organization/04-workflows-and-handoffs/README.md` | Workflow navigation must follow lifecycle and durable handoff first, with A-H scenarios as overlays. |
| `team-doc/10-structured/02-workflows/case-a-bootstrap.md` | archive-as-scenario | `mobile-app-dev-team/ref-organization/04-workflows-and-handoffs/README.md` | Preserve as scenario A; do not make it primary workflow until updated to current SoT. |
| `team-doc/10-structured/02-workflows/case-b-prd-breakdown.md` | archive-as-scenario | `mobile-app-dev-team/ref-organization/04-workflows-and-handoffs/README.md` | Preserve as scenario B; Product/Planning readiness and role handoff must be rewritten from current SoT. |
| `team-doc/10-structured/02-workflows/case-c-ui-only-feature.md` | archive-as-scenario | `mobile-app-dev-team/ref-organization/04-workflows-and-handoffs/README.md` | Preserve as scenario C only; current Design P0/P1, exactly-two Stitch options, and reviewer gates must be added before reuse. |
| `team-doc/10-structured/02-workflows/case-d-api-backed-feature.md` | archive-as-scenario | `mobile-app-dev-team/ref-organization/04-workflows-and-handoffs/README.md` | Preserve as scenario D only; current API contract, durable handoff, and QA evidence rules supersede the old flow. |
| `team-doc/10-structured/02-workflows/case-e-backend-api-change.md` | archive-as-scenario | `mobile-app-dev-team/ref-organization/04-workflows-and-handoffs/README.md` | Preserve as scenario E only; Backend/API Integrator ownership and contracts SoT must be rewritten. |
| `team-doc/10-structured/02-workflows/case-f-gate-failure.md` | archive-as-scenario | `mobile-app-dev-team/ref-organization/04-workflows-and-handoffs/README.md` | Carry forward into the failure loop after aligning failed-gate risk and owner routing with current SoT. |
| `team-doc/10-structured/02-workflows/case-g-preview-release.md` | archive-as-scenario | `mobile-app-dev-team/ref-organization/04-workflows-and-handoffs/README.md` and `mobile-app-dev-team/ref-organization/06-gates-evidence-and-audit/README.md` | Preserve as preview release scenario; current Railway/RN Web/native/mobile-mcp limits must be explicit. |
| `team-doc/10-structured/02-workflows/case-h-production-submit.md` | archive-as-scenario | `mobile-app-dev-team/ref-organization/04-workflows-and-handoffs/README.md` and `mobile-app-dev-team/ref-organization/06-gates-evidence-and-audit/README.md` | Preserve as production scenario, but human approval remains mandatory. |
| `team-doc/10-structured/03-skills/readme.md` | rewrite | `mobile-app-dev-team/ref-organization/05-skills-agents-and-tools/README.md` | Keep as navigation after splitting active repo-local skills, pod-native skills, reviewers, and optional tools. |
| `team-doc/10-structured/03-skills/case-coverage-registry.md` | rewrite | `mobile-app-dev-team/ref-organization/05-skills-agents-and-tools/README.md` and `mobile-app-dev-team/ref-organization/04-workflows-and-handoffs/README.md` | Use as input, but active skill status must come from actual `.agents/skills` and current managed docs. |
| `team-doc/10-structured/03-skills/external-skill-selection-policy.md` | rewrite | `mobile-app-dev-team/ref-organization/05-skills-agents-and-tools/README.md` | Keep selective adoption principle, but repo skills remain authoritative for contracts, role boundaries, evidence, and gates. |
| `team-doc/10-structured/03-skills/mvp-skill-matrix.md` | current-project-example | `mobile-app-dev-team/ref-organization/05-skills-agents-and-tools/README.md` | Preserve as current project example only; active skills must be verified against `.agents/skills`. |
| `team-doc/10-structured/03-skills/optional-skills.md` | rewrite | `mobile-app-dev-team/ref-organization/05-skills-agents-and-tools/README.md` | Keep as optional adoption input after adding current SoT gates. |
| `team-doc/10-structured/03-skills/skill-placement-policy.md` | rewrite | `mobile-app-dev-team/ref-organization/05-skills-agents-and-tools/README.md`, `mobile-app-dev-team/ref-organization/02-runtime-surfaces/README.md`, `mobile-app-dev-team/ref-organization/02-runtime-surfaces/README.md`, `mobile-app-dev-team/ref-organization/02-runtime-surfaces/README.md`, and `mobile-app-dev-team/ref-organization/02-runtime-surfaces/README.md` | Split placement policy by repo-local Codex, pod-native OpenClaw skills, pod hooks, and tool surfaces. |
| `team-doc/10-structured/04-soul-contracts/readme.md` | rewrite | `mobile-app-dev-team/ref-organization/03-role-contracts-and-capabilities/README.md` | Keep as section navigation after adding role-capability and template-variable distinction. |
| `team-doc/10-structured/04-soul-contracts/role-pages-index.md` | rewrite | `mobile-app-dev-team/ref-organization/03-role-contracts-and-capabilities/README.md` | Use as input for role page inventory; Gatekeeper remains excluded from SOUL inheritance. |
| `team-doc/10-structured/04-soul-contracts/soul-base-template.md` | rewrite | `mobile-app-dev-team/ref-organization/03-role-contracts-and-capabilities/README.md` | Rewrite to separate reusable template variables from current project examples. |
| `team-doc/10-structured/04-soul-contracts/soul-base-template-en.md` | rewrite | `mobile-app-dev-team/ref-organization/03-role-contracts-and-capabilities/README.md` | Merge English template input into the canonical reusable role template. |
| `team-doc/10-structured/04-soul-contracts/soul-base-template-ko.md` | rewrite | `mobile-app-dev-team/ref-organization/03-role-contracts-and-capabilities/README.md` | Preserve Korean reading support as input, but avoid duplicate canonical contracts. |
| `team-doc/10-structured/05-repo-template/readme.md` | rewrite | `mobile-app-dev-team/ref-organization/07-repo-template-and-runtime/README.md` | Keep as section navigation after aligning with current repo baseline. |
| `team-doc/10-structured/05-repo-template/ci-and-eas.md` | current-project-example | `mobile-app-dev-team/ref-organization/07-repo-template-and-runtime/README.md` | Preserve as current project example and extend with current Railway and local harness limits. |
| `team-doc/10-structured/05-repo-template/codex-runtime-layer.md` | rewrite | `mobile-app-dev-team/ref-organization/02-runtime-surfaces/README.md` | Runtime layer must be split from pod-native OpenClaw and pod hooks. |
| `team-doc/10-structured/05-repo-template/mobile-runtime.md` | current-project-example | `mobile-app-dev-team/ref-organization/07-repo-template-and-runtime/README.md` | Preserve current Expo/RN sample baseline as example, not universal organization guidance. |
| `team-doc/10-structured/05-repo-template/optional-api.md` | current-project-example | `mobile-app-dev-team/ref-organization/07-repo-template-and-runtime/README.md` | Preserve optional API workspace rules as current project example with contracts SoT. |
| `team-doc/10-structured/05-repo-template/references.md` | rewrite | `mobile-app-dev-team/ref-organization/99-source-map-and-migration/README.md` | Move reference basis into source priority/history instead of primary runtime guidance. |
| `team-doc/10-structured/05-repo-template/source-selection.md` | rewrite | `mobile-app-dev-team/ref-organization/99-source-map-and-migration/README.md` | Preserve source selection logic as historical/reference input. |
| `team-doc/10-structured/05-repo-template/target-tree.md` | current-project-example | `mobile-app-dev-team/ref-organization/07-repo-template-and-runtime/README.md` | Preserve current repo target tree as example; future organizations may have different repo layouts. |
| `team-doc/10-structured/05-repo-template/template-purpose-and-dod.md` | rewrite | `mobile-app-dev-team/ref-organization/00-orientation-and-sot/README.md` and `mobile-app-dev-team/ref-organization/07-repo-template-and-runtime/README.md` | Split organization purpose from repo template DoD. |
| `team-doc/10-structured/05-repo-template/variables.md` | move | `mobile-app-dev-team/ref-organization/08-new-organization-template/README.md` | Existing variables material maps directly to the new template variable map after status header updates. |
| `team-doc/10-structured/06-codex-runtime/readme.md` | rewrite | `mobile-app-dev-team/ref-organization/02-runtime-surfaces/README.md` | Keep as section navigation only after broadening beyond repo-local Codex. |
| `team-doc/10-structured/06-codex-runtime/practitioner-guide.md` | rewrite | `mobile-app-dev-team/ref-organization/02-runtime-surfaces/README.md` and `mobile-app-dev-team/ref-organization/05-skills-agents-and-tools/README.md` | Use as input, but current reviewer/researcher read-only constraints must be enforced. |
| `team-doc/10-structured/06-codex-runtime/runtime-boundary.md` | rewrite | `mobile-app-dev-team/ref-organization/02-runtime-surfaces/README.md` | Must be updated because current active skills and pod-native boundaries supersede older runtime assumptions. |
| `team-doc/10-structured/07-evidence-and-audit/readme.md` | rewrite | `mobile-app-dev-team/ref-organization/06-gates-evidence-and-audit/README.md` | Keep as section navigation after tying evidence to current gates and durable handoff. |
| `team-doc/10-structured/07-evidence-and-audit/evidence-index.md` | rewrite | `mobile-app-dev-team/ref-organization/06-gates-evidence-and-audit/README.md` and `mobile-app-dev-team/ref-organization/99-source-map-and-migration/README.md` | Preserve audit index as historical evidence map, not proof of current runtime behavior. |

### Coverage Check

All structured files listed in the root archive manifest and backed by the root
archive bundle are represented in the crosswalk table above:

```text
TEAM_DOC_ARCHIVE_MANIFEST.json
TEAM_DOC_ARCHIVE_BUNDLE.jsonl
```

Do not use the live `team-doc/10-structured/` directory as the coverage source
after archive capture. The historical table rows keep the original paths as
identifiers only.

### Checkpoint 1 Notes

- This crosswalk does not migrate content.
- This crosswalk does not modify `team-doc/10-structured/**`.
- Later checkpoints must not treat `archive-as-scenario` files as current workflow until they are rewritten against current SoT.
- Later checkpoints must not treat `current-project-example` files as universal organization policy.

## Source Priority

Former file: `source-priority.md`

### Priority

Use source priority in this order unless a newer SoT says otherwise:

1. `AGENTS.md`
2. `PROJECT_ENVIRONMENT.md`
3. `.agents/skills`
4. `.codex/agents`
5. `mobile-app-dev-team`
6. `TEAM_DOC_ARCHIVE_MANIFEST.json`
7. `TEAM_DOC_ARCHIVE_BUNDLE.jsonl`

### Rule

Historical `team-doc/10-structured` and `team-doc/00-source` paths remain
audit identifiers only. Their metadata and content are validated through root
archive files. When historical source conflicts with current managed docs or
active repo files, current managed docs and active repo files win.

## Validator Requirements

Former file: `validator-requirements.md`

### Purpose

This file defines validator requirements before the full `ref-organization/` content migration begins. It is intentionally a planning artifact, not the validator implementation.

### Minimum Validator Requirements For Future Checkpoints

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

### Validation Commands For Future Implementation Checkpoints

Run as applicable:

```text
pnpm run validate:team-doc
pnpm run test:runtime
pnpm turbo run lint test
pnpm run test:local-harness
```

`pnpm run test:local-harness` is required when runtime paths, validators, scripts, `AGENTS.md`, `PROJECT_ENVIRONMENT.md`, or docs/plans scope is touched. Local validation does not prove actual OpenClaw pod execution.

### Checkpoint 1 Note

Checkpoint 1 creates this requirements draft and the crosswalk only. It does not add validator code yet because the full `ref-organization/` skeleton is Checkpoint 2 scope.
