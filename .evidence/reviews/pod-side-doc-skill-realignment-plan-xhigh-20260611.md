**Medium Findings**

1. Clone-on-demand needs a canonical repo acquisition and Codex-managed-path contract before implementation.

The plan correctly targets the observed pod gap: `/workspace/projects/Wondermove-Inc/new-mobile-app` is the repo path in SoT, current `pod-bootstrap.sh` hard-fails when it is missing, and the plan proposes clone-on-demand. The missing correction is that the plan does not explicitly require doc 16, `pod-role-bootstrap`, and validator coverage to bind clone-on-demand to a non-secret configured repo source and `/workspace/CODEX_MANAGED_PATHS.md` readiness. `REPO_OPERATIONS.md` says Codex-managed paths are listed in `/workspace/CODEX_MANAGED_PATHS.md` and this repo checkout path is `/workspace/projects/Wondermove-Inc/new-mobile-app/`; the observed Boram state says the file has no `/workspace/projects/Wondermove-Inc/new-mobile-app/` entry. Without this requirement, implementation can make the repo appear cloned while Codex-managed-path policy remains unready.

Sources: `REPO_OPERATIONS.md:85`, `REPO_OPERATIONS.md:89`, `REPO_OPERATIONS.md:90`, `REPO_OPERATIONS.md:93`, `REPO_OPERATIONS.md:95`, `mobile-app-dev-team/09-pod-native-openclaw-skills/pod-role-bootstrap/scripts/pod-bootstrap.sh:37`, `mobile-app-dev-team/09-pod-native-openclaw-skills/pod-role-bootstrap/scripts/pod-bootstrap.sh:39`, `/Users/tw.kim/.claude/plans/graceful-orbiting-coral.md:38`, `/Users/tw.kim/.claude/plans/graceful-orbiting-coral.md:40`, `/Users/tw.kim/.claude/plans/graceful-orbiting-coral.md:52`.

Required correction: define the clone source as explicit pod config, status-only and redacted, and require validation/documentation that `/workspace/CODEX_MANAGED_PATHS.md` contains `/workspace/projects/Wondermove-Inc/new-mobile-app/` or that bootstrap reports a blocker instead of claiming ready.

2. M0 isolation is not strong enough for the current dirty baseline.

The plan says the root migration is already applied and must be committed separately before M1, and it also says future changes must not modify `AGENTS.md`, `.codex/**`, `.agents/**`, `scripts/codex-preflight.mjs`, GitHub settings, or the pod. Current read-only `git status --short` shows a broad dirty tree including `AGENTS.md`, `PROJECT_ENVIRONMENT.md`, `REPO_OPERATIONS.md`, `package.json`, validator scripts, many `team-doc/` to `mobile-app-dev-team/` renames, and new evidence files. That is wider than a simple path migration note, and these files include SoT and gate definitions. Proceeding without an explicit M0 inventory and post-commit baseline evidence risks mixing prior-session SoT/runtime edits with this plan’s validator/doc/skill changes.

Sources: `/Users/tw.kim/.claude/plans/graceful-orbiting-coral.md:8`, `/Users/tw.kim/.claude/plans/graceful-orbiting-coral.md:60`, `/Users/tw.kim/.claude/plans/graceful-orbiting-coral.md:64`, `AGENTS.md:13`, `AGENTS.md:89`, `AGENTS.md:90`, `REPO_OPERATIONS.md:99`, `REPO_OPERATIONS.md:101`, read-only `git status --short`.

Required correction: before M1, record the exact M0 scope, commit or otherwise isolate all pre-existing dirty changes, rerun the baseline gate that was claimed green, and make the evidence path part of the plan.

**Low Findings**

None.

**Positive Effect**

Proceeding after the two corrections would clearly improve pod-side readiness. The current repo contradicts its active SoT: `AGENTS.md` and `REPO_OPERATIONS.md` define pod-native skill source/runtime paths, but `04-skills-and-agents-matrix.md` still says OpenClaw skills are deferred; the 09 README lists only two skills; role souls lack current runtime terms; doc 13 still references `/workspace/repo`; and `pod-bootstrap.sh` hard-fails when the repo checkout is missing. The validator-first plan directly targets these gaps and is repo-scoped.

**Checks Reviewed**

I did not run mutating commands or implementation gates. Source inspection was read-only. Implementation gates in the plan remain future gates and must run during M1-M4, especially `validate:team-doc`, `test:runtime`, `test:local-harness`, and `pnpm turbo run lint test`.

