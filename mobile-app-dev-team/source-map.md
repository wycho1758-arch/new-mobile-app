# Source Map

## Current Repo Sources

| Source | Use |
| --- | --- |
| `AGENTS.md` | Required repo rules, runtime paths, gate expectations, constraints |
| `ORGANIZATIONS.md` | Root discoverability stub pointing to the canonical runtime organizations guidance source |
| `REPO_OPERATIONS.md` | Root-owned repo-wide operating policy, policy ownership map, source/archive rules, validator responsibility model |
| `PROJECT_ENVIRONMENT.md` | Current Expo/RN/API/Codex runtime facts |
| `.agents/skills/<slug>/SKILL.md` | Active repo-local skill contracts |
| `.codex/agents/<agent>.toml` | Active custom agent contracts |
| `mobile-app-dev-team/governance/sot-and-principles.md` | Current managed SoT, source priority, and project-level constraints |
| `mobile-app-dev-team/organization/team-composition.md` | Current team composition and role boundary source |
| `mobile-app-dev-team/organization/role-capability-matrix.md` | Current operating role capability, output, and forbidden-scope matrix |
| `mobile-app-dev-team/organization/new-team-template-guide.md` | Current guide for reusing the team structure for another development team |
| `mobile-app-dev-team/workflows/Product_Planning_WORKFLOW.md` | Current repo-local work process and role handoff workflow |
| `mobile-app-dev-team/governance/gates-and-evidence.md` | Current gate, evidence, human-gate, and durable handoff policy |
| `mobile-app-dev-team/workflows/github-artifact-workflow.md` | Current pod-isolated GitHub artifact handoff workflow |
| `mobile-app-dev-team/workflows/native-e2e-strategy.md` | Current native E2E evidence ladder and offline EAS/Maestro ingest strategy |
| `mobile-app-dev-team/governance/human-ops-live-readiness-annex.md` | Current human/ops live readiness approval, evidence, rollback, and forbidden-claim annex |
| `mobile-app-dev-team/runtime-sources/codex-skill-agent-matrix.md` | Current `.agents/skills` and `.codex/agents` mapping, active read-only reviewer/researcher matrix, and pod-native skill crosswalk |
| `mobile-app-dev-team/runtime-sources/ORGANIZATIONS.md` | Canonical organizations and reporting guidance source copied to `/workspace/ORGANIZATIONS.md`; guidance only, not a SOUL or approval-enforcement policy |
| `mobile-app-dev-team/runtime-sources/pod-environment-bootstrap.md` | Current fresh OpenClaw role pod zero-to-ready sequence for `/workspace/projects/Wondermove-Inc/new-mobile-app` and pod-native skills |
| `mobile-app-dev-team/runtime-sources/orbstack-pod-config-values.md` | Current non-secret OrbStack role pod value handoff and missing owner/operator input list |
| `mobile-app-dev-team/workflows/entry-case-routing.md` | Current entry-case routing taxonomy (common intake, SoT-named input categories, report-derived C1-C5, expanded E1-E16) and managed-doc governance for Design relevance/not-applicable (P-1), cross-work-unit prioritization (P-2), and expedited-but-gated hotfix (P-3) |
| `mobile-app-dev-team/governance/app-eas-ota-rollback-runbook.md` | Current app / EAS Update (OTA) / store rollback ownership, decision, gate, and evidence runbook (P-4 managed-doc governance) building on the 15-annex rollback rules |
| `mobile-app-dev-team/source-map.md` | Current old-to-new path crosswalk, runtime surface class registry, validator responsibility map, harness applicability map, archive crosswalk, and external proof boundary |
| `scripts/validate-team-doc.mjs` | Current managed team-doc composition wrapper for structure, runtime-source, workflow, governance, reference, and managed parity checks |
| `scripts/validate-team-doc-structure.mjs` | Structure registry validator for the `mobile-app-dev-team/**` surface rename; rejects current numbered top-level paths and old `99-source-map.md` |
| `scripts/validate-runtime-sources.mjs` | Runtime-source document validator for role SOULs, Codex skill/agent matrix, pod-native OpenClaw skills, runtime specs, and pod bootstrap source docs |
| `scripts/validate-workflow-docs.mjs` | Workflow document validator for work processes, GitHub artifact workflow, native E2E strategy, entry-case routing, and durable work-unit handoff docs |
| `scripts/validate-governance-docs.mjs` | Governance document validator for SoT/principles, AGENTS.md routing, gates/evidence, human/ops live readiness, and rollback boundaries |
| `scripts/validate-reference-docs.mjs` | Reference/source-map/archive validator for ref-organization and completed-plan crosswalks |
| `scripts/validate-team-doc-managed.mjs` | Parity backstop preserving the previous detailed managed-doc term checks during the surface-validator split |
| `evals/team-doc-structure/fixtures/` | RED and valid fixtures for team-doc structure registry validation before any physical rename |
| `mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/project-bootstrap/SKILL.md` | Current pod-native OpenClaw project bootstrap source for boram pod readiness, runtime-shaped as `/workspace/skills/project-bootstrap/SKILL.md` |
| `mobile-app-dev-team/ref-organization/` | Consolidated reference organization reusable guidance, current-project examples, and migration crosswalk |
| `mobile-app-dev-team/ref-organization/source-map-and-migration/README.md` | Migration source priority, active-vs-historical rules, old-to-new crosswalk, and validator requirements for historical `team-doc/10-structured/**` identifiers |
| `docs/plans/work-units/<work-unit-id>/` | Durable GitHub work-unit artifact root for role-pod handoff |
| `TEAM_DOC_ARCHIVE_MANIFEST.json` | Root archive metadata for historical `team-doc/00-source/`, `team-doc/10-structured/`, and `_meta` paths |
| `TEAM_DOC_ARCHIVE_BUNDLE.jsonl` | Root archive content bundle for historical `team-doc/00-source/`, `team-doc/10-structured/`, and `_meta` files |
| `team-doc/00-source/.../01-2-조직-구성과-역할-1373765682.md` | Historical identifier for original 6 LLM + Gatekeeper role source; content is validated through root archive files |
| `team-doc/00-source/.../01-5-soul-md-템플릿-1373700138/` | Historical identifier for SOUL.md source pages; content is validated through root archive files |

