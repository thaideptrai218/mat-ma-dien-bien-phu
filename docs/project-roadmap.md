# Tiến độ dự án

Cập nhật 2026-10-31. Bản chính `/` đã có tuyến bảo tàng→phòng 1–5→bảo tàng, tích hợp Bảo local và common progress/journal. Đây là campaign mới từ canonical rooms, không bật lại app/map legacy. [Kế hoạch tích hợp](../plans/261031-campaign-link/plan.md).

| Hạng mục | Trạng thái hiện tại |
| --- | --- |
| Nguồn lịch sử/nội dung 1/3/4 | Giữ nội dung canonical từ PDF bản 4/bản chữ/brief, không nghiên cứu web hoặc đổi niên đại. |
| Bảo Room 2 | Local adapter giữ world/gate/7 clues/9 beats/4 puzzles/renderers/art/CSS; manifest/body hashes và 13 focused tests; donor 4180 không sửa. Preview thực đã full pass. |
| Campaign framing | Museum intro→time vortex/fictional bunker→rooms→same painting return→ending acknowledgment đã triển khai. |
| Global state/save | Envelope campaign, nested room sanitizers, contiguous exits, derived fragments/settings; preview keys không migrate, donor không đọc thành tích. |
| Sổ hành trình | Full prior earned papers/Bảo beats/N-01/đoạn cuối, readonly và parent-paused. |
| Chuyển phòng/lifecycle | Một Game/canvas, async idempotent destroy await Phaser, epoch/import guard, shared audio ownership. |
| Room 5 | ActualI–IV→2×2 assembly→authored reflection/optional private text→physicaldoor→return. Không auto-award, không chấm/lưu lời cá nhân. |
| Reset/reload | Current room reset giữ trước/cắt phụ thuộc; confirmed global newgame chỉ campaign. Reload current safe spawn, save lỗi vẫn phiên chơi. |
| Build/tests |105/105 tests, build 5 HTML: index+room-one/two/three/four. |
| Browser campaign | PASS: earned I–IV/năm exits/assembly/blank reflection/physical door/return/ack; archive 25→26, ending/audio reload, confirmed reset giữ preview và rapid mount/restart. |
| Reviewer/independent QA | Review GO; độc lập full Room 2 preview, Room 5 component/privacy/mobile; full campaign do controller chơi thật. |
| Git/hosting | Git update sau verification; chưa tuyên bố push, không hosting deployment. |

## Sau phạm vi này

Campaign implementation/review/actual QA hoàn tất trong phạm vi báo cáo. Update Git theo quyền đã có; hosting, touch walking, narration/TTS, backend/accounts, real-user timing/screen-reader certification và giấy phép phân phối tài sản chưa thuộc bàn giao. Phòng 5/integration đã triển khai.

Các preview 1–4 vẫn dùng save riêng, route 1 chuyển sang room-one.html. Donor Bảo checkout/preview 4180 bảo toàn; bản campaign không phụ thuộc tab ngoài. Tất cả mảnh đến từ room thực, không fake earlier completion.

## Hồ sơ trước đó

Các báo cáo dưới đây giữ đúng phạm vi từng phiên bản; không thay QA campaign:

- [Phòng 1/nguồn PDF](../plans/261030-pdf-four-rebuild/plan.md), [sửa thư](../plans/261030-room-one-letter-revision/reports/qa.md).
- [Phòng 3/bổ sung nền 1](../plans/261031-room-three-logistics/plan.md), [QA](../plans/261031-room-three-logistics/reports/qa.md), [độc lập](../plans/261031-room-three-logistics/reports/independent-qa.md).
- [Trâm Room 4](../plans/261030-tram-room-four/plan.md), [QA](../plans/261030-tram-room-four/reports/qa.md).
- [App bảo tàng cũ](../plans/261029-1757-mat-ma-dien-bien-phu-game/plan.md), [màn IV thử cũ](../plans/261030-chapter-four-playable-trial/plan.md), [bản thư/niên biểu cũ](../plans/261030-letters-timeline/plan.md): lịch sử phát triển, không phải runtime hiện tại.

[README](../README.md) · [Kiến trúc](system-architecture.md) · [Nhật ký tích hợp](journals/2026-10-31-campaign-integration.md) · [Lifecycle](../plans/261031-campaign-link/reports/lifecycle.md) · [Bảo toàn Bảo](../plans/261031-campaign-link/reports/room-two.md)

[QA toàn campaign](../plans/261031-campaign-link/reports/campaign-qa.md) · [Review GO](../plans/261031-campaign-link/reports/code-review.md)
