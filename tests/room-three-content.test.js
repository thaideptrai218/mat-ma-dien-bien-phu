import test from 'node:test';
import assert from 'node:assert/strict';
import {DOCUMENTS} from '../src/room-three/documents.js';
import {INTRO, ENDING, REACTIONS} from '../src/room-three/content.js';
import {CHALLENGES, PREPARATION_CARDS, CARGO_ITEMS, TELEGRAMS, OPENING_EVENTS, REWARDS} from '../src/room-three/puzzle-data.js';
import {DOCUMENTS as ROOM_ONE_DOCUMENTS} from '../src/room-one/documents.js';
import {LETTER_DOCUMENT} from '../src/room-one/letter-document.js';
import {INTRO as ROOM_ONE_INTRO, REACTIONS as ROOM_ONE_REACTIONS} from '../src/room-one/content.js';
import {NAVA_CONTEXT_DOCUMENT} from '../src/room-one/nava-context.js';

const documentIds = ['preparation-record','supply-journal','command-telegrams','opening-letter','north-report'];
const body = id => DOCUMENTS.find(document => document.id === id).paragraphs.join(' ');

test('five full papers keep prose, source, fiction and Long deductions separate', () => {
  assert.deepEqual(DOCUMENTS.map(document => document.id), documentIds);
  for (const document of DOCUMENTS) {
    const text = document.paragraphs.join(' ');
    const count = text.trim().split(/\s+/u).length;
    assert.ok(count >= 250 && count <= 400, `${document.id}: ${count}`);
    assert.equal(document.paragraphs.length, 5);
    assert.ok(document.paragraphs.every(paragraph => paragraph.length > 100));
    assert.ok(document.title && document.code && document.date && document.author && document.summary);
    assert.match(document.fictionDisclosure, /hư cấu/u);
    assert.match(document.source, /người dùng bổ sung/u);
    assert.equal(document.reflection.length, 2);
    assert.ok(document.reflection.every(line => line.startsWith('Long: ') && line.length < 130));
    assert.doesNotMatch(text, /trò chơi|người đọc|PDF|theo tài liệu|mảnh tranh|mật mã|thẻ chữ/u);
    if (document.kind === 'letter') assert.ok(document.salutation && document.recipient && document.closing && document.signature);
  }
});

test('preparation facts preserve parallel work and long-combat logistics', () => {
  const text = body('preparation-record');
  assert.match(text, /6 tháng 12 năm 1953.*Bộ Chính trị quyết định/u);
  assert.match(text, /Đại tướng Võ Nguyên Giáp/u);
  assert.match(text, /vũ khí, đạn dược, lương thực và thuốc men/u);
  assert.match(text, /Bộ đội, dân công và thanh niên xung phong/u);
  assert.match(text, /diễn ra đan xen/u);
  assert.match(text, /đầu tháng 3 năm 1954.*cơ bản hoàn thành/u);
  assert.match(text, /duy trì chiến đấu lâu dài/u);
});

test('six supplied cargo identities and their roles remain explainable from the journal', () => {
  assert.deepEqual(CARGO_ITEMS.map(item => item.id), ['bicycle','porters','artillery','rice','ammunition','engineers']);
  for (const item of CARGO_ITEMS) assert.ok(item.label && item.description);
  const text = body('supply-journal');
  for (const role of ['xe đạp thồ','Dân công gánh hàng','bộ đội kéo pháo','bao gạo','Đạn dược','Công binh làm đường','thanh niên xung phong']) {
    assert.ok(text.includes(role), role);
  }
  assert.match(text, /Đường miền núi hẹp, khó đi.*mang được nhiều hàng/u);
  assert.doesNotMatch(text, /\d+\s*(?:kg|ki.?lô.?gam)/iu);
});

