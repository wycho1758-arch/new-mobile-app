# WM Project Bootstrap Calls Pod Role Review Prompt

## Review Request

User asks:

> Does running `project-bootstrap` mean `pod-role-bootstrap` is called and runs? Does that mean items 1-5 previously described for `pod-role-bootstrap` are actually performed by `project-bootstrap`? Check by SoT and reviewer(xhigh). Remember that if environment has problems, the skill should inspect and fix agent-owned setup, not just stop.

Mode: scope.
Baseline: current checkout, no source implementation changes requested.

## Proposed Answer To Review

The precise SoT answer is:

1. Yes, if `project-bootstrap` means following the full `/workspace/skills/project-bootstrap/SKILL.md` workflow, it calls `pod-role-bootstrap` at workflow step 6:
   `bash /workspace/skills/pod-role-bootstrap/scripts/pod-bootstrap.sh`.
2. No, if `project-bootstrap` means only running `project-bootstrap-preflight.sh`, then `pod-role-bootstrap` is not called. The preflight script only reports readiness/blockers and writes `project-bootstrap-report.json`.
3. The previously described `pod-role-bootstrap` items 1-5 are not all implemented by the preflight script or agent setup script. They are performed by the `pod-role-bootstrap` script when it is invoked from the full `project-bootstrap` skill workflow:
   - role identity resolution/check: `pod-bootstrap.sh` resolves `WM_ROLE` or `/workspace/IDENTITY`, checks `WM_EXPECTED_ROLE`;
   - repo checkout existing/clone: `pod-bootstrap.sh` uses existing `REPO_PATH` or clones from non-secret `REPO_CLONE_URL`;
   - managed path registry check: `pod-bootstrap.sh` requires `/workspace/CODEX_MANAGED_PATHS.md` and repo path entry;
   - pnpm/corepack/dependency install: `pod-bootstrap.sh` runs corepack prepare and `pnpm install --frozen-lockfile`;
   - repo-local pod preflight/report: `pod-bootstrap.sh` runs `node scripts/codex-preflight.mjs --pod --json` and writes `/workspace/state/pod-role-bootstrap-report.json`.
4. `project-bootstrap` also performs agent-owned setup before reporting blockers:
   - resolves/writes role identity when derivable from SOUL/selector/handoff;
   - repairs the managed-path registry for the canonical repo path;
   - registers missing required MCPs from pinned non-secret repo SoT when Codex is available;
   - runs Codex CLI/auth precheck if Codex CLI is missing;
   - runs role-specific status-only setup reports for Design/QA when local setup skills exist;
   - writes `/workspace/state/project-bootstrap-agent-setup-report.json`.
5. This means the skill's intended behavior is not “stop immediately on every missing field.” It should repair/perform agent-owned deterministic setup first, then report remaining blockers. Human-owned blockers, missing pod artifacts, credentials, wrong repo path, conflicting managed ownership, cloud authority, or live external actions must remain blocked with a blocker guide/human gate.

## Key Source Refs

- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md:8`: project-bootstrap prepares a role pod before repo work.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md:10`: it is orchestration and does not replace role-specific pod skills.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md:11`: agent must inspect and set up its own pod environment for non-secret deterministic readiness before asking user.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md:54`: missing pod_role_bootstrap report before step 6 is pending evidence; run pod-role-bootstrap when workflow reaches that step.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md:76`: common setup requires `codex-cli-auth-setup` and `pod-role-bootstrap`.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md:136`: workflow section starts.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md:160`: run agent-owned setup before blocker report.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md:168`: agent setup repairs managed path, registers MCPs, runs Codex CLI/auth setup before missing Codex CLI becomes terminal, role-specific setup reports, and writes report.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md:184`: run project readiness preflight.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md:197`: if common blockers absent, run Codex CLI/auth setup.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md:203`: run repo checkout/bootstrap.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md:205`: command is `bash /workspace/skills/pod-role-bootstrap/scripts/pod-bootstrap.sh`.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md:209`: re-run preflight after pod-role-bootstrap writes report, then role-specific checks.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md:223`: QC checklist.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md:278`: agent-owned setup contract is intentionally narrow.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md:289`: local setup failure due to credential/account/cloud/human gate/wrong repo/conflicting ownership remains blocker with guide.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-agent-setup.sh:100`: writes role identity.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-agent-setup.sh:112`: repairs managed path registry.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-agent-setup.sh:143`: registers required MCPs.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-agent-setup.sh:208`: runs Codex CLI precheck if Codex CLI missing.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-agent-setup.sh:233`: runs Design/QA role setup reports when applicable.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-preflight.sh:176`: preflight writes report.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-preflight.sh:304`: preflight detects repo missing/token-bearing clone URL blocker.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-preflight.sh:321`: preflight requires managed path present.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-preflight.sh:322`: preflight requires project-bootstrap skill directory.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-preflight.sh:323`: preflight requires codex-cli-auth-setup skill directory.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-preflight.sh:324`: preflight requires pod-role-bootstrap skill directory.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-preflight.sh:325`: preflight blocks if Codex CLI missing.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-preflight.sh:392`: preflight report status.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/pod-role-bootstrap/scripts/pod-bootstrap.sh:13`: resolves role.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/pod-role-bootstrap/scripts/pod-bootstrap.sh:90`: uses existing repo checkout.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/pod-role-bootstrap/scripts/pod-bootstrap.sh:96`: repo missing requires REPO_CLONE_URL.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/pod-role-bootstrap/scripts/pod-bootstrap.sh:111`: checks managed path registry.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/pod-role-bootstrap/scripts/pod-bootstrap.sh:129`: fails missing role identity.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/pod-role-bootstrap/scripts/pod-bootstrap.sh:147`: corepack enable.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/pod-role-bootstrap/scripts/pod-bootstrap.sh:148`: prepares pnpm.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/pod-role-bootstrap/scripts/pod-bootstrap.sh:149`: installs dependencies.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/pod-role-bootstrap/scripts/pod-bootstrap.sh:152`: runs codex-preflight --pod --json.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/pod-role-bootstrap/scripts/pod-bootstrap.sh:153`: writes ready report on success.

## Review Questions

1. Is it correct that full `project-bootstrap` workflow invokes `pod-role-bootstrap`, while `project-bootstrap-preflight.sh` alone does not?
2. Is it correct that the pod-role-bootstrap 1-5 functions are actually done by `pod-role-bootstrap` after project-bootstrap reaches step 6?
3. Is the caveat about fixing agent-owned setup before reporting blockers source-backed?
