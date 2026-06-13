# Cross-Role Skill And Agent Implementation Recommendation

Date: 2026-06-13
Mode: implementation recommendation

## Summary

Add one common pod-native role bridge and one missing repo-local architecture skill first.

Required:

1. `codex-role-workflow` pod-native OpenClaw skill.
2. `mobile-architect-workflow` repo-local Codex skill.
3. Validator and eval coverage for the new role mappings.

Likely reinforcement:

1. `mobile-app-dev-workflow` durable handoff wording.
2. `mobile-backend-api-integrator-workflow` service-evidence/migration/rollback wording.
3. QA/Release synthesis coverage, either by new `qa-release-readiness-workflow` or by reinforcing existing QA skills plus reviewer.

Optional after review:

1. `mobile-architect-reviewer`.
2. `qa-release-readiness-reviewer`.

## 1. Add Pod-Native `codex-role-workflow`

Artifact:

```text
mobile-app-dev-team/09-pod-native-openclaw-skills/codex-role-workflow/SKILL.md
```

Runtime shape:

```text
/workspace/skills/codex-role-workflow/SKILL.md
```

Purpose:

- Run after `project-bootstrap` has prepared the role pod.
- Resolve role identity from `WM_ROLE` or `/workspace/IDENTITY`.
- Verify checked-out repo and required SoT.
- Map role identity to allowed repo-local Codex skills and read-only custom agents.
- Require role-specific durable artifact paths.
- Stop on role mismatch, missing SoT, human gates, out-of-role work, failed-gate risk, missing reviewer, or secret exposure.

It should not implement role work itself.

Default Codex process contract required in the bridge:

1. Read SoT before planning.
2. Stay read-only while planning.
3. Mark missing SoT, external capability, or human approval as `unknown` or `blocked`; do not predict.
4. Produce a role-specific plan packet with scope, owner, affected paths, required handoff inputs, exact work-unit artifact paths, evidence path, tests/evals/validators, gate impact, reviewer target, final reviewer target, and source references.
5. Route the plan to the appropriate read-only reviewer and report the verdict before execution.
6. Execute only after approval and only inside the resolved role boundary.
7. Run final reviewer verification against actual diff, command output, evidence, and intended result.
8. Run `git diff` for changed paths and `git status --short`.
9. Report whether the diff matches the approved plan and what external proof remains unverified.

Minimum role matrix:

| Role | Allowed repo-local skills | Review/research agents | Work-unit stage |
| --- | --- | --- | --- |
| Product/Planning | `po-requirement-office-hours`, `po-work-unit-planning-and-agent-sprint`, `po-prd-to-execution`, `po-planning-completeness-review`, `wm-orchestrate`, `git-workflow` | `po-planning-reviewer`, `po-scope-gate-reviewer`, `po-docs-researcher`, `wm-docs-researcher` | `00-product-planning`, `07-pr` |
| Design | `design-mobile-design-handoff`, `design-stitch-mcp-operating-rules`, `wm-orchestrate`, `git-workflow` | `design-reviewer`, `design-researcher`, `po-planning-reviewer`, `po-scope-gate-reviewer` | `01-design`, `design-pub-html`, selected `DESIGN.md` baseline, same Stitch project, fork/drift evidence |
| Mobile Architect | `mobile-architect-workflow` once added; interim `wm`, `wm-orchestrate`, `git-workflow` | `wm-implementation-reviewer`, `wm-contract-reviewer`, `wm-docs-researcher`, optional `mobile-architect-reviewer` | `02-architecture` |
| Mobile App Dev | `mobile-app-dev-workflow`, `wm-orchestrate`, `git-workflow` | `wm-implementation-reviewer`, `wm-contract-reviewer`, `wm-docs-researcher`, `wm-gate-fix-advisor` | `04-mobile-app` |
| Backend/API Integrator | `mobile-backend-api-integrator-workflow`, `wm-orchestrate`, `git-workflow` | `wm-contract-reviewer`, `wm-docs-researcher`, `wm-gate-fix-advisor` | `03-contract-api` |
| QA/Release | `e2e-test`, `qa-railway-workflow`, `wm-orchestrate`, `git-workflow`, optional `qa-release-readiness-workflow` | `wm-gate-fix-advisor`, `wm-docs-researcher`, optional `qa-release-readiness-reviewer` | `05-qa-release`, canonical `.evidence/e2e-test/*` |

