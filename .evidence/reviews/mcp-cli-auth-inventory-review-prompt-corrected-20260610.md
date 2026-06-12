# MCP/CLI Auth Inventory Corrected Review Prompt

Review this corrected read-only report for the WonderMove mobile repo. The report is intended to help the user decide which MCPs to activate before a detailed Codex setup guide is written. No repo implementation or guide file is being created.

Important reviewer envelope constraints:
- Use only supported owners: `Product/Planning`, `Design`, `Mobile Architect`, `Mobile App Dev`, `Backend/API Integrator`, `QA/Release`, `human`.
- In JSON findings, `source_refs` must be local path:line strings only. Put command evidence in `checks_reviewed`, not in `source_refs`.

Corrected report to validate:

## 1. Required project MCPs

The repo SoT identifies these required project MCP servers:

- `mobile-mcp`
  - Source: `PROJECT_ENVIRONMENT.md` required project MCP list and `.codex/config.toml`.
  - Purpose: local mobile visual QA/device automation when a simulator or device is available.
  - Config: `npx -y @mobilenext/mobile-mcp@0.0.58`.
  - Login: no `codex mcp login` path is indicated by current `codex mcp list`; auth appears as unsupported for this stdio server.
  - Operational caveat: simulator/device operations must be serial; it is excluded from required CI gates.

- `serena`
  - Source: `PROJECT_ENVIRONMENT.md` required project MCP list and `.codex/config.toml`.
  - Purpose: symbolic navigation, symbol lookup/reference search, bounded repo code navigation.
  - Config: `uvx -p 3.13 --from git+https://github.com/oraios/serena@v1.5.3 serena start-mcp-server --project-from-cwd --context=codex`.
  - Login: no `codex mcp login` path is indicated by current `codex mcp list`; auth appears as unsupported for this stdio server.

- `stitch`
  - Source: `PROJECT_ENVIRONMENT.md` required project MCP list and `.codex/config.toml`.
  - Purpose: Design handoff/generation/export workflows.
  - Config: `npx -y stitch-mcp@1.3.2`.
  - Login: no `codex mcp login stitch` path is indicated by current `codex mcp list`; auth appears as unsupported for this stdio server.
  - External prerequisite: actual use requires Google Cloud Application Default Credentials via `gcloud auth application-default login`, a Google Cloud project with Stitch MCP service enabled, and either `GOOGLE_CLOUD_PROJECT` or `gcloud config set project`.
  - Current operator-shell check, outside the headless reviewer sandbox, showed ADC token access succeeded, configured project `clawpod-nano-banana-260223`, and `stitch.googleapis.com` enabled. A setup guide should still require each target machine to verify these steps.

## 2. Plugin-provided MCP

- `expo`
  - Source: `PROJECT_ENVIRONMENT.md` plugin-provided MCP section and Expo plugin SoT.
  - Purpose: official Expo MCP/plugin workflows for generic Expo/RN/EAS guidance; it does not replace `mobile-mcp`.
  - Config: streamable HTTP MCP at `https://mcp.expo.dev/mcp`.
  - Login: treat as login-required for practical setup because the earlier failure was `The expo MCP server is not logged in. Run codex mcp login expo`, and the successful remediation was `codex mcp login expo`.
  - Verification: run `codex mcp list` in the actual target Codex environment after login. In the primary interactive shell after login, the operator observed `Auth: OAuth`; in a separate headless read-only reviewer sandbox, `expo` appeared as `Auth: Unsupported`. Therefore the guide must not rely on a single inherited session state; it should instruct users to verify the target environment directly.
  - SoT sync caveat: `PROJECT_ENVIRONMENT.md` still says Expo MCP authentication status is `not logged in`, which is stale relative to the successful interactive login observed in the main shell. If this becomes a committed guide/update, sync `PROJECT_ENVIRONMENT.md`.

## 3. Enabled local MCPs that are not repo-required

These are currently enabled in local `codex mcp list`, but are not listed as required project MCP servers in `PROJECT_ENVIRONMENT.md`:

