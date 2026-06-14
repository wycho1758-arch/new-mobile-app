# Source Map

## Current Repo Sources

| Source | Use |
| --- | --- |
| `AGENTS.md` | Required repo rules, runtime paths, gate expectations, constraints |
| `REPO_OPERATIONS.md` | Root-owned repo-wide operating policy, policy ownership map, source/archive rules, validator responsibility model |
| `PROJECT_ENVIRONMENT.md` | Current Expo/RN/API/Codex runtime facts |
| `.agents/skills/<slug>/SKILL.md` | Active repo-local skill contracts |
| `.codex/agents/<agent>.toml` | Active custom agent contracts |
| `mobile-app-dev-team/10-github-artifact-workflow.md` | Current pod-isolated GitHub artifact handoff workflow |
| `mobile-app-dev-team/14-native-e2e-strategy.md` | Current native E2E evidence ladder and offline EAS/Maestro ingest strategy |
| `mobile-app-dev-team/15-human-ops-live-readiness-annex.md` | Current human/ops live readiness approval, evidence, rollback, and forbidden-claim annex |
| `mobile-app-dev-team/16-pod-environment-bootstrap.md` | Current fresh OpenClaw role pod zero-to-ready sequence for `/workspace/projects/Wondermove-Inc/new-mobile-app` and pod-native skills |
| `mobile-app-dev-team/17-orbstack-pod-config-values.md` | Current non-secret OrbStack role pod value handoff and missing owner/operator input list |
| `mobile-app-dev-team/19-entry-case-routing.md` | Current entry-case routing taxonomy (common intake, SoT-named input categories, report-derived C1-C5, expanded E1-E16) and managed-doc governance for Design relevance/not-applicable (P-1), cross-work-unit prioritization (P-2), and expedited-but-gated hotfix (P-3) |
| `mobile-app-dev-team/20-app-eas-ota-rollback-runbook.md` | Current app / EAS Update (OTA) / store rollback ownership, decision, gate, and evidence runbook (P-4 managed-doc governance) building on the 15-annex rollback rules |
| `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md` | Current pod-native OpenClaw project bootstrap source for boram pod readiness, runtime-shaped as `/workspace/skills/project-bootstrap/SKILL.md` |
| `mobile-app-dev-team/ref-organization/` | Consolidated reference organization reusable guidance, current-project examples, and migration crosswalk |
| `mobile-app-dev-team/ref-organization/99-source-map-and-migration/README.md` | Migration source priority, active-vs-historical rules, old-to-new crosswalk, and validator requirements for historical `team-doc/10-structured/**` identifiers |
| `docs/plans/work-units/<work-unit-id>/` | Durable GitHub work-unit artifact root for role-pod handoff |
| `TEAM_DOC_ARCHIVE_MANIFEST.json` | Root archive metadata for historical `team-doc/00-source/`, `team-doc/10-structured/`, and `_meta` paths |
| `TEAM_DOC_ARCHIVE_BUNDLE.jsonl` | Root archive content bundle for historical `team-doc/00-source/`, `team-doc/10-structured/`, and `_meta` files |
| `team-doc/00-source/.../01-2-조직-구성과-역할-1373765682.md` | Historical identifier for original 6 LLM + Gatekeeper role source; content is validated through root archive files |
| `team-doc/00-source/.../01-5-soul-md-템플릿-1373700138/` | Historical identifier for SOUL.md source pages; content is validated through root archive files |

## Historical Structured Inputs

| Source | Use |
| --- | --- |
| `team-doc/10-structured/03-skills/mvp-skill-matrix.md` | Historical skill matrix identifier; content is validated through root archive files. Current active skill status is validated from `.agents/skills/` and `mobile-app-dev-team/04-skills-and-agents-matrix.md`. |
| `team-doc/10-structured/03-skills/case-coverage-registry.md` | Historical Case A-H process identifier; content is validated through root archive files. Use `ref-organization/04-workflows-and-handoffs/README.md` for reusable guidance. |

## Confluence Provenance Crosswalk

Each managed repo-local source below is the authoritative input for repo-local
workflow execution. The Confluence page ID is a provenance/refetch/audit anchor
only; it is not a live runtime input and must not require live Confluence access.
This table is the structured home for these page IDs; role `references/sot.md`
files point here instead of inlining page numbers.

