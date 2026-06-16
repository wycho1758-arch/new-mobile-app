# Pod-Native OpenClaw Skills

This folder is source-only documentation for pod-native OpenClaw skills whose runtime shape is:

```text
/workspace/skills/<slug>/SKILL.md
```

Do not place repo-local Codex CLI artifacts here. Codex CLI native skills and agents belong under `.agents/skills/<skill-name>/SKILL.md` and `.codex/agents/<agent-name>.toml`.

## Start Here

Normal user-facing setup after clone or pull starts from `openclaw-pod-skills-sync`, then `project-bootstrap`. The other common setup
skills remain dependency/internal setup contracts that `project-bootstrap` uses
for secret-safe checks and reusable readiness reports. Invoke
`codex-cli-auth-setup` or `pod-role-bootstrap` directly only for advanced recovery paths
or focused diagnostics.

After `project-bootstrap` completes or reports a translated blocker with a next
action, read the matching role runtime specification in this folder before role
work starts:

| Operating Role | Runtime specification |
| --- | --- |
| Product/Planning | `product-planning-agent-runtime-spec.md` |
| Design | `design-agent-runtime-spec.md` |
| Mobile Architect | `mobile-architect-agent-runtime-spec.md` |
| Mobile App Dev | `mobile-app-dev-agent-runtime-spec.md` |
| Backend/API Integrator | `backend-api-integrator-agent-runtime-spec.md` |
| QA/Release | `qa-release-agent-runtime-spec.md` |

Then apply `/workspace/skills/codex-role-workflow/SKILL.md` to resolve the
allowed repo-local skill, reviewer, durable artifact stage, stop conditions, and
next action for that bootstrapped role.

When setup is blocked, pod agents must give a user-understandable result instead
of raw blocker names. The result must explain what happened, what the agent can
still do with local CLI/browser/computer-use/MCP tools, the minimum request/action
needed from the user, and how the agent continues afterward. Use
`project-bootstrap/references/blocker-resolution-guide.md` for the detailed
translation table.

## Current Skills

| Skill | Runtime Shape | Purpose |
| --- | --- | --- |
| `openclaw-pod-skills-sync` | `/workspace/skills/openclaw-pod-skills-sync/SKILL.md` | Copy-sync the repo SoT pod-native skills into the `/workspace/skills` runtime snapshot and verify the clone/pull setup rule before `project-bootstrap`. |
| `codex-cli-auth-setup` | `/workspace/skills/codex-cli-auth-setup/SKILL.md` | Verify Codex CLI readiness and, after explicit approval, install or update Codex CLI in an OpenClaw agent pod without exposing secrets. |
| `pod-role-bootstrap` | `/workspace/skills/pod-role-bootstrap/SKILL.md` | Resolve the role pod identity, align pnpm to the repo pin, install repo dependencies only after explicit approval, run `codex-preflight --pod`, and write a status-only readiness report. |
| `project-bootstrap` | `/workspace/skills/project-bootstrap/SKILL.md` | Orchestrate project-level boram pod readiness by checking the repo path, managed path, required pod skills, required/conditional MCPs, external CLI/account status, role-specific setup reports, and human gates without exposing secrets. |
| `eas-robot-auth-setup` | `/workspace/skills/eas-robot-auth-setup/SKILL.md` | Verify QA/Release EAS CLI and Expo robot auth readiness as status only before any human-gated EAS/Maestro run. |
| `stitch-adc-setup` | `/workspace/skills/stitch-adc-setup/SKILL.md` | Verify Design Google ADC and Stitch MCP readiness as status only before any approved Stitch handoff run. |
| `codex-role-workflow` | `/workspace/skills/codex-role-workflow/SKILL.md` | Resolve a role pod to allowed repo-local Codex skills, reviewers, durable artifact stage, stop conditions, and status-only next action without doing role work. |

## Per-Role Required Pod Skills

This is the canonical per-role pod-native skill dependency matrix.
`runtime-sources/codex-skill-agent-matrix.md` links here instead of duplicating the table.
It is not the normal user-facing execution order; normal setup uses
`openclaw-pod-skills-sync`, then `project-bootstrap` as the entry point.
The matrix below lists role-specific required skills after the common sync
prerequisite.

| Operating Role | Required pod-native skills |
| --- | --- |
| Product/Planning | `codex-cli-auth-setup`, `pod-role-bootstrap`, `codex-role-workflow` |
| Design | `codex-cli-auth-setup`, `pod-role-bootstrap`, `stitch-adc-setup`, `codex-role-workflow` |
| Mobile Architect | `codex-cli-auth-setup`, `pod-role-bootstrap`, `codex-role-workflow` |
| Mobile App Dev | `codex-cli-auth-setup`, `pod-role-bootstrap`, `codex-role-workflow` |
| Backend/API Integrator | `codex-cli-auth-setup`, `pod-role-bootstrap`, `codex-role-workflow` |
| QA/Release | `codex-cli-auth-setup`, `pod-role-bootstrap`, `eas-robot-auth-setup`, `codex-role-workflow` |
