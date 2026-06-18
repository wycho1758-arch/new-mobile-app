---
name: codex-interactive-repo-work
description: Run managed WonderMove repository edits through a scoped Codex CLI interactive PTY session after codex-role-workflow routing, while preventing direct role-agent file edits, preserving $wm reviewer gates, and recording diff, validation, and handoff evidence without exposing secrets.
---

# Codex Interactive Repo Work

Runtime shape: `/workspace/skills/codex-interactive-repo-work/SKILL.md`

This pod-native OpenClaw skill is a status only execution contract for managed
repository work. It does not replace `codex-role-workflow`, `$wm`, or the
repo-local role skills. It tells the role pod how to launch and supervise a
scoped Codex CLI interactive PTY session for the already-routed work.

## Responsibility

Use this skill only after:

- `project-bootstrap` has passed or reported no role-work blocker;
- `/workspace/skills/codex-role-workflow/SKILL.md` returned `status: ready`;
- `codex-role-workflow/v1` set `codex_interactive_required: true`;
- the output points `codex_execution_contract` to
  `/workspace/skills/codex-interactive-repo-work/SKILL.md`;
- the role work has an accepted scope, owner role, allowed repo-local Codex
  skill, required reviewer, durable artifact stage, and no unresolved human gate.

If any item is missing, stop and return a status-only blocked report. Do not
edit files directly to compensate for missing routing.

## Managed Repo Boundary

The managed repo root is:

```text
/workspace/projects/Wondermove-Inc/new-mobile-app
```

The role pod must start the Codex CLI interactive PTY session from that
directory. Do not use `/workspace` as the project repo directory.

Direct role-agent file edits under the managed repo are forbidden while using
this contract. File changes for implementation work must come from the scoped
Codex CLI interactive session. The supervising role pod may inspect files, run
read-only checks, collect command output, and record evidence.

## Launch Contract

Use the configured Codex hook wrapper when it is available and compatible with
PTY interactive use:

```text
/workspace/codex-hooks/codex-run
```

If the wrapper is missing or not compatible with PTY interactive use, use raw
PTY `codex` only after recording the reason in evidence.

Required launch evidence:

- working directory;
- launcher used: `/workspace/codex-hooks/codex-run` or raw `codex`;
- wrapper fallback reason when raw `codex` is used;
- scoped prompt text or prompt file path, without secrets;
- Codex session start and stop status;
- command output with exit status when available.

Do not print auth token values, API keys, OAuth tokens, refresh tokens,
passwords, Google ADC JSON, service account JSON, database URLs, bearer tokens,
private keys, or full secret-bearing config contents.

## Prompt Contract

The role pod gives Codex a scoped instruction that includes:

- use `$wm` for the repo-scoped implementation workflow;
- follow the `codex-role-workflow/v1` routing output;
- use only the resolved repo-local Codex skill for the owner role;
- keep changes inside the approved scope and affected paths;
- write or update the narrowest eval/test/validator fixture first;
- preserve human gates, external proof boundaries, and secret safety;
- do not make unrelated refactors or metadata churn;
- run the applicable verification and capture evidence;
- leave `git diff` and `git status --short` ready for supervising review.

The prompt must not ask Codex to self-approve, merge, bypass a failed gate,
accept human-gate risk, expose secrets, or change external platform state.

## Post-Session Review

After the Codex interactive session stops, the supervising role pod must:

1. Run `git diff` for the changed paths and review the material diff.
2. Run the applicable verification from `AGENTS.md` and `$wm`.
3. Record command output with exit status under `.evidence/` or the applicable
   eval result path.
4. Obtain final read-only `.codex/agents` reviewer evidence against the approved
   plan, diff, command output, and evidence path.
5. Run `git status --short`.
6. Use the branch/PR handoff workflow. Do not push directly to `main`.
7. Do not self-approve, merge, delete the branch, or claim external proof.

If a checkpoint review fails or blocks, address it before continuing to the next
checkpoint.

## Preflight Helper

The optional helper script is:

```text
/workspace/skills/codex-interactive-repo-work/scripts/codex-interactive-preflight.sh
```

It writes a status only preflight report. It does not launch Codex interactive
mode, does not edit repository files, and does not prove live OpenClaw PTY
behavior.

## Output

Return status-only execution guidance with:

- `schema: codex-interactive-repo-work/v1`;
- `status: ready | blocked`;
- `managed_repo_root`;
- `launcher_preference`;
- `launcher_used_or_required`;
- `wrapper_fallback_reason`;
- `scope_source`;
- `required_reviewer`;
- `evidence_path`;
- `blocked_reason` when blocked;
- `secret_safety_statement`;
- `external_proof_boundary`.

Local source validation cannot prove live OpenClaw pod execution, PTY behavior,
GitHub branch protection, EAS, mobile-mcp, store submission, production
readiness, or any other external platform state.
