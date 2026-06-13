# Implementation evidence — openclaw-cloud → `.claude/` independent skill adoption

Date: 2026-06-13 · Branch: fix/project-bootstrap-agent-language-ux · Scope: `.claude/` + `CLAUDE.md` only

## What was added (independent, self-contained skills)
- `.claude/skills/brief-gatekeeper/` — verbatim adoption, then Role-Architect routing neutralized to
  self-contained Product/Planning escalation handoff (no external skill call).
- `.claude/skills/code-quality/` — Serena namespace fixed (`mcp__serena__*`), `/code-review` + `../wm/`
  + planner/`/solve`/best-practices cross-refs removed, Clean Architecture (pre-existing) + new TDD
  section, Python example → TypeScript/JSDoc.
- `.claude/skills/best-practices/` — converted to `user-invocable: true` leaf; curated to repo stack
  (60 rule files; removed Go/Python/Rust, `react-server-*`, `react-bundle-*`, `react-js-passive-events`,
  `ts-nextjs-api-route-typing`); added `rules/_role-index.md`; `test-infrastructure.md` rewritten for
  Expo RN + Jest/RN Web/Maestro; zod Next.js example → RN contract-validation example; cited React DOM
  examples → RN primitives + RN-applicability note in `react-index.md`.
- `CLAUDE.md` — added "Independent adopted skills" subsection (distinct from Codex ports).

## Verification commands & results (post-codex-review fixes)

```
# 1. brief-gatekeeper independence — no active /role-architect routing
$ grep -rnE "role-architect|/role-architect" .claude/skills/brief-gatekeeper
(no matches)
$ grep -rn "Role Architect 호출" .claude/skills/brief-gatekeeper
SKILL.md:16  (explanatory note only: legacy term maps to escalation)

# 2. code-quality self-contained
$ grep -rnE "planner|/solve|skills/best-practices|admin-api|billing-api" .claude/skills/code-quality
(no matches)
$ grep -rc "python" .claude/skills/code-quality/references/failure-messages.md
0

# 3. best-practices curated to stack
$ grep -rnE "Next\.js API route|admin-portal|billing-api|npx vitest|window\.scrollY|react-bundle-[a-z-]+\.md" .claude/skills/best-practices
(no matches)

# 4. forbidden couplings sweep (all three skills)
$ grep -rnE "dev-executor|design-executor|Auto-loaded by|mcp__plugin_serena_serena__" \
    .claude/skills/{brief-gatekeeper,code-quality,best-practices}
(no matches)

# 5. tree integrity
brief-gatekeeper: 7 files  | code-quality: 2 files | best-practices: 61 files (60 rules incl _role-index.md)
removed rule families present: 0
```

## Codex headless review
- Round 1: `.evidence/wm/claude-skill-adoption/20260613-adoption-review.json` — verdict NO_GO, 6 findings.
- All HIGH (1 brief-gatekeeper routing, 2 code-quality dangling refs, 3 best-practices web/source
  residue) and LOW (6 Python example) findings fixed above. MEDIUM 5 (this evidence file) addressed.
- Round 2 review re-run after fixes: see `20260613-adoption-review-2.json`.

## Open item requiring human decision (MEDIUM 4)
`.gitignore` (lines 7–8, modified by the user in parallel) ignores `.claude/` and `CLAUDE.md`, so these
additions are local/untracked and not a normal tracked diff. This matches the user's deliberate parallel
`.gitignore` change and the existing `.claude` restructuring ("claude-port"). Tracking `.claude/` (force-add
or unignore) is a repo-policy decision for the user/owner; it was NOT changed unilaterally here.

## Scope confirmation
`.codex/` and `.agents/` were not modified (read-only references only).

---

## ADDENDUM — environment blocker (persisted record)

A process in this repo is **repeatedly deleting the entire `.claude/` directory** (skills, agents,
memory), during this session and after the user selected "stop the parallel process and re-apply."

Timeline observed:
- Original 5 Codex-port skills + 13 agents + settings.local.json were already gone at implementation start.
- New skills were written and self-verified clean (all round-1 codex findings fixed).
- Codex round-2 review (`20260613-adoption-review-2.json`) returned NO_GO with FAILs of the form
  "best-practices files missing / `.claude/` absent" — i.e. the review subprocess read a filesystem
  view where `.claude/` had been wiped; it did NOT find content defects.
- Final check: `.claude/` is entirely absent again; `.evidence/` (this file) persists.

Conclusion: the three skills were fully implemented and all round-1 codex findings (HIGH 1/2/3,
LOW 6) were applied and verified in-session, but the deliverable cannot persist under `.claude/`
and cannot be codex-validated until the deleting process is genuinely halted. This is an
environment/process issue, not a content defect. Re-apply in one pass once `.claude/` deletion stops.

