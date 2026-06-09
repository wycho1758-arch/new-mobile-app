# wm Agent Source Comparison

Source inspected:

- `/Users/tw.kim/Documents/AGA/test/openclaw-cloud/.codex/agents/reviewer.md`
- `/Users/tw.kim/Documents/AGA/test/openclaw-cloud/.codex/agents/research-validator.md`
- `/Users/tw.kim/Documents/AGA/test/openclaw-cloud/.codex/agents/build-error-resolver.md`
- `/Users/tw.kim/Documents/AGA/test/openclaw-cloud/.codex/agents/bug-fixer.md`
- `/Users/tw.kim/Documents/AGA/test/openclaw-cloud/.codex/agents/security-reviewer.md`
- `/Users/tw.kim/Documents/AGA/test/openclaw-cloud/.codex/agents/qa.md`
- `/Users/tw.kim/Documents/AGA/test/openclaw-cloud/.codex/agents/root-cause-finder.md`

Comparison summary:

- openclaw-cloud agents are Markdown files with embedded Claude-style YAML frontmatter and long-form operating contracts.
- this repository's native Codex custom agent source of truth is `.codex/agents/<agent-name>.toml`, as documented in `AGENTS.md` and validated by `scripts/validate-runtime-artifacts.mjs`.
- openclaw-cloud `reviewer.md` is an orchestration agent with Graphify, Claude headless primary, Codex fallback, expert fan-out, and JSON verdict semantics.
- wm reviewer agents are intentionally narrower: direct read-only review/research/triage agents only, no Claude fallback, no `--engine auto`, no Graphify dependency, no recursive delegation.
- openclaw-cloud `research-validator.md` contributed the source credibility, recency, consistency, and coverage rubric used by `wm-docs-researcher`.
- openclaw-cloud `security-reviewer.md` contributed source-cited severity ordering, path:line expectations, and risk-surface thinking used by `wm-contract-reviewer`.
- openclaw-cloud `qa.md` contributed implementation verification, evidence, test execution, and source-cited report expectations used by `wm-implementation-reviewer`.
- openclaw-cloud `build-error-resolver.md` and `root-cause-finder.md` contributed full error capture, categorization, root-cause analysis, and smallest-fix guidance used by `wm-gate-fix-advisor`.
- openclaw-cloud `bug-fixer.md` reinforced the TDD expectation, but write/edit behavior was not copied because wm reviewer agents are read-only.

Applied changes:

- `.codex/agents/wm-implementation-reviewer.toml` now has explicit Contract, ordered Review workflow, Output, and Non-goals sections.
- `.codex/agents/wm-contract-reviewer.toml` now has explicit contract review criteria, owner handoff expectations, and contract drift reporting.
- `.codex/agents/wm-docs-researcher.toml` now has explicit research validation criteria adapted from `research-validator.md`.
- `.codex/agents/wm-gate-fix-advisor.toml` now has explicit gate triage workflow adapted from build/root-cause agent patterns while remaining advisory-only.

Excluded on purpose:

- Claude headless primary execution, `--engine auto`, and `review_engine_preference` fallback.
- Graphify/OpenClaw runtime dependencies.
- Edit/Write permissions, mutating commands, or automatic fixes.
- Broad orchestration and fan-out behavior from `reviewer.md`; wm routing keeps each reviewer/advisor narrow and direct.
