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

// Minimal stand-in for the donor view's text container (the wrap re-voices its paragraphs).
const fakeCopy = () => ({ownerDocument: {createTreeWalker: () => ({nextNode: () => null})}, querySelectorAll: () => []});

test('the wrapped narrative view renames after every rendered line', () => {
  const calls = [];
  const narrative = {copy: fakeCopy(), portrait: {alt: 'Chân dung Quang'}, renderLine(focus) { calls.push(focus); }};
  installHeroName(narrative);
  narrative.renderLine(false);
  assert.deepEqual(calls, [false]);
  assert.equal(narrative.portrait.alt, 'Chân dung Long');
  assert.match(narrative.portrait.src, /long-portrait\.png$/);
});

test("Quang's route shows Quang's name and face in the donor view, with Hệ Thống's original emblem", () => {
  selectHero('quang', {persist: false});
  try {
    assert.equal(renameHero('ĐÊM 1953 · LỜI QUANG'), 'ĐÊM 1953 · LỜI QUANG');
    const narrative = {copy: fakeCopy(), portrait: {alt: 'Chân dung Quang', src: 'donor.png'}, renderLine() {}};
    installHeroName(narrative);
    narrative.renderLine(false);
    assert.equal(narrative.portrait.alt, 'Chân dung Quang');
    assert.match(narrative.portrait.src, /quang-portrait\.png$/);
    const system = {copy: fakeCopy(), portrait: {alt: 'Giọng nói của căn phòng ký ức', src: 'emblem.png'}, renderLine() {}};
    installHeroName(system);
    system.renderLine(false);
    assert.equal(system.portrait.src, 'emblem.png', "Hệ Thống's emblem is left as the donor shows it");
  } finally { selectHero('long', {persist: false}); }
});