```json
{
  "verdict": "NO_GO",
  "reviewer": "wm-implementation-reviewer",
  "mode": "plan",
  "scope": {
    "baseline": "35d916a5b0386552beef679a704a8279ca7bff8b",
    "target": "/Users/tw.kim/.claude/plans/graceful-orbiting-coral.md",
    "paths_reviewed": [
      "AGENTS.md",
      "REPO_OPERATIONS.md",
      "PROJECT_ENVIRONMENT.md",
      ".codex/config.toml",
      "package.json",
      "scripts/validate-team-doc.mjs",
      "mobile-app-dev-team/04-skills-and-agents-matrix.md",
      "mobile-app-dev-team/09-pod-native-openclaw-skills/README.md",
      "mobile-app-dev-team/09-pod-native-openclaw-skills/pod-role-bootstrap/scripts/pod-bootstrap.sh",
      "mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md",
      "mobile-app-dev-team/README.md",
      "mobile-app-dev-team/99-source-map.md",
      "docs/CODEX_MCP_ENVIRONMENT.md",
      "/Users/tw.kim/.claude/plans/graceful-orbiting-coral.md"
    ]
  },
  "findings": [
    {
      "severity": "MEDIUM",
      "summary": "Clone-on-demand lacks an explicit configured clone-source and /workspace/CODEX_MANAGED_PATHS.md readiness contract, so bootstrap could clone the repo path while leaving Codex-managed-path policy unready.",
      "source_refs": [
        "REPO_OPERATIONS.md:85",
        "REPO_OPERATIONS.md:89",
        "REPO_OPERATIONS.md:90",
        "REPO_OPERATIONS.md:93",
        "REPO_OPERATIONS.md:95",
        "mobile-app-dev-team/09-pod-native-openclaw-skills/pod-role-bootstrap/scripts/pod-bootstrap.sh:37",
        "mobile-app-dev-team/09-pod-native-openclaw-skills/pod-role-bootstrap/scripts/pod-bootstrap.sh:39",
        "/Users/tw.kim/.claude/plans/graceful-orbiting-coral.md:38",
        "/Users/tw.kim/.claude/plans/graceful-orbiting-coral.md:40",
        "/Users/tw.kim/.claude/plans/graceful-orbiting-coral.md:52",
        "review prompt: Observed Boram pod state"
      ],
      "owner": "Implementation owner"
    },
    {
      "severity": "MEDIUM",
      "summary": "M0 baseline isolation is under-specified for the current dirty tree; pre-existing SoT/runtime edits must be inventoried, committed or isolated, and re-baselined before M1 validator changes.",
      "source_refs": [
        "/Users/tw.kim/.claude/plans/graceful-orbiting-coral.md:8",
        "/Users/tw.kim/.claude/plans/graceful-orbiting-coral.md:60",
        "/Users/tw.kim/.claude/plans/graceful-orbiting-coral.md:64",
        "AGENTS.md:13",
        "AGENTS.md:89",
        "AGENTS.md:90",
        "REPO_OPERATIONS.md:99",
        "REPO_OPERATIONS.md:101",
        "git status --short"
      ],
      "owner": "Implementation owner"
    }
  ],
  "checks_reviewed": [
    {
      "command": "sed -n '1,260p' /Users/tw.kim/.claude/plans/graceful-orbiting-coral.md",
      "status": "PASS",
      "evidence": "Plan contents reviewed read-only."
    },
    {
      "command": "nl -ba AGENTS.md REPO_OPERATIONS.md PROJECT_ENVIRONMENT.md .codex/config.toml",
      "status": "PASS",
      "evidence": "SoT lines for pod-native skills, TDD, local harness limits, pnpm pin, evidence ladder, wm routing, and MCP pins reviewed."
    },
    {
      "command": "rg -n \"pod-role-bootstrap|status\\.json|evidence_ladder|human-gate/v1|wm-orchestrate|eas-evidence/v1|eas-robot-auth-setup|stitch-adc-setup|preflight --pod|docs/plans/work-units\" mobile-app-dev-team/02-role-souls",
      "status": "PASS",
      "evidence": "No matching terms found in current role souls, confirming the drift targeted by the plan."
    },
    {
      "command": "rg -n \"team-doc/mobile-app-dev-team|/workspace/repo\\b\" mobile-app-dev-team docs/CODEX_MCP_ENVIRONMENT.md",
      "status": "PASS",
      "evidence": "/workspace/repo remains in mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:322."
    },
    {
      "command": "git status --short",
      "status": "PASS",
      "evidence": "Dirty baseline reviewed read-only; current changes are broader than a simple future implementation surface."
    },
    {
      "command": "pnpm run validate:team-doc",
      "status": "NOT_APPLICABLE",
      "evidence": "Implementation gate, not required for read-only plan review; plan schedules it for M1-M4 and the review prompt reports the current validator exits 0."
    },
    {
      "command": "pnpm run test:runtime",
      "status": "NOT_APPLICABLE",
      "evidence": "Implementation/baseline gate, not run in read-only plan review; must be rerun after M0 isolation and during planned milestones."
    },
    {
      "command": "pnpm run test:local-harness",
      "status": "NOT_APPLICABLE",
      "evidence": "Future runtime path/harness gate; AGENTS.md:57-60 and REPO_OPERATIONS.md:135-140 say it proves repo-local rules only, not pod execution."
    },
    {
      "command": "pnpm turbo run lint test",
      "status": "NOT_APPLICABLE",
      "evidence": "Future final workspace gate listed in the plan; no app implementation was reviewed."
    }
  ],
  "residual_risks": [
    "Observed Boram pod state was provided in the review prompt and was not re-queried by this read-only review.",
    "Local validators and local harness will not prove actual OrbStack/OpenClaw pod execution; the plan must keep that non-claim explicit.",
    "Final implementation still needs persisted plan-review and final-review evidence under the repo evidence paths before PR readiness."
  ],
  "next_action": "fix_findings"
}
```