# Intact letter revision — code review

2026-10-30 — **GO. No blocking or actionable product-code finding in the reviewed revision.** No product edits made by reviewer.

## Scope

Reviewed the revision plan, README, revised `letter-document.js`, `documents.js`, `content.js`, `actions.js`, `session.js`, `rules.js`, `document-reader.js`, `letter-styles.css`, UI/puzzle integration, fonts, save validator and affected tests. Reused the earlier room geometry/input/audio review; did not repeat an unrelated campaign audit. Followed `ck:scout` and `ck:code-review` protocols.

## Behavior and state boundaries

- The torn-letter ordering code, exported fragments/order and submit intent are removed from active code/tests. Nearby interaction opens the complete letter through the native document reader.
- Scroll completion enables an explicit action; opening/closing the sheet does not set `letterSolved`. `letter-finish` requires the active editable `restored-letter` reader and matching ID. `letter-record` additionally requires the current dialogue token/action and document proof. Closing/reset invalidates confirmation.
- The retained `letterSolved`, version and private save key preserve existing progress. Previously completed saves can read the new letter in the notebook without unlocking anything else. All later map/document/comparison/drawer/identity/chest/door prerequisites remain in the reducer.
- Reader extraction retains full text, final collection and read-only behavior. Resize observation disconnects on replacement; deferred font checks ignore disconnected readers. The active-panel guard rejects delayed opening callbacks after switching panels.
- Source/fiction metadata is outside the literary paragraphs. A-03 is a separate archival tag outside the letter article. Text remains selectable native HTML; CSS draws paper/envelope/folds. Patrick Hand and fallback fonts are local and loaded through the existing readiness barrier.

No new network, authentication, database or private-data boundary is introduced. Rendering uses `textContent`; the separate Bảo link/storage contract is unchanged. No new race, unhandled error path or shared-state mutation was found in this revision.

## Prose and source fidelity

Read the first 4,200 characters of the supplied local `Desktop/lich su.txt` and the existing historical-quality audit. No web research or reconstruction of corrupt source text.

The revised historical claims match the legible permitted material: Tây Bắc 1952; early-1953 initiative and experience across combat forms/terrain; limited Vietnamese equipment and supply needs; the accepted 252,000/445,000 troop figures; French equipment advantage and dispersed forces; economic pressure and reliance on United States aid. Troop totals retain visible supplied-source labels. No corrupt month, percentage, exact quotation or new historical identity is used as an answer.

The named correspondents, personal experiences and reports are explicitly fictional. P-01's March and P-02's April dates expressly say “Mốc dựng truyện hư cấu”; they do not assert dates of authenticated documents. The five texts use distinct family, quartermaster and staff-report voices. Game directions/source disclaimers are absent from their literary paragraphs. Nava appears after the cipher; his two-step plan is not taught in the early papers.

Measured Vietnamese whitespace word counts for body paragraphs:

| Paper | Words |
| --- | ---: |
| Opening letter | 303 |
| V-01 | 304 |
| V-02 | 296 |
| P-01 | 298 |
| P-02 | 301 |

## Verification

Reviewer ran fresh `node --test`: **25 passed, 0 failed**. Controller tests cover intact-letter reading, mismatched IDs, stale/closed confirmations, final confirmation, old-save notebook reread and unchanged progression guards. Existing content/NFC, malformed storage, reachability, input interruption, font readiness and audio tests remain passing.

Removing the arbitrary reaction minimum length permits natural short dialogue; assertions still require nonempty, distinct first/repeat/locked reactions. The case-flexible ending text assertion preserves the door-completion behavior check. Neither change hides a functional failure.

The lead reports a complete real keyboard/DOM journey through the new paper, A-03, four notes, comparison, drawer, chest and door, plus desktop/375px paper checks without progress setters. Those browser runs and final production build are lead-owned evidence, not independently repeated by this reviewer; see this plan's QA report. Current documentation cleanup and final test/build readback remain part of lead handoff.

Test/type coverage percentages not measured. No lint script configured. No plan state was changed by reviewer.

## Unresolved questions

None.
