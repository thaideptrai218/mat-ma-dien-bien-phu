# Phòng 4 của Trâm — Những ngày quyết định

Status: complete — standalone Room4 implemented,43 tests/build/full keyboard journey passed. [QA](reports/qa.md), [review](reports/code-review.md), [independent QA](reports/independent-qa.md). User explicitly requested map4 authored by Trâm. PDF4 p6 names Trâm; p18–22 supplies history, room geometry and exact ciphers. No Git publication or full-campaign completion claimed.

## Scope and accepted source

New playable room at `/room-four.html`, accessible from current Room1 header/link. Keep Room1 intact and Bảo separate unchanged. This is a standalone room preview, not fake completion of Rooms2/3 or a restored old battlefield map. Source only local PDF4 and user lich su.txt; no internet. Source audit: ../261030-pdf-four-rebuild/reports/pdf-requirements.md. Crosswords/T-L grids visually checked p22. Keep wording of Trâm's facts/questions, author authenticating metadata; authored letters clearly fictional.

Room2800×1800: chest in center(1400,950), crossword station north(1400,240), two cipher tables behind chest(1080,570)/(1720,570); seven documents around walls. Chronological route: east-offensive(360,1330), final-assault(330,760), a1(620,320), headquarters(2180,320), results(2470,760), north(2420,1320), independence(1770,1540). Entry1400/1630; exit1400/100; lamp880/1190 and radio2050/1120 have Quang reactions. Spatial archive learning map, not literal battlefield geography. Real collision/nearby E/camera; same Shift260/390, M/N/Q, top-right task panel and minimap.

## Historical reading and puzzle chain

- Seven whole documents in timeline order:30Mar–30Apr siege/bị động;1–6May goals/tiêu diệt;night6May A1≈one ton;7May17:30 HQ capture;after7May results including16,200 killed/captured and weapons;1954 northern liberation afterGenève;late1954 independence significance. Dates of personal letters are fictional context; do not move northern liberation to7May or fabricate1955 scene. Natural voices,250–350words each,5paras, visible source/fiction metadata, separate short Quang thoughts. No fake historically authenticated letters.
- Read full paper→Quang thought→explicit confirmation; one current next document, reread collected always possible. New save independent of Room1/Bảo.
- Only after all7 collected: fill exact rows `[TIEUDIET,BIDONG,MOTTAN,SOCHIHUYTRUNGTAM,VUKHI,MIENBAC,DOCLAPDANTOC]`; starts `[8,7,8,0,8,3,5]`, grid17columns, row4 length16 (minimal PDF drawing correction). Rows deliberately differ from document timeline.
- Correct crossword→choose vertical column index8zero-based →TIMTVAL/TÌM T VÀ L. Neither correct keyword nor shape guesses may skip prerequisites.
- Table T exact grid `[QUYET,UNCAH,AMHTA,CTICN,AAELG,MTNAT]`; selectedindices `[0,1,2,3,4,7,12,17,22,27]` yieldsQUYETCHIEN. Table L exact `[QNAVE,ULTAV,YNLNI,EBCLO,TQMAL,THANG]`; selectedindices `[0,5,10,15,20,25,26,27,28,29]` yieldsQUYETTHANG. Require exact cell sets, no duplicates/extra; show reading order. Do not accidentally use oldPDF3UITAV.
- Both shapes→input finalphraseQUYẾT CHIẾN, QUYẾT THẮNG→chest automatically opens with visual change. Walk to chest to take fragment4 (only that fragment), then exit completes room. Do not award first3fragments or fake finalcampaign ending. Completion links Room1/Bảo, Room5 pending.

## Architecture and ownership

1. Content worker owns src/room-four/{documents,content,puzzle-data}.js and tests/room-four-content.test.js. Exact IDs/answers/grids. Source report under reports.
2. World worker owns room-four/{world,art,scene}.js and tests/room-four-world.test.js; safely parameterizes room-one/scene.js constructor with `{world,artFactory,sceneKey,textureKey,initialGoal}` defaults unchanged. All WORLD usages become this.map; RoomFourScene extends reusable scene with dynamic chest overlay/setChestOpen. No input/audio changes.
3. UI worker owns room-four/{ui,panels,puzzles,styles}.js/css; safely parameterizes room-one/ui.js via optionalconfig (brand/roomLabel/date/world/panelFactory), room-one/ui-map.js optional worldargument default unchanged. Reuse reader and standard settings/dialogue/notebook; `createPanel` optional world passed for full map. Exact ownership noted in prompts; no same-file overlap.
4. Root owns room-four/{rules,save,actions,session,main}.js, room-four.html, Vite, focused tests, integration, current docs/reports. Pure reducers gate entire chain; active view/token guards document grants. New key mat-ma-dien-bien-phu:room-four:v1; normalize dependency prefixes; storage errors still playable. Save settings same audio behavior, no custom free text.

## Contracts

Content DOCUMENTS array ordered IDs above {id,code,title,kind,date,author,recipient?,fictionDisclosure,source,paragraphs,reflection,summary}; INTRO/ENDING arrays; REACTIONS keyed allworldobjects {first,repeat,locked} arrays. puzzle-data exports CROSSWORD_ROWS [{id,documentId,question,answer,start}], BOARDS {t:{rows,cells,phrase},l:{...}}.

WORLD same shape as Room1 with named objects; scene constructor callbacks unchanged; public setChestOpen(bool), getPosition/clearKeys/focus/setGoal/resetPosition. Room4UI constructor {root,onAction}, render(snapshot) same state.collectedNoteIds/position/nearby/goal and audio; show(view,data), close/isOpen/toggleQuests. Views crossword→crossword-submit{answers:{rowid:value}}, column→column-submit{column:8}, board→shape-submit{board:'t'|'l',selected:[0..29]}, final→final-submit{phrase}; boarddata{board,solved}; commondocument standardfinish; completed ownview. No UI grants state. Drafts not overwritten on render/errors.

## Verification and delivery

Tests narrow rules/save→all Node tests; oldRoom1 default contracts stay compatible. Exactsourceword lengths/index extraction/shapes; predecessor bypass; chronologicalread/collect/stalecallback; allworldanchors reachable; openchest≠collectedfragment; sanitized saves; shared font/audio/input tests. Build two intended entries only. Browser actualkeyboard/E full route through7papers/crossword/column/tables/chest/exit; camera/map/sprint/interruption, wronganswers, reset/reload, paper and puzzle mobile375, localfonts/audio. Room1 browser smoke aftersharedoptionschange; Bảo200andunchangedGitstatus. Code reviewer required; docs truthfully state independent Room4+Room1, Room3/5 pending. No commit/push/deploy.

Unresolved questions: none blocking implementation.
