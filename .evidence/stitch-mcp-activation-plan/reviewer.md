# Stitch MCP Activation Plan Reviewer Evidence

Date: 2026-06-09
Reviewer: `wm-implementation-reviewer` read-only subagent
Scope: plan and activation reviews for Stitch MCP activation, prompt workflow, credential handling, and gate readiness

## Historical Planning Review

This section records the earlier planning-only review before the pinned `stitch-mcp@1.3.2` activation path was selected. Superseded items are retained for audit history; the activation review below is the current review result.

### Findings

Critical: none.

High: none.

Medium: API key storage plan originally left a risky local ignored env-file path. Reviewer noted `.gitignore` does not ignore `.env*`, hooks block reading `.env` files, and repo policy forbids committed credentials. The plan was updated to remove local `.env*` storage from the default workflow unless a future PR adds explicit ignore, hook, and validator coverage.

Medium: Scope needed explicit source-of-truth updates for credentials and runtime docs. The plan already included `PROJECT_ENVIRONMENT.md`; it now also calls out `docs/CREDENTIALS.md` and the local Confluence update document when `STITCH_API_KEY` becomes required.

Low: Validator and eval acceptance criteria needed more detail. The plan now specifies accepted remote HTTP and pinned local-adapter shapes, and negative checks for literal API keys, `EXPO_PUBLIC_STITCH*`, `@latest`, and checked-in secret placeholders.

Low: Verification needed an explicit blocked path if `codex mcp list` keeps failing after restart or reload. The plan now requires blocked evidence and forbids marking activation complete in that state.

### Superseded Residual Gaps

- Required-vs-optional MCP and remote HTTP schema questions were resolved by activating pinned stdio `stitch-mcp@1.3.2`.
- `STITCH_API_KEY` handling was superseded because the selected adapter uses Google Cloud ADC/project setup instead of a Stitch API key.

### Local Source References

- `.codex/config.toml`: currently registers `mobile-mcp` and `serena`, not `stitch`.
- `PROJECT_ENVIRONMENT.md`: Codex runtime inventory and public env warning.
- `DESIGN.md`: Stitch is the sole authoring tool and permits Stitch MCP fetch.
- `docs/SETUP.md`: Google Stitch access is a Human owner prerequisite.
- `scripts/validate-runtime-artifacts.mjs`: currently validates `mobile-mcp` and `serena` MCP registrations.
- `.codex/hooks/mobile-pretool-policy.mjs` and `scripts/test-hooks.mjs`: env-file reads are denied by hook policy and fixtures.

Reviewer operated read-only and reported no file edits.

## Activation Plan Review

Date: 2026-06-09

Findings:

- High: runtime verification is already blocked by unrelated root `CLAUDE.md` and `.claude/` artifacts that `scripts/validate-runtime-artifacts.mjs` forbids. Any red `pnpm run test:runtime` result must not be attributed to Stitch unless these pre-existing failures are separated.
- Medium: local-use docs need the full Google prerequisite chain, not only ADC/project. The chosen `stitch-mcp@1.3.2` adapter requires a Google Cloud project with Stitch MCP service enabled, Application Default Credentials, quota project, and project selection.
- Low: Stitch validator checks should be scoped to `[mcp_servers.stitch]` instead of broad regexes.
- Low: `team-doc/10-structured/05-repo-template/codex-runtime-layer.md` is the right local update target, but it should explicitly note that it is the active local corpus path so the structured doc does not silently drift from its source-page lineage.

Confirmations:

- The plan respects the user instruction not to update `docs/CREDENTIALS.md` or live Confluence.
- For `npx -y stitch-mcp@1.3.2`, no API key should be added. Use local Google Cloud ADC plus project setup instead.
