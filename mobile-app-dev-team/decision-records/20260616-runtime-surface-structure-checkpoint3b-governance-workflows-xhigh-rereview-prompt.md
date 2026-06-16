# Checkpoint 3-B Governance Organization Workflows XHigh Rereview Prompt

You are `wm-implementation-reviewer`.

Review mode: narrow rereview for Checkpoint 3-B after an initial `NO_GO`.

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

Initial Checkpoint 3-B review:

```text
.evidence/reviews/20260616-runtime-surface-structure-checkpoint3b-governance-workflows-xhigh-review.md
```

Initial verdict:

```text
NO_GO
```

Initial blocking finding:

- Medium: durable work-unit task packet still used moved 3-B filenames as
  current references, especially under
  `docs/plans/work-units/codex-role-workflow-runtime-routing/00-product-planning/task-packet.md`.

Follow-up command evidence:

```text
.evidence/reviews/20260616-runtime-surface-structure-checkpoint3b-governance-workflows-command-output.md
```

Follow-up fix scope:

- Updated active work-unit references from old numeric filenames to new
  structured paths:
  - `mobile-app-dev-team/workflows/entry-case-routing.md`
  - `mobile-app-dev-team/workflows/work-processes.md`
  - `mobile-app-dev-team/workflows/github-artifact-workflow.md`
  - `mobile-app-dev-team/governance/gates-and-evidence.md`
  - `mobile-app-dev-team/governance/app-eas-ota-rollback-runbook.md`
- Updated the tracked work-unit evidence row/command output text that named
  `19-entry-case-routing.md` as a current missing term, replacing it with the
  current structured path.
- Added follow-up evidence documenting:
  - focused `docs/plans/work-units` stale-reference scan with no matches;
  - broad non-archive scan with remaining matches only in the goal-plan
    crosswalk;
  - rerun `validate:team-doc`, `test:runtime`, `test:local-harness`,
    pod-native smokes, whitespace check, and evidence hygiene.
- Ignored local planning notes under `docs/plans/active/**` are not part of
  the staged checkpoint artifact set.

Approved prior gates:

- Plan GO:
  `.evidence/reviews/20260615-runtime-surface-structure-goal-plan-xhigh-rereview.md`
- Checkpoint 1 GO:
  `.evidence/reviews/20260615-runtime-surface-structure-checkpoint1-xhigh-review.md`
- Checkpoint 2 GO:
  `.evidence/reviews/20260615-runtime-surface-structure-checkpoint2-xhigh-review.md`
- Checkpoint 3-A GO:
  `.evidence/reviews/20260615-runtime-surface-structure-checkpoint3a-reports-xhigh-review.md`

Review tasks:

1. Inspect the staged diff, especially the follow-up changes since the initial
   3-B `NO_GO`.
2. Verify the initial Medium finding is fixed: active durable work-unit packet
   references must no longer use moved 3-B filenames as current references.
3. Verify the focused stale-reference scan for `docs/plans/work-units` is
   sufficient for this finding.
4. Verify the broad non-archive scan exclusion for ignored
   `docs/plans/active/**` is acceptable because that path is ignored and not
   part of the staged artifact set.
5. Verify the follow-up edits did not introduce new Checkpoint 3-C/3-D/3-E/3-F
   or Checkpoint 4/5 scope.
6. Verify the rerun validation evidence is sufficient:
   - `pnpm run validate:team-doc` passed.
   - `pnpm run test:runtime` passed.
   - `pnpm run test:local-harness` passed.
   - `bash evals/skills/openclaw-pod-skills-sync-smoke.sh` passed.
   - `bash evals/skills/project-bootstrap-agent-setup-smoke.sh` passed.
   - `git diff --check && git diff --cached --check` passed.
   - `pnpm run validate:evidence-hygiene` passed.
7. Identify any finding that should block proceeding to Checkpoint 3-C.

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
  "mode": "rereview",
  "scope": {
    "baseline": "3551319c01ded8d0996e824699df3953d7b69b92",
    "target": "staged Checkpoint 3-B governance/organization/workflows movement follow-up after NO_GO",
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
