# OpenClaw Git Workflow Goal Execution Plan

Date: 2026-06-12
Mode: `$wm` planning-only
Reviewer required: `wm-implementation-reviewer` with xhigh scrutiny
Goal execution target: a future goal-skill run that implements and verifies the plan

## 1. Objective

Create or revise `git-workflow` so OpenClaw pod agents generated from
`mobile-app-dev-team/02-role-souls` can perform repository work through a
WonderMove-specific Git process:

- start work from a role/work-unit context,
- make commits only after evidence exists,
- open or update PRs without self-approval,
- route review/approval status,
- classify issues without uncontrolled Jira/GitHub mutation,
- report external-platform limits honestly,
- prove integration with repo-local `.codex` and `.agents/skills` behavior.

This plan is written so a future goal-skill execution can run it phase by phase.

## 2. Current Planning Decision

The desired implementation target is outside the current repo:

```text
/Users/tw.kim/Documents/AGA/test/openclaw-cloud/.claude/skills/git-workflow
```

The current repo SoT says agents must not modify external platform/runtime
repositories from this repository. Therefore implementation requires one of:

- explicit user approval to edit the external `openclaw-cloud` path from this
  run, or
- running the implementation from the `openclaw-cloud` repository context, or
- a Product/Planning decision to author a mirrored pod-native source skill under
  `new-mobile-app/mobile-app-dev-team/09-pod-native-openclaw-skills/git-workflow`
  and then publish/register it to OpenClaw.

Until one of those is chosen, this plan is implementation-ready but human-gated.

## 3. Source Of Truth Used

Root policy and runtime:

- `AGENTS.md`: pod-native skill runtime shape, TDD, no direct push to `main`,
  branch + PR, runtime gates, external repo boundary.
- `REPO_OPERATIONS.md`: OpenClaw/Codex operational boundary, Codex-managed path
  registry, default `/workspace/new-mobile-app/`, redacted status reporting,
  evidence requirement, external-platform non-claims.
- `PROJECT_ENVIRONMENT.md`: `$wm` planning/review contract, read-only reviewer
  routing, required MCP pins, work-unit resolver, pod preflight, headless review
  helper, repo-local proof limits.

Repo-local Codex runtime:

- `.codex/config.toml`: required MCP servers `mobile-mcp`, `serena`, `stitch`
  with pinned versions.
- `.codex/hooks.json` and `.codex/hooks/*.mjs`: pretool, posttool, session, and
  stop advisory hooks that must stay compatible with the Git workflow.
- `.codex/agents/*.toml`: read-only reviewers/researchers/advisors, especially
  `wm-implementation-reviewer`, `wm-contract-reviewer`, `wm-docs-researcher`,
  `wm-gate-fix-advisor`, `po-planning-reviewer`, `po-scope-gate-reviewer`,
  `po-docs-researcher`, `design-reviewer`, and `design-researcher`.
- `.agents/skills/*.md`: repo-local workflows for `$wm`, `wm-orchestrate`,
  Mobile App Dev, Backend/API, Product/Planning, Design, QA/Release, E2E, and
  Railway.

Role sources:

- `mobile-app-dev-team/02-role-souls/product-planning-soul.md`: scope owner,
  human-gate router, work-unit/status owner.
- `mobile-app-dev-team/02-role-souls/mobile-app-dev-soul.md`: tests-first,
  PR-ready diff, evidence, reviewer, no self-approval.
- `mobile-app-dev-team/02-role-souls/qa-release-soul.md`: objective evidence,
  release proof classification, failure routing.
- `mobile-app-dev-team/02-role-souls/backend-api-integrator-soul.md`,
  `design-soul.md`, and `mobile-architect-soul.md`: ownership boundaries that
  Git workflow must not collapse.

Pod-native skills:

