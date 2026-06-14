# node_repl Removal And Login Proof UX Plan

Date: 2026-06-14
Mode: `$wm` planning-only until reviewer approval
Requested reviewer level: xhigh

## Objective

Remove `node_repl` from the `project-bootstrap` required baseline because the
repo does not directly use it and the current SoT describes it as Codex
app/plugin environment owned rather than repo-owned. At the same time, improve
Railway/gcloud login handling so the agent installs or starts login flows when
safe, the user enters credentials only in the real provider surface, and the
agent verifies credential storage by metadata only.

## SoT Inputs Checked

- `AGENTS.md`
  - Runtime edits must stay in this repo, use TDD, avoid secrets, and pass
    `pnpm run test:runtime`, `pnpm turbo run lint test`, and
    `pnpm run test:local-harness` for runtime changes.
- `PROJECT_ENVIRONMENT.md`
  - Current SoT lists `node_repl` as an additional project-bootstrap-required
    MCP but describes it as Codex app/plugin support, app/plugin-owned, and not
    repo-local.
  - Railway and gcloud are project-bootstrap-required CLIs.
- `docs/CODEX_MCP_ENVIRONMENT.md`
  - Current guide lists `node_repl` as required but says it is usually managed
    by Codex app/runtime and should not be replaced with a repo-local path.
  - Railway CLI and gcloud are required readiness surfaces.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md`
  - Current baseline makes `node_repl`, `railway`, and `gcloud` blockers.
  - Agents must perform non-secret setup before user blocker reports and must
    use real login surfaces when possible.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-agent-setup.sh`
  - Current script reports `node_repl` as `codex_app_plugin` owner and never
    installs it.
  - Current Railway/gcloud installer behavior only uses approved installer path
    env vars.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-preflight.sh`
  - Current script blocks on `missing required MCP node_repl`, `missing required
    CLI railway`, and `missing required CLI gcloud`.
- `evals/skills/project-bootstrap-agent-setup-smoke.sh`
  - Existing tests assert `node_repl` is required and missing is a blocker.
- Official Railway docs
  - Railway CLI interacts with projects from the command line.
  - Official Railway docs list npm as a supported install method for macOS,
    Linux, and Windows when Node.js 16 or higher is available.
  - User-approved install path for this skill update is exactly
    `npm i -g @railway/cli`.
  - `railway login` opens the browser by default; `railway login --browserless`
    uses a pairing code for environments without a browser.
  - `RAILWAY_TOKEN` or `RAILWAY_API_TOKEN` can be used for non-interactive
    auth, exactly one at a time.
  - Official source refs: `https://docs.railway.com/cli`,
    `https://docs.railway.com/cli/login`.
- Official Google Cloud docs
  - Google Cloud CLI must be installed before gcloud login/project selection.
  - On Ubuntu/Linux, the approved official package setup path is:
    add the Google Cloud apt source with signed keyring, import the public key,
    then run `sudo apt-get update && sudo apt-get install google-cloud-cli`;
    an approved tarball installer is also acceptable when recorded by SoT.
  - After install, the agent must run `gcloud --version`.
  - `gcloud auth login` authenticates the gcloud CLI and opens a browser by
    default unless `--no-launch-browser` is used.
  - `gcloud auth application-default login` creates ADC credentials for local
    development.
  - On Linux/macOS, ADC from `gcloud auth application-default login` is stored
    at `$HOME/.config/gcloud/application_default_credentials.json`.
  - gcloud CLI credentials and ADC credentials are distinct.
  - `gcloud config set project PROJECT_ID` is the documented command for
    setting the active project. This skill must verify with the user-required
    `gcloud config get-value project`; if a future gcloud version removes that
    alias, report the incompatibility and use the current documented
    `gcloud config get project` only as an explicit fallback.
  - Official source refs: `https://docs.cloud.google.com/sdk/docs/install-sdk`,
    `https://docs.cloud.google.com/sdk/gcloud/reference/auth/login`,
    `https://docs.cloud.google.com/sdk/gcloud/reference/auth/application-default/login`,
    `https://docs.cloud.google.com/sdk/gcloud/reference/config/set`,
    `https://docs.cloud.google.com/docs/authentication/application-default-credentials`.
- Official GitHub CLI docs
  - `gh auth login` uses a web-based browser flow by default.
  - After login, the token is stored in the system credential store when
    available; otherwise GitHub CLI may fall back to a plaintext file, and
    `gh auth status` reports the stored location.
