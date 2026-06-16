Findings

1. Medium - Active `.claude` skill-rule docs still reference the removed legacy role SOUL root. `.claude/skills/best-practices/rules/_role-index.md:3` points at `mobile-app-dev-team/02-role-souls/`, and `.claude/skills/best-practices/rules/test-infrastructure.md:4` points at `mobile-app-dev-team/02-role-souls/qa-release-soul.md`. The staged index removes that root and contains the six role SOUL files only under `runtime-sources/role-souls/`, so these are broken active references outside the approved goal-plan and validator exceptions.

2. Low - The recorded stale-reference evidence is incomplete. `.evidence/reviews/20260616-runtime-surface-structure-checkpoint3e-role-souls-command-output.md:70` scans many active areas but omits `.claude/`, which is exactly where the stale references remain. The evidence therefore does not support the claim that old-path mentions are limited to the goal-plan and validator stale checks.

Verified non-blockers: the six role SOUL files are staged as `R100` moves to `mobile-app-dev-team/runtime-sources/role-souls/`; the old staged root is absent; Checkpoint 3-F and Checkpoint 5 physical moves are not staged; validators require the new root and reject the old root.

```json
{
  "verdict": "NO_GO",
  "reviewer": "wm-implementation-reviewer",
  "mode": "final",
  "scope": {
    "baseline": "3551319c01ded8d0996e824699df3953d7b69b92",
    "target": "staged Checkpoint 3-E role SOUL runtime-source move",
    "paths_reviewed": [
      "mobile-app-dev-team/runtime-sources/role-souls/",
      "mobile-app-dev-team/02-role-souls/",
      "mobile-app-dev-team/09-pod-native-openclaw-skills/",
      "mobile-app-dev-team/99-source-map.md",
      "mobile-app-dev-team/source-map.md",
      "mobile-app-dev-team/README.md",
      "mobile-app-dev-team/ref-organization/role-contracts-and-capabilities/README.md",
      "mobile-app-dev-team/reports/runtime-surface-structure-goal-plan.md",
      "mobile-app-dev-team/09-pod-native-openclaw-skills/*-agent-runtime-spec.md",
      ".agents/skills/git-workflow/SKILL.md",
      ".agents/skills/mobile-app-dev-workflow/references/sot.md",
      ".agents/skills/mobile-backend-api-integrator-workflow/references/sot.md",
      ".claude/skills/best-practices/rules/_role-index.md",
      ".claude/skills/best-practices/rules/test-infrastructure.md",
      "scripts/validate-runtime-sources.mjs",
      "scripts/validate-team-doc-managed.mjs",
      "scripts/validate-team-doc-structure.mjs",
      "evals/skills/project-bootstrap-agent-setup-smoke.sh",
      ".evidence/reviews/20260616-runtime-surface-structure-checkpoint3e-role-souls-command-output.md"
    ]
  },
  "findings": [
    {
      "severity": "Medium",
      "path": ".claude/skills/best-practices/rules/_role-index.md:3; .claude/skills/best-practices/rules/test-infrastructure.md:4",
      "issue": "Active skill-rule documentation still references mobile-app-dev-team/02-role-souls after the staged index removes that root.",
      "impact": "The checkpoint leaves broken active references outside the approved goal-plan and validator stale-path exceptions.",
      "recommendation": "Update these references to mobile-app-dev-team/runtime-sources/role-souls/ and the matching qa-release-soul.md path before proceeding to Checkpoint 3-F."
    },
    {
      "severity": "Low",
      "path": ".evidence/reviews/20260616-runtime-surface-structure-checkpoint3e-role-souls-command-output.md:70",
      "issue": "The recorded stale-reference scan omits .claude/, so it misses the remaining active stale references.",
      "impact": "The command evidence is not sufficient to prove the old-path reference constraint.",
      "recommendation": "After fixing .claude references, rerun and record a stale-reference scan that includes .claude or a repo-wide staged-index equivalent with explicit historical exclusions."
    }
  ],
  "checks_reviewed": [
    {
      "command": "git status --short --branch",
      "status": "PASS",
      "evidence": "On chore/openclaw-pod-skills-sync with staged checkpoint changes."
    },
    {
      "command": "git rev-parse 3551319c01ded8d0996e824699df3953d7b69b92^{commit}",
      "status": "PASS",
      "evidence": "Baseline commit resolves."
    },
    {
      "command": "git merge-base --is-ancestor 3551319c01ded8d0996e824699df3953d7b69b92 HEAD",
      "status": "PASS",
      "evidence": "Exit 0."
    },
    {
      "command": "git diff --cached --name-status --find-renames -- mobile-app-dev-team/02-role-souls mobile-app-dev-team/runtime-sources/role-souls",
      "status": "PASS",
      "evidence": "Six expected role SOUL files are staged as R100 moves to runtime-sources/role-souls."
    },
    {
      "command": "git ls-files --stage -- mobile-app-dev-team/runtime-sources/role-souls",
      "status": "PASS",
      "evidence": "All six target role SOUL paths exist in the staged index."
    },
    {
      "command": "git ls-files --stage -- mobile-app-dev-team/02-role-souls",
      "status": "PASS",
      "evidence": "No legacy role SOUL paths remain in the staged index."
    },
    {
      "command": "git diff --cached --name-status --find-renames -- mobile-app-dev-team/09-pod-native-openclaw-skills mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills mobile-app-dev-team/source-map.md mobile-app-dev-team/99-source-map.md",
      "status": "PASS",
      "evidence": "Pod-native root is modified in place only; 99-source-map.md is modified in place; no deferred physical moves are staged."
    },
    {
      "command": "git grep --cached -n -- 'runtime-sources/role-souls'",
      "status": "PASS",
      "evidence": "Active source map, README, role-contract reference docs, pod-native runtime specs, repo-local skills, reports, validators, and smoke fixture reference the new root."
    },
    {
      "command": "git grep --cached -n -- '02-role-souls' -- ':!mobile-app-dev-team/_archive/**' ':!.evidence/**'",
      "status": "FAIL",
      "evidence": "Found stale active references in .claude/skills/best-practices/rules/_role-index.md:3 and .claude/skills/best-practices/rules/test-infrastructure.md:4, beyond approved goal-plan and validator matches."
    },
    {
      "command": "review scripts/validate-runtime-sources.mjs and scripts/validate-team-doc-managed.mjs",
      "status": "PASS",
      "evidence": "Validators define runtime-sources/role-souls as target root and fail if mobile-app-dev-team/02-role-souls exists."
    },
    {
      "command": "review .evidence/reviews/20260616-runtime-surface-structure-checkpoint3e-role-souls-command-output.md",
      "status": "FAIL",
      "evidence": "Required command outcomes are recorded, but stale-reference evidence omits .claude and is therefore incomplete."
    },
    {
      "command": "recorded RED pnpm run validate:team-doc",
      "status": "PASS",
      "evidence": "Evidence records exit status 1 before physical move with missing new-root SOUL docs and legacy-root rejection."
    },
    {
      "command": "recorded pnpm run validate:team-doc",
      "status": "PASS",
      "evidence": "Evidence records exit status 0 after move."
    },
    {
      "command": "recorded pnpm run test:runtime",
      "status": "PASS",
      "evidence": "Evidence records exit status 0."
    },
    {
      "command": "recorded pnpm run test:local-harness",
      "status": "PASS",
      "evidence": "Evidence records exit status 0."
    },
    {
      "command": "recorded pnpm run validate:team-doc-archive",
      "status": "PASS",
      "evidence": "Evidence records exit status 0."
    },
    {
      "command": "recorded bash evals/skills/openclaw-pod-skills-sync-smoke.sh",
      "status": "PASS",
      "evidence": "Evidence records smoke pass."
    },
    {
      "command": "recorded bash evals/skills/project-bootstrap-agent-setup-smoke.sh",
      "status": "PASS",
      "evidence": "Evidence records smoke pass."
    },
    {
      "command": "git diff --check",
      "status": "PASS",
      "evidence": "Exit 0 in review."
    },
    {
      "command": "git diff --cached --check",
      "status": "PASS",
      "evidence": "Exit 0 in review."
    },
    {
      "command": "recorded pnpm run validate:evidence-hygiene",
      "status": "PASS",
      "evidence": "Evidence records exit status 0."
    },
    {
      "command": "git diff --cached --name-only | rg '^(apps|packages|infra)/'",
      "status": "PASS",
      "evidence": "No staged app, package, API, native, or infra code paths matched."
    }
  ],
  "residual_risks": [
    "Historical .evidence review artifacts contain old-path text as snapshots; this review treated them as non-active records, not active runtime references.",
    "The recorded pnpm checks were reviewed from evidence rather than rerun in full during this read-only reviewer pass."
  ],
  "next_action": "fix_findings"
}
```