---

## DIAGNOSIS — what deletes `.claude/` (requested: "삭제 주체 먼저 진단")

Conclusive evidence:
1. **Many concurrent Codex agent turns run in THIS repo cwd.** `ps` shows numerous distinct
   `codex_exec` thread-ids (019ea9d3, 019ea9dd, 019eaa27, 019eaa2e, 019eaa81, 019eaacb, 019eaad1,
   019eab1c, 019eaba3, …) all with `cwd":"/Users/tw.kim/Documents/AGA/test/new-mobile-app"`.
   → A parallel Codex multi-agent session / automation is operating on this working directory.
2. **The repo treats `.claude/` + `CLAUDE.md` as a GENERATED, regenerable port** of the Codex SoT
   (`.agents/skills`, `.codex/agents`). The rebaseline cleanup checkpoint
   (`.evidence/reviews/mobile-template-runtime-rebaseline-cleanup-checkpoint-20260610.md:25`) runs:
   `rm -rf CLAUDE.md .claude && git status ...` as a deliberate step, then revalidates
   "11 skills, 13 agents, 4 hook events" from fixtures.
3. `scripts/clean-tree-guard.mjs` is read-only (git-status checker), NOT the deleter.
4. Round-1 codex review DID read the new files (returned real content findings) → the files existed
   on the real host; a later rebaseline/clean event removed `.claude/` before round-2.

**Culprit:** the user's parallel Codex rebaseline / claude-port automation running in this same repo
cwd periodically executes `rm -rf CLAUDE.md .claude` (regenerate-from-SoT cycle), which wipes this
session's `.claude/` additions. Not a Claude Code hook, not clean-tree-guard, not a content defect.

**Required to proceed:** pause/stop that parallel Codex rebaseline automation on this cwd (or let it
finish and stay idle). Then the three skills + all applied codex findings can be re-applied in one
pass and codex-revalidated. Because `.claude/` is a regenerated port here, longer-term these skills
likely belong in the Codex SoT generator path rather than hand-written into `.claude/`.

---

## ROUND-3 FIX + GATE EVIDENCE (deleter removed)

Round-1 HIGH/LOW content findings are all resolved (round-3 review marked them PASS). Round-3 raised
4 new findings; applied:
- **F1 (scope: package.json)** — user explicitly authorized fixing the `validate` deleter; recorded as
  authorized scope expansion in the approved plan (`인가된 범위 확장`). `.codex`/`.agents` untouched.
- **F3 (code-quality read-only)** — "When NOT to Use" + "Refactoring Session" reframed to
  analysis/recommendation only (no Edit/Apply/Verify-tests mutating instructions).
- **F4 (gate evidence)** — runtime gates run and recorded below.
- **F2 (gitignore, owner=repo-owner)** — `.claude/` + `CLAUDE.md` are gitignored by the user's parallel
  `.gitignore` change; tracking is a repo-owner policy decision, deferred to the owner (not changed here).

### Gate results (this final state, `.claude/` present)
```
$ node scripts/validate-runtime-artifacts.mjs
Validated 13 skills, 13 agents, and 4 hook events.   # exit 0

$ node scripts/codex-headless-review.mjs --self-test
Codex headless review helper self-test passed.       # exit 0

# deleter-removed confirmation: run validate, .claude survives
$ node -e "...rmSync(['.claude-state'])" && node scripts/validate-runtime-artifacts.mjs
post-validate .claude/skills present: best-practices brief-gatekeeper code-quality
```

The `package.json` `validate` fix (`['.claude-state']` only) means the runtime gate no longer deletes
`.claude/`; `validate-runtime-artifacts.mjs:506` only requires `.gitignore` coverage, which holds, so
gate integrity is preserved.

---

## FINAL REVIEW — GO (round 5)

`20260613-adoption-review-5.json`: **verdict GO, next_action: proceed.** All required checks PASS
(independence, governance read-only, Serena namespace, shadcn exclusion, stack curation, role-index,
package.json authorized-scope, gate evidence). Remaining round-5 finding was a single LOW
documentation-accuracy item (ts-index.md stale "25/7" count) → fixed to "24 patterns across 6
categories". Round history: r1 NO_GO(6) → r3 NO_GO(4) → r4 NO_GO(4) → r5 GO(1 LOW, fixed).

Sole standing item is NOT an implementation defect: `.claude/` + `CLAUDE.md` are gitignored by the
repo owner's parallel `.gitignore` policy. Tracking them (force-add/unignore) or routing via the SoT
generator is a repo-owner decision, deliberately left to the user.
