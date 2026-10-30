# Bổ sung phòng1 và triển khai phòng3 hậu phương

Status: complete. [QA](reports/qa.md):68 passing tests, three-entry build, actual complete Room3 journey, independent complete revised Room1 journey and save/audio/responsive smoke. [Review](reports/code-review.md): GO. User supplied new history and a complete four-layer game concept; overlapping preparation is resolved explicitly below. No Git publication or full-campaign completion claimed.

## Deliverables

- Room1 existing route/save preserved, background expanded to1950–7/1953 from [supplied brief](source-brief.md). Early1953 letters recount earlier campaigns/stronger army/rear; no future knowledge. New July1953 whole-paper bulletin after HenriNavarre decoding covers appointmentMay and approvalJuly/goal. Historical context optional to old saves; notebook reread available afteridentitySolved; no save key/migration or two-step plan teaching.
- New `/room-three.html`:3200×2000 illustrated rear-supply camp. Five long natural papers, four varied challenges, four information tokens, final13/03/1954 seal, open chest/collect fragmentIII and exit. Map1/4 and Bảo gameplay retained. Links between rooms; independent save perroom, no fake synchronized campaign/firstthreefragments.
- Same native paper reader, Quang object reactions, top-right missions, actual minimap/M, Shift260/390, E near-only, N notebook/recovered tokens, safe focus/modal/audio and local fonts. No web or publication.

## Source and gameplay

Dates and facts only supplied brief/PDF4/local transcript. Stage1 uses classification rather than false strict chronology: decision6Dec and opening13Mar anchors; prepare stores/transport guns/build positions/finalize earlyMarch between, with no ordering of parallel tasks. Complete required supplies set plus sustained-combat purpose before THÁNG3 award.

Stage2 pairs six original SVG illustrations (clearly labelled, never archival photos) with supplied identities. Requires all6 matches plus bicycle terrain/load reason and civilian/youth contributions; NĂM1954.

Stage3 order two telegram word-card sets; equivalent NHANH/CHẮC cards may swap without being marked wrong. Final doctrine reasonB and insights careful assessment/reality/sure victory; ĐÁNH CHẮC, TIẾN CHẮC. No exact change-date invented.

Stage4 chronological3events plus date matching and opening/surrender/meaning questions; NGÀY13. Allfour complete required before finaldate. Dated13/03/1954 openschest; strategy token separately displayed as doctrine. Actual pickupIII and exitfinish, no completion of other rooms. Guided choices for semantic questions replace unreliable free-text AI grading.

## Architecture and ownership

1. Contentworker: Room1 `letter-document.js`, `documents.js`, `content.js`, NEW `nava-context.js`; Room3 `documents.js`, `content.js`, `puzzle-data.js`; source/content test/report. Five Room3 papers with IDs preparation-record,supply-journal,command-telegrams,opening-letter,north-report. Natural250–400words; Room1 expansion may grow to450 (new user context, preserve completeness). Kind/source/fiction metadata separate, no gameplay instructions in authored bodies. Room1 initial date stays early1953; July bulletin has its own date.
2. Worldworker: Room3 `world.js`, `art.js`, `scene.js`, sixSVG illustrations in assets/room-three, world tests. Reuse configurable RoomOneScene; new chest overlayopen/pickup, no changes to Room4. World3200×2000, entry300/1720; paper/station anchors below. Original vector art, no photo claim or internet assets.
3. UIworker: Room3 `ui.js`, `panels.js`, `puzzles.js`+logical helper modules/styles. Reuse configured RoomOneUI/reader unchanged; four native accessible activities and notebook tokens. No shared Room1/4 edits. Actual worldmap passed through reusable UI config. Controls support keyboard and narrow reading.
4. Root: Room3 `rules.js`, `save.js`, `actions.js`, `session.js`, `main.js`, entry/Vite/nav; Room1 controller bulletin flow and default caption; focused tests/QA/currentdocs/integration. New private keymat-ma-dien-bien-phu:room-three:v1. Store only validated read/collected prefix, completedchallenge prefix, chest/pickup/exit/settings; no arbitrary positions/drafts. Normalizeaccents includingĐ, parse finaldate exactly as day/month/year. Keep all currentkeys independent.

