Findings

- Medium: `CLAUDE.md` still points pod-native OpenClaw skill authorship at the legacy source root. [CLAUDE.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/CLAUDE.md:61) says pod-native skills are authored under `mobile-app-dev-team/09-pod-native-openclaw-skills/<slug>/`, which violates the checkpoint rule that remaining `09-pod-native-openclaw-skills` references outside `_archive/` and `.evidence/` are limited to the approved goal-plan mapping/risk note, validator legacy/stale checks, and the invalid legacy-only fixture. The staged stale-reference evidence also missed this because its scan did not include root `CLAUDE.md`; the evidence then claims no `.claude`/active reference remains. This should block Checkpoint 4 until that active memory/reference is updated to `mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/<slug>/`.

```json
{
  "verdict": "NO_GO",
  "reviewer": "wm-implementation-reviewer",
  "mode": "final",
  "scope": {
    "baseline": "3551319c01ded8d0996e824699df3953d7b69b92",
    "target": "staged Checkpoint 3-F pod-native runtime-source move",
    "paths_reviewed": [
      "CLAUDE.md",
      "AGENTS.md",
      "PROJECT_ENVIRONMENT.md",
      "REPO_OPERATIONS.md",
      "docs/CODEX_MCP_ENVIRONMENT.md",
      "docs/plans/work-units/codex-role-workflow-runtime-routing/00-product-planning/evidence-matrix.md",
      "docs/plans/work-units/codex-role-workflow-runtime-routing/00-product-planning/runtime-publication-status.md",
      "docs/plans/work-units/codex-role-workflow-runtime-routing/00-product-planning/task-packet.md",
      "docs/plans/work-units/project-bootstrap-auth-gates/README.md",
      "evals/skills/openclaw-pod-skills-sync-smoke.sh",
      "evals/skills/project-bootstrap-agent-setup-smoke.sh",
      "evals/team-doc-structure/fixtures/invalid-pod-native-legacy-only.json",
      "mobile-app-dev-team/09-pod-native-openclaw-skills/**",
      "mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/**",
      "mobile-app-dev-team/99-source-map.md",
      "mobile-app-dev-team/README.md",
      "mobile-app-dev-team/reports/runtime-surface-structure-goal-plan.md",
      "scripts/validate-team-doc.mjs",
      "scripts/validate-runtime-sources.mjs",
      "scripts/validate-team-doc-managed.mjs",
      "scripts/validate-team-doc-structure.mjs",
      ".evidence/reviews/20260616-runtime-surface-structure-checkpoint3f-pod-native-command-output.md"
    ]
  },
  "findings": [
    {
      "severity": "Medium",
      "path": "CLAUDE.md",
      "line": 61,
      "title": "Active Claude memory still references the legacy pod-native source root",
      "evidence": "CLAUDE.md:61 says pod-native OpenClaw skills are authored under mobile-app-dev-team/09-pod-native-openclaw-skills/<slug>/ instead of mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/<slug>/.",
      "impact": "This violates the Checkpoint 3-F allowed-reference rule and can route future pod-native authoring back to the removed legacy source root.",
      "required_fix": "Update CLAUDE.md to the new runtime-sources/pod-native-openclaw-skills path and rerun the stale-reference scan including CLAUDE.md."
    }
  ],
  "checks_reviewed": [
    {
      "command": "git status --short --branch",
      "status": "PASS",
      "evidence": "On branch chore/openclaw-pod-skills-sync; HEAD is 3551319c01ded8d0996e824699df3953d7b69b92 and staged changes are present."
    },
    {
      "command": "git diff --cached --name-status --find-renames=50% -- mobile-app-dev-team/09-pod-native-openclaw-skills mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills",
      "status": "PASS",
      "evidence": "All 28 baseline files under the old pod-native root are staged as renames into mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/."
    },
    {
      "command": "git ls-files --stage -- mobile-app-dev-team/09-pod-native-openclaw-skills",
      "status": "PASS",
      "evidence": "No staged index entries remain at the old root."
    },
    {
      "command": "git ls-files -- mobile-app-dev-team/source-map.md mobile-app-dev-team/99-source-map.md",
      "status": "PASS",
      "evidence": "Only mobile-app-dev-team/99-source-map.md exists; Checkpoint 5 source-map filename movement is not included."
    },
    {
      "command": "git grep --cached -n \"09-pod-native-openclaw-skills\" -- . ':!mobile-app-dev-team/_archive/**' ':!.evidence/**' ':!mobile-app-dev-team/reports/runtime-surface-structure-goal-plan.md' ':!scripts/validate-runtime-sources.mjs' ':!scripts/validate-team-doc-managed.mjs' ':!scripts/validate-team-doc-structure.mjs' ':!evals/team-doc-structure/fixtures/invalid-pod-native-legacy-only.json'",
      "status": "FAIL",
      "evidence": "Found disallowed active old-root reference at CLAUDE.md:61."
    },
    {
      "command": "manual review of openclaw-pod-skills-sync and project-bootstrap defaults",
      "status": "PASS",
      "evidence": "sync-pod-skills.sh, project-bootstrap-agent-setup.sh, project-bootstrap-preflight.sh, and both smoke fixtures default to mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills."
    },
    {
      "command": "manual review of validators",
      "status": "PASS",
      "evidence": "validate-runtime-sources.mjs and validate-team-doc-managed.mjs require the new pod-native root and fail if mobile-app-dev-team/09-pod-native-openclaw-skills exists; structure validator retains only legacy registry/fixture checks."
    },
    {
      "command": "review .evidence/reviews/20260616-runtime-surface-structure-checkpoint3f-pod-native-command-output.md",
      "status": "PASS",
      "evidence": "Recorded RED validate:team-doc failure before physical move, post-move validate:team-doc pass, test:runtime pass, test:local-harness pass, validate:team-doc-archive pass, both pod-native smoke passes, git diff --check and git diff --cached --check pass, and validate:evidence-hygiene pass."
    },
    {
      "command": "git diff --check && git diff --cached --check",
      "status": "PASS",
      "evidence": "Both whitespace checks produced no output."
    },
    {
      "command": "git diff --cached --name-only -- apps packages infra",
      "status": "PASS",
      "evidence": "No staged app/package/API/native/infra code paths were included."
    }
  ],
  "residual_risks": [
    "Heavy validation commands were reviewed from the recorded evidence transcript rather than rerun in full during this read-only review.",
    "Live OpenClaw pod proof and external platform proof remain out of scope for this checkpoint."
  ],
  "next_action": "fix_findings"
}
```