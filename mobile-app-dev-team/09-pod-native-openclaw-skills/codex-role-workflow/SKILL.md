---
name: codex-role-workflow
description: Resolve an OpenClaw role pod to the correct repo-local Codex skills, reviewers, durable artifact stage, and stop conditions as status only without implementing role work or exposing secrets.
---

# Codex Role Workflow

Runtime shape: `/workspace/skills/codex-role-workflow/SKILL.md`

This pod-native OpenClaw skill is a status only role bridge. It does not implement Product, Design, Mobile Architect, Mobile App Dev, Backend/API Integrator, or QA/Release work. It tells the role pod which repo-local Codex skills and reviewers are allowed next.

## Role Identity

Resolve Role identity from `WM_ROLE`, `/workspace/IDENTITY`, and the pod SOUL. If these disagree, report `blocked` and do not invoke any repo-local Codex skills.

Do not ask the user to choose the role. The pod must use the role assigned by bootstrap and repo SoT.

## Runtime Paths

- Pod-native skill source: `mobile-app-dev-team/09-pod-native-openclaw-skills/codex-role-workflow/SKILL.md`
- Pod runtime shape: `/workspace/skills/codex-role-workflow/SKILL.md`
- repo-local Codex skills: `.agents/skills/<skill-name>/SKILL.md`
- repo-local Codex agents: `.codex/agents/<agent-name>.toml`

Do not place repo-local Codex skills or custom agents inside this pod-native skill directory.

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

## Required Process

1. Confirm role identity and accepted SoT before recommending a repo-local skill.
2. Confirm the request belongs to the resolved role.
3. Return the allowed skill, reviewer, and durable artifact stage.
4. Block out-of-role work instead of absorbing ownership.
5. Block any human gate, failed-gate risk acceptance, production submit, billing, privacy, legal, or external proof decision until the required human owner has approved it.
6. Block secret exposure requests. Do not print auth token values, credential values, private account values, or secret file contents.
7. Remind the role pod that implementation completion requires reviewer evidence, `git diff`, and `git status --short` before reporting Done.

## Output Contract

Return `codex-role-workflow/v1`.

Use one status from `ready | blocked | not_applicable`.

Include:

- resolved role;
- role identity source;
- allowed repo-local Codex skills;
- required reviewers;
- durable artifact stage;
- required SoT files;
- human gate or external proof blocker when present;
- next action;
- secret safety statement.

Do not claim local checks prove live pod/OpenClaw, GitHub, Stitch, Confluence, EAS, Maestro, Railway, or mobile-mcp external proof.
