# TDD Evidence — validate-repo-operations terminology guard (red → green)

- Date: 2026-06-13
- Validator under test: `scripts/validate-repo-operations.mjs` (new `requireTerms` block, lines ~161-174)
- Method: with the validator guard in place, REPO_OPERATIONS.md was reverted to HEAD
  (section absent) to produce RED, then restored to produce GREEN.

## RED phase — section absent, guard present

Command:
```
git checkout HEAD -- REPO_OPERATIONS.md
node scripts/validate-repo-operations.mjs
```

Output (exit=1):
```
- REPO_OPERATIONS.md missing required repo operations term: ## Skill, Agent, And AGENTS.md Terminology
- REPO_OPERATIONS.md missing required repo operations term: .agents/skills/<name>/SKILL.md
- REPO_OPERATIONS.md missing required repo operations term: .claude/skills/<name>/SKILL.md
- REPO_OPERATIONS.md missing required repo operations term: .codex/agents/<name>.toml
- REPO_OPERATIONS.md missing required repo operations term: .claude/agents/<name>.md
- REPO_OPERATIONS.md missing required repo operations term: ### Directory trap
- REPO_OPERATIONS.md missing required repo operations term: holds skills
- REPO_OPERATIONS.md missing required repo operations term: holds custom agents
- REPO_OPERATIONS.md missing required repo operations term: pod agent skills
- REPO_OPERATIONS.md missing required repo operations term: not a skill and not a custom agent
RED_EXIT=1
```
(10 of 11 guarded terms missing; `/workspace/skills/<slug>/SKILL.md` already existed in HEAD REPO_OPERATIONS.md:78, so it was not reported missing.)

## GREEN phase — section present (working tree, post-M1 reword)

Command:
```
cp /tmp/REPO_OPERATIONS.working.md REPO_OPERATIONS.md   # restore working version
node scripts/validate-repo-operations.mjs
```

Output (exit=0):
```
Validated repo operations policy ownership.
GREEN_EXIT=0
```

## Note
The GREEN run was executed AFTER the M1 wording reword, confirming the reword preserved
all 11 guarded substrings (no regression).
