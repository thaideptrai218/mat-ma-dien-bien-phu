import test from 'node:test';
import assert from 'node:assert/strict';
import { DOCUMENTS } from '../src/room-four/documents.js';
import { INTRO, ENDING, REACTIONS } from '../src/room-four/content.js';
import { CROSSWORD_ROWS, BOARDS } from '../src/room-four/puzzle-data.js';

const documentIds = ['east-offensive', 'final-assault', 'a1', 'headquarters', 'results', 'north', 'independence'];
const prose = id => DOCUMENTS.find(document => document.id === id).paragraphs.join(' ');
const normalizeAnswer = text => text.normalize('NFD').replace(/\p{M}/gu, '').replace(/đ/giu, 'd').toUpperCase().replace(/[^A-Z]/gu, '');

test('seven full papers keep chronology, natural prose and provenance outside their bodies', () => {
  assert.deepEqual(DOCUMENTS.map(document => document.id), documentIds);
  assert.equal(new Set(DOCUMENTS.map(document => document.code)).size, 7);
  assert.equal(new Set(DOCUMENTS.map(document => document.author)).size, 7);
  for (const document of DOCUMENTS) {
    const body = document.paragraphs.join(' ');
    const words = body.trim().split(/\s+/u).length;
    assert.equal(document.paragraphs.length, 5, document.id);
    assert.ok(words >= 250 && words <= 350, `${document.id}: ${words} words`);
    assert.ok(document.paragraphs.every(paragraph => paragraph.length > 100));
    assert.match(document.fictionDisclosure, /hư cấu/u);
    assert.match(document.source, /PDF bản 4/u);
    assert.ok(document.title && document.date && document.author && document.summary);
    assert.ok(['letter', 'journal', 'report'].includes(document.kind));
    assert.doesNotMatch(body, /trò chơi|PDF|theo tài liệu|người đọc|hồ sơ này|mật mã|ô chữ|mảnh tranh/u);
    assert.equal(document.reflection.length, 2);
    assert.ok(document.reflection.every(line => line.startsWith('Long: ') && line.length < 130));
    assert.doesNotMatch(document.reflection.join(' '), /Mình ghi nhận|tư liệu này|người đọc/u);
    if (document.kind === 'letter') {
      assert.ok(document.recipient && document.salutation && document.closing && document.signature);
      assert.match(document.date, /hư cấu/u);
    }
  }
});

test('papers retain the supplied chronology and separate northern liberation from 7 May', () => {
  assert.match(prose('east-offensive'), /30 tháng 3/u);
  assert.match(prose('east-offensive'), /C1, A1/u);
  assert.match(prose('east-offensive'), /phần lớn sân bay Mường Thanh/u);
  assert.match(prose('east-offensive'), /bị động/u);
  assert.match(prose('final-assault'), /1 tháng 5 năm 1954/u);
  assert.match(prose('final-assault'), /tiêu diệt các cứ điểm còn lại/u);
  assert.match(prose('a1'), /Đêm 6 tháng 5.*khoảng một tấn/u);
  assert.match(prose('a1'), /bộ binh tiến công từ nhiều hướng/u);
  assert.match(prose('headquarters'), /sở chỉ huy trung tâm/u);
  assert.match(prose('headquarters'), /17 giờ 30 phút/u);
  assert.match(prose('headquarters'), /Đờ Cát cùng toàn bộ Bộ Tham mưu/u);
  assert.match(prose('results'), /56 ngày đêm/u);
  assert.match(prose('results'), /bị tiêu diệt và bắt sống là 16\.200/u);
  assert.match(prose('results'), /toàn bộ vũ khí, kho tàng/u);
  assert.match(prose('results'), /phá sản Kế hoạch Nava/u);
  assert.match(prose('results'), /Hiệp định Genève năm 1954/u);
  assert.match(DOCUMENTS.find(document => document.id === 'north').date, /sau Hiệp định Genève/u);
  assert.match(prose('north'), /miền Bắc được giải phóng thuộc bước chuyển tiếp theo, sau hiệp định/u);
  assert.match(prose('north'), /hậu phương.*giải phóng miền Nam và thống nhất/u);
  assert.match(prose('independence'), /độc lập dân tộc/u);
  assert.match(prose('independence'), /chống chủ nghĩa thực dân/u);
  assert.doesNotMatch(JSON.stringify({ DOCUMENTS, INTRO, ENDING, REACTIONS }), /1955|\bHòa\b|\bLan\b|\bTuấn\b/u);
});

