# Global Claude Instructions

<!--
This file contains global instructions that apply to all projects.
Add your personal preferences and rules here.
-->
# graphify
- **graphify** (`~/.claude/skills/graphify/SKILL.md`) - any input to knowledge graph. Trigger: `/graphify`
When the user types `/graphify`, invoke the Skill tool with `skill: "graphify"` before doing anything else.

# WonderMove Claude helper layer (.claude)

Codex remains the runtime Source of Truth for this repository through `.agents/skills/`
and `.codex/agents/`. Claude Code ports are deferred; do not treat missing `.claude/`
ports as active runtime drift unless a future approved porting plan creates them.

## Deferred Codex Ports (not generated)

The following names exist in Codex runtime SoT but are not present as Claude Code ports.
Status: **DEFERRED — Codex SoT (`.agents/skills/`, `.codex/agents/`) is authoritative.
Claude Code port generation is NO_GO until a separate approved plan changes this.**

- **wm** — WonderMove mobile repo workflow: SoT-grounded planning, tests-first implementation, read-only review evidence, branch/PR gate readiness. Trigger: `/wm` (alias `$wm`). Invoke only when explicitly requested.
- **wm-orchestrate** — work-unit next-action resolver for durable `status.json` state. Trigger: `/wm-orchestrate`.
- **git-workflow** — repo-scoped Git/PR operations (preflight, start, sync, commit, pr, review-status, issue, handoff, complete) without bypassing gates. Trigger: `/git-workflow` (alias `$git-workflow`).
- **mobile-app-dev-workflow** — thin write-side Mobile App Dev role workflow (routed to from `/wm`).
- **mobile-backend-api-integrator-workflow** — thin write-side Backend/API Integrator role workflow (routed to from `/wm`).

Read-only custom agent ports under `.claude/agents/<name>.md` are also deferred. Use
Codex `.codex/agents/<name>.toml` as the authoritative agent definitions.

## Independent adopted skills (`.claude/skills/<name>/SKILL.md`)

These are **independent, self-contained** skills adopted from the mature `openclaw-cloud/.claude`
catalog — **not** Codex ports. Each is read-only/confirmation-only, completes from its own
`SKILL.md` + `references/`, and does not route to or depend on other skills, `.agents/skills` SoT,
or any write-capable executor.

- **brief-gatekeeper** — clarifies ambiguous work requests before acting (visible clarity checklist
  → single bundled question round → confirm). Triggers on vague verbs (정리/처리/검토/분석/봐줘) or
  missing scope/output. Read-only/confirmation-only.
- **code-quality** — read-only code-smell, clean-architecture, and TDD (tests-first) review for the
  Expo RN + TypeScript stack. Analyzes/advises only; never edits, gates, or self-approves. Trigger: `/code-quality`.
- **best-practices** — directly-invocable curated coding-rules library (TS, RN-applicable React,
  backend/contract, testing) with a role→rules index (`rules/_role-index.md`). Trigger: `/best-practices [role|topic]`.

## Deferred read-only custom agent ports (not generated)
These Codex read-only custom agents are authoritative under `.codex/agents/<name>.toml`
and are only candidates for future Claude Code ports under `.claude/agents/<name>.md`.
Verdict-producing reviewers (emit JSON verdict envelope): `wm-implementation-reviewer`, `wm-contract-reviewer`, `po-planning-reviewer`, `po-scope-gate-reviewer`, `design-reviewer`.
Researchers/advisors (advisory only): `wm-docs-researcher`, `wm-gate-fix-advisor`, `po-docs-researcher`, `design-researcher`.
Mobile reviewers/advisors: `mobile-implementation-reviewer`, `mobile-contract-reviewer`, `mobile-docs-researcher`, `mobile-gate-fix-advisor`.
All agents are read-only (no Edit/Write/NotebookEdit), cite source references, and must not recursively delegate. `/wm` routes material planning/review decisions to these via the Agent/Task tool.

## Terminology (canonical: `REPO_OPERATIONS.md` → "Skill, Agent, And AGENTS.md Terminology")

Each overloaded term maps to exactly ONE concept; a location is only where that one
concept lives. Path definitions follow official Codex/Claude Code docs. This is a
convenience summary — the tracked canonical source is `REPO_OPERATIONS.md`.

- **Skill** (one concept; `SKILL.md` folder): Codex `.agents/skills/<name>/SKILL.md` · Claude `.claude/skills/<name>/SKILL.md` · Pod-native OpenClaw `/workspace/skills/<slug>/SKILL.md` (authored under `mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/<slug>/`). "pod agent skills" = pod-native skills, not agents.
- **Custom agent** (one concept): Codex `.codex/agents/<name>.toml` · Claude `.claude/agents/<name>.md`.
- **AGENTS.md** (distinct third concept): plain custom-instructions standard; not a skill, not an agent.
- **Directory trap**: `.agents/` holds *skills*; `.codex/agents/` holds *agents* (official asymmetry).
- **Not artifacts**: "operating role / pod role" = organizational LLM role (6 roles + non-LLM Gatekeeper); "Agent/Task tool" = dispatch mechanism.