test('doctrine reason covers real assessment and sure victory without inventing its change date', () => {
  const text = body('command-telegrams');
  assert.match(text, /Đánh nhanh, giải quyết nhanh/u);
  assert.match(text, /Đánh chắc, tiến chắc/u);
  assert.match(text, /bảo đảm chắc thắng, phù hợp với điều kiện thực tế/u);
  assert.match(text, /tương quan lực lượng/u);
  assert.match(text, /chỉ nói thiếu lương thực thì chưa thể giải thích hết/u);
  assert.doesNotMatch(JSON.stringify(DOCUMENTS), /26\/1|26 tháng 1|26 tháng một/u);
});

test('opening papers separate attack and surrender and never foretell the final victory', () => {
  const letter = body('opening-letter');
  assert.match(letter, /13 tháng 3 năm 1954.*Him Lam.*mở màn/u);
  assert.match(letter, /15 tháng 3.*Độc Lập/u);
  assert.doesNotMatch(letter, /17 tháng 3|Bản Kéo|7 tháng 5|7\/5|Genève/u);
  const report = body('north-report');
  assert.match(report, /17 tháng 3/u);
  assert.match(report, /Bản Kéo đầu hàng/u);
  assert.match(report, /Bắc và Đông Bắc.*phá vỡ/u);
  assert.match(report, /trên 2\.000 quân địch bị tiêu diệt và bắt sống/u);
  assert.match(report, /Mường Thanh/u);
  assert.match(report, /không thể khép cả chiến dịch ở ngày 17 tháng 3/u);
  assert.doesNotMatch(report, /7 tháng 5|7\/5|Genève|chiến thắng cuối cùng/u);
});

test('four activity gates, parallel preparation cards and derived tokens retain their exact contracts', () => {
  assert.deepEqual(CHALLENGES.map(({id, stationId, documentIds: papers}) => [id, stationId, papers]), [
    ['preparation','archive-cabinet',['preparation-record']],
    ['cargo','cargo-yard',['supply-journal']],
    ['strategy','command-tent',['command-telegrams']],
    ['opening','radio-station',['opening-letter','north-report']],
  ]);
  assert.deepEqual(PREPARATION_CARDS.map(card => card.id), ['a','b','c','d','e']);
  assert.deepEqual(PREPARATION_CARDS.map(card => card.group), ['decision','preparation','preparation','preparation','opening']);
  assert.match(PREPARATION_CARDS[0].text, /6\/12\/1953/u);
  assert.match(PREPARATION_CARDS[4].text, /13\/3\/1954/u);
  assert.deepEqual(CHALLENGES.map(challenge => challenge.reward), ['THÁNG 3','NĂM 1954','ĐÁNH CHẮC, TIẾN CHẮC','NGÀY 13']);
  assert.deepEqual(REWARDS, CHALLENGES.map(({id, reward}) => ({id, label: reward})));
});

test('telegram duplicate words keep distinct card IDs and opening anchors stay 13 15 17 March', () => {
  for (const phrase of Object.values(TELEGRAMS)) {
    assert.equal(phrase.length, 4);
    assert.equal(new Set(phrase.map(card => card.id)).size, 4);
    assert.ok(phrase.every(card => card.text && card.id));
  }
  assert.equal(TELEGRAMS.initial.map(card => card.text).join(' '), 'ĐÁNH NHANH GIẢI QUYẾT NHANH');
  assert.equal(TELEGRAMS.final.map(card => card.text).join(' '), 'ĐÁNH CHẮC TIẾN CHẮC');
  assert.equal(TELEGRAMS.initial.filter(card => card.text === 'NHANH').length, 2);
  assert.equal(TELEGRAMS.final.filter(card => card.text === 'CHẮC').length, 2);
  assert.deepEqual(OPENING_EVENTS.map(event => [event.id,event.date]), [
    ['him-lam','13/03/1954'],['doc-lap','15/03/1954'],['ban-keo','17/03/1954'],
  ]);
  assert.match(OPENING_EVENTS[2].text, /đầu hàng/u);
});

