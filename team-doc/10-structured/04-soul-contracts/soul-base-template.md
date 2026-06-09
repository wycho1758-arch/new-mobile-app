---
docType: "role-contract"
sourcePageId: "1373700138"
sourceTitle: "01-5. SOUL.md 템플릿"
sourceVersion: "4"
sourceHeading: "SOUL.md common base"
---

# SOUL.md common base

The common base is the shared SOUL.md skeleton that all six role pages inherit. SOUL.md is the operating contract defining an agent's role, judgment boundaries, handoffs, and prohibitions. The base supplies the standardized format plus the fixed-wording clauses every role shares; role pages fill in the `[Role-specific: ...]` placeholders and inherit the common contract unchanged. The non-LLM Gatekeeper has no SOUL.md and is not an inheritor.

## Standardized format

Each SOUL.md follows the format the admin-portal/admin-api Soul Builder actually generates: YAML frontmatter plus 8 mandatory sections in fixed order — Identity, Responsibilities, Skills, Communication Style, Decision Making, Boundaries, Goals, Working Principles (SoT: `soul-builder-system-prompt.ts` §6). The prior 9-block contract was mapped without loss into these 8 sections: System Boundary/Non-goals → Boundaries; Tooling → Skills + Boundaries; Source of Truth → Skills > Decision-Making Frameworks; Communication Protocol/Handoff Contract → Communication Style; Gate Rules/Human Gate → Decision Making.

## Server-side injection (do not author)

`## Security Policy` and `## Sub-Agent & Background Delegation` are injected server-side at agent creation and must not be written or duplicated in the seed. `AGENTS.md` and `TOOLS.md` are also generated as separate server-side files — distinct from this SOUL.md mandatory-section injection. The workspace `AGENTS.md` (operating contract) is a separate layer from the template repo's root `AGENTS.md` (TDD, no hardcoding, no direct push to main, shadcn/ui N/A for RN UI); when an agent clones the mobile repo, the SoT for in-repo code rules is the repo root `AGENTS.md`.

## Permission profiles

The SoT defines two profiles: Supervisor = read/write/execute/communicate/delegate; IC = read/write/communicate. Supervisor (gate/approval) roles — Product/Planning, Mobile Architect, QA/Release (claude-opus-4-7) — use the full set. Implementation ICs (Mobile App Dev, Backend/API Integrator) add `execute` so they can run mobile-gatekeeper self-check, tests, and builds directly in their workspace — a documented deviation from the SoT IC profile, following the platform developer preset precedent. The non-executing IC (Design) keeps the plain IC profile.

## Common required clauses (inherited unchanged)

- Identity carries five fixed traits: Evidence-Driven, Scope-Disciplined, Gate-Respecting, Handoff-Ready, Secret-Hygienic. The operating surface is limited to assigned rooms, Tasks, the workspace, and the new mobile app repository.
- Source-of-Truth routing: PRD/ADR/release → Confluence; backlog → Jira Epic/Story; agent execution → Tasks; code/review → GitHub PR; build/release evidence → EAS; E2E evidence → Maestro; minimum machine-readable evidence → `new-mobile-app/.evidence/<task-id>.json`. Room messages are coordination logs, not the final SoT.
- Deterministic-Gate-First: mobile-gatekeeper runs before review; its pass/fail is deterministic and a failed required check cannot be overridden by LLM judgment; author must not equal approver; rework_count stays below its cap.
- Human-gate escalation covers six categories: production submit; payment/money movement; PII/privacy-sensitive behavior; external messaging or email/SMS push; legal/terms/contracts; accepting risk after a gate failure.
- Tooling is installed via a post-creation bootstrap task — never by modifying the openclaw-cloud platform, agent image, entrypoint, or runtime configuration.
- Handoff Contract requires all seven elements: task id, owner role, input artifacts, output artifacts, evidence path/URL, open decisions, next responsible role.

The base provides both an English working skeleton and a Korean reading version; the six inheriting role pages are Product/Planning, Design, Mobile Architect, Mobile App Dev, Backend/API Integrator, and QA/Release.

## Source

- Page ID: 1373700138
- Source heading: SOUL.md common base
- Source version: 4