- `atlassian`
  - Config: `npx -y mcp-remote https://mcp.atlassian.com/v1/mcp`.
  - Role: installed Atlassian plugin/internal docs integration. It may be useful for Jira/Confluence work, but the repo SoT does not make it a required project MCP.
  - Login: no local `codex mcp login` path is shown; remote auth behavior may be plugin/server-specific.

- `node_repl`
  - Role: Codex app/browser/plugin support surface, not repo-required.
  - Login: no `codex mcp login` path shown.

- `playwright`
  - Role: local browser automation MCP support surface, not the same as the repo RN Web E2E command.
  - Repo RN Web E2E is `pnpm --filter mobile e2e:web` with the workspace Playwright package/config.
  - Login: no `codex mcp login` path shown.

- `pencil`
  - Role: enabled local design editor MCP, but current repo Design SoT uses Stitch for design handoff/generation.
  - Login: no `codex mcp login` path shown.

- `tavily`
  - Role: enabled local search MCP, not repo-required by SoT.
  - Security caveat: current MCP URL contains a secret-like API key query string. Setup docs/evidence must redact it or avoid copying the URL.

## 4. Auxiliary CLIs

- Railway CLI
  - Not an MCP in this repo SoT.
  - Required when operating the repo `$qa-railway-workflow` for deployment/evidence work.
  - Current operator-shell check showed `/usr/local/bin/railway`, version `5.6.2`, and `railway whoami` logged in as the current user. A separate headless reviewer sandbox hit DNS/network failure for `railway whoami`, so setup guidance should require `railway whoami` verification in the target shell.
  - Safe workflow: `railway --version`; if missing on macOS use `brew install railway`; authenticate with `railway login` or `railway login --browserless`; for CI use exactly one of `RAILWAY_TOKEN` or `RAILWAY_API_TOKEN`.
  - Secret rule: never print, commit, or persist token/secret values.

- EAS CLI
  - EAS config/workflows exist in repo SoT, but EAS CLI is not currently available in the mobile workspace: `pnpm --filter mobile exec eas --version` failed with `Command "eas" not found`.
  - Future setup guide should explicitly decide whether local EAS CLI install/login is required for build/submit/update operations.
  - Expo CLI is available through the mobile workspace; global `/usr/local/bin/expo` is a legacy version and should not be treated as the authoritative project Expo CLI.

- gcloud CLI
  - Auxiliary prerequisite for Stitch MCP use, not a Codex MCP by itself.
  - Current operator-shell check showed active Google account, configured project, ADC token access, and Stitch service enabled. Headless reviewer sandbox may not be able to revalidate account state because gcloud writes to user config.
  - Setup guide should require target-shell verification with `gcloud auth application-default login`, `gcloud config get-value project`, and service enablement checks.

## 5. Recommended activation decision framing

- Always enable for this repo baseline: `mobile-mcp`, `serena`, `stitch`.
- Enable/login when using Expo official plugin/MCP workflows: `expo`, with `codex mcp login expo` and target-session `codex mcp list` verification.
- Enable only when the workflow needs them: `atlassian` for Jira/Confluence/internal knowledge, `playwright` for MCP browser control, `node_repl` for plugin/browser support, `pencil` for Pencil design files, `tavily` for web search.
- Install/login auxiliary CLIs by workflow: Railway for `$qa-railway-workflow`, EAS CLI if local EAS operations are selected, gcloud for Stitch.

## 6. Current evidence status

- No app/backend/runtime implementation was required.
- Tests-first evidence is not applicable because this is a read-only inventory/report.
- Current worktree was already dirty before this analysis; the future guide should not imply a clean baseline.
- A setup guide created from this inventory should avoid embedding secrets and should keep `PROJECT_ENVIRONMENT.md` synchronized if it changes current Codex runtime expectations.

Checks expected from reviewer:
- Validate whether the corrected classification is SoT-grounded.
- Confirm that the previous overclaims are fixed.
- Report any remaining blocker before the user uses this as the basis for MCP selection.
