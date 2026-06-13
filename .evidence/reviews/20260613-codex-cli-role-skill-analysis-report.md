# Codex CLI Role Skill Coverage Analysis Report

Date: 2026-06-13
Mode: analysis report
Scope: `mobile-app-dev-team/**`, `.agents/skills/**`, `.codex/agents/**`
Baseline commit: `afd9208adde3c1721c0ea7c5ea0e87af96e2b926`

## Executive Verdict

Current state: **PARTIAL, not complete**.

The repository has strong building blocks for role-based Codex work:

- six active SOUL roles under `mobile-app-dev-team/02-role-souls/`;
- active repo-local Codex skills under `.agents/skills/`;
- read-only custom agents under `.codex/agents/`;
- pod-native setup skills under `mobile-app-dev-team/09-pod-native-openclaw-skills/`;
- GitHub durable handoff rules under `docs/plans/work-units/<work-unit-id>/`.

However, `mobile-app-dev-team/**` does **not** currently contain a complete
pod-native skill that tells each independent SOUL-based pod agent how to operate
Codex CLI for its **own role work** end to end.

The missing part is not generic "how to use Codex CLI". The missing part is a
role-aware Codex operating skill that answers:

- I am `Product/Planning`, `Design`, `Mobile Architect`, `Mobile App Dev`,
  `Backend/API Integrator`, or `QA/Release`; which repo-local Codex skill do I
  invoke through Codex CLI?
- Which reviewer/researcher agents are allowed for my role?
- Which artifacts must I read and write?
- When must I stop for another role, a reviewer, Gatekeeper, or a human gate?
- How do I hand off from an isolated pod/VPC-like runtime with no shared local
  storage?

Recommendation: **create a new pod-native OpenClaw skill** under
`mobile-app-dev-team/09-pod-native-openclaw-skills/`, tentatively named
`codex-role-workflow` or `role-codex-cli-workflow`.

Do not overload `project-bootstrap` with this. `project-bootstrap` is a readiness
orchestration skill; role work execution should be a separate pod-native skill
that runs after readiness.

## SoT Basis

Primary SoT used:

- `AGENTS.md`: separates pod-native OpenClaw skills from Codex skills/agents,
  defines `.agents/skills` and `.codex/agents`, requires TDD, branch/PR gates,
  and forbids direct `main` push or external runtime repo edits.
- `REPO_OPERATIONS.md`: defines root-owned policy, pod-native
  `/workspace/skills/<slug>/SKILL.md`, repo-local `.agents/skills` and
  `.codex/agents`, Codex-only repo work policy for pods, secret safety, and
  external-proof limits.
- `PROJECT_ENVIRONMENT.md`: defines current Codex runtime facts and required
  root gates.
- `mobile-app-dev-team/00-sot-and-principles.md`: defines SoT priority and says
  only actual `.agents/skills/<slug>/SKILL.md` entries are active repo skills.
- `mobile-app-dev-team/99-source-map.md`: confirms current source map, role
  crosswalk, active-vs-historical skill handling, and no Gatekeeper SOUL.
- `mobile-app-dev-team/02-role-souls/*.md`: defines six active role identities,
  responsibilities, boundaries, tools, and routing.
