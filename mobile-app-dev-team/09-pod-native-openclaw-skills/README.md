# Pod-Native OpenClaw Skills

This folder is source-only documentation for pod-native OpenClaw skills whose runtime shape is:

```text
/workspace/skills/<slug>/SKILL.md
```

Do not place repo-local Codex CLI artifacts here. Codex CLI native skills and agents belong under `.agents/skills/<skill-name>/SKILL.md` and `.codex/agents/<agent-name>.toml`.

## Current Skills

| Skill | Runtime Shape | Purpose |
| --- | --- | --- |
| `codex-cli-auth-setup` | `/workspace/skills/codex-cli-auth-setup/SKILL.md` | Install, verify, and run Codex CLI readiness checks in an OpenClaw agent pod without exposing secrets. |
| `pod-role-bootstrap` | `/workspace/skills/pod-role-bootstrap/SKILL.md` | Resolve the role pod identity, align pnpm to the repo pin, install the repo, run `codex-preflight --pod`, and write a status-only readiness report. |
| `project-bootstrap` | `/workspace/skills/project-bootstrap/SKILL.md` | Orchestrate project-level boram pod readiness by checking the repo path, managed path, required pod skills, required/conditional MCPs, external CLI/account status, role-specific setup reports, and human gates without exposing secrets. |
| `eas-robot-auth-setup` | `/workspace/skills/eas-robot-auth-setup/SKILL.md` | Verify QA/Release EAS CLI and Expo robot auth readiness as status only before any human-gated EAS/Maestro run. |
| `stitch-adc-setup` | `/workspace/skills/stitch-adc-setup/SKILL.md` | Verify Design Google ADC and Stitch MCP readiness as status only before any approved Stitch handoff run. |

## Per-Role Required Pod Skills

This is the canonical per-role pod-native skill matrix. `04-skills-and-agents-matrix.md`
links here instead of duplicating the table.

| Operating Role | Required pod-native skills |
| --- | --- |
| Product/Planning | `codex-cli-auth-setup`, `pod-role-bootstrap` |
| Design | `codex-cli-auth-setup`, `pod-role-bootstrap`, `stitch-adc-setup` |
| Mobile Architect | `codex-cli-auth-setup`, `pod-role-bootstrap` |
| Mobile App Dev | `codex-cli-auth-setup`, `pod-role-bootstrap` |
| Backend/API Integrator | `codex-cli-auth-setup`, `pod-role-bootstrap` |
| QA/Release | `codex-cli-auth-setup`, `pod-role-bootstrap`, `eas-robot-auth-setup` |
