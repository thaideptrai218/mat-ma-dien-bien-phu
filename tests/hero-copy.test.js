import test from 'node:test';
import assert from 'node:assert/strict';
import {HERO_PROFILES, heroText} from '../src/heroes/hero-profiles.js';
import {heroCopy, withHeroReaction} from '../src/heroes/hero-copy.js';
import {openingFrames} from '../src/campaign/framing.js';
import * as roomOne from '../src/room-one/content.js';
import {reflectionScript, museumReturn, REFLECTION_SCRIPT, MUSEUM_RETURN, LONG_ANSWER} from '../src/room-five/content.js';

const {long, quang} = HERO_PROFILES;
const textOf = line => typeof line === 'string' ? line : line.text;

test("Quang's introduction is the one the story gave him; Long's is a student who skips lessons", () => {
  const [quangFirst] = openingFrames(quang), [longFirst] = openingFrames(long);
  assert.match(quangFirst.paragraphs[0], /^Quang là một sinh viên trẻ năng động, ham học hỏi/);
  assert.match(quangFirst.paragraphs[0], /chưa thực sự trở thành những câu chuyện mà cậu có thể cảm nhận bằng chính mình\.$/);
  assert.match(longFirst.paragraphs[0], /trốn tiết/);
  assert.equal(quangFirst.paragraphs.length, 3);
  assert.equal(longFirst.paragraphs.length, 3);
  assert.equal(openingFrames(long).length, openingFrames(quang).length, 'only the first frame differs');
  for (let frame = 1; frame < 3; frame++) assert.deepEqual(openingFrames(long)[frame], openingFrames(quang)[frame]);
});

test('a route never shows the other hero name once localized', () => {
  for (const hero of [long, quang]) {
    const other = hero.id === 'long' ? /\bQuang\b|\bQUANG\b/ : /\bLong\b|\bLONG\b/;
    const frames = openingFrames(hero).flatMap(frame => frame.paragraphs);
    for (const text of [...frames, ...reflectionScript(hero).map(textOf), ...museumReturn(hero)]) assert.doesNotMatch(heroText(text, hero), other, text);
  }
});

test("only Long's route grows: a reaction after rooms 1, 3 and 4 and a final reflection about studying", () => {
  for (const room of [1, 3, 4]) {
    assert.ok(withHeroReaction(roomOne.CAMPAIGN_ENDING, room, long).length > roomOne.CAMPAIGN_ENDING.length, `room ${room}`);
    assert.deepEqual(withHeroReaction(roomOne.CAMPAIGN_ENDING, room, quang), roomOne.CAMPAIGN_ENDING);
  }
  assert.deepEqual(withHeroReaction(roomOne.CAMPAIGN_ENDING, 2, long), roomOne.CAMPAIGN_ENDING, 'Room 2 keeps the donor story');
  assert.equal(reflectionScript(quang), REFLECTION_SCRIPT);
  const script = reflectionScript(long);
  assert.equal(script.length, REFLECTION_SCRIPT.length + heroCopy(long).reflection.length);
  assert.ok(script.indexOf(heroCopy(long).reflection[0]) < script.findIndex(line => line.text === LONG_ANSWER), 'before the hero answers');
  assert.match(heroCopy(long).reflection[0].text, /[Cc]ố gắng học/);
  assert.deepEqual(museumReturn(quang), MUSEUM_RETURN);
  assert.equal(museumReturn(long).length, MUSEUM_RETURN.length + 1);
  assert.match(museumReturn(long).at(-1), /mở sách sử/);
});

test('every extra line has a known speaker and keeps the address rules ("tôi", "Ký Chủ")', () => {
  const extras = [...Object.values(heroCopy(long).afterRoom).flat(), ...heroCopy(long).reflection];
  assert.ok(extras.length >= 7);
  for (const line of extras) {
    assert.ok(['Long', 'Hệ Thống', 'Lời kể'].includes(line.speaker), line.speaker);
    assert.doesNotMatch(line.text, /\b([Tt]ao|[Mm]ày|[Nn]gươi)\b/u, line.text);
    if (line.speaker === 'Hệ Thống') assert.match(line.text, /Ký Chủ/, line.text);
  }
});
