# Old To New Crosswalk

Status: historical source migration
Source class: migration crosswalk
Upstream SoT:

- `team-doc/mobile-app-dev-team/12-ref-organization-goal-plan.md`
- `team-doc/mobile-app-dev-team/00-sot-and-principles.md`
- `team-doc/mobile-app-dev-team/99-source-map.md`
- `team-doc/10-structured/**`

Downstream consumers:

- Checkpoint 2 skeleton and page status work.
- Checkpoint 3-6 migration work.
- Future `scripts/validate-team-doc.mjs` ref-organization checks.

Last reviewed date: 2026-06-10
Reviewer evidence: .evidence/reviews/ref-organization-checkpoint-1-xhigh-20260610.md

## Purpose

This file freezes how each existing `team-doc/10-structured/**` file will be handled when the reusable reference-organization layer is created under:

```text
team-doc/mobile-app-dev-team/ref-organization/
```

`team-doc/10-structured/` remains historical/reference input until a later checkpoint rewrites, moves, or archives the material. Do not edit `team-doc/10-structured/**` as part of this checkpoint.

## Status Values

- `move`: carry the material forward with limited rewriting for path/status headers.
- `rewrite`: use the material as input but rewrite around the current SoT and new target structure.
- `archive-as-scenario`: preserve as scenario/example material, not primary navigation.
- `current-project-example`: preserve as a current-project example, not universal guidance.
- `drop-with-reason`: do not migrate as a standalone document; record the reason.

## Crosswalk