Required sections in `SKILL.md`:

- Purpose and runtime position after bootstrap.
- Source of truth.
- Role identity resolution.
- Repo and skill/agent discovery.
- Role-to-skill matrix.
- Role-to-artifact matrix.
- Reviewer/researcher routing.
- Human gate handling.
- Secret-safety handling.
- External proof limits.
- Output report schema.
- Stop conditions.
- Required validation/evals.

Expected output report:

```json
{
  "schema": "codex-role-workflow/v1",
  "status": "ready | blocked | not_applicable",
  "role": "<resolved-role>",
  "repo_path": "<path>",
  "selected_skill": "<skill-or-null>",
  "allowed_agents": [],
  "required_artifacts": [],
  "stop_reason": null,
  "next_action": "invoke_repo_skill | request_reviewer | request_human_gate | handoff | blocked"
}
```

## 2. Add Repo-Local `mobile-architect-workflow`

Artifact:

```text
.agents/skills/mobile-architect-workflow/SKILL.md
```

Reason:

Mobile Architect is the only active SOUL role with no dedicated repo-local role skill. Current guidance points to `$wm` routing and reviewer outputs, but this is not enough for repeatable architecture work products.

Required workflow:

1. Confirm approved work unit and architecture trigger.
2. Classify task:
   - route/state impact;
   - module boundary;
   - runtime/dependency policy;
   - API contract co-sign;
   - releaseability/EAS strategy;
   - ADR.
3. Read current SoT.
4. Write the correct `02-architecture/*` artifact.
5. Route to `wm-contract-reviewer`, `wm-implementation-reviewer`, `wm-docs-researcher`, or future `mobile-architect-reviewer`.
6. Hand off execution to the owning role.
7. Stop on implementation ownership, backend ownership, human gate, or secret risk.

Required evals:

- Positive: ADR request triggers `mobile-architect-workflow`.
- Positive: route/state impact request triggers `mobile-architect-workflow`.
- Positive: API co-sign request triggers `mobile-architect-workflow`.
- Negative: app implementation request does not trigger architecture workflow.
- Negative: backend service implementation request does not trigger architecture workflow.

## 3. Reinforce Existing Repo-Local Skills

### Design Stitch skills

Reinforce:

- first-step user or Product/Planning approval of the `DESIGN.md` or `design.md` baseline;
- same Stitch project continuation for follow-on work unless an approved fork reason exists;
- manifest metadata: `design_system_baseline`, `design_md_source_path_or_url`, `design_md_hash_or_version`, `stitch_project_id_or_share_link`, `extends_existing_project`, `fork_reason`, `drift_check_result`, and `design_reviewer_verdict_path`;
- drift stop conditions for unapproved token, theme, typography, spacing, component-shape, brand-tone, or prompt/output conflict with `DESIGN.md`;
- evals for missing baseline, mismatched Stitch project, unapproved drift, and approved fork evidence.

### `mobile-app-dev-workflow`

Reinforce:

- accepted task requirement;
- Design handoff requirement for UI;
- `packages/contracts` requirement for API-backed work;
- `Codex Implementation Plan Packet` with work-unit id, route/screen/component, selected Design option, state matrix lines, API contract/mock/fixture path, architecture note path, first test/eval/fixture, selector/testID impact, non-goals, stop conditions, verification commands, evidence path, plan reviewer path, and final reviewer path;
- tests-first requirement;
- `04-mobile-app/*` artifact outputs;
- `status.json` update expectations;
- branch/PR handoff;
- final reviewer before Done and completion report with `git diff` plus `git status --short`.

### `mobile-backend-api-integrator-workflow`

Reinforce:

- contract-only vs mock/fixture vs bounded backend service classification;
- `Codex API Contract Plan Packet` with work-unit id, consuming mobile flow, endpoint/method/path, zod schema names, examples, auth/session/error mapping, mocks/fixtures ownership, compatibility assessment, migration/rollback/service evidence, verification commands, evidence path, plan reviewer path, and final reviewer path;
- `03-contract-api/*` outputs;
- migration note;
- runtime smoke;
- rollback note;
- service evidence;
- QA/Release handoff;
- final reviewer before Done and completion report with `git diff` plus `git status --short`.

### QA/Release skills

Evaluate one of two options:

