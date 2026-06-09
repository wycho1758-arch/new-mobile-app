---
docType: "reference"
sourcePageId: "1374289964"
sourceTitle: "Role-specific Codex Runtime"
sourceVersion: "3"
sourceHeading: "이 페이지의 역할"
---

# Codex Runtime Boundary

This page defines role-specific Codex runtime boundaries. It does not replace the five existing MVP skills: `mobile-prd-to-execution`, `mobile-design-handoff`, `mobile-api-contract`, `mobile-qa-release`, and `mobile-gatekeeper` remain the source of truth.

Its scope is to separate four runtime concerns into distinct paths:

- Role-specific thin wrapper skills.
- Read-only / advisory custom agents.
- Local advisory hooks.
- Generated-agent (OpenClaw pod) runtime skill packages.

Each of these is given its own install location and authority, so that native Codex CLI repo skills are not confused with pod-loaded runtime skills, and so advisory guardrails are not mistaken for hard gates.

## Source

- Page ID: 1374289964
- Source heading: 이 페이지의 역할
- Source version: 3
