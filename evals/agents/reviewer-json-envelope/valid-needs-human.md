Human decision required.

```json
{
  "verdict": "NEEDS_HUMAN",
  "reviewer": "po-scope-gate-reviewer",
  "mode": "scope",
  "scope": {
    "baseline": null,
    "target": ".evidence/scope.md",
    "paths_reviewed": [".evidence/scope.md"]
  },
  "findings": [
    {
      "severity": "HIGH",
      "summary": "Production submit requires a recorded human decision.",
      "source_refs": ["AGENTS.md:101"],
      "owner": "human"
    }
  ],
  "checks_reviewed": [
    {
      "command": "human gate",
      "status": "NOT_RUN",
      "evidence": "Production submit decision missing."
    }
  ],
  "residual_risks": ["Production submit cannot proceed."],
  "next_action": "ask_human"
}
```