## Runtime Surface Classes

| Class | Meaning | Current validator owner |
| --- | --- | --- |
| `I1` | Index/navigation and source-map files | `scripts/validate-team-doc-structure.mjs`, `scripts/validate-reference-docs.mjs` |
| `G1` | Governance and policy-facing team docs | `scripts/validate-governance-docs.mjs` |
| `O1` | Organization model and role capability docs | `scripts/validate-team-doc.mjs` via structure/reference validators |
| `W1` | Workflow, handoff, and entry-case docs | `scripts/validate-workflow-docs.mjs` |
| `R1` | Pod-native runtime sources and pod setup docs | `scripts/validate-runtime-sources.mjs` |
| `R2` | Role SOUL runtime sources | `scripts/validate-runtime-sources.mjs` |
| `C1` | Repo-local Codex skill/agent matrix and runtime contracts | `scripts/validate-runtime-sources.mjs` |
| `P1` | Reports, explainers, and completed planning artifacts | `scripts/validate-team-doc-structure.mjs`, `scripts/validate-reference-docs.mjs` |
| `H1` | Reference organization and historical migration guidance | `scripts/validate-reference-docs.mjs` |

Validators are repo-local evidence only. They do not prove live
`/workspace/skills` installation, actual OpenClaw pod execution, or external
platform state.

## Old-To-New Rename Crosswalk

