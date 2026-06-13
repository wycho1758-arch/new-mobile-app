# Role-Specific Codex CLI Skill Analysis Index And Executive Verdict

Date: 2026-06-13
Mode: analysis output
Scope: `mobile-app-dev-team/**`, `.agents/skills/**`, `.codex/agents/**`
Baseline commit observed in prior reviewer evidence: `afd9208adde3c1721c0ea7c5ea0e87af96e2b926`

## Executive Verdict

Current state is **PARTIAL**.

The repository already has strong role assets:

- six active SOUL roles in `mobile-app-dev-team/02-role-souls/`;
- repo-local Codex skills in `.agents/skills/`;
- read-only custom agents in `.codex/agents/`;
- pod-native setup/readiness skills in `mobile-app-dev-team/09-pod-native-openclaw-skills/`;
- durable work-unit handoff structure under `docs/plans/work-units/<work-unit-id>/`.

However, the repository still lacks a complete role-specific Codex CLI operating layer for independent pod agents. Current pod-native skills prepare the pod, authenticate Codex, check role setup, and verify role-specific external readiness for Design or QA/Release. They do **not** teach each SOUL role how to select its allowed repo-local Codex skills, call allowed read-only agents, write role-owned work-unit artifacts, stop at role boundaries, and hand off through GitHub.

The missing item is not generic Codex CLI documentation. The missing item is a role-aware bridge:

```text
mobile-app-dev-team/09-pod-native-openclaw-skills/codex-role-workflow/SKILL.md
```

Runtime shape:

```text
/workspace/skills/codex-role-workflow/SKILL.md
```

This new pod-native skill should connect pod identity (`WM_ROLE` or `/workspace/IDENTITY`) to repo-local Codex skills and `.codex/agents` inside the checked-out repo.

## Output Files

This analysis is split by role so each document can be used as an implementation spec for future skill and agent work.

| File | Purpose |
| --- | --- |
| `00-index-and-executive-verdict.md` | Overall verdict, role matrix, priority, implementation sequence. |
| `01-product-planning-codex-use-skill-analysis.md` | Product/Planning role-specific process and skill/agent gap analysis. |
| `02-design-codex-use-skill-analysis.md` | Design role-specific Stitch/Codex process and skill/agent gap analysis. |
| `03-mobile-architect-codex-use-skill-analysis.md` | Mobile Architect process, missing repo-local skill, and reviewer gap analysis. |
| `04-mobile-app-dev-codex-use-skill-analysis.md` | Mobile App Dev implementation workflow and pod handoff reinforcement analysis. |
| `05-backend-api-integrator-codex-use-skill-analysis.md` | Backend/API contract-first workflow and service evidence reinforcement analysis. |
| `06-qa-release-codex-use-skill-analysis.md` | QA/Release evidence and release-readiness workflow analysis. |
| `07-cross-role-skill-agent-implementation-recommendation.md` | Concrete skill/agent/validator/eval implementation recommendation. |
| `08-reviewer-checklist-and-final-verdict.md` | Reviewer checklist and final delivery verdict for this analysis package. |

## SoT Basis

Primary sources:

