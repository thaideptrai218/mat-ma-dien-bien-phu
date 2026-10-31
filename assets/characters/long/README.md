# Long — sprite nhân vật chính

Ảnh do người dùng cung cấp ngày 01/11/2026: tóc đen dựng, khẩu trang đen kéo xuống cằm, áo sơ mi trắng, quần đen, giày trắng. Long là nhân vật hư cấu.

- `motion-sheet.png`: PNG RGBA nền trong suốt 3296×1024, 16 cột × 4 hàng, mỗi ô 206×256. Hàng: xuống / trái / phải / lên.
- Cột 0–7: chu kỳ đi bộ 8 khung (cột 0 cũng là tư thế đứng). Cột 8–15: chu kỳ chạy 8 khung.
- `manifest.json`: crop chung và mốc chân (anchor) đo trên PNG. Game dựng atlas 160×192/ô, hiển thị ×0,5.

Đóng lại từ hai bảng nguồn (8 khung × 4 hướng, thứ tự hàng nguồn: xuống / lên / trái / phải):

```bash
python scripts/pack-character-sheet.py <walking.png> <running.png> assets/characters/long
```

Công cụ tách khung theo khoảng trống trong suốt (không theo lưới cố định vì bảng nguồn lệch dần trong ô), bỏ phần dư alpha dưới 32, căn mọi khung theo tâm đầu + thân và giữ độ nâng chân so với mặt đất của từng hàng. Cần Pillow + numpy. Ảnh nguồn không chép vào repo.
