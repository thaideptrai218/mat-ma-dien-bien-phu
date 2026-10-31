// Short door puzzles for the puzzle-type gates. Each uses a fact the player has just read, one tactile dial.
// payload: {id, code}; the answer is checked in rules.js (reduce 'door'), never in the view.
const LETTERS = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'], DIGITS = [...'0123456789'];

export const DOOR_PUZZLES = Object.freeze({
  'west-archive': {
    title: 'Then cài gian V',
    lead: 'Chiếc then có ba bánh: một chữ và hai số. Xoay cho khớp ký hiệu lưu trữ ở cuối lá thư.',
    alphabets: [LETTERS, DIGITS, DIGITS], initial: 'D41', answer: 'A03', submit: 'Mở then',
    requires: s => s.letterSolved === true,
  },
  'drawer-alcove': {
    title: 'Khóa góc ngăn kéo',
    lead: 'Khóa ba bánh số hỏi quân số của phía Việt Nam trong sổ quân nhu, tính theo nghìn người.',
    alphabets: [DIGITS, DIGITS, DIGITS], initial: '470', answer: '252', submit: 'Mở khóa',
    requires: s => (s.collectedNoteIds || []).includes('v2'),
  },
  'exit-hall': {
    title: 'Khóa cổng ra',
    lead: 'Khóa hai bánh số hỏi tháng Chính phủ Pháp thông qua kế hoạch Nava, theo bản tin vừa đọc.',
    alphabets: [DIGITS, DIGITS], initial: '12', answer: '07', submit: 'Mở khóa',
    requires: s => s.chestOpened === true,
  },
});

export const normalizeCode = value => String(value ?? '').toUpperCase().replace(/[^A-Z0-9]/g, '');
export const doorAnswerCorrect = (id, payload = {}) => Object.hasOwn(DOOR_PUZZLES, id) && normalizeCode(payload.code) === DOOR_PUZZLES[id].answer;
export const doorAvailable = (id, state) => Object.hasOwn(DOOR_PUZZLES, id) && DOOR_PUZZLES[id].requires(state);
