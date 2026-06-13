Review the SoT-backed interpretation of why the pod-native OpenClaw skills
`codex-cli-auth-setup`, `project-bootstrap`, and `pod-role-bootstrap` remain
separate, and whether it is correct to tell the user that `project-bootstrap`
may orchestrate the flow but should not absorb all responsibilities into one
monolithic skill under current SoT.

Question to verify:

1. Are the three skills intentionally separated by responsibility?
   - `codex-cli-auth-setup`: Codex CLI installation/auth/doctor/precheck,
     secret-safe status reporting.
   - `project-bootstrap`: project-level orchestration, agent-owned deterministic
     setup, status inventory, blocker classification, MCP/role-specific checks,
     human-gate boundaries.
   - `pod-role-bootstrap`: role identity, repo acquisition/check, managed path
     check, pnpm alignment/install, repo-local `codex-preflight --pod`, readiness
     report.

2. Is it correct that current SoT supports starting from `project-bootstrap`
   as the high-level workflow, but `project-bootstrap` still invokes or requires
   the other skills instead of replacing them?

3. Would collapsing all behavior into only `project-bootstrap` conflict with
   current source contracts, validation terms, per-role skill matrix, and
   safety/secret boundaries?

Source files to inspect:

- `AGENTS.md`
- `PROJECT_ENVIRONMENT.md`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/README.md`
- `mobile-app-dev-team/16-pod-environment-bootstrap.md`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/codex-cli-auth-setup/SKILL.md`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-agent-setup.sh`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-preflight.sh`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/pod-role-bootstrap/SKILL.md`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/pod-role-bootstrap/scripts/pod-bootstrap.sh`
- `scripts/validate-repo-operations.mjs`
- `scripts/validate-team-doc.mjs`
- `evals/skills/project-bootstrap-agent-setup-smoke.sh`

Expected reviewer output:

- Verdict: GO only if the interpretation is SoT-backed.
- Findings: list any source contradiction, unsafe merge assumption, missing
  validation evidence, or incorrect claim about execution order.
- Residual risk: distinguish read-only source review from live pod execution.

Draft interpretation to review:

The separation is intentional under current SoT. `project-bootstrap` is the
top-level orchestration skill for pod readiness, but its own SKILL.md says it
does not replace role-specific pod skills. It requires
`codex-cli-auth-setup` and `pod-role-bootstrap` as common setup skills, calls
`codex-cli-auth-setup/scripts/codex-cli-precheck.sh` at the Codex auth step,
and calls `pod-role-bootstrap/scripts/pod-bootstrap.sh` at the repo
checkout/bootstrap step.

This structure keeps high-risk credential/auth checks, project-level blocker
classification, and repo-mutating bootstrap/install work in separate contracts
with separate report schemas and validation coverage. A single
`project-bootstrap` entry point is acceptable as an orchestration UX, but
collapsing the three skills into one implementation would require changing the
SoT, validators, docs, and safety contracts. It is not the current design.
