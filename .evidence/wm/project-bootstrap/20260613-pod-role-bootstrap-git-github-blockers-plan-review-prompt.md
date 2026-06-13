# xhigh Review Request: project-bootstrap Follow-up Blockers

You are the WonderMove implementation reviewer. Review in read-only mode.

## User-reported Runtime Symptom

After running the updated pod-native `project-bootstrap` in a pod agent:

- `project-bootstrap` final report status is `ready_for_bootstrap`.
- The internal `pod-role-bootstrap` report is still `blocked`.
- The previous `no-valid-codex-binary` blocker is resolved; Codex binary is accepted.
- Remaining blockers:
  - `git-identity-missing`
  - `github-auth-unavailable`

## SoT Facts Already Observed

- `scripts/codex-preflight.mjs --pod` adds `git-identity-missing` when either `git config --get user.name` or `git config --get user.email` fails.
- `scripts/codex-preflight.mjs --pod` adds `github-auth-unavailable` when `gh auth status` fails.
- `project-bootstrap` preflight sets `ready_for_bootstrap` when common project/bootstrap blockers are absent; it records only `reports.pod_role_bootstrap: present | missing` and does not parse the nested `pod-role-bootstrap` report status/blockers.
- The blocker guide says Git identity is agent-owned only when an approved local handoff or org-standard source already provides the author identity; otherwise it remains human-owned because the agent must not invent an email address.
- The blocker guide says GitHub auth can be completed or verified by the agent only when local authenticated CLI state or approved mounted auth material already exists; account login and private material provisioning remain human-owned.

## Proposed Classification

1. `git-identity-missing`
   - Not private material.
   - Solvable by the pod agent if an approved identity source exists, such as pod config, local handoff file, or org-standard values.
   - Not solvable by the agent if no approved name/email source exists; the user or platform owner must provide approved non-private identity values.

2. `github-auth-unavailable`
   - Account-authority backed.
   - Solvable by the pod agent only if approved auth material or an existing authenticated `gh` state is already mounted/available.
   - Not solvable through chat-provided private values; if missing, require platform owner managed auth or a human-present interactive login.

3. `project-bootstrap ready_for_bootstrap` with `pod-role-bootstrap blocked`
   - This is not necessarily a contradiction under current implementation because `ready_for_bootstrap` means common project bootstrap preflight is ready to run deeper bootstrap.
   - It is a UX/reporting gap because the user-facing final outcome can be misread as fully ready while nested `pod-role-bootstrap` is blocked.

## Proposed Fix Plan

### Immediate Pod Resolution Plan

1. Ask the pod agent/operator for status-only details:
   - Does `git config --global --get user.name` return a value?
   - Does `git config --global --get user.email` return a value?
   - Is there an approved local handoff or pod config containing the intended Git author name/email?
   - Does `gh auth status` fail because no auth exists, auth is invalid, or auth is present but not linked to `gh`?
   - Is GitHub auth provided as existing `gh` state or another approved managed auth path? Do not include private values.

2. If approved Git identity exists, set it in the pod:
   - `git config --global user.name "<approved name>"`
   - `git config --global user.email "<approved email>"`
   - rerun `pod-role-bootstrap`.

3. If GitHub auth material already exists, verify or link it without printing private material:
   - run `gh auth status` as redacted/status-only evidence;
   - if `gh` has authenticated state, run the appropriate non-private setup such as `gh auth setup-git`;
   - rerun `pod-role-bootstrap`.

4. If GitHub auth material is absent, keep `github-auth-unavailable` as a human/platform-owner blocker:
   - request managed GitHub auth or a human-present interactive `gh auth login`;
   - do not request private values in chat.

### Repo Skill Improvement Plan

1. Add narrow eval coverage first:
   - project-bootstrap agent setup applies Git identity only when approved non-private handoff values are present;
   - missing approved identity remains blocked/status-only and does not invent values;
   - GitHub auth setup/verification runs only when authenticated state or approved mounted auth material exists and never prints private values;
   - project-bootstrap reporting distinguishes "ready for pod-role-bootstrap" from "final pod ready" or surfaces nested `pod-role-bootstrap` blocked status.

2. Extend `project-bootstrap-agent-setup.sh` narrowly:
   - read explicit approved non-private identity variables or a documented local handoff path;
   - set `git config --global user.name/user.email` only when both approved values exist and current config is missing;
   - record status labels only in `project-bootstrap-agent-setup-report.json`;
   - optionally run redacted `gh auth status` and `gh auth setup-git` when existing auth is available; do not ingest or print private material.

3. Update SoT docs and validators:
   - document the approved Git identity input path/names in `16-pod-environment-bootstrap.md`;
   - clarify that GitHub auth must be managed or human-present interactive, not pasted into chat;
   - clarify `project-bootstrap` `ready_for_bootstrap` semantics or add nested status handling for `pod-role-bootstrap` blocked reports;
   - update `scripts/validate-team-doc.mjs` assertions.

4. Verification:
   - `pnpm run test:runtime`
   - `pnpm run test:local-harness`
   - `pnpm turbo run lint test`
   - read-only xhigh final reviewer evidence before PR/merge.

## Review Questions

- Is the blocker classification SoT-correct?
- Is the immediate pod resolution plan allowed without requesting private material in chat?
- Is the repo skill improvement plan appropriately scoped and tests-first?
- Should `github-auth-unavailable` be treated as human-owned unless mounted/existing auth material is confirmed?
- Should `project-bootstrap ready_for_bootstrap` vs nested `pod-role-bootstrap blocked` be treated as a reporting/UX gap rather than a contradiction?

Return a machine-readable reviewer JSON envelope with `verdict`, `findings`, `checks_reviewed`, `residual_risks`, and `next_action`.
