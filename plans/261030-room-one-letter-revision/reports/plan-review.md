# Letter revision plan review

2026-10-30 — **GO for implementation. No blocking plan defect.** This approves the approach, not unimplemented prose or runtime behavior.

Reviewed `plan.md` against README, existing letter/controller/reader/reducer/save contracts and the local historical-quality audit. Used only local files. No product edits.

The proposal directly removes the rejected ordering mechanic. A readable personal letter, external archival marking, separate Quang deduction and explicit final confirmation form a coherent replacement without changing the later evidence chain. Keeping `letterSolved`, save version and the private key preserves completed saves; unfinished old saves safely start at the new letter. Local `assets/fonts/patrick-hand-regular.ttf` and its license already exist.

Implementation checks already covered by the plan and required for final review:

- Open the intact paper directly. Delete the ordering UI, `letter-submit`/`LETTER_ORDER` dependencies, and obsolete fragment assertions in all three controller/content/rules test files; update world/art/HUD/tutorial/README references. Existing source still contains these because this is a plan review.
- Opening, scrolling or closing the paper grants no progression. Accept `letter-finish` only for the active editable letter reader; accept `letter-record` only for its current deduction/action token. Closing/resetting invalidates it. Preserve notebook/document read-only behavior and every later prerequisite.
- Keep historical facts traceable to legible supplied-source statements. The existing audit explicitly rejects corrupt dates/months, names and percentages: do not repair them from memory. Fictional letter dates/voices must not imply an authenticated historical document. Keep source/fiction labels and troop-number provenance outside the literary body but visible when reading.
- Preserve the four notes' actual comparison evidence and full 250–350-word texts while replacing editorial prose with distinct fictional voices. Do not make the handwritten letter a raster image or put game instructions into its author's voice.
- Check selectable Vietnamese text, local font loading and scroll completion on desktop and 375px. Run controller/save/content regression tests and the updated real browser route; confirm old completed saves still work. Bảo source/preview remains untouched.

No new permission or user decision is required. Final code/prose/history review remains part of the implementation verification already specified in the plan.

## Unresolved questions

None.
