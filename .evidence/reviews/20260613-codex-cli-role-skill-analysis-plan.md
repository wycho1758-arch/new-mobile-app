# Codex CLI Role Skill Analysis Report Plan

Date: 2026-06-13
Mode: planning-only
Requested workflow: `$wm`

## Objective

Prepare a detailed SoT-grounded analysis report plan to determine whether
`mobile-app-dev-team/**` currently contains a complete skill for pod role agents
to professionally use Codex CLI repo-local skills (`.agents/skills`) and custom
agents (`.codex/agents`) according to each role SOUL.

The analysis must treat the six `mobile-app-dev-team/02-role-souls/*-soul.md`
files as the pod-agent role set. Each role agent is assumed to run in an
independent OpenClaw/OrbStack pod or VPC-like runtime with no shared local
storage. Durable handoff must therefore use GitHub branch/commit/PR or committed
work-unit artifacts.

## SoT Inputs To Use

- `AGENTS.md`: repo rules, runtime paths, `.agents/skills` and `.codex/agents`
  ownership, gates, constraints.
- `REPO_OPERATIONS.md`: root-owned policy, OpenClaw/Codex operational
  boundaries, Codex-only repo work policy for pods.
- `PROJECT_ENVIRONMENT.md`: current Codex runtime facts and required gates.
- `mobile-app-dev-team/00-sot-and-principles.md`: current SoT priority and
  active-vs-historical skill rules.
- `mobile-app-dev-team/99-source-map.md`: current source map, role crosswalk,
  historical skill crosswalk, pod-isolated handoff notes.
- `mobile-app-dev-team/02-role-souls/*.md`: six active role SOUL contracts.
- `mobile-app-dev-team/04-skills-and-agents-matrix.md`: active repo-local skill
  and custom agent matrix.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/README.md`: pod-native
  OpenClaw skill matrix and runtime path separation.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/*/SKILL.md`: existing
  pod-native skill contracts.
- `mobile-app-dev-team/10-github-artifact-workflow.md`: pod-isolated durable
  handoff workflow.
- `mobile-app-dev-team/16-pod-environment-bootstrap.md`: fresh pod
  zero-to-ready sequence.
- `mobile-app-dev-team/17-orbstack-pod-config-values.md`: non-secret pod
  configuration values, owner/operator inputs, and live-pod proof limits.
- `mobile-app-dev-team/ref-organization/02-runtime-surfaces/README.md`:
  reusable runtime-surface boundaries, including `/workspace/codex-hooks`.
- `docs/CREDENTIALS.md`: credential ownership, delegation, and secret-safety
  boundaries.
- `docs/TEMPLATE_VARIABLES.md`: template/runtime variable handling and
  public-vs-secret configuration boundaries.
- Actual `.agents/skills/*/SKILL.md` and `.codex/agents/*.toml`: active
  Codex CLI skill and custom agent contracts.
- Validators and runtime evidence sources when needed:
  `scripts/validate-team-doc.mjs`, `scripts/test-local-harness.mjs`,
  relevant `evals/**`.

## Analysis Questions

1. Inventory: Which role SOULs exist, which repo-local Codex skills exist, which
   custom agents exist, and which pod-native OpenClaw skills exist?
2. Placement: Does `mobile-app-dev-team/**` correctly distinguish pod-native
   OpenClaw skills (`/workspace/skills/<slug>/SKILL.md`) from repo-local Codex
   skills (`.agents/skills/<skill-name>/SKILL.md`) and custom agents
   (`.codex/agents/<agent-name>.toml`)?
3. Bootstrap readiness: Do current pod-native skills cover Codex CLI
   install/auth/preflight, managed paths, repo checkout, role identity, MCP
   status, and role-specific external setup without exposing secrets?
4. Role operation readiness: Does any current skill tell every SOUL-based pod
   agent how to choose and use its own professional Codex CLI skill(s), when to
   call read-only reviewers/researchers, how to respect role boundaries, and how
   to produce durable GitHub handoff artifacts?
5. Completeness by role: For Product/Planning, Design, Mobile Architect, Mobile
   App Dev, Backend/API Integrator, and QA/Release, is there a clear mapping from
   SOUL responsibilities to repo-local Codex skills, custom agents, evidence
   paths, and handoff outputs?
6. Gap classification: If a complete role-aware Codex CLI operating skill is
   missing, is it already covered by an existing SoT document, should an existing
   pod-native skill be expanded, or should a new pod-native skill be proposed?
7. Necessity judgment: Given independent pods/VPC-like isolation and the need
   for each SOUL agent to operate Codex CLI professionally, is a dedicated skill
   necessary, optional, or not justified?

## Completeness Criteria

Classify the current state as complete only if the documentation and active
runtime contracts cover all of the following:

- Six active SOUL roles are explicitly recognized and no Gatekeeper SOUL is
  introduced.
- The skill explains that repo work in pods must be routed through Codex CLI
  against the checked-out repo, not performed by editing external runtime repos.
- It explains how a role pod discovers available `.agents/skills` and
  `.codex/agents` from the checked-out repo.
- It maps each role to the repo-local Codex skills it may use and the
  read-only reviewer/researcher agents it should call.
- It distinguishes setup readiness (`project-bootstrap`, `pod-role-bootstrap`,
  `codex-cli-auth-setup`) from actual role-work execution through repo-local
  Codex skills.
- It covers independent pod/VPC-like operation, no shared storage, GitHub
  branch/commit/PR handoff, and `docs/plans/work-units/<work-unit-id>/` durable
  artifacts.
- It requires SoT-grounded planning, tests/evals/validators before
  implementation, command evidence, reviewer evidence, and no self-approval
  where applicable.
- It explains human gates and external-platform proof limits without claiming
  local validation proves live pod, GitHub, EAS, Stitch, or device behavior.
- It is secret-safe and does not ask users to paste tokens or credentials.
- It is validated by existing or proposed deterministic checks if a future
  implementation is recommended.

## Planned Report Structure

1. Executive verdict: complete / partial / missing, with direct answer to
   whether a dedicated skill is needed.
2. SoT basis: concise list of source files and what each proves.
3. Inventory table:
   - six SOUL roles
   - active repo-local Codex skills
   - active `.codex/agents`
   - active pod-native OpenClaw skills
4. Coverage matrix by role:
   - SOUL responsibility
   - current repo-local skill(s)
   - current reviewer/researcher agent(s)
   - pod-native setup prerequisites
   - durable handoff artifacts
   - coverage verdict
5. Runtime-surface separation findings:
   - `.agents/skills`
   - `.codex/agents`
   - `/workspace/skills`
   - `/workspace/codex-hooks`
6. Gap analysis:
   - missing role-aware Codex CLI operating instructions
   - ambiguous or duplicated guidance
   - validator/eval coverage gaps
   - external/live-pod proof gaps
7. Recommendation:
   - no change, update existing skill, or create new pod-native skill
   - proposed scope and non-goals if a new skill is needed
   - expected validator/eval evidence for any later implementation
8. Residual risks and blocked items.

## Reviewer Plan

Use `wm-implementation-reviewer` in read-only plan mode because this is a
repo-runtime documentation and skill-routing analysis plan. The reviewer should
check whether the plan:

- uses the correct SoT hierarchy;
- respects pod-native vs repo-local Codex boundaries;
- covers all six SOUL roles and excludes Gatekeeper SOUL creation;
- accounts for independent pod/VPC-like runtime and GitHub durable handoff;
- asks the right completeness questions before recommending any implementation;
- avoids ungrounded claims and external-platform proof overreach.

No implementation, commit, PR, or merge is in scope for this planning-only turn.