| Old path | Current path | Class | Status |
| --- | --- | --- | --- |
| `mobile-app-dev-team/99-source-map.md` | `mobile-app-dev-team/source-map.md` | `I1` | Completed in Checkpoint 5; old filename is rejected by validators. |
| `mobile-app-dev-team/00-sot-and-principles.md` | `mobile-app-dev-team/governance/sot-and-principles.md` | `G1` | Completed. |
| `mobile-app-dev-team/01-team-composition.md` | `mobile-app-dev-team/organization/team-composition.md` | `O1` | Completed. |
| `mobile-app-dev-team/02-role-souls/` | `mobile-app-dev-team/runtime-sources/role-souls/` | `R2` | Completed. |
| `mobile-app-dev-team/03-role-capability-matrix.md` | `mobile-app-dev-team/organization/role-capability-matrix.md` | `O1` | Completed. |
| `mobile-app-dev-team/04-skills-and-agents-matrix.md` | `mobile-app-dev-team/runtime-sources/codex-skill-agent-matrix.md` | `C1` | Completed; old numbered top-level file is rejected by validators. |
| `mobile-app-dev-team/05-work-processes.md` | `mobile-app-dev-team/workflows/Product_Planning_WORKFLOW.md` | `W1` | Completed. |
| `mobile-app-dev-team/06-gates-and-evidence.md` | `mobile-app-dev-team/governance/gates-and-evidence.md` | `G1` | Completed. |
| `mobile-app-dev-team/07-new-team-template-guide.md` | `mobile-app-dev-team/organization/new-team-template-guide.md` | `O1` | Completed. |
| `mobile-app-dev-team/09-pod-native-openclaw-skills/` | `mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/` | `R1` | Completed. |
| `mobile-app-dev-team/10-github-artifact-workflow.md` | `mobile-app-dev-team/workflows/github-artifact-workflow.md` | `W1` | Completed. |
| `mobile-app-dev-team/14-native-e2e-strategy.md` | `mobile-app-dev-team/workflows/native-e2e-strategy.md` | `W1` | Completed. |
| `mobile-app-dev-team/15-human-ops-live-readiness-annex.md` | `mobile-app-dev-team/governance/human-ops-live-readiness-annex.md` | `G1` | Completed. |
| `mobile-app-dev-team/16-pod-environment-bootstrap.md` | `mobile-app-dev-team/runtime-sources/pod-environment-bootstrap.md` | `R1` | Completed; old numbered top-level file is rejected by validators. |
| `mobile-app-dev-team/17-orbstack-pod-config-values.md` | `mobile-app-dev-team/runtime-sources/orbstack-pod-config-values.md` | `R1` | Completed; old numbered top-level file is rejected by validators. |
| `mobile-app-dev-team/19-entry-case-routing.md` | `mobile-app-dev-team/workflows/entry-case-routing.md` | `W1` | Completed. |
| `mobile-app-dev-team/20-app-eas-ota-rollback-runbook.md` | `mobile-app-dev-team/governance/app-eas-ota-rollback-runbook.md` | `G1` | Completed. |
| `mobile-app-dev-team/ref-organization/00-orientation-and-sot/` | `mobile-app-dev-team/ref-organization/orientation-and-sot/` | `H1` | Completed. |
| `mobile-app-dev-team/ref-organization/01-organization-model/` | `mobile-app-dev-team/ref-organization/organization-model/` | `H1` | Completed. |
| `mobile-app-dev-team/ref-organization/02-runtime-surfaces/` | `mobile-app-dev-team/ref-organization/runtime-surfaces/` | `H1` | Completed. |
| `mobile-app-dev-team/ref-organization/03-role-contracts-and-capabilities/` | `mobile-app-dev-team/ref-organization/role-contracts-and-capabilities/` | `H1` | Completed. |
| `mobile-app-dev-team/ref-organization/04-workflows-and-handoffs/` | `mobile-app-dev-team/ref-organization/workflows-and-handoffs/` | `H1` | Completed. |
| `mobile-app-dev-team/ref-organization/05-skills-agents-and-tools/` | `mobile-app-dev-team/ref-organization/skills-agents-and-tools/` | `H1` | Completed. |
| `mobile-app-dev-team/ref-organization/06-gates-evidence-and-audit/` | `mobile-app-dev-team/ref-organization/gates-evidence-and-audit/` | `H1` | Completed. |
| `mobile-app-dev-team/ref-organization/07-repo-template-and-runtime/` | `mobile-app-dev-team/ref-organization/repo-template-and-runtime/` | `H1` | Completed. |
| `mobile-app-dev-team/ref-organization/08-new-organization-template/` | `mobile-app-dev-team/ref-organization/new-organization-template/` | `H1` | Completed. |
| `mobile-app-dev-team/ref-organization/99-source-map-and-migration/` | `mobile-app-dev-team/ref-organization/source-map-and-migration/` | `H1` | Completed. |

