# Code review: two playable heroes (Long / Quang)

Scope: src/heroes/*, src/campaign/{state,store,runtime,framing}.js, src/audio/voice-id.js, src/game/character-{atlas,animation}.js, src/ui/visual-novel-speakers.js, src/room-two/hero-name.js, scripts/voice/collect-voice-lines.mjs, tests/hero-*.test.js.
Method: static read + grep. `npm test` and `git diff` could NOT be run (the Bash tool returns empty output in this environment), so the 265-pass claim is unverified by me. Reviewed current HEAD files, not the literal diff.

## Verdict
No critical or high defects found. The design holds: the hero is applied on every store change, the sprite spec is read lazily per call, textures and animations are keyed per hero, voice ids are computed at call time with the active hero, and there is no import cycle (hero-profiles.js imports nothing).

## Medium
1. Voice id has two independent implementations (drift risk, test gap).
   - Runtime: src/audio/voice-id.js:11-13 `heroLineId`.
   - Build: scripts/voice/collect-voice-lines.mjs:64-66 repeats role + heroVoiceKey + heroText + voiceIdFor by hand.
   - No test asserts that every collected manifest id equals `heroLineId(line, hero)` for the same source line. If one side changes (e.g. NFC normalise, role mapping), the manifest silently misses and voice stays off with no error.
   - Failure: someone edits only `heroLineId` to strip a prefix; the manifest ids no longer match and every line goes silent.
   - Fix: have the collector call a shared `lineIdFor(role, text, hero)` and add one test round-tripping all lines through `heroLineId`.
2. Weak voice-coverage assertions (tests/hero-profiles.test.js:47-51).
   - `size === 5` is brittle.
   - Only `narrator-lecture` is checked for "no Long", and only `narrator`/`system-v2` for "no Quang".
   - The Quang route's `system` and `quang` voices (and the Long route's `quang`) are never checked for the wrong name. They pass today only because heroText is applied.
   - Fix: group by hero in the collector (tag each entry with its hero) and assert per route.

## Low
3. DOM localisation is destructive and one-way (src/heroes/hero-dom-name.js:9-21, 26-27).
   - Switching Quang -> Long (via "Chơi mới") just disconnects the observer. Text nodes already rewritten to "Quang" are never restored.
   - Today the only persistent chrome (header/progress) has no hero name, and the stage is replaced, so it is latent.
   - Failure: a future persistent label with "Long" would show "Quang" after a restart and a Long pick, until re-rendered.
   - Cheap fix: `location.reload()` is not wanted, so either document the invariant, or on sync with Long walk the DOM and revert via a stored original (WeakMap).
4. Attribute mutation re-walks the whole subtree (hero-dom-name.js:33 `rewrite(record.target)` recurses into children).
   - An aria-label/title change on a large container (e.g. the progress `ol`, re-rendered on every store update) re-scans all descendants.
   - Impact is small (the page is small), but for attributes only that one element needs rewriting. Fix: split `rewriteAttrs(el)` from the recursion.
5. Hero-select buttons are not locked after a click (src/heroes/hero-select-screen.js:16, runtime.js:65).
   - A double-click, or Long then Quang quickly, calls chooseHero + openCurrent twice. host.replace serialises it and the last choice wins, so it is benign, but the loading flash is visible. Disabling the cards on first click is trivial.
6. Duplicate rename logic.
   - src/room-two/hero-name.js `renameHero` (no `\b`, so "Quangx" would match) duplicates heroText's job in the opposite direction (donor Quang -> active hero).
   - It is needed for the Long route (the observer is off there), so not dead. Consider giving it `\b` for parity.
7. Test coverage holes.
   - No test for CampaignStore applying/resetting the hero (store.js:5,14,18): after reset the active hero must be 'long' and the HERO_STORAGE_KEY removed.
   - No test for syncHeroDomName (needs a DOM stub), including the attribute path and the no-op for Long.
   - No sprite test for `reduced` motion keys per hero, or for characterAtlasLayout with Quang's 8-column manifest (the layout is only validated at runtime against real assets).
   - tests/hero-profiles.test.js:13 asserts default Long, which depends on no localStorage in Node and on test-file process isolation (it holds with node:test).

## Checked, no defect
- Stale hero across "Chơi mới": store.reset -> update -> applyHero(null) -> resetHero; sync then disconnects the observer; the stage is replaced by the hero-select frame.
- Module-level caching: speakers use getters; characterSpec/Texture are functions; framing's openingFrames is called inside introFrame. Room 5's `getArchiveEntries` calls reflectionScript() inside the function. No hero-dependent value is cached at import time.
- Observer feedback loop: converges after one pass, since heroText is idempotent (no "Long" left after the rewrite). Only hero != Long runs it. Attribute filter limits the churn.
- heroText false positives: greps of src found no place names ("Thăng Long", "Vĩnh Long", ...) and no common-word "Long lanh/trọng/đong" uses. The word-boundary regex is safe for current content, but any future "Thăng Long" would become "Thăng Quang" (see unresolved Q1).
- Sprite spec: Quang 8 columns, idle [0], walk 1-4, run [5,6,7,6]; frame indices = row*columns+col; characterIdleFrame, clip keys, the 12 clips, and the texture/source/manifest keys are all hero-scoped, so switching heroes within one page is safe.
- Save sanitize: pre-hero saves with introSeen -> 'long'; unknown hero -> null (-> hero-select); introSeen=false keeps a chosen hero. phaseFor puts hero-select first.
- Room 2 donor files untouched (renaming is done via the wrapper in src/room-two/ui.js and hero-name.js).
- Privacy: no secrets. scripts/voice/tts-engines.mjs reads the bridge token from a runtime file at run time; only localhost URLs and an opaque profile UUID are committed. Diacritics in the reviewed files are intact.

## Dead code / duplication
- `lineVoiceId = heroLineId` alias (voice-line-player.js:20) is fine as a rename shim; drop it if no external user remains.
- Nothing else worth removing.

## Status: DONE_WITH_CONCERNS (tests not executed by me; see findings 1, 2, 7)

## Unresolved questions
1. Is any future content expected to contain the place name "Thăng Long" (or "Vĩnh Long")? heroText would corrupt it for Quang; an allow-list or a "Long" token marker (e.g. `{hero}`) would be needed.
2. The `quang` voice is a clone of a real person's voice ("mck", tts-engines.mjs:9,18) in a public repo: is rights/consent for it settled? (Decision recorded in voice-manifest.mjs:9 as a user decision; just confirming it is intended for public release.)
3. Please run `npm test` locally to confirm 265/265, since I could not.
