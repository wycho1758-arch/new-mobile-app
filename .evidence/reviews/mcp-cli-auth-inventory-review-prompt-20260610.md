# MCP/CLI Auth Inventory Review Prompt

Review the following read-only analysis for the WonderMove mobile repo. Verify whether the MCP and CLI classification is grounded in local SoT and command output. Return findings first and one JSON verdict envelope.

Scope:
- Report only. No repo implementation or guide file creation.
- User will later select which MCPs to activate before a detailed Codex setup guide is written.

SoT and commands reviewed:
- `AGENTS.md`
- `PROJECT_ENVIRONMENT.md`
- `.codex/config.toml`
- `.agents/skills/wm/SKILL.md`
- `.agents/skills/qa-railway-workflow/SKILL.md`
- `docs/confluence/20260608-codex-expo-rn-runtime-sot-update.md`
- `package.json`, `apps/mobile/package.json`, `apps/api/package.json`
- `codex mcp list`
- `codex mcp get atlassian mobile-mcp node_repl pencil playwright serena stitch expo tavily`
- `railway --version`, `railway whoami`
- `pnpm --filter mobile exec eas --version`
- `pnpm --filter mobile exec expo --version`
- `gcloud auth list`, `gcloud config get-value project`

Draft findings to validate:
1. Repo-required MCPs from local SoT are `mobile-mcp`, `serena`, and `stitch`.
2. `mobile-mcp` is required for local mobile visual QA/device automation when simulator/device is available. It is pinned to `@mobilenext/mobile-mcp@0.0.58`, uses stdio through `npx`, and `codex mcp list` reports `Auth: Unsupported`, so no `codex mcp login` is required. Device operations must be serial.
3. `serena` is required for symbolic navigation and bounded repo lookup. It uses `uvx` with `oraios/serena@v1.5.3`, reports `Auth: Unsupported`, and does not require `codex mcp login`.
4. `stitch` is required for Design handoff/generation workflows. It uses `npx -y stitch-mcp@1.3.2`, reports `Auth: Unsupported`, and does not use `codex mcp login`; however PROJECT_ENVIRONMENT states actual use requires Google Cloud Application Default Credentials through `gcloud auth application-default login`, a Google Cloud project with the Stitch MCP service enabled, and `GOOGLE_CLOUD_PROJECT` or a configured gcloud project.
5. Plugin-provided `expo` MCP is enabled at `https://mcp.expo.dev/mcp`. It previously showed `Auth: Not logged in`; after running `codex mcp login expo`, `codex mcp list` shows `Auth: OAuth`. It is useful for official Expo MCP/plugin workflows but does not replace `mobile-mcp`.
6. `atlassian`, `node_repl`, `pencil`, `playwright`, and `tavily` are enabled in the current local Codex MCP list but are not listed as required project MCP servers in `PROJECT_ENVIRONMENT.md`.
7. `atlassian` is enabled through `npx -y mcp-remote https://mcp.atlassian.com/v1/mcp`, reports `Auth: Unsupported` in `codex mcp list`, and may have its own remote authentication behavior outside `codex mcp login`; local SoT only treats Atlassian as an available plugin/internal docs integration, not a required project MCP.
8. `playwright` MCP and `node_repl` are tooling support surfaces in this Codex environment, not repo-required MCPs. RN Web E2E still uses `pnpm --filter mobile e2e:web` and Playwright package config, not necessarily the Playwright MCP server.
9. `pencil` is enabled locally but no project SoT was found making it required for this mobile repo; Design SoT uses Stitch MCP, not Pencil.
10. `tavily` is enabled locally with a URL containing an API key-like query string. It is not project-required in SoT. Setup guidance should avoid copying secret-bearing URLs into repo docs/evidence.
11. Railway is not an MCP in the current project SoT; it is a required CLI for the repo QA Railway workflow when operating Railway deployment/evidence. Current local CLI state is installed at `/usr/local/bin/railway`, version `5.6.2`, and logged in as `superman (superman@wondermove.net)`. Secrets must not be printed or committed.
12. EAS CLI is referenced by EAS config/workflows and Expo plugin guidance, but current command check showed `pnpm --filter mobile exec eas --version` failed with `Command "eas" not found`. Expo CLI is available through the mobile workspace (`56.1.14`) and a global `/usr/local/bin/expo` exists (`4.4.6`). A future setup guide should decide whether EAS CLI installation/login is needed for local build/submit/update operations.
13. gcloud is present and has active account `superman@wondermove.net` and project `clawpod-nano-banana-260223`. This supports the Stitch prerequisite, but it does not prove Stitch MCP service enablement.
14. Current worktree had pre-existing modified/untracked files before this review evidence was added; the report must not imply a clean tree.

Checks expected from reviewer:
- Validate the classification into required project MCP, plugin/optional local MCP, and auxiliary CLI.
- Identify any overclaims, missing auth prerequisite, or risky guidance.
- Confirm no implementation was required for this report.
