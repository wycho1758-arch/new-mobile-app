---
name: workspace-operating-files-pinpoint-audit
description: Audit workspace operating rules from real process failures, then propose or apply narrow fixes through reviewed paths.
---

# workspace-operating-files-pinpoint-audit

## Purpose
Use this candidate skill when the user asks to improve workspace or role
operating files based on recent process failures, complaints, reporting misses,
blocked-work handling, silence, continuity issues, or Chatroom delivery errors.

This is a candidate only. Do not install or promote it into live pod-native
OpenClaw skills without separate review and approval.

## Procedure

1. Confirm scope and reporting destination. If the request came from a Room,
   report user-visible status to that Room.
2. Create or update Workboard tracking when the audit spans multiple files,
   tools, turns, or external reviewer input.
3. Gather evidence before judging: current operating files, durable memory when
   prior preferences or decisions are involved, and current Workboard/Task/PR or
   room sources of truth.
4. Classify failures narrowly:
   - Room transport mistaken for completion
   - Workboard/Task/local note mistaken for Chatroom report
   - blocked treated as endpoint
   - continuity, wake-guard, Task, or Stop-hook signal dismissed as stale
   - docs-only PR merge confused with release/live/human-gated action
   - status reported without current SoT re-check
5. Audit each target file for the smallest rule that would prevent the real
   failure. Avoid broad rewrites and avoid weakening human gates, approval
   boundaries, secret safety, or role ownership.
6. Apply only justified pinpoint fixes:
   - workspace files may be patched when the user requested action and the file
     is writable;
   - repo-tracked files use PR/review path;
   - candidate skills stay under a candidate/proposed-only path until approved.
7. Validate with appropriate lightweight checks and preserve exact meaningful
   failures.
8. Report changed files, proposed-only files, validation, Workboard card, PR or
   candidate skill path, remaining risks, and next decisions to the agreed Room.

## Safety

- A successful Room send is transport only, not work completion.
- `blocked` is not done; record owner, reason, next action, and follow-up or
  wake condition.
- Do not infer completion from stale or ambiguous continuity. Re-check current
  sources of truth.
- Do not perform live/auth/external/destructive/release/production actions,
  dependency install, secret/env output, or failed-gate risk acceptance without
  explicit approval.
