// PDF p21–22 supplies the answers and alignment. Its fourth drawn row is one cell short;
// retain the full 16-letter answer and add only its trailing cell.
export const CROSSWORD_ROWS = [
  { id: 'objective', documentId: 'final-assault', question: 'Mục tiêu của quân đội Việt Nam trong đợt tiến công thứ ba phải làm gì với các cứ điểm còn lại?', answer: 'TIEUDIET', start: 8 },
  { id: 'encirclement', documentId: 'east-offensive', question: 'Đến cuối tháng 4/1954, quân Pháp rơi vào thế nào khi hệ thống phòng thủ suy yếu?', answer: 'BIDONG', start: 7 },
  { id: 'a1', documentId: 'a1', question: 'Công binh Việt Nam sử dụng khoảng bao nhiêu tấn thuốc nổ tại A1 trong đêm 6/5/1954?', answer: 'MOTTAN', start: 8 },
  { id: 'headquarters', documentId: 'headquarters', question: 'Ngày 7/5/1954, quân đội Việt Nam tiến công thẳng vào đâu để kết thúc trận Điện Biên Phủ?', answer: 'SOCHIHUYTRUNGTAM', start: 0 },
  { id: 'weapons', documentId: 'results', question: 'Ngoài việc tiêu diệt và bắt sống 16.200 quân địch, quân đội Việt Nam còn thu giữ gì từ quân Pháp trong Chiến dịch Điện Biên Phủ?', answer: 'VUKHI', start: 8 },
  { id: 'north', documentId: 'north', question: 'Sau chiến thắng Điện Biên Phủ và Hiệp định Genève năm 1954, khu vực nào của Việt Nam được giải phóng và trở thành hậu phương cho cách mạng?', answer: 'MIENBAC', start: 3 },
  { id: 'independence', documentId: 'independence', question: 'Đối với thế giới, Chiến thắng Điện Biên Phủ trở thành biểu tượng nổi bật của phong trào đấu tranh giành điều gì?', answer: 'DOCLAPDANTOC', start: 5 },
];

// Flattened indices are the reading order, including the corner only once.
export const BOARDS = {
  t: {
    rows: ['QUYET', 'UNCAH', 'AMHTA', 'CTICN', 'AAELG', 'MTNAT'],
    cells: [0, 1, 2, 3, 4, 7, 12, 17, 22, 27],
    phrase: 'QUYETCHIEN',
  },
  l: {
    rows: ['QNAVE', 'ULTAV', 'YNLNI', 'EBCLO', 'TQMAL', 'THANG'],
    cells: [0, 5, 10, 15, 20, 25, 26, 27, 28, 29],
    phrase: 'QUYETTHANG',
  },
};
