# MCP/CLI Setup Guide Plan

Date: 2026-06-10

## Purpose

Create a detailed setup guide for a freshly installed/cloned `new-mobile-app` repo so a Codex operator can activate the repo-required MCPs, selected optional MCPs, and auxiliary CLIs needed for this project.

This is a planning artifact only. It does not implement the guide, mutate MCP registrations, install CLIs, or run live deployment commands.

## Scope

Included MCPs:

- Repo-required MCPs: `mobile-mcp`, `serena`, `stitch`.
- Plugin/remote MCP: `expo`.
- Optional local MCPs to document because they are useful in this repo context: `atlassian`, `node_repl`, `playwright`.

Excluded by user request:

- `pencil`.
- `tavily`.

Included auxiliary CLIs:

- `railway`.
- `gcloud`.
- `eas` / `eas-cli` as conditional, because current repo EAS workflows exist but local EAS CLI is not installed.
- Project Expo CLI through the mobile workspace, with the global legacy `expo` binary explicitly not treated as authoritative.

Out of scope:

- App/backend/mobile feature implementation.
- Live Railway deployment.
- EAS build/submit/update execution.
- Store credentials creation.
- Secret value collection or storage.
- Modifying external platform/runtime repositories.
- Installing or removing MCPs during the planning step.

## Source Of Truth Inputs

Use and cite these local SoT files in the future guide:

- `AGENTS.md`
  - Codex runtime paths.
  - `mobile-mcp` policy.
  - verification expectations.
  - no hardcoded credentials/customer identifiers.
- `PROJECT_ENVIRONMENT.md`
  - current runtime versions.
  - required project MCP list.
  - Expo plugin/MCP section.
  - Stitch `gcloud` prerequisites.
  - Railway QA deployment context.
  - CI/local harness implications.
- `.codex/config.toml`
  - pinned repo MCP entries for `mobile-mcp`, `serena`, and `stitch`.
- `.agents/skills/qa-railway-workflow/SKILL.md`
  - Railway install/login/evidence workflow.
  - secret redaction rules.
  - `railway setup agent` boundary.
- `docs/SETUP.md`
  - post-clone repo setup.
  - EAS human-gate notes.
  - `npx eas-cli@latest init` human-owner context.
- `docs/CREDENTIALS.md`
  - `EXPO_TOKEN`, store credential, and secret handling boundaries.
- Prior evidence:
  - `.evidence/reviews/mcp-cli-auth-inventory-review-corrected-20260610.md`
  - `.evidence/reviews/mcp-cli-auth-inventory-review-prompt-corrected-20260610.md`

External official docs to verify while writing the actual guide:

- Expo/EAS CLI install, login, project, and token docs.
- Expo MCP/plugin docs if the final guide includes plugin install or OAuth setup details beyond `codex mcp login expo`.
- Railway CLI install/login docs already named in `.agents/skills/qa-railway-workflow/SKILL.md`.
- Google Cloud CLI auth, ADC, and service enablement docs for Stitch prerequisites.
- Codex CLI MCP command help from local `codex mcp add --help`, `codex mcp login --help`, and `codex mcp list`.

## Current Local State To Account For

The guide should document target-machine verification instead of assuming this machine's session state applies everywhere.

Current observed state in the operator shell:

- `codex mcp list` shows:
  - `mobile-mcp`: enabled, `Auth: Unsupported`.
  - `serena`: enabled, `Auth: Unsupported`.
  - `stitch`: enabled, `Auth: Unsupported`.
  - `expo`: enabled, `Auth: OAuth`.
  - `atlassian`: enabled, `Auth: Unsupported`.
  - `node_repl`: enabled, `Auth: Unsupported`.
  - `playwright`: enabled, `Auth: Unsupported`.
  - `pencil`: enabled but excluded from the future guide.
  - `tavily`: enabled but excluded from the future guide and must not be copied because its URL contains secret-like material.
