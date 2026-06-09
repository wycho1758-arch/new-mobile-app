---
docType: "reference"
sourcePageId: "1373667362"
sourceTitle: "01-4. Skills"
sourceVersion: "4"
sourceHeading: "Optional skills"
---

# Optional skills

These skills are deferred until after MVP. Each is listed with the trigger that would justify adoption, so they remain candidates rather than current requirements.

- **`mobile-sentry-observability`** — adopt when Sentry operation is activated. The Confluence template ships a conditional Sentry init (disabled when no DSN is injected); DSN issuance and sourcemap-upload operation are deferred past MVP due to cost.
- **`mobile-store-submit`** — adopt when production releases recur. Governance is currently handled by `mobile-qa-release` Case H mode; a separate store-submit skill is decided only after measured repeated operation.
- **`mobile-performance-budget`** — adopt only after a real performance issue arises. Maestro smoke tests plus app profiling suffice initially.
- **`mobile-design-regression`** — adopt once the screen count grows large. Design handoff plus Maestro suffice initially.
- **Maestro MCP server** — adopt when there is an operational need for agents to drive Maestro directly via MCP. QA/Release runs the Maestro CLI directly for now; cloud-tier tools must first be reconciled with the no-default-device-cloud constraint.
- **Atlassian Remote MCP Server** — adopt when Jira/Confluence PM integration automation is required. Current Jira/Confluence access belongs to the ops platform layer; recorded as a candidate only, with no adoption basis at this time.

## Source

- Page ID: 1373667362
- Source heading: Optional skills
- Source version: 4
