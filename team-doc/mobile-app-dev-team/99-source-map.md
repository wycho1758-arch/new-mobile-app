# Source Map

## Current Repo Sources

| Source | Use |
| --- | --- |
| `AGENTS.md` | Required repo rules, runtime paths, gate expectations, constraints |
| `REPO_OPERATIONS.md` | Root-owned repo-wide operating policy, policy ownership map, source/archive rules, validator responsibility model |
| `PROJECT_ENVIRONMENT.md` | Current Expo/RN/API/Codex runtime facts |
| `.agents/skills/<slug>/SKILL.md` | Active repo-local skill contracts |
| `.codex/agents/<agent>.toml` | Active custom agent contracts |
| `team-doc/mobile-app-dev-team/10-github-artifact-workflow.md` | Current pod-isolated GitHub artifact handoff workflow |
| `team-doc/mobile-app-dev-team/12-ref-organization-goal-plan.md` | Goal and checkpoint plan for the reusable reference organization layer |
| `team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md` | Improvement plan for running the team as OpenClaw cloud pods with autonomous mobile-app E2E |
| `team-doc/mobile-app-dev-team/ref-organization/` | Reference organization reusable guidance, current-project examples, and migration crosswalk |
| `team-doc/mobile-app-dev-team/ref-organization/99-source-map-and-migration/old-to-new-crosswalk.md` | File-by-file migration plan from historical `team-doc/10-structured/**` identifiers into `ref-organization/`; source content is validated through root archive files |
| `docs/plans/work-units/<work-unit-id>/` | Durable GitHub work-unit artifact root for role-pod handoff |
| `TEAM_DOC_ARCHIVE_MANIFEST.json` | Root archive metadata for historical `team-doc/00-source/`, `team-doc/10-structured/`, and `_meta` paths |
| `TEAM_DOC_ARCHIVE_BUNDLE.jsonl` | Root archive content bundle for historical `team-doc/00-source/`, `team-doc/10-structured/`, and `_meta` files |
| `team-doc/00-source/.../01-2-조직-구성과-역할-1373765682.md` | Historical identifier for original 6 LLM + Gatekeeper role source; content is validated through root archive files |
| `team-doc/00-source/.../01-5-soul-md-템플릿-1373700138/` | Historical identifier for SOUL.md source pages; content is validated through root archive files |

## Historical Structured Inputs

| Source | Use |
| --- | --- |
| `team-doc/10-structured/03-skills/mvp-skill-matrix.md` | Historical skill matrix identifier; content is validated through root archive files. Current active skill status is validated from `.agents/skills/` and `team-doc/mobile-app-dev-team/04-skills-and-agents-matrix.md`. |
| `team-doc/10-structured/03-skills/case-coverage-registry.md` | Historical Case A-H process identifier; content is validated through root archive files. Use `ref-organization/04-workflows-and-handoffs/scenario-overlays-a-h.md` for reusable guidance. |

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
| `mobile-project-bootstrap-workflow` | historical/planned source name | No active repo-local skill in current `.agents/skills`. Case A remains human/operator plus Product/Planning coordination. |

## Stale Or Lower-Priority Sources

`team-doc/10-structured/06-codex-runtime/runtime-boundary.md` may omit newer active skills such as `qa-railway-workflow`. When it conflicts with `PROJECT_ENVIRONMENT.md`, `.agents/skills`, or `team-doc/mobile-app-dev-team/04-skills-and-agents-matrix.md`, use current repo files as the stronger source.

## Reviewer Notes Incorporated

- Design owns design quality. Product/Planning P0/P1 records scope/evidence approval only.
- Railway/RN Web evidence does not replace native Maestro/mobile-mcp or production release readiness.
- `$wm routing` should distinguish current `wm-*`, `po-*`, `design-*` agents from legacy mobile-* agents.
- Pod-isolated role agents must use GitHub branch/commit/PR artifacts under `docs/plans/work-units/<work-unit-id>/` for durable handoff; shared local storage is not assumed.
