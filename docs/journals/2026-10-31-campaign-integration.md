---
date: 2026-10-31
status: verified
scope: campaign-integration
---

# Nối năm phòng thành hành trình trở về bảo tàng

## Bối cảnh

Người dùng chấp thuận nối các phòng đã có, giữ Bảo, bổ sung Phòng 5 và khung bảo tàng, dùng chung tiến độ rồi cập nhật mã chia sẻ sau kiểm chứng. Nguồn lịch sử vẫn PDF bản 4/bản chữ/brief cung cấp, không nghiên cứu web. Preview/phòng riêng và donor 4180 phải được giữ, không suy ra thành tích campaign từ chúng.

## Thay đổi

`index.html` chuyển thành campaign museum intro→1→2 Bảo→3 hậu phương→4 Trâm→5→museum return/acknowledgment. Room 1 standalone chuyển sang room-one.html; room-two.html là bản local adapter mới, Room 3/4 giữ entry; Vite năm HTML. Room 5 không có preview cấp đủ mảnh.

Parent runtime/host lazy-load một session/Game tại một thời điểm, nhận storage adapter/shared audio/parent pause/onExit. Constructor room cũ vẫn tương thích standalone. Chỉ cửa thật mới transition. Sổ hành trình giữ nguyên văn earned papers, Bảo clue beats, N-01 và authored final script; readonly và pause phòng khi mở.

Bảo adapter giữ bản current donor có font fixes, bảy clues/chín beats/bốn puzzles, exact world/gate, renderer/art/CSS. Deep fixtures và body hashes kiểm tra bảo toàn, chỉ thay import renderer. Fold cuối cấp II, không thêm chest/pickup/outro prerequisite; cửa đông sang canonical 3. Donor checkout/4180 không sửa.

Global save `mat-ma-dien-bien-phu:campaign:v1` có nested rooms/shared settings. Sanitizers từng phòng cộng contiguous exits suy ra current room/mảnh. I từ chest,II từ fold đã kiểm tra,III/IV từ pickup thật. Phòng 5 cần cả bốn và cửa trước; assembly→conversation/continue→realdoor→museum acknowledgment tách bước. Preview keys không migrate/import, reset current giữ trước/cắt downstream; confirmed global new game chỉ reset global envelope.

Phòng 5 2000×1400 dùng một victory-painting.svg sáng tác xuyên intro/2×2 assembly/return. Native buttons swap hai mảnh; ghép xong cửa còn chờ cuộc trò chuyện nguồn PDF bản 4. Ô cá nhân optional/ungraded, không đọc vào callback/payload/save/log, blank tiếp tục được, cleanup xóa khi đóng. Tới cửa thật rồi museum-return/ack mới complete.

## Quyết định và vấn đề đã giải

- Phaser Game.destroy không bảo đảm SHUTDOWN như đổi scene. Shared disposal invalidates callbacks trước await, teardown khi physics còn sống, gỡ listeners/UI/observer/RAF, chờ DESTROY và hết stack trước reuse DOM. Host queue/epoch bỏ import/transition cũ khi restart.
- Một parent audio/controller xuyên campaign; child không đóng context hoặc thay status callback. Runtime khởi tạo preference từ global save trước mount để reload vào 5 không ghi đè audio bằng default. Permission vẫn cần gesture.
- Diagnostics toàn snapshot được structuredClone, không live world reference hoặc setter tọa độ/state. Không production QA teleport/inventory injection.
- Root dùng bản sao Bảo cùng origin, không iframe/cross-origin hoặc external-tab progress. Original registry/renderer/evaluator bảo toàn thay vì giả thành tích legacy museum/Him Lam.
- Suy ngẫm là câu chuyện của Quang và không chấm quan điểm người chơi. Global archive chỉ lưu authored dialogue, không lưu textarea.
- Thử lại/reset không tác động save preview/donor. Không private PDF/transcript hoặc absolute home paths trong docs bàn giao. Git publication theo sau QA, hosting không trong phạm vi.

## Kiểm chứng hiện tại

105/105 tests/build năm entry; reviewer GO sau shared-audio initialization và diagnostic clone fixes.13 focused fidelity/action/rule tests của Bảo,8 Room 5 tests và lifecycle/host/global graph tests có bằng chứng riêng. Independent Room 2 standalone actual route đã qua đủ bảy clues/bốn puzzles/outro/cửa và reload. Room 5 component fixture qua assembly/reflection blank/door/privacy/mobile nhưng không tự chứng minh đã chơi 1–4.

Campaign thật PASS museum→1–5→return/ack: năm valid exits/bốn earned fragments, wrong assembly bị chặn, cửa đóng đến khi đọc cuộc trò chuyện/blank continue rồi physical door/return/acknowledgment. Archive 25 entries trước 5→26 sau reflection, full Lâm/Bảo text readonly. Audio enabled giữ qua reload 5/unlocked false cần gesture; world clone không sửa active geometry. Ending reload/390 px/confirmed global reset giữ standalone Room 1 byte-identical, rapid mount/restart không stale canvas/dialog.

Một build concurrent làm tab cũ mất lazy hash khi chuyển 4→5; reload giữ bốn exits/mảnh và vào 5, không mất progress. Full final route sau reload pass, ghi rõ trong QA.

## Việc tiếp theo

QA/docs đã reconcile; update Git theo quyền đã có. Không hosting, chưa chứng nhận touch walking/narration/screen-reader/real-user timing. Giấy phép phân phối tài sản cần xác định.

[Kế hoạch](../../plans/261031-campaign-link/plan.md) · [Review](../../plans/261031-campaign-link/reports/code-review.md) · [Lifecycle](../../plans/261031-campaign-link/reports/lifecycle.md) · [Bảo adapter](../../plans/261031-campaign-link/reports/room-two.md) · [Bảo QA](../../plans/261031-campaign-link/reports/room-two-qa.md) · [Phòng 5](../../plans/261031-campaign-link/reports/final-room.md)

## Câu hỏi còn mở

Không có câu hỏi người dùng chặn integration. Git update theo sau acceptance, chưa tuyên bố push/deploy.

[QA toàn campaign](../../plans/261031-campaign-link/reports/campaign-qa.md)
