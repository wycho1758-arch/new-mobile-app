Blocked by missing evidence.

```json
{
  "verdict": "BLOCKED",
  "reviewer": "design-reviewer",
  "mode": "design",
  "scope": {
    "baseline": null,
    "target": "design-pub-html/2026-06-10",
    "paths_reviewed": ["design-pub-html/2026-06-10/handoff.md"]
  },
  "findings": [
    {
      "severity": "MEDIUM",
      "summary": "Required design evidence is missing.",
      "source_refs": ["PROJECT_ENVIRONMENT.md:218"],
      "owner": "Design"
    }
  ],
  "checks_reviewed": [
    {
      "command": "verify design-pub-html artifacts",
      "status": "NOT_RUN",
      "evidence": "manifest.json missing."
    }
  ],
  "residual_risks": ["Implementation handoff cannot start."],
  "next_action": "rerun_review"
}
```
