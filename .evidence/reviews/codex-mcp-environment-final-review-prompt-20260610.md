# Codex MCP Environment Final Review Prompt

Review the completed documentation change for the WonderMove mobile repo.

## Scope

User requested a detailed guide named `CODEX_MCP_ENVIRONMENT.md` for configuring the MCP and CLI environment after installing this repo, based on the prior MCP/CLI inventory and setup-guide plan.

The guide must:

- Include required MCPs: `mobile-mcp`, `serena`, `stitch`.
- Include selected MCPs: `expo`, `atlassian`, `node_repl`, `playwright`.
- Exclude `pencil` and `tavily`.
- Include auxiliary CLI guidance: `railway`, `gcloud`, conditional `eas` / `eas-cli`, and workspace Expo CLI.
- Avoid secrets, customer identifiers, secret-bearing URLs, and absolute user-local cache paths.
- Treat `EXPO_PUBLIC_*` values as public client configuration compiled into the client app, not as private secrets.
- Keep repo skills as authority for role boundaries, contracts, and evidence gates.

## Changed paths to review

- `docs/CODEX_MCP_ENVIRONMENT.md`
- `PROJECT_ENVIRONMENT.md`
- `.evidence/reviews/mcp-cli-setup-guide-plan-20260610.md`
- `.evidence/reviews/mcp-cli-setup-guide-plan-review-20260610.md`

The following pre-existing dirty/untracked paths are unrelated to this change and must not be treated as authored by this task unless their content affects this review:

- `scripts/validate-team-doc.mjs`
- `team-doc/mobile-app-dev-team/99-source-map.md`
- `team-doc/mobile-app-dev-team/README.md`
- `team-doc/mobile-app-dev-team/12-ref-organization-goal-plan.md`
- `team-doc/mobile-app-dev-team/ref-organization/**`
- `ref-organization-*` review evidence files

## Source of truth

- `AGENTS.md`
- `PROJECT_ENVIRONMENT.md`
- `.codex/config.toml`
- `.agents/skills/qa-railway-workflow/SKILL.md`
- `docs/SETUP.md`
- `docs/CREDENTIALS.md`
- Prior plan: `.evidence/reviews/mcp-cli-setup-guide-plan-20260610.md`
- Plan review: `.evidence/reviews/mcp-cli-setup-guide-plan-review-20260610.md`

## Official docs checked while writing

- Expo MCP: `https://docs.expo.dev/eas/ai/mcp/`
- Expo EAS CLI: `https://docs.expo.dev/eas/cli/`
- Expo EAS build setup: `https://docs.expo.dev/build/setup/`
- Expo programmatic access: `https://docs.expo.dev/accounts/programmatic-access/`
- Railway CLI: `https://docs.railway.com/cli`
- Railway login: `https://docs.railway.com/cli/login`
- Google ADC overview: `https://docs.cloud.google.com/docs/authentication/application-default-credentials`
- Google ADC local setup: `https://docs.cloud.google.com/docs/authentication/set-up-adc-local-dev-environment`
- `gcloud auth application-default login`: `https://docs.cloud.google.com/sdk/gcloud/reference/auth/application-default/login`

## Verification already run

- `pnpm run test:runtime`
  - exit 0
  - validated 11 skills, 13 agents, and 4 hook events
  - Codex headless review helper self-test passed
  - validated team-doc: 71 source files, 32 structured files
  - passed 44 hook fixture tests
- `pnpm run test:local-harness`
  - exit 0
  - preflight self-tests passed
  - `pnpm run test:runtime` passed inside harness
  - `pnpm turbo run lint test` passed
  - mobile Jest: 2 suites, 5 tests passed
  - contracts node test: 1 test passed
  - API Vitest: 1 file, 2 tests passed
  - local harness self-test all passed
  - local harness all passed

## Review focus

- Verify the new guide follows the plan and local SoT.
- Verify `PROJECT_ENVIRONMENT.md` sync is sufficient and does not overwrite unrelated user changes.
- Verify excluded MCPs are not accidentally configured as project requirements.
- Verify no secrets or secret-bearing URLs were introduced.
- Verify `EXPO_PUBLIC_*` guidance is correct as public client config, not private secret material.
- Verify command guidance is safe, scoped, and does not trigger live deployments or external state changes.
- Verify tests/evidence are adequate for documentation/runtime SoT changes.
