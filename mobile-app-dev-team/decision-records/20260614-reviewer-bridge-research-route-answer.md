Direct answer: the authoritative repo SoT for verdict-producing vs advisory agents is clearest in `PROJECT_ENVIRONMENT.md` and is enforced by `scripts/codex-headless-review.mjs`.

Verdict-producing reviewers are:

`wm-implementation-reviewer`, `wm-contract-reviewer`, `po-planning-reviewer`, `po-scope-gate-reviewer`, `design-reviewer`.

Advisory/researcher agents are not valid `--json-envelope` targets: `wm-docs-researcher`, `wm-gate-fix-advisor`, `po-docs-researcher`, `design-researcher`.

Source references:

- [PROJECT_ENVIRONMENT.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app-docgap/PROJECT_ENVIRONMENT.md:340) documents `--json-envelope`, names the five verdict-producing reviewers, and says researcher/advisor agents are advisory and invalid as `--json-envelope` targets.
- [scripts/codex-headless-review.mjs](/Users/tw.kim/Documents/AGA/test/new-mobile-app-docgap/scripts/codex-headless-review.mjs:7) allows the broader set of `wm-*`, `po-*`, and `design-*` agents, including researchers/advisor.
- [scripts/codex-headless-review.mjs](/Users/tw.kim/Documents/AGA/test/new-mobile-app-docgap/scripts/codex-headless-review.mjs:18) defines `verdictProducingReviewers` as exactly the five verdict reviewers.
- [scripts/codex-headless-review.mjs](/Users/tw.kim/Documents/AGA/test/new-mobile-app-docgap/scripts/codex-headless-review.mjs:223) rejects `--json-envelope` when the requested agent is not in `verdictProducingReviewers`.
- [scripts/codex-headless-review.mjs](/Users/tw.kim/Documents/AGA/test/new-mobile-app-docgap/scripts/codex-headless-review.mjs:112) also validates that any emitted envelope’s `reviewer` is verdict-producing.
- [scripts/lib/work-unit-machine.mjs](/Users/tw.kim/Documents/AGA/test/new-mobile-app-docgap/scripts/lib/work-unit-machine.mjs:41) independently uses the same five-agent `verdictReviewers` set for work-unit status validation.
- [mobile-app-dev-team/04-skills-and-agents-matrix.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app-docgap/mobile-app-dev-team/04-skills-and-agents-matrix.md:33) lists current custom agents by type: reviewer, researcher, advisor. It is useful routing SoT, but less explicit than `PROJECT_ENVIRONMENT.md` about machine verdict eligibility.
- [REPO_OPERATIONS.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app-docgap/REPO_OPERATIONS.md:163) defines the Claude reviewer bridge as read-only and says it dispatches to Codex reviewers via `scripts/codex-headless-review.mjs`.

Inconsistency noted: `REPO_OPERATIONS.md` and [.claude/agents/reviewer.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app-docgap/.claude/agents/reviewer.md:35) describe the Claude bridge as verdict-routing only `wm-implementation-reviewer`, `po-planning-reviewer`, and `po-scope-gate-reviewer`, plus `po-docs-researcher` for research. They omit `wm-contract-reviewer` and `design-reviewer`, even though `PROJECT_ENVIRONMENT.md`, `scripts/codex-headless-review.mjs`, and `scripts/lib/work-unit-machine.mjs` all treat those two as verdict-producing reviewers.

Version/fetchedAt: local repo files only; no mirrored Confluence/Jira page was fetched.

Recommended next repo action: align `REPO_OPERATIONS.md` and `.claude/agents/reviewer.md` with the five-agent verdict reviewer set, or explicitly document that the Claude bridge intentionally exposes only a subset while the Codex headless wrapper supports all five.