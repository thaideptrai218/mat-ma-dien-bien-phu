import test from 'node:test';
import assert from 'node:assert/strict';
import { GAME_FONTS, loadGameFonts } from '../src/ui/game-fonts.js';

const nextTurn = () => new Promise(resolve => setImmediate(resolve));
function deferred() {
  let resolve;
  const promise = new Promise(done => { resolve = done; });
  return { promise, resolve };
}

test('font readiness waits for every requested face and supplies Vietnamese text to native loading', async () => {
  const requested = [];
  const fontSet = { load(face, text) { requested.push({ face, text }); return Promise.resolve([]); } };
  await loadGameFonts(fontSet);

  for (const family of [GAME_FONTS.body, GAME_FONTS.display]) {
    assert.ok(requested.some(({ face }) => face.includes(`"${family}"`) && /\b400\b/.test(face)), `${family} regular requested`);
    assert.ok(requested.some(({ face }) => face.includes(`"${family}"`) && /\b700\b/.test(face)), `${family} bold requested`);
  }
  for (const { text } of requested) {
    assert.match(text, /[ạ-ỹ]/u, 'native font loading must exercise Vietnamese glyphs');
    assert.match(text, /[Đđ]/u);
  }

  // Make each face the final outstanding request in turn. No individual face may
  // be omitted from the readiness barrier used before room labels are rasterized.
  for (const { face: heldFace } of requested) {
    const hold = deferred();
    let complete = false;
    const readiness = loadGameFonts({ load(face) { return face === heldFace ? hold.promise : Promise.resolve([]); } });
    readiness.then(() => { complete = true; });
    await nextTurn();
    assert.equal(complete, false, `startup must wait for ${heldFace}`);
    hold.resolve([]);
    await readiness;
    assert.equal(complete, true);
  }
});

test('failed and synchronously throwing font requests still attempt other faces and allow startup', async () => {
  for (const failure of ['rejected', 'thrown']) {
    const attempted = [];
    const hold = deferred();
    let complete = false;
    const readiness = loadGameFonts({ load(face) {
      attempted.push(face);
      if (attempted.length === 1) {
        if (failure === 'thrown') throw new Error('font request unavailable');
        return Promise.reject(new Error('font request failed'));
      }
      return hold.promise;
    } });
    readiness.then(() => { complete = true; });
    await nextTurn();
    assert.ok(attempted.length > 1, 'one failed face must not cancel the other font requests');
    assert.ok(attempted.some(face => face.includes(GAME_FONTS.display)), 'display requests continue after failure');
    assert.equal(complete, false, 'remaining requests must finish before startup');
    hold.resolve([]);
    await assert.doesNotReject(readiness);
    assert.equal(complete, true);
  }
});

test('startup remains available when the browser provides no font loading API', async () => {
  for (const fontSet of [undefined, null, {}]) await assert.doesNotReject(loadGameFonts(fontSet));
});
