# xhigh GREEN Behavior Review Prompt

Review mode: plan
Reviewer depth: xhigh

Scope:

- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-agent-setup.sh`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-preflight.sh`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/pod-role-bootstrap/scripts/pod-bootstrap.sh`
- `evals/skills/project-bootstrap-agent-setup-smoke.sh`
- `scripts/validate-team-doc.mjs`
- `docs/plans/active/20260614-project-bootstrap-auth-gates-goal.md`
- SoT docs changed so far: `AGENTS.md`, `PROJECT_ENVIRONMENT.md`,
  `docs/CODEX_MCP_ENVIRONMENT.md`, project-bootstrap and pod-role-bootstrap
  skill docs.

Question:

Do the GREEN script changes satisfy the reviewed RED contract without weakening
secret safety, install approval, or project-bootstrap pass/fail authority?

Required checks:

1. `project-bootstrap-agent-setup.sh` requires
   `PROJECT_BOOTSTRAP_INSTALL_APPROVED=true` before Railway package installation
   or any executable installer path, records `install_plan`, and records
   `installed_exact`.
   - `installed_exact` must include only verified successful installs.
   - Failed Railway package install attempts must not be reported as installed.
   - Failed approved executable installer attempts must not be reported as installed.
2. `project-bootstrap-agent-setup.sh` records separate Railway auth, gcloud
   auth, gcloud ADC, Expo MCP auth, and Expo CLI auth statuses.
3. Expo CLI status checks must not install packages.
4. `project-bootstrap-agent-setup.sh` handles canonical repo clone,
   `/workspace/skills` registration, and `/workspace/AGENTS.md` defaults without
   overwriting existing runtime content.
5. `project-bootstrap-preflight.sh` consumes
   `PROJECT_BOOTSTRAP_AGENT_SETUP_REPORT_PATH` as a hard input and blocks on
   missing/unreadable/blocked/auth-incomplete setup reports.
6. Token-bearing `REPO_CLONE_URL` is rejected by both preflight and
   pod-role-bootstrap, including when the repo path already exists, and reports
   do not echo the raw URL.
7. Existing and new smoke coverage passes without package installation side
   effects from status checks.

Evidence already run:

- `bash -n` on changed shell scripts and smoke eval: PASS
- `node --check scripts/validate-team-doc.mjs`: PASS
- targeted project-bootstrap smoke eval: PASS
- `node scripts/validate-team-doc.mjs`: PASS
- GREEN review v1 returned NO_GO because `installed_exact` could include
  failed install attempts.
- Follow-up RED reproduced that failure at
  `case_failed_npm_install_is_not_reported_as_installed`.
- Follow-up GREEN smoke now passes with `npm_global_install_failed`,
  `install_failed`, and success-only `installed_exact` assertions.

Return a verdict-producing JSON envelope. Findings must cite source line refs.
Use only supported finding owners: `Product/Planning`, `Design`,
`Mobile Architect`, `Mobile App Dev`, `Backend/API Integrator`, `QA/Release`,
or `human`.
