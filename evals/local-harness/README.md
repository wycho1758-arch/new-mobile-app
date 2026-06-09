# Local Harness Contract

This harness validates the mobile organization runtime surface that can be checked locally in this repository. It uses the Confluence pages listed in `sot/snapshot.json` as the source of truth.

## ASSERTS

- The organization role model is exactly 6 LLM roles plus 1 non-LLM Gatekeeper.
- The 6 LLM roles are Product/Planning, Design, Mobile Architect, Mobile App Dev, Backend/API Integrator, and QA/Release.
- Gatekeeper has no SOUL.md role fixture and is modeled only as deterministic predicates and evidence checks.
- CTO is not a mobile organization runtime role in this harness.
- Native Codex CLI repo skills use `.agents/skills/<skill-name>/SKILL.md`.
- Native Codex custom agents use `.codex/agents/<agent-name>.toml`.
- Native Codex hooks use `.codex/hooks.json` and `.codex/hooks/`.
- Native Codex MCP config uses `.codex/config.toml`.
- Product/Planning fixture work is coordinator-only: PRD, task, evidence, and human-gate routing.
- Local validation must not modify external platform/runtime repositories.
- CI may run this harness conditionally for Codex runtime changes.

## DOES NOT ASSERT

- It does not prove external platform/runtime behavior.
- It does not create Jira, Confluence, Tasks, GitHub branch protection, or EAS side effects.
- It does not inject EAS secrets or run EAS cloud build/submit.
- It does not automate production submit or replace recorded human approval.
- It does not create standalone role wrapper skills such as `mobile-product-planning-workflow`, `mobile-design-workflow`, or `mobile-architect-workflow`.
- It does not validate app feature behavior; app behavior belongs in workspace tests, Maestro flows, and release evidence.
- It does not validate OpenClaw packaging, `/workspace/skills`, `OPENCLAW_ROOT`, generated agent packages, or external platform/runtime repositories.

## Confluence Sources

| Source | Page ID | Harness Use |
| --- | ---: | --- |
| 01-2. organization roles | 1373765682 | 6 LLM roles plus non-LLM Gatekeeper; no Gatekeeper SOUL.md |
| 01-3. Workflows Case A-H | 1373667425 | Case routing, evidence, gate, and human approval expectations |
| 01-4. Skills | 1373667362 | MVP skill set, Case A-H registry, Gatekeeper pass/fail boundary |
| Role-specific Codex Runtime | 1374289964 | Native skill, custom agent, and hook paths |
| Role-specific Codex Runtime / Skills | 1374290005 | Skill taxonomy and forbidden role wrapper structures |
| mobile-project-bootstrap-workflow | 1374421001 | Case A owner matrix and human-gate boundaries |
| mobile-gatekeeper | 1373798443 | Deterministic evidence predicates and pass/fail non-reinterpretation |
| 01-7. progress plan/status | 1373700222 | Phase 3 manual bootstrap owner steps |
| SOUL.md Product/Planning | 1373798422 | Local coordinator boundaries |
| SOUL.md Design | 1373765702 | Screen/state/handoff boundaries |
| SOUL.md Mobile Architect | 1373667383 | Architecture, ADR, contract, and risk boundaries |
| SOUL.md Mobile App Dev | 1373700159 | Mobile implementation and native skill smoke boundaries |
| SOUL.md Backend/API Integrator | 1373700180 | Contract, mock, risk, and backend/API boundaries |
| SOUL.md QA/Release | 1373700201 | Evidence, release readiness, failure, and human-gate boundaries |

## Local Runtime Boundary

Codex headless smoke is local evidence only. It can show that prompts, skills, files, and hook configuration are coherent, but it cannot prove external platform/runtime behavior.

Dirty worktree state is intentionally not a harness failure condition. Runtime configuration and fixtures must remain verifiable while they are being edited.
