Blocking finding found.

```json
{
  "verdict": "NO_GO",
  "reviewer": "wm-implementation-reviewer",
  "mode": "final",
  "scope": {
    "baseline": "HEAD~1",
    "target": "HEAD",
    "paths_reviewed": ["scripts/codex-headless-review.mjs"]
  },
  "findings": [
    {
      "severity": "HIGH",
      "summary": "Required runtime validation failed.",
      "source_refs": ["scripts/codex-headless-review.mjs:1"],
      "owner": "Mobile App Dev"
    }
  ],
  "checks_reviewed": [
    {
      "command": "pnpm run test:runtime",
      "status": "FAIL",
      "evidence": ".evidence/reviews/test-runtime-fail.md"
    }
  ],
  "residual_risks": ["Runtime gate remains failed."],
  "next_action": "fix_findings"
}
```
