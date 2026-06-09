---
docType: "procedure"
sourcePageId: "1373667425"
sourceTitle: "01-3. Workflows — Case A~H"
sourceVersion: "2"
sourceHeading: "Case G. Preview/Internal release"
---

# Case G. Preview/Internal release

Goal: produce a preview/internal build that users can verify before a production submit.

Participants:

- QA/Release (lead)
- Product/Planning (approval)
- Mobile Architect (confirmation)

Procedure:

1. QA/Release runs the EAS preview/internal workflow.
2. Run the Maestro critical path.
3. Generate the evidence JSON and release note.
4. Product/Planning confirms scope and acceptance.
5. Post install/test instructions in the room.

Completion criteria:

- EAS build id exists.
- Maestro passes.
- Release note exists.
- Install/test method is shared.
- mobile-gatekeeper required check passes, with PR/SHA/EAS/Maestro/evidence consistency confirmed, author ≠ approver, and rework_count below cap.

## Source

- Page ID: 1373667425
- Source heading: Case G. Preview/Internal release
- Source version: 2
