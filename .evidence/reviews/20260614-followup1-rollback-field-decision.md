```json
{
  "reviewer": "wm-implementation-reviewer",
  "mode": "plan",
  "confidence": "xhigh",
  "verdict": "NEEDS_HUMAN",
  "next_action": "ask_human",
  "recommendation": "Defer deterministic enforcement until a human-authorized schema decision defines where rollback_owner and rollback_plan live: either a new live-readiness/v1 approval-envelope artifact or an explicit human-gate/v1 schema extension. No SoT-grounded no-invention validator addition is safe now.",
  "decision": {
    "existing_machine_artifact_carrying_rollback_fields": "NO",
    "bounded_validator_addition_safe_now": "NO",
    "reason": "The rollback fields are required by documentation, but the existing machine-readable human-gate/v1 envelope and validator do not carry or validate them. Enforcing them would require adding a new artifact/schema or extending human-gate/v1, which is schema invention/scope expansion under the no-invention constraint.",
    "collision_constraint": "Do not touch scripts/validate-team-doc.mjs or mobile-app-dev-team/09-pod-native-openclaw-skills/**; the recommendation requires no edits there."
  },
  "findings": [
    {
      "id": "F1",
      "severity": "blocking",
      "owner": "human",
      "summary": "No existing machine-readable artifact/schema in the SoT already carries rollback_owner or rollback_plan.",
      "source_refs": [
        "mobile-app-dev-team/15-human-ops-live-readiness-annex.md:36",
        "mobile-app-dev-team/15-human-ops-live-readiness-annex.md:37",
        "mobile-app-dev-team/15-human-ops-live-readiness-annex.md:47",
        "mobile-app-dev-team/15-human-ops-live-readiness-annex.md:48",
        "mobile-app-dev-team/06-gates-and-evidence.md:100",
        "mobile-app-dev-team/06-gates-and-evidence.md:101",
        "mobile-app-dev-team/06-gates-and-evidence.md:102",
        "mobile-app-dev-team/06-gates-and-evidence.md:105"
      ]
    },
    {
      "id": "F2",
      "severity": "blocking",
      "owner": "Mobile App Dev",
      "summary": "The executable human-gate/v1 validator checks the existing human-gate fields and contains no rollback_owner or rollback_plan validation point.",
      "source_refs": [
        "scripts/lib/work-unit-machine.mjs:1",
        "scripts/lib/work-unit-machine.mjs:2",
        "scripts/lib/work-unit-machine.mjs:473",
        "scripts/lib/work-unit-machine.mjs:477",
        "scripts/lib/work-unit-machine.mjs:489",
        "scripts/lib/work-unit-machine.mjs:491",
        "scripts/lib/work-unit-machine.mjs:512",
        "scripts/lib/work-unit-machine.mjs:518",
        "scripts/lib/work-unit-machine.mjs:524",
        "scripts/lib/work-unit-machine.mjs:528"
      ]
    },
    {
      "id": "F3",
      "severity": "blocking",
      "owner": "human",
      "summary": "The live-readiness annex is requirements/evidence documentation, not an executable authorization or standalone machine artifact definition.",
      "source_refs": [
        "mobile-app-dev-team/15-human-ops-live-readiness-annex.md:9",
        "mobile-app-dev-team/15-human-ops-live-readiness-annex.md:10",
        "mobile-app-dev-team/15-human-ops-live-readiness-annex.md:11",
        "mobile-app-dev-team/15-human-ops-live-readiness-annex.md:12"
      ]
    },
    {
      "id": "F4",
      "severity": "blocking",
      "owner": "human",
      "summary": "The rollback runbook repeats the rollback fields as managed-doc guidance and explicitly says runtime enforcement is deferred; it does not supersede validators.",
      "source_refs": [
        "mobile-app-dev-team/20-app-eas-ota-rollback-runbook.md:3",
        "mobile-app-dev-team/20-app-eas-ota-rollback-runbook.md:5",
        "mobile-app-dev-team/20-app-eas-ota-rollback-runbook.md:17",
        "mobile-app-dev-team/20-app-eas-ota-rollback-runbook.md:43"
      ]
    }
  ],
  "checks_reviewed": [
    {
      "name": "rollback_field_search",
      "status": "PASS",
      "evidence": "rollback_owner and rollback_plan resolve to the annex and rollback runbook, not to an existing JSON schema or validator."
    },
    {
      "name": "human_gate_schema_review",
      "status": "PASS",
      "evidence": "human-gate/v1 field list and validateHumanGateDecision do not include rollback_owner or rollback_plan."
    },
    {
      "name": "live_readiness_schema_search",
      "status": "PASS",
      "evidence": "No scripts/live-readiness schema or validator was found in the scripts tree."
    },
    {
      "name": "concurrent_edit_collision",
      "status": "PASS",
      "evidence": "No recommendation requires touching scripts/validate-team-doc.mjs or mobile-app-dev-team/09-pod-native-openclaw-skills/**."
    },
    {
      "name": "ci",
      "status": "NOT_APPLICABLE",
      "evidence": "Decision review only; no file change."
    }
  ]
}
```