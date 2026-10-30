# Hành trình hoàn chỉnh — nối phòng1–5

Status: implementation and browser acceptance complete; Git publication pending. [Review GO](reports/code-review.md), [full campaign QA](reports/campaign-qa.md). User accepted the remaining-work proposal: connect existing rooms with common progress, keep Bảo's room2, build final assembly/reflection and museum framing, verify and update shared code. Sources remain supplied PDF4/user text; no historical web research.

## Scope/output

`index.html` becomes the complete campaign menu/intro/room1→2→3→4→5→museum-return/ending. Preserve Room1 standalone at NEW`room-one.html`, existing room-three/four entries, newRoom2 standalone if useful; preserve their private saves and Bảo4180/donor checkout untouched. No automatic import of standalone accomplishments. Explicit links expose previews as separate saves. Do not award missing fragments from an external Bảo tab.

One parent runtime dynamically mounts actual sessions in one root/one PhaserGame at a time. No iframe or cross-origin shortcut. New globalkey `mat-ma-dien-bien-phu:campaign:v1` stores validated nested room snapshots, four derived fragments and shared audio preferences. Session storage adapters route their normal save writes to this envelope only. Global current room/fragment inventory derive from real validated completion/pickup, not supplied flags. Automatic room change only on physical exit. Reload restores current safe spawn/real solved steps. No player-written reflections stored.

## Bảo fidelity

Follow [adapter scout](reports/bao-adapter-scout.md). Copy current authorized font-fixed donor working tree assets/renderers, not only HEAD. Only navarre-plan world, sevenclues/theirbeats, fourpuzzles, intro/outro and referenced sources are exposed. Prefer extracted plain registries deep-equal compared to donor; original PuzzleView/NarrativeView/createRoomTexture code preserved except imports. Pure original evaluators may be extracted; do not call legacy applyAction/save validator or invent museum/HimLam achievements. Keep balance44/cardsteps, TAPTRUNG/PHANTAN channels, ordered four fistmoves, dbp/0612 fold exactly. Finalfold legitimately awardsII (originaloutro); physicalexitadvances tocanonicalRoom3. Gate geometry/art exact. Renderer live region/notebook hooks required. Canonical audio gains donor additional cue kinds compatibly.

## Session/lifecycle contract

Follow [lifecycle scout](reports/lifecycle-scout.md). Existing constructor `(root)` remains valid; add options`{storage,audio,isPaused,onExit}`. Explicit storage option(null included) overrides defaultlocalStorage. Injected shared audio belongs to campaign; standalone still owns/destroys its own controller. Scene pause and render audio mode include parent pause. onExit only after successful actual exit commit, suppress standalone completion panel in campaign.

Every session exposes async idempotent`destroy()`. Shared helper `disposeRoomSession(session)` invalidates callbacks/commit/render/show, removes storedpagehide listener, destroys UI withoutordinaryclosecallbacks, explicitly runs scene teardown whilephysics alive, then awaits PhaserGame DESTROY microtask before next session. Scenes teardown idempotent/optional beforecreate; create must not rebind if disposed. Do not rely on SHUTDOWN during Game.destroy. Clear oldrootclasses only aftergame destroyed, and guard all asynchronous imports/transitions by runtimeepoch. Globalrestart during pendingimport/destroy cannot resurrect oldsession.

Shared AudioController optional injection retains one unlocked context across campaign; parentownsits lifetime/statuscallback, children only change mode/preferences. Add donorcue support without breaking existingaudio tests. Newroom keeps sharedpreferences; permission/runtimeunlock distinct from persisted preference.

## Final room and framing

New RoomFiveSession in `src/room-five/`, scene2000×1400 with reconstructiontable, reflectionpoint/door and nearby props. Reuse configurableRoomOneScene/UI/reader, same WASD/E/Shift/M/N/Q. Rootpasses actual ownedfragments fromprior validatedroom snapshots; assembly rejects unless allfour exist.

Original project-native SVG victorypainting (not archival photograph) appears at museumstart, four-piece2×2 puzzle and museumreturn. Shuffled fourquadrants can be selected/swapped through nativebuttons/keyboard; complete exact order enables Quang/system conversation. Door initially remains closed afterassembly. SourcePDF5 question and Quang's authored learning/gratitude/contribution answer shown; optional personaltext is ungraded/skippable and never included in intents/save. Deliberatecontinue marks reflectionSeen, then actualnearbydoor/Eexit opensreturn. No ideological password or required userview.

