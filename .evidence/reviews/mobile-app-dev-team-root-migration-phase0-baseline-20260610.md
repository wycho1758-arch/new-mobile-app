# mobile-app-dev-team Root Migration Phase 0 Baseline

Date: 2026-06-10
Scope: Phase 0 baseline and worktree isolation for `docs/plans/active/20260610-mobile-app-dev-team-root-migration-plan.md`

## Reviewer Refresh

Phase 0 reviewer(high) returned NO_GO because this baseline had become stale and
because the `team-doc` inventory command output was not recorded. This section
refreshes the baseline against the current worktree before Phase 1.

## Second Reviewer Refresh

The Phase 0 rereview also returned NO_GO because additional dirty files appeared
after the first refresh. This section refreshes the baseline again and classifies
the added Confluence and team-doc files before Phase 1.

`git status --short`:

```text
 M .agents/skills/wm/SKILL.md
 M PROJECT_ENVIRONMENT.md
 M docs/confluence/20260608-codex-expo-rn-runtime-sot-update.md
 M evals/skills/wm/positive.prompt.md
 M scripts/validate-runtime-artifacts.mjs
 M team-doc/mobile-app-dev-team/05-work-processes.md
 M team-doc/mobile-app-dev-team/06-gates-and-evidence.md
 M team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md
?? .evidence/reviews/mobile-app-dev-team-root-migration-confluence-scope-xhigh-20260610.md
?? .evidence/reviews/mobile-app-dev-team-root-migration-phase0-baseline-20260610.md
?? .evidence/reviews/mobile-app-dev-team-root-migration-plan-high-review-20260610.md
?? .evidence/reviews/mobile-template-runtime-goal-plan-review-prompt-20260610.md
?? .evidence/reviews/mobile-template-runtime-goal-plan-xhigh-20260610.json
?? .evidence/reviews/mobile-template-runtime-goal-plan-xhigh-20260610.md
?? .evidence/reviews/mobile-template-runtime-phase0-checkpoint-20260610.md
?? .evidence/reviews/mobile-template-runtime-phase0-checkpoint-review-prompt-20260610.md
?? .evidence/reviews/mobile-template-runtime-phase0-checkpoint-xhigh-20260610.json
?? .evidence/reviews/mobile-template-runtime-phase0-checkpoint-xhigh-20260610.md
?? .evidence/reviews/mobile-template-runtime-rebaseline-checkpoint-20260610.md
?? .evidence/reviews/mobile-template-runtime-rebaseline-checkpoint-rereview-prompt-20260610.md
?? .evidence/reviews/mobile-template-runtime-rebaseline-checkpoint-review-prompt-20260610.md
?? .evidence/reviews/mobile-template-runtime-rebaseline-checkpoint-xhigh-20260610.md
?? .evidence/reviews/mobile-template-runtime-rebaseline-checkpoint-xhigh-rereview-20260610.json
?? .evidence/reviews/mobile-template-runtime-rebaseline-checkpoint-xhigh-rereview-20260610.md
?? .evidence/reviews/mobile-template-runtime-rebaseline-cleanup-checkpoint-20260610.md
?? .evidence/reviews/mobile-template-runtime-rebaseline-cleanup-checkpoint-review-prompt-20260610.md
?? .evidence/reviews/mobile-template-runtime-rebaseline-cleanup-checkpoint-xhigh-20260610.md
?? docs/plans/active/20260610-mobile-app-dev-team-root-migration-plan.md
?? docs/plans/active/20260610-wm-mobile-template-runtime-goal-plan.md
?? evals/skills/wm/write-executor-negative.prompt.md
```

`git diff --stat`:

```text
 .agents/skills/wm/SKILL.md                         | 27 +++++++++++++++++-----
 PROJECT_ENVIRONMENT.md                             |  2 ++
 .../20260608-codex-expo-rn-runtime-sot-update.md   |  3 +++
 evals/skills/wm/positive.prompt.md                 |  2 +-
 scripts/validate-runtime-artifacts.mjs             | 23 ++++++++++++++++++
 team-doc/mobile-app-dev-team/05-work-processes.md  | 14 ++++++-----
 .../mobile-app-dev-team/06-gates-and-evidence.md   |  1 +
 .../13-pod-organization-e2e-improvement-plan.md    |  3 ++-
 8 files changed, 61 insertions(+), 14 deletions(-)
```

