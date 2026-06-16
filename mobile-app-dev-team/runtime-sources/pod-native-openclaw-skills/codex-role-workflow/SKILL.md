---
name: codex-role-workflow
description: Resolve an OpenClaw role pod plus entry case to the correct repo-local Codex skills, reviewers, durable artifact stage, stop conditions, and status-only next action without implementing role work or exposing secrets.
---

# Codex Role Workflow

Runtime shape: `/workspace/skills/codex-role-workflow/SKILL.md`

This pod-native OpenClaw skill is a status only role bridge. It does not implement Product, Design, Mobile Architect, Mobile App Dev, Backend/API Integrator, or QA/Release work. It tells the role pod which repo-local Codex skills and reviewers are allowed next.

## Codex Substrate

Codex is the repo-local role-workflow substrate for this repository, not only a coding executor.

The substrate includes:

- repo-local Codex skills under `.agents/skills/<skill-name>/SKILL.md`;
- repo-local custom agents under `.codex/agents/<agent-name>.toml`;
- hook policy and evidence reminders under `.codex/hooks.json` and `.codex/hooks/`;
- MCP configuration under `.codex/config.toml`;
- validators, evals, evidence paths, reviewer records, and durable work-unit artifacts.

Product/Planning uses this substrate from intake. Implementation is only one possible downstream role action. Other possible actions include clarification, sizing, project requirement decomposition, project specification routing, Design handoff, architecture review, API contract review, QA evidence, human-gate stop, runtime-capability stop, and durable handoff.

## Process Routing Sources

Use these SoT files before recommending a repo-local Codex skill:

- `mobile-app-dev-team/workflows/entry-case-routing.md` for the operational routing overlay, input taxonomy, C1-C5 convenience mapping, E1-E16 expanded cases, Design relevance, prioritization, hotfix, and gap decisions.
- `mobile-app-dev-team/workflows/work-processes.md` for intake, planning, Design readiness, API readiness, implementation, QA/release evidence, and failure loop.
- `mobile-app-dev-team/governance/gates-and-evidence.md` for required gates, evidence ladder, human gates, and external proof boundaries.
- `mobile-app-dev-team/workflows/github-artifact-workflow.md` for durable work-unit handoff and role artifact ownership.
- `mobile-app-dev-team/governance/app-eas-ota-rollback-runbook.md` for app/EAS/OTA rollback ownership and production-submit rollback requirements.
- The relevant repo-local `po-*`, `design-*`, `mobile-*`, `e2e-test`, and `qa-railway-workflow` skills for role-specific workflow details.

`workflows/entry-case-routing.md` supplies taxonomy and routing decisions. This skill operationalizes that taxonomy in pod runtime output. Do not duplicate every policy statement as an independent SoT; cite the source file in `process_sot` and return only the compact routing decision needed by the role pod.

## Role Identity

Resolve Role identity from `WM_ROLE`, `/workspace/IDENTITY`, and the pod SOUL. If these disagree, report `blocked` and do not invoke any repo-local Codex skills.

Do not ask the user to choose the role. The pod must use the role assigned by bootstrap and repo SoT.

## Runtime Paths

- Pod-native skill source: `mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/codex-role-workflow/SKILL.md`
- Pod runtime shape: `/workspace/skills/codex-role-workflow/SKILL.md`
- repo-local Codex skills: `.agents/skills/<skill-name>/SKILL.md`
- repo-local Codex agents: `.codex/agents/<agent-name>.toml`

Do not place repo-local Codex skills or custom agents inside this pod-native skill directory.

## Runtime Repo Path Resolution

When this skill runs from `/workspace/skills/codex-role-workflow/SKILL.md`, it is outside the managed project repository.

Do not resolve repo SoT paths relative to `/workspace/skills/codex-role-workflow`.

Resolve repo-local SoT from the managed project repository root. In the standard pod runtime, the project repository root is `/workspace/projects/Wondermove-Inc/new-mobile-app`, so the entry routing SoT is:

```text
/workspace/projects/Wondermove-Inc/new-mobile-app/mobile-app-dev-team/workflows/entry-case-routing.md
```

If the managed repository root differs, use the root declared by project-bootstrap, pod-role-bootstrap, or the pod managed-path registry, then append `mobile-app-dev-team/workflows/entry-case-routing.md`.

If `workflows/entry-case-routing.md` cannot be read from the managed repository root, return `blocked` with `blocked_reason: missing accepted entry-case routing SoT`. Do not infer the routing overlay from memory or from a stale copy under `/workspace/skills`.

## Role Matrix

