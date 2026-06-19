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

Use this skill only after this non-skippable pre-launch gate is complete:

- `project-bootstrap` has passed or reported no role-work blocker;
- the `codex-role-workflow/v1` routing artifact path is recorded;
- the routing artifact has `status: ready`;
- `codex-role-workflow/v1` set `codex_interactive_required: true`;
- the output points `codex_execution_contract` to
  `/workspace/skills/codex-interactive-repo-work/SKILL.md`;
- the routing artifact records the resolved role, allowed repo-local Codex
  skill, actual `required_reviewers`, durable artifact stage, and human gate
  state.

The routing artifact is the source of truth for allowed skill and reviewer
selection. If any item is missing, Codex launch is forbidden and the only output
is a status-only blocked report. Do not edit files directly to compensate for
missing routing.

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

## Workboard And Wake Guard

Before Codex launch, a Workboard card, claim, or equivalent work ownership guard
must exist for the bounded work. Register a wake guard before launch and keep it
active until a complete commit or PR handoff is ready.

Record the Workboard card or claim id, wake guard id, Codex PTY task label, and
evidence path. If work is not complete when a wake fires, register the next wake
guard with a 5 minute larger interval: `+5m`, `+10m`, `+15m`, `+20m`, and so on.

If the Workboard or wake guard cannot be registered, do not launch Codex. Return
a blocked status with the missing guard and evidence path.

## Project-Management Source Of Truth

Before Codex launch, resolve any project-management source of truth that exists
for the bounded work: Tasks task, Jira issue, or Confluence page.

If a Tasks, Jira, or Confluence source exists, record its id or link in the
Workboard guard, Codex prompt, and evidence path. For work larger than a quick
local fix, if no Tasks task exists, create one with the Tasks skill or request
one before Codex execution. Do not invent Jira or Confluence records without
authorization.

Workboard is an execution guard and wake tracker, not a replacement for Tasks,
Jira, or Confluence. Confluence is the source of truth for PRD, design,
decision, and procedure records; Tasks and Jira should link to it instead of
duplicating long text.

Commit or PR handoff must update the relevant Tasks or Jira record with the PR
URL, validation, reviewer evidence, and residual risks when such records exist.
Preserve human gates, secret safety, and external-proof boundaries.

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
- Workboard card or claim id;
- wake guard id and active interval;
- launcher used: `/workspace/codex-hooks/codex-run` or raw `codex`;
- wrapper fallback reason when raw `codex` is used;
- Codex PTY title or task label;
- scoped prompt text or prompt file path, without secrets;
- Codex session start and stop status;
- command output with exit status when available.

Do not print auth token values, API keys, OAuth tokens, refresh tokens,
passwords, Google ADC JSON, service account JSON, database URLs, bearer tokens,
private keys, or full secret-bearing config contents.

## Prompt Contract

The role pod gives Codex a scoped instruction that includes:

- literally invoke `$wm` or `/wm` for the repo-scoped implementation workflow;
- reference the recorded `codex-role-workflow/v1` routing artifact path;
- state whether the work is a specific-goal session or a progressive-improvement loop;
- for a specific-goal session, set the bounded target with the supported `/goal`
  command;
- for a progressive-improvement loop, name the loop objective and checkpoints
  without replacing the required `$wm` planning and review sequence;
- name the allowed repo-local Codex skill from the routing artifact;
- name the actual `required_reviewers` from the routing artifact;
- keep changes inside the approved scope and affected paths;
- write or update the narrowest eval/test/validator fixture first;
- preserve human gates, external proof boundaries, and secret safety;
- do not make unrelated refactors or metadata churn;
- run the applicable verification and capture evidence;
- state that final read-only reviewer evidence from the actual
  `required_reviewers` is mandatory before Done or PR handoff;
- leave `git diff` and `git status --short` ready for supervising review.

The prompt must not ask Codex to self-approve, merge, bypass a failed gate,
accept human-gate risk, expose secrets, or change external platform state.

## Codex PTY Operations

Each Codex PTY must have a distinguishable title or task label and evidence
path. Use `/goal` only when the session is pursuing a specific bounded target;
the `/goal` must name the smallest approved work unit and must not broaden
scope. For progressive improvement work, use an explicit loop objective and
checkpoint list instead of treating `/goal` as the loop itself.

