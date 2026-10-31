import test from 'node:test';
import assert from 'node:assert/strict';
import {renameHero, installHeroName} from '../src/room-two/hero-name.js';

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
});
