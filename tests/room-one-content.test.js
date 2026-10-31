import test from 'node:test';
import assert from 'node:assert/strict';
import { DOCUMENTS } from '../src/room-one/documents.js';
import { INTRO, ENDING, REACTIONS } from '../src/room-one/content.js';
import { LETTER_DOCUMENT } from '../src/room-one/letter-document.js';

test('all four paper documents contain full prose and separately confirmable deductions', () => {
  assert.deepEqual(DOCUMENTS.map(document => document.id), ['v1', 'v2', 'p1', 'p2']);
  for (const document of DOCUMENTS) {
    const words = document.paragraphs.join(' ').trim().split(/\s+/u).length;
    assert.ok(words >= 250 && words <= 450, `${document.id}: ${words} words including the newly supplied background`);
    assert.ok(document.paragraphs.length >= 4 && document.paragraphs.length <= 6);
    assert.ok(document.paragraphs.every(paragraph => typeof paragraph === 'string' && paragraph.length > 100));
    assert.ok(Array.isArray(document.reflection) && document.reflection.length >= 2);
    assert.ok(document.reflection.every(line => typeof line === 'string' && line.length > 20));
    assert.ok(document.source);
    assert.match(document.fictionDisclosure, /hư cấu/u);
    assert.doesNotMatch(document.paragraphs.join(' '), /trò chơi|theo tài liệu cung cấp|người đọc|hồ sơ này/u);
  }
});

test('troop figures retain their supplied-source context without introducing later campaign teaching', () => {
  assert.match(DOCUMENTS.find(document => document.id === 'v2').paragraphs.join(' '), /252\.000/u);
  assert.match(DOCUMENTS.find(document => document.id === 'p1').paragraphs.join(' '), /445\.000/u);
  const beforeCable = JSON.stringify({ DOCUMENTS, LETTER_DOCUMENT, INTRO, REACTIONS });
  assert.doesNotMatch(beforeCable, /Navarre|Nava|hai bước|1954|1955/u);
  assert.match(JSON.stringify(ENDING), /Henri Navarre/u);
  assert.match(JSON.stringify(ENDING), /[Tt]háng 5\/1953/u);
});

test('all interactive objects have distinct first, repeated and blocked thoughts', () => {
  const ids = ['letter', 'map-a03', 'v1', 'v2', 'p1', 'p2', 'comparison', 'drawer', 'chest', 'door', 'lamp', 'crate', 'radio'];
  assert.deepEqual(Object.keys(REACTIONS).sort(), ids.sort());
  for (const [id, reactions] of Object.entries(REACTIONS)) {
    for (const phase of ['first', 'repeat', 'locked']) {
      assert.ok(Array.isArray(reactions[phase]) && reactions[phase].length > 0, `${id}.${phase}`);
      assert.ok(reactions[phase].every(line => typeof line === 'string' && line.trim().length > 0));
    }
    assert.notDeepEqual(reactions.first, reactions.repeat, id);
  }
});

test('personal letter keeps historical context and archival clue separate from the writer', () => {
  assert.equal(LETTER_DOCUMENT.kind,'letter');
  assert.ok(LETTER_DOCUMENT.author && LETTER_DOCUMENT.recipient && LETTER_DOCUMENT.salutation && LETTER_DOCUMENT.signature);
  assert.match(LETTER_DOCUMENT.fictionDisclosure,/hư cấu/u);
  const text=LETTER_DOCUMENT.paragraphs.join('\n\n');
  assert.match(text,/Tây Bắc/u); assert.match(text,/1952|năm ngoái/u);
  assert.equal(LETTER_DOCUMENT.archiveMark,'A-03');
  assert.doesNotMatch(text,/A-03|bốn hồ sơ|trò chơi|người đọc|theo tài liệu/u);
});

test('Vietnamese reader text stays NFC and ending requires reaching the door', () => {
  const content = JSON.stringify({ DOCUMENTS, LETTER_DOCUMENT, INTRO, ENDING, REACTIONS });
  assert.equal(content, content.normalize('NFC'));
  assert.match(JSON.stringify(ENDING), /[Tt]ới cửa.*hoàn thành Phòng 1/u);
  assert.doesNotMatch(JSON.stringify(ENDING), /đã hoàn thành Phòng 1/u);
});