test('all fourteen objects have thoughts and standalone ending awards only fragment III', () => {
  const ids = [...documentIds,'archive-cabinet','cargo-yard','command-tent','radio-station','chest','door','supply-crates','road-tools','field-lamp'];
  assert.deepEqual(Object.keys(REACTIONS).sort(), ids.sort());
  for (const [id, reaction] of Object.entries(REACTIONS)) {
    for (const phase of ['first','repeat','locked']) {
      assert.ok(Array.isArray(reaction[phase]) && reaction[phase].length > 0, `${id}.${phase}`);
      assert.ok(reaction[phase].every(line => typeof line === 'string' && line.length > 0));
    }
    assert.notDeepEqual(reaction.first,reaction.repeat);
  }
  assert.ok([...INTRO,...ENDING].every(line => line.speaker && line.text));
  const ending = JSON.stringify(ENDING);
  assert.match(ending, /bốn dữ kiện.*riêng mảnh tranh III/u);
  assert.match(ending, /Tới cửa.*hoàn thành Phòng 3/u);
  assert.match(ending, /Phòng 5.*hành trình năm phòng.*trang chính/u);
  assert.doesNotMatch(ending, /đủ bốn mảnh|trở về bảo tàng|đã hoàn thành Phòng 3/u);
  const content = JSON.stringify({DOCUMENTS,INTRO,ENDING,REACTIONS,CHALLENGES,PREPARATION_CARDS,CARGO_ITEMS,TELEGRAMS,OPENING_EVENTS,REWARDS});
  assert.equal(content,content.normalize('NFC'));
});

test('Room 1 retrospective expansion preserves early letters while July context stays separate', () => {
  const early = JSON.stringify({documents: ROOM_ONE_DOCUMENTS, letter: LETTER_DOCUMENT, intro: ROOM_ONE_INTRO, reactions: ROOM_ONE_REACTIONS});
  assert.doesNotMatch(early, /Navarre|Nava|hai bước|1954|1955/u);
  const history = [...ROOM_ONE_DOCUMENTS, LETTER_DOCUMENT].flatMap(document => document.paragraphs).join(' ');
  for (const fact of ['Biên giới','1950','Trung Du','Hòa Bình','Tây Bắc','hậu phương','Hoa Kỳ']) assert.ok(history.includes(fact),fact);
  assert.equal(LETTER_DOCUMENT.date,'Đầu năm 1953');
  assert.equal(LETTER_DOCUMENT.archiveMark,'A-03');
  for (const document of [...ROOM_ONE_DOCUMENTS,LETTER_DOCUMENT,NAVA_CONTEXT_DOCUMENT]) {
    const text = document.paragraphs.join(' ');
    const count = text.trim().split(/\s+/u).length;
    assert.ok(count >= 250 && count <= 450, `${document.id}: ${count}`);
    assert.equal(document.paragraphs.length,5);
    assert.doesNotMatch(text,/trò chơi|người đọc|theo tài liệu|A-03/u);
  }
  assert.equal(NAVA_CONTEXT_DOCUMENT.id,'nava-context');
  assert.equal(NAVA_CONTEXT_DOCUMENT.code,'N-01');
  assert.match(NAVA_CONTEXT_DOCUMENT.date,/7\/1953/u);
  const bulletin = NAVA_CONTEXT_DOCUMENT.paragraphs.join(' ');
  assert.match(bulletin,/Tháng 5 năm 1953, Henri Navarre/u);
  assert.match(bulletin,/tháng 7 năm 1953, Chính phủ Pháp thông qua/u);
  assert.match(bulletin,/thắng lợi quân sự quyết định/u);
  assert.match(bulletin,/điều kiện có lợi cho Pháp/u);
  assert.doesNotMatch(bulletin,/hai bước|bước thứ nhất|bước thứ hai/u);
  assert.equal(JSON.stringify(NAVA_CONTEXT_DOCUMENT),JSON.stringify(NAVA_CONTEXT_DOCUMENT).normalize('NFC'));
});
