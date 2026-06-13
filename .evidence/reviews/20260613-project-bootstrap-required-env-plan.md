# project-bootstrap required environment plan

Date: 2026-06-13
Mode: `$wm` pre-implementation plan
Owner role: Mobile App Dev / repo runtime maintenance

## User request

Update `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap` so the reported missing items are treated as required except EAS. The UX must match the GitHub setup pattern: the agent should perform non-secret setup and checks whenever possible, and ask the user only for the smallest human-owned credential/login/platform input. After any additional project setup is completed, `project-bootstrap` must be rerun and report the environment state again. Check each checkpoint with a read-only reviewer.

## SoT inputs read

- `AGENTS.md:5` says pod-native OpenClaw skills are authored under `mobile-app-dev-team/09-pod-native-openclaw-skills/<slug>/`.
- `AGENTS.md:13` requires TDD before implementation changes.
- `AGENTS.md:25` defines runtime evals/evidence locations.
- `AGENTS.md:57` says `test:local-harness` validates Codex CLI runtime structure and harness behavior.
- `AGENTS.md:90` requires local harness for Codex runtime changes.
- `AGENTS.md:106` to `AGENTS.md:109` define required verification commands for workspace/runtime changes.
- `PROJECT_ENVIRONMENT.md:260` to `PROJECT_ENVIRONMENT.md:269` identify `.codex/config.toml`, `docs/CODEX_MCP_ENVIRONMENT.md`, and `project-bootstrap` as the active Codex/pod environment surfaces.
- `PROJECT_ENVIRONMENT.md:279` to `PROJECT_ENVIRONMENT.md:303` currently list `mobile-mcp`, `serena`, `stitch`, and plugin-provided `expo`.
- `PROJECT_ENVIRONMENT.md:307` to `PROJECT_ENVIRONMENT.md:313` define the headless reviewer helper and GO envelope rules.
- `docs/CODEX_MCP_ENVIRONMENT.md:43` to `docs/CODEX_MCP_ENVIRONMENT.md:60` currently classify `expo`, `atlassian`, `node_repl`, `playwright`, `railway`, `gcloud`, and `eas` as conditional.
- `docs/CODEX_MCP_ENVIRONMENT.md:313` to `docs/CODEX_MCP_ENVIRONMENT.md:323` define non-secret Expo MCP add plus human OAuth login.
- `docs/CODEX_MCP_ENVIRONMENT.md:355` to `docs/CODEX_MCP_ENVIRONMENT.md:365` define non-secret Atlassian MCP add and verification.
- `docs/CODEX_MCP_ENVIRONMENT.md:391` to `docs/CODEX_MCP_ENVIRONMENT.md:395` say missing `node_repl` must be restored through the Codex app/plugin environment, not by copying another user's absolute path.
- `docs/CODEX_MCP_ENVIRONMENT.md:403` to `docs/CODEX_MCP_ENVIRONMENT.md:413` define non-secret Playwright MCP add and verification.
- `docs/CODEX_MCP_ENVIRONMENT.md:441` to `docs/CODEX_MCP_ENVIRONMENT.md:482` define Railway as a CLI, not an MCP, with login/secrets handled without printing tokens.
- `docs/CODEX_MCP_ENVIRONMENT.md:491` to `docs/CODEX_MCP_ENVIRONMENT.md:499` explicitly says EAS CLI is not required for baseline MCP registration.
- `docs/CODEX_MCP_ENVIRONMENT.md:530` to `docs/CODEX_MCP_ENVIRONMENT.md:568` define gcloud CLI and Google ADC/project checks without persisting credentials.
- `project-bootstrap/SKILL.md:51` to `project-bootstrap/SKILL.md:58` currently say Railway/gcloud/EAS missing values are Product/Planning status-only inventory.
- `project-bootstrap/SKILL.md:285` to `project-bootstrap/SKILL.md:292` currently split MCPs/CLIs into required and conditional, with missing conditional inventory not blocking.
- `project-bootstrap-preflight.sh:359` to `project-bootstrap-preflight.sh:362` currently blocks only `mobile-mcp`, `serena`, and `stitch` as required MCPs.
- `npm view mcp-remote version --json` returned `0.1.38` on 2026-06-13.
- `npm view @executeautomation/playwright-mcp-server version --json` returned `1.0.12` on 2026-06-13.

## Initial finding

Current `project-bootstrap` can incorrectly report `ready_for_bootstrap` while `expo`, `atlassian`, `node_repl`, `playwright`, `railway`, or `gcloud` are missing. This conflicts with the user's clarified requirement that all listed items except EAS are mandatory. EAS remains non-blocking unless a QA/Release EAS workflow is actually selected.

## Planned changes

1. Add/update the narrowest smoke test first in `evals/skills/project-bootstrap-agent-setup-smoke.sh`.
   - Replace the current Product/Planning "status-only missing" expectation.
   - Assert that missing `expo`, `atlassian`, `node_repl`, `playwright`, `railway`, and `gcloud` produce blockers.
   - Assert missing `eas` remains non-blocking for baseline Product/Planning.
   - Assert primary user guidance stays plain Korean/English and raw blocker IDs stay in support details only.