If new bounded work appears while Codex is already working, do not idle waiting
on the old PTY when the new work can proceed independently. Launch a separate
titled Codex PTY for the new bounded work, up to a maximum of 3 concurrent PTYs.
Close finished PTYs promptly to preserve Codex context and operator attention.

Concurrent PTYs do not relax scope, reviewer, human gate, external proof, or
secret safety rules. Each PTY must keep its own routing artifact, Workboard
claim, wake guard, goal or loop objective, reviewer evidence, validation
output, and evidence path.

## Goal And Loop Semantics

Use `/goal` for work with one specific bounded target. Use a loop for
progressive improvement work with repeated checkpoints. Do not collapse these
concepts into each other.

Both specific-goal and progressive-loop work must plan and execute the same
required repo workflow:

1. Check the current source of truth and routing artifact.
2. Invoke `$wm` or `/wm` and include its plan in the session plan.
3. Identify the allowed repo-local role skill and required reviewers from the
   routing artifact.
4. Put tests, evals, validators, or other verification before implementation.
5. Make the minimal scoped change.
6. Inspect `/diff` for the changed paths.
7. Obtain required checkpoint reviewer evidence.
8. Continue the next bounded loop iteration, or prepare commit or PR handoff.

For a specific-goal session, set `/goal` after the SoT check and before the
`$wm` plan. The goal must describe the smallest approved target.

For progressive improvement work, define the loop objective, checkpoint, and
stop condition before invoking `$wm`. Each iteration still follows the required
plan, verification, minimal-change, `/diff`, and reviewer sequence above.

## Post-Session Review

After the Codex interactive session stops, the supervising role pod must:

1. Run `git diff` for the changed paths and review the material diff.
2. Run the applicable verification from `AGENTS.md` and `$wm`.
3. Record command output with exit status under `.evidence/` or the applicable
   eval result path.
4. Obtain final read-only `.codex/agents` reviewer evidence from each actual
   reviewer listed in the routing artifact `required_reviewers`. Supervising
   validation is not a substitute. Each required reviewer must check the
   approved plan, diff, validation output, and evidence path.
5. Run `git status --short`.
6. Use the branch/PR handoff workflow. Do not push directly to `main`.
7. Do not self-approve, merge, delete the branch, or claim external proof.

If a checkpoint review fails or blocks, address it before continuing to the next
checkpoint.

Supported review evidence path:

```text
node scripts/codex-headless-review.mjs --json-envelope --agent <reviewer-from-codex-role-workflow-required_reviewers> --prompt <review-request-file> --out <evidence-file>
```

`<reviewer-from-codex-role-workflow-required_reviewers>` must be read from the
recorded routing artifact for the actual resolved role. Do not choose a reviewer
from supervisor preference, examples, or a fixed default.

PR or handoff evidence must include at minimum:

- routing artifact path;
- Codex prompt path or prompt text evidence path;
- changed paths;
- validation commands and outputs with exit status;
- reviewer evidence path for each required reviewer;
- reviewer verdict for each required reviewer;
- residual risks and external proof limits.

Before commit or PR handoff, run a supervisor self-audit. If routing, literal
`$wm` or `/wm` prompt invocation, validation output, or evidence from every
required reviewer is missing, the work is blocked unless an explicit human
override is recorded with scope, reason, owner, and timestamp.

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
- `routing_artifact_path`;
- `workboard_card_or_claim_id`;
- `wake_guard_id`;
- `wake_guard_interval`;
- `codex_pty_title_or_task_label`;
- `allowed_repo_local_codex_skill`;
- `required_reviewers`;
- `durable_artifact_stage`;
- `human_gate_state`;
- `evidence_path`;
- `reviewer_evidence_paths`;
- `reviewer_verdicts`;
- `residual_risks`;
- `blocked_reason` when blocked;
- `secret_safety_statement`;
- `external_proof_boundary`.

Local source validation cannot prove live OpenClaw pod execution, PTY behavior,
GitHub branch protection, EAS, mobile-mcp, store submission, production
readiness, or any other external platform state.
