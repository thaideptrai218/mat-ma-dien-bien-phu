---
title: Màn IV — Những ngày quyết định, bản chơi thử
status: completed
priority: P1
effort: medium
tags: [phaser, chapter-four, playable-trial]
created: 2026-10-30
branch: main
---

# Màn IV — Những ngày quyết định

## Phạm vi đã yêu cầu

Người dùng yêu cầu thiết kế thử màn 4, cung cấp nội dung lịch sử và PDF bản 3 hai trang. Tạo bản chơi thử riêng tại `chapter-four.html`, dùng Phaser/JavaScript/Vite hiện có. Game chính, tiến độ localStorage v1 và phòng hòa bình hiện tại giữ hợp đồng cũ. Không tự commit/push hoặc deploy cho lượt thiết kế này.

## Căn cứ và thiết kế

- Đã đọc README, quy ước mã, hướng dẫn thiết kế và PDF bản 3; đã xem cả hai hình ô chữ/mật mã trang 2. Canva liên kết không truy cập được, hai ảnh nhúng đủ để xác định luật.
- Theo yêu cầu bổ sung “thiết kế map mới sát cốt truyện”: thế giới mới3200×1920, đường kể chuyện chiến hào đông nam→đồiA1 phía đông→cầuMườngThanh qua sông→sở chỉ huy phía tây. Phòng ký ức hư cấu cuối ở trong khu sở chỉ huy: rương trung tâm, hai bàn phía sau, tư liệu tổng kết quanh tường đúng vai trò PDF. Bảy tài liệu phân bố theo diễn biến và có trong sổ tay/phòng cuối khi đã đọc. Chân dung/lờiMinh, hoạt ảnh bốn hướng, SFX/camera, Shift chạy1,5×, M sơđồ, N sổtay, Q mụctiêu.
- Vị trí/quãng đường sơ đồ hóa, không giả là bản phục dựng quân sự. Sông là vật cản, cầu là lối nối; chỉ mở nhánh ký ức bên kia khi đã ghi3 hồ sơ đầu objective/encirclement/a1. Đây là khóa kể chuyện, không khẳng định cây cầu lịch sử đóng/mở theo người chơi.
- Bối cảnh chính 1–7/5/1954. Hồ sơ cuối tháng 4 ghi là dẫn nhập; A1 làm chủ rạng sáng 7/5, sở chỉ huy khoảng17:30 cùng ngày. Hậu quả sau Genève là phần nhìn lại, không ngụ ý thống nhất ngay7/5. Sửa câu hỏi PDF nhầm toàn bộ16.200 người là bắt sống thành loại khỏi vòng chiến đấu/tiêu diệt và bắt sống.
- Thu nhận tài liệu chỉ ở nút ghi câu cuối. Câu đố1 cần đủ7 tài liệu, bảy đáp án và cột đúng. Chuẩn hóa tiếng Việt/đ-Đ, khoảng trắng, dấu câu; không mất draft khi sai/đóng bảng.
- Ô chữ đáp án TIEUDIET, BIDONG, MOTTAN, SOCHIHUYTRUNGTAM, VUKHI, MIENBAC, DOCLAPDANTOC. Vị trí bắt đầu cột0-index `[8,7,8,0,8,3,5]`, cột8 đọc thành TIMTVAL. Giữ cột bắt đầu/độ dài theo chữ, tránh ô thiếu của bản ảnh.
- Bảng2 tái tạo đúng2 lưới6×5 từ ảnh. Bảng trái chọn hìnhT, đọc QUYETCHIEN; bảng phải chọn hìnhL, đọc QUYETTHANG. Chọn sai/missing không qua. Sau đó nhập khẩu hiệu ở rương; không thể đoán khẩu hiệu để bỏ qua hai câu đố. Rương mở có hoạt ảnh, mảnh ghép và lời kết.
- Tài sản bố cục/nhân vật/hiện vật là minh họa hư cấu. Lời kể mới viết, dữ kiện có liên kết nguồn chính thống. Không hướng dẫn chế tạo hoặc vận hành vật liệu nổ.

## Ranh giới mô-đun và quyền sửa

| Người thực hiện | Tệp sở hữu |
| --- | --- |
| Nội dung/luật | `src/chapter-four/story-data.js`, `trial-rules.js`, `tests/chapter-four-rules.test.js` |
| Scene/thế giới | `src/chapter-four/trial-scene.js`, `archive-world.js`, `archive-art.js`, `trial-input.js`, `trial-minimap.js` nếu cần, `tests/chapter-four-world.test.js` |
| Giao diện | `chapter-four.html`, `src/chapter-four/styles.css`, `src/chapter-four/ui/**` |
| Controller | `src/chapter-four/main.js`, `trial-session.js`, `trial-actions.js` nếu cần; `vite.config.js`, README, tài sản mới, kế hoạch/QA |

Không sửa module main-game. Tái dùng CHARACTER_FRAME/registerCharacterAnimations/characterAnimationKey, AudioController, hình học thuần và chân dung hiện có. Không kế thừa AdventureScene vì ràng buộc getMap của game chính. Build thêm HTML input với fileURLToPath, giữ manualChunks hiện có.

## Bàn giao giao diện

