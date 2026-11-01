# Long — sprite nhân vật chính

Tóc đen dựng, khẩu trang đen kéo xuống cằm, áo sơ mi trắng, quần đen, giày trắng.

- `motion-sheet.png`: sprite gốc RGBA 3296×1024, 16 cột × 4 hàng, mỗi ô 206×256. Hàng: xuống / trái / phải / lên; cột 0–7 là đi bộ, 8–15 là chạy.
- `motion-sheet-with-idle.png`: atlas dẫn xuất. Cột 0–6 là bảy bước luân phiên từ ảnh tham chiếu; cột 7 lặp bước đầu. Cột 8–14 dùng lại bảy bước ấy cho nhịp chạy nhanh hơn; cột 15 lặp bước đầu, cột 16 là tư thế đứng riêng. Chu kỳ chạy cũ có khung chân lặp một bên nên không dùng nữa; file sprite gốc vẫn được giữ nguyên.
- `manifest-with-idle.json`: crop và mốc chân dùng khi dựng atlas trong game.
- Cả hai bộ dữ liệu được đóng thành frame 160×192 và hiển thị ở tỷ lệ 0,75 (120×144 pixel).

Bốn chu kỳ đi bộ và bốn tư thế idle được cắt theo ranh giới silhouette, bỏ nền trắng/nhãn và tránh lấy dính pixel của nhân vật bên cạnh. Hướng được ánh xạ xuống / trái / phải / lên để khớp với game. Bảy bước được căn cùng đường chân; chu kỳ chạy dùng cùng nhịp chân ở 15fps để hai chân tiếp tục luân phiên.

Sprite gốc vẫn có thể đóng lại từ hai bảng nguồn (8 khung × 4 hướng, thứ tự hàng nguồn: xuống / lên / trái / phải):

```bash
python scripts/pack-character-sheet.py <walking.png> <running.png> assets/characters/long
```

Công cụ tách khung theo khoảng trống trong suốt (không theo lưới cố định vì bảng nguồn lệch dần trong ô), bỏ phần dư alpha dưới 32, căn mọi khung theo tâm đầu + thân và giữ độ nâng chân so với mặt đất của từng hàng. Cần Pillow + numpy. Ảnh nguồn không chép vào repo.
