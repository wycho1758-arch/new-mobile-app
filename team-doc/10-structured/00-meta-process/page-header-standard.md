---
docType: "reference"
sourcePageId: "1373667330"
sourceTitle: "[00] LLM 조직 구성 표준 프로세스"
sourceVersion: "3"
sourceHeading: "페이지 헤더 표준 블록"
---

# Page Header Standard

Every page in this tree fixes a 5-field table at the top so purpose and dependencies stay traceable.

## Required header fields

| Field | Definition |
| --- | --- |
| 목적 (Purpose) | One line describing what this page owns as Source of Truth (SoT). |
| Upstream | Pages this page depends on. If a listed page changes, re-review this page. |
| Downstream | Pages that depend on this page. If this page changes, re-review the listed pages. |
| 관련 DEC-ID | Decision IDs that justify this page's content (rows in the 00-4 registry). |
| 출처 (Source) | Origin of the content — local report path/section or external document. |

## Rules

- **Edge SoT**: The single source of truth for inter-page dependencies is each page header's Upstream/Downstream and related DEC-ID. The registry's (00-4) affected-pages column is a derived view produced by scanning all headers.
- **One-directional layers**: Meta-layer (00) pages never reference instance-layer pages. Only instance → meta Upstream links are allowed.
- **Hypothesis-change procedure**: Add or change a decision row in 00-4 → find every page carrying that DEC-ID in its header → update them → recursively re-review those pages' Downstream.
- **One fact, one page**: Do not duplicate the same rule as body text on two pages. State it in one place; link from the rest.
- **Symmetry exceptions**: (1) A section parent's Downstream listing of its child pages is a tree/index relation, and (2) an evidence-store page's "all pages" Downstream is a reference relation — both are exempt from the reverse Upstream obligation. Otherwise, every Downstream X→Y must have X (or X's parent) recorded in Y's Upstream.

## Source

- Page ID: 1373667330
- Source heading: 페이지 헤더 표준 블록
- Source version: 3
