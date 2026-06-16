# Checkpoint 3-C Ref Organization XHigh Review Prompt

You are `wm-implementation-reviewer`.

Review mode: final checkpoint review for Checkpoint 3-C only.

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
- Checkpoint 3-B GO after rereview:
  `.evidence/reviews/20260616-runtime-surface-structure-checkpoint3b-governance-workflows-xhigh-rereview.md`

Checkpoint under review:

```text
3-C: ref-organization/ 숫자 제거
```

Command evidence:

```text
.evidence/reviews/20260616-runtime-surface-structure-checkpoint3c-ref-organization-command-output.md
```

Expected scope:

- `mobile-app-dev-team/ref-organization/00-orientation-and-sot/` ->
  `mobile-app-dev-team/ref-organization/orientation-and-sot/`
- `mobile-app-dev-team/ref-organization/01-organization-model/` ->
  `mobile-app-dev-team/ref-organization/organization-model/`
- `mobile-app-dev-team/ref-organization/02-runtime-surfaces/` ->
  `mobile-app-dev-team/ref-organization/runtime-surfaces/`
- `mobile-app-dev-team/ref-organization/03-role-contracts-and-capabilities/` ->
  `mobile-app-dev-team/ref-organization/role-contracts-and-capabilities/`
- `mobile-app-dev-team/ref-organization/04-workflows-and-handoffs/` ->
  `mobile-app-dev-team/ref-organization/workflows-and-handoffs/`
- `mobile-app-dev-team/ref-organization/05-skills-agents-and-tools/` ->
  `mobile-app-dev-team/ref-organization/skills-agents-and-tools/`
- `mobile-app-dev-team/ref-organization/06-gates-evidence-and-audit/` ->
  `mobile-app-dev-team/ref-organization/gates-evidence-and-audit/`
- `mobile-app-dev-team/ref-organization/07-repo-template-and-runtime/` ->
  `mobile-app-dev-team/ref-organization/repo-template-and-runtime/`
- `mobile-app-dev-team/ref-organization/08-new-organization-template/` ->
  `mobile-app-dev-team/ref-organization/new-organization-template/`
- `mobile-app-dev-team/ref-organization/99-source-map-and-migration/` ->
  `mobile-app-dev-team/ref-organization/source-map-and-migration/`
- Current ref-organization links, source-map references, report references,
  archive/reference validator path, and ref-organization validators align with
  the new non-numeric paths.
- Structure registry legacyPath/crosswalk rows may still contain old paths as
  explicit old-to-new registry/crosswalk context.

Out of scope for this checkpoint:

- Checkpoint 3-D `_archive/` reclassification.
- Checkpoint 3-E `02-role-souls/` movement.
- Checkpoint 3-F `09-pod-native-openclaw-skills/` movement.
- Checkpoint 5 `99-source-map.md` -> `source-map.md` filename movement.
- App/package/API/native code changes.
- Live OpenClaw pod proof or external platform proof.

Review tasks:

1. Inspect the staged diff, not just the evidence summary.
2. Verify this is a valid Checkpoint 3-C implementation and does not include
   physical movement for Checkpoint 3-D, 3-E, 3-F, or Checkpoint 5.
3. Verify all ten ref-organization target folders exist in the staged index and
   all ten numeric ref-organization folders are absent from the staged index.
4. Verify `mobile-app-dev-team/ref-organization/README.md`,
   `mobile-app-dev-team/99-source-map.md`,
   `mobile-app-dev-team/reports/runtime-surface-classification-improvement-report.md`,
   and current ref-organization pages use the new non-numeric paths.
5. Verify validators now enforce target paths and reject numeric section
   folders.
6. Verify remaining old ref-organization paths outside `_archive/` are limited
   to explicit old-to-new context in the goal-plan crosswalk and
   `scripts/validate-team-doc-structure.mjs` legacyPath registry.
7. Verify the recorded command evidence is sufficient:
   - RED `pnpm run validate:team-doc` failed before physical move.
   - `pnpm run validate:team-doc` passed after move.
   - `pnpm run test:runtime` passed.
   - `pnpm run test:local-harness` passed.
   - `pnpm run validate:team-doc-archive` passed.
   - `bash evals/skills/openclaw-pod-skills-sync-smoke.sh` passed.
   - `bash evals/skills/project-bootstrap-agent-setup-smoke.sh` passed.
   - `git diff --check && git diff --cached --check` passed.
   - `pnpm run validate:evidence-hygiene` passed.
8. Identify any finding that should block proceeding to Checkpoint 3-D.

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
    "target": "staged Checkpoint 3-C ref-organization numeric folder removal",
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
