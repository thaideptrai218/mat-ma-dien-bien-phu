import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {chapters, clues, beats, puzzles, sources, CLUE_IDS, PUZZLE_IDS} from '../src/room-two/content.js';
import {WORLD, OBJECTS} from '../src/room-two/world.js';
import {buildReachability} from '../src/core/world-geometry.js';

const base = new URL('../src/room-two/bao/', import.meta.url);
const snapshot = JSON.parse(fs.readFileSync(new URL('donor-snapshot.json', base)));
const provenance = JSON.parse(fs.readFileSync(new URL('provenance.json', base)));
const sha = value => createHash('sha256').update(value).digest('hex');

test('Room 2 selected registries and geometry deeply equal the captured current donor', () => {
  assert.deepEqual({chapters, clues, beats, puzzles, sources}, {
    chapters: snapshot.chapters, clues: snapshot.clues, beats: snapshot.beats,
    puzzles: snapshot.puzzles, sources: snapshot.sources});
  const {objects, ...world} = WORLD;
  assert.deepEqual(world, snapshot.map);
  assert.deepEqual(objects, [...snapshot.map.interactables, ...snapshot.map.exits]);
  assert.equal(CLUE_IDS.length, 7); assert.equal(PUZZLE_IDS.length, 4);
  assert.deepEqual(Object.keys(chapters), ['navarre-plan']);
  assert.equal(OBJECTS.filter(object => object.type === 'puzzle').length, 4);
});

test('Bảo renderer and artwork bodies remain byte-identical after imports are removed', () => {
  for (const source of ['src/ui/puzzle-view.js', 'src/ui/narrative-view.js', 'src/game/room-art.js']) {
    const entry = provenance.files[source];
    const text = fs.readFileSync(new URL(`../${entry.adaptedPath}`, base), 'utf8');
    assert.equal(sha(text.replace(/^import .*\r?\n/gm, '')), entry.bodySha256, source);
  }
  for (const source of ['src/ui/puzzle-styles.css', 'src/ui/narrative-styles.css']) {
    const entry = provenance.files[source];
    assert.equal(sha(fs.readFileSync(new URL(`../${entry.adaptedPath}`, base))), entry.sha256, source);
  }
});

test('original Room 2 clue, station and exit approaches are reachable with real body clearance', () => {
  const reachability = buildReachability(WORLD, WORLD.checkpoints[0], {lockedGates: true});
  for (const object of WORLD.interactables) assert.ok(reachability.canReach(object), object.id);
  const unlocked = buildReachability(WORLD, WORLD.checkpoints[0]);
  assert.ok(unlocked.canReach(WORLD.exits[0]));
});
