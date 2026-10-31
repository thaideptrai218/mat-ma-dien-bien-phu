// Quang and these conversations are authored fiction for the learning game.
// Hệ Thống calls Quang "Ký Chủ"; Quang calls it "Hệ Thống" and says "tao" to it, "mình" when thinking alone.
export const INTRO = [
  { speaker: 'Hệ Thống', text: 'Phòng 1 — Trước bản kế hoạch. Không gian này tái hiện chặng đường từ bước chuyển năm 1950 đến tình thế năm 1953. Lá thư mở đầu được viết vào đầu năm 1953.' },
  { speaker: 'Quang', text: 'Một lá thư gửi người em ở nhà. Hệ Thống, tao đọc nó trước được chứ?' },
  { speaker: 'Hệ Thống', text: 'Chính xác. Nhiệm vụ đầu tiên: đọc trọn lá thư trên bàn gần cửa vào. Ký Chủ hãy để ý những ký hiệu nằm ngoài lời thư.' },
  { speaker: 'Hệ Thống', text: 'Dùng WASD hoặc phím mũi tên để đi, giữ Shift để chạy. Đến gần vật và nhấn E để xem. N mở sổ tay, M mở bản đồ, Q xem nhiệm vụ.' },
  { speaker: 'Hệ Thống', text: 'Thư, ghi chép và nhân vật là hư cấu dựa trên tài liệu được cung cấp. Thông tin nguồn nằm bên ngoài lời văn. Ký Chủ đọc hết giấy rồi cùng suy nghĩ để ghi nhận hồ sơ.' },
];

// Step-by-step guidance appended to the success dialogue of each Room 1 step.
export const GUIDE = {
  letter: [
    { speaker: 'Hệ Thống', text: 'Ký Chủ hãy ghi nhớ ký hiệu A-03. Nhiệm vụ tiếp theo: tìm ô A-03 trên bản đồ treo ở bức tường phía bắc.' },
    { speaker: 'Quang', text: 'Hàng A, cột 03. Tao đi xem ngay.' },
  ],
  a03: [
    { speaker: 'Hệ Thống', text: 'Bốn hồ sơ đã lộ vị trí: V-01, V-02 của phía Việt Nam; P-01, P-02 của phía Pháp. Ký Chủ đọc trọn từng tờ rồi ghi dữ kiện vào sổ tay.' },
    { speaker: 'Quang', text: 'Đọc đủ cả bốn rồi mới đối chiếu. Hệ Thống cứ để tao lo.' },
  ],
  dossiers: [
    { speaker: 'Hệ Thống', text: 'Bốn hồ sơ đã được ghi nhận. Nhiệm vụ tiếp theo: mang dữ kiện đến bàn đối chiếu ở giữa phòng, so từng mặt của hai phía.' },
    { speaker: 'Quang', text: 'Quân số, trang bị, thế trận, sức ép. Hệ Thống có định nhắc bài cho tao không?' },
    { speaker: 'Hệ Thống', text: 'Hệ Thống không trả lời thay Ký Chủ. Sổ tay N vẫn giữ toàn văn bốn hồ sơ để Ký Chủ tra lại.' },
  ],
  comparison: [
    { speaker: 'Hệ Thống', text: 'Mã 2413 đã được ghi nhận. Ngăn kéo mật mã đang chờ Ký Chủ.' },
    { speaker: 'Quang', text: 'Ngăn kéo bốn chữ số, mã bốn chữ số. Lần này tao không cần gợi ý.' },
  ],
  identity: [
    { speaker: 'Hệ Thống', text: 'Danh tính đã được xác nhận. Ký Chủ hãy đọc bản tin tháng 7/1953 trước khi tới rương sắt.' },
    { speaker: 'Quang', text: 'Rõ. Đọc xong, tao sẽ mang cái tên ấy tới rương.' },
  ],
  chest: [
    { speaker: 'Hệ Thống', text: 'Rương sắt đang chờ. Nhập đúng họ ấy, mảnh ghép thứ nhất sẽ thuộc về Ký Chủ.' },
  ],
};

const ENDING_STORY = [
  { speaker: 'Quang', text: 'Tên trong bản điện là Henri Navarre, thường gọi là Nava. Tháng 5/1953, Chính phủ Pháp cử ông làm tổng chỉ huy quân đội viễn chinh Pháp ở Đông Dương.' },
  { speaker: 'Quang', text: 'Đến tháng 7/1953, Chính phủ Pháp thông qua kế hoạch mới, nhằm giành thắng lợi quân sự quyết định và kết thúc chiến tranh trong điều kiện có lợi cho Pháp.' },
  { speaker: 'Quang', text: 'Trong lá thư đầu, anh Lâm vẫn còn chờ ngày về. Mình muốn biết kế hoạch mới này sẽ đưa cuộc chiến đến đâu.' },
  { speaker: 'Hệ Thống', text: 'Ký Chủ đã nhận mảnh tranh đầu tiên. Tới cửa phía bắc để hoàn thành Phòng 1.' },
];
export const ENDING = [
  ...ENDING_STORY,
  { speaker: 'Hệ Thống', text: 'Sau khi hoàn thành, Ký Chủ có thể mở bản thử Phòng 2 của Bảo bằng liên kết riêng. Tiến độ của hai bản được lưu riêng.' },
];
export const CAMPAIGN_ENDING = [
  ...ENDING_STORY,
  { speaker: 'Quang', text: 'Một mảnh rồi. Còn ba mảnh nữa, Hệ Thống.' },
  { speaker: 'Hệ Thống', text: 'Phía sau cánh cửa là Phòng 2, nơi kế hoạch của Nava được bày lên bàn cờ Đông Dương.' },
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

// Quang's thoughts in step dialogues (plain strings are Quang; objects name another speaker).
export const LINES = {
  letterArchive: [
    'Nhãn lưu trữ ghi A-03. Trên bản đồ treo vách cũng có những ô như vậy.',
  ],
  a03: [
    'Bốn giấy tờ được xếp chung: một lá thư, một trang sổ quân nhu, bản ghi của phía Pháp và thư từ Paris.',
    'Chúng đều được viết trước tháng 5/1953. Mình sẽ đọc theo thứ tự ngày tháng.',
  ],
  comparison: [
    'Đối chiếu đúng: quân số 252.000 / 445.000; trang bị hạn chế / hiện đại; thế chủ động / lực lượng phân tán; sức ép tiếp tế / chi phí chiến tranh.',
    'Những con số cho biết quy mô lực lượng; cách bố trí và những khó khăn mới cho thấy tình thế của họ.',
    'Bốn hàng làm lộ bốn chữ số: 2 · 4 · 1 · 3. Đây là mật mã của trò chơi, không phải một niên đại lịch sử.',
  ],
  identity: [
    'Henri Navarre, thường gọi là Nava, được cử sang Đông Dương làm Tổng chỉ huy tháng 5/1953.',
    'Có một bản tin viết sau đó hai tháng. Mình sẽ đọc tiếp để biết kế hoạch mới đã được thông qua thế nào.',
  ],
  navaContext: [
    'Trên rương cần họ theo cách gọi tiếng Việt. Mình sẽ dùng NAVA.',
  ],
  chestOpened: [
    'Rương đã mở. Mình cất mảnh tranh rồi đi đến cánh cửa phía bắc.',
  ],
};
