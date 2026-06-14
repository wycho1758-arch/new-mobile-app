# xhigh SoT And Validator Review Prompt

Review mode: plan
Reviewer depth: xhigh

Scope:

- `AGENTS.md`
- `PROJECT_ENVIRONMENT.md`
- `docs/CODEX_MCP_ENVIRONMENT.md`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/references/blocker-resolution-guide.md`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/references/report-template.md`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/pod-role-bootstrap/SKILL.md`
- `scripts/validate-team-doc.mjs`
- `docs/plans/active/20260614-project-bootstrap-auth-gates-goal.md`

Question:

Do the SoT docs, report template, blocker guide, and validator terms consistently describe and enforce the project-bootstrap auth-gate contract now implemented by the scripts?

Required checks:

1. Workspace defaults must state canonical repo URL/path, not using `/workspace` as project repo, project-local AGENTS distinction, explicit install approval, and exact install reporting.
2. Project-bootstrap docs must state setup report is required, missing/unreadable/blocked/auth-incomplete setup report blocks preflight, and Railway/gcloud/ADC/Expo MCP/Expo CLI are separate blockers.
3. Package/system install docs must require `PROJECT_BOOTSTRAP_INSTALL_APPROVED=true`, use `install_plan`, and keep failed attempts out of `installed_exact`.
4. Report template must include `repo_checkout`, `workspace_skills`, `workspace_agents`, `install_plan`, `installed_exact`, `project_bootstrap_agent_setup`, `tool_auth`, `expo_mcp`, `expo_cli`, `npm_global_install_failed`, and `install_failed`.
5. Blocker guide must translate setup-report and auth blockers into user-safe actions and must not ask for tokens, ADC JSON, service-account JSON, or passwords in chat.
6. Pod-role docs must describe token-bearing `REPO_CLONE_URL` rejection before existing-checkout and clone recovery paths.
7. Validator terms must guard the new report-template and blocker-guide terms.

Evidence already run:

- `bash -n` on changed shell scripts and smoke eval: PASS
- `node --check scripts/validate-team-doc.mjs`: PASS
- `node scripts/validate-team-doc.mjs`: PASS
- `bash evals/skills/project-bootstrap-agent-setup-smoke.sh`: PASS
- GREEN behavior xhigh v2: GO; the Low exact `--no-install` smoke issue was fixed and smoke passed afterward.

Return a verdict-producing JSON envelope. Findings must cite source line refs. Use only supported finding owners: `Product/Planning`, `Design`, `Mobile Architect`, `Mobile App Dev`, `Backend/API Integrator`, `QA/Release`, or `human`.
