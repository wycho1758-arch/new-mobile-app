# xhigh Final Review Prompt

Review mode: final
Reviewer depth: xhigh

Scope:

- Implementation and docs for project-bootstrap auth gates:
  - `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-agent-setup.sh`
  - `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-preflight.sh`
  - `mobile-app-dev-team/09-pod-native-openclaw-skills/pod-role-bootstrap/scripts/pod-bootstrap.sh`
  - `evals/skills/project-bootstrap-agent-setup-smoke.sh`
  - `scripts/validate-team-doc.mjs`
  - `AGENTS.md`
  - `PROJECT_ENVIRONMENT.md`
  - `docs/CODEX_MCP_ENVIRONMENT.md`
  - project-bootstrap and pod-role-bootstrap skill docs/references
  - `docs/plans/active/20260614-project-bootstrap-auth-gates-goal.md`

Question:

Is the project-bootstrap auth-gate change ready to report as completed for the
runtime/OpenClaw scope, and what blockers or residual risks remain?

Required behavior:

1. `project-bootstrap` must fail closed when Railway auth, gcloud auth, Google
   ADC, Expo MCP auth, or workspace Expo CLI auth are absent.
2. `project-bootstrap-preflight.sh` must consume the setup report as a hard
   input and block on missing/unreadable/blocked/auth-incomplete setup reports.
3. Package/system installs must require explicit
   `PROJECT_BOOTSTRAP_INSTALL_APPROVED=true`; failed install attempts must not
   populate `installed_exact`.
4. Canonical repo clone, `/workspace/skills` registration, and `/workspace/AGENTS.md`
   defaults must be handled without overwrites.
5. Token-bearing `REPO_CLONE_URL` must be rejected in project-bootstrap preflight
   and pod-role-bootstrap before existing-checkout and clone recovery paths.
6. SoT docs, report template, blocker guide, and validators must guard the new
   contract.

Evidence:

- RED coverage xhigh v3: GO.
- GREEN behavior xhigh v2: GO after fixing `installed_exact` and exact
  `--no-install expo whoami` smoke coverage.
- SoT/validator xhigh: GO.
- `bash -n` on changed shell scripts and smoke eval: PASS.
- `node --check scripts/validate-team-doc.mjs`: PASS.
- `node scripts/validate-team-doc.mjs`: PASS.
- `bash evals/skills/project-bootstrap-agent-setup-smoke.sh`: PASS.
- `node scripts/validate-repo-operations.mjs`: PASS.
- `node scripts/validate-project-environment.mjs`: PASS.
- `pnpm run test:runtime`: PASS.
- `pnpm run test:local-harness`: PASS.
- `pnpm turbo run lint test`: PASS.
- `pnpm --filter mobile lint`: PASS.
- `pnpm --filter mobile test`: PASS.
- `codex mcp list`: exited 0; do not quote URL/token-like material from its
  output. Required project MCP inventory was visible as enabled.
- Final review v1 returned GO with two Low findings; both were fixed:
  - setup report now blocks `railway-cli-unavailable` and
    `gcloud-cli-unavailable` when required CLIs are unavailable.
  - report template now matches generated setup report field names:
    `repo_checkout.clone_url_status`, `repo_checkout.local_path`, and
    hyphenated workspace skill keys.
- After those Low fixes, these checks were rerun and passed:
  - `bash -n` on changed shell scripts and smoke eval.
  - `node --check scripts/validate-team-doc.mjs`.
  - `node scripts/validate-team-doc.mjs`.
  - `bash evals/skills/project-bootstrap-agent-setup-smoke.sh`.
  - `pnpm run test:runtime`.
  - `pnpm turbo run lint test`.
  - `pnpm run test:local-harness`.

Known non-scope check failure:

- `pnpm --filter mobile exec expo install --check`: FAIL.
- `pnpm --filter mobile run doctor`: FAIL.
- Failure is Expo SDK 56 patch dependency drift in mobile package versions:
  `@expo/metro-runtime`, `expo`, `expo-dev-client`, `expo-linking`,
  `expo-router`, and `jest-expo` need patch updates.
- This project-bootstrap auth-gate change did not edit mobile dependencies.
- Fixing it requires explicit package-change approval before running any update.

Return a verdict-producing JSON envelope. Findings must cite source line refs.
Use only supported finding owners: `Product/Planning`, `Design`,
`Mobile Architect`, `Mobile App Dev`, `Backend/API Integrator`, `QA/Release`,
or `human`.