`git diff --numstat`:

```text
21	6	.agents/skills/wm/SKILL.md
2	0	PROJECT_ENVIRONMENT.md
3	0	docs/confluence/20260608-codex-expo-rn-runtime-sot-update.md
1	1	evals/skills/wm/positive.prompt.md
23	0	scripts/validate-runtime-artifacts.mjs
8	6	team-doc/mobile-app-dev-team/05-work-processes.md
1	0	team-doc/mobile-app-dev-team/06-gates-and-evidence.md
2	1	team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md
```

Updated overlapping dirty files:

- `PROJECT_ENVIRONMENT.md`: expected affected path for Phase 3 CI/local-harness
  documentation update. Existing diff is concurrent `$wm` routing work; reread
  before editing and preserve existing lines.
- `docs/confluence/20260608-codex-expo-rn-runtime-sot-update.md`: now in scope
  because reviewer(xhigh) required Confluence sync for runtime/path/gate changes.
  Existing diff is concurrent `$wm` routing documentation; preserve it.
- `team-doc/mobile-app-dev-team/05-work-processes.md`: future move-root file with
  concurrent `$wm` routing/process edits. Preserve through `git mv`.
- `team-doc/mobile-app-dev-team/06-gates-and-evidence.md`: future move-root file
  with concurrent `$wm` evidence-routing edit. Preserve through `git mv`.
- `team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md`:
  future move-root file with unrelated plan hygiene edit. Preserve through
  `git mv`.
- `docs/plans/active/20260610-mobile-app-dev-team-root-migration-plan.md`: this
  migration plan.
- `.evidence/reviews/mobile-app-dev-team-root-migration-*.md`: this migration's
  local evidence.

Dirty but not part of the current migration write set:

- `.agents/skills/wm/SKILL.md`
- `evals/skills/wm/positive.prompt.md`
- `evals/skills/wm/write-executor-negative.prompt.md`
- `scripts/validate-runtime-artifacts.mjs`
- `.evidence/reviews/mobile-template-runtime-*`
- `.evidence/reviews/mobile-template-runtime-rebaseline-cleanup-checkpoint-xhigh-20260610.md`
- `docs/plans/active/20260610-wm-mobile-template-runtime-goal-plan.md`

Refreshed hashes:

```text
187642ba4ccb2958eb946d55e02b993354771b85b699f39672ea71d5f6a6ee81  .agents/skills/wm/SKILL.md
74eec988cf6a784c9e9983b7cd77e4c9aef356e874520d904e88cb47ff781ae6  PROJECT_ENVIRONMENT.md
0eec1627effa7f9885de21c9553e3efc90b5335427e9f1cc1be37b7970fa53d2  docs/confluence/20260608-codex-expo-rn-runtime-sot-update.md
7143a5cd0aa36a00b1d1f76c9b6381370d3832e38dcda4fbcfdf88ce56e85da1  evals/skills/wm/positive.prompt.md
c198104086ef50255dcb53a791dec1c7091994c7637839074e34697694218120  scripts/validate-runtime-artifacts.mjs
76a7acfb423036be192d387f4ab59d6d420737430c4f760d697091016917d944  team-doc/mobile-app-dev-team/05-work-processes.md
f34431015b769f11f5ebb7f631d29019917cb7b176091371865a55b6518a9bf8  team-doc/mobile-app-dev-team/06-gates-and-evidence.md
50fc018b23912da109644fe7e96b7c4a58b9103f248805ee7ddf324974846dc2  team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md
e6ac87aaf0f91b4cf78c365dc4d63ea645c3e9743afe80fa73e6b58be9708914  docs/plans/active/20260610-mobile-app-dev-team-root-migration-plan.md
158bf0fe3d5eb87b50ddd1e4e5e77d89e09e77510e42464b69653b967993f585  .evidence/reviews/mobile-app-dev-team-root-migration-phase0-baseline-20260610.md
90f2a8f3282a4b3215f43416feebcc84390ecb005f4ba24c45be04d8eba15e4e  .evidence/reviews/mobile-app-dev-team-root-migration-confluence-scope-xhigh-20260610.md
```

