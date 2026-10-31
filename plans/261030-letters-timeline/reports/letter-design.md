# Thiết kế thư tay — 2026-10-30

Status: implemented; actual letter UI integration browser QA passed.

## Mục tiêu

Đọc thư như cầm một tờ giấy riêng. Minh chỉ xuất hiện sau khi khép thư; giọng người viết và giọng suy luận có không gian riêng. Native dialog giữ pause và bàn phím hiện có.

## Quyết định thị giác

- Giấy ngà `#f1e5c8`, mực nâu đậm `#353b2c`, mép giấy `#b39b65`, nếp gấp mảnh; nền dialog ô liu tối. Chữ đạt tương phản, texture không phủ chữ.
- Patrick Hand cục bộ 400: thân thư 20–21px, line-height 1.8, không letter-spacing, không nghiêng/biến dạng chữ. Lora variable 400–700: tiêu đề và lời Minh. Nhãn điều khiển giữ Segoe UI.
- Tờ giấy duy nhất có vùng người gửi/nhận, nơi/ngày, lời chào, đoạn văn và chữ ký cuối. Hai lớp giấy phụ là decoration CSS, không có raster text.
- Toolbar bên ngoài giấy có “Trang trước”, tiến độ và “Trang sau”; trang cuối thay hành động chính bằng “Cùng Minh suy luận”. Nguồn và nhãn hư cấu ngoài thân thư tránh giả tư liệu thật.
- Sổ tay là danh sách thời gian đánh số; ngày luôn hiện, trạng thái ghi/đọc phân biệt bằng chữ. Đọc lại luôn mở thư.

## Bố cục

375px: dialog lề 9px, giấy padding 19px, tên người gửi/nhận xếp dọc, toolbar xuống hàng. Desktop: dialog tối đa 860px, paper padding 42px, measure dưới 65 ký tự. Một vùng cuộn native dialog; không cố định footer gây che nội dung ở viewport thấp.

## Tương tác và hợp đồng

`showClue(id)` → letter reader. `letterCursors[id]` nhớ trang; đóng/reopen không bỏ qua thư. `getActiveNarrative()` có `{clueId, phase:'letter', pageIndex, lastPage}`. Last page dispatch `finish-letter`; controller ghi hoàn tất thư rồi gọi `showReflection(id)`. Reflection trả `{clueId, phase:'reflection', lineIndex, lastLine}`; chỉ sau lời cuối mới ghi hồ sơ. Reset xóa cả hai cursors.

Mỗi lần đổi trang cuộn đầu dialog và focus heading mới; mọi nút >=44px, focus visible. Không dùng hoạt ảnh lật trang, người đọc chủ động chuyển. `prefers-reduced-motion` giữ nguyên trải nghiệm tĩnh.

## Kiểm chứng và nguồn phông

Search ui-ux-pro-max: product educational/reading, style E-Ink/Paper, typography handwritten/Vietnamese, color museum. Chọn hướng giấy phù hợp vật chứng; loại claymorphism gợi đồ chơi. Skill venv không hiện diện; search script chạy thành công bằng Python hệ thống (stdlib).

Patrick Hand có subset Vietnamese: https://raw.githubusercontent.com/google/fonts/main/ofl/patrickhand/METADATA.pb

Lora có subset Vietnamese: https://raw.githubusercontent.com/google/fonts/main/ofl/lora/METADATA.pb

Caveat bị loại vì metadata không có Vietnamese. Font đầy đủ TTF và OFL lấy từ google/fonts, không gọi mạng lúc chơi.

## Bàn giao triển khai

`ui/letter-panel.js`: semantic paper, metadata, hai chiều lật trang, chữ ký trang cuối, nguồn, page cursor, focus heading và reset cuộn. `ui/trial-interface.js`: showClue mở thư, showReflection có guard readLetterIds, phase và reset. `ui/narrative-panels.js`: lời Minh riêng, sổ timeline có ngày/trạng thái/đọc lại, nguồn giáo trình không URL. CSS riêng không đổi game chính.

Controller cần import `./styles/letter-styles.css` sau styles.css; dùng family `Trial Serif` cho heading/Minh. Các @font-face đã nằm trong CSS. Assets gồm `assets/fonts/lora-variable.ttf`, `patrick-hand-regular.ttf` và hai OFL.

Đã kiểm chứng: `node --check` ba module UI; production build đạt; FontTools cmap của cả hai font có đầy đủ U+1EA0–U+1EF9, ĂăĐđƠơƯư (0 glyph thiếu). Browser preview Lora tại 1280×900 xác nhận dấu gắn liền chữ trong heading và lead, xem [local-font-preview.png](local-font-preview.png). Preview tạm nhập CSS trong browser, chờ main wiring.

Actual integration đã kiểm chứng trên production preview 4173, browser riêng `letters-ui`; xem [letter-ui-qa.md](letter-ui-qa.md). Vite 5174 chỉ dùng preview ban đầu; chuyển qua production để tránh HMR reset trong lúc controller đang sửa file khác. Full-journey/reset do controller kiểm tra riêng.

Unresolved questions: none.
