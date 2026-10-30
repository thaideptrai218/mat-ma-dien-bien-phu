# Independent browser acceptance — Trâm Room 4

Date: 2026-10-30. Status: DONE. Tested local production preview `http://127.0.0.1:4173/` in isolated agent-browser session `tram-independent`; no external web research, state injection, coordinate mutation or product edits.

## Verified

- Room 1 `/` preserves world 2400×1600 and safe entry (1200,1410). Trusted keyboard W then E reached the original intact letter. Reader displayed all five paragraphs, greeting/signature, A-03 outside letter prose, and fiction/source disclosure. End enabled reading completion; Quang reflection then explicit A-03 confirmation succeeded.
- Room 1 header link “Phòng 4 · Trâm” navigated to `/room-four.html` and its introduction. Room 4 entry button works; world is 2800×1800 and spawn (1400,1630).
- Trusted keyboard W/A/W then E reached first Room 4 paper at actual position approximately (373,1426). Full reader opened, End enabled “Cùng Quang suy luận”, and separate “Ghi dữ kiện vào sổ tay” collected `east-offensive`. Reload preserved that document and returned Quang to safe entry. No progress fabricated for other documents or puzzles.
- Full map and minimap SVG viewBox both `0 0 2800 1800`; player marker at actual snapshot point (1400,1630). Clicking expanded map did not move Quang.
- One explicit audio button click unlocked Web Audio: running, enabled, audible, two ambient sources, nonzero RMS. Mute removed sources and produced RMS/peak zero. Audio was silent on fresh entry.
- Separate localStorage keys existed for Room 1 and Room 4. Room 4 reset required checkbox, enabled reset button, returned to introduction, and its entry button returned to game. Room 1 `letterSolved:true` remained intact after Room 4 reset.
- Resource list contained localhost assets only, including Be Vietnam Pro, Lora and Patrick Hand fonts. Browser `errors` returned no uncaught errors through checks.
- Independent `npm test`: 43 passed, zero failed. Existing build contained exactly `index.html` and `room-four.html` top-level HTML entries.

## Responsive acceptance, final rebuilt preview

Rectangles measured in CSS pixels; screenshots also inspected for short desktop and expanded mobile.

| Viewport | Tasks | Minimap | Result |
| --- | --- | --- | --- |
| 1264×569 | x954,y104,286×307.63 | x20,y286.94,175×208.06 | Full document exactly1264×569; map fully visible, no HUD overlap. Short-height layout intentionally puts map lower left. Interaction x522,y445,220×44. |
| 1280×720 | x970,y110,286×307.63 | x1066,y426.30,190×217.70 | Normal lower-right map; tasks, map and interaction do not overlap. |
| 375×812 | Default collapsed; Q expands x170,y135,178×290 with own scroll | x194,y458.39,154×186.61 | Expanded tasks end y425, map starts y458.39, interaction starts y664. No overlap or horizontal overflow. |

Initially found cropped minimap below fold at1264×569. Root corrected Room 4 short-height CSS; reloaded rebuilt preview and verified resolved. Evidence: `tmp/tram-independent-desktop-fixed.png`, `tmp/tram-independent-mobile-final.png`; earlier failing screenshot `tmp/tram-independent-desktop.png` retained only as diagnosis.

## Scope limits

Independent pass does not claim complete seven-paper/crossword/T/L/chest/exit journey or all mobile puzzle states. Those belong to root/worker browser reports. This pass verified early real interactions, shared Room 1 behavior, responsiveness, map behavior, storage isolation, reset, local resources and audio.

Unresolved questions: none.