- Add `qa-release-readiness-workflow` for final readiness synthesis.
- Or reinforce `e2e-test` and `qa-railway-workflow` plus add reviewer coverage.

Use the first option if release readiness frequently needs a single role-owned synthesis artifact. Use the second if release work remains surface-specific and infrequent.

### External-tool official-doc and prompt-template reinforcement

Fragile external tool workflows must contain prompt/runbook templates and official-doc verification rules, not only tool names.

Required pattern for external tools:

1. Identify the external tool and why the role owns it.
2. Check the current official documentation or route uncertainty to the role's docs researcher before execution.
3. Record the source checked, observed capability, unavailable capability, and limitation.
4. Use a role-specific prompt or command template.
5. Capture the exact prompt/command, output artifact path, and redaction rule.
6. Require final reviewer verification against the actual artifact, not the expected tool behavior.

Design-specific Stitch reinforcement should be the first concrete application:

- `design-mobile-design-handoff` and `design-stitch-mcp-operating-rules` should include a Stitch prompt template with approved requirement, platform/route, screen inventory, user goal, task flow, hierarchy, required states, accessibility, `DESIGN.md`, non-goals, implementation constraints, and requested Option A/B output.
- Stitch prompts must include the approved `DESIGN.md` baseline and same Stitch project/project id/share link for continuation work.
- Refinement prompts should be screen/component-specific and limited to one or two major changes.
- Evals should cover official-doc/source capture, prompt template completeness, missing P0 stop, missing P1 stop, no HTML extraction before P1, missing baseline stop, mismatched Stitch project stop, unapproved drift stop, and approved fork metadata.

## 4. Custom Agent Recommendations

### Add `mobile-architect-reviewer` if architecture decisions become recurring

Artifact:

```text
.codex/agents/mobile-architect-reviewer.toml
```

Review scope:

- ADR quality;
- route/state impact;
- runtime/dependency policy;
- API co-sign completeness;
- releaseability risk;
- owner handoff.

### Add `qa-release-readiness-reviewer` only if final release synthesis is added

Artifact:

```text
.codex/agents/qa-release-readiness-reviewer.toml
```

Review scope:

- evidence ladder completeness;
- `05-qa-release/*` links to canonical evidence;
- failed-check routing;
- human-gate status;
- external proof limitations;
- release risk summary.

Do not duplicate `wm-gate-fix-advisor`; keep that agent focused on failure triage.

## 5. Validator And Eval Work

Update `scripts/validate-team-doc.mjs` to check:

- `codex-role-workflow` exists under `09-pod-native-openclaw-skills/`.
- The pod-native README lists the new skill.
- The role matrix covers exactly six SOUL roles.
- Gatekeeper is not listed as a SOUL role.
- Mobile Architect has a dedicated repo-local skill once `mobile-architect-workflow` is added.
- Pod-native skill path and repo-local skill path are not mixed.
- Role mappings include allowed skills, allowed agents, and durable artifact stage.

Add evals under `evals/skills/**`:

- Product/Planning ambiguous intake.
- Design missing P0 stop.
- Mobile Architect ADR routing.
- Mobile App Dev missing Design handoff stop.
- Backend/API UI request stop.
- QA/Release failed-gate human approval stop.

Expected commands after implementation:

```text
pnpm run validate:team-doc
pnpm run test:runtime
pnpm run test:local-harness
pnpm turbo run lint test
```

For this analysis package update, root PR readiness still requires:

```text
pnpm run validate:evidence-hygiene
pnpm run test:runtime
pnpm turbo run lint test
```

`pnpm run test:local-harness` is required when the later implementation changes `.agents`, `.codex`, `evals`, hooks, runtime scripts, `mobile-app-dev-team`, or other local-harness-triggering runtime paths.

## 6. Implementation Order

1. Add failing validator/eval expectations for `codex-role-workflow` and role mappings.
2. Add `codex-role-workflow` pod-native skill source.
3. Update `09-pod-native-openclaw-skills/README.md`.
4. Add failing eval expectations for `mobile-architect-workflow`.
5. Add `mobile-architect-workflow`.
6. Update `04-skills-and-agents-matrix.md`.
7. Decide and add optional reviewers/QA synthesis only if evals or role docs prove the gap.
8. Run validation.
9. Run reviewer.
10. Commit/PR through `git-workflow`.