## World/intent contracts

Objects: papers preparation-record(520,1550),supply-journal(1280,1310),command-telegrams(2020,520),opening-letter(2700,880),north-report(2780,1250). Stations archive-cabinet(820,1500),cargo-yard(1510,1030),command-tent(2280,620),radio-station(2670,1510). Chest2390/1740,door3010/1800, supply-crates1160/1650,road-tools1740/830,field-lamp2200/1440. Fourzones depot→transport/road→command→battle dispatch. Anchorcoordinates are learning layout, not troop positions.

WORLD/OBJECTS same existing schema, all14reachable/selectable. RoomThreeScene public samefocus/getPosition/setGoal/resetPosition plussetChestOpen,setFragmentCollected. Snapshot chestOpen/fragmentVisible for QA. UIclassRoomThreeUI {root,onAction}, render snapshot samefields; show/close/isOpen/toggleQuests.

Paper gates interleaved with four challenges: firstpaper→prep; supplypaper→cargo; commandpaper→strategy; openingletter+northreport→radio; allfour→finalchest. Readonlyrereads always possible. Collected papers require actualreader bottom thencurrent Quang tokenconfirm; guesses/forgedsave/stalecallback cannot skip.

Puzzledata exports CHALLENGES [{id:'preparation'|'cargo'|'strategy'|'opening',stationId,documentIds,reward,title}], PREPARATION_CARDS [{id, text,group:'decision'|'preparation'|'opening'}], CARGO_ITEMS [{id,label,description}] IDs bicycle,porters,artillery,rice,ammunition,engineers; TELEGRAMS {initial:[{id,text}],final:[...]} canonical lists; OPENING_EVENTS [{id:'him-lam'|'doc-lap'|'ban-keo',text,date:'13/03/1954'...}]; REWARDS derivedfromCHALLENGES. Stableanswers: prepSuppliesfood/weapons/ammunition/medical +purpose sustain; cargo reason terrain-load +contributorscivilians/youth; strategy reason sure-victory +insightsassess-reality/careful-command/victory-first; openingtargethim-lam,surrenderban-keo,implicationsbreak-north/expand-control/next-offensives.

Views preparation→preparation-submit {groups:{cardid:group},supplies:[ids],purpose}; cargo→cargo-submit {matches:{imageid:cardid},reason,contributors}; strategy→strategy-submit {initial:[wordids],final:[wordids],reason,insights}; opening→opening-submit {order:[eventids],dates:{eventid:DD/MM/YYYY},target,surrender,implications}; final→final-submit{date}; documentstandard; rewards/notebookwithtokens. No UI grants state. Sourcewriter supplies data to these contracts; rootpurevalidators enforce.

## Verification

Reviewed plan first. Focused tests: all4prerequisites/docs, parallelprep unordered accepted, supply/questions semantics, sixunique pairs, repeated equivalent wordcards accepted, wrongactualphrases rejected, exactdateparse, allfourrequired, independent corrupt/blocked saves, staleconfirmations, openchest vs pickupIII. Existing43tests keep meaningful contracts; Room1 prose cap expands only because user adds context (not hiding functional failure).

Build3 intended entries; browser realkeyboard/E completeRoom3 (fivepapers/fouractivities/final/openpickup/exit), native formquestions/drafts, 6imagesloadedandvisuallyidentifiable, smallscreenpaper/puzzles/HUD, sprint/map/focus/audio, reset/reload/isolation. Room1newcontext flow and existing4/Bảo smoke. Reviewer/independentQA and currentdocs reflect exactscope. No Git publication.

Unresolved: no blocking user question. Original archival transport photos not supplied; labelled SVG illustrations serve gameplay, not fabricated historical photography. Precise doctrine-change date intentionally not a question.
