// Supplied activity design: parallel preparation tasks share a group, never a false date order.
export const CHALLENGES = [
  {id: 'preparation', stationId: 'archive-cabinet', documentIds: ['preparation-record'], reward: 'THÁNG 3', title: 'Hồ sơ bị thất lạc'},
  {id: 'cargo', stationId: 'cargo-yard', documentIds: ['supply-journal'], reward: 'NĂM 1954', title: 'Những chuyến hàng tới mặt trận'},
  {id: 'strategy', stationId: 'command-tent', documentIds: ['command-telegrams'], reward: 'ĐÁNH CHẮC, TIẾN CHẮC', title: 'Hai phương châm tác chiến'},
  {id: 'opening', stationId: 'radio-station', documentIds: ['opening-letter', 'north-report'], reward: 'NGÀY 13', title: 'Những bản tin mở màn'},
];

export const PREPARATION_CARDS = [
  {id: 'a', text: 'A · Ngày 6/12/1953, Bộ Chính trị quyết định mở Chiến dịch Điện Biên Phủ.', group: 'decision'},
  {id: 'b', text: 'B · Chuẩn bị kho tàng, lương thực, vũ khí, đạn dược và thuốc men cho chiến đấu.', group: 'preparation'},
  {id: 'c', text: 'C · Vận chuyển hàng, mở và sửa đường, kéo pháo vào trận địa.', group: 'preparation'},
  {id: 'd', text: 'D · Xây dựng, hoàn thiện công sự và trận địa; đầu tháng 3/1954 công tác chuẩn bị cơ bản hoàn thành.', group: 'preparation'},
  {id: 'e', text: 'E · Ngày 13/3/1954, tiến công Him Lam, mở màn chiến dịch.', group: 'opening'},
];

export const CARGO_ITEMS = [
  {id: 'bicycle', label: 'Xe đạp thồ', description: 'Chở lương thực và hàng hóa trên tuyến vận chuyển, phù hợp đường hẹp khó đi và mang được nhiều hàng.'},
  {id: 'porters', label: 'Dân công gánh hàng', description: 'Lực lượng vận chuyển tiếp sức cho mặt trận bằng những chuyến hàng.'},
  {id: 'artillery', label: 'Bộ đội kéo pháo', description: 'Đưa pháo vào trận địa để chuẩn bị chiến đấu.'},
  {id: 'rice', label: 'Bao gạo', description: 'Lương thực nuôi quân, duy trì sức cho chiến đấu lâu dài.'},
  {id: 'ammunition', label: 'Đạn dược', description: 'Tiếp tế chiến đấu để bộ đội có thể tiếp tục sử dụng vũ khí.'},
  {id: 'engineers', label: 'Công binh làm đường', description: 'Mở, sửa đường và bảo đảm giao thông cho người, hàng và pháo.'},
];

export const TELEGRAMS = {
  initial: [
    {id: 'attack', text: 'ĐÁNH'}, {id: 'fast-first', text: 'NHANH'},
    {id: 'resolve', text: 'GIẢI QUYẾT'}, {id: 'fast-last', text: 'NHANH'},
  ],
  final: [
    {id: 'attack', text: 'ĐÁNH'}, {id: 'sure-first', text: 'CHẮC'},
    {id: 'advance', text: 'TIẾN'}, {id: 'sure-last', text: 'CHẮC'},
  ],
};

export const OPENING_EVENTS = [
  {id: 'him-lam', text: 'Tiến công và làm chủ Him Lam, mở màn Chiến dịch Điện Biên Phủ.', date: '13/03/1954'},
  {id: 'doc-lap', text: 'Tiêu diệt cứ điểm Độc Lập.', date: '15/03/1954'},
  {id: 'ban-keo', text: 'Quân Pháp tại Bản Kéo đầu hàng dưới sức bao vây, uy hiếp.', date: '17/03/1954'},
];

export const REWARDS = CHALLENGES.map(({id, reward}) => ({id, label: reward}));