- Official Expo docs
  - EAS can authenticate with `eas login` or with `EXPO_TOKEN`.
  - `EXPO_TOKEN` takes precedence over username/password auth and avoids
    `eas login` for EAS CLI commands.

## Scope

In scope:

- Remove `node_repl` from `project-bootstrap` required baseline and blockers.
- Keep `node_repl` as optional/app-managed documentation if useful, explicitly
  not required for project-bootstrap pass.
- Update tests/evals before implementation.
- Add or update project-bootstrap guidance so Railway/gcloud missing CLIs are
  handled as:
  1. agent checks whether CLI exists;
  2. Railway missing: agent installs with the user-approved command
     `npm i -g @railway/cli`, then rechecks `railway --version`;
  3. Railway unauthenticated: agent runs `railway login` so the official browser
     login opens; user signs in there; use `railway login --browserless` only
     when no browser is available;
  4. gcloud missing: agent installs Google Cloud CLI from an approved official
     installer/package source, then rechecks `gcloud --version`;
  5. gcloud unauthenticated: agent runs `gcloud auth login`; user signs in in
     the Google browser/official CLI flow;
  6. ADC missing for Stitch: agent runs `gcloud auth application-default login`;
     user completes the Google browser/official CLI flow;
  7. project missing: agent asks for the non-secret Google Cloud project ID and
     runs `gcloud config set project <project-id>`;
  8. agent verifies project with `gcloud config get-value project`;
  9. agent verifies only status and credential file metadata.
- Add credential storage proof guidance/reporting for GitHub, Expo, Railway,
  and gcloud without reading or printing secret contents.
- Add Ubuntu file explorer guidance that defaults to metadata-only proof. It
  opens directories only when the user explicitly asks for visual
  credential-location proof and
  `PROJECT_BOOTSTRAP_OPEN_CREDENTIAL_FILE_EXPLORER=true`, then degrades to
  `ls -ld`/`find -maxdepth 1 -printf` metadata when unavailable.

## Required Runtime Sequence For The Skill

This skill change must make `project-bootstrap` behave like the GitHub setup UX:
the agent performs every non-secret command it can run, and the user only
signs in, approves, or supplies a non-secret project id when the provider flow
requires it. The implementation must not merely tell the user to install or log
in manually.

1. Baseline MCP decision
   - Remove `node_repl` from the required MCP list and from the blocking
     preflight condition.
   - Keep `node_repl` as optional Codex app/plugin inventory only when useful.
   - If `node_repl` is missing, report it as non-blocking support detail, not
     as `missing required MCP node_repl`.

2. Railway install and login
   - Check: `command -v railway` and `railway --version`.
   - If missing, the agent runs exactly:
     `npm i -g @railway/cli`.
   - Recheck: `railway --version`.
   - Check login state: `railway whoami`.
   - If unauthenticated and user is present, the agent runs:
     `railway login`.
   - The user action is only: complete Railway sign-in/approval in the browser
     opened by the official CLI.
   - If no browser/file UI is available, the agent runs:
     `railway login --browserless`, then asks the user to open the printed
     Railway URL and enter the pairing code in the real Railway surface.
   - Recheck: `railway whoami`.
   - Verify credential storage metadata only for `/root/.railway/` when the pod
     runs as root, or `${HOME}/.railway/` otherwise.

3. gcloud install, login, ADC, and project selection
   - Check: `command -v gcloud` and `gcloud --version`.
   - If missing on Ubuntu/Linux and an approved official install is allowed, the
     agent performs the official package setup:
     - ensure required package tooling such as `curl`, `gnupg`, and
       `apt-transport-https` is available when needed;
     - add the Google Cloud apt source using the signed keyring path;
     - import the Google Cloud public key into the signed keyring;
     - run `sudo apt-get update && sudo apt-get install google-cloud-cli`.
   - If the runtime cannot use `sudo`/apt or the official package setup is not
     approved, the agent reports the blocked installer precondition instead of
     inventing another source.
   - Recheck: `gcloud --version`.
   - Check CLI auth state: `gcloud auth list`.
   - If unauthenticated and user is present, the agent runs:
     `gcloud auth login`.
   - The user action is only: complete Google sign-in/approval in the browser or
     official CLI URL/code flow.
   - If ADC is required for Stitch/local Google client libraries, the agent
     runs:
     `gcloud auth application-default login`.
   - The user action is only: complete Google approval in the browser or
     official CLI URL/code flow.
   - Check project: `gcloud config get-value project`.
   - If no project is configured, the agent asks only for the non-secret
     Google Cloud project ID, then runs:
     `gcloud config set project <project-id>`.
   - Verify project: `gcloud config get-value project`.
   - Verify credential storage metadata only for `/root/.config/gcloud/` and,
     when present, `/root/.config/gcloud/application_default_credentials.json`
     when running as root, or the matching `${HOME}/.config/gcloud/` paths
     otherwise.

