# Skills And Agents Matrix

> Canonical term definitions (`skill`, `agent`, `AGENTS.md`, the `.agents/` vs
> `.codex/agents/` directory trap, and pod-native skills) live in
> `REPO_OPERATIONS.md` → "Skill, Agent, And AGENTS.md Terminology". This matrix lists
> concrete instances; it does not redefine the terms.

## Active repo-local skills

Active repo-local skills are only the directories that currently exist under `.agents/skills/<slug>/SKILL.md`.

| Skill | Display Title | Operating Role | Use |
| --- | --- | --- | --- |
| `wm` | Cross-role repo workflow | Cross-role repo workflow | SoT-grounded planning, TDD routing, reviewer evidence, PR readiness |
| `wm-orchestrate` | Cross-role next-action resolver | Cross-role repo workflow | Deterministic work-unit next-action resolution from `status.json`; stops on role, reviewer, gate, or human-gate blocks |
| `git-workflow` | Git workflow guardrail | Cross-role repo workflow | Branch preflight, scoped commit, PR/reviewer status, issue authorization, handoff, and completion without self-approval or gate bypass |
| `po-requirement-office-hours` | Chief Product Officer (CPO) / Product Delivery Lead | Product/Planning | Ambiguous request clarification |
| `po-work-unit-planning-and-agent-sprint` | Chief Product Officer (CPO) / Product Delivery Lead | Product/Planning | Work-unit sizing and bounded sprint shaping |
| `po-prd-to-execution` | Chief Product Officer (CPO) / Product Delivery Lead | Product/Planning | PRD/work-unit to role-scoped tasks |
| `po-planning-completeness-review` | Chief Product Officer (CPO) / Product Delivery Lead | Product/Planning | Readiness review before execution |
| `design-mobile-design-handoff` | Product Designer | Design | Stitch-backed mobile design handoff |
| `design-stitch-mcp-operating-rules` | Product Designer | Design | Stitch execution, P0/P1 gates, publication rules |
| `mobile-architect-workflow` | Mobile Architect / Technical Lead | Mobile Architect | Architecture planning, ADR, route/state impact, API co-sign, releaseability, and role-boundary handoff |
| `mobile-app-dev-workflow` | Mobile App Developer | Mobile App Dev | Expo React Native implementation |
| `mobile-backend-api-integrator-workflow` | Backend/API Engineer | Backend/API Integrator | Mobile-facing API contract/integration work |
| `e2e-test` | QA/Release Engineer | QA/Release | E2E plan, reset, execution, evidence |
| `qa-railway-workflow` | QA/Release Engineer | QA/Release | Railway API deploy/health/RN Web evidence; not full mobile release readiness |

## Current custom agents

`$wm routing` allows the dedicated `wm-*`, Product/Planning `po-*`, and Design `design-*` read-only agents listed by the workflow.

| Agent | Type | Primary Use |
| --- | --- | --- |
| `wm-implementation-reviewer` | read-only reviewer | wm-scoped implementation, tests, evidence, contract drift |
| `wm-contract-reviewer` | read-only reviewer | API contract, schemas, auth/session, mock-vs-real drift |
| `wm-docs-researcher` | read-only researcher | Expo/EAS/Maestro/NativeWind/Codex/Serena uncertainty |
| `wm-gate-fix-advisor` | read-only advisor | Failing gate/test/build/evidence triage |
| `po-planning-reviewer` | read-only reviewer | Planning package, task completeness, P0/P1 scope/evidence gates |
| `po-scope-gate-reviewer` | read-only reviewer | Scope containment, non-goals, human gates |
| `po-docs-researcher` | read-only researcher | Product/Planning SoT uncertainty |
| `design-reviewer` | read-only reviewer | Stitch handoff, P0/P1, five-state coverage, publication readiness |
| `design-researcher` | read-only researcher | Design/Stitch/DESIGN.md uncertainty |

## Legacy mobile-* agents

The repo also contains legacy mobile-* agents:

- `mobile-implementation-reviewer`
- `mobile-contract-reviewer`
- `mobile-docs-researcher`
- `mobile-gate-fix-advisor`

These legacy mobile-* agents remain available for other runtime/eval surfaces. For `$wm routing`, prefer the dedicated `wm-*`, `po-*`, and `design-*` agents unless a newer SoT says otherwise.

## Pod-native OpenClaw skills

Pod-native OpenClaw skills are source-managed under
`09-pod-native-openclaw-skills/` and run in pods as
`/workspace/skills/<slug>/SKILL.md`. The canonical per-role pod skill matrix is
`09-pod-native-openclaw-skills/README.md`.

The role-aware pod bridge is `codex-role-workflow`; it resolves a bootstrapped
pod role to allowed repo-local Codex skills, reviewers, durable artifact stage,
and stop conditions before role work proceeds.

Do not place repo-local Codex skills or agents in that pod-native skill tree.
Repo-local Codex artifacts remain under `.agents/skills/<slug>/SKILL.md` and
`.codex/agents/<agent>.toml`.