| Operating Role | Allowed repo-local Codex skills | Primary reviewers | Durable artifact stage |
| --- | --- | --- | --- |
| Product/Planning | `po-requirement-office-hours`, `po-work-unit-planning-and-agent-sprint`, `po-prd-to-execution`, `po-planning-completeness-review` | `po-planning-reviewer`, `po-scope-gate-reviewer` | `00-product-planning` |
| Design | `design-mobile-design-handoff`, `design-stitch-mcp-operating-rules` | `design-reviewer`, `po-planning-reviewer` | `01-design` |
| Mobile Architect | `mobile-architect-workflow` | `wm-implementation-reviewer`, `wm-contract-reviewer` | `02-architecture` |
| Mobile App Dev | `mobile-app-dev-workflow` | `wm-implementation-reviewer`, `wm-contract-reviewer` | `04-mobile-app` |
| Backend/API Integrator | `mobile-backend-api-integrator-workflow` | `wm-contract-reviewer`, `wm-implementation-reviewer` | `03-contract-api` |
| QA/Release | `e2e-test`, `qa-railway-workflow` | `wm-implementation-reviewer` | `05-qa-release` |

Use `wm-docs-researcher`, `po-docs-researcher`, or `design-researcher` only for read-only uncertainty research, not for implementation.

## Common Intake Rule

Every user input starts at Product/Planning intake unless a committed durable work-unit state already assigns the next action to a downstream role.

First-class input forms include:

- project requirement;
- project specification;
- PRD or product brief;
- feature brief;
- issue, bug, failure, or evidence-gap report;
- modification request;
- direct implementation request;
- proactive report;
- role handoff or resume request.

PRD is one input class under the broader planning surface. A PRD may be ready, broad, unclear, or pre-execution depending on scope, evidence, and readiness.

No user input routes directly to an execution role without an accepted task packet plus `READY_FOR_EXECUTION`, or a deterministic `status.json` next action from the work-unit resolver. Chat text is coordination evidence unless it is linked back to accepted SoT. A proactive report is no-auto-execution: do not create issues, change scope, edit code, or change SOUL/workflow policy from a proactive report without Product/Planning triage.

If a role pod receives out-of-role work, return `blocked` or `not_applicable` instead of absorbing ownership.

## Entry Case Routing

Classify the input into one compact `entry_case` before recommending a skill:

| `entry_case` | Route |
| --- | --- |
| `unclear` | Product/Planning uses `po-requirement-office-hours`. |
| `broad` | Product/Planning uses `po-work-unit-planning-and-agent-sprint`. |
| `ready_bounded` | Product/Planning uses `po-prd-to-execution`. |
| `pre_execution` | Product/Planning uses `po-planning-completeness-review`. |
| `modification_request` | Product/Planning classifies within-approved-scope, scope-change, human-gate, or non-goal before any update packet. |
| `issue_bug_failure` | Product/Planning classifies bug-fix, failure/rework, release-evidence-gap, human-gate, or symptom-without-evidence; implementation handoff remains tests-first. |
| `direct_implementation_language` | If an accepted task packet and `READY_FOR_EXECUTION` exist, return the assigned downstream role; otherwise route back to sizing, clarification, or completeness review. |
| `proactive_report` | Product/Planning triages with no-auto-execution. |
| `design_relevance` | Design is required when layout, interaction, or visual hierarchy matters. |
| `contract_or_backend` | Backend/API Integrator owns `packages/contracts` and approved `apps/api` service delivery. |
| `architecture_runtime_releaseability` | Mobile Architect owns architecture, route/state, runtime, dependency, EAS strategy, and releaseability review. |
| `qa_release_evidence` | QA/Release owns evidence planning, E2E records, failure classification, and release-risk reporting. |
| `human_gate_or_external_proof` | Return `blocked` until the required human owner records a valid decision. |
| `cross_pod_handoff` | Use `docs/plans/work-units/<work-unit-id>/` durable GitHub handoff; do not rely on another pod local workspace. |

For C1-C5 report language, treat those labels only as convenience mapping. The authoritative routing categories are the SoT-named categories in `workflows/entry-case-routing.md`.

## Design Relevance

Design routing is based on whether layout, interaction, or visual hierarchy is introduced or changed. Screen presence is not the decisive trigger.

Apply these rules:

- If layout, interaction, or visual hierarchy matters, route to Design.
- If relevance is uncertain, route to Design.
- Product/Planning classifies relevance for scope/evidence routing only.
- Product/Planning does not own Design quality.
- Design owns Design quality and the Stitch-backed handoff.
- `01-design not_applicable` requires durable non-goal evidence.
- Text-only or ASCII design description does not authorize implementation when layout, interaction, or visual hierarchy is in scope.
- P0 approval before Stitch generation is required.
- Exactly two Stitch options are required when Stitch generation proceeds.
- P1 approval before HTML extraction is required.
- Before P1, do not call or persist `fetch_screen_code`, `code.html`, SDK `getHtml`, `htmlCode.downloadUrl`, or equivalent HTML extraction metadata.

