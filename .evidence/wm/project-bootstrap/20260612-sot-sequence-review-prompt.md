# WM SoT Sequence Review Prompt

## Review Request

Review the SoT-grounded conclusion for the user request:

> Check whether running `mobile-app-dev-team/09-pod-native-openclaw-skills/codex-cli-auth-setup` then `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap` is sufficient to reproduce the current local development environment on another computer so pod agents can develop. If not, define the required order from current project SoT. Report must be reviewer-checked.

Mode: scope.
Baseline commit: `a171ff6`.
No implementation changes were made. This is a read-only SoT/runtime sequence assessment.

## Proposed Conclusion

The two-step order `codex-cli-auth-setup -> project-bootstrap` is not sufficient as a complete zero-to-ready setup sequence. It validates Codex CLI/auth and runs the project-level orchestration/preflight, but SoT requires additional preconditions and a mandatory `pod-role-bootstrap` phase before a pod can be called ready for Codex-managed repo work.

The required SoT order is:

1. Ensure pod ConfigMap/Secret/tool-auth material exists by data class; do not print secret values.
2. Patch pod configuration through the correct channel; if pod-template variables or references changed, rollout restart, wait for readiness, and discard/re-source old sessions.
3. Run pod-internal redacted read-only preflight and stop on missing required SoT file, skill directory, repo path, managed path entry, or credential status.
4. Run `project-bootstrap` to orchestrate project-level readiness and write status-only evidence.
5. Run `codex-cli-auth-setup` to verify Codex CLI/auth readiness without leaking secrets.
6. Resolve canonical role identity from `WM_ROLE` or `/workspace/IDENTITY`.
7. Ensure repo checkout exists at `/workspace/projects/Wondermove-Inc/new-mobile-app`; use explicit non-secret `REPO_CLONE_URL` only when missing.
8. Ensure `/workspace/CODEX_MANAGED_PATHS.md` contains `- /workspace/projects/Wondermove-Inc/new-mobile-app/`.
9. Run `pod-role-bootstrap`; it aligns `pnpm@9.15.9`, runs `pnpm install --frozen-lockfile`, runs `node scripts/codex-preflight.mjs --pod --json`, and writes status-only evidence.
10. Verify Codex MCP status from `.codex/config.toml`.
11. Run role-specific checks when applicable: `stitch-adc-setup` for Design; `eas-robot-auth-setup` for QA/Release.
12. Stop before any live external action unless a linked `human-gate/v1` exists for the exact action and evidence path.

For ordinary repo-development readiness by common roles, the irreducible pod-native skill chain includes `project-bootstrap`, `codex-cli-auth-setup`, and `pod-role-bootstrap`; role-specific skills are conditional. `project-bootstrap` is an orchestration skill and explicitly does not replace role-specific pod skills.

## Source Refs

- `mobile-app-dev-team/16-pod-environment-bootstrap.md:3`: declares this document the zero-to-ready sequence for fresh OpenClaw role pods.
- `mobile-app-dev-team/16-pod-environment-bootstrap.md:6`: says the document itself is source guidance and does not prove live pod behavior.
- `mobile-app-dev-team/16-pod-environment-bootstrap.md:12`: lists authoritative SoT inputs for the sequence.
- `mobile-app-dev-team/16-pod-environment-bootstrap.md:50`: recommended canary sequence includes config/private-material patch, rollout restart, readiness check, pod-internal preflight, project-bootstrap, pod-role-bootstrap.
- `mobile-app-dev-team/16-pod-environment-bootstrap.md:265`: defines the full zero-to-ready sequence.
- `mobile-app-dev-team/16-pod-environment-bootstrap.md:267`: ConfigMap and Secret material must exist before bootstrap.
- `mobile-app-dev-team/16-pod-environment-bootstrap.md:269`: configuration patch/restart/readiness requirements.
- `mobile-app-dev-team/16-pod-environment-bootstrap.md:272`: read-only preflight and stop criteria.
- `mobile-app-dev-team/16-pod-environment-bootstrap.md:276`: `project-bootstrap` responsibilities.
- `mobile-app-dev-team/16-pod-environment-bootstrap.md:283`: `codex-cli-auth-setup` step.
- `mobile-app-dev-team/16-pod-environment-bootstrap.md:285`: role identity resolution step.
- `mobile-app-dev-team/16-pod-environment-bootstrap.md:286`: repo checkout requirement.
- `mobile-app-dev-team/16-pod-environment-bootstrap.md:288`: managed path entry requirement.
- `mobile-app-dev-team/16-pod-environment-bootstrap.md:291`: mandatory `pod-role-bootstrap` step and what it runs.
- `mobile-app-dev-team/16-pod-environment-bootstrap.md:300`: verify Codex MCP status from `.codex/config.toml`.
- `mobile-app-dev-team/16-pod-environment-bootstrap.md:302`: role-specific checks.
- `mobile-app-dev-team/16-pod-environment-bootstrap.md:307`: missing/blocked criteria.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md:8`: project-bootstrap prepares a role pod before work starts.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md:10`: project-bootstrap does not replace role-specific pod skills.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md:64`: required defaults.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md:76`: required pod skills include `codex-cli-auth-setup` and `pod-role-bootstrap`.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md:136`: project-bootstrap workflow.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md:197`: Codex CLI auth setup after common blockers absent.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md:203`: repo checkout/bootstrap via pod-role-bootstrap.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md:209`: re-run preflight and role-specific checks after pod-role-bootstrap.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md:223`: QC checklist.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/README.md:21`: canonical per-role pod-native skill matrix.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/README.md:28`: common Product/Planning matrix includes `codex-cli-auth-setup`, `pod-role-bootstrap`.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/README.md:31`: Mobile App Dev matrix includes `codex-cli-auth-setup`, `pod-role-bootstrap`.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/README.md:33`: QA/Release adds `eas-robot-auth-setup`.
- `PROJECT_ENVIRONMENT.md:262`: pod-native project bootstrap facts.
- `PROJECT_ENVIRONMENT.md:268`: project-bootstrap is status-only and does not prove live OpenClaw/external/human-gated behavior.
- `PROJECT_ENVIRONMENT.md:279`: required project MCPs and pins.
- `PROJECT_ENVIRONMENT.md:307`: headless review helper is the read-only reviewer path.
- `PROJECT_ENVIRONMENT.md:338`: `codex-preflight --pod` status-only behavior and non-claims.
- `REPO_OPERATIONS.md:76`: pod-native vs repo-local runtime boundary.
- `REPO_OPERATIONS.md:83`: OpenClaw pods operating on this Codex-managed repo must route repository work through Codex CLI and managed paths.
- `REPO_OPERATIONS.md:97`: done requires linked evidence.

## Commands Already Run

- `pnpm run validate:repo-operations`: PASS. Output: `Validated repo operations policy ownership.`
- `pnpm run validate:team-doc`: PASS. Output: `Validated current mobile-app-dev-team managed docs.`
- `pnpm run validate:project-environment`: PASS. Output: `Validated project environment fixtures.` and `Validated project environment drift checks.`
- `git status --short`: clean before evidence prompt creation.

## Review Questions

1. Is the conclusion that `codex-cli-auth-setup -> project-bootstrap` is insufficient supported by the cited SoT?
2. Is the proposed replacement order consistent with current SoT?
3. Are there any missing High/Medium findings before reporting this to the user?
