GO cannot contain an unexcused NOT_RUN check.

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
      "status": "NOT_RUN",
      "evidence": "not run yet"
    }
  ],
  "residual_risks": [],
  "next_action": "proceed"
}
```
