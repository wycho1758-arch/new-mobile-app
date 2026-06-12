# Variable Map

Status: reusable template guidance
Source class: template
Upstream SoT:

- `mobile-app-dev-team/ref-organization/08-new-organization-template/create-new-team-guide.md`

Downstream consumers:

- Future new organization templates.

Last reviewed date: 2026-06-10
Reviewer evidence: .evidence/reviews/ref-organization-final-rereview-xhigh-20260610.md

## Variables

| Variable | Meaning |
| --- | --- |
| `organization_name` | Human-readable team or organization name. |
| `repo_root` | Repository root for current SoT and validation. |
| `managed_docs_root` | Current managed docs path. |
| `runtime_surfaces` | Repo-local, pod-native, pod-local, external, and human-gated surfaces. |
| `role_families` | Stable role groupings and Operating Role values. |
| `human_gates` | Decisions that require recorded human approval. |
| `evidence_paths` | Canonical evidence locations. |

## Rule

Never hardcode customer app names, bundle IDs, API URLs, tokens, or credentials into reusable templates.