- `mobile-app-dev-team/04-skills-and-agents-matrix.md`: lists active repo-local
  skills and current custom agents.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/README.md`: lists current
  pod-native skills and per-role pod-native setup dependencies.
- `mobile-app-dev-team/10-github-artifact-workflow.md`: defines independent
  pod/VPC-like handoff through GitHub branch/commit/PR and committed work-unit
  artifacts.
- `mobile-app-dev-team/16-pod-environment-bootstrap.md`: defines fresh pod
  zero-to-ready setup, owner/operator values, and setup/report boundaries.
- `mobile-app-dev-team/17-orbstack-pod-config-values.md`,
  `docs/CREDENTIALS.md`, `docs/TEMPLATE_VARIABLES.md`, and
  `mobile-app-dev-team/ref-organization/02-runtime-surfaces/README.md`:
  secondary SoT for pod config values, secret boundaries, public-vs-secret
  runtime variables, and `/workspace/codex-hooks`.

## Inventory

### Active SOUL Roles

The active role set is exactly six SOUL files:

| Role | SOUL path | Main responsibility |
| --- | --- | --- |
| Product/Planning | `mobile-app-dev-team/02-role-souls/product-planning-soul.md` | Clarify requests, size work, define handoffs, route human gates. |
| Design | `mobile-app-dev-team/02-role-souls/design-soul.md` | Produce Stitch-backed design handoff and implementation-ready UX artifacts. |
| Mobile Architect | `mobile-app-dev-team/02-role-souls/mobile-architect-soul.md` | Review architecture, route/state/runtime impact, ADRs, releaseability risk. |
| Mobile App Dev | `mobile-app-dev-team/02-role-souls/mobile-app-dev-soul.md` | Implement approved Expo React Native work tests-first. |
| Backend/API Integrator | `mobile-app-dev-team/02-role-souls/backend-api-integrator-soul.md` | Own `packages/contracts`, API integration, mocks/fixtures, backend service scope when approved. |
| QA/Release | `mobile-app-dev-team/02-role-souls/qa-release-soul.md` | Plan/run/report QA and release evidence, route failures by owner. |

Gatekeeper is not a SOUL role. It is a deterministic system gate.

### Active Repo-Local Codex Skills

Active repo-local skills are actual `.agents/skills/<slug>/SKILL.md` files.

| Skill | Role fit |
| --- | --- |
| `wm` | Cross-role repo workflow: SoT planning, TDD, reviewer routing, evidence, PR readiness. |
| `wm-orchestrate` | Cross-role deterministic next-action resolver from work-unit `status.json`. |
| `git-workflow` | Cross-role branch/commit/PR/reviewer/status guardrails. |
| `po-requirement-office-hours` | Product/Planning clarification. |
| `po-work-unit-planning-and-agent-sprint` | Product/Planning work-unit sizing and sprint shaping. |
| `po-prd-to-execution` | Product/Planning PRD/work-unit decomposition into role tasks. |
| `po-planning-completeness-review` | Product/Planning readiness review before execution. |
| `design-mobile-design-handoff` | Design Stitch-backed mobile handoff. |
| `design-stitch-mcp-operating-rules` | Design Stitch MCP operating constraints. |
| `mobile-app-dev-workflow` | Mobile App Dev implementation. |
| `mobile-backend-api-integrator-workflow` | Backend/API Integrator contract/API work. |
| `e2e-test` | QA/Release E2E evidence workflow. |
| `qa-railway-workflow` | QA/Release Railway/deployed API evidence workflow. |

### Active Custom Agents

Current `.codex/agents/*.toml` includes:

- `wm-implementation-reviewer`
- `wm-contract-reviewer`
- `wm-docs-researcher`
- `wm-gate-fix-advisor`
- `po-planning-reviewer`
- `po-scope-gate-reviewer`
- `po-docs-researcher`
- `design-reviewer`
- `design-researcher`
- legacy `mobile-*` reviewers/researchers/advisors for non-`$wm` or older
  runtime/eval surfaces.

The dedicated `$wm` routing set is `wm-*`, `po-*`, and `design-*`. Legacy
`mobile-*` agents remain present but are not the preferred `$wm` route unless a
newer SoT says otherwise.

### Current Pod-Native OpenClaw Skills

Current pod-native skill source lives under
`mobile-app-dev-team/09-pod-native-openclaw-skills/` and runs in pods as
`/workspace/skills/<slug>/SKILL.md`.

| Pod-native skill | Current purpose | Role-work execution coverage |
| --- | --- | --- |
| `project-bootstrap` | Project-level readiness orchestration, role identity, managed path, MCP/status checks, setup reports. | Readiness only; not a role-work execution skill. |
| `pod-role-bootstrap` | Role identity, repo checkout/install, `codex-preflight --pod`, readiness report. | Readiness only. |
| `codex-cli-auth-setup` | Install/verify Codex CLI auth and no-approval smoke. | Codex CLI availability only. |
| `stitch-adc-setup` | Design-specific Google ADC/Stitch readiness status. | External/tool readiness only. |
| `eas-robot-auth-setup` | QA/Release EAS/Expo robot auth readiness status. | External/tool readiness only. |

## Role-by-Role Codex CLI Operating Standard

This is the level a complete skill must teach a pod agent. It is intentionally
role-focused rather than generic Codex CLI usage.

### Product/Planning

Primary Codex use:

- Use Codex CLI from the checked-out repo to run Product/Planning repo-local
  skills.
- Start from user/request intake and produce bounded work-unit artifacts before
  execution roles start.
- Use `wm-orchestrate` when a committed or branch-local `status.json` should
  determine the next allowed role action.

Allowed primary skills:

- `po-requirement-office-hours`
- `po-work-unit-planning-and-agent-sprint`
- `po-prd-to-execution`
- `po-planning-completeness-review`
- `wm-orchestrate`
- `git-workflow` for branch/PR handoff

Allowed read-only agents:

- `po-planning-reviewer`
- `po-scope-gate-reviewer`
- `po-docs-researcher`
- `wm-docs-researcher` for technical/runtime uncertainty that affects planning

Required artifacts:

- `docs/plans/work-units/<work-unit-id>/00-product-planning/*`
- `docs/plans/work-units/<work-unit-id>/status.json`
- `docs/plans/work-units/<work-unit-id>/07-pr/story-pr-plan.md` when PR
  planning is in scope

Stop conditions:

- unclear request that needs user clarification;
- human gate for production submit, payment, PII/privacy, external messaging,
  legal/terms, compliance, budget/business decision, irreversible scope tradeoff,
  or accepting failed-gate risk;
- execution role work is needed. Product/Planning must not implement app,
  backend, design, migration, release operation, or runtime code.

Current coverage:

- SOUL and repo-local skills are strong.
- The missing piece is pod-native instruction for how the Product/Planning pod
  invokes those repo-local skills through Codex CLI after bootstrap.

### Design

Primary Codex use:

- Use Codex CLI to run Design repo-local skills only after Product/Planning
  approved scope/evidence gates.
- Use Stitch as canonical design output, with P0 before generation and P1 before
  HTML extraction.
- Use status-only `stitch-adc-setup` before approved Stitch work.

Allowed primary skills:

- `design-mobile-design-handoff`
- `design-stitch-mcp-operating-rules`
- `wm-orchestrate` when work-unit state determines the next action
- `git-workflow` for artifact branch/PR handoff

Allowed read-only agents:

- `design-reviewer`
- `design-researcher`
- `po-planning-reviewer` only for Product/Planning packet readiness, not design
  quality

Required artifacts:

- `docs/plans/work-units/<work-unit-id>/01-design/*`
- `design-pub-html/<YYYY-MM-DD>/<work-unit-id>/option-a.html`
- `design-pub-html/<YYYY-MM-DD>/<work-unit-id>/option-a.png`
- `design-pub-html/<YYYY-MM-DD>/<work-unit-id>/option-b.html`
- `design-pub-html/<YYYY-MM-DD>/<work-unit-id>/option-b.png`
- `design-pub-html/<YYYY-MM-DD>/<work-unit-id>/manifest.json`
- `design-pub-html/<YYYY-MM-DD>/<work-unit-id>/handoff.md`

Stop conditions:

- missing P0 approval before Stitch generation;
- missing P1 approval before HTML extraction;
- unresolved `DESIGN.md` decision;
- design requires API, route, release, or scope decision outside Design authority;
- missing Stitch/ADC readiness when the work requires Stitch.

Current coverage:

- Design has the strongest role-specific repo-local Codex skill coverage.
- Missing piece is still pod-native role-work execution glue: the Design pod is
  told which skills exist, but not given a single pod-native Codex CLI operation
  procedure from SOUL identity to Codex invocation to GitHub handoff.

### Mobile Architect

Primary Codex use:

- Use Codex CLI for architecture review, route/state/runtime impact analysis,
  ADR or risk notes, and releaseability decisions tied to approved work.
- Use `$wm` planning/review routing when architecture affects implementation,
  API contracts, runtime choices, releaseability, or downstream handoff.

Allowed primary skills:

- `wm`
- `wm-orchestrate`
- `git-workflow`

Allowed read-only agents:

- `wm-implementation-reviewer`
- `wm-contract-reviewer`
- `wm-docs-researcher`
- `wm-gate-fix-advisor` for failing gate/evidence triage

Required artifacts:

- `docs/plans/work-units/<work-unit-id>/02-architecture/architecture-note.md`
- `docs/plans/work-units/<work-unit-id>/02-architecture/route-state-impact.md`
- `docs/plans/work-units/<work-unit-id>/02-architecture/api-contract-cosign.md`
- `docs/plans/work-units/<work-unit-id>/02-architecture/releaseability-risk.md`
- `docs/plans/work-units/<work-unit-id>/02-architecture/adr.md`

Stop conditions:

- implementation ownership would move to Mobile Architect;
- backend/API service ownership would move to Mobile Architect;
- architecture decision changes release behavior, EAS strategy, or dependency
  policy without proper owner/human input;
- failed-gate risk acceptance is proposed without human approval.

Current coverage:

- This is the weakest current role in active repo-local skill coverage.
- There is no dedicated `mobile-architect-workflow` repo-local skill.
- The SOUL tells Mobile Architect to use `$wm` routing and reviewer outputs, but
  there is no role-specific Codex skill that translates architecture ownership
  into a repeatable command/evidence workflow.
- A new pod-native role Codex workflow skill should either define the Mobile
  Architect path explicitly or recommend a separate repo-local
  `mobile-architect-workflow` if repeated architecture work needs a stronger
  contract.

### Mobile App Dev

Primary Codex use:

- Use Codex CLI to run the Mobile App Dev implementation workflow only for
  approved execution tasks.
- Confirm accepted Design handoff and `packages/contracts` before app code.
- Write/update tests, evals, fixtures, selector checks, or validator assertions
  before implementation.

Allowed primary skills:

- `mobile-app-dev-workflow`
- `wm`
- `wm-orchestrate`
- `git-workflow`

Allowed read-only agents:

- `wm-implementation-reviewer`
- `wm-docs-researcher`
- `wm-contract-reviewer` when API contract drift matters
- `wm-gate-fix-advisor` when gates fail

Required artifacts:

- app diff under `apps/mobile/**` only when approved;
- tests/selectors/fixtures/evidence updated with the implementation;
- `docs/plans/work-units/<work-unit-id>/04-mobile-app/*`;
- command output and reviewer evidence before Done.

Stop conditions:

- missing/ambiguous Design handoff, API contract, fixture, acceptance criteria,
  or owner;
- backend/API work is required;
- design quality work is required;
- release/QA ownership is required;
- any attempt to self-approve.

Current coverage:

- Repo-local skill coverage is good.
- Missing piece is pod-native role-aware Codex CLI instruction showing exactly
  how a Mobile App Dev pod transitions from `pod-role-bootstrap` to Codex CLI
  execution of `mobile-app-dev-workflow`, reviewer evidence, branch/PR handoff,
  and downstream QA/Release handoff.

### Backend/API Integrator

Primary Codex use:

- Use Codex CLI to operate on API contracts, mocks, fixtures, and bounded
  backend service work only when approved.
- Keep `packages/contracts` as single source of truth.
- Make API work visible before Mobile App Dev consumes it.

Allowed primary skills:

- `mobile-backend-api-integrator-workflow`
- `wm`
- `wm-orchestrate`
- `git-workflow`

Allowed read-only agents:

- `wm-contract-reviewer`
- `wm-docs-researcher`
- `wm-implementation-reviewer` only when implementation-scope evidence or PR
  readiness crosses into mobile/runtime concerns

Required artifacts:

- `packages/contracts/**` for shared schemas/types;
- optional `apps/api/**` only when backend service work is approved;
- `docs/plans/work-units/<work-unit-id>/03-contract-api/*`;
- contract drift review evidence;
- runtime smoke, rollback, migration, and service evidence when backend service
  scope exists.

Stop conditions:

- React Native UI work is needed;
- API types would be duplicated outside `packages/contracts`;
- production credentials/private endpoints are required;
- migration has irreversible or production-risk impact without approval;
- mock/fixture behavior diverges from real API behavior.

Current coverage:

- Repo-local skill coverage is good for contracts/API.
- Missing pod-native role-work skill should explain how this pod invokes
  contract workflow through Codex CLI, when it must call `wm-contract-reviewer`,
  and how it hands off to Mobile App Dev and QA/Release through GitHub artifacts.

### QA/Release

Primary Codex use:

- Use Codex CLI for QA planning, reset, execution evidence, release evidence,
  failure classification, and risk reporting.
- QA routes fixes; QA does not implement fixes.
- Use status-only `eas-robot-auth-setup` before human-gated EAS/Maestro work.

Allowed primary skills:

- `e2e-test`
- `qa-railway-workflow`
- `wm-orchestrate`
- `git-workflow`

Allowed read-only agents:

- `wm-gate-fix-advisor`
- `wm-docs-researcher`
- `wm-implementation-reviewer` when reviewing evidence/PR readiness
- legacy `mobile-gate-fix-advisor` and `mobile-docs-researcher` only for
  non-`$wm` runtime/eval surfaces where current docs still allow them

Required artifacts:

- `.evidence/e2e-test/<YYYYMMDD-HHMMSS>-<slug>/`;
- `docs/plans/work-units/<work-unit-id>/05-qa-release/*`;
- `eas-evidence/v1` ingest artifacts when approved EAS/Maestro output is used;
- failure classification with owner and failed check reference.

Stop conditions:

- simulator/device/external service unavailable;
- gate failure requires another owner to fix;
- production submit or failed-gate risk acceptance is required;
- evidence might expose secrets or private endpoints.

Current coverage:

- QA/Release has strong repo-local skill coverage for E2E and Railway.
- Missing piece is a pod-native role-work procedure connecting SOUL identity,
  `eas-robot-auth-setup`, Codex CLI skill invocation, evidence capture,
  reviewer/advisor routing, and GitHub handoff.

## Cross-Role Findings

### Finding 1: Setup Is Covered, Role Work Execution Is Not

Current pod-native skills answer:

- Is Codex CLI installed/authenticated?
- Is the repo checkout present?
- Is the managed path configured?
- Is the role identity resolvable?
- Are role-specific auth/status surfaces ready?

They do not answer:

- I am this SOUL role; which Codex skill should I invoke now?
- How do I invoke it through Codex CLI from the checked-out repo?
- Which reviewer/researcher do I call?
- Which work-unit files do I write?
- How do I avoid another role's ownership?

This is the core gap.

### Finding 2: Role SOULs Mention Tools, But They Are Not a Pod-Native Operating Skill

The SOUL files list role tools and routing. That is useful but insufficient for
independent pods because a SOUL is an identity/role contract, not a procedural
runtime skill. A pod agent needs a repeatable skill under `/workspace/skills`
that can be invoked after bootstrap and can translate the SOUL role into a
Codex CLI action.

### Finding 3: Current Repo-Local Skills Are Not Directly Pod-Native

`.agents/skills` are active Codex CLI repo-local skills. They are available only
after the repo is checked out and Codex CLI is run from that repo context.

They are not the same thing as `/workspace/skills/<slug>/SKILL.md`, and the
current pod-native skill set does not yet provide a role-aware bridge from one
surface to the other.

### Finding 4: Mobile Architect Is a Role-Coverage Outlier

Product/Planning, Design, Mobile App Dev, Backend/API Integrator, and QA/Release
have clear role-named repo-local skills. Mobile Architect does not. It currently
uses `$wm`, reviewers, `wm-orchestrate`, and work-unit artifacts.

This may be acceptable if architecture work remains advisory/review-oriented.
It becomes a gap if Mobile Architect is expected to repeatedly produce
architecture notes, ADRs, route/state impact, or releaseability risk artifacts
through a predictable Codex workflow.

### Finding 5: Durable Handoff Rules Exist, But They Are Not Coupled to Role Codex Execution

`10-github-artifact-workflow.md` correctly states that no shared storage is
assumed and that downstream pods consume GitHub branch/PR contents. It also
defines per-role artifact folders.

The missing skill should make this operational: after a role runs its Codex CLI
workflow, it should update the role's work-unit folder, run applicable checks,
request reviewer evidence, and hand off through branch/commit/PR.

## Required Shape of the Missing Skill

Recommended pod-native skill:

```text
mobile-app-dev-team/09-pod-native-openclaw-skills/codex-role-workflow/
  SKILL.md
  references/report-template.md
  scripts/role-codex-workflow-preflight.sh   # optional
```

Runtime shape:

```text
/workspace/skills/codex-role-workflow/SKILL.md
```

Required behavior:

1. Confirm `project-bootstrap` and `pod-role-bootstrap` readiness reports exist
   or clearly report what is missing.
2. Resolve role from `WM_ROLE` or `/workspace/IDENTITY`.
3. Read the repo checkout's `AGENTS.md`, `REPO_OPERATIONS.md`,
   `PROJECT_ENVIRONMENT.md`, `mobile-app-dev-team/04-skills-and-agents-matrix.md`,
   the matching role SOUL, and `10-github-artifact-workflow.md`.
4. Confirm Codex CLI will operate in
   `/workspace/projects/Wondermove-Inc/new-mobile-app/`, not in an external
   runtime repository.
5. Map role to allowed repo-local skills and allowed read-only agents.
6. Map role to durable work-unit artifacts.
7. Require SoT-grounded planning before role work.
8. Require tests/evals/validators first for implementation roles.
9. Require reviewer evidence before Done when applicable.
10. Stop on human gates, role mismatch, missing work-unit state, missing
    required design/API/QA evidence, or external platform proof gaps.
11. Never print secrets or ask users to paste tokens.
12. Record a status-only role Codex workflow report under `/workspace/state/`.

Non-goals:

- Do not replace `.agents/skills/*`; it invokes/points to them.
- Do not merge all role logic into one mega implementation skill.
- Do not perform Design, Mobile App Dev, Backend/API, or QA work inside the
  pod-native skill itself.
- Do not create a Gatekeeper SOUL.
- Do not claim live pod, GitHub branch protection, EAS, Stitch, Jira,
  Confluence, or mobile-device behavior from local validation alone.

## Suggested Role Mapping for the Missing Skill

| Role | Repo-local skills to expose | Review/research route | Durable output root |
| --- | --- | --- | --- |
| Product/Planning | `po-requirement-office-hours`, `po-work-unit-planning-and-agent-sprint`, `po-prd-to-execution`, `po-planning-completeness-review`, `wm-orchestrate`, `git-workflow` | `po-planning-reviewer`, `po-scope-gate-reviewer`, `po-docs-researcher` | `00-product-planning/`, `07-pr/` |
| Design | `design-mobile-design-handoff`, `design-stitch-mcp-operating-rules`, `wm-orchestrate`, `git-workflow` | `design-reviewer`, `design-researcher` | `01-design/`, `design-pub-html/<date>/<work-unit-id>/` |
| Mobile Architect | `wm`, `wm-orchestrate`, `git-workflow` | `wm-implementation-reviewer`, `wm-contract-reviewer`, `wm-docs-researcher` | `02-architecture/` |
| Mobile App Dev | `mobile-app-dev-workflow`, `wm`, `wm-orchestrate`, `git-workflow` | `wm-implementation-reviewer`, `wm-docs-researcher`, `wm-contract-reviewer`, `wm-gate-fix-advisor` | `04-mobile-app/` plus app/test diffs |
| Backend/API Integrator | `mobile-backend-api-integrator-workflow`, `wm`, `wm-orchestrate`, `git-workflow` | `wm-contract-reviewer`, `wm-docs-researcher` | `03-contract-api/` plus `packages/contracts/**` and optional `apps/api/**` |
| QA/Release | `e2e-test`, `qa-railway-workflow`, `wm-orchestrate`, `git-workflow` | `wm-gate-fix-advisor`, `wm-docs-researcher`, `wm-implementation-reviewer` | `05-qa-release/`, `.evidence/e2e-test/**` |

## Validation Expectations If Implemented Later

If the repo adds this skill, implementation must be tests-first:

1. Add validator assertions to `scripts/validate-team-doc.mjs` requiring:
   - the new pod-native skill source directory;
   - runtime shape `/workspace/skills/<slug>/SKILL.md`;
   - six-role mapping;
   - no Gatekeeper SOUL;
   - `.agents/skills` and `.codex/agents` separation;
   - GitHub durable handoff;
   - secret-safe wording;
   - setup-vs-role-work distinction.
2. Add or update an eval smoke test under `evals/skills/` to check the role
   mapping and failure modes.
3. Update `mobile-app-dev-team/09-pod-native-openclaw-skills/README.md` to list
   the new skill as a post-bootstrap role-work skill, not a setup dependency.
4. Update `mobile-app-dev-team/04-skills-and-agents-matrix.md` only if needed to
   reference the pod-native bridge without confusing it with repo-local skills.
5. Run:
   - `pnpm run validate:team-doc`
   - `pnpm run test:runtime`
   - `pnpm run test:local-harness`
   - `pnpm turbo run lint test` if any workspace code path changes

## Final Judgment

The current repository is **not missing Codex CLI setup**. It is missing a
**role-aware Codex CLI operating skill for independent OpenClaw pods**.

Without that skill, a sophisticated agent can infer the path from SOUL files,
the skill matrix, repo-local skills, reviewers, and GitHub artifact workflow.
But the user requirement is stronger: every SOUL.md pod agent should already
know, at a professional level, how to use Codex CLI for its role. At that level,
inference from scattered docs is not enough.

Therefore:

- Current coverage: **partial**.
- Dedicated new skill needed: **yes**.
- Best placement: **pod-native OpenClaw skill source under
  `mobile-app-dev-team/09-pod-native-openclaw-skills/`**.
- Best responsibility: **post-bootstrap role Codex workflow bridge** from
  SOUL role identity to repo-local Codex skill/agent usage and durable GitHub
  handoff.
- Do not replace existing repo-local skills or reviewers.
- Do not create a Gatekeeper SOUL.
