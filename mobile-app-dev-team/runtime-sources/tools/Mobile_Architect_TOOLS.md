# Mobile Architect TOOLS.md Addendum

This repo-tracked addendum captures Mobile Architect-specific Room delivery and
reporting checks.


## Standard Room Send Template

Use `exec` + curl for Room sends. Do not use visible chat text to show the
command, and do not send the literal Room tag as the payload id.

```bash
ROOM_TAG="room-211"  # from inbound marker like [Room: room-211]
python3 - <<'PY' | curl -s -X POST http://admin-api:3000/internal/messages \
  -H "Content-Type: application/json" \
  -H "X-Gateway-Token: $GATEWAY_TOKEN" \
  --data-binary @-
import json, os
room_tag = os.environ.get("ROOM_TAG", "")
if not room_tag.startswith("room-"):
    raise SystemExit(f"Invalid ROOM_TAG: {room_tag}")
room_id = int(room_tag.removeprefix("room-"))
print(json.dumps({
    "from_agent_id": os.environ["AGENT_ID"],
    "room_id": room_id,
    "content": "MESSAGE",
}, ensure_ascii=False))
PY
```

`$GATEWAY_TOKEN` and `$AGENT_ID` are provided by the runtime. Do not print or
store their values. Delivery is successful only when the HTTP request succeeds
and the response body contains `message_id` for the intended numeric Room.

This template is operational transport guidance. When the Room Text Delivery
Harness is in scope, use the generated wrapper and validator as the proof
surface.

## Standard Room File Attachment Mechanics

Send file attachments through `/internal/messages/upload`. `ROOM_ID` must be
numeric only. For `[Room: room-211]`, use `211`, never `"room-211"`.

```bash
curl -s -X POST http://admin-api:3000/internal/messages/upload \
  -H "X-Gateway-Token: $GATEWAY_TOKEN" \
  -F "from_agent_id=$AGENT_ID" \
  -F "room_id=211" \
  -F "content=MESSAGE" \
  -F "file=@FILE_PATH;type=MIME_TYPE"
```

Received files appear as `[FILE:name url=URL size=N mime=TYPE]`. Download via
the presigned URL when needed:

```bash
curl -s -o /workspace/filename "PRESIGNED_URL"
```

Attachment transport does not prove task completion, review acceptance, release
readiness, production readiness, or human approval.

## Room Delivery Checklist

- Send Room replies through the approved Room transport path and use numeric
  `room_id`, not the literal `room-N` string.
- In reusable docs, fixtures, examples, and harness evidence templates, do not
  hardcode actual operating Room ids. Use synthetic test ids such as `1001` and
  `1002`; resolve live destinations from current instruction metadata or the
  latest explicit report destination.
- Treat delivery as successful only when the command succeeds and the response
  contains `message_id` for the intended room.
- A successful Room send proves transport only. It does not complete
  architecture work, close a Workboard card, satisfy a wake-guard, or replace a
  Task, PR, architecture artifact, or source of truth update.
- If the agreed report destination is a Chatroom, Workboard comments, Task
  comments, PR comments, local notes, and final `NO_REPLY` are not enough for a
  material architecture status, blocker, decision, reviewer result, handoff, or
  completion update.
- Avoid noisy duplicate Chatroom reports for confirmed self-echo or no-change
  events only after re-checking the referenced source of truth.
- After a progress report, continue the next safe architecture follow-through
  step unless work is complete, blocked with owner/reason/next action recorded,
  waiting with a wake/follow-up condition, or delegated to a tracked worker.
- Do not use tool output or delivery success to bypass reviewer gates, human
  approval, merge/release approval, production or external activation approval,
  secret-handling rules, failed-gate risk acceptance, or Mobile Architect role
  boundaries.

## Room Text Delivery Harness Checklist

- When the Room Text Delivery Harness is in scope, use the generated operational
  wrapper at `/workspace/harness/room-text-delivery/bin/send-room-text.mjs` when
  available, or another approved Room transport only when it can produce the
  normalized `room-text-delivery-result/v1` shape.
- For non-dry-run `report-delivery` proof, pass an explicit
  `--expected-room-id` or `--visible-report-destination`. Do not silently copy
  the request `room_id` into the intended proof destination.
- Treat harness success as a normalized result plus
  `validate-room-text-result.mjs` PASS. The proof should include numeric
  matching intended/actual Room ids, `message_id`, nonempty content, successful
  transport state, and visible report destination binding.
- Preserve expected failure evidence when relevant: missing expected
  destination, intended/actual Room mismatch, plain text with no normalized
  result, non-2xx transport errors, and 403 access-boundary sends should fail
  delivery proof instead of being reinterpreted as success.
- Plain visible Room text alone is not harness proof. Harness delivery proof is
  still transport proof only; it does not complete architecture work, close
  Tasks/Workboard/PRs, resolve wake-guards, approve reviews, prove release
  readiness, or satisfy human-gate decisions.
- Do not edit `/workspace/harness/room-text-delivery` directly. It is a
  generated runtime copy; update the repository source and refresh it through
  the approved sync flow when that work is explicitly in scope.
