# Tóm tắt mã nguồn

Cập nhật 2026-10-31. Bản chính là campaign năm phòng cùng origin, JavaScript ES modules/Phaser 3.90.0/Vite 8.3.5, không backend. Preview 1–4 giữ private saves; donor Bảo 4180 bảo toàn.

| Đường dẫn | Trách nhiệm |
| --- | --- |
| `index.html`, `src/campaign/main.js` | Bootstrap chiến dịch/bảo tàng, đợi font. |
| `src/campaign/runtime.js`, `session-host.js` | Một session/Game tại một thời điểm, lazy imports, queue/epoch, await destroy, shared audio/parent pause. |
| `src/campaign/state.js`, `store.js` | Envelope campaign, sanitize chuỗi exit, suy ra mảnh/current room/phase, adapter storage và shared settings. |
| `src/campaign/ui.js`, `archive.js`, `framing.js`, `styles.css` | Header/mục tiêu/kho mảnh, sổ toàn văn xuyên phòng, restart, museum intro/return/acknowledgment. |
| `room-one.html`, `room-two.html`, `room-three.html`, `room-four.html` | Bốn preview độc lập; không auto-import thành tích vào campaign. |
| `src/room-one/session.js`, `actions.js`, `rules.js`, `save.js` | Chuỗi thư/A-03/hồ sơ/đối chiếu/điện/rương/cửa; optional parent adapters, giữ standalone key. |
| `src/room-one/{letter-document,documents,nava-context,content}.js` | Văn xuôi lịch sử 1950–7/1953, N-01 riêng sau identity, nguồn/hư cấu và suy nghĩ Quang. |
| `src/room-one/{world,art,scene,input}.js` | 2400×1600; scene cấu hình world/art/key/goal, input/focus/physics/animation 260/390 tái dùng. |
| `src/room-one/{ui,ui-panels,ui-puzzles,ui-map,document-reader}.js` | Shell, native dialog/reader, mini/full map, settings và panel factory cấu hình. |
| `src/core/session-lifecycle.js` | Disposed guards, cleanup, shared-audio ownership, async idempotent Game DESTROY và deferred real-door onExit. |
| `src/room-two/{session,actions,rules,save,ui,scene,archive}.js` | Adapter Bảo, clue/beat và puzzle prefix thật, fold cấp II, cửa đông, toàn văn cho global journal, key riêng. |
| `src/room-two/system-guidance.js` | Lớp lời thoại campaign cho Phòng 2: đổi xưng hô Hệ Thống ở intro/outro, thêm lời dẫn sau mỗi trạm; registry donor không đổi. |
| `src/room-two/bao/` | Story/world/source registries, donor snapshot/provenance hashes, renderer/evaluator/art/CSS giữ gốc hoặc chỉ đổi import. |
| `src/room-three/{session,actions,rules,save,goals,answers,puzzle-data}.js` | Năm giấy/bốn hoạt động xen kẽ, validators ngữ nghĩa, token, khóa ngày/rương/pickup III/cửa, graph restore. |
| `src/room-three/{documents,content,world,art,scene}.js` | Năm giấy đầy đủ, trại 3200×2000 và 14 vật, lớp rương/mảnh theo state. |
| `src/room-three/*-panel.js`, `puzzle-controls.js`, `ui.js`, `panels.js`, `puzzles.js`, `styles.css` | Phân nhóm chuẩn bị, sáu cặp, thẻ mật lệnh, tin mở màn, draft/token/notebook. |
| `assets/room-three/*.svg` | Sáu minh họa hậu cần tự vẽ, không ảnh tư liệu. |
| `src/room-four/` | Trâm 2800×1800, bảy giấy/ô chữ 17 cột/T-L/câu cuối/rương/pickup IV/cửa; nội dung và cơ chế giữ nguyên khi nối. |
| `src/room-five/{session,actions,rules,save,world,scene,art}.js` | Room 5 chỉ trong campaign: actual fragments→assembly→reflection→physical exit, lifecycle chung. |
| `src/room-five/{content,panels,archive}.js`, `room-five.css` | Tranh 2×2, cuộc trò chuyện, ô cá nhân không gửi/lưu, archive lời Quang. |
| `assets/images/victory-painting.svg` | Một tranh sáng tác dùng xuyên museum intro/assembly/return. |
| `src/ui/room-links.js`, `font-styles.css`, `game-fonts.js`, `assets/fonts/` | Preview links, font cục bộ và hàng rào đợi font Canvas. |
| `src/ui/visual-novel-{dialogue,speakers,voice}.js`, `visual-novel-dialogue.css` | Hội thoại kiểu visual novel dùng chung (mọi phòng): một câu mỗi bước, chân dung theo người nói, Trước/Tiếp lời/Đọc toàn cảnh, nút cuối giữ action/token của session; đọc giọng từng câu (chỉ Hệ Thống/Lời kể). |
| `src/ui/system-hint-card.{js,css}`, `SYSTEM_HINTS` trong content từng phòng (Phòng 2: `system-guidance.js`) | Thẻ Hệ Thống bên trái giữa màn hình trong dialog khi mở câu đố: lời nhắc khi mở, gợi ý nhẹ mức 1 sau lần sai đầu, mức 2 từ lần sai thứ hai; bảng chỉ báo “Chưa đúng.”, không còn nút gợi ý. |
| `src/core/world-geometry.js`, `src/game/character-animation.js`, `src/audio/` | Geometry/tầm E, animation và Web Audio chung, gồm cue Bảo; `voice-id.js` (mã câu theo nội dung), `voice-line-player.js`/`dialogue-voice.js`/`voice-preferences.js` (phát lồng tiếng theo dòng), bank SFX/nền. |
| `scripts/voice/`, `scripts/{build-voice-script,generate-voice-lines,master-voice-lines,build-voice-review-page}.mjs` | Trích 332 câu từ content → `public/audio/voice/manifest.json`, bảng phát âm TTS, gọi CapCut/OmniVoice, hậu kỳ FFmpeg (Hệ Thống preset mạnh, -16 LUFS), trang duyệt. |
| `scripts/build-sfx.mjs`, `scripts/sfx/`, `public/audio/{sfx,ambience}/` | 33 SFX + 7 nền (Kenney CC0 + tự tổng hợp), manifest và credits. |
| `src/game/character-atlas.js`, `assets/characters/quang-reference/` | Clip idle/walk/run bốn hướng, crop/anchor chung và atlasRGBA theo ảnh mẫu; collider không đổi. |
| `scripts/pack-character-sheet.ps1`, `tests/character-*.test.js` | Đóng bảng hình nguồn tùy chọn trên Windows; kiểm tra PNG thật, loader, clip, tỷ lệ/chân và body. |
| `tests/campaign-*.test.js`, `tests/session-lifecycle.test.js` | Global graph/storage/archive/host, destroy-before-create, stale/reset/import guards. |
| `tests/room-*.test.js`, `tests/audio-controller.test.js`, `tests/game-fonts.test.js` | Nội dung/nguồn, luật/session/save, donor fidelity, world, ảnh/font/audio và Room 5. |
| `vite.config.js` | Năm entry: campaign+preview 1–4;5173 dev/4173 preview, Phaser chunk dùng chung. |