| Label | Repo-local source (authoritative) | Confluence provenance (page ID) |
| --- | --- | --- |
| `[01] Mobile App 조직` | `mobile-app-dev-team/01-team-composition.md` | `1373700097` |
| `01-4. Skills` | `mobile-app-dev-team/04-skills-and-agents-matrix.md` | `1373667362` |
| `SOUL.md Mobile App Dev` | `mobile-app-dev-team/02-role-souls/mobile-app-dev-soul.md` | `1373700159` |
| `SOUL.md Backend/API Integrator` | `mobile-app-dev-team/02-role-souls/backend-api-integrator-soul.md` | `1373700180` |
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
| `mobile-project-bootstrap-workflow` | historical/planned source name | No active repo-local skill in current `.agents/skills`. Current pod-native handling is `project-bootstrap` under `mobile-app-dev-team/09-pod-native-openclaw-skills/`, with runtime shape `/workspace/skills/project-bootstrap/SKILL.md`; Case A still requires human/operator coordination for live pod and external-platform proof. |

## Completed/Superseded Plans

| Archived Plan | Current Replacement |
| --- | --- |
| `mobile-app-dev-team/_archive/08-role-title-update-plan.md` | Display title handling is now current in the `Display Title To Operating Role Crosswalk` section above, `mobile-app-dev-team/01-team-composition.md`, and `mobile-app-dev-team/02-role-souls/` metadata. |
| `mobile-app-dev-team/_archive/09-pod-native-openclaw-skill-plan.md` | Pod-native OpenClaw skill source now lives under `mobile-app-dev-team/09-pod-native-openclaw-skills/`. |
| `mobile-app-dev-team/_archive/11-openclaw-codex-completion-hooks-plan.md` | Repo-local hook implementation now lives under `.codex/hooks/` and `.codex/hooks.json`; pod runtime-surface guidance lives in `mobile-app-dev-team/ref-organization/02-runtime-surfaces/README.md`. |
| `mobile-app-dev-team/_archive/12-ref-organization-goal-plan.md` | Reference organization work is now represented by consolidated `mobile-app-dev-team/ref-organization/` section READMEs and this source map. |
| `mobile-app-dev-team/_archive/13-pod-organization-e2e-improvement-plan.md` | Repo-local/offline portions are implemented by runtime validators, work-unit fixtures, pod-native skills, `14-native-e2e-strategy.md`, `15-human-ops-live-readiness-annex.md`, and `16-pod-environment-bootstrap.md`; live pod, EAS/Maestro, branch protection, and human approvals still require separate evidence. |
| `mobile-app-dev-team/_archive/20260609-structure-inspection-sot.md` | Current runtime facts and validation policy live in `PROJECT_ENVIRONMENT.md`, `REPO_OPERATIONS.md`, and active validators under `scripts/`; this report is historical inspection evidence. |
| `mobile-app-dev-team/_archive/18-orbstack-pod-config-setup-runbook-plan.md` | Owner/operator setup flow and official reference URLs are folded into `16-pod-environment-bootstrap.md`; non-secret value inventory remains in `17-orbstack-pod-config-values.md`. |
| `mobile-app-dev-team/_archive/orbstack-pod-operator-input-request.md` | Current non-secret OrbStack role pod value handoff and owner/operator input list live in `17-orbstack-pod-config-values.md`. |

## Stale Or Lower-Priority Sources

`team-doc/10-structured/06-codex-runtime/runtime-boundary.md` may omit newer active skills such as `qa-railway-workflow`. When it conflicts with `PROJECT_ENVIRONMENT.md`, `.agents/skills`, or `mobile-app-dev-team/04-skills-and-agents-matrix.md`, use current repo files as the stronger source.

## Reviewer Notes Incorporated

- Design owns design quality. Product/Planning P0/P1 records scope/evidence approval only.
- Railway/RN Web evidence does not replace native Maestro/mobile-mcp or production release readiness.
- `$wm routing` should distinguish current `wm-*`, `po-*`, `design-*` agents from legacy mobile-* agents.
- Pod-isolated role agents must use GitHub branch/commit/PR artifacts under `docs/plans/work-units/<work-unit-id>/` for durable handoff; shared local storage is not assumed.