Parentmuseumintro: universitystudentQuang visitsmuseum, touchesvictorypainting, light/timevortex, wakesfictionalĐờCátbunker7/5/1954; systemexplainsfiveconsecutive rooms/fourfragments. Afterfinalexit show samepainting and suppliedclosing message; explicitendingacknowledgment completes campaign. Do not claim victoryafteronly4rooms or bypassreflection/return. All historicalrecollection clearly learningfiction, source dates unchanged.

## Ownership and integration

1. Bảo worker owns`src/room-two/**`, optionalroom-two.html, Room2tests/provenanceonly. API`RoomTwoSession(root,options)`, `sanitizeSave`, `createState`, standalonekey; roomlocalstate flat audio prefs plus projection neededoriginalrenderers. exitReached afterrealdoor, fragmentCollected derivedlegitimatefold; exports`getArchiveEntries(state)` fulloriginalclue text forglobaljournal. Uses shareddisposeRoomSession helper. No donor edits.
2. Lifecycle worker owns existing sessions1/3/4, sharedRoomOneScene/UI and NEW`src/core/session-lifecycle.js`+tests. APIhelper `disposeRoomSession(session)` assumes options/ownsAudio/onPageHide fields; options injection exactlyabove. No newroom2/5 or campaign edits.
3. Finalroom worker owns`src/room-five/**`, paintingSVG, tests/provenance. API`RoomFiveSession(root,options)` with same lifecycle/storage/audio/pause/onExit plus`fragments:[1,2,3,4]`; purecreateState/sanitizeSave exports and privatekeyforadapter, flagsassemblySolved/reflectionSeen/exitReached. No standalone route auto-grantsfragments. Uses sharedhelper. Exports fullpaintingURL/content forparentframing or rootimportsassetpath. No otherroom edits.
4. Root owns`src/campaign/**`, index/standaloneentries/Vite/nav, globalpurestate/storage/runtime/menu/framing/journal, compatibleaudioextraSFX, tests/QA/currentdocs/Gitfinalization. Parentfactories load sessionmoduleslazily; actualstatevalidation snapshots derive progress. Globaljournal rereads priorcollected fullpapers/Room2 beats readonly, freezeschildinput/audio viaisPaused; globalnewgame confirmation resets globalonly. Current-room reset keeps earlier progress and invalidates downstream ifeverpresent.

## Global save invariants

Envelope version1,introSeen,roomStates1..5,settings,returned/endingSeen. Restore contiguousgraph: allowone in-progress currentroom, remove future-roomstates if predecessor exitincomplete. Room1fragmentfromchestOpened, Room2fromvalidfinalfold/fragmentCollected, Rooms3/4fromfragmentCollected; Room5requiresallfour previous exits andownedfragments. Assembly→reflection→exit→returnack requireproperprefix. Nevertrust arbitrarycurrentRoom/fragmentlist. No fake earlier completions while adapting Bảo. Broken/blockedstorage keeps runtimeplayable with visible notice.

## Verification and publication

Reviewed plan→disjoint implementation→focusedpuregraph/evaluator/deepdonorfidelity/lifecycle/destroy-beforecreate/reset/import-race tests→existing68+newtests/build. Actualcompletebrowserroute startpainting throughall4historicalrooms, validate sharedinventory/previouspaperjournal, same-originrooms, uniqueonecanvas/dialog/audio/clearedhandlers, reloadmidRoom2/3, finalfour-piece/reflection(ungradedblank)/physicaldoor/museumreturn. Test globalrestart during pendingtransition, localkeys untouched, blockedstorage and nativekeyboardcontrol; responsive screen and fonts/artlocal. Standalone1/3/4 regression and originalBảoHTTP/status unchanged. Review/independentQA required, currentdocs truthfully updated.

GitHub update follows earlier explicitpublicrepo/collaboration authorization and acceptedcompletionproposal, only after verifiedreviewable changes. Usegh/git, scan secrets/personaldata, no rawprivatePDF4/transcript upload, noforcepush. If remote main diverged, use focusedfeaturebranch/reviewablePR rather than overwrite others; no hosting deployment implied.

Unresolved blocking userquestions: none. Sourceassets are supplied/locallyauthored; optional reflection ungraded and private bydesign.
