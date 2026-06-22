# Room Text Delivery Contract

## Normalized result schema

A Room text delivery proof is a JSON object with this minimum normalized shape:

```json
{
  "schema": "room-text-delivery-result/v1",
  "request_id": "optional string",
  "intended_room_id": 1001,
  "actual_room_id": 1001,
  "message_id": "message-id",
  "content_nonempty": true,
  "transport": "raw-curl",
  "timestamp": "2026-06-21T09:00:00.000Z",
  "http_status": 200,
  "transport_ok": true,
  "raw_response_parse_ok": true,
  "visible_report_destination_bound": true
}
```

Allowed `transport` values are `raw-curl`, `send-room-text`, `mcp-tool`, and
`other`. The transport value documents how the message was sent; it does not
change the validator's core delivery-proof requirements.

## PASS requirements

The validator returns PASS only when all required delivery-proof conditions are
true:

- `schema` is `room-text-delivery-result/v1`.
- `intended_room_id` and `actual_room_id` are numeric integers.
- `intended_room_id` is the expected visible report destination, not blindly copied from the request room id.
- `actual_room_id` is the Room id returned by the transport response.
- `intended_room_id` equals `actual_room_id`.
- `message_id` is a non-empty string.
- `content_nonempty` is `true`.
- `transport` is present and one of the allowed values.
- `timestamp` is a valid ISO-8601 timestamp.
- `transport_ok` is `true`.
- `http_status`, when present, is a 2xx status.
- `raw_response_parse_ok`, when present, is `true`.
- For report-delivery proof, `visible_report_destination_bound` is present and `true`. Pure transport smoke or dry-run results may omit it only when explicitly labeled with `result_kind: "transport-smoke"` or `dry_run: true`. Non-dry-run `report-delivery` wrapper sends must provide `--expected-room-id` or `--visible-report-destination`; silently defaulting the expected destination from the request room is not allowed for report delivery.
- It is not marked as `duplicate_after_confirmed_success`.
- It is not marked as a non-Room substitute proof surface such as Task,
  Workboard, PR, local note, or final `NO_REPLY` only.

## Non-goals

The harness does not validate:

- overall workflow completion;
- task, Workboard, or PR status correctness;
- whether the delivered text was semantically sufficient;
- release or production readiness;
- native app behavior;
- any secret, token, or credential state.

`message_id` and Room ids are delivery proof only, not work-completion proof.

## Plain text is not harness proof

Ordinary visible Room text by itself is not Room Text Delivery Harness proof. It must be captured as a normalized `room-text-delivery-result/v1` object with message id, numeric matching Room ids, successful transport state, destination binding for report delivery, and validator PASS.

## Wrapper expected-destination rule

For non-dry-run `report-delivery`, `send-room-text.mjs` must receive an explicit `--expected-room-id <number>` or `--visible-report-destination <number>`. This keeps request routing separate from proof validation and prevents a wrong request Room from becoming a false positive by copying request Room into `intended_room_id`. Omission is allowed only for `--dry-run` or explicitly labeled `--result-kind transport-smoke`.
