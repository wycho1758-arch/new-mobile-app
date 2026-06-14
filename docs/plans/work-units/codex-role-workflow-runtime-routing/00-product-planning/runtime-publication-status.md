# Runtime Publication Status

status: blocked-external
owner: Product/Planning for procedure; human/ops for live pod mutation
input artifact: `mobile-app-dev-team/09-pod-native-openclaw-skills/codex-role-workflow/SKILL.md`
output artifact: this runtime publication status
acceptance criteria: source-managed skill is ready for publication without claiming live pod proof
evidence requirement: redacted status-only runtime publication proof or blocked reason
dependencies/blockers: live `/workspace` pod state and operator-approved publication
open decisions: whether to publish in the active pod now or wait for bootstrap/package rollout
next responsible role: human/ops owner for live pod publication

## Status

Live publication was not performed in this repo-scoped implementation.

The source-managed skill is:

```text
mobile-app-dev-team/09-pod-native-openclaw-skills/codex-role-workflow/SKILL.md
```

The intended pod runtime shape remains:

```text
/workspace/skills/codex-role-workflow/SKILL.md
```

## Runtime Path Guardrail

The skill now explicitly states that when it runs from `/workspace/skills/codex-role-workflow/SKILL.md`, repo SoT paths must be resolved from the managed project repository root, not from `/workspace/skills/codex-role-workflow`.

Standard pod path for the entry routing SoT:

```text
/workspace/projects/Wondermove-Inc/new-mobile-app/mobile-app-dev-team/19-entry-case-routing.md
```

If the managed repository root differs, the pod must use the root declared by project-bootstrap, pod-role-bootstrap, or the managed-path registry, then append:

```text
mobile-app-dev-team/19-entry-case-routing.md
```

## Blocked External Proof

Repo-local checks do not prove that `/workspace/skills/codex-role-workflow/SKILL.md` has been updated inside a live pod. That publication remains a pod/bootstrap operation and must be separately evidenced if performed.