4. GitHub, Expo, Railway, and gcloud credential proof
   - Do not open Finder or a file explorer during routine checks.
   - Open Ubuntu file explorer only when the user explicitly asks for visual
     credential-location proof and
     `PROJECT_BOOTSTRAP_OPEN_CREDENTIAL_FILE_EXPLORER=true`; use `xdg-open`,
     `gio open`, or `nautilus` for the credential directories only.
   - If no GUI/file manager is available or file explorer opening is not
     explicitly enabled, fall back to terminal metadata proof.
   - Metadata proof may include only path, file or directory name, owner/group,
     mode, size, and modification time.
   - The agent must never print or persist credential file contents, token
     values, OAuth codes, ADC JSON, service account JSON, or bearer tokens.
   - Status commands must be used for login proof:
     `gh auth status`, `eas whoami` or Expo/EAS token status,
     `railway whoami`, `gcloud auth list`,
     and `gcloud config get-value project`.

Out of scope:

- No live deployment, EAS build/submit, Railway deploy, Stitch generation, or
  GitHub branch-protection mutation.
- No token, ADC JSON, service account JSON, OAuth code, secret file contents,
  database URL, or bearer token output.
- No external platform/runtime repository modifications.
- No assumption that a fixed GitHub or Expo credential file path exists unless
  the CLI reports it or the directory exists.

## Design Decisions

1. `node_repl` classification
   - Change from required baseline blocker to optional Codex app/plugin support
     inventory.
   - Rationale: repo search shows no app/package runtime usage, current SoT says
     app/plugin-owned, and the agent cannot repair it repo-locally.
   - Gate impact: `project-bootstrap` should not fail solely because
     `node_repl` is absent.

2. Railway login UX
   - Keep Railway CLI required.
   - If missing, install with the approved command `npm i -g @railway/cli`.
   - The script/report must record that this is an approved, non-secret install
     command and must not ask the user to run it manually.
   - After installation, run `railway --version`.
   - If available and unauthenticated, run `railway login` when browser is
     available and user is present; use `railway login --browserless` only when
     no browser is available.
   - Verify with `railway whoami` and `/root/.railway/` metadata when running as
     root in the Ubuntu pod.

3. gcloud login UX
   - Keep gcloud CLI required.
   - If missing, install Google Cloud CLI from an approved official installer
     path/package setup recorded by SoT. The implementation must support the
     pod-safe approved installer hook and may document the official Ubuntu
     package setup path, but must not silently add broad system package sources
     without an explicit approved source.
   - After installation, run `gcloud --version`.
   - If available and unauthenticated, run `gcloud auth login` for CLI auth.
   - For Stitch/ADC readiness, also run `gcloud auth application-default login`
     when ADC is required and user is present.
   - If no project is configured, request only the non-secret `<project-id>`;
     then run `gcloud config set project <project-id>`.
   - Always verify the selected project with `gcloud config get-value project`.
   - Verify with `gcloud auth list`, `gcloud config get-value project`, and
     metadata for `/root/.config/gcloud/` and
     `/root/.config/gcloud/application_default_credentials.json`.

4. GitHub credential proof UX
   - Do not open fixed credential files by default.
   - Run `gh auth status`; if GitHub CLI reports a storage location, open the
     parent directory or show metadata only.
   - If no location is reported, check standard config metadata such as
     `/root/.config/gh/` only when it exists, and rely on `gh auth status` for
     login state.

5. Expo credential proof UX
   - Prefer `EXPO_TOKEN` status-only when EAS automation is selected.
   - For interactive local EAS auth, use `eas login` only when EAS work is
     selected and user is present.
   - Verify with `eas whoami` or `pnpm --filter mobile exec eas whoami` when
     EAS CLI exists; do not require EAS CLI for baseline project-bootstrap.
   - Check metadata for `/root/.expo/` or `/root/.eas/` only if those directories
     exist. Do not claim an official fixed storage path from the reviewed Expo
     docs.

