# Public room labels and standalone Room 5

Status: complete

## Scope
- Remove personal author names from public room labels, cross-room links, entry metadata, and player-facing dialogue; preserve fictional character names and historical/content provenance in internal records.
- Add `room-five.html` as a standalone playable preview with the four illustration fragments available only in that isolated preview.
- Isolate standalone Room 5 persistence from the campaign save; leave campaign gating and campaign behavior unchanged.
- Update README and architecture/deployment docs for public labels and the additional entry.
- Replace the game-name text in campaign and room headers with the supplied typographic logo image.

## Acceptance criteria
- No personal author names appear in public-facing room titles, descriptions, navigation labels, or story dialogue.
- Standalone Room 5 can be opened directly, complete assembly/reflection/exit independently, and displays a clear preview/standalone context.
- Preview progress uses a distinct storage key; it never mutates campaign inventory or completion.
- Campaign Room 5 still receives only fragments earned through the campaign.

## Touchpoints
- Room HTML metadata and `src/room-one`, `src/room-three`, `src/room-four` labels/dialogue.
- `src/room-five/session.js`, `src/room-five/save.js`, new `src/room-five/main.js`, `room-five.html`, `vite.config.js`.
- README, `docs/project-overview-pdr.md`, `docs/system-architecture.md`, `docs/deployment-guide.md`.

## Out of scope
- Rewriting authored room content or character/story names, changing historical puzzles, deployment, push, or campaign save migration.

## Validation
- Build the Vite multi-entry app and inspect public-facing string search plus save-key separation. No test suite changes or test execution.
- The first named file path was unavailable; used the image subsequently attached by the user and cropped transparent margins while preserving the artwork.
