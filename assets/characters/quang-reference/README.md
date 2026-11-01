# Quang — nhân vật theo ảnh mẫu

Sprite di chuyển được sáng tác bằng **imagegen tích hợp**, dựa trên hình nhân vật do người dùng cung cấp ngày31/10/2026: tóc nâu gợn, áo khoác nâu đỏ mở ngoài áo trắng, quần be, giày sáng và túi vải ô liu. Đây là hình vẽ nhân vật Quang hư cấu. Ảnh tham chiếu gốc không được chép vào repo.

- `motion-sheet.png`: PNG RGBA nền trong suốt2048×1280, tám cột/bốn hàng; mỗi ô nguồn256×320. Bốn hàng xuống/trái/phải/lên.
- `manifest.json`: crop chung và mốc chân đo trên PNG; nguồn ảnh/prompt được ghi bằng mô tả và SHA-256, không có đường dẫn cá nhân.
- Cột0 đứng;1–4 đi bộ;5–7 chạy. Chu kỳ chạy dùng5,6,7,6. Game dựng atlas160×192/ô, hiển thị .5, nên khung hiển thị80×96; vùng người vẽ cao khoảng87pixel thế giới. Collider vẫn24×16.

Một bảng32 hình cung cấp đứng/chạy. Bảng bổ sung16 hình cung cấp chu kỳ đi có tư thế chân mở và chân chuyển bước khép. Công cụ `scripts/pack-character-sheet.ps1` đóng các hình nguồn, giữ tỷ lệ đồng nhất trong từng bảng, đăng ký tâm hông và cùng mặt đất cho mỗi hướng. Hình chạy trên không giữ độ nâng chân. Một số góc nghiêng trái dùng lật ngang theo cách dựng sprite2D; khung nguồn bị cụt giày đã được thay bằng góc đối xứng có giày nguyên vẹn. Chỉ phần dư có alpha dưới32 bị loại trước khi đóng khung.

`npm run build` dùng trực tiếp PNG/JSON đã có. Không cần chạy công cụ đồ họa, API hoặc tạo ảnh trong lúc chơi. Muốn đóng lại từ bảng nguồn PNG đã tạo, trên Windows/PowerShell có System.Drawing:

```powershell
./scripts/pack-character-sheet.ps1 -SourceImage <bang-32-hinh.png> -WalkSourceImage <bang-16-buoc-di.png> -Destination assets/characters/quang-reference/motion-sheet.png
```

Các bảng nguồn imagegen được giữ tại máy tạo ảnh; SHA-256 có trong manifest. Có thể chỉnh PNG atlas bằng trình vẽ, nhưng cần giữ bố cục, nền trong suốt, khoảng trống giữa ô và cập nhật crop/anchor nếu thay kích thước. [Prompt và quá trình chọn](../../../plans/261031-quang-reference-character/art-prompts.md).