6. Ubuntu file explorer proof
   - Add a helper/report section that reports metadata by default and tries file
     manager commands only when explicitly enabled, e.g. `xdg-open <dir>`,
     `gio open <dir>`, `nautilus <dir>`.
   - If the pod has no GUI/file manager or file explorer opening is disabled,
     report `file_explorer: unavailable|disabled` and provide equivalent
     metadata-only terminal proof.
   - For every provider, report only:
     - directory/file exists or missing;
     - owner/group;
     - mode;
     - modification time;
     - filename;
     - CLI login status command result.

## Planned Changes

1. Tests first
   - Update `evals/skills/project-bootstrap-agent-setup-smoke.sh`:
     - remove assertions that `node_repl.required === true`;
     - add assertions that missing `node_repl` is optional/app-managed and not a
       blocker;
     - keep Railway/gcloud required CLI blocker assertions;
     - add assertions for Railway/gcloud human-present login guidance;
     - add assertions that credential proof output does not include secret
       contents and includes metadata-only fields.
   - Add or update evidence hygiene assertions if any new report fields could
     accidentally persist token/ADC contents.

2. SoT and docs
   - Update `PROJECT_ENVIRONMENT.md`:
     - move `node_repl` out of project-bootstrap-required MCP list into optional
       Codex app/plugin inventory;
     - clarify Railway/gcloud official login flow and metadata-only credential
       proof.
   - Update `docs/CODEX_MCP_ENVIRONMENT.md`:
     - remove `node_repl` from required baseline table/checklist;
     - document optional app-managed status;
     - document Railway install as `npm i -g @railway/cli`, then
       `railway --version`, `railway login`, `railway whoami`, and browserless
       fallback only when needed;
     - document gcloud install, `gcloud --version`, `gcloud auth login`,
       `gcloud auth application-default login`,
       `gcloud config set project <project-id>`,
       `gcloud config get-value project`, and ADC path;
     - document GitHub/Expo credential proof as CLI-status-first and
       metadata-only.
   - Update `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md`
     and `references/blocker-resolution-guide.md`:
     - remove node_repl blocker language;
     - add user-facing Korean/English minimal login request language for
       Railway/gcloud.

3. Scripts
   - Update `project-bootstrap-agent-setup.sh`:
     - stop reporting node_repl as required;
     - keep optional inventory status if useful;
     - install Railway with `npm i -g @railway/cli` when `railway` is missing
       and npm is available, unless the runtime policy explicitly disables
       global npm installs;
     - after Railway install, run `railway --version`;
     - when Railway auth is missing and the user is present, start
       `railway login`; fall back to `railway login --browserless` only in
       browserless sessions;
     - install or activate gcloud from an approved official source/hook when
       `gcloud` is missing, then run `gcloud --version`;
     - when gcloud auth is missing and the user is present, start
       `gcloud auth login`;
     - when ADC is missing and needed, start
       `gcloud auth application-default login`;
     - when Google Cloud project is missing, request `<project-id>` as a
       non-secret value, then run `gcloud config set project <project-id>` and
       verify with `gcloud config get-value project`;
     - add structured fields for login flow readiness and credential metadata
       proof for Railway/gcloud/GitHub/Expo.
   - Update `project-bootstrap-preflight.sh`:
     - remove `node_repl` from missing required MCP blockers;
     - keep support details optional;
     - generate Railway/gcloud guidance that says the agent will install/start
       the official login command and the user only completes credentials in the
       real surface.
     - Korean guidance must explicitly say:
       - Railway 설치: 제가 `npm i -g @railway/cli`를 실행합니다.
       - Railway 로그인: 제가 `railway login`을 실행하면 브라우저에서 로그인만
         해 주세요.
       - gcloud 로그인: 제가 `gcloud auth login`과 필요 시
         `gcloud auth application-default login`을 실행하면 Google 화면에서
         승인해 주세요.
       - 프로젝트 선택: 프로젝트 ID는 비밀이 아니므로 알려주시면 제가
         `gcloud config set project <project-id>`를 실행하고
         `gcloud config get-value project`로 확인합니다.
   - Consider adding a small helper script under the project-bootstrap skill,
     e.g. `scripts/project-bootstrap-credential-proof.sh`, to centralize
     metadata-only checks and file manager opening.