- State chỉ một owner. TrialScene nhận callbacks `{getState,onReady,onInteract,onNearby,onMotion,onRegionChange,onShortcut}`; public `setInputBlocked`, `refreshProgress`, `applySettings`, `getSnapshot`. Map xuất `archiveWorld` có width/height/walls/props/checkpoints/interactables/regions/exits; targets gồm id/type/x/y/radius, clue cóclueId; hai bàn typecrossword/cipher, rương typechest. Bảy clueId cố định objective/encirclement/a1/headquarters/weapons/north/independence. Gate cầu yêu cầu3clue đầu. Settings audioEnabled/audioVolume/reducedMotion/brightness; không persist bản thử.
- TrialInterface constructor `{getState,onIntent,onModalChange,getAudioState}`; public `render(state,nearby,audio)`, `showIntro`, `showClue(id)`, `showNotebook`, `showCrossword`, `showCipher`, `showChest`, `showMap(snapshot)`, `showHelp`, `showComplete`, `showFeedback(text,tone)`, `showToast`, `close`, `isOpen`, `getActiveNarrative`.
- UI giữ drafts và cursor; root kiểm tra `{clueId,lastLine}` trước collect. Ý định `start`, `interact`, `collect-clue`, `submit-crossword {answers,column}`, `submit-cipher {leftCells,rightCells}`, `open-chest {passphrase}`, `audio-toggle`, `set-settings`, `reset`, `focus-game`, `show-map`, `show-notebook`, `show-help`, `show-goal`.
- Luật xuất `createTrialState`, `applyTrialAction`, `evaluateCrossword`, `evaluateCipher`, `evaluateChest`, `normalizeAnswer`, `getTrialGoal`. Actions discover-clue/collect-clue/solve-crossword/solve-cipher/open-chest. State discoveredClueIds/collectedClueIds/crosswordSolved/cipherSolved/chestOpened/settings; root started riêng.
- Scene chỉ xử lý phím canvas WASD/arrows/E/M/N/Q/Shift, xoá held keys khi mở bảng, blur, hidden; bỏ repeat cũ. UI không chặn nhập/Tab/Enter của forms. Kích hoạt audio qua nút click thực; cue sau đóng bảng phát khi canvas đã focus. Reduced motion từ hệ thống/tùy chọn.

## Các bước và nghiệm thu

- [x] Review kế hoạch/luật trích cột và hìnhT/L trước code.
- [x] Hoàn thành nội dung, luật, giao diện và bản đồ; không thay save/game chính.
- [x] Đi bộ tới đủ7 tài liệu, đọc/ghi, giải ô chữ→cột→hìnhT/L→mật khẩu→rương và ending bằng UI thật.
- [x] Thử sai, thiếu clue, Esc sớm, draft, keyboard, sprint/map, camera/collision/focus và âm thanh thật; không dùng debug setters.
- [x] Kiểm thử luật/hình học mới + toàn bộ tests; production build cả hai entry; smoke game chính.
- [x] Review độc lập, sửa lỗi có bằng chứng, ảnh QA, README và báo cáo; bàn giao URL chơi thử cục bộ.

## Hoàn tất và bằng chứng

Ngày 2026-10-30: 6/6 mục hoàn tất, không có phase file riêng. Đồng bộ trực tiếp plan vì phiên không có Task API. `story-data.js` xuất `clues` dạng mảng, tra theo ID; không giả định object keyed-by-ID.

14/14 test mới và 37/37 tổng đạt; production build hai entry đạt. Bundle cuối `chapterFour-CmN86TbV.js` / `chapterFour-BsRK1xbh.css`. [QA toàn tuyến](reports/chapter-four-qa.md) chứng minh đi bộ/đọc/ghi 7/7 → ô chữ → T/L → sai/đúng khẩu hiệu → rương hoạt ảnh → câu cuối kết và PCM thực. [QA cạnh biên](reports/chapter-four-edge-qa.md) xác nhận draft/reset bằng lượt đi bộ thứ hai, form/phím giữ, viewport, audio và save chính nguyên byte; không nhận là lượt độc lập giải toàn kết. [Review mã](reports/code-review.md) đóng ba lỗi Medium, không blocker; [review kế hoạch](reports/plan-review.md) giữ đúng phạm vi preimplementation.

Chạy theo [README](../../README.md), bản thử production tại **http://127.0.0.1:4173/chapter-four.html** sau build/preview. [Bàn giao](reports/handoff.md), [nhật ký](../../docs/journals/2026-10-30-chapter-four-trial.md). Thay đổi còn cục bộ; không commit/push/deploy hoặc tải PDF bản 3 lên repo. Không có câu hỏi chưa giải quyết cho phạm vi bản thử.

## Rủi ro và quay lui

Sai cột ô chữ/ảnh thiếu ô: test khẳng định chuỗi TIMTVAL và khẩu hiệu từ đúng tế bào. Sai lịch sử: phân biệt dẫn nhập, đêm6–rạng7 và Genève; nguồn mốc giờ có chênh lệch dùng rạng sáng. Softlock: bản đồ cửa rộng và kiểm tra reachability body24×16. Focus: một owner phím và native dialog; modal đóng/mở liên tiếp chống stale close. Quay lui bằng việc bỏ entry thử mới và trả Vite input trước, game chính không phụ thuộc module thử.
