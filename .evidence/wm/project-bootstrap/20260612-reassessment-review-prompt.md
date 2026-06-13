# WM SoT Sequence Reassessment Review Prompt

## Review Request

Re-review the user-corrected interpretation of the pod setup sequence.

User correction:

> The repo should be cloned first. Then `codex-cli-auth-setup` should run first because it is faster/easier. Then `project-bootstrap` should configure the rest through the skill. Check properly by SoT again and report with reviewer inspection.

Mode: scope.
Baseline commit: `a171ff6`.
No source implementation changes are requested. This is a read-only SoT/runtime sequence assessment.

## Revised Conclusion To Review

The previous report was too narrow because it treated `project-bootstrap` as only the preflight/status script, not as the full `project-bootstrap/SKILL.md` workflow. Under the full skill workflow, the user's high-level order is substantially correct with required preconditions:

1. Pod ConfigMap/Secret/tool-auth material must exist by data class; do not print secrets.
2. Ensure or clone the repo at `/workspace/projects/Wondermove-Inc/new-mobile-app` before meaningful project-bootstrap/preflight, because the read-only preflight and project-bootstrap report check repo SoT files from the checkout.
3. Ensure required pod-native skill artifacts exist under `/workspace/skills`, at minimum `project-bootstrap`, `codex-cli-auth-setup`, and `pod-role-bootstrap`, with role-specific additions when needed.
4. Ensure role identity can be resolved or derived: `WM_ROLE` / `WM_EXPECTED_ROLE` / `/workspace/IDENTITY` / pod SOUL/selector.
5. Run `codex-cli-auth-setup` to make Codex CLI/auth ready. This is source-backed as preceding repo checkout/bootstrap readiness in `codex-cli-auth-setup/SKILL.md`.
6. Run `project-bootstrap` as the full skill workflow, not only `project-bootstrap-preflight.sh`:
   - set non-secret defaults,
   - resolve/apply canonical role identity,
   - run `project-bootstrap-agent-setup.sh`,
   - run `project-bootstrap-preflight.sh`,
   - if common blockers are absent, run Codex CLI/auth precheck,
   - run `/workspace/skills/pod-role-bootstrap/scripts/pod-bootstrap.sh`,
   - re-run project readiness preflight,
   - run role-specific checks when applicable.
7. Verify final readiness evidence: `project-bootstrap-report.json`, `project-bootstrap-agent-setup-report.json`, `pod-role-bootstrap-report.json`, required MCP status from `.codex/config.toml`, and role-specific reports or source-backed `not_applicable`.
8. Stop before live external actions unless a linked `human-gate/v1` exists.

Therefore, the corrected concise report should be:

- `repo clone/checkout first -> codex-cli-auth-setup -> project-bootstrap full workflow` is an acceptable fast path if the repo is cloned to the canonical path and `project-bootstrap` is executed through its full SKILL workflow including `pod-role-bootstrap`.
- It is not sufficient if `project-bootstrap` means only running `project-bootstrap-preflight.sh`; the full skill workflow must continue through `pod-role-bootstrap` and post-bootstrap verification.
- It still does not prove live OrbStack/OpenClaw/external platform readiness; status-only reports and human gates remain required.

## Source Refs To Validate

- `mobile-app-dev-team/09-pod-native-openclaw-skills/codex-cli-auth-setup/SKILL.md:8`: this skill installs/validates Codex CLI on an OpenClaw host.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/codex-cli-auth-setup/SKILL.md:9`: fresh role pods should follow `16-pod-environment-bootstrap.md`.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/codex-cli-auth-setup/SKILL.md:10`: Codex auth readiness comes before repo checkout/bootstrap readiness.
- `mobile-app-dev-team/16-pod-environment-bootstrap.md:73`: `REPO_PATH` default is `/workspace/projects/Wondermove-Inc/new-mobile-app`.
- `mobile-app-dev-team/16-pod-environment-bootstrap.md:74`: `REPO_CLONE_URL` is required only when `REPO_PATH` is missing.
- `mobile-app-dev-team/16-pod-environment-bootstrap.md:83`: if the repo already exists at the canonical path, bootstrap may proceed without `REPO_CLONE_URL`.
- `mobile-app-dev-team/16-pod-environment-bootstrap.md:265`: zero-to-ready sequence.
- `mobile-app-dev-team/16-pod-environment-bootstrap.md:272`: read-only preflight stops on missing required repo/SoT/managed path/credential status.
- `mobile-app-dev-team/16-pod-environment-bootstrap.md:346`: preflight command requires `test -d "${REPO_PATH}"`.
- `mobile-app-dev-team/16-pod-environment-bootstrap.md:348`: preflight checks `AGENTS.md`.
- `mobile-app-dev-team/16-pod-environment-bootstrap.md:350`: preflight checks `PROJECT_ENVIRONMENT.md`.
- `mobile-app-dev-team/16-pod-environment-bootstrap.md:356`: preflight checks `/workspace/skills/project-bootstrap`.
- `mobile-app-dev-team/16-pod-environment-bootstrap.md:357`: preflight checks `/workspace/skills/codex-cli-auth-setup`.
- `mobile-app-dev-team/16-pod-environment-bootstrap.md:358`: preflight checks `/workspace/skills/pod-role-bootstrap`.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md:8`: project-bootstrap prepares a role pod before work.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md:10`: project-bootstrap is orchestration and does not replace role-specific skills.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md:76`: common required pod skills include `codex-cli-auth-setup` and `pod-role-bootstrap`.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md:136`: project-bootstrap workflow begins.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md:160`: agent-owned setup before blocker report.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md:168`: agent setup repairs managed path, registers MCPs, runs Codex CLI/auth status setup, and writes report.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md:184`: project readiness preflight.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md:197`: if common blockers are absent, run Codex CLI/auth setup.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md:203`: run repo checkout/bootstrap.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md:205`: repo checkout/bootstrap command is `pod-bootstrap.sh`.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md:209`: re-run preflight after `pod-role-bootstrap` writes its report and run role-specific checks.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md:262`: project-bootstrap Done When includes report paths and links/names role-specific reports.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-agent-setup.sh:112`: agent setup repairs managed path registry.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-agent-setup.sh:143`: agent setup registers MCPs when Codex is available.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-agent-setup.sh:208`: agent setup runs Codex CLI precheck if Codex CLI is missing.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/pod-role-bootstrap/scripts/pod-bootstrap.sh:90`: pod-role-bootstrap uses existing checkout if present.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/pod-role-bootstrap/scripts/pod-bootstrap.sh:96`: missing repo path requires `REPO_CLONE_URL`.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/pod-role-bootstrap/scripts/pod-bootstrap.sh:147`: pod-role-bootstrap aligns corepack/pnpm.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/pod-role-bootstrap/scripts/pod-bootstrap.sh:149`: pod-role-bootstrap runs `pnpm install --frozen-lockfile`.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/pod-role-bootstrap/scripts/pod-bootstrap.sh:152`: pod-role-bootstrap runs `node scripts/codex-preflight.mjs --pod --json`.

## Commands Already Run In This Turn

- Re-read the SoT files and scripts listed above with line numbers.
- Previous relevant checks from this session: `pnpm run test:runtime` PASS, `pnpm turbo run lint test` PASS, `pnpm run validate:evidence-hygiene` PASS.

## Review Questions

1. Is the revised conclusion source-backed?
2. Is `repo clone/checkout -> codex-cli-auth-setup -> project-bootstrap full workflow` acceptable as a concise fast path?
3. What exact caveats must be included to avoid overstating readiness?
