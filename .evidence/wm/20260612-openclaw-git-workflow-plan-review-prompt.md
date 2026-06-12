# wm plan review prompt: OpenClaw git-workflow skill

Review mode: plan.
Requested scrutiny: xhigh.
Reviewer: `wm-implementation-reviewer`.

## User Goal

Create or revise `/Users/tw.kim/Documents/AGA/test/openclaw-cloud/.claude/skills/git-workflow` so pod agents generated from `/Users/tw.kim/Documents/AGA/test/new-mobile-app/mobile-app-dev-team/02-role-souls` can work on their own PCs or pods, commit, open PRs, route approval/review, and handle issues. This is expected to differ from a generic git workflow.

This turn is planning-only. Do not edit `openclaw-cloud` source files during the review.

## SoT Inputs Read

- `AGENTS.md:5-6`: pod-native OpenClaw skills use `/workspace/skills/<slug>/SKILL.md` runtime shape and are authored in `mobile-app-dev-team/09-pod-native-openclaw-skills/<slug>/`; Codex skills/agents use `.agents/skills` and `.codex/agents`.
- `AGENTS.md:13-16`: TDD required; no direct push to `main`; no customer/secrets hardcoding; do not modify external platform/runtime repositories from this repository.
- `AGENTS.md:57-60`: local harness does not prove Jira, Confluence, GitHub branch protection, EAS, production submit, or external platform behavior.
- `AGENTS.md:89-90`: changes go through branch + PR; Codex runtime changes require local harness.
- `AGENTS.md:104-112`: PR readiness commands and applicable gates must exit 0.
- `REPO_OPERATIONS.md:78-91`: OpenClaw pod-native runtime path, Codex-only repo work policy, managed paths registry, default checkout `/workspace/new-mobile-app/`, and default Codex hook wrapper.
- `REPO_OPERATIONS.md:97-101`: Done requires linked evidence and command output with exit status.
- `REPO_OPERATIONS.md:138-142`: local validation does not prove live OpenClaw, Jira/Confluence, GitHub branch protection, or external platform state; live Confluence requires human approval.
- `PROJECT_ENVIRONMENT.md:218-225`: `$wm` planning, read-only review, and no write-capable delegation requirements.
- `PROJECT_ENVIRONMENT.md:247-257`: allowed `$wm` read-only reviewer/researcher routing.
- `PROJECT_ENVIRONMENT.md:298-303`: headless review helper and verdict JSON contract.
- `PROJECT_ENVIRONMENT.md:306-333`: work-unit status, evidence ladder, next-action resolver, preflight, and repo-local proof boundaries.
- `mobile-app-dev-team/02-role-souls/product-planning-soul.md:11-15,23-33,52-60`: Product/Planning owns executable work units, human gates, role routing, status.json, and evidence requirements.
- `mobile-app-dev-team/02-role-souls/mobile-app-dev-soul.md:11-16,30-44,56-64,100-117`: Mobile App Dev owns scoped tested PR diffs, evidence, reviewer result, no self-approval, and status stage `04-mobile-app`.
- `mobile-app-dev-team/02-role-souls/qa-release-soul.md:11-14,20-38,49-56,91-100`: QA/Release owns measurable evidence, release checks, failure routing, and human approval boundaries.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/pod-role-bootstrap/SKILL.md`: fresh pods must bootstrap role, repo checkout, managed path, pnpm, pod preflight, and redacted readiness report.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/codex-cli-auth-setup/SKILL.md`: pod repo work through Codex CLI, Codex-managed path registry, hook wrapper, auth/status-only safety.
- Existing `openclaw-cloud/.claude/skills/git-workflow/SKILL.md:19-23`: existing modes are `create`, `complete`, `pull`, `recommend`.
- Existing `openclaw-cloud/.claude/skills/git-workflow/SKILL.md:199-217`: current wm pipeline assumes feature branch + worktree-manager + dev-executor + direct complete.
- Existing `openclaw-cloud/.claude/skills/git-workflow/SKILL.md:267-319`: current complete mode can push and merge directly in solo mode, or create PR only when `PR_AUTO_CREATE` is set.
- Existing `openclaw-cloud/.claude/skills/git-workflow/SKILL.md:324-360`: pull mode does conflict dry-run and impact analysis.