| Source file | Status | Target | Reason |
| --- | --- | --- | --- |
| `team-doc/10-structured/readme.md` | rewrite | `team-doc/mobile-app-dev-team/ref-organization/README.md` | Current root index describes Confluence-character grouping; new root must describe reusable organization-template navigation. |
| `team-doc/10-structured/00-meta-process/readme.md` | rewrite | `team-doc/mobile-app-dev-team/ref-organization/00-orientation-and-sot/README.md` | Keep as section navigation only after adding page status and current-vs-template rules. |
| `team-doc/10-structured/00-meta-process/page-header-standard.md` | rewrite | `team-doc/mobile-app-dev-team/ref-organization/00-orientation-and-sot/current-project-vs-template.md` | Existing header standard is useful, but the new layer needs status/source-class/upstream/downstream/last-reviewed/reviewer fields through the Checkpoint 2 page status block. |
| `team-doc/10-structured/00-meta-process/process-overview.md` | rewrite | `team-doc/mobile-app-dev-team/ref-organization/00-orientation-and-sot/purpose.md` and `team-doc/mobile-app-dev-team/ref-organization/08-new-organization-template/create-new-team-guide.md` | Use as process input, but scope must be constrained by current SoT and validated organization instances. |
| `team-doc/10-structured/01-mobile-org/readme.md` | rewrite | `team-doc/mobile-app-dev-team/ref-organization/01-organization-model/README.md` | Keep section navigation after removing old mobile-only assumptions. |
| `team-doc/10-structured/01-mobile-org/organization-overview.md` | current-project-example | `team-doc/mobile-app-dev-team/ref-organization/01-organization-model/team-shape.md` | Preserve the current mobile organization as example input, but future organizations may change role names/counts. |
| `team-doc/10-structured/02-workflows/readme.md` | rewrite | `team-doc/mobile-app-dev-team/ref-organization/04-workflows-and-handoffs/README.md` | Workflow navigation must follow lifecycle and durable handoff first, with A-H scenarios as overlays. |
| `team-doc/10-structured/02-workflows/case-a-bootstrap.md` | archive-as-scenario | `team-doc/mobile-app-dev-team/ref-organization/04-workflows-and-handoffs/scenario-overlays-a-h.md` | Preserve as scenario A; do not make it primary workflow until updated to current SoT. |
| `team-doc/10-structured/02-workflows/case-b-prd-breakdown.md` | archive-as-scenario | `team-doc/mobile-app-dev-team/ref-organization/04-workflows-and-handoffs/scenario-overlays-a-h.md` | Preserve as scenario B; Product/Planning readiness and role handoff must be rewritten from current SoT. |
| `team-doc/10-structured/02-workflows/case-c-ui-only-feature.md` | archive-as-scenario | `team-doc/mobile-app-dev-team/ref-organization/04-workflows-and-handoffs/scenario-overlays-a-h.md` | Preserve as scenario C only; current Design P0/P1, exactly-two Stitch options, and reviewer gates must be added before reuse. |
| `team-doc/10-structured/02-workflows/case-d-api-backed-feature.md` | archive-as-scenario | `team-doc/mobile-app-dev-team/ref-organization/04-workflows-and-handoffs/scenario-overlays-a-h.md` | Preserve as scenario D only; current API contract, durable handoff, and QA evidence rules supersede the old flow. |
| `team-doc/10-structured/02-workflows/case-e-backend-api-change.md` | archive-as-scenario | `team-doc/mobile-app-dev-team/ref-organization/04-workflows-and-handoffs/scenario-overlays-a-h.md` | Preserve as scenario E only; Backend/API Integrator ownership and contracts SoT must be rewritten. |
| `team-doc/10-structured/02-workflows/case-f-gate-failure.md` | archive-as-scenario | `team-doc/mobile-app-dev-team/ref-organization/04-workflows-and-handoffs/failure-loop.md` | Carry forward into the failure loop after aligning failed-gate risk and owner routing with current SoT. |
| `team-doc/10-structured/02-workflows/case-g-preview-release.md` | archive-as-scenario | `team-doc/mobile-app-dev-team/ref-organization/04-workflows-and-handoffs/scenario-overlays-a-h.md` and `team-doc/mobile-app-dev-team/ref-organization/06-gates-evidence-and-audit/required-gates.md` | Preserve as preview release scenario; current Railway/RN Web/native/mobile-mcp limits must be explicit. |
| `team-doc/10-structured/02-workflows/case-h-production-submit.md` | archive-as-scenario | `team-doc/mobile-app-dev-team/ref-organization/04-workflows-and-handoffs/scenario-overlays-a-h.md` and `team-doc/mobile-app-dev-team/ref-organization/06-gates-evidence-and-audit/human-gates.md` | Preserve as production scenario, but human approval remains mandatory. |
| `team-doc/10-structured/03-skills/readme.md` | rewrite | `team-doc/mobile-app-dev-team/ref-organization/05-skills-agents-and-tools/README.md` | Keep as navigation after splitting active repo-local skills, pod-native skills, reviewers, and optional tools. |
| `team-doc/10-structured/03-skills/case-coverage-registry.md` | rewrite | `team-doc/mobile-app-dev-team/ref-organization/05-skills-agents-and-tools/active-skill-agent-policy.md` and `team-doc/mobile-app-dev-team/ref-organization/04-workflows-and-handoffs/scenario-overlays-a-h.md` | Use as input, but active skill status must come from actual `.agents/skills` and current managed docs. |
| `team-doc/10-structured/03-skills/external-skill-selection-policy.md` | rewrite | `team-doc/mobile-app-dev-team/ref-organization/05-skills-agents-and-tools/optional-tool-adoption.md` | Keep selective adoption principle, but repo skills remain authoritative for contracts, role boundaries, evidence, and gates. |
| `team-doc/10-structured/03-skills/mvp-skill-matrix.md` | current-project-example | `team-doc/mobile-app-dev-team/ref-organization/05-skills-agents-and-tools/active-skill-agent-policy.md` | Preserve as current project example only; active skills must be verified against `.agents/skills`. |
| `team-doc/10-structured/03-skills/optional-skills.md` | rewrite | `team-doc/mobile-app-dev-team/ref-organization/05-skills-agents-and-tools/optional-tool-adoption.md` | Keep as optional adoption input after adding current SoT gates. |
| `team-doc/10-structured/03-skills/skill-placement-policy.md` | rewrite | `team-doc/mobile-app-dev-team/ref-organization/05-skills-agents-and-tools/skill-placement-policy.md`, `team-doc/mobile-app-dev-team/ref-organization/02-runtime-surfaces/repo-local-codex-runtime.md`, `team-doc/mobile-app-dev-team/ref-organization/02-runtime-surfaces/pod-native-openclaw-skills.md`, `team-doc/mobile-app-dev-team/ref-organization/02-runtime-surfaces/pod-codex-completion-hooks.md`, and `team-doc/mobile-app-dev-team/ref-organization/02-runtime-surfaces/computer-use-and-tool-surfaces.md` | Split placement policy by repo-local Codex, pod-native OpenClaw skills, pod hooks, and tool surfaces. |
| `team-doc/10-structured/04-soul-contracts/readme.md` | rewrite | `team-doc/mobile-app-dev-team/ref-organization/03-role-contracts-and-capabilities/README.md` | Keep as section navigation after adding role-capability and template-variable distinction. |
| `team-doc/10-structured/04-soul-contracts/role-pages-index.md` | rewrite | `team-doc/mobile-app-dev-team/ref-organization/03-role-contracts-and-capabilities/role-soul-template.md` | Use as input for role page inventory; Gatekeeper remains excluded from SOUL inheritance. |
| `team-doc/10-structured/04-soul-contracts/soul-base-template.md` | rewrite | `team-doc/mobile-app-dev-team/ref-organization/03-role-contracts-and-capabilities/role-soul-template.md` | Rewrite to separate reusable template variables from current project examples. |
| `team-doc/10-structured/04-soul-contracts/soul-base-template-en.md` | rewrite | `team-doc/mobile-app-dev-team/ref-organization/03-role-contracts-and-capabilities/role-soul-template.md` | Merge English template input into the canonical reusable role template. |
| `team-doc/10-structured/04-soul-contracts/soul-base-template-ko.md` | rewrite | `team-doc/mobile-app-dev-team/ref-organization/03-role-contracts-and-capabilities/role-soul-template.md` | Preserve Korean reading support as input, but avoid duplicate canonical contracts. |
| `team-doc/10-structured/05-repo-template/readme.md` | rewrite | `team-doc/mobile-app-dev-team/ref-organization/07-repo-template-and-runtime/README.md` | Keep as section navigation after aligning with current repo baseline. |
| `team-doc/10-structured/05-repo-template/ci-and-eas.md` | current-project-example | `team-doc/mobile-app-dev-team/ref-organization/07-repo-template-and-runtime/ci-eas-railway.md` | Preserve as current project example and extend with current Railway and local harness limits. |
| `team-doc/10-structured/05-repo-template/codex-runtime-layer.md` | rewrite | `team-doc/mobile-app-dev-team/ref-organization/02-runtime-surfaces/repo-local-codex-runtime.md` | Runtime layer must be split from pod-native OpenClaw and pod hooks. |
| `team-doc/10-structured/05-repo-template/mobile-runtime.md` | current-project-example | `team-doc/mobile-app-dev-team/ref-organization/07-repo-template-and-runtime/mobile-runtime.md` | Preserve current Expo/RN sample baseline as example, not universal organization guidance. |
| `team-doc/10-structured/05-repo-template/optional-api.md` | current-project-example | `team-doc/mobile-app-dev-team/ref-organization/07-repo-template-and-runtime/optional-api.md` | Preserve optional API workspace rules as current project example with contracts SoT. |
| `team-doc/10-structured/05-repo-template/references.md` | rewrite | `team-doc/mobile-app-dev-team/ref-organization/99-source-map-and-migration/source-priority.md` | Move reference basis into source priority/history instead of primary runtime guidance. |
| `team-doc/10-structured/05-repo-template/source-selection.md` | rewrite | `team-doc/mobile-app-dev-team/ref-organization/99-source-map-and-migration/source-priority.md` | Preserve source selection logic as historical/reference input. |
| `team-doc/10-structured/05-repo-template/target-tree.md` | current-project-example | `team-doc/mobile-app-dev-team/ref-organization/07-repo-template-and-runtime/repo-target-tree.md` | Preserve current repo target tree as example; future organizations may have different repo layouts. |
| `team-doc/10-structured/05-repo-template/template-purpose-and-dod.md` | rewrite | `team-doc/mobile-app-dev-team/ref-organization/00-orientation-and-sot/purpose.md` and `team-doc/mobile-app-dev-team/ref-organization/07-repo-template-and-runtime/repo-target-tree.md` | Split organization purpose from repo template DoD. |
| `team-doc/10-structured/05-repo-template/variables.md` | move | `team-doc/mobile-app-dev-team/ref-organization/08-new-organization-template/variable-map.md` | Existing variables material maps directly to the new template variable map after status header updates. |
| `team-doc/10-structured/06-codex-runtime/readme.md` | rewrite | `team-doc/mobile-app-dev-team/ref-organization/02-runtime-surfaces/README.md` | Keep as section navigation only after broadening beyond repo-local Codex. |
| `team-doc/10-structured/06-codex-runtime/practitioner-guide.md` | rewrite | `team-doc/mobile-app-dev-team/ref-organization/02-runtime-surfaces/repo-local-codex-runtime.md` and `team-doc/mobile-app-dev-team/ref-organization/05-skills-agents-and-tools/reviewer-researcher-boundaries.md` | Use as input, but current reviewer/researcher read-only constraints must be enforced. |
| `team-doc/10-structured/06-codex-runtime/runtime-boundary.md` | rewrite | `team-doc/mobile-app-dev-team/ref-organization/02-runtime-surfaces/repo-local-codex-runtime.md` | Must be updated because current active skills and pod-native boundaries supersede older runtime assumptions. |
| `team-doc/10-structured/07-evidence-and-audit/readme.md` | rewrite | `team-doc/mobile-app-dev-team/ref-organization/06-gates-evidence-and-audit/README.md` | Keep as section navigation after tying evidence to current gates and durable handoff. |
| `team-doc/10-structured/07-evidence-and-audit/evidence-index.md` | rewrite | `team-doc/mobile-app-dev-team/ref-organization/06-gates-evidence-and-audit/audit-index.md` and `team-doc/mobile-app-dev-team/ref-organization/99-source-map-and-migration/historical-vs-active.md` | Preserve audit index as historical evidence map, not proof of current runtime behavior. |

## Coverage Check

All structured files listed in the root archive manifest and backed by the root
archive bundle are represented in the crosswalk table above:

```text
TEAM_DOC_ARCHIVE_MANIFEST.json
TEAM_DOC_ARCHIVE_BUNDLE.jsonl
```

Do not use the live `team-doc/10-structured/` directory as the coverage source
after archive capture. The historical table rows keep the original paths as
identifiers only.

## Checkpoint 1 Notes

- This crosswalk does not migrate content.
- This crosswalk does not modify `team-doc/10-structured/**`.
- Later checkpoints must not treat `archive-as-scenario` files as current workflow until they are rewritten against current SoT.
- Later checkpoints must not treat `current-project-example` files as universal organization policy.