test('crossword answers remain derivable from their papers with the minimal full-answer repair', () => {
  assert.deepEqual(CROSSWORD_ROWS.map(row => row.id), ['objective', 'encirclement', 'a1', 'headquarters', 'weapons', 'north', 'independence']);
  assert.deepEqual(CROSSWORD_ROWS.map(row => row.answer), ['TIEUDIET', 'BIDONG', 'MOTTAN', 'SOCHIHUYTRUNGTAM', 'VUKHI', 'MIENBAC', 'DOCLAPDANTOC']);
  assert.deepEqual(CROSSWORD_ROWS.map(row => row.start), [8, 7, 8, 0, 8, 3, 5]);
  assert.equal(CROSSWORD_ROWS[3].answer.length, 16);
  assert.equal(Math.max(...CROSSWORD_ROWS.map(row => row.start + row.answer.length)), 17);
  assert.equal(CROSSWORD_ROWS.map(row => row.answer[8 - row.start]).join(''), 'TIMTVAL');
  for (const row of CROSSWORD_ROWS) {
    assert.ok(normalizeAnswer(prose(row.documentId)).includes(row.answer), row.id);
    assert.ok(row.question.endsWith('?'));
  }
  const weapons = CROSSWORD_ROWS.find(row => row.id === 'weapons');
  assert.match(weapons.question, /tiêu diệt và bắt sống 16\.200/u);
  assert.match(CROSSWORD_ROWS.find(row => row.id === 'north').question, /Hiệp định Genève năm 1954/u);
});

test('both grids and their unique shape traversals reproduce the supplied page-22 ciphers', () => {
  assert.deepEqual(BOARDS.t.rows, ['QUYET', 'UNCAH', 'AMHTA', 'CTICN', 'AAELG', 'MTNAT']);
  assert.deepEqual(BOARDS.l.rows, ['QNAVE', 'ULTAV', 'YNLNI', 'EBCLO', 'TQMAL', 'THANG']);
  assert.deepEqual(BOARDS.t.cells, [0, 1, 2, 3, 4, 7, 12, 17, 22, 27]);
  assert.deepEqual(BOARDS.l.cells, [0, 5, 10, 15, 20, 25, 26, 27, 28, 29]);
  for (const board of Object.values(BOARDS)) {
    assert.equal(board.rows.length, 6);
    assert.ok(board.rows.every(row => /^[A-Z]{5}$/u.test(row)));
    assert.equal(new Set(board.cells).size, 10);
    assert.equal(board.cells.map(index => board.rows.join('')[index]).join(''), board.phrase);
  }
  assert.equal(BOARDS.t.phrase, 'QUYETCHIEN');
  assert.equal(BOARDS.l.phrase, 'QUYETTHANG');
});

test('every room object has first, repeated and blocked thoughts', () => {
  const objectIds = [...documentIds, 'crossword', 'board-t', 'board-l', 'chest', 'door', 'lamp', 'radio'];
  assert.deepEqual(Object.keys(REACTIONS).sort(), objectIds.sort());
  for (const [id, reaction] of Object.entries(REACTIONS)) {
    for (const phase of ['first', 'repeat', 'locked']) {
      assert.ok(Array.isArray(reaction[phase]) && reaction[phase].length > 0, `${id}.${phase}`);
      assert.ok(reaction[phase].every(line => typeof line === 'string' && line.trim().length > 0));
    }
    assert.notDeepEqual(reaction.first, reaction.repeat, id);
  }
});

test('Vietnamese content stays NFC and standalone ending awards only fragment IV', () => {
  const content = JSON.stringify({ DOCUMENTS, INTRO, ENDING, REACTIONS, CROSSWORD_ROWS, BOARDS });
  assert.equal(content, content.normalize('NFC'));
  for (const entry of [...INTRO, ...ENDING]) assert.ok(entry.speaker && entry.text);
  const ending = JSON.stringify(ENDING);
  assert.match(ending, /mảnh tranh IV/u);
  assert.match(ending, /[Tt]ới cửa.*hoàn thành Phòng 4/u);
  assert.match(ending, /Phòng 5.*hành trình năm phòng.*trang chính/u);
  assert.doesNotMatch(ending, /đủ bốn|đủ 4|mảnh (?:I,|II|III)|trở về bảo tàng|đã hoàn thành Phòng 4/u);
});
