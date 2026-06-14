Agent: po-scope-gate-reviewer (DECISION request, xhigh)

You are `po-scope-gate-reviewer`, operating read-only (scope containment, human-gate categories, risk acceptance, gatekeeper boundary). SoT gaps that require a new rule are decisions routed to a high-rigor reviewer. DECIDE whether the proposed P-2 and P-3 governance below are SoT-consistent and may be written into `mobile-app-dev-team/19-entry-case-routing.md`, or must be changed. Do not modify files or recursively delegate. Cite source references (path:line). End with exactly one fenced ```json reviewer verdict envelope (reviewer=po-scope-gate-reviewer, mode=scope).

## SoT-verified facts
- Each work unit has its own `status.json` (`wu-status/v1`) and durable handoff root `docs/plans/work-units/<work-unit-id>/` (`mobile-app-dev-team/05-work-processes.md` §1 step 8; `mobile-app-dev-team/06-gates-and-evidence.md` §Durable GitHub Handoff).
- Product/Planning (CPO) owns clarify/size/decompose/route/coordinate; does not implement (`mobile-app-dev-team/03-role-capability-matrix.md` Product/Planning row).
- Human-gate categories include `irreversible-scope-tradeoff`, `business-budget-owner`, `failed-gate-risk`, `production-submit` (`mobile-app-dev-team/06-gates-and-evidence.md` §Human Gates).
- `packages/contracts` is the single API contract SoT; Backend/API owns it; Mobile Architect co-reviews contract impact (`mobile-app-dev-team/05-work-processes.md` §3 steps 2,5; `mobile-app-dev-team/03-role-capability-matrix.md`).
- production-submit requires recorded human approval (`mobile-app-dev-team/05-work-processes.md` §5 step 6).
- bug/issue/failure requests classify as bug-fix/failure-rework/release-evidence-gap/human-gate/symptom-without-evidence; tests-first (`mobile-app-dev-team/05-work-processes.md` §4 step 4).
- QA/Release owns evidence, release-risk summary, failure classification (`mobile-app-dev-team/03-role-capability-matrix.md` QA/Release row).
- GAPS: SoT defines NO cross-work-unit prioritization/conflict rule (P-2), and NO emergency production hotfix fast-path (P-3).

## Proposed P-2 — Cross-work-unit prioritization & conflict (new managed-doc governance filling an ABSENT area)
1. When multiple work units are active, each keeps its own `status.json` and durable handoff root (existing); there is no automatic cross-work-unit preemption.
2. Product/Planning owns prioritization and conflict resolution as scope owner/delivery lead; this is a routing/scope decision, not implementation.
3. Conflicts on shared artifacts: API contract conflicts route to Backend/API Integrator (contracts owner) with Mobile Architect co-review; the contract resolution is recorded in `packages/contracts`.
4. A prioritization decision that changes already-committed scope, or an irreversible scope tradeoff between work units, escalates to the `irreversible-scope-tradeoff` (and, for budget/business, `business-budget-owner`) human gate.
5. Managed-doc note: SoT priority 5; runtime enforcement deferred; does not supersede higher-priority SoT.

## Proposed P-3 — Emergency hotfix: expedited-but-still-gated (NOT a bypass)
1. An emergency hotfix still enters Product/Planning intake and is classified under the issue/bug/failure request category (bug-fix or failure/rework).
2. Tests-first still applies (narrowest failing test/eval first).
3. production-submit STILL requires recorded human approval — there is NO bypass/fast-path that skips the `production-submit` human gate.
4. "Expedited" means Product/Planning MAY prioritize it as the top work unit and compress non-gating steps; it MUST NOT skip required gates, evidence, or human approval.
5. QA/Release owns post-hotfix evidence, release-risk summary, and failure classification.
6. If a gate fails and shipping anyway is proposed, that requires the `failed-gate-risk` human gate (human owner decision).
7. Managed-doc note: SoT priority 5; runtime enforcement deferred; does not supersede higher-priority SoT.

## Decide
- Are P-2 and P-3 SoT-consistent, with no human-gate weakening and no role-boundary collapse? Flag any clause that overstates SoT, invents enforcement, or weakens a gate.
- Verdict GO = approved to write into 19. NO_GO/NEEDS_HUMAN with required corrections otherwise.

## STRICT envelope format
- Each `findings[].source_refs` entry = `path:line` ending in `:<number>` (single line).
- Each `findings[].owner` ∈ {Product/Planning, Design, Mobile Architect, Mobile App Dev, Backend/API Integrator, QA/Release, human}.
- `checks_reviewed[].status` ∈ PASS/FAIL/NOT_RUN/NOT_APPLICABLE (mark validate:team-doc and CI checks NOT_APPLICABLE — decision review, no file change yet).
- `next_action` ∈ proceed/fix_findings/ask_human/rerun_review. GO requires no Critical/High/Medium findings.
- End with exactly one ```json block, nothing after it. reviewer=po-scope-gate-reviewer, mode=scope.
