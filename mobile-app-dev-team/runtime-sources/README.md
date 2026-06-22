# Runtime Sources

`mobile-app-dev-team/runtime-sources/` is the repository source of truth for
OpenClaw role-pod operating material. Files here are edited source-first, then
materialized into runtime locations such as `/workspace/skills`,
`/workspace/AGENTS.md`, `/workspace/WORKFLOW.md`, `/workspace/HEARTBEAT.md`,
`/workspace/TOOLS.md`, and `/workspace/ORGANIZATIONS.md` by the approved sync
flow.

Do not hand-edit generated runtime copies to make durable changes. Update the
repo source here, validate it, and rerun the sync process for the target role.

## Folder map

| Path | Definition |
| --- | --- |
| `agents/` | Role-specific `AGENTS.md` addenda materialized to `/workspace/AGENTS.md` for each pod. |
| `dreams/` | Role or project ideation/reference material that is not runtime policy by itself. |
| `harnesses/` | Repo-authored executable proof/validation harnesses copied into runtime harness locations when supported. |
| `heartbeat/` | Role-specific continuity and heartbeat handling addenda materialized to `/workspace/HEARTBEAT.md`. |
| `organizations/` | Shared organization, reporting, routing, review, escalation, and approval-boundary guidance. |
| `role-souls/` | Role identity/persona source material used to shape role-specific operating context. |
| `skills/` | Approved pod-native OpenClaw skills copied into `/workspace/skills`. |
| `skills-candidate/` | Candidate or proposed pod-native skills that are not live runtime skills until reviewed and promoted. |
| `tools/` | Role-specific tool-use addenda materialized to `/workspace/TOOLS.md`. |
| `workflows/` | Role-specific workflow procedures materialized to `/workspace/WORKFLOW.md`. |

## Top-level reference files

| File | Definition |
| --- | --- |
| `codex-skill-agent-matrix.md` | Reference matrix for Codex skills and agent/role relationships. |
| `orbstack-pod-config-values.md` | Reference values for OrbStack pod configuration. |
| `pod-environment-bootstrap.md` | Bootstrap reference for preparing role-pod environments. |

## Update guidance

- Keep this README concise and structural. Put detailed role procedures in the
  relevant role workflow or skill.
- Do not store secrets, credentials, tokens, private endpoints, or environment
  dumps in this tree.
- Use role names for durable rules. Avoid individual-name hardcoding except in
  crosswalk metadata or human-readable status reports where explicitly needed.
- Preserve the boundary between repo source and generated runtime files: source
  changes belong here; runtime copies are proof of sync, not durable source.
- When adding, removing, or repurposing a top-level folder, update this README
  in the same source-first change.