Serena status: Serena MCP was available for bounded pattern lookup; `initial_instructions` was not exposed in the discovered tool list. Pattern search over `scripts` was used for `status.json`, `evidence_ladder`, `wm-next-action`, and `human-gate` references.

## Analysis

The existing `git-workflow` is a generic branch/worktree workflow. It is insufficient for WonderMove pod agents because it:

- treats `complete` as push + merge or basic PR creation, while the SoT requires branch + PR, author/reviewer separation, quality gates, and evidence before merge;
- does not model role ownership from SOUL files or the work-unit `status.json` resolver;
- does not distinguish local proof from external proof such as GitHub branch protection, Jira, Confluence, EAS, or OpenClaw behavior;
- does not enforce Codex-managed path routing for pod work;
- does not prevent self-approval or direct main pushes strongly enough;
- does not capture issue/Jira handling as planning or triage evidence with human-gate constraints;
- lacks pod readiness checks, redacted status-only auth handling, and handoff artifacts.

## Proposed Plan

### Scope

Plan a WonderMove/OpenClaw-specific `git-workflow` revision under:

- Runtime target: `/workspace/skills/git-workflow/SKILL.md` in OpenClaw/Claude runtime.
- Source target for implementation: `/Users/tw.kim/Documents/AGA/test/openclaw-cloud/.claude/skills/git-workflow`.
- Reference source: this repository's SoT under `AGENTS.md`, `REPO_OPERATIONS.md`, `PROJECT_ENVIRONMENT.md`, `.agents/skills`, `.codex/agents`, `mobile-app-dev-team/02-role-souls`, and `mobile-app-dev-team/09-pod-native-openclaw-skills`.

Implementation should not modify `new-mobile-app` source unless the work is moved into the pod-native source area `mobile-app-dev-team/09-pod-native-openclaw-skills/git-workflow` by a separate Product/Planning decision. Direct edits to `openclaw-cloud` from this repo are cross-repo runtime work and require explicit execution approval.

### Owner Role

- Product/Planning: final scope, non-goals, issue/Jira semantics, human gates.
- Mobile Architect: git/branch/repo-boundary policy shape when it affects pod architecture.
- Mobile App Dev: skill implementation and evals when the target is treated as runtime skill source.
- QA/Release: evidence checklist, release/gate proof boundaries, failure routing.
- Read-only reviewer: `wm-implementation-reviewer` for plan and final diff.

### Required Skill Shape

Revise the skill as a pod-aware workflow, not a generic GitFlow helper.

Core modes:

1. `preflight`
   - Verify role identity (`WM_ROLE` or `/workspace/IDENTITY`), repo path, Codex-managed path, git identity, `gh auth status` as redacted status only, current branch, upstream, and clean/dirty state.
   - Report only status; never print tokens or secret-bearing config.
   - Require `pod-role-bootstrap` readiness before mutating git state.

2. `start <work-unit-id|issue-key> <work-type>`
   - Read/confirm `docs/plans/work-units/<id>/status.json` when present.
   - Run or instruct `wm-orchestrate`/`scripts/work-unit-next.mjs` to verify current role is allowed.
   - Create a branch from allowed base only after preflight passes.
   - Use branch names that include work-unit or issue key when available, with lowercase hyphen normalization and max-length rules.

3. `sync`
   - Fetch and analyze remote changes.
   - Use conflict dry-run before merging/rebasing.
   - On conflict, report impact, affected role/stage, and owner; do not auto-resolve destructive conflicts.

4. `commit`
   - Require clean staged intent: show `git status --short`, staged files, and no secret-risk paths.
   - Require evidence references before commit for non-doc changes.
   - Require Conventional Commit message mapping from role/task type.
   - Block commits from `main`.

5. `pr`
   - Push current branch and create/update PR via `gh`.
   - PR body must include work-unit id, role, status stage, tests/evidence, reviewer requirement, human-gate status, residual risks, and non-claims.
   - Do not merge PR. Merge remains human/GitHub branch-protection governed.

