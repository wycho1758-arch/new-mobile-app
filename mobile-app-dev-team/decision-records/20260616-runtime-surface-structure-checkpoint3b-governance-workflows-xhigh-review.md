**Findings**
- Medium: Durable work-unit references were not fully updated to the 3-B moved paths. The active task packet still treats old filenames as current source/acceptance references, e.g. [task-packet.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/docs/plans/work-units/codex-role-workflow-runtime-routing/00-product-planning/task-packet.md:154), [task-packet.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/docs/plans/work-units/codex-role-workflow-runtime-routing/00-product-planning/task-packet.md:365), [task-packet.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/docs/plans/work-units/codex-role-workflow-runtime-routing/00-product-planning/task-packet.md:401), [task-packet.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/docs/plans/work-units/codex-role-workflow-runtime-routing/00-product-planning/task-packet.md:460), and [task-packet.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/docs/plans/work-units/codex-role-workflow-runtime-routing/00-product-planning/task-packet.md:549). This conflicts with the checkpoint requirement to update durable work-unit references and to leave old 3-B filenames outside `_archive/` only in explicit historical/crosswalk contexts. The recorded old-name search also omitted `docs/plans/work-units`, so it missed this class.

The physical 3-B moves themselves look correct: target files are present in the index, old top-level paths are absent, `_archive/` has no diff, and runtime-source/source-map/ref-organization physical movement did not occur. Command evidence covers the requested validator/runtime/local-harness/smoke/whitespace/evidence-hygiene commands, but the stale work-unit references block proceeding to 3-C.