## Hợp đồng cần giữ

Xưng hô: Hệ Thống gọi Quang là **Ký Chủ** (không dùng “ngươi”/“bạn”); Quang gọi **Hệ Thống**, xưng **tao** khi nói với nó, xưng “mình” khi tự nghĩ. Phòng 1/3/4/5 có `GUIDE` (lời dẫn sau từng bước), Phòng 2 có `PUZZLE_GUIDE`; Phòng 1/3/4 dùng mảng `CAMPAIGN_*` thay cho thay chuỗi (Phòng 2 dùng lời trung tính cho cả hai chế độ); `tests/system-address-dialogue.test.js` khóa quy ước này. Lời đáp cuối của Quang ở Phòng 5 giữ nguyên văn cốt truyện (“Tôi…”).

UI không cấp tiến độ, scene không ghi storage; controller kiểm tra active view/token/parent pause/disposal. Session nhận optional storage/audio/isPaused/onExit, không lấy save preview khi campaign đã inject adapter. Parent await destroy thực trước khi tái dùng root, giữ một shared audio context. Diagnostics trả bản clone, không setter gameplay.

Campaign key `mat-ma-dien-bien-phu:campaign:v1` chỉ nhận snapshot phòng đã sanitize/chuỗi exit liên tục. Mảnh suy từ chest I/fold II/pickup III-IV; Room 5 cần cả bốn và các cửa trước. Suy nghĩ cá nhân không có trong intents/save. Current-room reset giữ trước, global new game chỉ campaign; preview 1–4 và donor giữ riêng, không migration.

Room 2 bản sao bảo toàn bảy clues/chín beats/bốn puzzles, exact map/gate/renderer/art/CSS; donor nguồn và 4180 không bị sửa. Bản app/map museum cũ và chapter-four.html vẫn nghỉ sử dụng; campaign mới tái dùng canonical sessions, không gọi legacy progression.

## Trạng thái kiểm chứng

119/119 tests/build năm entry và [review GO](../plans/261031-campaign-link/reports/code-review.md). [QA thật](../plans/261031-campaign-link/reports/campaign-qa.md) qua museum→1–5→return/ack với earned fragments, archive 26 entries, shared audio/reload/reset và clone diagnostics. [Room 2 preview QA](../plans/261031-campaign-link/reports/room-two-qa.md)/[Room 5 component QA](../plans/261031-campaign-link/reports/final-room.md) ghi phạm vi riêng. Git update sau verification, chưa hosting.

[Kiến trúc](system-architecture.md) · [Kế hoạch](../plans/261031-campaign-link/plan.md) · [Lifecycle](../plans/261031-campaign-link/reports/lifecycle.md) · [Bảo toàn Bảo](../plans/261031-campaign-link/reports/room-two.md)
