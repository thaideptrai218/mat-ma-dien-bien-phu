import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {PAINTING_URL, REFLECTION_SCRIPT, SYSTEM_QUESTION, LONG_ANSWER, DOOR_MESSAGE, MUSEUM_RETURN, CLOSING_LINE, SOURCE_LABEL} from '../src/room-five/content.js';
import {getArchiveEntries} from '../src/room-five/archive.js';
import {shuffledPieces} from '../src/room-five/assembly-pieces.js';

test('the shared original painting is a local full 2x2 image and is explicitly disclosed as illustration', async () => {
  assert.ok(PAINTING_URL.endsWith('/assets/images/victory-painting.svg'));
  const svg = await readFile(new URL(PAINTING_URL), 'utf8');
  assert.match(svg, /viewBox="0 0 1200 800"/);
  assert.match(svg, /không phải ảnh tư liệu/);
  assert.doesNotMatch(svg, /https?:\/\/(?!www.w3.org)/);
  for (const random of [() => 0, () => .999, () => .5]) {
    const order = shuffledPieces(random);
    assert.deepEqual([...order].sort(), [0, 1, 2, 3]); assert.notDeepEqual(order, [0, 1, 2, 3]);
  }
});

test('full supplied final conversation and museum ending remain selectable text without truncation', () => {
  assert.ok(REFLECTION_SCRIPT.some(line => line.text === SYSTEM_QUESTION));
  assert.ok(REFLECTION_SCRIPT.some(line => line.text === LONG_ANSWER));
  assert.ok(LONG_ANSWER.endsWith('đóng góp cho cộng đồng bằng chính khả năng của mình.'));
  assert.ok(REFLECTION_SCRIPT.some(line => line.text.includes('Đằng sau chiến thắng ấy là sự hy sinh')));
  assert.ok(DOOR_MESSAGE.endsWith('hành động của thế hệ hôm nay.'));
  assert.equal(MUSEUM_RETURN.length, 3);
  assert.ok(MUSEUM_RETURN.at(-1).endsWith('bằng chính những hành động của mình.'));
  assert.ok(CLOSING_LINE.startsWith('Mật mã cuối cùng đã được giải'));
  assert.match(SOURCE_LABEL, /hư cấu học tập/);
  assert.deepEqual(getArchiveEntries({reflectionSeen: false}), []);
  const archive = getArchiveEntries({reflectionSeen: true, personalResponse: 'NEVER-ARCHIVE'});
  assert.equal(archive.length, 1); assert.equal(archive[0].kind, 'report');
  assert.ok(archive[0].paragraphs.includes(`Long — ${LONG_ANSWER}`));
  assert.equal(JSON.stringify(archive).includes('NEVER-ARCHIVE'), false);
});