- `railway`: installed at `/usr/local/bin/railway`, version `5.6.2`.
- `gcloud`: installed at `/opt/homebrew/bin/gcloud`, version `554.0.0`.
- `pnpm --filter mobile exec eas --version`: fails with `Command "eas" not found`.
- `pnpm --filter mobile exec expo --version`: returns `56.1.14`.

Known caveats:

- `PROJECT_ENVIRONMENT.md` currently says Expo MCP authentication status is `not logged in`, while the primary operator shell shows `OAuth` after `codex mcp login expo`. If the final guide changes the expected current state, update `PROJECT_ENVIRONMENT.md` in the same PR.
- Prior reviewer evidence confirmed Expo auth can appear differently in a headless review sandbox. The final guide must require `codex mcp list` verification in the actual target Codex environment.
- The worktree is dirty with unrelated changes. The guide implementation must not imply a clean baseline or revert unrelated files.

## Proposed Guide Artifact

Recommended path:

- `docs/CODEX_MCP_CLI_SETUP.md`

Rationale:

- This is repository setup documentation, not app code.
- It is more focused than `docs/SETUP.md`, which already covers broader service registration and app bootstrap.
- If a shorter canonical path is preferred, use `docs/MCP_CLI_SETUP.md`; record the choice in `PROJECT_ENVIRONMENT.md` if it becomes a runtime SoT.

Expected companion update:

- `PROJECT_ENVIRONMENT.md`
  - Add or update a short pointer to the new guide.
  - Do not embed absolute user-local plugin cache paths.
  - Update Expo MCP auth wording if the guide defines `codex mcp login expo` as the expected post-setup state.

## Guide Structure Plan

1. Title and audience
   - State that the guide is for operators after cloning/installing this repo.
   - State that it configures Codex MCPs and supporting CLIs for this repo only.
   - State that it excludes `pencil` and `tavily` by project decision.

2. Safety rules
   - No token/secret values in repo, chat, logs, or evidence.
   - Do not copy MCP URLs containing API keys.
   - Do not use `@latest` for repo-required MCPs.
   - Do not run `railway setup agent` for this repo unless explicitly requested; it may modify broader tool configuration.
   - Run simulator/device MCP operations serially.

3. Prerequisites
   - Repo cloned.
   - `pnpm install` completed from `docs/SETUP.md`.
   - Codex CLI installed and usable.
   - Node/pnpm baseline available.
   - Optional accounts available depending on chosen workflows:
     - Expo account for `expo` MCP/EAS.
     - Google account/project for Stitch.
     - Railway account for deployment/evidence.
     - Atlassian account for Jira/Confluence if `atlassian` is enabled.

4. Baseline repo MCPs from `.codex/config.toml`
   - Show expected config for `mobile-mcp`, `serena`, `stitch`.
   - Explain that these are project-required and already represented in repo config.
   - Verification:
     - `codex mcp list`
     - `codex mcp get mobile-mcp`
     - `codex mcp get serena`
     - `codex mcp get stitch`
   - Expected status:
     - enabled.
     - auth unsupported or no OAuth login required.
   - Failure handling:
     - if missing, add using `codex mcp add` with pinned commands from `.codex/config.toml`.
     - if startup fails, verify `npx`, network package resolution, `uvx`, Python availability, and project cwd.

5. `mobile-mcp`
   - Purpose: local visual QA/device automation.
   - Config command:
     - `codex mcp add mobile-mcp -- npx -y @mobilenext/mobile-mcp@0.0.58`
   - Verify with `codex mcp list`.
   - Operational limits:
     - not a CI gate.
     - run simulator/device automation serially.
     - required only when simulator/device is available for mobile UI/runtime checks.

