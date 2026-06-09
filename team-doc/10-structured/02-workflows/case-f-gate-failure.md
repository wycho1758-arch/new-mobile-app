---
docType: "procedure"
sourcePageId: "1373667425"
sourceTitle: "01-3. Workflows — Case A~H"
sourceVersion: "2"
sourceHeading: "Case F. QA 실패 또는 Gate 실패"
---

# Case F. QA 실패 또는 Gate 실패

**Goal:** Prevent unbounded rework by classifying the root cause of each failure.

**Participants:** QA/Release, the failing task owner, Mobile Architect, and Product/Planning (when the rework cap is reached).

## Procedure

1. Report the gatekeeper or Maestro failure in the room/PR. Never disguise a flaky or failed run as a pass, and never relabel a failed required check as green.
2. Increment `rework_count`.
3. Classify the failure cause as one of `implementation`, `contract`, `test`, `environment`, or `scope`.
4. The owner agent applies the fix.
5. When the cap is reached, stop automatic retries. Before stopping, report the owner and reason to the feature room.
6. Product/Planning or the human owner decides: cut, retry, reassign, or accept risk.

## Completion Criteria

- The failure reason is recorded in evidence.
- A repeated identical failure triggers escalation.
- After the cap is reached, the work is not auto-reassigned to the same agent.

## Source

- Page ID: 1373667425
- Source heading: Case F. QA 실패 또는 Gate 실패
- Source version: 2
