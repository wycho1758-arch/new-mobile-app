---
docType: "reference"
sourcePageId: "1373667362"
sourceTitle: "01-4. Skills"
sourceVersion: "4"
sourceHeading: "Case A-H skill coverage registry"
---

# Case A-H skill coverage registry

Maps each workflow case (A-H plus cross-cutting concerns) to the skill or mode that owns repeatable execution coverage. New skills are added only when an existing MVP skill cannot close a recurring process gap; otherwise coverage extends an existing skill via a mode or checklist. The five MVP skills remain the source of truth and are never replaced by case-coverage skills or modes.

## Case-to-owner coverage

| Case | Coverage decision | Skill / mode | Target role(s) | Rationale |
| --- | --- | --- | --- | --- |
| A. New project bootstrap | New skill | `mobile-project-bootstrap-workflow` | Product/Planning, Mobile Architect, QA/Release, Mobile App Dev, operator (human) | `mobile-qa-release` does not self-bootstrap the Case A release layer. This process skill closes the 01-7 human bootstrap step and consistency-audit gaps GAP-01~05 / GAP-16. |
| B. PRD intake and Epic/Task breakdown | Keep existing skill | `mobile-prd-to-execution` | Product/Planning (owner); Design, Mobile Architect, Backend/API Integrator, QA/Release review | Already the Case B downstream owner; no separate Product/Planning role wrapper is created. |
| C. UI-only feature | Extend existing skill mode | `mobile-design-handoff` Case C mode + `mobile-qa-release` evidence | Design, Mobile Architect, Mobile App Dev, QA/Release | A new UI-only workflow would duplicate design handoff; the UI-only checklist lives in `mobile-design-handoff`. |
| D. API-backed feature | Extend existing skill mode | `mobile-api-contract` Case D reference-only checklist | Design, Mobile Architect, Backend/API Integrator, Mobile App Dev, QA/Release | `mobile-api-contract` references only sequence/owner/gate and does not absorb other skills' execution responsibility. |
| E. Backend/API-centric change | Keep existing combination | `mobile-api-contract` + `mobile-backend-api-integrator-workflow` + `mobile-qa-release` | Backend/API Integrator, Mobile Architect, Mobile App Dev, QA/Release | Already covered by the contract, backend/API integrator wrapper, and QA evidence skills; no new skill. |
| F. QA failure or gate failure | Extend existing skill mode | `mobile-qa-release` Case F failure/rework mode | QA/Release, failed-task owner, Mobile Architect, Product/Planning/human owner | Adds failure-reason classification, `rework_count`, cap stop, owner routing, and Product/human decision handoff; closes GAP-16. |
| G. Preview/internal release | Extend existing skill mode | `mobile-qa-release` Case G mode | QA/Release, Product/Planning, Mobile Architect | Adds Product/Planning scope confirmation and Mobile Architect EAS strategy check to EAS build, Maestro, evidence, and release notes. |
| H. Production submit | Extend existing skill mode | `mobile-qa-release` Case H mode | QA/Release, Product/Planning (human approval), Mobile Architect | Production submit never auto-runs before human approval; checklist covers store status, rollback/update plan, and a ban on auto-triggering `build-and-submit.yml`. |
| Cross-cutting | Keep deterministic gate | `mobile-gatekeeper` | Gatekeeper (non-LLM), all LLM roles | The Done/evidence gate for every case; no workflow skill replaces gatekeeper pass/fail. |
| Cross-cutting | Preserve role responsibility | Mobile Architect ADR/risk checklist | Mobile Architect | App-wide ADR/risk records stay in Case A template-deviation, Case D/E contract co-sign, and Case G/H EAS strategy checklists. |

## Governing rules

- The MVP 5 skills stay the source of truth; case-coverage skills/modes do not replace them.
- Case A-H coverage is defined against the recurring workflows in 01-3; no per-role SOUL.md wrapper is created by default.
- If an existing MVP skill already owns a case, extend it via a mode/checklist instead of adding a new skill.
- New skills are added only for recurring process gaps that existing MVP skills cannot close.
- `mobile-gatekeeper` is a deterministic hard gate; LLM skills, hooks, and reviewers do not override or reinterpret pass/fail.
- Production submit does not auto-run before human approval.

## Source

- Page ID: 1373667362
- Source heading: Case A-H skill coverage registry
- Source version: 4