6. `serena`
   - Purpose: symbolic code navigation.
   - Config command:
     - `codex mcp add serena -- uvx -p 3.13 --from git+https://github.com/oraios/serena@v1.5.3 serena start-mcp-server --project-from-cwd --context=codex`
   - Verify with `codex mcp list` and `codex mcp get serena`.
   - Fallback if unavailable:
     - use focused `rg` and file reads.
     - record degraded lookup path when it affects evidence confidence.

7. `stitch`
   - Purpose: Design handoff/generation/export.
   - Config command:
     - `codex mcp add stitch -- npx -y stitch-mcp@1.3.2`
   - Verify with `codex mcp list`.
   - Required external prerequisites:
     - `gcloud auth application-default login`
     - `gcloud config set project <project-id>` or `GOOGLE_CLOUD_PROJECT=<project-id>`
     - verify Stitch service enablement.
   - Evidence:
     - record account/project/service status without tokens.

8. `expo`
   - Purpose: official Expo MCP/plugin workflows for generic Expo/RN/EAS guidance.
   - Config:
     - if already plugin-provided, only verify.
     - if missing, add streamable HTTP MCP using `codex mcp add expo --url https://mcp.expo.dev/mcp`.
   - Login:
     - `codex mcp login expo`
     - browser OAuth approval.
   - Verify in target session:
     - `codex mcp list`
     - restart Codex if startup still reports `expo` incomplete.
   - State that `expo` MCP does not replace `mobile-mcp`.

9. `atlassian`
   - Purpose: Jira/Confluence/internal knowledge integration when needed.
   - Config command:
     - `codex mcp add atlassian -- npx -y mcp-remote https://mcp.atlassian.com/v1/mcp`
   - Verify with `codex mcp list`.
   - Auth caveat:
     - `codex mcp list` may show `Auth: Unsupported`; remote MCP auth may be handled by plugin/server flow.
   - Only enable if Jira/Confluence workflows are needed.

10. `node_repl`
    - Purpose: local Codex app/browser/plugin support surface.
    - Do not require users to hand-write its path unless they are restoring a Codex app environment.
    - Verification:
      - `codex mcp list`.
    - If missing:
      - document as Codex app/plugin managed, not repo-owned.
      - avoid hardcoding another user's `/Applications/Codex.app/...` path unless guide is explicitly macOS/Codex-app-specific.

11. `playwright` MCP
    - Purpose: MCP browser automation support.
    - Config command:
      - `codex mcp add playwright -- npx -y @executeautomation/playwright-mcp-server`
    - Verify with `codex mcp list`.
    - Distinguish from repo RN Web E2E:
      - RN Web E2E uses `pnpm --filter mobile e2e:web`.
      - browser install uses `pnpm --filter mobile exec playwright install chromium`.

12. Excluded MCPs
    - State explicitly:
      - `pencil` is excluded from this project guide.
      - `tavily` is excluded and must not be copied from local config because its URL can contain secret-like API keys.
    - If users already have them globally, they may leave them enabled, but they are not required for this repo setup.

13. Railway CLI
    - Purpose: `$qa-railway-workflow` deployment/evidence operations.
    - Verification:
      - `railway --version`
      - `railway whoami`
    - Install if missing:
      - macOS Homebrew path from repo skill: `brew install railway`.
      - future guide should cite official Railway CLI docs for other platforms.
    - Login:
      - `railway login`
      - `railway login --browserless` for browserless shells.
      - CI: exactly one of `RAILWAY_TOKEN` or `RAILWAY_API_TOKEN`.
    - Secret handling:
      - never print or persist token values.
      - evidence can list variable names only.

14. EAS CLI
    - Purpose: optional local build/submit/update operations and human-gated `eas init`.
    - Current state: not installed in the mobile workspace.
    - Plan for the guide:
      - Do not silently require EAS CLI for baseline MCP setup.
      - Present EAS CLI as conditional when local EAS operations are selected.
      - For `eas init`, align with `docs/SETUP.md`: Human owner runs it from `apps/mobile`.
      - Verify current official install recommendation before writing exact install commands.
      - Document `EXPO_TOKEN` for non-interactive EAS CLI use without exposing values.

