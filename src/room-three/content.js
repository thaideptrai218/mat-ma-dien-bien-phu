// Authored dialogue for the supplied logistics activity; no historical witness claim.
export const INTRO = [
  {speaker: 'Hệ thống', text: 'Phòng 3 — Mật mã hậu phương: Giải cứu tuyến tiếp vận. Bối cảnh từ quyết định tháng 12/1953 đến những trận mở đầu tháng 3/1954.'},
  {speaker: 'Quang', text: 'Có kho hàng, con đường, lều chỉ huy và những bản tin. Mình bắt đầu từ tờ giấy gần kho xem họ đã chuẩn bị những gì.'},
  {speaker: 'Hệ thống', text: 'Bốn thử thách khôi phục bốn dữ kiện. Đọc trọn giấy rồi cùng Quang suy nghĩ và xác nhận trước khi đến trạm tương ứng. Chỉ mảnh III được trao ở phòng độc lập này.'},
  {speaker: 'Hệ thống', text: 'Thư, người viết và chuyện riêng là hư cấu; sáu tranh vận chuyển là minh họa sáng tác, không phải ảnh tư liệu. Nguồn lịch sử ghi bên ngoài lời văn.'},
  {speaker: 'Hệ thống', text: 'WASD hoặc mũi tên để đi, Shift để chạy, E để xem vật gần. M mở sơ đồ, N mở sổ tay, Q thu/mở nhiệm vụ. Các phòng giữ tiến độ riêng.'},
];

export const ENDING = [
  {speaker: 'Quang', text: 'Tháng 3, năm 1954, ngày 13: các mốc ghép lại thành ngày mở màn. Dữ kiện Đánh chắc, tiến chắc nhắc mình nhớ cách những người chỉ huy đã cân nhắc.'},
  {speaker: 'Quang', text: 'Sau những bản tin là người làm đường, dân công, thanh niên xung phong, người kéo pháo và những chuyến gạo, đạn, thuốc. Mặt trận cần họ tiếp tục góp sức.'},
  {speaker: 'Hệ thống', text: 'Bạn đã khôi phục bốn dữ kiện và nhận riêng mảnh tranh III. Tới cửa để hoàn thành Phòng 3; không có mảnh của các phòng khác được cấp ở đây.'},
  {speaker: 'Hệ thống', text: 'Chiến dịch còn tiếp tục sau ngày 17/3. Phòng 4 của Trâm và Phòng 5 ghép tranh có trong hành trình năm phòng ở trang chính. Các bản chơi riêng không tự chuyển tiến độ.'},
];

