// Long and these conversations are authored fiction for the learning game.
// The selected-hero dialogue adapter gives Long "tôi – bạn" and Quang "mình – cậu" throughout the voiced script.
export const INTRO = [
  { speaker: 'Hệ Thống', text: 'Phòng 1 — Trước bản kế hoạch. Không gian này tái hiện chặng đường từ bước chuyển năm 1950 đến tình thế năm 1953. Lá thư mở đầu được viết vào đầu năm 1953.' },
  { speaker: 'Long', text: 'Một lá thư gửi người em ở nhà. Hệ Thống, tôi đọc nó trước được chứ?' },
  { speaker: 'Hệ Thống', text: 'Chính xác. Nhiệm vụ đầu tiên: đọc trọn lá thư trên bàn gần cửa vào. Ký Chủ hãy để ý những ký hiệu nằm ngoài lời thư.' },
  { speaker: 'Hệ Thống', text: 'Dùng WASD hoặc phím mũi tên để đi, giữ Shift để chạy. Đến gần vật và nhấn E để xem. N mở sổ tay, M mở bản đồ, Q xem nhiệm vụ.' },
  { speaker: 'Hệ Thống', text: 'Hãy đọc trọn từng giấy, rồi cùng Long suy luận để ghi nhận hồ sơ.' },
];

// Step-by-step guidance appended to the success dialogue of each Room 1 step.
export const GUIDE = {
  letter: [
    { speaker: 'Hệ Thống', text: 'Trên tường phía bắc có một bản đồ chia ô. Hãy đối chiếu dấu trên lá thư với các ô ấy.' },
    { speaker: 'Long', text: 'Nhãn cuối thư có cả chữ lẫn số. Tôi sẽ đối chiếu chúng với cột và hàng trên bản đồ.' },
  ],
  a03: [
    { speaker: 'Hệ Thống', text: 'Bốn hồ sơ đã lộ vị trí: V-01, V-02 của phía Việt Nam; P-01, P-02 của phía Pháp. Ký Chủ đọc trọn từng tờ rồi ghi dữ kiện vào sổ tay.' },
    { speaker: 'Long', text: 'Đọc đủ cả bốn rồi mới đối chiếu. Hệ Thống cứ để tôi lo.' },
  ],
  dossiers: [
    { speaker: 'Hệ Thống', text: 'Bốn hồ sơ đã được ghi nhận. Nhiệm vụ tiếp theo: mang dữ kiện đến bàn đối chiếu ở giữa phòng, so từng mặt của hai phía.' },
    { speaker: 'Long', text: 'Quân số, trang bị, thế trận, sức ép. Hệ Thống, tôi thử tự suy luận trước nhé.' },
    { speaker: 'Hệ Thống', text: 'Hệ Thống không trả lời thay Ký Chủ. Sổ tay N vẫn giữ toàn văn bốn hồ sơ để Ký Chủ tra lại.' },
  ],
  comparison: [
    { speaker: 'Hệ Thống', text: 'Bốn kết quả đã khớp. Dãy khóa vừa tìm được sẽ mở ngăn kéo mật mã.' },
    { speaker: 'Long', text: 'Ngăn kéo bốn chữ số, mã bốn chữ số. Lần này, tôi thử tự suy luận trước nhé.' },
  ],
  identity: [
    { speaker: 'Hệ Thống', text: 'Danh tính đã được xác nhận. Ký Chủ hãy đọc bản tin tháng 7/1953 trước khi tới rương sắt.' },
    { speaker: 'Long', text: 'Được. Đọc xong, tôi sẽ mang cái tên ấy tới rương.' },
  ],
  chest: [
    { speaker: 'Hệ Thống', text: 'Rương sắt đang chờ. Nhập đúng họ ấy, mảnh ghép thứ nhất sẽ thuộc về Ký Chủ.' },
  ],
};

