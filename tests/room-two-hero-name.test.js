import test from 'node:test';
import assert from 'node:assert/strict';
import {renameHero, installHeroName} from '../src/room-two/hero-name.js';
import {selectHero} from '../src/heroes/hero-profiles.js';

test('donor Room 2 labels are shown with the hero name Long', () => {
  assert.equal(renameHero('ĐÊM 1953 · LỜI QUANG'), 'ĐÊM 1953 · LỜI LONG');
  assert.equal(renameHero('Lời Quang và hiện vật kể chuyện'), 'Lời Long và hiện vật kể chuyện');
  assert.equal(renameHero('quang cảnh hầm'), 'quang cảnh hầm', 'lower-case words are not names');
  assert.equal(renameHero(undefined), undefined);
});

test('the wrapped narrative view renames after every rendered line', () => {
  const calls = [];
  const narrative = {copy: null, portrait: {alt: 'Quang, nhân vật hư cấu'}, renderLine(focus) { calls.push(focus); }};
  installHeroName(narrative);
  narrative.renderLine(false);
  assert.deepEqual(calls, [false]);
  assert.equal(narrative.portrait.alt, 'Long, nhân vật hư cấu');
  assert.match(narrative.portrait.src, /long-portrait\.png$/);
});

test("Quang's route shows Quang's name and face in the donor view, with Hệ Thống's original emblem", () => {
  selectHero('quang', {persist: false});
  try {
    assert.equal(renameHero('ĐÊM 1953 · LỜI QUANG'), 'ĐÊM 1953 · LỜI QUANG');
    const narrative = {copy: null, portrait: {alt: 'Quang, nhân vật hư cấu', src: 'donor.png'}, renderLine() {}};
    installHeroName(narrative);
    narrative.renderLine(false);
    assert.equal(narrative.portrait.alt, 'Quang, nhân vật hư cấu');
    assert.match(narrative.portrait.src, /quang-portrait\.png$/);
    const system = {copy: null, portrait: {alt: 'Giọng nói của căn phòng ký ức', src: 'emblem.png'}, renderLine() {}};
    installHeroName(system);
    system.renderLine(false);
    assert.match(system.portrait.src, /game-emblem\.png$/);
  } finally { selectHero('long', {persist: false}); }
});

test("on Long's route Hệ Thống wears the TL-36 avatar in the donor view too", () => {
  const system = {copy: null, portrait: {alt: 'Giọng nói của căn phòng ký ức', src: 'emblem.png'}, renderLine() {}};
  installHeroName(system);
  system.renderLine(false);
  assert.match(system.portrait.src, /system-avatar-tl36\.png$/);
});
