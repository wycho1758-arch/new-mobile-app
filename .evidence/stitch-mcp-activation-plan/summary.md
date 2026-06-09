# Stitch MCP Activation Plan Evidence

Date: 2026-06-09
Status: plan completed, runtime activation pending approval

## MCP Check

- `.codex/config.toml` currently registers `mobile-mcp` and `serena`; no `stitch` registration exists.
- `which -a codex` shows both `/usr/local/bin/codex` and `/opt/homebrew/bin/codex`.
- `/usr/local/bin/codex` failed in this session without output.
- `/opt/homebrew/bin/codex --version` returned `codex-cli 0.137.0`.
- `/opt/homebrew/bin/codex mcp list` exited 0 and showed no `stitch` MCP entry.
- The MCP list output included unrelated global MCP entries; secret-bearing URLs were not copied into this evidence.

## Verification

Initial verification before reviewer follow-up:

- `pnpm run test:runtime`: passed.
- `pnpm run test:local-harness`: passed.

Final verification after reviewer follow-up:

- `pnpm run test:runtime`: passed. Output included `Validated 3 skills, 8 agents, and 4 hook events` and `Passed 40 hook fixture tests`.
- `pnpm run test:local-harness`: passed. Output included preflight acceptance of `/opt/homebrew/bin/codex (codex-cli 0.137.0)`, workspace lint/test success, self-test pass, and `local harness all passed`.

These checks should be rerun after any runtime activation patch.

## Reviewer

Reviewer evidence is recorded in `.evidence/stitch-mcp-activation-plan/reviewer.md`.

## Decision Pending

Activation is intentionally not applied. Required decision: register Stitch as a required project MCP server or optional design-only MCP.
