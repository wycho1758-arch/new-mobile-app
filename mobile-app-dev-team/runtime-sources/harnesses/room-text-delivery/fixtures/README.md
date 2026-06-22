# Room Text Delivery Fixtures

`valid/` fixtures must pass `validate-room-text-result.mjs`.
`invalid/` fixtures must fail and cover missing proof, room mismatch, literal
`room-N`, empty content, transport failures, malformed responses, non-Room
substitutes, report-destination override mistakes, and duplicate sends after a
confirmed success.

Additional explicit invalid cases include `plain-text-only-no-normalized-result`, `missing-visible-report-destination-bound`, and `access-boundary-403`. Plain text alone is not harness proof; a 403 access-boundary result is expected route-boundary evidence but fails delivery proof.

Wrapper command evidence also covers non-dry-run report-delivery with missing expected destination. That case must fail before send/normalization, while dry-run or `result_kind: transport-smoke` omission remains allowed.
