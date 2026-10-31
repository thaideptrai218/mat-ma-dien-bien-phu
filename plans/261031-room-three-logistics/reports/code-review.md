# Room 3 logistics and Room 1 context — code review

2026-10-31 — **GO for the reviewed code. No remaining actionable findings.** Reviewer changed this report only. Full visible gameplay acceptance remains lead/independent-QA work.

## Scope

Reviewed all new `src/room-three/` modules and six local SVGs, Room 1's expanded content/July bulletin/controller flow, shared-reader/default-caption interfaces, navigation and three-entry Vite configuration. Read the plan, source brief and current README. Applied `ck:scout`/`ck:code-review` with base/web risk checks. Historical evaluation uses supplied local material only; no web or independent historical-verification claim.

## Progression, persistence and callbacks

- The five papers and four challenges interleave in both reducer guards and save restoration. The sanitizer walks each challenge's required read/collected papers before restoring that challenge and reaching later papers. A forged all-papers/zero-challenges save is pruned to its reachable prefix.
- Paper collection requires the current editable reader, matching document, final deduction action and current token. Closing/reset invalidates confirmation; rereads remain read-only. Challenge submissions additionally require their active unsolved view and the current challenge's collected papers.
- Preparation has exactly five cards: two dated anchors and three unordered preparation cards. Supplies, purpose, six cargo matches, civilian/youth roles, strategic reasoning and opening implications are checked by the pure validators. Unknown, duplicate or substituted set members fail.
- Telegram ordering requires unique known IDs while comparing the visible word sequence. Equivalent NHANH/CHẮC swaps pass; reusing one card or changing the phrase fails. This avoids grading hidden IDs as history.
- All four challenges gate the final date, including the doctrine challenge. Only day/month/year rewards form 13/03/1954; doctrine remains separately displayed. Date parsing compares complete components, not a substring. Chest opening, fragment III confirmation and exit are separate transitions.
- Room 3 uses its own private save key. Existing Room 1/4/Bảo keys are not copied or inferred. Blocked/corrupt storage remains playable. Drafts contain runtime form choices only, survive ordinary render/reopening and clear on reset; no arbitrary position or private free text is persisted.
- Scene reuse retains real collisions, nearest reachable E interaction, camera/world bounds, normalized 260/390 movement, focus interruption and movement-based audio. Chest visual flags handle pre-create saves, open/pickup state and reset. Full/minimaps receive the configured Room 3 world.

No new server/auth/database boundary, secret or private-data transmission is introduced. Native text rendering and local self-contained SVGs avoid untrusted HTML or active/remote image content. No new actionable race, input-contract failure or unhandled error propagation was found in the inspected normal UI paths.

## Source and presentation

The five Room 3 bodies contain **328, 321, 337, 323 and 340 words**. Fiction/source metadata remains outside authored prose. The supplied preparation decision, transport roles, doctrine reasoning and 13/15/17 March events are preserved. Bản Kéo is surrender rather than a copied attack; 17 March is expressly not the whole campaign's end. No precise doctrine-change date is invented. The March letters/reports do not witness future 7 May events.

Room 1's retrospective letters discuss Biên giới 1950, Trung Du, Hòa Bình, Tây Bắc and stronger army/rear without knowing later Navarre events. The 331-word July bulletin separately covers the May appointment, July approval and French goal, without teaching the two-step plan. Expanded Room 1 bodies remain within the authorized 450-word cap; increasing that test cap reflects the supplied new scope rather than hiding a functional failure.

The July bulletin opens after the current identity dialogue token and is available as an optional read-only notebook entry to existing decoded saves. It adds no save migration or new chest prerequisite. Room 4 changes are navigation-only; its explicit UI configuration remains separate.

Inspected the rendered six-image montage: bicycle, porters, artillery team, rice, ammunition and road workers are visually distinct. UI states they are illustrations, not archival photographs, and supplies descriptive alt text. Supplied 320px strategy and 375px final-panel screenshots retain legible native Vietnamese text and usable ordering controls. These screenshots do not establish a full gameplay route.

## Review follow-ups resolved

- The last quest previously displayed only the opening-challenge title while its check waited for exit, contradicting the four-completed count. It now names the complete group **“Mật điện, rương và cửa ra”**, matching that flag.
- The map's 16 March letter now says **“Thư sau trận Độc Lập”**, consistent with its dated contents.
- The temporary `src/room-three/ui-check.html` mock-intent harness was removed. It is not counted as real gameplay evidence.
- Final-date placeholder now shows the input format rather than the assembled solution. Current reducer/validator source also includes the null/unknown boundary guards covered by the added regression test.

## Verification and acceptance

Reviewer ran fresh **`node --test`: 68 passed, 0 failed**. After final copy/label fixes, a focused rerun of Room 3 rules/content and Room 1 actions passed **25/25**. Tests cover joint restore, predecessor bypass, semantic failures, duplicate cards, stale confirmations, old-save July access, world reachability, SVG safety, fonts/audio and retained Room 1/4 contracts.

Reviewer ran fresh **`npm run build`: passed**, with exactly `index.html`, `room-three.html` and `room-four.html` in `dist`. Only the existing Phaser bundle-size warning remains. Test/type coverage percentages were not measured; no lint script configured.

Lead acceptance still requires the complete real keyboard/E/DOM Room 3 route, all six production image requests, paper bottoms, wrong-answer/draft behavior, reset/reload/key isolation, chest/pickup visual state and Room 4/Bảo smoke. Independent QA is checking the new Room 1 May→July route. Pure tests, UI fixtures and screenshots are not claimed as those real journeys. No plan status was changed by reviewer.

## Unresolved questions

None.
