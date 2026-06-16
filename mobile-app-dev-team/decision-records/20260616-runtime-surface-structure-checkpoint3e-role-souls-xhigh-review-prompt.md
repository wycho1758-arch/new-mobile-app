# Checkpoint 3-E Role SOUL XHigh Review Prompt

You are `wm-implementation-reviewer`.

Review mode: final checkpoint review for Checkpoint 3-E only.

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
- Checkpoint 3-D GO:
  `.evidence/reviews/20260616-runtime-surface-structure-checkpoint3d-archive-xhigh-review.md`

Checkpoint under review:

```text
3-E: role-souls/ 이동
```

Command evidence:

```text
.evidence/reviews/20260616-runtime-surface-structure-checkpoint3e-role-souls-command-output.md
```

Expected scope:

- `mobile-app-dev-team/02-role-souls/product-planning-soul.md` ->
  `mobile-app-dev-team/runtime-sources/role-souls/product-planning-soul.md`
- `mobile-app-dev-team/02-role-souls/design-soul.md` ->
  `mobile-app-dev-team/runtime-sources/role-souls/design-soul.md`
- `mobile-app-dev-team/02-role-souls/mobile-architect-soul.md` ->
  `mobile-app-dev-team/runtime-sources/role-souls/mobile-architect-soul.md`
- `mobile-app-dev-team/02-role-souls/mobile-app-dev-soul.md` ->
  `mobile-app-dev-team/runtime-sources/role-souls/mobile-app-dev-soul.md`
- `mobile-app-dev-team/02-role-souls/backend-api-integrator-soul.md` ->
  `mobile-app-dev-team/runtime-sources/role-souls/backend-api-integrator-soul.md`
- `mobile-app-dev-team/02-role-souls/qa-release-soul.md` ->
  `mobile-app-dev-team/runtime-sources/role-souls/qa-release-soul.md`
- Active role SOUL references in source map, team README, role-contract
  reference docs, pod-native runtime specs, repo-local skill references,
  runtime-surface reports, validators, and project-bootstrap smoke fixtures
  align with `runtime-sources/role-souls`.
- Remaining `02-role-souls` references may exist only in the approved goal-plan
  mapping/risk note and in validator legacy/stale checks.

Out of scope for this checkpoint:

- Checkpoint 3-F `09-pod-native-openclaw-skills/` movement.
- Checkpoint 5 `99-source-map.md` -> `source-map.md` filename movement.
- Archive reclassification already approved in Checkpoint 3-D.
- Governance/organization/workflow physical moves already approved in
  Checkpoint 3-B.
- Ref-organization numeric folder movement already approved in Checkpoint 3-C.
- App/package/API/native code changes.
- Live OpenClaw pod proof or external platform proof.

Review tasks:

1. Inspect the staged diff, not just the evidence summary.
2. Verify all six target role SOUL paths exist in the staged index and the old
   `mobile-app-dev-team/02-role-souls/` paths are absent from the staged index.
3. Verify this does not include the Checkpoint 3-F pod-native OpenClaw source
   root move or the Checkpoint 5 source-map filename move.
4. Verify active docs and runtime specs now use
   `mobile-app-dev-team/runtime-sources/role-souls/`.
5. Verify validators require the new target root and reject the old
   `02-role-souls` legacy root.
6. Verify remaining `02-role-souls` references outside `_archive/` are limited
   to the approved goal-plan mapping/risk note and validator legacy/stale checks.
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
8. Identify any finding that should block proceeding to Checkpoint 3-F.

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
    "target": "staged Checkpoint 3-E role SOUL runtime-source move",
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