- `AGENTS.md`: mandatory repo rules, runtime paths, TDD, PR gate, no direct `main` push, no external runtime repo edits.
- `REPO_OPERATIONS.md`: policy owner map, Codex-only repo work in pods, runtime boundary between pod-native OpenClaw skills and repo-local Codex skills/agents.
- `PROJECT_ENVIRONMENT.md`: current runtime baseline, required root gates, mobile evidence ladder.
- `mobile-app-dev-team/00-sot-and-principles.md`: current SoT priority and active skill definition.
- `mobile-app-dev-team/02-role-souls/*.md`: six active role contracts.
- `mobile-app-dev-team/03-role-capability-matrix.md`: role capabilities and handoff boundaries.
- `mobile-app-dev-team/04-skills-and-agents-matrix.md`: active repo-local skills and custom agents.
- `mobile-app-dev-team/05-work-processes.md`: role execution order.
- `mobile-app-dev-team/06-gates-and-evidence.md`: evidence, gate, human-gate, and durable handoff rules.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/README.md`: pod-native skill inventory and per-role setup dependencies.
- `mobile-app-dev-team/10-github-artifact-workflow.md`: durable GitHub work-unit artifact contract.
- `mobile-app-dev-team/16-pod-environment-bootstrap.md`: fresh pod zero-to-ready sequence.
- Actual `.agents/skills/*/SKILL.md` and `.codex/agents/*.toml`: runtime contracts that exist today.

## Role Coverage Matrix

| Role | Current repo-local skill coverage | Current pod-native coverage | Current custom agent coverage | Verdict |
| --- | --- | --- | --- | --- |
| Product/Planning | Strong: `po-*`, `wm-orchestrate`, `git-workflow` | Setup only | Strong: `po-*`, `wm-docs-researcher` | Partial: needs pod-native role bridge, no new repo-local skill required now. |
| Design | Strong: `design-*`, `wm-orchestrate`, `git-workflow` | Setup plus `stitch-adc-setup` | Strong: `design-*`, plus Product/Planning gate reviewers | Partial: needs pod-native role bridge and explicit `DESIGN.md` baseline selection, same Stitch project continuation, manifest metadata, and drift blocking. |
| Mobile Architect | Weak: no dedicated repo-local role skill | Setup only | Partial: uses `wm-*` reviewers, no architecture-specific reviewer | Missing/Partial: needs pod-native bridge and likely new `mobile-architect-workflow`; evaluate architecture reviewer. |
| Mobile App Dev | Strong: `mobile-app-dev-workflow`, `wm`, `wm-orchestrate`, `git-workflow` | Setup only | Strong: `wm-*` | Partial: needs pod-native role bridge and reinforcement for status/work-unit handoff. |
| Backend/API Integrator | Strong: `mobile-backend-api-integrator-workflow`, `wm`, `wm-orchestrate`, `git-workflow` | Setup only | Strong: `wm-contract-reviewer`, `wm-docs-researcher` | Partial: needs pod-native role bridge and possibly service-evidence/migration reinforcement. |
| QA/Release | Good but split: `e2e-test`, `qa-railway-workflow`, `wm-orchestrate`, `git-workflow` | Setup plus `eas-robot-auth-setup` | Partial: `wm-gate-fix-advisor`, `wm-docs-researcher` | Partial: needs pod-native bridge and likely release-readiness synthesis skill or reviewer reinforcement. |

## Primary Gap

The primary gap is a missing **pod-native role Codex workflow bridge**.

Current setup skills answer:

- Is Codex CLI available?
- Is the role pod ready?
- Is the repo checked out?
- Are role-specific external tools ready?

They do not answer:

- I am this role; which Codex skill may I use now?
- Which reviewer/researcher/advisor may I call?
- Which role-owned work-unit artifacts must I write?
- Which stage in `status.json` is mine?
- When do I stop for another role, reviewer, human gate, or deterministic Gatekeeper?
- How do I hand off from an isolated pod with no shared storage?

## Mandatory Codex Operating Contract

Every future role skill or role bridge should carry this default Codex process. This is not generic CLI help; it is the minimum operating contract that lets a pod role work safely inside this repo:

1. Read the applicable SoT before planning. At minimum this means `AGENTS.md`, `PROJECT_ENVIRONMENT.md`, the role SOUL, relevant work-unit artifacts, and the role-owned process/gate docs.
2. Stay read-only while planning. Do not edit files, prompts, skills, agents, work-unit state, or external systems during the planning phase.
3. Do not predict missing facts. If the SoT, external-tool capability, user approval, or reviewer scope is missing, mark it `unknown` or `blocked`.
4. Produce a role-owned plan with scope, owner role, affected paths, required artifacts, tests/evals/validators, evidence path, gate impact, reviewer target, human gates, and source references.
5. Send the plan to the appropriate read-only reviewer before execution and report the reviewer verdict with the plan.
6. Execute only after the plan is approved and no human gate blocks the work.
7. After execution, send the actual diff, command output, evidence, and intended outcome to the reviewer for final verification.
8. Run `git diff` for changed paths and `git status --short`.
9. Report whether the diff matches the approved direction, where evidence lives, and what residual external proof remains unverified.

This contract should be added to `codex-role-workflow` and referenced from role-specific repo-local skills so each role can perform its own work without guessing.

For Design, the selected `DESIGN.md` or `design.md` baseline and same Stitch project are part of the Design SoT for the work unit. Unapproved design-system drift, unapproved project fork, or missing baseline metadata must block handoff to Mobile App Dev.

## Recommended Implementation Priority

1. Add pod-native `codex-role-workflow`.
2. Add repo-local `mobile-architect-workflow`.
3. Reinforce Design Stitch skills for `DESIGN.md` baseline approval, same Stitch project continuation, manifest metadata, and drift-blocking reviewer checks.
4. Add validation for the pod-native bridge and role mappings in `scripts/validate-team-doc.mjs`.
5. Add eval smoke fixtures for `codex-role-workflow`.
6. Reinforce existing repo-local skills where needed:
   - `mobile-app-dev-workflow`: explicit `04-mobile-app` and `status.json` handoff.
   - `mobile-backend-api-integrator-workflow`: explicit service-evidence/migration/rollback path.
   - `e2e-test` and `qa-railway-workflow`: explicit synthesis into `05-qa-release`.
7. Decide whether to add:
   - `mobile-architect-reviewer` custom agent;
   - `qa-release-readiness-reviewer` custom agent;
   - `qa-release-readiness-workflow` repo-local skill.

## Non-Goals

- Do not create a Gatekeeper SOUL.
- Do not put repo-local Codex skills under `09-pod-native-openclaw-skills/`.
- Do not put pod-native OpenClaw runtime skills under `.agents/skills/`.
- Do not replace existing `po-*`, `design-*`, `mobile-*`, `wm-*`, or QA skills when reinforcement is enough.
- Do not claim local validation proves live OpenClaw/OrbStack pods, EAS, Stitch, branch protection, mobile-mcp device behavior, Jira, Confluence, Railway, or store submission.
