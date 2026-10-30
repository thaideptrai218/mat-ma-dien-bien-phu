# Room 1 independent acceptance checks

Date: 2026-10-30. Status: **PASS for the checks below**.

Used updated README, installed `ck:agent-browser` skill/live core guide and isolated Chromium session `room-one-independent` against preview `http://127.0.0.1:4173/`. No external research, progress injection, coordinate setters or product changes. Did not access the controller's `room-one-qa` session or Bảo's checkout/port 4180.

## Verified independently

| Area | Interaction and evidence | Result |
| --- | --- | --- |
| Current application | Fresh preview opens “Trước bản kế hoạch”; intro button enters Quang's archive. | Pass |
| Quest placement | Desktop screenshot and bounds show quest at upper right: x939/y110, width286, within 1249px page area. Four numbered steps and current letter subgoal visible. | Pass |
| Quest collapse | Click “Thu gọn nhiệm vụ” changes `aria-expanded` true→false; focus canvas and press Q changes back to true. | Pass |
| Both maps | M opens full map; minimap and full map use `viewBox="0 0 2400 1600"`, each 36 rectangles (background/frame + 12 walls + 22 props). Last blue circle matches read-only scene coordinates x1200/y1410, with r45 compact/r34 full. | Pass |
| No map teleport | Click full-map SVG, then Escape: player remains x1200/y1410. | Pass |
| Audio startup | Fresh reload with sound off, one mouse click “Bật âm thanh”: button becomes “Tắt âm thanh”; diagnostics running/unlocked/enabled/audible all true, two ambient sources, nonzero signal (RMS approximately .004, peak .0067–.0074). Keyboard Enter activation also works. | Pass |
| Audio mute | Click “Tắt âm thanh”: button becomes “Bật âm thanh”; enabled/audible false, active and ambient source counts both zero, signal zero. | Pass |
| Reset guard | Settings starts with reset disabled. Check “Tôi muốn xóa tiến độ phòng này.”: reset enabled. Click reset: fresh intro opens. Click its “Bước vào căn phòng”: closes intro and resumes archive, `introSeen=true`, all progression flags false/collections empty, audio reset off. | Pass |
| Local fonts | All five DBP Text/Display faces report loaded. Resource list contains local BeVietnamPro regular/semibold/bold plus Lora normal/italic files; every observed resource URL has localhost preview origin. Vietnamese labels inspected visually. | Pass |
| 375px page | At 375×812, document scrollWidth/clientWidth/innerWidth all375, and DOM scan finds no element extending past right edge. Header, tools, quest, minimap and interaction button fit. Fresh mobile reload defaults quest collapsed. | Pass |
| Mobile map modal | Width337, x19/right356; SVG width299. Title, legend, goal and close control visible; document remains375px wide. | Pass |
| Mobile settings modal | Width337, x19/right356, height520.75; close, audio, confirmation checkbox and reset control fit. | Pass |
| Mobile notebook modal | Width337, x19/right356, height354.25; heading, empty-state text and close fit; page remains375px wide. | Pass |
| Browser errors | `agent-browser errors` returned no entries across checks. Console contained only Phaser startup banners. | Pass |
| Storage isolation | Isolated browser origin stores only `mat-ma-dien-bien-phu:room-one:v1`. No Bảo keys appeared. | Pass |
| Automated checks | Independent `npm test`: 24 tests, 24 pass, zero failures/cancellations/skips. Includes state/action/save/content/font/audio/geometry/input suites. | Pass |

## Retirement checks

Independent file listing: `dist/index.html` is the only built HTML entry; remaining build files are current JS/CSS, fonts and Quang portrait. Source tree retains only current Room 1 and reusable geometry, character, audio, font/UI utilities. Wireframe retains source images only.

Checked six retired paths: `chapter-four.html`, `src/main.js`, `src/chapter-four/main.js`, `src/chapter-four/archive-world.js`, `src/content/world-data.js`, `docs/wireframe/index.html`. All absent on disk. Preview requests return HTTP200 **current index HTML fallback**, with current title/new asset entry and no old chapter-four entry. This is fallback behavior, not a claim of HTTP404 retirement.

Actually navigated browser to `/chapter-four.html`: renders current Room 1, has `window.getRoomOneSnapshot`, loads current `/assets/main-*.js`, and does not load the old chapter-four application. No browser error followed.

## Scope and limits

- Controller separately performed the full real-key document→comparison→drawer→identity→chest→door route. This pass did **not** repeat or independently certify that whole route.
- Movement/sprint, moving map-marker tracking and all three decorative prop reactions belong to the controller's additional checks. Here both map markers were compared with the actual stationary scene point.
- Mobile checks cover page, map, settings and empty notebook. Full collected-document/puzzle/completion modals were not independently traversed at375px in this isolated fresh session.
- Audio evidence is Web Audio runtime/source/signal measurement; physical speaker playback was not judged by a human listener.
- No external resource was requested in observed resource lists. Did not simulate a disconnected network adapter or block localhost.
- Temporary screenshots under `tmp/room-one-independent-*.png` were inspected; they are working evidence, not a required distribution asset.

No blocking defect found in this pass. No product files changed.

## Unresolved questions

None for the checked scope.
