```json
{
  "reviewer": "po-scope-gate-reviewer",
  "mode": "scope",
  "decision": "GO",
  "next_action": "proceed",
  "recommendation": {
    "category_set_requiring_rollback_fields": [
      "production-submit"
    ],
    "required_fields": {
      "rollback_owner": {
        "required": true,
        "type": "string",
        "non_empty_after_trim": true
      },
      "rollback_plan": {
        "required": true,
        "type": "string",
        "non_empty_after_trim": true
      }
    },
    "validator_rule": "In validateHumanGateDecision, when decision.category === 'production-submit', validate rollback_owner and rollback_plan with the existing non-empty string helper. Apply the rule by category, regardless of approved/rejected/deferred decision value. Do not require these fields for failed-gate-risk or any other human-gate category in this follow-up.",
    "fixture_updates": "Do not update existing fixtures for this rule. production-submit is unused by current decision files, so the minimal SoT-aligned rule has no fixture breakage. If a later SoT-backed expansion includes categories already present in valid fixtures, updating those fixtures would be acceptable then, but that is out of scope here.",
    "collision_constraints": "Do not touch scripts/validate-team-doc.mjs or mobile-app-dev-team/09-pod-native-openclaw-skills/**. The target validator surface is scripts/lib/work-unit-machine.mjs; read-only status observed current local edits in that file, so any implementer must preserve unrelated diff."
  },
  "findings": [
    {
      "id": "SCOPE-001",
      "owner": "Product/Planning",
      "severity": "high",
      "result": "PASS",
      "finding": "The rollback-required category set should be production-submit only.",
      "rationale": "The annex requires rollback metadata for live mutation or live-readiness approval records. production-submit is the deterministic human-gate category tied to production submit, release evidence, and store-submission safety. Other categories are broader governance categories and cannot be treated as rollback-relevant solely from category.",
      "source_refs": [
        "mobile-app-dev-team/15-human-ops-live-readiness-annex.md:36",
        "mobile-app-dev-team/15-human-ops-live-readiness-annex.md:47",
        "mobile-app-dev-team/15-human-ops-live-readiness-annex.md:48",
        "mobile-app-dev-team/06-gates-and-evidence.md:14",
        "mobile-app-dev-team/06-gates-and-evidence.md:91",
        "mobile-app-dev-team/15-human-ops-live-readiness-annex.md:152"
      ]
    },
    {
      "id": "SCOPE-002",
      "owner": "Product/Planning",
      "severity": "medium",
      "result": "PASS",
      "finding": "failed-gate-risk should not be included in this schema extension.",
      "rationale": "failed-gate-risk is acceptance of risk after a failed gate and already has its own category-specific failed_check_reference requirement. It is not necessarily a live mutation by category alone; including it would force rollback fields onto valid repo-local waiver and rejection fixtures without a category-level SoT requirement.",
      "source_refs": [
        "mobile-app-dev-team/06-gates-and-evidence.md:81",
        "mobile-app-dev-team/06-gates-and-evidence.md:104",
        "scripts/lib/work-unit-machine.mjs:536",
        "scripts/lib/work-unit-machine.mjs:537",
        "evals/work-units/fixtures/valid/human-gate-approved/00-product-planning/human-gates/hg-failed-gate-risk.json:4",
        "evals/work-units/fixtures/valid/evidence-ladder-waived/00-product-planning/human-gates/hg-native-evidence-waiver.json:4",
        "evals/work-units/fixtures/valid/human-gate-rejected/00-product-planning/human-gates/hg-risk-rejected.json:4"
      ]
    },
    {
      "id": "VALIDATION-001",
      "owner": "Mobile App Dev",
      "severity": "medium",
      "result": "PASS",
      "finding": "Required non-empty strings are the correct field validation shape.",
      "rationale": "The existing helper enforces string type and trimmed non-empty value. rollback_owner and rollback_plan do not conflict with decided_by: decided_by remains the human approver object, while rollback_owner records the owner responsible for undoing the mutation.",
      "source_refs": [
        "scripts/lib/work-unit-machine.mjs:120",
        "scripts/lib/work-unit-machine.mjs:121",
        "scripts/lib/work-unit-machine.mjs:122",
        "scripts/lib/work-unit-machine.mjs:491",
        "scripts/lib/work-unit-machine.mjs:508",
        "mobile-app-dev-team/15-human-ops-live-readiness-annex.md:47",
        "mobile-app-dev-team/15-human-ops-live-readiness-annex.md:51",
        "mobile-app-dev-team/15-human-ops-live-readiness-annex.md:134"
      ]
    },
    {
      "id": "BREAKAGE-001",
      "owner": "Mobile App Dev",
      "severity": "low",
      "result": "PASS",
      "finding": "No existing fixture update is recommended for the chosen rule.",
      "rationale": "Existing real and fixture decisions use non-production-submit categories. The real business-budget-owner approval is not a production submit and should not receive rollback fields under this bounded rule.",
      "source_refs": [
        "docs/plans/work-units/project-bootstrap-auth-gates/00-product-planning/human-gates/expo-sdk-56-patch-dependency-approval.json:4",
        "evals/work-units/fixtures/valid/human-gate-approved/00-product-planning/human-gates/hg-failed-gate-risk.json:4",
        "evals/work-units/fixtures/valid/resolver-human-gate-approved/00-product-planning/human-gates/hg-scope.json:4",
        "evals/work-units/fixtures/valid/human-gate-deferred/00-product-planning/human-gates/hg-budget-owner.json:4"
      ]
    }
  ],
  "checks_reviewed": [
    {
      "name": "approval_envelope_sot",
      "status": "PASS",
      "details": "Reviewed live mutation/live-readiness rollback field requirements."
    },
    {
      "name": "human_gate_category_sot",
      "status": "PASS",
      "details": "Reviewed deterministic category slugs and failed-gate-risk-specific rule."
    },
    {
      "name": "validator_surface",
      "status": "PASS",
      "details": "Reviewed validateHumanGateDecision, validateString, and decided_by validation."
    },
    {
      "name": "breakage_scan",
      "status": "PASS",
      "details": "Read-only search found zero production-submit decision files; existing valid failed-gate-risk fixtures would be affected only if that category were included."
    },
    {
      "name": "collision_scan",
      "status": "PASS",
      "details": "Concurrent edit paths were identified. scripts/lib/work-unit-machine.mjs also currently has local edits; preserve them during any implementation."
    },
    {
      "name": "ci",
      "status": "NOT_APPLICABLE",
      "details": "Decision review only; no files modified."
    }
  ]
}
```