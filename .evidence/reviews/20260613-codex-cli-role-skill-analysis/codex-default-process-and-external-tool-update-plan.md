# Codex Default Process And External Tool Skill Update Plan

Date: 2026-06-13
Request: Update the role-specific Codex use analysis documents so each role has a concrete Codex operating process, external-tool official-documentation requirements, and deeper role-specific improvement guidance. English documents must be updated first, reviewed, and only then mirrored into Korean.

## Scope

Update the existing analysis package under `.evidence/reviews/20260613-codex-cli-role-skill-analysis/`.

English-first targets:

- `00-index-and-executive-verdict.md`
- `01-product-planning-codex-use-skill-analysis.md`
- `02-design-codex-use-skill-analysis.md`
- `03-mobile-architect-codex-use-skill-analysis.md`
- `04-mobile-app-dev-codex-use-skill-analysis.md`
- `05-backend-api-integrator-codex-use-skill-analysis.md`
- `06-qa-release-codex-use-skill-analysis.md`
- `07-cross-role-skill-agent-implementation-recommendation.md`
- `08-reviewer-checklist-and-final-verdict.md`

Korean mirror targets after English reviewer pass:

- `ko/00-index-and-executive-verdict.ko.md`
- `ko/01-product-planning-codex-use-skill-analysis.ko.md`
- `ko/02-design-codex-use-skill-analysis.ko.md`
- `ko/03-mobile-architect-codex-use-skill-analysis.ko.md`
- `ko/04-mobile-app-dev-codex-use-skill-analysis.ko.md`
- `ko/05-backend-api-integrator-codex-use-skill-analysis.ko.md`
- `ko/06-qa-release-codex-use-skill-analysis.ko.md`
- `ko/07-cross-role-skill-agent-implementation-recommendation.ko.md`
- `ko/08-reviewer-checklist-and-final-verdict.ko.md`

Non-goals:

- Do not create or update actual `.agents/skills`, `.codex/agents`, or pod-native OpenClaw skills in this work. These documents are the detailed analysis package that will guide later skill/agent creation.
- Do not modify external repositories or external platform configuration.
- Do not introduce runtime behavior changes.

## SoT And Official Documentation Basis

Local SoT:

- `AGENTS.md`: TDD, no direct push to `main`, repo runtime paths, required gates, Codex runtime artifact paths.
- `.agents/skills/wm/SKILL.md`: `$wm` SoT-grounded planning, read-only planning stage, no prediction, reviewer plan gate, final reviewer gate, evidence path, git diff/status before final report.
- `REPO_OPERATIONS.md`: Codex/OpenClaw path taxonomy, pod-native skill boundary, repo-local Codex skill/agent boundary, evidence gate ownership.
- `mobile-app-dev-team/05-work-processes.md`: role flow for Product/Planning, Design, API readiness, implementation, QA/release, and failure loop.
- `mobile-app-dev-team/06-gates-and-evidence.md`: required evidence, mobile evidence ladder, durable GitHub handoff, human gates.
- Existing role analysis documents in `.evidence/reviews/20260613-codex-cli-role-skill-analysis/`.
- `skill-creator`: skill update quality principles: concise body, progressive disclosure, references for detailed material, deterministic scripts/evals where reliability matters, validation by realistic artifacts.

Official external-tool basis to cite in the updated documents where relevant:

- Google Stitch product page: `https://stitch.withgoogle.com/`
- Google Developers Blog Stitch introduction: `https://developers.googleblog.com/stitch-a-new-way-to-design-uis/`
- Google Codelab for Stitch MCP design-to-code workflow: `https://codelabs.developers.google.com/design-to-code-with-antigravity-stitch`
- Google AI Developers Forum Stitch Prompt Guide: `https://discuss.ai.google.dev/t/stitch-prompt-guide/83844`
- Google Blog 2026 Stitch update / DESIGN.md mention: `https://blog.google/innovation-and-ai/models-and-research/google-labs/stitch-ai-ui-design/`

Official documentation conclusion for this plan:

- Stitch must be documented as an external tool whose use requires official-doc verification at the time of use, not memory-based operation.
- Stitch MCP workflow guidance must include prompt construction, not only MCP invocation names.
- Prompt guidance should require clear, concise, role-bounded prompts; screen/component-specific iteration; explicit UI/UX terms; one or two major changes per refinement; source-backed DESIGN.md context; and no credentials or secrets.
- When the official docs do not expose a capability through the current MCP surface, the role must record the limitation instead of assuming the capability.

## Required Cross-Document Update

