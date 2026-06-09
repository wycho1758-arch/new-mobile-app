# Stitch MCP Activation Plan Reviewer Evidence

Date: 2026-06-09
Reviewer: `wm-implementation-reviewer` read-only subagent
Scope: plan-only review for Stitch MCP activation, prompt workflow, API key handling, and gate readiness

## Findings

Critical: none.

High: none.

Medium: API key storage plan originally left a risky local ignored env-file path. Reviewer noted `.gitignore` does not ignore `.env*`, hooks block reading `.env` files, and repo policy forbids committed credentials. The plan was updated to remove local `.env*` storage from the default workflow unless a future PR adds explicit ignore, hook, and validator coverage.

Medium: Scope needed explicit source-of-truth updates for credentials and runtime docs. The plan already included `PROJECT_ENVIRONMENT.md`; it now also calls out `docs/CREDENTIALS.md` and the local Confluence update document when `STITCH_API_KEY` becomes required.

Low: Validator and eval acceptance criteria needed more detail. The plan now specifies accepted remote HTTP and pinned local-adapter shapes, and negative checks for literal API keys, `EXPO_PUBLIC_STITCH*`, `@latest`, and checked-in secret placeholders.

Low: Verification needed an explicit blocked path if `codex mcp list` keeps failing after restart or reload. The plan now requires blocked evidence and forbids marking activation complete in that state.

## Residual Gaps

- Decide whether Stitch is a required project MCP server or optional design-only MCP.
- Verify the active Codex CLI remote HTTP MCP schema and header environment interpolation before editing `.codex/config.toml`.
- If remote HTTP is unsupported, review and pin any local adapter before use.
- Provide `STITCH_API_KEY` only through process environment or a Codex/user secret facility; do not store or print the value.

## Local Source References

- `.codex/config.toml`: currently registers `mobile-mcp` and `serena`, not `stitch`.
- `PROJECT_ENVIRONMENT.md`: Codex runtime inventory and public env warning.
- `DESIGN.md`: Stitch is the sole authoring tool and permits Stitch MCP fetch.
- `docs/SETUP.md`: Google Stitch access is a Human owner prerequisite.
- `scripts/validate-runtime-artifacts.mjs`: currently validates `mobile-mcp` and `serena` MCP registrations.
- `.codex/hooks/mobile-pretool-policy.mjs` and `scripts/test-hooks.mjs`: env-file reads are denied by hook policy and fixtures.

Reviewer operated read-only and reported no file edits.
