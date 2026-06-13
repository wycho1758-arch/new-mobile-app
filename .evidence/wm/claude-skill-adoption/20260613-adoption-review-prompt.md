# Review request: openclaw-cloud → `.claude/` independent skill adoption

## What to review
Three NEW independent skills were added under `.claude/skills/` (this repo). Review them against the
approved plan and the hard constraints below. This is an additive change; the existing `.claude`
Codex-port skills/agents are being restructured separately by the user and are out of scope.

Changed/added paths:
- `.claude/skills/brief-gatekeeper/` (verbatim adoption: SKILL.md + references/4 + examples/2)
- `.claude/skills/code-quality/` (SKILL.md + references/failure-messages.md) — adapted + expanded
- `.claude/skills/best-practices/` (SKILL.md + rules/60 incl. `_role-index.md`) — independent leaf + curated
- `CLAUDE.md` — added an "Independent adopted skills" subsection

## Hard constraints to verify (cite file:line for any finding)
1. **Independence**: each new skill must complete from its own `SKILL.md` (+ its own `references/`);
   it must NOT `ref`/route to other skills, `.agents/skills` Codex SoT, or any write-capable
   executor (`dev-executor`, `design-executor`, `bug-fixer`). No dangling links to removed files.
2. **Governance**: read-only or confirmation-only; no hook-as-hard-gate; no self-approval; no
   dependence on unconfigured MCP (e.g. Context7). Serena namespace must be `mcp__serena__*`.
3. **Scope**: changes confined to `.claude/` and `CLAUDE.md`; `.codex/` and `.agents/` untouched.
4. **code-quality**: includes Clean Architecture + TDD (tests-first) content; excludes shadcn (RN
   forbids shadcn/ui in screens). Stack context = Expo RN + TypeScript + `packages/contracts`.
5. **best-practices**: `user-invocable: true` leaf; curated to repo stack (kept ts-*, RN-applicable
   react-*, backend-patterns, test-infrastructure); excluded Go/Python/Rust, `react-server-*`,
   `react-bundle-*`, `react-js-passive-events`, `ts-nextjs-api-route-typing`; `rules/_role-index.md`
   maps the repo's 6 operating roles; index files (`_sections.md`, `react-index.md`, `ts-index.md`)
   contain no dangling references to removed rule files.

## SoT references
- Approved plan: `/Users/tw.kim/.claude/plans/documents-aga-test-openclaw-cloud-claud-merry-harp.md`
- `mobile-app-dev-team/02-role-souls/mobile-app-dev-soul.md` (L113: no shadcn/ui in RN screens)
- `mobile-app-dev-team/02-role-souls/*` (6 operating roles)

## Output
Findings-first prose, then exactly one fenced reviewer verdict JSON envelope
(verdict GO/NO_GO/NEEDS_HUMAN/BLOCKED, reviewer, mode, scope, findings, checks_reviewed,
residual_risks, next_action).

## Scope addendum (user-authorized, 2026-06-13)
The user explicitly authorized one change OUTSIDE `.claude/`+`CLAUDE.md`: `package.json` `validate`
script changed from deleting `['.claude','.claude-state']` to `['.claude-state']` only, to stop the
runtime gate from wiping `.claude/`. Treat `package.json:21` as IN-SCOPE and authorized. `.codex`/
`.agents` remain untouched. Verification gates for the final state are recorded in
`20260613-implementation-evidence.md` (validate-runtime-artifacts.mjs: PASS 13 skills/13 agents/4 hooks;
codex self-test: PASS; `.claude/` confirmed surviving a validate run). The change is config-only; its
behavior is covered by the existing `validate`/`clean-tree-guard` self-tests rather than a new unit test.

Note: `.claude/` and `CLAUDE.md` are gitignored by the repo owner's policy; whether to track them
(force-add/unignore) or route via a generator is a repo-owner decision, not an implementation defect.