2. Update `project-bootstrap-preflight.sh`.
   - Promote `expo`, `atlassian`, `node_repl`, and `playwright` from conditional inventory to required MCP blockers.
   - Promote `railway` and `gcloud` from status-only CLI inventory to required CLI blockers.
   - Keep `eas` as status-only unless `role.requires_eas` or nested QA/EAS setup says otherwise.
   - Extend blocker-context mapping so user guidance says what the agent can do first:
     - agent can add `expo`, `atlassian`, and `playwright` from repo-documented non-secret commands when Codex CLI works;
     - `expo` OAuth, Atlassian remote auth, Railway login/token, and Google ADC/project remain human/account/platform-owned;
     - `node_repl` is Codex app/plugin environment owned and must not be guessed from another user's absolute path.

3. Update `project-bootstrap-agent-setup.sh`.
   - Add best-effort non-secret MCP registration for `expo`, `atlassian`, and `playwright`.
   - Record those statuses in `/workspace/state/project-bootstrap-agent-setup-report.json`.
   - Add new agent-owned MCP registration only from pinned repo SoT:
     - `expo`: remote URL `https://mcp.expo.dev/mcp`, then blocker-guided `codex mcp login expo` for human OAuth when needed.
     - `atlassian`: `npx -y mcp-remote@0.1.38 https://mcp.atlassian.com/v1/mcp`.
     - `playwright`: `npx -y @executeautomation/playwright-mcp-server@1.0.12`.
   - Add those pinned definitions to `.codex/config.toml` and mirror them in `docs/CODEX_MCP_ENVIRONMENT.md` before using them as project-bootstrap required setup.
   - Do not invent or install `node_repl` from repo-local paths.
   - Do not install Railway/gcloud/EAS system tools inside this script without an approved platform source; report status instead.

4. Update `project-bootstrap` docs and templates.
   - Update `SKILL.md`, `references/report-template.md`, and `references/blocker-resolution-guide.md` so they no longer tell Product/Planning that Railway/gcloud or the four MCPs are status-only.
   - Keep EAS clearly described as the exception.
   - Keep the UX rule: agent-owned setup first, user only signs in/approves/provides secure source where required.
   - State that after any MCP/CLI/auth setup change, the agent reruns `project-bootstrap-agent-setup.sh` and `project-bootstrap-preflight.sh`.

5. Update environment SoT docs.
   - Update `docs/CODEX_MCP_ENVIRONMENT.md` required/conditional table to mark all listed items except EAS as required for project bootstrap readiness, while preserving auth and live-action boundaries.
   - Update `PROJECT_ENVIRONMENT.md` Codex Runtime section so the root runtime facts match the new bootstrap requirement.
   - Update `.codex/config.toml` with the pinned non-secret MCP definitions for `expo`, `atlassian`, and `playwright`; do not add `node_repl` because its SoT says it is Codex app/plugin-owned and must not be invented from local absolute paths.
   - Do not add secrets, absolute user-local paths, or customer-specific values.

## Reviewer checkpoints

- Checkpoint 0, before implementation: `wm-implementation-reviewer` xhigh/headless or sub-agent plan review. Proceed only on GO/PASS.
- Checkpoint 1, after tests are added and the focused smoke test demonstrates the intended failure or the pre-existing test harness blocker: run `wm-implementation-reviewer` again in plan/checkpoint mode and persist reviewer evidence before implementation edits.
- Checkpoint 2, after implementation and focused smoke test: run `wm-implementation-reviewer` against the changed tests, implementation diff, command output, and evidence before broader gates.
- Checkpoint 3, after runtime/local-harness verification: run final `wm-implementation-reviewer` against the approved plan, full diff, command output, and evidence. Report Done only on GO/PASS.

## Expected verification

- Focused first: `bash evals/skills/project-bootstrap-agent-setup-smoke.sh`
- Runtime gate: `pnpm run test:runtime`
- Local harness gate for runtime changes: `pnpm run test:local-harness`
- Diff hygiene: `git diff --check`
- Final status: `git status --short`

`pnpm turbo run lint test` is not expected to be directly affected because this is pod-native runtime/docs/shell-eval work, but it remains a PR-level gate from `AGENTS.md`.

## Non-goals and human gates

- No live EAS build/submit/update.
- No Railway deploy, `railway setup agent`, or `railway up`.
- No Google ADC login, Google Cloud service enablement, or Stitch generation/export.
- No Atlassian/Jira/Confluence mutation.
- No GitHub branch protection or repository settings mutation.
- No token, OAuth code, ADC JSON, database URL, bearer token, private key, or secret value in chat, docs, or evidence.

## Sub-agent planning result

Initial `wm-implementation-reviewer` plan review returned `NO_GO` with two Medium findings:

- missing pinned repo SoT/config path for newly required MCP registrations;
- Checkpoint 1 did not require persisted reviewer evidence.

This revised plan addresses both findings by adding `.codex/config.toml` pinned MCP definitions to the implementation scope, pinning `mcp-remote@0.1.38` and `@executeautomation/playwright-mcp-server@1.0.12`, treating Expo MCP's fixed remote URL as the SoT endpoint plus human OAuth, and making every checkpoint require persisted reviewer evidence. Rerun plan review before implementation.