const ENDING_STORY = [
  { speaker: 'Long', text: 'Tên trong bản điện là Henri Navarre, thường gọi là Nava. Tháng 5/1953, Chính phủ Pháp cử ông làm tổng chỉ huy quân đội viễn chinh Pháp ở Đông Dương.' },
  { speaker: 'Long', text: 'Đến tháng 7/1953, Chính phủ Pháp thông qua kế hoạch mới, nhằm giành thắng lợi quân sự quyết định và kết thúc chiến tranh trong điều kiện có lợi cho Pháp.' },
  { speaker: 'Long', text: 'Trong lá thư đầu, anh Lâm vẫn còn chờ ngày về. Mình muốn biết kế hoạch mới này sẽ đưa cuộc chiến đến đâu.' },
  { speaker: 'Hệ Thống', text: 'Ký Chủ đã nhận mảnh tranh đầu tiên. Tới cửa phía bắc để hoàn thành Phòng 1.' },
];
export const ENDING = [
  ...ENDING_STORY,
  { speaker: 'Hệ Thống', text: 'Sau khi hoàn thành, Ký Chủ có thể mở bản chơi riêng của Phòng 2 bằng liên kết trên màn hình. Tiến độ của hai bản được lưu riêng.' },
];
export const CAMPAIGN_ENDING = [
  ...ENDING_STORY,
  { speaker: 'Long', text: 'Một mảnh rồi. Còn ba mảnh nữa, Hệ Thống.' },
  { speaker: 'Hệ Thống', text: 'Phía sau cánh cửa là Phòng 2, nơi kế hoạch của Nava được bày lên bàn cờ Đông Dương.' },
];