15. gcloud CLI
    - Purpose: Stitch prerequisite.
    - Verification:
      - `gcloud --version`
      - `gcloud auth list`
      - `gcloud auth application-default login`
      - `gcloud config get-value project`
      - service enablement check for Stitch.
    - Secret handling:
      - do not store ADC tokens or credential files in repo/evidence.
      - record account/project/service status only.

16. Final verification checklist
    - `codex mcp list`
    - `codex mcp get mobile-mcp`
    - `codex mcp get serena`
    - `codex mcp get stitch`
    - `codex mcp get expo`
    - `railway --version`
    - `railway whoami`
    - `gcloud --version`
    - `gcloud config get-value project`
    - `pnpm --filter mobile exec expo --version`
    - conditional: `pnpm --filter mobile exec eas --version`
    - conditional RN Web E2E readiness:
      - `pnpm --filter mobile exec playwright install chromium`

17. Troubleshooting matrix
    - Expo MCP startup incomplete:
      - run `codex mcp login expo`.
      - approve browser OAuth.
      - restart Codex.
      - verify `codex mcp list`.
    - Required MCP missing:
      - add using pinned command.
      - verify from repo root.
    - `serena` startup timeout:
      - verify `uvx` and network access.
      - fallback to `rg` with degraded evidence note.
    - `stitch` starts but cannot operate:
      - verify ADC, project, and service enablement.
    - Railway login missing:
      - run `railway login` or browserless login.
    - EAS unavailable:
      - confirm whether local EAS is in scope.
      - install only if build/submit/update/local `eas init` is needed.
    - Secret appeared in output:
      - stop, rotate affected secret, record only rotation occurred.

18. Evidence and maintenance
    - Store guide review evidence under `.evidence/reviews/`.
    - If guide changes `PROJECT_ENVIRONMENT.md`, run `pnpm run test:runtime`.
    - If guide or runtime files are added under paths covered by local harness, run `pnpm run test:local-harness` when preparing PR.
    - Before final guide Done, run read-only reviewer with JSON envelope.

## Proposed Implementation Steps For The Future Guide

1. Confirm final guide path and title.
2. Re-check official docs for Expo/EAS, Railway, Google Cloud, and local `codex mcp` help.
3. Add or update the guide file with the structure above.
4. Update `PROJECT_ENVIRONMENT.md` with a pointer to the guide and any corrected Expo MCP auth wording.
5. Avoid adding secrets, absolute user-local cache paths, or `tavily` URL values.
6. Run applicable verification:
   - `pnpm run test:runtime`
   - If runtime-path docs/SoT changes require it: `pnpm run test:local-harness`
7. Run final read-only reviewer with `node scripts/codex-headless-review.mjs --json-envelope --agent wm-implementation-reviewer`.
8. Report changed paths, verification output, and reviewer verdict.

## Human Gates

- Expo account/org, EAS project, Robot user token, store credentials, and billing decisions remain Human owner responsibilities.
- Railway project creation, billing, production deploy risk, and secret provisioning require human approval where applicable.
- Google Cloud project/service/billing and ADC account selection are human-owned environment decisions.

## Acceptance Criteria For The Future Guide

- It includes only the MCPs selected in this plan and excludes `pencil`/`tavily`.
- It clearly separates repo-required MCPs, optional MCPs, and auxiliary CLIs.
- It includes exact verification commands and expected outcomes without exposing secrets.
- It explains `codex mcp login expo` and target-session verification.
- It documents `railway`, `gcloud`, and conditional `eas` setup without treating them as MCPs.
- It cites local SoT and flags official-doc verification where current commands may change.
- It includes a troubleshooting section for the known `expo` startup incomplete case.
- It records evidence and reviewer validation before being reported as done.
