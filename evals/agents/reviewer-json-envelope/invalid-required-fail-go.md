GO cannot contain a failed required check.

```json
{
  "verdict": "GO",
  "reviewer": "wm-implementation-reviewer",
  "mode": "final",
  "scope": {
    "baseline": null,
    "target": "HEAD",
    "paths_reviewed": ["scripts/codex-headless-review.mjs"]
  },
  "findings": [],
  "checks_reviewed": [
    {
      "command": "pnpm run test:runtime",
      "status": "FAIL",
      "evidence": ".evidence/fail.md"
    }
  ],
  "residual_risks": [],
  "next_action": "proceed"
}
```
