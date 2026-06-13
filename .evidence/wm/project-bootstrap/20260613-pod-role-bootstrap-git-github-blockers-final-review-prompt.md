# xhigh Final Review Request: project-bootstrap Git/GitHub Readiness Follow-up

You are the WonderMove implementation reviewer. Review in read-only mode.

## Scope

Implemented the approved plan for pod runtime blockers reported after running
`project-bootstrap`:

- `git-identity-missing`
- `github-auth-unavailable`
- `project-bootstrap` report showing `ready_for_bootstrap` while nested
  `pod-role-bootstrap` report is blocked

## Changed Paths

- `evals/skills/project-bootstrap-agent-setup-smoke.sh`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/references/blocker-resolution-guide.md`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/references/report-template.md`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-agent-setup.sh`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-preflight.sh`
- `mobile-app-dev-team/16-pod-environment-bootstrap.md`
- `scripts/validate-team-doc.mjs`
- `.evidence/wm/project-bootstrap/20260613-pod-role-bootstrap-git-github-blockers-plan-review-prompt.md`
- `.evidence/wm/project-bootstrap/20260613-pod-role-bootstrap-git-github-blockers-plan-xhigh.md`
- `.evidence/wm/project-bootstrap/20260613-pod-role-bootstrap-git-github-blockers-plan-xhigh.json`
- `.evidence/wm/project-bootstrap/20260613-pod-role-bootstrap-git-github-blockers-command-output.md`

## Implementation Summary

- Added RED-first smoke eval coverage for:
  - approved Git identity values configuring `git config --global`;
  - approved `WM_GIT_USER_NAME` plus `WM_GIT_USER_EMAIL` values configuring
    `git config --global`;
  - complete approved `PROJECT_BOOTSTRAP_GIT_IDENTITY_PATH` file values
    configuring `git config --global`;
  - missing approved Git identity leaving Git config unset and reporting
    `missing_approved_source`;
  - mixed Git identity sources leaving Git config unset and reporting
    `partial_approved_source`;
  - authenticated `gh` state running status-only `gh auth setup-git`;
  - unauthenticated `gh` state skipping `gh auth setup-git` and reporting
    `missing`;
  - generated blocked `pod-role-bootstrap` report surfacing as a blocked
    `project-bootstrap` report with nested status-only blocker reasons.
- Extended `project-bootstrap-agent-setup.sh` to:
  - use approved non-private Git identity sources only:
    `PROJECT_BOOTSTRAP_GIT_USER_NAME` plus `PROJECT_BOOTSTRAP_GIT_USER_EMAIL`,
    `WM_GIT_USER_NAME` plus `WM_GIT_USER_EMAIL`, or
    `PROJECT_BOOTSTRAP_GIT_IDENTITY_PATH`;
  - require a complete name/email pair from one approved source family and reject
    mixed-source identity composition;
  - avoid inventing Git author values;
  - verify authenticated `gh` state and run `gh auth setup-git` only when auth is
    already available;
  - write status labels only to `project-bootstrap-agent-setup-report.json`.
- Extended `project-bootstrap-preflight.sh` to parse an existing
  `pod-role-bootstrap` report and surface `pod-role-bootstrap blocked` when its
  nested report status is blocked.
- Updated SoT docs and validator assertions for the new contract.

## Checks Run

- Durable command-output evidence:
  `.evidence/wm/project-bootstrap/20260613-pod-role-bootstrap-git-github-blockers-command-output.md`
- `bash evals/skills/project-bootstrap-agent-setup-smoke.sh` PASS (`exit_status=0`)
- `node scripts/validate-team-doc.mjs` PASS (`exit_status=0`)
- `git diff --check` PASS (`exit_status=0`)
- `pnpm run test:local-harness` PASS (`exit_status=0`)
  - includes `pnpm run test:runtime`
  - includes `pnpm turbo run lint test`
  - ended with `local harness all passed`
- `pnpm run validate:evidence-hygiene` PASS (`exit_status=0`) after generating
  the command-output evidence artifact

## Review Questions

- Did implementation follow the xhigh-approved plan?
- Are tests/evals narrow and sufficient for this runtime contract change?
- Does the implementation avoid private material leakage and avoid inventing Git
  identity values?
- Is `github-auth-unavailable` still human/platform-owned unless existing auth is
  confirmed?
- Does nested `pod-role-bootstrap` blocked status now prevent misleading final
  `project-bootstrap` readiness?
- Are docs, validator, and reports consistent?

Return findings first and a machine-readable reviewer JSON envelope.