export const REACTIONS = {
  letter: {
    first: ['Lâm gửi Tín. Hai anh em xa nhau từ bao giờ nhỉ?'],
    repeat: ['Cuối thư có một dấu lưu trữ. Mình cần đối chiếu nó với sơ đồ trên vách.'],
    locked: ['Mình chưa đọc hết lá thư.'],
  },
  'map-a03': {
    first: ['Sơ đồ có cột chữ và hàng số. Tôi sẽ tự đối chiếu với nhãn cuối thư.'],
    repeat: ['Mình đã tìm được vị trí chồng hồ sơ trên sơ đồ.'],
    locked: ['Mình cần xem ký hiệu lưu trữ trên lá thư trước.'],
  },
  v1: {
    first: ['Lại một lá thư gửi về nhà. Người lính này viết sau chiến dịch Tây Bắc.'],
    repeat: ['Thành kể với vợ về những điều bộ đội đã học qua chiến đấu.'],
    locked: ['Mình cần đối chiếu dấu lưu trữ trên thư với sơ đồ trước.'],
  },
  v2: {
    first: ['Một cuốn sổ quân nhu. Người viết lo đến cái ăn và vũ khí của anh em.'],
    repeat: ['Sau bảng tổng hợp còn là chuyện lương ăn và vũ khí cho từng người.'],
    locked: ['Mình cần tìm vị trí hồ sơ trên sơ đồ trước.'],
  },
  p1: {
    first: ['Một bản báo cáo tham mưu phía Pháp. Mình xem họ đang vướng điều gì.'],
    repeat: ['Quân đông và trang bị tốt, nhưng lại phải chia ra nhiều nơi.'],
    locked: ['Dấu lưu trữ trên thư sẽ chỉ vị trí của bộ hồ sơ này.'],
  },
  p2: {
    first: ['Thư từ Paris. Ở bên ấy cũng có một gia đình đang đợi tin.'],
    repeat: ['Louise chỉ mong em trai trở về, còn cuộc chiến cứ kéo dài và tốn kém.'],
    locked: ['Mình cần tìm vị trí bộ hồ sơ trên sơ đồ trước.'],
  },
  comparison: {
    first: ['Đủ chỗ cho bốn tờ giấy. Mình thử so từng mặt của hai phía.'],
    repeat: ['Bốn hàng đối chiếu đã cho một dãy số. Ngăn kéo bên cạnh có khóa cùng dạng.'],
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

// Long's thoughts in step dialogues (plain strings are Long; objects name another speaker).
export const LINES = {
  letterArchive: [
    'Nhãn cuối thư có cả chữ lẫn số. Tôi sẽ tự đối chiếu chúng với cột và hàng trên bản đồ.',
  ],
  a03: [
    'Bốn giấy tờ được xếp chung: một lá thư, một trang sổ quân nhu, bản ghi của phía Pháp và thư từ Paris.',
    'Chúng đều được viết trước tháng 5/1953. Mình sẽ đọc theo thứ tự ngày tháng.',
  ],
  comparison: [
    'Đối chiếu đúng: quân số 252.000 / 445.000; trang bị hạn chế / hiện đại; thế chủ động / lực lượng phân tán; sức ép tiếp tế / chi phí chiến tranh.',
    'Những con số cho biết quy mô lực lượng; cách bố trí và những khó khăn mới cho thấy tình thế của họ.',
    'Bốn hàng lần lượt cho tôi các số 2, 4, 1, 3. Mã ngăn kéo là 2413; đây là mật mã trò chơi, không phải niên đại lịch sử.',
  ],
  identity: [
    'Henri Navarre được cử sang Đông Dương làm Tổng chỉ huy tháng 5/1953. Bản tin tiếp theo sẽ cho biết kế hoạch mới được thông qua ra sao.',
    'Có một bản tin viết sau đó hai tháng. Mình sẽ đọc tiếp để biết kế hoạch mới đã được thông qua thế nào.',
  ],
  navaContext: [
    'Bản tin ghi ông thường được gọi là Nava trong tiếng Việt. Vậy rương cần cách gọi ấy.',
  ],
  chestOpened: [
    'Rương đã mở. Mình cất mảnh tranh rồi đi đến cánh cửa phía bắc.',
  ],
};

// Hệ Thống's side card while a Room 1 puzzle is open: a short reminder, then a gentle nudge (level 1, first wrong
// try) and a slightly clearer one (level 2, second wrong try on). Hints point to where to look, never to the answer.
export const SYSTEM_HINTS = {
  a03: {
    open: 'Ký Chủ, nhãn lưu trữ ở cuối lá thư là chỉ dẫn cho bản đồ này.',
    hints: ['Ký Chủ thử đọc lại phần cuối lá thư, chỗ ghi ký hiệu lưu trữ.', 'Ký hiệu có một chữ cái và một con số. Một cái ứng với cột, cái còn lại ứng với hàng của bản đồ.'],
  },
  comparison: {
    open: 'Ký Chủ, kéo từng thẻ dữ kiện vào ô của hai phía theo bốn hồ sơ.',
    hints: ['Mỗi cặp ô đều có hồ sơ làm chứng. Ký Chủ thử đọc lại sổ tay từng cặp một.', 'Ký Chủ để ý hồ sơ nào nói về số liệu, hồ sơ nào nói về thế trận và sức ép của hai phía.'],
  },
  drawer: {
    open: 'Ký Chủ, hãy xoay bốn bánh khóa của ngăn kéo này cho đúng mã.',
    hints: ['Mã ấy không nằm ở ngăn kéo. Ký Chủ nhớ lại việc vừa làm ở bàn đối chiếu.', 'Khi đối chiếu xong, bàn đối chiếu đã cho Ký Chủ một dãy số. Ký Chủ thử xem lại ở đó.'],
  },
  identity: {
    open: 'Ký Chủ, dãy số trong điện mật là tên người, hãy bấm chữ để ghép lại.',
    hints: ['Ký Chủ thử đối chiếu từng số với bảng chữ cái ở phía trên.', 'Giải từng cặp số một rồi ghép thành hai từ. Ký Chủ thử nhớ lại người đã được nhắc ở các hồ sơ trước.'],
  },
  chest: {
    open: 'Ký Chủ, xoay các bánh chữ của rương thành từ khóa lấy từ danh tính vừa giải.',
    hints: ['Ký Chủ thử nghĩ xem tiếng Việt thường gọi người ấy bằng phần nào của tên.', 'Các tài liệu tiếng Việt thường gọi nhân vật này bằng họ chứ không đọc đủ tên. Ký Chủ để ý cách gọi trong sổ tay.'],
  },
  'door-west-archive': {
    open: 'Ký Chủ, ký hiệu lưu trữ cuối lá thư là chìa cho chiếc then này.',
    hints: ['Ký Chủ thử đọc lại phần cuối lá thư, chỗ ghi ký hiệu lưu trữ.', 'Bánh đầu là một chữ cái, hai bánh sau là số. Cả ba cùng nằm trong ký hiệu ấy.'],
  },
  'door-drawer-alcove': {
    open: 'Ký Chủ, con số của phía Việt Nam nằm trong sổ quân nhu.',
    hints: ['Ký Chủ thử mở lại sổ tay, tìm hồ sơ của người phụ trách quân nhu.', 'Đề bài hỏi quân số phía Việt Nam, đếm theo nghìn người nên chỉ cần ba chữ số đầu.'],
  },
  'door-exit-hall': {
    open: 'Ký Chủ, bản tin tháng bảy cho biết kế hoạch được thông qua lúc nào.',
    hints: ['Ký Chủ thử đọc lại bản tin sau khi kế hoạch mới được thông qua, trong sổ tay.', 'Bổ nhiệm và thông qua là hai mốc khác nhau. Khóa hỏi tháng của mốc thứ hai.'],
  },
};