export const REACTIONS = {
  'preparation-record': {
    first: ['Một bản tổng hợp từ quyết định mở chiến dịch đến ngày Him Lam.'],
    repeat: ['Nhiều việc chuẩn bị phải cùng tiến hành; có thứ này rồi vẫn còn phải lo thứ khác.'],
    locked: ['Mình bắt đầu từ tờ tổng hợp gần kho hàng.'],
  },
  'supply-journal': {
    first: ['Duyên đang ghi lại một ngày đi cùng chuyến hàng.'],
    repeat: ['Bao gạo và khẩu pháo tới được nơi cần đến nhờ nhiều bàn tay.'],
    locked: ['Mình khôi phục phần hồ sơ chuẩn bị ở tủ trước, rồi theo chuyến hàng này.'],
  },
  'command-telegrams': {
    first: ['Người chép lệnh đặt hai phương châm cạnh nhau trong sổ.'],
    repeat: ['Đặt chắc thắng lên đầu cũng có nghĩa phải cân nhắc tình hình cho thật kỹ.'],
    locked: ['Mình còn việc ở bãi hàng trước khi đến lều chỉ huy.'],
  },
  'opening-letter': {
    first: ['Sơn vừa trải qua những trận mở đầu, vẫn viết về hỏi chuyện nhà.'],
    repeat: ['Him Lam ngày 13, Độc Lập ngày 15; lá thư dừng ở ngày 16/3.'],
    locked: ['Mình khôi phục hai phương châm ở lều chỉ huy trước khi đọc tin mở màn.'],
  },
  'north-report': {
    first: ['Bản tổng hợp này nối tiếp lá thư bằng tin ngày 17/3.'],
    repeat: ['Bản Kéo đầu hàng, còn các đợt chiến đấu tiếp theo vẫn ở phía trước.'],
    locked: ['Mình đọc lá thư sau những trận đầu rồi mới nối tới bản tổng hợp này.'],
  },
  'archive-cabinet': {
    first: ['Năm thẻ nằm lẫn nhau. Có hai mốc ngày, còn những việc chuẩn bị không phải chờ nhau.'],
    repeat: ['Phần hồ sơ chuẩn bị đã khôi phục, dữ kiện THÁNG 3 ở trong sổ tay.'],
    locked: ['Mình cần đọc hết bản tổng hợp cạnh tủ trước.'],
  },
  'cargo-yard': {
    first: ['Sáu bức minh họa những phần việc khác nhau trên tuyến tiếp vận.'],
    repeat: ['Các cặp đã khớp. Dữ kiện NĂM 1954 nối với công sức người vận chuyển.'],
    locked: ['Mình cần đọc sổ của Duyên để hiểu người và hàng trong những tranh này.'],
  },
  'command-tent': {
    first: ['Hai nhóm thẻ chữ. Mình ghép lại phương châm trước và sau khi thay đổi.'],
    repeat: ['ĐÁNH CHẮC, TIẾN CHẮC đã rõ. Phải hiểu cả lý do của sự thay đổi ấy.'],
    locked: ['Mình cần đọc trang sổ người chép lệnh trước.'],
  },
  'radio-station': {
    first: ['Ba nơi, ba mốc ngày. Tin nào mở màn, tin nào nói quân Pháp đầu hàng?'],
    repeat: ['13, 15, 17 tháng ba. Dữ kiện NGÀY 13 nhắc đến Him Lam mở màn.'],
    locked: ['Cần đọc cả thư của Sơn và bản tổng hợp sau ngày 17/3.'],
  },
  chest: {
    first: ['Khóa rương có chỗ điền một ngày tháng năm.'],
    repeat: ['Mảnh III đã được cất đi. Còn cửa ra ở phía đông nam.'],
    locked: ['Mình còn dữ kiện phải khôi phục ở bốn trạm trước khi mở khóa ngày.'],
  },
  door: {
    first: ['Đã có mảnh III, mình có thể bước qua cửa này.'],
    repeat: ['Phần việc trong phòng đã xong.'],
    locked: ['Mình cần đến rương và nhận mảnh III trước.'],
  },
  'supply-crates': {
    first: ['Những kiện hàng chờ được chuyển đi. Người nhận ở phía trước vẫn đang cần chúng.'],
    repeat: ['Gạo, đạn và thuốc đều có phần việc riêng trong một chuyến tiếp tế.'],
    locked: ['Mình xem bản tổng hợp cạnh kho để biết những thứ cần chuẩn bị.'],
  },
  'road-tools': {
    first: ['Đường thông thì người và hàng mới đi tiếp được.'],
    repeat: ['Công binh làm đường; dân công và thanh niên xung phong cũng góp sức mở, sửa tuyến đi.'],
    locked: ['Cuốn sổ chuyến hàng sẽ kể thêm về những người làm đường.'],
  },
  'field-lamp': {
    first: ['Dưới ánh đèn này, những dòng tin ngắn cũng cần được đọc thật kỹ.'],
    repeat: ['Một ngày ghi sai có thể làm lẫn cả trình tự những bản tin.'],
    locked: ['Mình bắt đầu ở kho và đi theo những giấy tờ dọc tuyến.'],
  },
};
