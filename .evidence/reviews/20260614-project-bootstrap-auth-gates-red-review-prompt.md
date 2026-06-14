# xhigh RED Coverage Review Prompt

Review mode: plan
Reviewer depth: xhigh

Scope:

- `docs/plans/active/20260614-project-bootstrap-auth-gates-goal.md`
- `evals/skills/project-bootstrap-agent-setup-smoke.sh`
- `scripts/validate-team-doc.mjs`
- Prior reviewer evidence: `.evidence/reviews/20260614-openclaw-bootstrap-auth-gates-corrected-plan-xhigh.md`

Question:

Does the RED coverage added for `project-bootstrap` auth gates sufficiently close
the prior reviewer findings before implementation begins?

Required checks to evaluate:

1. The RED tests explicitly cover missing and unreadable
   `project-bootstrap-agent-setup-report.json`.
2. The RED tests require `project-bootstrap-preflight.sh` to consume the setup
   report as a hard pass/fail input.
3. The RED tests keep Railway auth, gcloud auth, gcloud ADC, Expo MCP auth, and
   Expo CLI auth as separate blockers.
4. The RED tests require install approval before package/system installation.
5. The RED tests require default clone, `/workspace/skills` registration, and
   `/workspace/AGENTS.md` workspace defaults.
6. The RED tests require token-bearing clone URL rejection in both
   project-bootstrap and pod-role-bootstrap, including existing-repo redaction.
7. Validator terms protect the new behavior from silent deletion.

Evidence already run:

- `bash -n evals/skills/project-bootstrap-agent-setup-smoke.sh`: PASS
- `bash evals/skills/project-bootstrap-agent-setup-smoke.sh`: expected RED,
  failed at `case_preflight_blocks_missing_agent_setup_report` because current
  preflight did not return `blocked`.
- `node --check scripts/validate-team-doc.mjs`: PASS
- `node scripts/validate-team-doc.mjs`: expected RED, failed on missing
  preflight/setup/pod-role-bootstrap contract terms.

Return a verdict-producing JSON envelope. Findings must cite source line refs.