Add a package-level invariant to `00-index-and-executive-verdict.md` and `07-cross-role-skill-agent-implementation-recommendation.md`:

1. Read the applicable SoT before planning.
2. Stay read-only while planning; do not modify files, prompts, skills, agents, or external systems during planning.
3. Do not predict missing facts. Mark missing SoT or external capability as unknown or blocked.
4. Produce a concrete plan with scope, owner role, affected paths, evidence path, verification, reviewer target, human gates, and source references.
5. Send the plan to the appropriate reviewer. Use xhigh/deep review when the user requests it.
6. Report the plan and reviewer verdict before execution.
7. Execute only after plan approval and when no human gate blocks the work.
8. After work is completed, send the actual diff, command output, evidence, and intended result to the reviewer for final verification.
9. Run `git diff` for the changed paths and `git status --short`.
10. Report whether the diff matches the approved direction, with evidence paths and any residual risks.

## Role-Specific English Updates

### Product/Planning

Update `01-product-planning-codex-use-skill-analysis.md` with a role-specific Codex process section:

- Product/Planning must convert ambiguous requests into facts, assumptions, unknowns, non-goals, human gates, and a bounded work-unit plan before any execution task is created.
- Planning must be read-only until reviewer validation is complete.
- The plan reviewer should be `po-planning-reviewer` for package completeness and `po-scope-gate-reviewer` for scope/human-gate decisions.
- The final reviewer must check that the produced PRD/story/work-unit artifacts match the approved plan before handoff.
- Required skill reinforcement: Product/Planning skills should include a default "SoT -> read-only plan -> reviewer -> user report -> approved execution/handoff -> final reviewer -> git diff/status" loop.
- Process usability basis: Product/Planning is the role that prevents downstream pods from acting on vague or over-broad instructions.

### Design

Update `02-design-codex-use-skill-analysis.md` with deeper external-tool guidance:

- Design must use Stitch only after approved Product/Planning input, P0 approval, and current `DESIGN.md` decision.
- Before a Stitch MCP or Stitch prompt action, Design must verify current official Stitch docs or route uncertainty to `design-researcher`.
- The Design skill must include prompt templates, not only the tool sequence.
- Prompt template must include: approved requirement, target platform/route, screen inventory, user goal, task flow, information hierarchy, required states, accessibility intent, design-system reference, non-goals, implementation constraints, and requested output.
- Refinement prompts must be one screen/component and one or two changes at a time, using clear UI/UX terminology.
- The skill must record the exact prompt, official-doc/source references used, MCP capability observed, output links, and limitations in the manifest/handoff.
- Existing Design skills should be reinforced to include this official-doc and prompt contract.

### Mobile Architect / Technical Lead

Update `03-mobile-architect-codex-use-skill-analysis.md`:

- Architecture work must start with SoT-backed read-only decision framing before dependency, runtime, route, API, or evidence architecture changes.
- External tools/docs such as Expo, EAS, NativeWind, React Native, Codex runtime, and MCP integrations must be checked through official docs or `wm-docs-researcher` when current behavior is uncertain.
- Architecture skill reinforcement should include an Architecture Decision Record prompt template: decision, SoT facts, options, tradeoffs, affected roles, evidence ladder impact, contracts, rejected alternatives, and reviewer target.
- Final reviewer must verify that the selected architecture can be executed by downstream roles without guessing.

### Mobile App Developer

Update `04-mobile-app-dev-codex-use-skill-analysis.md`:

- Implementation must follow SoT-backed planning and TDD before code changes.
- The role must not start coding from an unreviewed plan or from Design/API assumptions.
- The skill should require explicit pre-code checks: approved requirement/design/API contract, affected paths, tests to add first, mobile selectors, evidence ladder, and gate impact.
- Final reviewer must compare actual code/test diff against the approved plan before handoff.
- `git diff` and `git status --short` must be part of the user-facing completion report.

### Backend/API Integrator

Update `05-backend-api-integrator-codex-use-skill-analysis.md`:

- API work must be contract-first from `packages/contracts`.
- External service/tool usage such as Railway, auth providers, database tooling, or deployment CLIs must require official-doc verification or `wm-docs-researcher`/`wm-contract-reviewer` routing.
- Skill reinforcement should include an API contract prompt/checklist template: endpoint, schemas, auth/session, errors, mocks, fixtures, migration impact, rollback, mobile consumption, and QA evidence.
- The final reviewer must verify that app/API/client changes do not create ad-hoc contract duplicates.

### QA/Release

Update `06-qa-release-codex-use-skill-analysis.md`:

