# Checkpoint 3-F Pod-Native Source Root XHigh Review Prompt

You are `wm-implementation-reviewer`.

Review mode: final checkpoint review for Checkpoint 3-F only.

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
- Checkpoint 3-E GO after rereview:
  `.evidence/reviews/20260616-runtime-surface-structure-checkpoint3e-role-souls-xhigh-rereview.md`

Checkpoint under review:

```text
3-F: pod-native-openclaw-skills/ move to runtime-sources/pod-native-openclaw-skills/
```

Command evidence:

```text
.evidence/reviews/20260616-runtime-surface-structure-checkpoint3f-pod-native-command-output.md
```

Expected scope:

- Move every file under
  `mobile-app-dev-team/09-pod-native-openclaw-skills/` to
  `mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/`.
- Update active pod-native source references in root policy docs, project
  environment docs, repo operations docs, source map, team README, runtime
  surface/reference reports, durable work-unit docs, validators, `.claude`
  memory, and smoke fixtures.
- Update `openclaw-pod-skills-sync` and `project-bootstrap` source-root
  defaults to use
  `mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills`.
- Validators must require the new target root and fail when the old
  `mobile-app-dev-team/09-pod-native-openclaw-skills` root exists.
- Remaining `09-pod-native-openclaw-skills` references may exist only in the
  approved goal-plan mapping/risk note, validator legacy/stale checks, and the
  invalid legacy-only structure fixture.

Out of scope for this checkpoint:

- Checkpoint 5 `99-source-map.md` -> `source-map.md` filename movement.
- Role SOUL movement already approved in Checkpoint 3-E.
- Archive reclassification already approved in Checkpoint 3-D.
- Governance/organization/workflow physical moves already approved in
  Checkpoint 3-B.
- Ref-organization numeric folder movement already approved in Checkpoint 3-C.
- App/package/API/native code changes.
- Live OpenClaw pod proof or external platform proof.

Review tasks:

1. Inspect the staged diff, not just the evidence summary.
2. Verify all old pod-native source-root files are staged as moves to
   `runtime-sources/pod-native-openclaw-skills/`.
3. Verify the old `mobile-app-dev-team/09-pod-native-openclaw-skills/` root has
   no staged index entries.
4. Verify this does not include the Checkpoint 5 source-map filename move.
5. Verify `openclaw-pod-skills-sync` and `project-bootstrap` now default to the
   new source root, including smoke fixtures.
6. Verify active docs and runtime specs now use
   `mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/`.
7. Verify validators require the new target root and reject the old legacy root.
8. Verify remaining `09-pod-native-openclaw-skills` references outside
   `_archive/` and `.evidence/` are limited to the approved goal-plan
   mapping/risk note, validator legacy/stale checks, and the invalid
   legacy-only structure fixture.
9. Verify the recorded command evidence is sufficient:
   - RED `pnpm run validate:team-doc` failed before physical move.
   - `pnpm run validate:team-doc` passed after move.
   - `pnpm run test:runtime` passed.
   - `pnpm run test:local-harness` passed.
   - `pnpm run validate:team-doc-archive` passed.
   - `bash evals/skills/openclaw-pod-skills-sync-smoke.sh` passed.
   - `bash evals/skills/project-bootstrap-agent-setup-smoke.sh` passed.
   - `git diff --check` and `git diff --cached --check` passed.
   - `pnpm run validate:evidence-hygiene` passed.
10. Identify any finding that should block proceeding to Checkpoint 4.

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
    "target": "staged Checkpoint 3-F pod-native runtime-source move",
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
