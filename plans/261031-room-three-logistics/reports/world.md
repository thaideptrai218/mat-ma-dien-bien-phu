# Phòng 3 — camp, scene and illustration delivery

Status: DONE. 2026-10-31. Scope: new Room 3 files only; Room 1/4/Bảo source untouched.

## World and scene

3200×2000 rear-supply learning camp. Entry (300,1720). Four distinct areas: southwest depot, transport/road work, open-sided command tent, eastern incoming dispatch/radio. A broad painted road links them. Contours, a loaded bicycle, porters and a static rope/artillery team convey preparation work; their placement asserts no battlefield geography. Local DBP Text font and earthy olive/copper colors follow the existing game. Canvas includes the explicit learning-layout caveat.

All 14 anchors retain the plan coordinates and radius110. Furniture and berms use the shared collision geometry; canopy roofs, road and workers are painted scenery. Every object has multiple connected, walkable positions where shared nearest-target E selects it. No interaction teleport was introduced. Shared RoomOneScene keeps normalized260/390 movement, character animation, focus, camera and audio behavior.

RoomThreeScene configures world/art/keys without shared edits. Chest state may be restored before scene creation. Opening paints a raised lid, dark interior and light puzzle fragment visibly marked III. Pickup removes fragment/III while retaining the open empty chest. Snapshot adds chestOpen and fragmentVisible. Teardown destroys its overlay/label.

## Original local assets

Six standalone600×400 SVGs: heavily loaded bicycle pushed by a person; two shoulder-pole basket porters; three-person rope team pulling wheeled artillery uphill; burlap rice sacks with grain visible in one; wooden ammunition crate and shell silhouettes; two road workers with shovels clearing rocks. All authored as local vector markup during this task, with fictional generic clothing/hats and ivory/olive/navy/copper palette. No external assets, photographs, archival scans, remote references, embedded captions, executable scripts or user PDF material. Historical identity comes only from the supplied source brief. These are educational illustrations, not archival photographs or precise equipment reconstructions. UI supplies visible disclosure and descriptions separately.

## Validation

- `node --test tests/room-three-world.test.js`:4/4 pass. Agreed anchor schema, safe spawn, full body-clearance flood, at least12 reachable nearest-selected approaches per anchor, useful open corridors, solid berm/furniture blocking, radius-only E restrictions, six local inert SVG assets.
- `node --check src/room-three/art.js` and `node --check src/room-three/scene.js`: pass.
- ImageMagick rasterized all six SVGs; visually inspected [montage](illustrations-montage.png). Images distinguish the six intended subjects, with no clipped cargo, people or equipment. Bicycle hand/handle connection refined after inspection.
- Isolated headless Chrome loaded the real artwork module/local font and rendered [full camp artwork](camp-artwork.png). Visually inspected zone separation, readable labels, large road, equipment, tent, depot, chest and exit. Screenshot is a standalone canvas inspection; integrated Phaser gameplay/flags/real keyboard testing belongs to root integration QA.

Files: `src/room-three/world.js`, `art.js`, `scene.js`; `assets/room-three/{bicycle,porters,artillery,rice,ammunition,engineers}.svg`; `tests/room-three-world.test.js`; this report and two local PNG inspection artifacts. No commit/push/publication.

Unresolved questions: none. Full integrated gameplay QA remains part of the controller's delivery.
