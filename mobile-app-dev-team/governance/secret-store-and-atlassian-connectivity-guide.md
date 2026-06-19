# Secret Store And Atlassian Connectivity Guide

This is a one-off operating guide for the completed credential attachment,
protected secret-store storage, and status-only Jira/Confluence connectivity
check process. It is not a broad Atlassian runbook and does not authorize live
content access, mutation, permission changes, or new dependency installation.

## Scope

Use this guide only when an operator has already approved handling a credential
attachment for Atlassian Cloud status-only connectivity reporting.

The allowed result is a short status report that says whether the credential was
stored through a protected secret-store pointer, whether local plaintext was
deleted, whether Jira and Confluence identity endpoints returned status-only
connectivity results, and which auth method was used.

Do not include plaintext credentials, response bodies, environment output,
secret file contents, runtime-local pointer ids, or practitioner blame in any
chat, Workboard card, PR, artifact, normal memory, or log.

## Security Rules

- Treat the Atlassian API token as password-equivalent.
- Never paste plaintext credential material into chat, logs, files, normal
  memory, Workboard, PR text, or evidence artifacts.
- Share only a generic protected secret-store pointer and safe metadata, such as
  storage status, deletion status, auth method, endpoint family, and status-only
  result.
- Delete any temporary plaintext file as soon as protected storage succeeds or
  as soon as SAFE_STOP is reached.
- Rotate the credential if exposure is suspected or if plaintext may have been
  written to an unsafe location.

## Approved Flow

1. Classify the attachment as credential material before reading or forwarding
   it.
2. Store the credential using the protected secret store when safe ingest is
   available.
3. Keep only generic pointer language and safe metadata in normal notes.
4. Delete local plaintext immediately after protected storage succeeds.
5. Verify connectivity using pointer injection only. Do not print injected
   values, environment output, request bodies, response bodies, or secret file
   contents.
6. Report status-only results.

## Atlassian Access Method

Use Atlassian Cloud Basic auth with the account email and API token.

- Jira identity endpoint: `/rest/api/3/myself`
- Confluence identity endpoint: `/wiki/rest/api/user/current`

Bearer auth is not the standard method for this flow and was observed as `403`
in the prior status-only check. Do not treat a Bearer failure as proof that the
Basic auth credential is invalid.

## SAFE_STOP Criteria

Stop before verification when any of these are true:

- safe secret ingest is unavailable;
- no protected pointer or safe delegation path exists;
- a command would expose plaintext credential material;
- a command would print environment output, response bodies, or secret file
  contents;
- there is credible exposure risk or uncertainty about where plaintext was
  written.

On SAFE_STOP, delete any temporary plaintext file if present, report the blocker
and retry condition, and do not run Jira or Confluence checks.

## Status Report Template

```text
Credential classification: credential attachment
Protected storage: stored through protected secret-store pointer | SAFE_STOP
Shared metadata: safe metadata only; no runtime-local pointer id
Local plaintext deletion: deleted | not created | SAFE_STOP blocker
Jira status-only result: pass | fail | not run
Confluence status-only result: pass | fail | not run
Auth method: Atlassian Cloud Basic auth with account email + API token
Forbidden-action compliance: no plaintext, no response body, no environment
  output, no secret file contents, no dependency install, no mutation, no
  content access, no permission change
Retry condition when blocked: <safe ingest, pointer/delegation, or exposure-risk
  condition required before retry>
```

## What Not To Do

- Do not print, paste, store, or summarize plaintext credential values.
- Do not include response bodies, environment output, or secret file contents.
- Do not install dependencies for this one-off check.
- Do not perform Jira or Confluence mutation, content access, permission changes,
  or broad API exploration.
- Do not include real runtime-local secret pointer ids in the guide or status
  report.
- Do not name practitioners as blame; report the OK path or SAFE_STOP path.