```json
{
  "verdict": "NO_GO",
  "reviewer": "wm-implementation-reviewer",
  "mode": "final",
  "scope": {
    "baseline": "3551319c01ded8d0996e824699df3953d7b69b92",
    "target": "staged Checkpoint 3-B governance/organization/workflows movement",
    "paths_reviewed": [
      "staged git index",
      ".evidence/reviews/20260616-runtime-surface-structure-checkpoint3b-governance-workflows-command-output.md",
      "mobile-app-dev-team/README.md",
      "mobile-app-dev-team/99-source-map.md",
      "mobile-app-dev-team/governance/",
      "mobile-app-dev-team/organization/",
      "mobile-app-dev-team/workflows/",
      "mobile-app-dev-team/ref-organization/",
      "mobile-app-dev-team/_archive/",
      "mobile-app-dev-team/09-pod-native-openclaw-skills/",
      ".agents/skills/mobile-app-dev-workflow/references/sot.md",
      ".agents/skills/mobile-backend-api-integrator-workflow/references/sot.md",
      "docs/plans/work-units/codex-role-workflow-runtime-routing/00-product-planning/task-packet.md",
      "docs/plans/work-units/codex-role-workflow-runtime-routing/00-product-planning/runtime-publication-status.md",
      "docs/plans/work-units/codex-role-workflow-runtime-routing/00-product-planning/evidence-matrix.md",
      "scripts/validate-team-doc.mjs",
      "scripts/validate-team-doc-structure.mjs",
      "scripts/validate-runtime-sources.mjs",
      "scripts/validate-workflow-docs.mjs",
      "scripts/validate-governance-docs.mjs",
      "scripts/validate-reference-docs.mjs",
      "scripts/validate-team-doc-managed.mjs",
      "scripts/lib/work-unit-machine.mjs",
      "PROJECT_ENVIRONMENT.md",
      "REPO_OPERATIONS.md",
      ".github/workflows/quality-gate.yml",
      "package.json"
    ]
  },
  "findings": [
    {
      "severity": "Medium",
      "title": "Durable work-unit task packet still uses moved 3-B filenames as current references",
      "path": "docs/plans/work-units/codex-role-workflow-runtime-routing/00-product-planning/task-packet.md",
      "line": 154,
      "blocking": true,
      "evidence": [
        "task-packet.md:154 still says `19-entry-case-routing.md` as the source for current routing behavior.",
        "task-packet.md:188 still says `20-app-eas-ota-rollback-runbook.md` as the source for P-4 rollback governance.",
        "task-packet.md:194 still says `05-work-processes.md` as the source for current Product/Planning intake.",
        "task-packet.md:208 still says `06-gates-and-evidence.md` as the source for runtime artifact gates.",
        "task-packet.md:219 still says `10-github-artifact-workflow.md` as the source for pod-isolated handoff.",
        "task-packet.md:365, task-packet.md:384, task-packet.md:401, task-packet.md:460, and task-packet.md:549 continue to use old filenames in input-artifact, Done-when, required-content, and validator language.",
        "The checkpoint evidence claims durable work-unit references were updated, but its old-name search scope at .evidence/reviews/20260616-runtime-surface-structure-checkpoint3b-governance-workflows-command-output.md:83 does not include docs/plans/work-units."
      ],
      "expected_fix": "Update active work-unit references to `mobile-app-dev-team/workflows/entry-case-routing.md`, `mobile-app-dev-team/workflows/work-processes.md`, `mobile-app-dev-team/governance/gates-and-evidence.md`, `mobile-app-dev-team/workflows/github-artifact-workflow.md`, and `mobile-app-dev-team/governance/app-eas-ota-rollback-runbook.md`, or clearly mark any retained old names as historical command/evidence context."
    }
  ],
  "checks_reviewed": [
    {
      "command": "git status --short --branch",
      "status": "PASS",
      "evidence": "On branch chore/openclaw-pod-skills-sync; staged changes present; no unstaged diff was reported by `git diff --name-status`."
    },
    {
      "command": "git diff --cached --name-status",
      "status": "PASS",
      "evidence": "Staged diff contains the expected 3-B renames into governance/, organization/, and workflows/, plus prior approved checkpoint artifacts and reference/validator updates."
    },
    {
      "command": "git cat-file -e :<3-B target paths> and :<old top-level paths>",
      "status": "PASS",
      "evidence": "All 11 target paths are present in the index; all 11 old top-level 3-B paths are absent from the index."
    },
    {
      "command": "git diff --cached --name-status -- mobile-app-dev-team/_archive && git diff --name-status -- mobile-app-dev-team/_archive",
      "status": "PASS",
      "evidence": "No staged or unstaged archive diff."
    },
    {
      "command": "git diff --cached --name-status -- out-of-scope runtime/source-map/ref-organization movement paths",
      "status": "PASS",
      "evidence": "No physical movement of source-map.md, 02-role-souls, 04-skills-and-agents-matrix.md, 09-pod-native-openclaw-skills, 16/17 pod docs, or ref-organization folders; only allowed reference/index edits were present."
    },
    {
      "command": "rg old 3-B filenames in AGENTS.md PROJECT_ENVIRONMENT.md REPO_OPERATIONS.md scripts .agents .codex mobile-app-dev-team package.json .github --glob '!mobile-app-dev-team/_archive/**'",
      "status": "PASS",
      "evidence": "Current managed/runtime surface grep left only report/crosswalk context in mobile-app-dev-team."
    },
    {
      "command": "rg old 3-B filenames in docs/plans/work-units",
      "status": "FAIL",
      "evidence": "Found stale active work-unit references in docs/plans/work-units/codex-role-workflow-runtime-routing/00-product-planning/task-packet.md."
    },
    {
      "command": "recorded RED pnpm run validate:team-doc before physical move",
      "status": "PASS",
      "evidence": ".evidence/reviews/20260616-runtime-surface-structure-checkpoint3b-governance-workflows-command-output.md:37 records expected exit 1; lines 45-49 show missing workflow target docs before move."
    },
    {
      "command": "recorded pnpm run validate:team-doc after move",
      "status": "PASS",
      "evidence": ".evidence/reviews/20260616-runtime-surface-structure-checkpoint3b-governance-workflows-command-output.md:112 records exit 0; lines 117-124 show structure/runtime/workflow/governance/reference/managed validators passed."
    },
    {
      "command": "recorded pnpm run test:runtime",
      "status": "PASS",
      "evidence": ".evidence/reviews/20260616-runtime-surface-structure-checkpoint3b-governance-workflows-command-output.md:135 records exit 0; lines 140-159 list runtime validator and hook passes."
    },
    {
      "command": "recorded pnpm run test:local-harness",
      "status": "PASS",
      "evidence": ".evidence/reviews/20260616-runtime-surface-structure-checkpoint3b-governance-workflows-command-output.md:170 records exit 0; lines 175-188 show local harness pass."
    },
    {
      "command": "recorded bash evals/skills/openclaw-pod-skills-sync-smoke.sh && bash evals/skills/project-bootstrap-agent-setup-smoke.sh",
      "status": "PASS",
      "evidence": ".evidence/reviews/20260616-runtime-surface-structure-checkpoint3b-governance-workflows-command-output.md:200 records exit 0; lines 205-206 show both smoke scripts passed."
    },
    {
      "command": "git diff --check && git diff --cached --check",
      "status": "PASS",
      "evidence": "Re-run produced no output; recorded evidence at .evidence/reviews/20260616-runtime-surface-structure-checkpoint3b-governance-workflows-command-output.md:218 also records the command with exit 0."
    },
    {
      "command": "recorded pnpm run validate:evidence-hygiene",
      "status": "PASS",
      "evidence": ".evidence/reviews/20260616-runtime-surface-structure-checkpoint3b-governance-workflows-command-output.md:222 records exit 0; lines 227-228 show evidence hygiene fixtures/artifacts validated."
    },
    {
      "command": "pnpm turbo run lint test",
      "status": "NOT_APPLICABLE",
      "evidence": "Not required by the supplied 3-B command-evidence checklist; checkpoint changes are documentation/runtime-surface validators rather than app workspace code."
    }
  ],
  "residual_risks": [
    "This read-only review did not re-run pnpm validation commands; it verified the recorded evidence and ran read-only git/rg checks.",
    "Historical review/evidence artifacts still contain old filenames; those are acceptable only as historical context and were not treated as blockers unless they appear in active work-unit routing language.",
    "Live OpenClaw pod proof and external platform proof remain out of scope for Checkpoint 3-B."
  ],
  "next_action": "fix_findings"
}
```