## Refreshed Current Worktree

`git status --short`:

```text
 M .agents/skills/wm/SKILL.md
 M PROJECT_ENVIRONMENT.md
 M evals/skills/wm/positive.prompt.md
 M scripts/validate-runtime-artifacts.mjs
 M team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md
?? .evidence/reviews/mobile-app-dev-team-root-migration-phase0-baseline-20260610.md
?? .evidence/reviews/mobile-app-dev-team-root-migration-plan-high-review-20260610.md
?? .evidence/reviews/mobile-template-runtime-goal-plan-review-prompt-20260610.md
?? .evidence/reviews/mobile-template-runtime-goal-plan-xhigh-20260610.json
?? .evidence/reviews/mobile-template-runtime-goal-plan-xhigh-20260610.md
?? .evidence/reviews/mobile-template-runtime-phase0-checkpoint-20260610.md
?? .evidence/reviews/mobile-template-runtime-phase0-checkpoint-review-prompt-20260610.md
?? .evidence/reviews/mobile-template-runtime-phase0-checkpoint-xhigh-20260610.json
?? .evidence/reviews/mobile-template-runtime-phase0-checkpoint-xhigh-20260610.md
?? .evidence/reviews/mobile-template-runtime-rebaseline-checkpoint-20260610.md
?? .evidence/reviews/mobile-template-runtime-rebaseline-checkpoint-rereview-prompt-20260610.md
?? .evidence/reviews/mobile-template-runtime-rebaseline-checkpoint-review-prompt-20260610.md
?? .evidence/reviews/mobile-template-runtime-rebaseline-checkpoint-xhigh-20260610.md
?? .evidence/reviews/mobile-template-runtime-rebaseline-checkpoint-xhigh-rereview-20260610.json
?? .evidence/reviews/mobile-template-runtime-rebaseline-checkpoint-xhigh-rereview-20260610.md
?? docs/plans/active/20260610-mobile-app-dev-team-root-migration-plan.md
?? docs/plans/active/20260610-wm-mobile-template-runtime-goal-plan.md
?? evals/skills/wm/write-executor-negative.prompt.md
```

`git diff --stat`:

```text
 .agents/skills/wm/SKILL.md                         | 27 +++++++++++++++++-----
 PROJECT_ENVIRONMENT.md                             |  2 ++
 evals/skills/wm/positive.prompt.md                 |  2 +-
 scripts/validate-runtime-artifacts.mjs             | 23 ++++++++++++++++++
 .../13-pod-organization-e2e-improvement-plan.md    |  3 ++-
 5 files changed, 49 insertions(+), 8 deletions(-)
```

`git diff --numstat`:

```text
21	6	.agents/skills/wm/SKILL.md
2	0	PROJECT_ENVIRONMENT.md
1	1	evals/skills/wm/positive.prompt.md
23	0	scripts/validate-runtime-artifacts.mjs
2	1	team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md
```

## Refreshed Dirty File Classification

Overlapping with this migration plan:

- `PROJECT_ENVIRONMENT.md`: expected affected path for Phase 3 CI/local-harness
  documentation update. Existing diff is from concurrent `$wm` runtime routing
  work; do not overwrite without rereading before edit.
- `team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md`:
  under the future move root `team-doc/mobile-app-dev-team/**`. Existing diff is
  unrelated plan hygiene and must be preserved through `git mv`.
- `docs/plans/active/20260610-mobile-app-dev-team-root-migration-plan.md`: this
  migration plan.
- `.evidence/reviews/mobile-app-dev-team-root-migration-phase0-baseline-20260610.md`:
  this Phase 0 evidence.
- `.evidence/reviews/mobile-app-dev-team-root-migration-plan-high-review-20260610.md`:
  completed plan reviewer evidence.

Dirty but not part of the current migration write set:

