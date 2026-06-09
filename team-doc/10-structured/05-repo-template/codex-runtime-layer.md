---
docType: "reference"
sourcePageId: "1371963427"
sourceTitle: "01-8. ClawPod Agent용 기본 모바일 앱 프로젝트 템플릿 repo 구성 설계안"
sourceVersion: "20"
sourceHeading: "Codex runtime layer"
---

# Codex runtime layer

The template ships a runtime layer that lets an Agent work the repo through OpenAI's Codex CLI. The assets are committed in-repo (mostly git-tracked; `.codex/config.toml` and some `scripts/*.mjs` are still being committed on the work branch) and have been validated against the official Codex CLI spec (codex-cli 0.137.0 — the SessionStart hook in `.codex/hooks.json` was observed firing in `codex exec` run logs).

## Asset layout

- `.codex/config.toml`: registers the `mobile-mcp` MCP server (`npx @mobilenext/mobile-mcp@0.0.58`) for local visual QA / device automation. Version is pinned; `@latest` is disallowed.
- `.codex/agents/*.toml` (×4): read-only custom agents — `mobile-contract-reviewer`, `mobile-docs-researcher`, `mobile-gate-fix-advisor`, `mobile-implementation-reviewer`. Each must supply the three required fields `name`, `description`, `developer_instructions`.
- `.codex/hooks.json` + `.codex/hooks/*.mjs` (×4): lifecycle hooks — SessionStart (context injection), PreToolUse (policy block), PostToolUse (evidence reminder), Stop (gatekeeper advisory).
- `.agents/skills/<name>/SKILL.md` (×2): native repo skills — `mobile-app-dev-workflow`, `mobile-backend-api-integrator-workflow` (write-side; review-only work routes to a custom agent). Frontmatter requires `name` + `description`.
- `evals/`: runtime eval fixtures (skills / agents / hooks / local-harness).
- `scripts/*.mjs`: runtime validation — `validate-runtime-artifacts`, `test-hooks`, `codex-preflight`, `test-local-harness`, `clean-tree-guard`, `codex-headless-review`, etc.
- `AGENTS.md` (root): Codex auto-loaded work contract (the §12 six axes plus Codex Runtime Paths, Expo policy, QA selectors, Local Harness Scope); merged git-root → cwd.
- `PROJECT_ENVIRONMENT.md`: environment SoT that `AGENTS.md` requires to be kept in sync.

## Validation and gates

- Local: `pnpm run validate` (skills/agents/hook-event structure), `pnpm run test:hooks` (hook fixtures), and `node scripts/codex-preflight.mjs` (codex binary arch/version + headless smoke — fail-open skip, so a usage-limit overflow does not block).
- CI: `.github/workflows/quality-gate.yml` always runs `pnpm run test:runtime`, and conditionally runs `pnpm run test:local-harness` when Codex runtime changes are detected (`.codex/`, `.agents/`, `evals/`, `scripts/`, `AGENTS.md`, `PROJECT_ENVIRONMENT.md`, etc.).
- Auth: the Codex CLI runs `codex exec` non-interactively (`approval: never`) under ChatGPT-plan auth. On usage-limit overflow, preflight fails open and skips, independent of integration conformance.

## Source

- Page ID: 1371963427
- Source heading: Codex runtime layer
- Source version: 20
