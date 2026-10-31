# Character browser QA

Status: DONE — behavior and final rebuilt walking artwork accepted; centered failure handling verified in Room1/3/4. The first-pass observations below are preserved with their final resolution at the end.

## Method and scope

2026-10-31. Read README, character plan and runtime report. Used `ck:agent-browser`, fresh isolated headless session `character-qa` (CDP54302), built preview `http://127.0.0.1:4173/`. Separate `character-qa-failure` browser (CDP54462) for blocked-image failure. Did not build, edit product files, touch donor4180, teleport, alter game state/save, or inject progression. Input was native CDP keyboard/mouse; snapshots were read-only. HTML focus calls selected the actual canvas/input.

Owned evidence: ignored `tmp/character-qa-*.mjs`, JSON and PNG files. `runtime.mjs` samples actual native WASD/Shift movement and asserts body geometry. `smoke.mjs` measures cadence and navigates standalone/campaign entries. `failure.mjs` blocks only the source sprite image and reloads.

## Verified behavior

- All four walk directions actually moved and covered all four respective frames: down1–4, left9–12, right17–20, up25–28. All four Shift runs covered their three distinct frames: down5–7, left13–15, right21–23, up29–31. Each release selected the matching directional idle0/8/16/24. Together these samples exercised all32 frame indices.
- Every sampled movement frame had actual Arcade body24×16 world pixels, body.x+12==player.x and body.y+8==player.y, scale.5, origin(.5,176/192), canonical `quang-reference` texture. No old missing texture key.
- Read-only requestAnimationFrame sampling found walk speed259.6worldpx/s and frame transitions around125ms (8fps). Run selected separate frames at about83ms (12fps); short fixed-step sampling measured402.4worldpx/s, within the harness18px/s tolerance of390. These are observed intervals, not exact benchmark timing.
- Camera followed north from scrollY742 to353. Input remained actual collision-bound movement.
- Esc settings opened while W held: immediately idle, stationary across250ms. Canvas blur to header button stopped movement and held idle. Native settings INPUT focused plus heldD left position unchanged.
- Reduced-motion emulation changed live MediaQueryList: actual Shift movement continued364worldpx but every sampled animation was directional idle, frame0. Turning preference off restored normal walking.
- HoldingS into south wall stopped at y1544, body bottom1552, while samples changed from walking frames1–4 to down-idle0. Releasing was not required for the stationary idle.
- Room2,3,4 fresh standalone entries each decoded the asset, created canonical down-idle frame0/body24×16 and reported characterError=null. Scope was inherited character/asset smoke; no full puzzle playthrough.
- Campaign native museum buttons (Chạm vào bức tranh → Lắng nghe lời chỉ dẫn → Bước vào phòng1) and room intro entered room1 with canonical character and zero fragments. Reload retained room1, correct texture/body and legitimate unsolved state.
- All runtime/smoke checks recorded zero Runtime.exceptionThrown events.

## Visual and failure evidence

- `tmp/character-qa-normal.png`: normal1440×1000 gameplay. Transparent character, correct outfit, readable scale, no black rectangle, atlas seam or cropped body. Name/shadow remain below feet.
- `tmp/character-qa-walking-actual.png` and `running-actual.png`: screenshot captured while native movement key was still held. Running pose visibly differs and retains bag/clothing; flight pose lifts feet above shadow.
- Other screenshots: each direction after release, wall idle, modal idle, reduced motion, Room2/3/4 intro, campaign room1.
- Root/reviewer identified insufficient side-walk contact/passing contrast and is replacing those walk poses. This pass does not approve the pending replacement's visual motion or assert that current walking is free of gliding. Final rebuilt visual smoke remains root-owned.
- Separate browser blocked `*motion-sheet*.png*`, disabled network cache and reloaded. Snapshot character=null, error='Không tải được hình nhân vật Quang.'; visible canvas message instructed reload. No placeholder player and no runtime exception. Image request blocking was removed afterwards.
- **Minor failure-screen UI issue:** visible error starts at canvas(24,24), overlapping existing top-left room/era HUD in `tmp/character-qa-missing-image-error.png`. Error remains readable; root notified. No silent patch.

## Limits and unresolved work

No full historical puzzle/campaign regression journey, mobile walk controls, coldload disposal stress or OS window-hidden lifecycle claim. Existing regression tests/build owned elsewhere. Pending replacement artwork needs rebuilt visual review. Minor overlapping failure text remains root decision.

## Final rebuilt asset and failure-screen recheck

Status: DONE — refreshed built preview after root's16-pose walk replacement and failure handling fixes. This section supersedes the pending artwork review and minor HUD overlap concern above.

- Native WASD on the refreshed standalone build again sampled all16 walk indices in their correct directional clips: up25–28, down1–4, left9–12, right17–20. All releases idled. All samples retained canonical texture/body24×16, with physics center at player position.
- Captured each right-walk pose during actual heldD movement at3× screenshot crop: `tmp/character-qa-final-right-17.png` through `-20.png`. Contact poses have clearly separated feet; passing poses bring the legs together and lift the trailing foot. Clothing/bag and head scale remain consistent. Normal-scale `tmp/character-qa-final-walk-normal.png` shows an acceptable, readable four-frame illustrated walk. It improves the previous near-identical-wide-leg/gliding appearance. This is acceptance for the project's simple exploration sprite; no high-fidelity anatomical claim.
- Additional actual up/down movement screenshots and3× crops: `tmp/character-qa-final-{up,down}-moving.png` and `-zoom.png`. Back/front views retain the rust overshirt, pale trousers/shoes and shoulder bag. No black rectangle, edge seam, detached limb or cropped body observed. Side zoom screenshots from the later collision route captured directional idle after contact; the earlier four right-pose crops are the actual moving side-view evidence.
- Native movement into the south wall again ended y1544/body.bottom1552 with down-idle0 while key remained held. Additional route contacted letter prop at x1264 (body.left1252) and right interior wall at x1364 (body.right1376). Character collision footprint remains exact. No teleport/state setters used.
- Separate failure browser, fresh document per entry and blocked source image, now verified **Room1, Room3 and Room4**. Each returned character=null with populated error and zero runtime exceptions. Each displayed the reload message clearly near canvas center, without overlapping era/header/task HUD; child scenes did not proceed into missing-player exceptions. Screenshots `tmp/character-qa-final-failure-room-{one,three,four}.png`.
- Final harnesses/evidence: `tmp/character-qa-final*.mjs`, `final-evidence.json`, `final-directions-evidence.json`, `final-failure-evidence.json`. A harness-only assertion initially included one previous-direction frame at a native input transition; filtering samples by the selected directional animation fixed the measurement. No product change was made.

Unresolved questions: none. Full puzzle/campaign journey and OS-hidden lifecycle remain outside this character-focused pass, as stated above.
