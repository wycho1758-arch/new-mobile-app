# xhigh Review Request: Project Bootstrap Archive And Final Setup Sequence

You are the WonderMove implementation reviewer. Review in read-only mode.

## Question

Confirm whether the current SoT supports this final user-facing setup order for a new computer/pod development environment:

1. Clone the repository first.
2. Run one user-facing skill: `project-bootstrap`, which performs Codex setup and overall project setup. When problems are found, it should resolve agent-owned deterministic setup issues and ask the user only for values or actions that cannot be resolved by the agent, such as credentials, account access, live approvals, or missing external/source artifacts.

Also confirm whether any current pod-native setup skills become unnecessary/archive candidates after this integration.

## Source Files To Review

- `AGENTS.md`
- `PROJECT_ENVIRONMENT.md`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/README.md`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/codex-cli-auth-setup/SKILL.md`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/pod-role-bootstrap/SKILL.md`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/eas-robot-auth-setup/SKILL.md`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/stitch-adc-setup/SKILL.md`
- `mobile-app-dev-team/16-pod-environment-bootstrap.md`
- `scripts/validate-team-doc.mjs`

## Review Criteria

- Verify that `project-bootstrap` is the standard user-facing entry point.
- Verify that `codex-cli-auth-setup` and `pod-role-bootstrap` are dependency/internal setup contracts, not normal user-facing peer steps.
- Verify whether `project-bootstrap` calls/depends on those internal skills/scripts rather than replacing their implementation contracts.
- Verify that agent-owned deterministic setup is expected to be repaired by `project-bootstrap` where possible.
- Verify that human-owned credentials, account access, live approvals, missing source artifacts, and missing pod skill artifacts remain blockers/user requests.
- Verify whether any current pod-native skill is archive-worthy now, or whether each remains active as an internal or role-specific dependency.
- Rerun read-only validation if useful.

## Required Output

Return a JSON envelope with:

- `verdict`: `GO` or `NO_GO`
- `findings`: ordered by severity with file/line references
- `archive_decision`: explicit archive keep/remove recommendation per current pod-native skill
- `final_sequence_decision`: whether the proposed final order is correct, with required caveats
- `checks_reviewed`
- `residual_risks`
- `next_action`