- QA/Release must create a read-only evidence plan before running tools.
- External tools such as EAS, Maestro, Railway, Playwright, mobile-mcp, and store/release systems must require official-doc or repo-SoT verification before execution.
- Skill reinforcement should include command/prompt runbook templates: target environment, reset step, command, expected artifact path, pass/fail classifier, owner routing, and redaction rule.
- Production submit, privacy, legal, payment, messaging, and failed-gate risk must remain human-gated.
- Final reviewer must compare evidence produced against the plan and evidence ladder.

## Cross-Role Skill/Agent Recommendation Update

Update `07-cross-role-skill-agent-implementation-recommendation.md`:

- `codex-role-workflow` must contain the default Codex operating process contract.
- Role-specific repo-local skills must contain or reference concise prompt templates for fragile external tool workflows.
- Detailed official-tool docs and prompt examples should live in skill `references/` files, not bloated `SKILL.md` bodies, per `skill-creator` progressive-disclosure guidance.
- Validators/evals should assert that role workflow skills mention plan review, final review, and git diff/status before report.
- Design skill/eval reinforcement must explicitly test Stitch prompt contract, P0/P1 stops, official-doc source capture, and no HTML extraction before P1.

## Reviewer Checklist Update

Update `08-reviewer-checklist-and-final-verdict.md`:

- Add reviewer checks for default Codex operating process completeness.
- Add checks for external-tool official-doc verification and prompt template completeness.
- Add role-specific checks that the documented process lets the role act without guessing.
- Add final bilingual parity check after Korean update.

## Execution Order

1. Write this detailed plan.
2. Run reviewer(xhigh/deep) on this plan through `wm-implementation-reviewer` and persist the result at `.evidence/reviews/20260613-codex-cli-role-skill-analysis/codex-default-process-and-external-tool-update-plan-review.json`.
3. If the reviewer returns findings, update the plan and rerun review until pass.
4. Update English documents only.
5. Run reviewer(xhigh/deep) on English updates and persist the result at `.evidence/reviews/20260613-codex-cli-role-skill-analysis/english-codex-process-update-review.json`.
6. If English reviewer passes, update Korean documents to mirror the approved English content.
7. Run final reviewer(xhigh/deep) on bilingual updates and persist the result at `.evidence/reviews/20260613-codex-cli-role-skill-analysis/final-codex-process-bilingual-update-review.json`.
8. Run applicable local verification for evidence/document changes and PR readiness.
9. Run `git diff` for this analysis package and `git status --short`.
10. Report changed files, reviewer verdicts, command results, and any residual risks to the user.

## Applicable Verification

Required for this documentation/evidence update:

- Plan review:
  - Command shape: `node scripts/codex-headless-review.mjs --json-envelope --agent wm-implementation-reviewer --prompt <xhigh plan review prompt> --out .evidence/reviews/20260613-codex-cli-role-skill-analysis/codex-default-process-and-external-tool-update-plan-review.json`
  - Status required before English updates: `GO`.
- English update review:
  - Command shape: `node scripts/codex-headless-review.mjs --json-envelope --agent wm-implementation-reviewer --prompt <xhigh English update review prompt> --out .evidence/reviews/20260613-codex-cli-role-skill-analysis/english-codex-process-update-review.json`
  - Status required before Korean updates: `GO`.
- Final bilingual review:
  - Command shape: `node scripts/codex-headless-review.mjs --json-envelope --agent wm-implementation-reviewer --prompt <xhigh final bilingual review prompt> --out .evidence/reviews/20260613-codex-cli-role-skill-analysis/final-codex-process-bilingual-update-review.json`
  - Status required before final user report: `GO`.
- `pnpm run validate:evidence-hygiene`
- `pnpm run test:runtime`
- `pnpm turbo run lint test`
- `git diff -- .evidence/reviews/20260613-codex-cli-role-skill-analysis`
- `git status --short`

Source-backed not applicable unless files outside the analysis evidence package are changed:

- `pnpm run test:local-harness`
- Mobile app, EAS, Maestro, Railway, and mobile-mcp gates.

Rationale:

- `validate:evidence-hygiene` is a targeted evidence check, but it does not replace root PR readiness gates.
- `test:runtime` and `pnpm turbo run lint test` are retained because `AGENTS.md` requires runtime verification and workspace lint/tests before PR readiness.
- `test:local-harness` is not required for this plan unless the work changes `.agents`, `.codex`, `evals`, hooks, runtime scripts, `mobile-app-dev-team`, or other local-harness-triggering runtime paths.
