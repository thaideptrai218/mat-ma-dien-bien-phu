# Independent QA — Room 3 and Room 1 context

Date: 2026-10-31. Status: DONE. Local production preview `http://127.0.0.1:4173/`, isolated browser session `logistics-independent`. Read README, plan and supplied source brief. No external history research, product edits, progress injection or coordinate setters. Bảo checked by HTTP only.

## Room 1: complete live route

Ran the updated `tmp/room-one-journey.mjs` against this independent browser using trusted CDP movement keys/E, native forms and the read-only snapshot. Its only storage removal was this isolated session's Room 1 key, before beginning the route.

Completed letter → A-03 map → V-01/V-02/P-01/P-02 → four-way comparison → drawer → Henri Navarre identity → new July bulletin → Quang reflection → NAVA chest → first fragment → north door. Final `exitReached:true`, view `completed`; zero runtime exceptions. Wrong drawer code `1111` was rejected before correct `2413`.

- Four expanded paper readers contained 379, 352, 363 and 357 words including reader metadata. Each initially disabled the finish button until scrolled; reading alone did not collect the fact before explicit Quang confirmation.
- Source inspection against the supplied brief confirms early-1953 Lâm/Thành prose recalls Biên giới Thu–Đông 1950, Trung Du, Hòa Bình and Tây Bắc, together with stronger army/rear support. May appointment and July approval are in a separate July document, outside those early letters. Existing letter voice, greeting/signature and external fiction/source labels remain.
- Live identity result opened N-01 “Bản tin sau khi kế hoạch mới được thông qua”; full reader then reflection worked. After actual completion and reload, notebook offered N-01 and reopened all five paragraphs read-only, with May 1953 appointment, July approval and stated French goal. Completed state remained unchanged; no reset required.
- Compatibility of an existing decoded save is also covered by the passing focused test; this browser pass did not manufacture an old save.

Harness note: its legacy mobile assertion expected `documentElement.scrollWidth === 375`, but Chromium reported 360 with `innerWidth=375` because a vertical scrollbar consumes 15px. Reran via an in-memory harness adjustment to assert no horizontal overflow (`scrollWidth <= innerWidth`); no source/helper file changed. The live route then passed. Screenshots from that transient run were moved under `tmp/independent-room-one-*.png`.

## Room 3: independent live smoke

- Room 1 header link opened `/room-three.html` and correct introduction. Native introduction scroll and start button work. World snapshot is 3200×2000, southwest entry (300,1720).
- Trusted D/W then E reached first paper `preparation-record` at actual position approximately (516.67,1620.33). Reader displayed five paragraphs, 324 body words, and source/fiction metadata. Finish initially disabled. At 375×812, native End scrolling enabled it; Quang thought and separate confirmation collected the paper. Reload preserved it and returned to safe entry. No later activity/paper progress was injected.
- Map and minimap SVG viewBox both `0 0 3200 2000`; player circles matched actual (300,1720) after reload. Clicking expanded map left position unchanged.
- Mobile defaults to collapsed tasks; canvas focus plus Q expands its own scrolling panel. Paper button remained visible at x14.5,y737,272.09×46, enabled after reading. No horizontal overflow (`scrollWidth=360`, `innerWidth=375`).
- One explicit sound-button click unlocked running Web Audio with two ambient sources and RMS≈0.004. Mute stopped all sources and produced RMS/peak zero. No autoplay on fresh entry.
- Reset initially disabled until checkbox; checking then resetting cleared only Room 3 and returned to introduction. At 1264×569 the introduction has `clientHeight=527`, `scrollHeight=611`; native scroll to its button sets scrollTop84, fully exposes button at y474–518, and click enters successfully. An initial agent-browser offscreen click no-op was an automation limitation, resolved by its `scrollintoview` command.
- Room 1 completed state remained intact after Room 3 reset. Three independent localStorage keys were present for Rooms 1, 3 and 4.
- Room 3 fetched only localhost resources, including Be Vietnam Pro, Lora and Patrick Hand fonts. No uncaught browser errors reported.

## Responsive geometry

| Viewport | Tasks | Minimap | Result |
| --- | --- | --- | --- |
| 1264×569 | x954,y104,286×307.63 | x20,y289.63,175×205.38 | Document exactly1264×569. Tasks upper right, short-height map lower left; no overlap or clipping. Interaction y445–489. |
| 375×812 | Collapsed by default; expanded x170,y185,178×290 | x194,y522.41,154×172.59 | Expanded tasks end475, minimap starts522.41; interaction y714–758. No HUD overlap. Footer available with normal vertical page scrolling. |

Visual evidence inspected: `tmp/logistics-independent-mobile-expanded.png`, `tmp/logistics-independent-paper-375.png`; intro scroll evidence `tmp/logistics-independent-intro-scrolled.png`.

## Regression/build checks

- Independent `npm test`: **68 passed, zero failed**. Includes Room 1 old-save July context, Room 3 prerequisite/save/token rules, all anchor reachability and six local text-free SVG safety/content checks.
- Existing production build contains exactly three HTML entries: `index.html`, `room-three.html`, `room-four.html`.
- Followed Room 3 header link into Room 4; introduction/start succeeds, world2800×1800, entry(1400,1630), original four tasks and `0/7` document stage remain. No Room 1/3 completion copied into it; fetched assets remain localhost only.
- Bảo `http://127.0.0.1:4180/` responds HTTP200. Did not interact with or modify Bảo.

Scope limits: this independent pass does not claim Room 3's complete four-activity/five-paper/chest/exit journey or live cargo image loading. Root's separate actual route and UI worker's puzzle checks cover those. Six SVG files are covered here by the independent automated test run, not claimed as browser cargo-gallery verification.

Unresolved questions: none.