4. Verification
   - `pnpm run test:runtime`
   - `pnpm turbo run lint test`
   - `pnpm run test:local-harness`
   - focused smoke eval if available:
     `bash evals/skills/project-bootstrap-agent-setup-smoke.sh`
   - redaction/evidence hygiene validator if touched:
     `pnpm run validate:evidence-hygiene`

## Human Gates And Runtime Boundaries

- Actual provider login requires user presence. The agent may open or guide the
  login flow, but the user signs in, approves, and enters credentials only in
  the provider UI.
- Installing Railway/gcloud from a broad system package manager or external
  download must be backed by an approved non-secret installer source in SoT or a
  human/platform approval.
- Opening Ubuntu file explorer is a runtime action and must be opt-in. It may
  be unavailable in headless pods. The plan must allow metadata-only fallback.
- Any live deploy/build/submit/service enablement remains outside this change
  unless separately approved.

## Reviewer Request

Review whether this plan is safe and complete for:

- removing `node_repl` from project-bootstrap required blockers;
- preserving Railway/gcloud as required CLIs;
- aligning Railway/gcloud login handling with official docs;
- providing GitHub/Expo/Railway/gcloud credential storage proof without reading
  or exposing secrets;
- meeting `$wm` SoT, TDD, evidence, and gate requirements.

## Progress

- [x] Checkpoint 0: Plan updated with Railway `npm i -g @railway/cli`,
  `railway login`, gcloud install/login/ADC/project selection, and
  metadata-only credential proof requirements.
- [x] Checkpoint 1 TDD edit: Updated
  `evals/skills/project-bootstrap-agent-setup-smoke.sh` before implementation.
- [x] Checkpoint 1 focused smoke run: `bash
  evals/skills/project-bootstrap-agent-setup-smoke.sh` exits 1 as expected
  because the implementation still reports `node_repl.required === true`.
  Evidence:
  `.evidence/reviews/20260614-node-repl-removal-login-proof-test-checkpoint.md`.
- [x] Checkpoint 1 reviewer: GO. Evidence:
  `.evidence/reviews/20260614-node-repl-removal-login-proof-test-checkpoint-review.md`.
- [x] Checkpoint 2 implementation: completed. Evidence:
  `.evidence/reviews/20260614-node-repl-removal-login-proof-implementation-checkpoint.md`.
- [x] Checkpoint 2 reviewer: NO_GO. Evidence:
  `.evidence/reviews/20260614-node-repl-removal-login-proof-implementation-review.md`.
- [x] Checkpoint 2 fixes for reviewer findings: completed. Evidence:
  `.evidence/reviews/20260614-node-repl-removal-login-proof-implementation-fix-checkpoint.md`.
- [x] Checkpoint 2 re-review: NO_GO. Evidence:
  `.evidence/reviews/20260614-node-repl-removal-login-proof-implementation-rereview.md`.
- [x] Checkpoint 2 second fixes for reviewer findings: completed. Evidence:
  `.evidence/reviews/20260614-node-repl-removal-login-proof-implementation-second-fix-checkpoint.md`.
- [x] Checkpoint 2 second re-review: NO_GO, fixed immediately. Evidence:
  `.evidence/reviews/20260614-node-repl-removal-login-proof-implementation-second-rereview.md`.
- [x] Checkpoint 2 third re-review: GO. Evidence:
  `.evidence/reviews/20260614-node-repl-removal-login-proof-implementation-third-rereview.md`.
- [x] User interruption fix: Finder/file explorer opening changed to explicit
  opt-in only. Evidence:
  `.evidence/reviews/20260614-node-repl-removal-login-proof-file-explorer-opt-in-fix.md`.
- [x] File explorer opt-in reviewer: GO. Evidence:
  `.evidence/reviews/20260614-node-repl-removal-login-proof-file-explorer-opt-in-review.md`.
- [x] Final gates: PASS. Evidence:
  `.evidence/reviews/20260614-node-repl-removal-login-proof-final-gates.md`.
- [x] Final reviewer: GO. Evidence:
  `.evidence/reviews/20260614-node-repl-removal-login-proof-final-review.md`.
- [ ] Commit and merge PR: in progress.
- [ ] Final gates and reviewer: pending.
- [ ] Commit and merge PR: pending.
