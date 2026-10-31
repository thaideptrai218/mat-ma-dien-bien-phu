# Campaign integration code review

Date: 2026-10-31. Verdict: **GO for code integration** after the shared-audio initialization fix. No remaining critical/high blockers found in this review. Full real-browser route acceptance remains owned by parent QA; unit/build results do not replace it.

## Scope

- Reviewed `src/campaign/**`, `src/room-two/**`, `src/room-five/**`, `src/core/session-lifecycle.js`, lifecycle/action/scene/UI integration in rooms I/III/IV, shared audio, entry wiring and tests. New campaign/II/V JavaScript/CSS: approximately 3,322 nonempty lines, including preserved donor code. Prior unrelated pending changes are outside this campaign slice.
- Read README, code standards, campaign plan, plan review, Bảo adapter scout, lifecycle scout and both implementation reports before reviewing. Applied scout/code-review protocols and base checklist, critical pass then informational pass.
- No product code or protected donor files modified by reviewer. This report is the sole authored file. Build regenerated ignored dist output.

## Fixed finding

**Saved audio preferences could be lost when reloading directly into Room 5.** `src/room-five/session.js:23` copies parent controller preferences into loaded state. Previously the parent controller still had false/.5 defaults, overwriting saved settings and persisting those defaults on the next commit. The integration owner added `this.audio.setPreferences(this.store.state.settings)` at `src/campaign/runtime.js:27`, before any session mounts. Verified the updated initialization order against the actual source; focused and complete suites/build passed after the fix. Browser reload with enabled sound/custom volume remains an explicit QA check; persisted permission must still require a user gesture.

## Critical / high priority

None outstanding in reviewed code.

## Informational finding — fixed during review

- `src/room-one/scene.js:150` exposes `world: this.map`, a live reference. Previously `CampaignRuntime.snapshot()` passed it through, allowing callers to mutate active world data through the diagnostic object. Integration owner now wraps the entire returned plain snapshot in `structuredClone` at `src/campaign/runtime.js:66`. Verified the final source after the main checks; browser mutation isolation check remains parent QA. No outstanding medium finding.

## Scout boundaries and verified behavior

- **Future prefix / fragment fabrication:** campaign sanitization visits rooms in order and stops at the first unfinished physical exit. Room V requires all four derived fragments. II derives from all four original puzzles plus required collected clues; III/IV remain separate pickup/exit states. Arbitrary currentRoom/inventory/ending flags do not bypass the graph.
- **Ownership / lifecycle:** SessionHost serializes destroy/import/mount and rejects stale epochs. Disposal invalidates callbacks synchronously, removes native pagehide listeners, tears down custom scene resources while physics exists, preserves parent audio, and waits beyond Phaser DESTROY before removing the root. Base and subclass create/teardown paths tolerate pre-create/idempotent cleanup. Tests verify queue ordering, stale imports, rapid replacement and disposed/paused action rejection; real Phaser timing remains browser QA territory.
- **Modal pause:** global overlays clear held keys and force inactive audio; child input/intent paths consult parent pause. Child dialogs retain their own context. Old readers/confirmation tokens cannot award progress after reset/close.
- **Original Bảo fidelity:** independently read all eight current protected donor source files and verified their SHA-256 against provenance. Deep fixtures compare selected original chapter/clue/beat/puzzle/source/map registries; renderer/art bodies differ only in imports, CSS matches. Original evaluators preserve balance, channels, ordered fist moves and leading-zero fold. No donor checkout writes or legacy fake room achievements.
- **Final reflection privacy:** textarea value is never read into an intent, state or persistence; panel cleanup clears it. Blank continuation is valid after assembly, then physical exit and museum acknowledgment remain separate. Archive stores authored dialogue only. No network submission path found in the campaign/final-room slice.
- **Errors / trust boundary:** localStorage load/write failures are caught with visible notices and session play continues. Save/input validation occurs in pure reducers/sanitizers as well as action contexts. No backend, identity-dependent operation, database query or N+1 path exists in this scope. No new secret/PII output path found. Constructor failure recovery is user-visible; no fabricated progress is awarded.

## Verification

- Focused campaign/lifecycle/II/V command: **37 passed, 0 failed**.
- Fresh reviewer `npm test`: **105 passed, 0 failed**, no skipped/cancelled tests.
- Fresh reviewer `npm run build`: **passed**, 125 modules, five HTML entries. Existing large Phaser chunk warning remains; no build errors.
- Independent protected donor source SHA check: **8/8 match**.
- Final diagnostic clone-only follow-up inspected after test/build run; no further build launched during parent's active lazy-loaded browser journey.
- Type/test coverage percentages: not measured; no invented percentages. Repository has no dedicated lint/typecheck script. JavaScript build and test execution passed.

## Plan follow-up

Implementation matches the planned campaign graph, standalone save isolation, donor boundary, shared resource ownership, final assembly/reflection and museum framing. Plan file still says planned; lead/project manager should update status after QA and documentation are reconciled. Reviewer did not mutate plan tasks.

Parent acceptance still required: actual route through all historical rooms to Room V and ending; reload mid-route and at Room V with persisted sound preferences; global restart during transition; one canvas/dialog/audio context with no leaked handlers; journal/focus/blank reflection; standalone/donor regression. This review does not claim those browser checks completed. Sources remained supplied PDF4/local content; no historical web research.

Unresolved questions: None blocking code integration. Browser acceptance evidence remains pending in the parent QA report.

Status: DONE
Summary: GO after parent shared-audio initialization and diagnostic snapshot fixes; 105 tests and five-entry build passed, with clone-only follow-up source-inspected afterward.
Concerns/Blockers: Full browser acceptance must be completed and reported by parent; no remaining code blockers identified.