## Hotfix And Rollback

Emergency hotfix work is expedited, not gate-bypassing.

Apply these rules:

- Emergency hotfix still enters Product/Planning intake.
- Tests-first still applies before implementation.
- Production submit still requires the `production-submit` human gate.
- Accepting risk after a failed gate requires the `failed-gate-risk` human gate.
- A production-submit decision must include `rollback_owner` and `rollback_plan`.
- Repo-local evidence does not prove live EAS, store submission, production readiness, or external rollback execution.
- External rollback remains owned by the approving human or ops owner.

## Required Process

1. Confirm role identity and accepted SoT before recommending a repo-local skill.
2. Classify `entry_case` using `workflows/entry-case-routing.md`.
3. Confirm the request belongs to the resolved role or that a durable work-unit next action assigns it to that role.
4. Return the allowed skill, reviewer, durable artifact stage, routing reason, and process SoT.
5. Block out-of-role work instead of absorbing ownership.
6. Block any human gate, failed-gate risk acceptance, production-submit, billing, privacy, legal, external messaging, business/budget owner decision, irreversible scope tradeoff, or external proof decision until the required human owner has approved it.
7. Block secret exposure requests. Do not print auth token values, credential values, private account values, or secret file contents.
8. Remind the role pod that implementation completion requires reviewer evidence, `git diff`, and `git status --short` before reporting Done.

## Output Contract

Return `codex-role-workflow/v1`.

Use one status from `ready | blocked | not_applicable`.

Include:

- `resolved_role`;
- `role_identity_source`;
- `entry_case`;
- `routing_reason`;
- `process_sot`;
- `allowed_repo_local_codex_skills`;
- `required_reviewers`;
- `durable_artifact_stage`;
- `readiness_state_or_required_gate`;
- `blocked_reason` when status is `blocked`;
- `not_applicable_reason` when status is `not_applicable`;
- `human_gate_or_external_proof_blocker`;
- `next_action`;
- `secret_safety_statement`;
- `external_proof_boundary`.

Do not include token values, private endpoints, private account values, credential values, secret file contents, or live pod state that cannot be locally verified.

Do not claim local checks prove live pod/OpenClaw, GitHub branch protection, Stitch, Confluence, EAS, Maestro, Railway, mobile-mcp, store submission, production readiness, or external proof.

## Output Examples

These examples are illustrative, not exhaustive.

Product/Planning unclear route:

```text
schema: codex-role-workflow/v1
status: ready
resolved_role: Product/Planning
entry_case: unclear
allowed_repo_local_codex_skills: po-requirement-office-hours
required_reviewers: po-planning-reviewer
durable_artifact_stage: 00-product-planning
process_sot: mobile-app-dev-team/workflows/entry-case-routing.md
next_action: clarify facts, assumptions, unknowns, non-goals, and readiness state
```

Direct implementation request without readiness:

```text
schema: codex-role-workflow/v1
status: blocked
entry_case: direct_implementation_language
readiness_state_or_required_gate: accepted task packet plus READY_FOR_EXECUTION required
blocked_reason: direct implementation language cannot bypass Product/Planning intake
next_action: route to po-work-unit-planning-and-agent-sprint or po-planning-completeness-review
```

Design not applicable route:

```text
schema: codex-role-workflow/v1
status: not_applicable
entry_case: design_relevance
not_applicable_reason: no layout, interaction, or visual hierarchy is introduced or changed
durable_artifact_stage: 01-design
next_action: record durable non-goal evidence before marking 01-design not_applicable
```

Production-submit route:

```text
schema: codex-role-workflow/v1
status: blocked
entry_case: human_gate_or_external_proof
readiness_state_or_required_gate: production-submit human-gate/v1
human_gate_or_external_proof_blocker: production-submit requires human approval plus rollback_owner and rollback_plan
external_proof_boundary: repo-local evidence does not prove store submission or production readiness
```

Proactive report route:

```text
schema: codex-role-workflow/v1
status: ready
entry_case: proactive_report
routing_reason: proactive report requires Product/Planning triage and no-auto-execution
next_action: classify as REJECT, NON_GOAL, BACKLOG_CANDIDATE, SPRINT_IMPROVEMENT, HUMAN_DECISION_REQUIRED, or RUNTIME_CAPABILITY_BLOCKED
```