- `mobile-app-dev-team/09-pod-native-openclaw-skills/codex-cli-auth-setup`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/pod-role-bootstrap`
- role-specific `stitch-adc-setup` and `eas-robot-auth-setup` for Design and
  QA/Release.

Existing external skill shape:

- `openclaw-cloud/.claude/skills/git-workflow/SKILL.md`
- `openclaw-cloud/.claude/skills/git-workflow/evals.json`
- `openclaw-cloud/.claude/skills/git-workflow/rules/naming-conventions.md`
- `openclaw-cloud/.claude/skills/git-workflow/rules/workflows/*.md`

Serena:

- Serena MCP bounded pattern search was used for `.codex` and work-unit/status
  references. The `initial_instructions` tool was not exposed in the current
  discovered Serena tool list, so this is recorded as a degraded lookup path.

## 4. Desired Skill Contract

The revised `git-workflow` must be a WonderMove/OpenClaw pod workflow, not a
generic GitFlow helper.

### Modes

1. `preflight`
   - Verify `WM_ROLE` or `/workspace/IDENTITY`.
   - Verify repo path, current branch, upstream, dirty status, git identity.
   - Verify `/workspace/CODEX_MANAGED_PATHS.md` contains the active repo path.
   - Verify pod bootstrap report exists and is ready when in pod mode.
   - Verify `gh auth status` as redacted status only.
   - Never print tokens, full auth JSON, `.env`, or secret-bearing config.

2. `start <work-unit-id|issue-key> <work-type>`
   - Read `docs/plans/work-units/<id>/status.json` when available.
   - Resolve next allowed role action through `wm-orchestrate` or
     `node scripts/work-unit-next.mjs`.
   - Block role mismatch, pending human gate, pending reviewer, failed reviewer,
     or blocked gate.
   - Create or recommend a branch from the allowed base only.
   - Include work-unit or issue key in the branch name.

3. `sync`
   - Fetch remote state.
   - Dry-run merge or rebase before applying.
   - Report conflict impact by path, role/stage, owner, and evidence risk.
   - Do not auto-resolve destructive conflicts.

4. `commit`
   - Block on `main`.
   - Require staged file review and secret-risk scan summary.
   - Require evidence references for non-doc changes.
   - Require Conventional Commit message.
   - Do not commit generated credentials, `.env`, token output, raw logs, or
     forbidden evidence paths.

5. `pr`
   - Push the current branch.
   - Create or update PR through `gh` only after local evidence is present.
   - PR body must include work-unit id, role, status stage, summary, tests,
     evidence, reviewer status, human-gate status, residual risk, and non-claims.
   - Do not merge PR or approve own PR.

6. `review-status`
   - Read PR check/review state through `gh` as status only.
   - Distinguish repo-local gates from GitHub branch protection.
   - Route failures to role owner.
   - Do not claim branch protection, Jira, Confluence, EAS, or OpenClaw platform
     proof unless live evidence exists and human authorization is recorded.

7. `issue`
   - Classify as bug-fix, failure/rework, release-evidence-gap, human-gate, or
     symptom-without-evidence.
   - Do not auto-create Jira/GitHub issues for symptoms without evidence.
   - Treat Jira mutation, GitHub issue mutation, and Confluence mutation as
     external-platform actions requiring explicit approval or approved app skill
     routing.

8. `handoff`
   - Emit handoff with owner role, input artifact, output artifact, evidence
     path, open decisions, next responsible role, and suggested status transition.
   - Do not mutate `status.json` unless explicitly requested through a validated
     resolver transition.

9. `complete`
   - Redefine as "ready for PR review or merge consideration."
   - Must not merge to `main`.
   - Must not delete or clean up the branch/worktree as a side effect.

## 5. Artifact Plan

Preferred skill structure:

```text
git-workflow/
  SKILL.md
  evals.json
  references/
    wondermove-pod-git.md
    role-stage-matrix.md
    pr-template.md
    issue-routing.md
    conflict-policy.md
    integration-test-plan.md
  rules/
    naming-conventions.md
    workflows/
      github-flow.md
      gitflow.md
      gitlab-flow.md
  scripts/
    validate-git-workflow.mjs
```

`SKILL.md` must stay concise and load detailed references only when needed.
This follows `skill-creator` guidance: frontmatter with name/description,
minimal core workflow in SKILL.md, deterministic scripts for fragile validation,
and references for detailed policy.

## 6. Phase Plan

### Phase 0: Human/Context Gate

Goal: confirm where implementation will happen.

Tasks:

- [ ] Decide execution context: external `openclaw-cloud`, repo-local
      pod-native source, or both with explicit mirror/publish flow.
- [ ] Record approval or selected context in evidence.
- [ ] Confirm whether live GitHub/Jira actions are permitted in implementation
      tests or only simulated.

Quality gate:

- [ ] No source edit starts until the context decision is recorded.
- [ ] External platform mutation remains disabled unless explicitly authorized.

### Phase 1: Baseline Inventory

Goal: capture the current runtime and integration surfaces.

Tasks:

- [ ] Inventory external `git-workflow` files and current behavior.
- [ ] Inventory `.codex/config.toml` MCP pins.
- [ ] Inventory `.codex/hooks.json` and hook scripts.
- [ ] Inventory `.codex/agents/*.toml`, separating allowed `$wm` reviewers from
      legacy `mobile-*` agents.
- [ ] Inventory `.agents/skills/*/SKILL.md`, grouping by role/workflow.
- [ ] Inventory existing evals and runtime validators:
      `evals/skills`, `evals/agents`, `evals/hooks`,
      `evals/local-harness`, `evals/work-units`.

Quality gate:

- [ ] Produce inventory summary with source refs.
- [ ] Confirm no secrets were read or printed.

### Phase 2: RED - Tests/Evals First

Goal: make the current generic workflow fail the new WonderMove requirements.

Add or update evals before SKILL.md implementation:

- [ ] `preflight` blocks without managed path.
- [ ] `preflight` blocks without ready bootstrap report in pod mode.
- [ ] `preflight` redacts token/key/secret/password-like output.
- [ ] `start WU-123 mobile-app` checks `status.json`/next-action before branch.
- [ ] `start` blocks role mismatch.
- [ ] `start` blocks pending human gate.
- [ ] `commit` blocks on `main`.
- [ ] `commit` requires evidence for non-doc changes.
- [ ] `pr` requires reviewer status and human-gate status in PR body.
- [ ] `pr` refuses to claim GitHub branch protection as proven by local gates.
- [ ] `complete` does not merge to `main`.
- [ ] `complete` does not delete or clean up branch/worktree.
- [ ] `issue` classifies symptom-without-evidence without creating tickets.
- [ ] `review-status` routes failed checks to owner without self-approval.
- [ ] `handoff` emits next-role/evidence/status suggestion without mutating
      `status.json` by default.

If a deterministic script is added:

- [ ] Add self-test fixtures for mode dispatch.
- [ ] Add branch-name normalization fixtures.
- [ ] Add PR body required-field fixtures.
- [ ] Add redaction fixtures.
- [ ] Add external-proof non-claim fixtures.

Quality gate:

- [ ] RED evidence proves old behavior is insufficient, or fixture assertions
      clearly encode the new expected behavior before implementation.

### Phase 3: GREEN - Skill Implementation

Goal: revise the skill to satisfy the tests with the smallest durable change.

Tasks:

- [ ] Rewrite `SKILL.md` mode dispatch around pod-aware modes.
- [ ] Remove or demote solo-mode direct merge from `complete`.
- [ ] Add required references and keep `SKILL.md` under a concise body.
- [ ] Preserve existing branch naming rules where compatible.
- [ ] Add work-unit/issue branch examples.
- [ ] Add PR template schema.
- [ ] Add issue routing and external-platform approval rules.
- [ ] Add conflict policy that keeps destructive conflict choices human-routed.
- [ ] Add integration test plan reference.

Quality gate:

- [ ] No mode can direct-push or merge to `main`.
- [ ] No mode can self-approve.
- [ ] No mode can treat local validation as live GitHub/Jira/Confluence/EAS proof.
- [ ] No mode prints secrets.

### Phase 4: `.codex` Integration Test Plan

Goal: prove the Git workflow works with repo-local Codex runtime surfaces.

Static checks:

- [ ] `.codex/config.toml` still pins `mobile-mcp@0.0.58`,
      `serena@v1.5.3`, and `stitch-mcp@1.3.2`; no `@latest`.
- [ ] `.codex/hooks.json` still registers SessionStart, PreToolUse,
      PostToolUse, and Stop hooks.
- [ ] Hook fixtures still pass through `pnpm run test:hooks`.
- [ ] `scripts/codex-headless-review.mjs --self-test` passes.
- [ ] Reviewer JSON envelope validation still accepts only verdict-producing
      reviewers.

Behavior checks:

- [ ] Simulated `preflight` output references Codex-managed path policy from
      pod setup.
- [ ] Simulated `commit` is compatible with pretool/posttool evidence reminders.
- [ ] Simulated `pr` package can be reviewed by `wm-implementation-reviewer`.
- [ ] Simulated failed gate can be classified by `wm-gate-fix-advisor`.

Commands:

```bash
pnpm run test:hooks
node scripts/codex-headless-review.mjs --self-test
pnpm run validate:project-environment
```

Optional, only if Codex CLI/MCP is available in the execution environment:

```bash
codex mcp list
node scripts/codex-preflight.mjs --pod --json
```

Quality gate:

- [ ] Local failures are not waived; if environment-specific, record blocker and
      owner.

### Phase 5: `.agents/skills` Integration Test Plan

Goal: prove the Git workflow coordinates with repo-local skills and role routing.

Skill routing checks:

- [ ] `$wm` still requires SoT-grounded planning, TDD, reviewer evidence, and
      branch/PR workflow.
- [ ] `wm-orchestrate` remains the resolver-backed next-action authority.
- [ ] `mobile-app-dev-workflow` remains the app implementation owner.
- [ ] `mobile-backend-api-integrator-workflow` remains contract/API owner.
- [ ] `po-*` skills remain Product/Planning-only and do not implement.
- [ ] `design-*` skills remain Stitch/design-only and do not implement app code.
- [ ] `e2e-test` and `qa-railway-workflow` remain QA evidence/release workflows.

Evals:

- [ ] Existing `evals/skills/*` prompts still pass the runtime validator.
- [ ] New `git-workflow` evals include cross-skill scenarios:
      - `$wm` planning hands off to `git-workflow start`.
      - `wm-orchestrate` blocks role mismatch before branch creation.
      - `e2e-test` evidence path is accepted by PR template.
      - `qa-railway-workflow` evidence is not treated as full mobile release
        readiness.
      - `po-*` human gate blocks PR-ready claim.
      - `design-*` P0/P1 gate missing blocks UI implementation PR claim.

Commands:

```bash
pnpm run validate:team-doc
pnpm run validate:work-units
pnpm run validate:work-unit-next
pnpm run test:local-harness
```

Quality gate:

- [ ] No skill ownership is collapsed into Git workflow.
- [ ] Git workflow only coordinates git/PR/issue state and evidence packaging.

### Phase 6: End-To-End Simulated Process Test

Goal: verify the actual process without mutating live external platforms.

Use a fixture or temporary test repository where possible.

Scenario A: Mobile App Dev happy path

- [ ] Product/Planning creates or references work-unit status.
- [ ] `git-workflow preflight` passes in simulated pod context.
- [ ] `git-workflow start WU-123 mobile-app` creates/recommends branch.
- [ ] Implementation evidence placeholder exists.
- [ ] `git-workflow commit` accepts staged non-secret changes with evidence.
- [ ] `git-workflow pr` produces a PR body with reviewer/human-gate fields.
- [ ] `wm-implementation-reviewer` reviews the package.
- [ ] `git-workflow complete` reports PR-ready and does not merge/delete.

Scenario B: Human gate

- [ ] `status.json` has pending human gate.
- [ ] `start` or `pr` blocks and reports Product/Planning/human owner.
- [ ] No branch/PR mutation occurs.

Scenario C: Failed review

- [ ] Reviewer status is failed.
- [ ] `review-status` routes to owner and blocks self-approval.

Scenario D: Issue symptom without evidence

- [ ] `issue` classifies symptom-without-evidence.
- [ ] No Jira/GitHub issue is created automatically.

Quality gate:

- [ ] Each scenario emits command output or fixture output and expected state.
- [ ] No live GitHub/Jira/Confluence/EAS mutation is required for local pass.

### Phase 7: Final Review And PR Readiness

Goal: complete review evidence and handoff.

Tasks:

- [ ] Run applicable validation commands.
- [ ] Capture `git diff` for changed paths.
- [ ] Capture `git status --short`.
- [ ] Run xhigh final review:

```bash
node scripts/codex-headless-review.mjs \
  --json-envelope \
  --agent wm-implementation-reviewer \
  --prompt <final-review-prompt> \
  --out <final-review-output>
```

- [ ] Address Critical/High/Medium findings before claiming ready.
- [ ] Package residual risks and external non-claims in final report.

Quality gate:

- [ ] Reviewer verdict is `GO`, or final report is explicitly blocked with
      owner and next action.

## 7. Required Command Matrix

Run in `new-mobile-app` when repo-local source/evals/validators are changed:

```bash
pnpm run test:runtime
pnpm run test:local-harness
pnpm turbo run lint test
```

Run for hook/runtime integration:

```bash
pnpm run test:hooks
node scripts/codex-headless-review.mjs --self-test
node scripts/work-unit-next.mjs --self-test
node scripts/validate-work-units.mjs --self-test
```

Run for project/MCP drift:

```bash
pnpm run validate:project-environment
codex mcp list
```

Run in `openclaw-cloud` if implementation happens there:

```bash
git status --short
git diff -- .claude/skills/git-workflow
# plus the new git-workflow validator/eval command added by the implementation
```

## 8. Acceptance Criteria

The future goal execution is complete only when:

- [ ] The chosen implementation context is recorded.
- [ ] Tests/evals are updated before implementation.
- [ ] `complete` cannot merge to `main`.
- [ ] `complete` cannot delete branch/worktree as a side effect.
- [ ] `commit` blocks on `main` and requires evidence for non-doc changes.
- [ ] `pr` requires reviewer and human-gate status.
- [ ] issue/Jira/GitHub mutation is never automatic from symptoms alone.
- [ ] `.codex` hooks, MCP config, and reviewer JSON envelope tests remain valid.
- [ ] `.agents/skills` role routing and ownership remain valid.
- [ ] Simulated end-to-end process scenarios pass.
- [ ] xhigh reviewer returns `GO`, or blockers are explicitly owned.

## 9. Known Risks

- External path risk: `openclaw-cloud` is outside the current repo boundary.
- Live platform risk: GitHub PRs, Jira, Confluence, branch protection, EAS, and
  pod execution cannot be proven by local validators alone.
- Environment risk: `codex mcp list` or pod preflight may fail on a non-pod local
  machine; record as environment blocker, not a source pass.
- Drift risk: if `new-mobile-app` SoT changes after this plan, rerun the
  inventory before implementation.

## 10. Reviewer Routing Record

Planning reviewer:

- Agent: `wm-implementation-reviewer`
- Question: Is this goal-execution plan SoT-aligned, integration-test complete,
  and safe to hand to a future goal-skill implementation run?
- Required evidence path:
  `.evidence/wm/20260612-openclaw-git-workflow-goal-plan-review.md`
- Impact: implementation must not start until the reviewer verdict is `GO` or
  a human decision accepts the external-context blocker.
