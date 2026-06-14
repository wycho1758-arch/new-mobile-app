# project-bootstrap required tool ownership correction plan

Date: 2026-06-14
Mode: `$wm` plan-only review request
Reviewer requested: `wm-implementation-reviewer` with high reasoning

## User problem

OpenClaw agents still interpret `missing required MCP node_repl`,
`missing required CLI railway`, and `missing required CLI gcloud` too passively.
The latest SoT correctly marks all three as project-bootstrap blockers, but the
agent-facing flow still allows a vague answer that installation/restoration is
"approval needed" instead of producing the same minimal-user-action UX used for
GitHub setup.

## SoT inputs checked

- `AGENTS.md`: runtime paths, TDD, no direct main push, no external runtime repo
  edits, runtime gates.
- `PROJECT_ENVIRONMENT.md`: Codex runtime SoT, required MCP/CLI surfaces, `$wm`
  review/evidence requirements.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md`:
  required MCP/CLI baseline and agent-owned setup contract.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-agent-setup.sh`:
  current agent-owned setup implementation.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-preflight.sh`:
  current blocker generation and generated Korean/English guidance.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/references/blocker-resolution-guide.md`:
  blocker classification and user-facing guidance.
- `docs/CODEX_MCP_ENVIRONMENT.md`: repo MCP/CLI setup guide and official
  reference links for Railway and Google Cloud setup.

## Current SoT facts

- `project-bootstrap` cannot pass unless `node_repl`, `railway`, and `gcloud`
  are ready; EAS CLI is the only baseline exception.
- `node_repl` is required but is Codex app/plugin environment owned. The setup
  script checks for it and reports `app_environment_missing`; it does not
  provide a repo-local `codex mcp add` command.
- `railway` and `gcloud` are required CLIs. Preflight correctly converts missing
  commands into blockers.
- The current blocker guide says Railway/gcloud install/login remains
  human/platform-owned, but the user requirement is stricter: agents must do
  every install/setup step they can directly and safely do, then ask the user
  only for the smallest credential/account/platform input.

## Gap to fix

The SoT must distinguish these three states explicitly:

1. Required for bootstrap pass.
2. Agent-owned setup that must be attempted first when non-secret and locally
   supported.
3. Human/platform-owned continuation that remains only after the agent-owned
   path is unavailable, requires external authority, or reaches an auth/login
   surface.

Today this distinction is clear for pinned MCP registration, but not clear
enough for `node_repl`, `railway`, and `gcloud` in generated output. As a
result, an OpenClaw agent can report the blockers without presenting a concrete
minimal next action.

## Proposed implementation plan

1. Add failing eval coverage first.
   - Extend `evals/skills/project-bootstrap-agent-setup-smoke.sh` with fixtures
     for missing `node_repl`, `railway`, and `gcloud`.
   - Add agent-setup report schema assertions before implementation for the
     new fields introduced by this change. The failing eval should require:
     - `tool_readiness.node_repl.required === true`
     - `tool_readiness.node_repl.owner === "codex_app_plugin"`
     - `tool_readiness.node_repl.status === "app_environment_missing"` when
       `codex mcp list` does not include `node_repl`
     - `tool_readiness.node_repl.minimum_user_action` names Codex app/plugin
       restoration, not a repo-local `codex mcp add` command
     - `tool_readiness.railway.required === true`
     - `tool_readiness.railway.command_status === "missing" | "available"`
     - `tool_readiness.railway.install_decision` is one of
       `already_available`, `approved_installer_available`,
       `install_attempted`, `install_unavailable_needs_platform_source`, or
       `auth_or_project_user_action_needed`
     - `tool_readiness.gcloud.required === true`
     - `tool_readiness.gcloud.command_status === "missing" | "available"`
     - `tool_readiness.gcloud.install_decision` uses the same controlled enum
       as Railway
     - no report field contains token values, ADC JSON, service account JSON,
       database URLs, bearer tokens, or private credentials
   - Add a separate approved-installer fixture for each CLI so the core
     requirement cannot pass by always reporting
     `install_unavailable_needs_platform_source`:
     - Given `railway` is missing and a repo-approved non-secret Railway
       installer source is present in the test fixture, the setup script must
       invoke that approved installer, record an install-attempt status, then
       recheck `railway --version`.
     - Given `gcloud` is missing and a repo-approved non-secret gcloud installer
       source is present in the test fixture, the setup script must invoke that
       approved installer, record an install-attempt status, then recheck
       `gcloud --version`.
     - The fake approved installers in the eval must be local test fixtures that
       only write marker files and expose fake `railway`/`gcloud` binaries; they
       must not download software, call external services, request credentials,
       or mutate the developer machine.
     - The no-approved-installer fixture must still assert
       `install_unavailable_needs_platform_source` plus a minimal user/platform
       request, proving that escalation happens only after the agent-owned path
       is unavailable.
   - Assert that preflight still records raw blockers:
     `missing required MCP node_repl`, `missing required CLI railway`, and
     `missing required CLI gcloud`.
   - Assert that Korean and English primary guidance names each item with a
     concrete minimal action, not only generic platform owner wording.
   - Assert that raw blocker names remain support-only and do not become the
     primary user guidance.