6. `review-status`
   - Check PR checks/review state through `gh` as status-only.
   - Distinguish GitHub branch protection status from repo-local gates.
   - If review failed, route to owner; no self-approval.

7. `issue`
   - For bug/issue handling, classify as bug-fix, failure/rework, release-evidence-gap, human-gate, or symptom-without-evidence.
   - Create/comment on issues only when user/platform auth and Product/Planning scope permit it.
   - If Jira is involved, treat live Jira mutation as external platform work requiring explicit approval or use repo-approved Atlassian skill routing.

8. `handoff`
   - Produce role-to-role handoff summary with input artifact, output artifact, evidence path, open decisions, next role, and status.json transition suggestion.
   - Do not mutate `status.json` unless the target repo workflow explicitly requests `--apply-transition` and validates after writing.

9. `complete`
   - Should mean "ready for PR review/merge consideration", not "merge to main".
   - Block direct merge/delete behavior in pod/team mode.

### Required References

Keep `SKILL.md` concise and move detailed guidance into:

- `references/wondermove-pod-git.md`: Codex-managed path, pod bootstrap, hook wrapper, repo path, redaction, and non-claims.
- `references/role-stage-matrix.md`: SOUL role to status stage and allowed git actions.
- `references/pr-template.md`: PR body schema and evidence checklist.
- `references/issue-routing.md`: issue/Jira/bug triage policy and human gates.
- `references/conflict-policy.md`: sync/pull conflict dry-run and owner routing.
- `rules/naming-conventions.md`: keep existing naming rules but add work-unit/issue-key examples and role-safe prefixes.

### TDD / Evals First

Before changing `SKILL.md`, update `evals.json` with at least:

- Positive: `preflight` blocks when managed path or bootstrap report is missing.
- Positive: `start WU-123 mobile-app` creates/recommends `feature/wu-123-mobile-app` only from an allowed base.
- Positive: `commit` blocks on `main`.
- Positive: `pr` requires evidence path and reviewer/human-gate status in PR body.
- Positive: `complete` in team/pod mode does not merge to `main`.
- Positive: `issue` classifies symptom-without-evidence without creating a ticket automatically.
- Negative: secret-like env/auth output is not printed.
- Negative: Jira/Confluence/GitHub branch protection is not claimed proven by local validation.

If deterministic scripts are introduced, add shell/node self-tests for:

- branch-name normalization,
- PR body required-field validation,
- redaction of token/key/secret/password patterns,
- mode dispatch.

### Verification

For implementation in `openclaw-cloud`:

- Run any `git-workflow` eval command available in that repo, or add a local validator first.
- Run syntax checks for any scripts.
- Run `git diff -- .claude/skills/git-workflow`.

For mirrored or source-of-truth changes in `new-mobile-app`:

- `pnpm run test:runtime`
- `pnpm run test:local-harness`
- `pnpm turbo run lint test` if runtime scripts/evals are touched.
- `git status --short` and changed-path diff summary.

### Human Gates / Blockers

- Cross-repo implementation under `openclaw-cloud` is not permitted by the current `new-mobile-app` `$wm` execution boundary without explicit execution approval or running the task from the `openclaw-cloud` repository context.
- Live GitHub PR creation, PR approval, issue mutation, Jira mutation, branch protection changes, and Confluence updates are external-platform actions. The skill can guide and report status, but actual mutation requires explicit user/platform authorization and redacted evidence.
- Production submit, failed-gate risk acceptance, privacy/legal/payment/external messaging, and irreversible scope tradeoffs must be represented as human gates.

## Review Questions

1. Is this plan SoT-aligned for a WonderMove/OpenClaw pod-specific git workflow?
2. Does the plan correctly reject the current generic `complete` direct-merge behavior?
3. Are role boundaries, evidence gates, human gates, and external-platform non-claims covered?
4. Are the proposed evals sufficient to drive implementation tests-first?
5. What findings must be fixed before implementation?

## Expected Reviewer Output

Findings first, then concise decision. End with exactly one fenced JSON reviewer envelope.
