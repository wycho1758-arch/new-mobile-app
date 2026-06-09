# Fetch Report

Generated at: 2026-06-09T03:27:22.071Z

## Result

- Descendant tree metadata was preserved from the successful Atlassian MCP descendant fetch.
- Full page-body sync was blocked after repeated Atlassian MCP timeouts on 2026-06-09.
- Source files therefore contain metadata and local summaries for previously observed core pages, while other pages are marked `metadata-only-fetch-timeout`.

## Follow-up

Run a body refresh when Atlassian MCP page fetches are stable, replacing each `page.md` body below the frontmatter with exact Confluence markdown.