2. Update `project-bootstrap` SoT wording.
   - Keep `node_repl`, `railway`, and `gcloud` as required blockers.
   - Add an explicit "required tool ownership ladder":
     agent checks status, agent performs approved non-secret local setup when
     available, agent opens/guides the real login surface when possible, user
     only signs in/approves/selects project/provides secure source, then agent
     reruns setup and preflight.
   - Clarify that "human/platform-owned" does not mean "agent stops early"; it
     means "agent must reduce the ask to the minimum external authority after
     exhausting safe local setup."

3. Update `project-bootstrap-agent-setup.sh` report schema and behavior.
   - Keep `node_repl` as app/plugin-owned, but report a structured blocker such
     as `required_app_mcp_missing` with minimum action:
     "restore/enable node_repl in the Codex app/plugin environment for this pod."
   - Add status-only CLI probes for `railway` and `gcloud` before preflight:
     version availability, login/project status when the CLI exists, and
     redacted status labels only.
   - Add an agent-owned install-decision field for each CLI:
     `already_available`, `approved_installer_available`, `install_attempted`,
     `install_unavailable_needs_platform_source`, or
     `auth_or_project_user_action_needed`.
   - Do not print tokens, ADC JSON, service account JSON, database URLs, or
     private project credentials.

4. Update generated blocker guidance in `project-bootstrap-preflight.sh`.
   - Split missing required MCP guidance by item:
     `node_repl` => Codex app/plugin restoration required.
     pinned MCPs => agent registers them first.
     auth MCPs => user only approves/login in the real surface.
   - Split missing required CLI guidance by item:
     `railway` => agent will install from approved source when available; user
     only approves Railway login or secure token source if needed.
     `gcloud` => agent will install from approved source when available; user
     only approves Google login/ADC/project selection if needed.
   - Korean output must say plainly that these are mandatory blockers and that
     setup will be rechecked with `project-bootstrap` after completion.

5. Update `blocker-resolution-guide.md`, `report-template.md`, and
   `docs/CODEX_MCP_ENVIRONMENT.md`.
   - Make the GitHub-like UX explicit for `node_repl`, `railway`, and `gcloud`.
   - Document that CLI installation is agent-owned when an approved installer is
     already available in the pod image/session or documented by repo SoT, while
     login/ADC/project/account authority remains human-owned.
   - Do not introduce `@latest`, token-paste flows, or external runtime repo
     modifications.

6. Update `PROJECT_ENVIRONMENT.md` as a required root SoT sync path.
   - Replace wording that can be read as "Railway/gcloud install is always
     human/platform-owned" with the ownership ladder used by this plan:
     agent-owned install/setup first when there is an approved non-secret local
     source; human/platform-owned only for external account authority,
     credentials, ADC/project selection, service enablement, or missing approved
     installer source.
   - Keep EAS CLI as the only baseline exception.
   - Keep `docs/CODEX_MCP_ENVIRONMENT.md` synced with the root SoT.

7. Verification after implementation.
   - `bash evals/skills/project-bootstrap-agent-setup-smoke.sh`
   - `pnpm run test:runtime`
   - `pnpm turbo run lint test`
   - `pnpm run test:local-harness`
     - This also composes `pnpm turbo run lint test`, but the workspace gate is
       listed separately because AGENTS.md and CI name it as its own required
       gate.
   - `pnpm run validate:evidence-hygiene`
   - `git diff --check`
   - Run final high reviewer on the actual diff before reporting Done.

