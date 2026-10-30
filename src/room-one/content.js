// Quang and these conversations are authored fiction for the learning game.
export const INTRO = [
  { speaker: 'Hệ thống', text: 'Phòng 1 — Trước bản kế hoạch. Từ bước chuyển năm 1950 đến tình thế năm 1953; lá thư mở đầu được viết vào đầu năm 1953.' },
  { speaker: 'Quang', text: 'Một lá thư gửi người em ở nhà. Mình đọc xem người anh viết gì.' },
  { speaker: 'Hệ thống', text: 'Dùng WASD hoặc phím mũi tên để đi, giữ Shift để chạy. Đến gần vật và nhấn E để xem. N mở sổ tay, M mở bản đồ, Q xem nhiệm vụ.' },
  { speaker: 'Hệ thống', text: 'Thư, ghi chép và nhân vật là hư cấu dựa trên tài liệu được cung cấp. Thông tin nguồn nằm bên ngoài lời văn. Đọc hết giấy rồi cùng Quang suy nghĩ để ghi nhận hồ sơ.' },
];

export const ENDING = [
  { speaker: 'Quang', text: 'Tên trong bản điện là Henri Navarre, thường gọi là Nava. Tháng 5/1953, Chính phủ Pháp cử ông làm tổng chỉ huy quân đội viễn chinh Pháp ở Đông Dương.' },
  { speaker: 'Quang', text: 'Đến tháng 7/1953, Chính phủ Pháp thông qua kế hoạch mới, nhằm giành thắng lợi quân sự quyết định và kết thúc chiến tranh trong điều kiện có lợi cho Pháp.' },
  { speaker: 'Quang', text: 'Trong lá thư đầu, anh Lâm vẫn còn chờ ngày về. Mình muốn biết kế hoạch mới này sẽ đưa cuộc chiến đến đâu.' },
  { speaker: 'Hệ thống', text: 'Bạn đã nhận mảnh tranh đầu tiên. Tới cửa phía bắc để hoàn thành Phòng 1.' },
  { speaker: 'Hệ thống', text: 'Sau khi hoàn thành, bạn có thể mở bản thử Phòng 2 của Bảo bằng liên kết riêng. Tiến độ của hai bản được lưu riêng.' },
];

export const REACTIONS = {
  letter: {
    first: ['Lâm gửi Tín. Hai anh em xa nhau từ bao giờ nhỉ?'],
    repeat: ['Ký hiệu lưu trữ A-03 nằm ngoài lời thư. Mình tìm ô ấy trên bản đồ.'],
    locked: ['Mình chưa đọc hết lá thư.'],
  },
  'map-a03': {
    first: ['Có ô A-03, đúng ký hiệu trên tờ thư.'],
    repeat: ['Từ ô A-03, mình đã tìm được vị trí bốn hồ sơ.'],
    locked: ['Mình cần xem ký hiệu lưu trữ trên lá thư trước.'],
  },
  v1: {
    first: ['Lại một lá thư gửi về nhà. Người lính này viết sau chiến dịch Tây Bắc.'],
    repeat: ['Thành kể với vợ về những điều bộ đội đã học qua chiến đấu.'],
    locked: ['Mình còn chưa tìm ô A-03 trên bản đồ.'],
  },
  v2: {
    first: ['Một cuốn sổ quân nhu. Người viết lo đến cái ăn và vũ khí của anh em.'],
    repeat: ['Sau bảng tổng hợp còn là chuyện lương ăn và vũ khí cho từng người.'],
    locked: ['Mình sẽ tìm vị trí hồ sơ từ ô A-03 trước.'],
  },
  p1: {
    first: ['Một bản báo cáo tham mưu phía Pháp. Mình xem họ đang vướng điều gì.'],
    repeat: ['Quân đông và trang bị tốt, nhưng lại phải chia ra nhiều nơi.'],
    locked: ['Ô A-03 sẽ chỉ vị trí của bộ hồ sơ này.'],
  },
  p2: {
    first: ['Thư từ Paris. Ở bên ấy cũng có một gia đình đang đợi tin.'],
    repeat: ['Louise chỉ mong em trai trở về, còn cuộc chiến cứ kéo dài và tốn kém.'],
    locked: ['Mình cần tìm ô A-03 trước khi đọc bộ hồ sơ.'],
  },
  comparison: {
    first: ['Đủ chỗ cho bốn tờ giấy. Mình thử so từng mặt của hai phía.'],
    repeat: ['Mã 2413 đã hiện ra. Khóa ngăn kéo cũng cần bốn chữ số.'],
    locked: ['Mình còn hồ sơ chưa đọc và ghi nhận. Sổ tay sẽ cho biết thiếu tờ nào.'],
  },
  drawer: {
    first: ['Khóa bốn chữ số. Dấu này giống dấu ở bàn đối chiếu.'],
    repeat: ['Bản điện và bảng thay số vẫn ở trong ngăn kéo.'],
    locked: ['Mình cần tìm mã ở bàn đối chiếu.'],
  },
  chest: {
    first: ['Trên rương có một ô để điền tên.'],
    repeat: ['Mảnh tranh đã ở trong tay. Giờ có thể đi tới cửa.'],
    locked: ['Tên cần điền nằm trong bản điện ở ngăn kéo.'],
  },
  door: {
    first: ['Cửa ở phía bắc. Mình còn những tờ giấy phải đọc.'],
    repeat: ['Mình đã có mảnh tranh. Đến lúc đi tiếp rồi.'],
    locked: ['Mình chưa lấy được mảnh tranh trong rương.'],
  },
  lamp: {
    first: ['Giấy ngả màu dưới ánh đèn. Chữ vẫn còn rõ.'],
    repeat: ['Ngọn đèn vẫn sáng.'],
    locked: ['Mình bắt đầu từ lá thư trên bàn.'],
  },
  crate: {
    first: ['Những kiện đồ xếp sát nhau. Mình nhớ tờ sổ quân nhu ở phía Việt Nam.'],
    repeat: ['Chuyện lương ăn và vũ khí nằm trong V-02.'],
    locked: ['Mình cần đọc thư rồi tìm hồ sơ trên bản đồ.'],
  },
  radio: {
    first: ['Máy vô tuyến im tiếng. Cạnh nó là những giấy tờ về một bản điện.'],
    repeat: ['Bản điện được cất trong ngăn kéo.'],
    locked: ['Mình chưa mở được ngăn kéo chứa bản điện.'],
  },
};