## Validator Responsibility Crosswalk

| Validator | Responsibility |
| --- | --- |
| `scripts/validate-team-doc.mjs` | Composition wrapper for current managed team docs. |
| `scripts/validate-team-doc-structure.mjs` | Structure registry, `source-map.md`, top-level numeric-prefix rejection, runtime-source placement, and RED/valid fixtures in `evals/team-doc-structure/fixtures/`. |
| `scripts/validate-runtime-sources.mjs` | Runtime-source docs: role SOULs, Codex skill/agent matrix, pod-native OpenClaw skills, pod runtime specs, and pod bootstrap docs. |
| `scripts/validate-workflow-docs.mjs` | Workflows, entry-case routing, native E2E strategy, GitHub artifact workflow, and durable work-unit handoff docs. |
| `scripts/validate-governance-docs.mjs` | Governance docs, AGENTS routing, gates/evidence, human/ops live readiness, and rollback boundaries. |
| `scripts/validate-reference-docs.mjs` | `ref-organization`, `source-map.md`, completed-plan archive placement, and reference/archive crosswalk invariants. |
| `scripts/validate-team-doc-managed.mjs` | Parity backstop for detailed managed-doc terms while split validators own clearer failure surfaces. |
| `scripts/validate-team-doc-archive.mjs` | Root archive metadata/content integrity for historical `team-doc/**` sources. |
| `scripts/validate-project-environment.mjs` | Project runtime drift checks and quality-gate local-harness path classifier fixtures. |
| `scripts/validate-evidence-hygiene.mjs` | Durable evidence path and shared secret-pattern hygiene. |

## Harness Applicability Crosswalk

| Change family | Required local commands | Local harness by path alone |
| --- | --- | --- |
| Codex runtime and harness paths (`.agents/**`, `.codex/**`, `evals/local-harness/**`, selected runtime scripts, workflow YAML, root runtime policy files, package metadata) | `pnpm run test:runtime`, `pnpm run test:local-harness` | Required. |
| `mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/**` | `pnpm run test:runtime`, targeted pod-native smoke such as `bash evals/skills/openclaw-pod-skills-sync-smoke.sh` and `bash evals/skills/project-bootstrap-agent-setup-smoke.sh` | Not required unless Codex runtime or harness paths also change. |
| `mobile-app-dev-team/ref-organization/**` | `pnpm run validate:reference-docs`, `pnpm run validate:team-doc` | Not required unless Codex runtime or harness paths also change. |

## Historical Source Crosswalk

### Historical Structured Inputs

| Source | Use |
| --- | --- |
| `team-doc/10-structured/03-skills/mvp-skill-matrix.md` | Historical skill matrix identifier; content is validated through root archive files. Current active skill status is validated from `.agents/skills/` and `mobile-app-dev-team/runtime-sources/codex-skill-agent-matrix.md`. |
| `team-doc/10-structured/03-skills/case-coverage-registry.md` | Historical Case A-H process identifier; content is validated through root archive files. Use `ref-organization/workflows-and-handoffs/README.md` for reusable guidance. |

## Confluence Provenance Crosswalk

Each managed repo-local source below is the authoritative input for repo-local
workflow execution. The Confluence page ID is a provenance/refetch/audit anchor
only; it is not a live runtime input and must not require live Confluence access.
This table is the structured home for these page IDs; role `references/sot.md`
files point here instead of inlining page numbers.

| Label | Repo-local source (authoritative) | Confluence provenance (page ID) |
| --- | --- | --- |
| `[01] Mobile App 조직` | `mobile-app-dev-team/organization/team-composition.md` | `1373700097` |
| `01-4. Skills` | `mobile-app-dev-team/runtime-sources/codex-skill-agent-matrix.md` | `1373667362` |
| `SOUL.md Mobile App Dev` | `mobile-app-dev-team/runtime-sources/role-souls/mobile-app-dev-soul.md` | `1373700159` |
| `SOUL.md Backend/API Integrator` | `mobile-app-dev-team/runtime-sources/role-souls/backend-api-integrator-soul.md` | `1373700180` |
| `Role-specific Codex Runtime` | `REPO_OPERATIONS.md`, `PROJECT_ENVIRONMENT.md` | `1374289964` |
| `mobile-app-dev-workflow` | `.agents/skills/mobile-app-dev-workflow/SKILL.md` | `1374060668` |
| `mobile-backend-api-integrator-workflow` | `.agents/skills/mobile-backend-api-integrator-workflow/SKILL.md` | `1374388227` |