## Expected affected paths

- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-agent-setup.sh`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-preflight.sh`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/references/blocker-resolution-guide.md`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/references/report-template.md`
- `docs/CODEX_MCP_ENVIRONMENT.md`
- `PROJECT_ENVIRONMENT.md`
- `evals/skills/project-bootstrap-agent-setup-smoke.sh`
- `.evidence/reviews/*` for plan and final review evidence

## Gate impact

This is a Codex/OpenClaw runtime skill change. It requires runtime test gates
and local harness. It does not change app UI, backend contracts, production
settings, live Railway deploys, live gcloud project state, or external
platform/runtime repositories.

## Progress log

- 2026-06-14 09:00 KST: Initial plan reviewed by
  `wm-implementation-reviewer`; result `NO_GO` because
  `PROJECT_ENVIRONMENT.md` was conditional and agent-setup schema eval coverage
  was not explicit.
- 2026-06-14 09:08 KST: Plan updated and re-reviewed; result `NO_GO` because
  the approved-installer path for Railway/gcloud could still be skipped by
  always returning `install_unavailable_needs_platform_source`.
- 2026-06-14 09:12 KST: Plan updated with approved-installer fixtures and
  explicit workspace lint/test gate; final high review result `GO`.
- 2026-06-14 09:20 KST: Implementation started. Checkpoint 1 is in progress:
  add failing evals and update this progress log before any implementation
  script/doc changes.
- 2026-06-14 09:25 KST: Checkpoint 1 evals added. Targeted smoke command fails
  as expected because `tool_readiness.node_repl` is not implemented yet.
  Evidence:
  `.evidence/reviews/20260614-project-bootstrap-required-tool-agent-ownership-test-checkpoint.md`.
  Awaiting checkpoint reviewer result before implementation edits.
- 2026-06-14 09:31 KST: Checkpoint 1 reviewer returned `NO_GO` with
  test-quality findings. Fixed secret-hygiene false positives, fake CLI
  version-call proof, and raw-blocker support-only assertions before
  implementation. Targeted smoke still fails for the intended missing
  `tool_readiness.node_repl` schema. Re-review requested.
- 2026-06-14 10:15 KST: Checkpoint 1 re-review returned `GO`. Implemented
  agent-owned required tool readiness in `project-bootstrap-agent-setup.sh`,
  approved-installer handling for Railway/gcloud, `tool_readiness` report schema,
  role env PATH persistence, and user-facing preflight guidance. Targeted smoke
  now passes. Checkpoint 2 reviewer requested before SoT documentation edits.
- 2026-06-14 10:29 KST: Checkpoint 2 reviewer returned `GO`. Updated
  `PROJECT_ENVIRONMENT.md`, `docs/CODEX_MCP_ENVIRONMENT.md`,
  `project-bootstrap/SKILL.md`, project-bootstrap references, and local
  `docs/confluence` mirror to match the approved-installer ownership ladder.
  Live Confluence publish was not performed because target page IDs/current
  versions/proposed body diff/user approval are not present. Targeted smoke
  still passes after docs sync. Checkpoint 3 reviewer requested.
- 2026-06-14 10:38 KST: Checkpoint 3 reviewer returned `GO`. Final gates run:
  targeted project-bootstrap smoke, `git diff --check`, `pnpm run
  test:runtime`, `pnpm turbo run lint test`, `pnpm run test:local-harness`, and
  `pnpm run validate:evidence-hygiene` all exited 0. Repo-local
  `project-bootstrap-preflight.sh` was also rerun against a temp local
  workspace: CLI `railway` and `gcloud` were `available`, EAS remained the
  baseline exception, and the report was blocked only by the current local Codex
  MCP registry missing the required MCPs. Final reviewer requested.
- 2026-06-14 10:44 KST: Final reviewer returned `GO` with no findings.
  Proceeding to scoped commit on `fix/project-bootstrap-agent-language-ux`.

## Human gate assessment

No human gate is needed for this plan or repo-local SoT/test changes. During
actual OpenClaw bootstrap execution, human/platform input may still be needed
for:

- Codex app/plugin restoration for `node_repl`.
- Railway login or secure Railway token source.
- Google login, ADC setup, project selection, or service enablement.

The corrected skill should make those asks minimal and explicit after the agent
does all local checks/setup it can own.
