# Repo-local git-workflow Skill Implementation Plan

Date: 2026-06-12
Repo: `/Users/tw.kim/Documents/AGA/test/new-mobile-app`
Target: `.agents/skills/git-workflow/SKILL.md`

## Decision

`git-workflow` is a repo-local Codex skill, not an external OpenClaw or Claude skill.
All pod agents are expected to use Codex, so the active runtime artifact belongs under
`.agents/skills/git-workflow/`.

## Verified SoT

- `AGENTS.md`: Codex skill or agent requests use `.agents/skills/<skill-name>/SKILL.md`; TDD and branch/PR rules apply.
- `.agents/skills/wm/SKILL.md`: non-trivial runtime work needs SoT-grounded planning, pre-implementation review, TDD, final review, and evidence.
- `.codex/config.toml`: repo MCP runtime includes pinned `mobile-mcp`, `serena`, and `stitch`.
- `.codex/hooks.json`: runtime hooks cover SessionStart, PreToolUse, PostToolUse, and Stop.
- `.codex/agents/wm-implementation-reviewer.toml`: xhigh review can be performed through `wm-implementation-reviewer`.
- `scripts/validate-runtime-artifacts.mjs`: every `.agents/skills/<slug>/SKILL.md` must have frontmatter with matching `name`, non-empty `description`, and <=500 lines; skill eval prompts are validated when present.
- `scripts/test-local-harness.mjs`: `.agents/skills` slugs must be present in `evals/local-harness/sot/snapshot.json` `skillTaxonomy.allowedNativeDevSkills`.
- `mobile-app-dev-team/04-skills-and-agents-matrix.md`: active repo-local skills are documented as directories under `.agents/skills/<slug>/SKILL.md`.
- `PROJECT_ENVIRONMENT.md`: Codex runtime changes must keep the root runtime SoT in sync, including repo skill inventory and runtime skill behavior.

## Scope

Add a repo-local `git-workflow` skill for Codex agents that need to manage local branch, commit, PR, reviewer, approval, issue, and completion workflows without bypassing WonderMove gates.

Expected files:

- `.agents/skills/git-workflow/SKILL.md`
- `evals/skills/git-workflow/positive.prompt.md`
- `evals/skills/git-workflow/negative.prompt.md`
- `evals/skills/git-workflow/review-only-negative.prompt.md`
- `evals/skills/git-workflow/unsafe-main-push-negative.prompt.md`
- `evals/skills/git-workflow/self-approval-negative.prompt.md`
- `evals/skills/git-workflow/issue-mutation-negative.prompt.md`
- `evals/local-harness/sot/snapshot.json`
- `scripts/validate-runtime-artifacts.mjs`
- `mobile-app-dev-team/04-skills-and-agents-matrix.md`
- `PROJECT_ENVIRONMENT.md`

No `.codex/agents` change is expected because existing reviewers already cover implementation and gate review.

## TDD Plan

1. Add executable runtime validator assertions before the skill implementation in `scripts/validate-runtime-artifacts.mjs`:
   - require `.agents/skills/git-workflow/SKILL.md` once this feature is introduced;
   - require safety terms for no direct push to `main`, no unauthorized force-push, no self-approval, no failed-gate pass-through, no issue mutation without authorization, and no merge/delete branch in `complete`;
   - require the dedicated `git-workflow` eval fixtures listed below.
2. Add eval prompt fixtures before the skill implementation:
   - positive fixture explicitly triggers `$git-workflow`;
   - negative fixture does not explicitly trigger `$git-workflow`;
   - review-only-negative fixture describes read-only review and `do not edit` behavior.
   - unsafe-main-push fixture requires refusal of direct `main` push and unauthorized force-push;
   - self-approval fixture requires refusal of self-approval and failed-gate pass-through;
   - issue-mutation fixture requires explicit authorization before creating, closing, assigning, or labeling issues.
3. Add `git-workflow` to `allowedNativeDevSkills` before adding the skill directory so local harness slug registry accepts it.
4. Add the skill implementation with concise frontmatter and body under 500 lines.
5. Update `PROJECT_ENVIRONMENT.md` so the Codex runtime SoT lists `$git-workflow` and its boundary.
6. Update the active skill matrix so `validate-team-doc` can find the active repo-local skill in the managed matrix.

## Skill Contract

The skill must:

- apply only when explicitly invoked as `$git-workflow` or `/git-workflow`, or when a task explicitly asks a Codex agent to perform repo Git workflow operations;
- keep implementation inside the current repo and never modify external runtime/platform repositories from this repo;
- require preflight checks before git operations: current branch, dirty worktree, upstream/remotes, recent main/base sync, identity, and auth status where needed;
- require tests/evidence before commit when the task includes implementation or runtime changes;
- use Conventional Commits and preserve the branch + PR workflow;
- forbid direct push to `main`, force-push without explicit human approval, self-approval, marking failed gates as passed, merge after self-review, branch deletion during `complete`, and issue mutation without explicit authorization;
- route review-only, approval, failed-gate, and ambiguous human-gate decisions to the relevant read-only reviewer or human gate;
- distinguish local validation from live GitHub/Jira/Confluence/EAS/OpenClaw proof;
- document process modes: `preflight`, `start`, `sync`, `commit`, `pr`, `review-status`, `issue`, `handoff`, and `complete`.

## Verification

Required:

- `pnpm run test:runtime`
- `pnpm turbo run lint test`
- `pnpm run test:local-harness`
- `node scripts/test-local-harness.mjs --self-test --stage structure`
- `node scripts/test-local-harness.mjs --stage structure --json`

If Codex preflight, workspace dependencies, or unrelated existing changes prevent a required command from running or passing, the run must be reported as `BLOCKED` with command output and source-backed reason. Do not downgrade required PR gates to best effort and do not claim PR readiness without these required gates passing.

## Review Gates

Pre-implementation:

- Run `wm-implementation-reviewer` against this plan.
- Evidence paths:
  - `.evidence/wm/20260612-repo-local-git-workflow-plan-review.md`
  - `.evidence/wm/20260612-repo-local-git-workflow-plan-review-r2.md`
  - `.evidence/wm/20260612-repo-local-git-workflow-plan-review-r3.md`
- Proceed only on `GO`, or if findings are addressed.

Final:

- Run `wm-implementation-reviewer` against the final diff, commands, and evidence.
- Evidence paths:
  - `.evidence/wm/20260612-repo-local-git-workflow-verification.md`
  - `.evidence/wm/20260612-repo-local-git-workflow-final-review.md`
- Do not report Done without the final review result.

## Known Risks

- Current worktree contains unrelated user changes; implementation must not revert them.
- `pnpm run test:local-harness` starts with an advisory clean-tree guard; dirty tree alone is not expected to fail unless the guard is run with `--enforce`, but later preflight, dependency, or unrelated-change gates may still block the full harness.
- Live PR creation, approval, issue mutation, and branch protection behavior cannot be proven by local validators; the skill must present them as external-platform operations requiring appropriate auth and evidence.