- `.agents/skills/wm/SKILL.md`
- `evals/skills/wm/positive.prompt.md`
- `evals/skills/wm/write-executor-negative.prompt.md`
- `scripts/validate-runtime-artifacts.mjs`
- `.evidence/reviews/mobile-template-runtime-*`
- `docs/plans/active/20260610-wm-mobile-template-runtime-goal-plan.md`

These files may affect runtime/local-harness gates. They must be preserved and
rechecked before claiming final migration completion.

## Refreshed Hashes

```text
187642ba4ccb2958eb946d55e02b993354771b85b699f39672ea71d5f6a6ee81  .agents/skills/wm/SKILL.md
74eec988cf6a784c9e9983b7cd77e4c9aef356e874520d904e88cb47ff781ae6  PROJECT_ENVIRONMENT.md
7143a5cd0aa36a00b1d1f76c9b6381370d3832e38dcda4fbcfdf88ce56e85da1  evals/skills/wm/positive.prompt.md
c198104086ef50255dcb53a791dec1c7091994c7637839074e34697694218120  scripts/validate-runtime-artifacts.mjs
50fc018b23912da109644fe7e96b7c4a58b9103f248805ee7ddf324974846dc2  team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md
ba1bb580efa5faef2f4d2c5ef8fc16c638c1b0cccc0180445de831a619b1eb4d  docs/plans/active/20260610-mobile-app-dev-team-root-migration-plan.md
e09af54b38d9e1d0688ad4552192b3c421b374f017c869d7eb4713706ffd0ff5  .evidence/reviews/mobile-app-dev-team-root-migration-phase0-baseline-20260610.md
```

## Refreshed team-doc Inventory

`find team-doc -maxdepth 3 -type f | sort`:

```text
team-doc/_meta/confluence-page-map.json
team-doc/_meta/fetch-report.md
team-doc/_meta/readme.md
team-doc/_meta/split-map.json
team-doc/_meta/validation-report.md
team-doc/mobile-app-dev-team/00-sot-and-principles.md
team-doc/mobile-app-dev-team/01-team-composition.md
team-doc/mobile-app-dev-team/02-role-souls/backend-api-integrator-soul.md
team-doc/mobile-app-dev-team/02-role-souls/design-soul.md
team-doc/mobile-app-dev-team/02-role-souls/mobile-app-dev-soul.md
team-doc/mobile-app-dev-team/02-role-souls/mobile-architect-soul.md
team-doc/mobile-app-dev-team/02-role-souls/product-planning-soul.md
team-doc/mobile-app-dev-team/02-role-souls/qa-release-soul.md
team-doc/mobile-app-dev-team/03-role-capability-matrix.md
team-doc/mobile-app-dev-team/04-skills-and-agents-matrix.md
team-doc/mobile-app-dev-team/05-work-processes.md
team-doc/mobile-app-dev-team/06-gates-and-evidence.md
team-doc/mobile-app-dev-team/07-new-team-template-guide.md
team-doc/mobile-app-dev-team/08-role-title-update-plan.md
team-doc/mobile-app-dev-team/09-pod-native-openclaw-skill-plan.md
team-doc/mobile-app-dev-team/09-pod-native-openclaw-skills/README.md
team-doc/mobile-app-dev-team/10-github-artifact-workflow.md
team-doc/mobile-app-dev-team/11-openclaw-codex-completion-hooks-plan.md
team-doc/mobile-app-dev-team/12-ref-organization-goal-plan.md
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md
team-doc/mobile-app-dev-team/99-source-map.md
team-doc/mobile-app-dev-team/README.md
team-doc/mobile-app-dev-team/ref-organization/README.md
team-doc/readme.md
```

Count: 29 files at maxdepth 3.

## Current Worktree

`git status --short`:

