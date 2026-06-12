# sample-role-handoff

This is a committed sample work-unit folder for pod-isolated role handoff.

It is not an active delivery ticket. Use it as the minimal folder skeleton when creating a real work unit under `docs/plans/work-units/<work-unit-id>/`.

Required role artifact fields:

- status: required | not-applicable | deferred/non-goal
- PRD acceptance line or explicit non-goal reference
- owner
- input artifact
- output artifact
- acceptance criteria
- evidence requirement
- dependencies/blockers
- open decisions
- next responsible role
- GitHub branch/commit/PR handoff link

Folder map:

- `00-product-planning/` - intake, scope, task packet, human gates, planning review
- `01-design/` - P0/P1 packets, option comparison, handoff index, design review
- `02-architecture/` - architecture note, route/state impact, ADR, releaseability risk
- `03-contract-api/` - API contract, fixtures, service evidence, rollback note
- `04-mobile-app/` - tests-first implementation summary, selector/API integration notes
- `05-qa-release/` - E2E, native/RN Web, Railway/EAS, release-risk evidence links
- `06-gatekeeper/` - deterministic check status only
- `07-pr/` - branch, PR, review, merge, and post-merge index
