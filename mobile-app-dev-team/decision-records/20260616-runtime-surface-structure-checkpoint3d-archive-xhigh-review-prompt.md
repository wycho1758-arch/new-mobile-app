# Checkpoint 3-D Archive Reclassification XHigh Review Prompt

You are `wm-implementation-reviewer`.

Review mode: final checkpoint review for Checkpoint 3-D only.

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
- Checkpoint 3-C GO:
  `.evidence/reviews/20260616-runtime-surface-structure-checkpoint3c-ref-organization-xhigh-review.md`

Checkpoint under review:

```text
3-D: _archive/ 재분류
```

Command evidence:

```text
.evidence/reviews/20260616-runtime-surface-structure-checkpoint3d-archive-command-output.md
```

Expected scope:

- `mobile-app-dev-team/_archive/08-role-title-update-plan.md` ->
  `mobile-app-dev-team/_archive/completed-plans/role-title-update-plan.md`
- `mobile-app-dev-team/_archive/09-pod-native-openclaw-skill-plan.md` ->
  `mobile-app-dev-team/_archive/completed-plans/pod-native-openclaw-skill-plan.md`
- `mobile-app-dev-team/_archive/11-openclaw-codex-completion-hooks-plan.md` ->
  `mobile-app-dev-team/_archive/completed-plans/openclaw-codex-completion-hooks-plan.md`
- `mobile-app-dev-team/_archive/12-ref-organization-goal-plan.md` ->
  `mobile-app-dev-team/_archive/completed-plans/ref-organization-goal-plan.md`
- `mobile-app-dev-team/_archive/13-pod-organization-e2e-improvement-plan.md` ->
  `mobile-app-dev-team/_archive/completed-plans/pod-organization-e2e-improvement-plan.md`
- `mobile-app-dev-team/_archive/18-orbstack-pod-config-setup-runbook-plan.md` ->
  `mobile-app-dev-team/_archive/completed-plans/orbstack-pod-config-setup-runbook-plan.md`
- `mobile-app-dev-team/_archive/orbstack-pod-operator-input-request.md` ->
  `mobile-app-dev-team/_archive/completed-plans/orbstack-pod-operator-input-request.md`
- `mobile-app-dev-team/_archive/20260609-structure-inspection-sot.md` ->
  `mobile-app-dev-team/_archive/historical-inspections/20260609-structure-inspection-sot.md`
- `mobile-app-dev-team/_archive/ref-organization-preconsolidation-20260612/` ->
  `mobile-app-dev-team/_archive/preconsolidation/ref-organization-20260612/`
- Current source-map, team README, ref-organization READMEs, and validators
  align with the classified archive paths.
- Remaining old archive paths outside `_archive/` may exist only as explicit
  old-to-new rows in the approved goal plan or as legacyArchivePath fields in
  `scripts/validate-team-doc-structure.mjs`.

Out of scope for this checkpoint:

- Checkpoint 3-E `02-role-souls/` movement.
- Checkpoint 3-F `09-pod-native-openclaw-skills/` movement.
- Checkpoint 5 `99-source-map.md` -> `source-map.md` filename movement.
- Governance/organization/workflow physical moves already approved in
  Checkpoint 3-B.
- Ref-organization numeric folder movement already approved in Checkpoint 3-C.
- App/package/API/native code changes.
- Live OpenClaw pod proof or external platform proof.

Review tasks:

1. Inspect the staged diff, not just the evidence summary.
2. Verify this is a valid Checkpoint 3-D implementation and does not include
   physical movement for Checkpoint 3-E, 3-F, or Checkpoint 5.
3. Verify all target archive paths above exist in the staged index and all old
   root-level archive paths above are absent from the staged index.
4. Verify `mobile-app-dev-team/99-source-map.md`,
   `mobile-app-dev-team/README.md`, and current ref-organization pages use the
   new classified archive paths.
5. Verify validators now require the classified archive paths and reject the old
   root-level archive names for this checkpoint.
6. Verify remaining old archive path references outside `_archive/` are limited
   to the approved goal-plan old-to-new crosswalk and
   `scripts/validate-team-doc-structure.mjs` legacyArchivePath registry.
7. Verify the recorded command evidence is sufficient:
   - RED `pnpm run validate:team-doc` failed before physical move.
   - `pnpm run validate:team-doc` passed after move.
   - `pnpm run test:runtime` passed.
   - `pnpm run test:local-harness` passed.
   - `pnpm run validate:team-doc-archive` passed.
   - `bash evals/skills/openclaw-pod-skills-sync-smoke.sh` passed.
   - `bash evals/skills/project-bootstrap-agent-setup-smoke.sh` passed.
   - `git diff --check` and `git diff --cached --check` passed.
   - `pnpm run validate:evidence-hygiene` passed.
8. Identify any finding that should block proceeding to Checkpoint 3-E.

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
    "target": "staged Checkpoint 3-D archive reclassification",
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
