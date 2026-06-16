# Checkpoint 3-B Governance Organization Workflows XHigh Review Prompt

You are `wm-implementation-reviewer`.

Review mode: final checkpoint review for Checkpoint 3-B only.

Reasoning effort: xhigh.

Repository:

```text
/Users/tw.kim/Documents/AGA/test/new-mobile-app
```

Branch:

```text
chore/openclaw-pod-skills-sync
```

Baseline:

```text
3551319c01ded8d0996e824699df3953d7b69b92
```

Approved prior gates:

- Plan GO:
  `.evidence/reviews/20260615-runtime-surface-structure-goal-plan-xhigh-rereview.md`
- Checkpoint 1 GO:
  `.evidence/reviews/20260615-runtime-surface-structure-checkpoint1-xhigh-review.md`
- Checkpoint 2 GO:
  `.evidence/reviews/20260615-runtime-surface-structure-checkpoint2-xhigh-review.md`
- Checkpoint 3-A GO:
  `.evidence/reviews/20260615-runtime-surface-structure-checkpoint3a-reports-xhigh-review.md`

Checkpoint under review:

```text
3-B: governance/organization/workflows 이동
```

Command evidence:

```text
.evidence/reviews/20260616-runtime-surface-structure-checkpoint3b-governance-workflows-command-output.md
```

Expected scope:

- Governance docs moved:
  - `mobile-app-dev-team/00-sot-and-principles.md` ->
    `mobile-app-dev-team/governance/sot-and-principles.md`
  - `mobile-app-dev-team/06-gates-and-evidence.md` ->
    `mobile-app-dev-team/governance/gates-and-evidence.md`
  - `mobile-app-dev-team/15-human-ops-live-readiness-annex.md` ->
    `mobile-app-dev-team/governance/human-ops-live-readiness-annex.md`
  - `mobile-app-dev-team/20-app-eas-ota-rollback-runbook.md` ->
    `mobile-app-dev-team/governance/app-eas-ota-rollback-runbook.md`
- Organization docs moved:
  - `mobile-app-dev-team/01-team-composition.md` ->
    `mobile-app-dev-team/organization/team-composition.md`
  - `mobile-app-dev-team/03-role-capability-matrix.md` ->
    `mobile-app-dev-team/organization/role-capability-matrix.md`
  - `mobile-app-dev-team/07-new-team-template-guide.md` ->
    `mobile-app-dev-team/organization/new-team-template-guide.md`
- Workflow docs moved:
  - `mobile-app-dev-team/05-work-processes.md` ->
    `mobile-app-dev-team/workflows/work-processes.md`
  - `mobile-app-dev-team/10-github-artifact-workflow.md` ->
    `mobile-app-dev-team/workflows/github-artifact-workflow.md`
  - `mobile-app-dev-team/14-native-e2e-strategy.md` ->
    `mobile-app-dev-team/workflows/native-e2e-strategy.md`
  - `mobile-app-dev-team/19-entry-case-routing.md` ->
    `mobile-app-dev-team/workflows/entry-case-routing.md`
- Updated current indexes and validators to target paths.
- Updated current references in `.agents/skills/**`, pod-native runtime docs,
  work-unit docs, ref-organization indexes, and deterministic validator comments
  where they pointed at moved current files.
- Kept `_archive/` untouched for this checkpoint.

Out of scope for this checkpoint:

- `99-source-map.md` -> `source-map.md` filename movement.
- `02-role-souls/` movement.
- `04-skills-and-agents-matrix.md` movement.
- `09-pod-native-openclaw-skills/` movement.
- `16-pod-environment-bootstrap.md` and
  `17-orbstack-pod-config-values.md` movement.
- `ref-organization/` physical folder rename.
- `_archive/` reclassification.
- Harness narrowing.
- Live OpenClaw pod proof or external platform proof.

Review tasks:

1. Inspect the staged diff, not just the evidence summary.
2. Verify this is a valid Checkpoint 3-B implementation and does not
   accidentally include future Checkpoint 3-C/3-D/3-E/3-F or Checkpoint 4/5
   scope.
3. Verify the moved governance, organization, and workflow docs are present at
   the target paths and old top-level paths are absent from the index.
4. Verify `README.md`, `99-source-map.md`, validators, current Codex/pod-native
   references, and durable work-unit references align with the moved paths.
5. Verify old 3-B filenames outside `_archive/` remain only in explicit
   historical/crosswalk contexts, especially the goal-plan rename crosswalk.
6. Verify `_archive/` has no staged or unstaged diff for this checkpoint.
7. Verify runtime-source movement did not occur.
8. Verify the recorded command evidence is sufficient:
   - RED `pnpm run validate:team-doc` failed before physical move.
   - `pnpm run validate:team-doc` passed after move.
   - `pnpm run test:runtime` passed.
   - `pnpm run test:local-harness` passed on the cleaned state.
   - `bash evals/skills/openclaw-pod-skills-sync-smoke.sh` passed.
   - `bash evals/skills/project-bootstrap-agent-setup-smoke.sh` passed.
   - `git diff --check && git diff --cached --check` passed.
   - `pnpm run validate:evidence-hygiene` passed.
9. Identify any finding that should block proceeding to Checkpoint 3-C.

Required final output:

- Start with findings, ordered by severity.
- If there are no findings, state that clearly.
- End with exactly one final fenced `json` block.
- The fenced JSON block must be the final content in the file.
- Use this schema:

```json
{
  "verdict": "GO | NO_GO | NEEDS_HUMAN | BLOCKED",
  "reviewer": "wm-implementation-reviewer",
  "mode": "final",
  "scope": {
    "baseline": "3551319c01ded8d0996e824699df3953d7b69b92",
    "target": "staged Checkpoint 3-B governance/organization/workflows movement",
    "paths_reviewed": []
  },
  "findings": [],
  "checks_reviewed": [
    {
      "command": "git status --short --branch",
      "status": "PASS | FAIL | NOT_APPLICABLE",
      "evidence": ""
    }
  ],
  "residual_risks": [],
  "next_action": "proceed | fix_findings | request_human | stop"
}
```

Verdict rules:

- `GO` only if there are no Critical/High/Medium/Low findings that should block
  the next checkpoint.
- `GO` requires `findings: []`.
- For `GO`, every `checks_reviewed.status` must be `PASS` or
  `NOT_APPLICABLE`.
- `NO_GO` if repo-local fixes are needed before the next checkpoint.
- `NEEDS_HUMAN` only for a real human approval or external proof boundary.
- `BLOCKED` only for a true impasse.