```text
 M team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md
?? .claude/
?? .evidence/reviews/mobile-app-dev-team-root-migration-plan-high-review-20260610.md
?? .evidence/reviews/mobile-template-runtime-goal-plan-review-prompt-20260610.md
?? .evidence/reviews/mobile-template-runtime-goal-plan-xhigh-20260610.json
?? .evidence/reviews/mobile-template-runtime-goal-plan-xhigh-20260610.md
?? .evidence/reviews/mobile-template-runtime-phase0-checkpoint-20260610.md
?? .evidence/reviews/mobile-template-runtime-phase0-checkpoint-review-prompt-20260610.md
?? .evidence/reviews/mobile-template-runtime-phase0-checkpoint-xhigh-20260610.json
?? .evidence/reviews/mobile-template-runtime-phase0-checkpoint-xhigh-20260610.md
?? .evidence/reviews/mobile-template-runtime-rebaseline-checkpoint-20260610.md
?? .evidence/reviews/mobile-template-runtime-rebaseline-checkpoint-rereview-prompt-20260610.md
?? .evidence/reviews/mobile-template-runtime-rebaseline-checkpoint-review-prompt-20260610.md
?? .evidence/reviews/mobile-template-runtime-rebaseline-checkpoint-xhigh-20260610.md
?? .evidence/reviews/mobile-template-runtime-rebaseline-checkpoint-xhigh-rereview-20260610.json
?? .evidence/reviews/mobile-template-runtime-rebaseline-checkpoint-xhigh-rereview-20260610.md
?? CLAUDE.md
?? docs/plans/active/20260610-mobile-app-dev-team-root-migration-plan.md
?? docs/plans/active/20260610-wm-mobile-template-runtime-goal-plan.md
```

`git diff --stat`:

```text
 .../mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md    | 3 ++-
 1 file changed, 2 insertions(+), 1 deletion(-)
```

## Overlapping Dirty File Baseline

Overlapping dirty file:

- `team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md`

`git diff --numstat -- team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md`:

```text
2	1	team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md
```

Baseline patch:

```diff
diff --git a/team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md b/team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md
index ab12ce4..5c17ecb 100644
--- a/team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md
+++ b/team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md
@@ -276,7 +276,8 @@ GitHub만이 durable" 원칙과 `01-team-composition.md`의 "Gatekeeper는 비-L
   - `scripts/validate-evidence-hygiene.mjs`(`test:runtime` 포함): `.evidence/e2e-test/`
     디렉토리명 `^\d{8}-\d{6}-[a-z0-9-]+$` 강제, 금지 경로(`local/`, `tmp/`, `raw/`, `*.log`)의
     커밋 차단(`.gitignore` 일치 확인), `.evidence/` + `docs/plans/work-units/` 전체에
-    secret 패턴 스캔(`validate-team-doc.mjs:236-243` 패턴 모듈을 공유 모듈로 추출해 재사용).
+    secret 패턴 스캔(`validate-team-doc.mjs`의 team-doc 한정 secret 패턴 스캔 동작을
+    공유 모듈로 추출해 재사용하되, 라인 번호는 해당 파일이 활발히 수정 중이므로 인용하지 않음).
 - **수용 기준**: 현재 트리 통과; planted-secret fixture가 파일+라인으로 실패;
   비-design 역할 preflight는 Stitch 블록 skip.
```

## Hashes

```text
50fc018b23912da109644fe7e96b7c4a58b9103f248805ee7ddf324974846dc2  team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md
c9a13a42b836e9a2b7e0b3525f29cfdd2b1de559f14e9b7e0fb560adb2f06cc8  docs/plans/active/20260610-mobile-app-dev-team-root-migration-plan.md
febb85b765c9cfdc7e7e31b7cbcde4c94c2da5abea22747b5748a084fff267d7  .evidence/reviews/mobile-app-dev-team-root-migration-plan-high-review-20260610.md
```

## Path Checks

```text
root_mobile_app_dev_team_absent_exit=0
current_team_doc_root_exists_exit=0
```

Interpretation:

- `mobile-app-dev-team/` is absent at root.
- `team-doc/mobile-app-dev-team/` exists.

## Gate Checks

`node scripts/validate-repo-operations.mjs; echo "exit=$?"`:

```text
Validated repo operations policy ownership.
exit=0
```

`node scripts/validate-team-doc.mjs; echo "exit=$?"`:

```text
Validated current team-doc managed docs.
exit=0
```

`node scripts/validate-team-doc-archive.mjs; echo "exit=$?"`:

```text
Validated team-doc archive/reference corpus from root archive files: 71 source files, 32 structured files.
exit=0
```
