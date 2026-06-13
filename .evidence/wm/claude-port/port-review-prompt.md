# Review request: verify the Claude Code port of WonderMove Codex skills & agents

Mode: final. Operate read-only. Verify that the new `.claude/` artifacts are a faithful,
functional native Claude Code port of the Codex Source of Truth (SoT). Inspect the
working-tree changes via `git status --short` and `git diff` (baseline = HEAD).

## What was ported (target paths to review)

Skills (`.claude/skills/<name>/SKILL.md`), ported from `.agents/skills/<name>/SKILL.md`:
- `.claude/skills/wm/SKILL.md`
- `.claude/skills/wm-orchestrate/SKILL.md`
- `.claude/skills/git-workflow/SKILL.md`
- `.claude/skills/mobile-app-dev-workflow/SKILL.md` (+ `references/sot.md`)
- `.claude/skills/mobile-backend-api-integrator-workflow/SKILL.md` (+ `references/sot.md`)

Agents (`.claude/agents/<name>.md`), ported from `.codex/agents/<name>.toml` (the
`developer_instructions` block becomes the markdown body):
- Verdict reviewers: `wm-implementation-reviewer`, `wm-contract-reviewer`, `po-planning-reviewer`, `po-scope-gate-reviewer`, `design-reviewer`
- Researchers/advisors: `wm-docs-researcher`, `wm-gate-fix-advisor`, `po-docs-researcher`, `design-researcher`
- Mobile: `mobile-implementation-reviewer`, `mobile-contract-reviewer`, `mobile-docs-researcher`, `mobile-gate-fix-advisor`

Also: routing block appended to project `CLAUDE.md`.

## Acceptance criteria to verify (treat each as a check)

1. Behavior parity: each ported skill/agent preserves the SoT's modes, workflow steps,
   gates, forbidden actions, and required-evidence rules. Compare each `.claude` file to
   its `.agents/`/`.codex/` source. Report any dropped, added, or altered rule.
2. Verdict-envelope fidelity: the 5 verdict reviewers keep the exact JSON envelope
   contract (fields `verdict`, `reviewer`, `mode`, `scope`, `findings`, `checks_reviewed`,
   `residual_risks`, `next_action`; correct enum values; correct GO/NO_GO/BLOCKED/NEEDS_HUMAN
   rules) matching `scripts/codex-headless-review.mjs` validation.
3. Read-only enforcement: every `.claude/agents/*.md` frontmatter `tools:` allowlist
   excludes `Edit`, `Write`, and `NotebookEdit`, reproducing the Codex `-s read-only` scope.
4. No dangling references: every `skills/...` path and agent name referenced inside a
   ported skill resolves to a ported `.claude` artifact (e.g. `wm` → `.claude/skills/mobile-*-workflow`
   and the 9 read-only agents). Provenance lines that cite the original `.agents/.codex`
   source are acceptable.
5. Frontmatter validity: each skill has `name` + `description`; each agent has `name`,
   `description`, `tools`, `model`.

## Resolved decisions (do not re-flag as blockers)

- Git trackability was fixed: `.gitignore` now tracks `.claude/skills/**` and
  `.claude/agents/**` (verify `git status --short .claude`). The ported skills and agents
  are therefore committable/PR-visible.
- `CLAUDE.md` and `.claude/memory/` are intentionally kept gitignored by explicit human
  decision (they may carry personal/local instructions). The `CLAUDE.md` routing block is
  a local discoverability convenience, not a shipped artifact. Treat its ignored status as
  accepted/NOT_APPLICABLE, not a finding.

## Output

Findings first, ordered by severity, each with `path:line` source references. Then the
required machine-readable verdict JSON envelope. Use `GO` only if there are no
Critical/High/Medium findings. Treat "could not run a command" checks as `NOT_APPLICABLE`
with reason (this is a documentation/config port; no build/test gate is in scope here).
