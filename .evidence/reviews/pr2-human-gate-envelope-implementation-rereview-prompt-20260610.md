# PR2 Human-Gate Envelope Implementation Rereview Prompt

You are reviewer(xhigh) for the WonderMove mobile app template runtime repo.

Rereview target:

- Prior NO_GO: `.evidence/reviews/pr2-human-gate-envelope-implementation-xhigh-20260610.md`
- Updated checkpoint: `.evidence/reviews/pr2-human-gate-envelope-implementation-checkpoint-20260610.md`
- Current git diff from `e2eb31d`

Focus:

- Verify the prior Medium finding is fixed: `decision_reference` must reject bare GitHub PR/issue URLs and require a concrete `#issuecomment-...` or `#pullrequestreview-...` anchor.
- Verify an invalid fixture covers this regression.
- Reconfirm no new Critical/High/Medium issues were introduced.
- Reconfirm the implementation remains inside approved PR2 scope and does not touch app/API/contracts/live platform work.

Commands run after the fix:

- `node scripts/validate-work-units.mjs --self-test`: pass.
- Bare PR URL repro: pass because validation now returns an error.
- Anchored issue comment repro: pass because validation returns `[]`.
- `node scripts/validate-work-units.mjs`: pass.
- `node scripts/validate-team-doc.mjs`: pass.
- `git diff --check`: pass.
- `pnpm run test:runtime`: pass.
- `pnpm run test:local-harness`: pass, including `pnpm turbo run lint test`.

Return findings first and exactly one JSON reviewer envelope at the end.

Envelope constraint: every `findings[].source_refs[]` entry must be a local `path:line` string only. Put command output or non-path context in `checks_reviewed[].evidence` or `residual_risks`.