## Display Title To Operating Role Crosswalk

| Display Title | Operating Role | Status | Handling |
| --- | --- | --- | --- |
| Chief Product Officer (CPO) / Product Delivery Lead | Product/Planning | Active display title | Top intake, scope/readiness, role routing, evidence expectation, and human-gate coordination. |
| Product Designer | Design | Active display title | Design quality and Stitch-backed mobile handoff owner. |
| Mobile Architect / Technical Lead | Mobile Architect | Active display title | Technical architecture, route/state, runtime, API impact, and releaseability review owner. |
| Mobile App Developer | Mobile App Dev | Active display title | Expo React Native implementation owner for approved tasks. |
| Backend/API Engineer | Backend/API Integrator | Active display title | Mobile-facing API contract and approved backend/API integration owner. |
| QA/Release Engineer | QA/Release | Active display title | QA evidence and release readiness reporter. |
| Release Gatekeeper (System) | Gatekeeper | Non-LLM deterministic gate | No SOUL.md, no custom agent, no human approval replacement. |

## active-vs-historical skill crosswalk

| Historical Source Name | Current Status | Current Handling |
| --- | --- | --- |
| `mobile-prd-to-execution` | historical source name | Current repo adapter is `po-prd-to-execution`. |
| `mobile-requirement-office-hours` | historical source name | Current repo adapter is `po-requirement-office-hours`. |
| `mobile-work-unit-planning-and-agent-sprint` | historical source name | Current repo adapter is `po-work-unit-planning-and-agent-sprint`. |
| `mobile-planning-completeness-review` | historical source name | Current repo adapter is `po-planning-completeness-review`. |
| `mobile-design-handoff` | historical source name | Current repo adapter is `design-mobile-design-handoff`. |
| `mobile-api-contract` | historical source name | Do not list as active unless `.agents/skills/mobile-api-contract/SKILL.md` exists. Current active path is `mobile-backend-api-integrator-workflow` plus `packages/contracts`. |
| `mobile-qa-release` | historical source name | Do not list as active unless `.agents/skills/mobile-qa-release/SKILL.md` exists. Current active QA skills are `e2e-test` and `qa-railway-workflow`. |
| `mobile-gatekeeper` | historical deterministic concept | Not an LLM skill in the current managed docs. Treat as deterministic required-check concept. |
| `mobile-project-bootstrap-workflow` | historical/planned source name | No active repo-local skill in current `.agents/skills`. Current pod-native handling is `project-bootstrap` under `mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/`, with runtime shape `/workspace/skills/project-bootstrap/SKILL.md`; Case A still requires human/operator coordination for live pod and external-platform proof. |


## External Proof Boundary

Local validators, local harness, source-map checks prove
repo-local consistency only. They do not prove live OpenClaw pod execution,
`/workspace/skills` installation, Jira or Confluence behavior, GitHub branch
protection, EAS production submit, Maestro/mobile-mcp device behavior, or
external platform state.

### Stale Or Lower-Priority Sources

`team-doc/10-structured/06-codex-runtime/runtime-boundary.md` may omit newer active skills such as `qa-railway-workflow`. When it conflicts with `PROJECT_ENVIRONMENT.md`, `.agents/skills`, or `mobile-app-dev-team/runtime-sources/codex-skill-agent-matrix.md`, use current repo files as the stronger source.

### Reviewer Notes Incorporated

- Design owns design quality. Product/Planning P0/P1 records scope/evidence approval only.
- Railway/RN Web evidence does not replace native Maestro/mobile-mcp or production release readiness.
- `$wm routing` should distinguish current `wm-*`, `po-*`, `design-*` agents from legacy mobile-* agents.
- Pod-isolated role agents must use GitHub branch/commit/PR artifacts under `docs/plans/work-units/<work-unit-id>/` for durable handoff; shared local storage is not assumed.
