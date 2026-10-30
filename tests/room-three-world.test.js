import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {WORLD, OBJECTS} from '../src/room-three/world.js';
import {buildReachability, isWalkable, nearbyTarget, segmentClear} from '../src/core/world-geometry.js';

const anchors = {
  'preparation-record': [520, 1550], 'supply-journal': [1280, 1310],
  'command-telegrams': [2020, 520], 'opening-letter': [2700, 880], 'north-report': [2780, 1250],
  'archive-cabinet': [820, 1500], 'cargo-yard': [1510, 1030], 'command-tent': [2280, 620],
  'radio-station': [2670, 1510], chest: [2390, 1740], door: [3010, 1800],
  'supply-crates': [1160, 1650], 'road-tools': [1740, 830], 'field-lamp': [2200, 1440],
};

test('rear-supply camp preserves all fourteen agreed anchors and safe southwest entry', () => {
  assert.equal(WORLD.width, 3200); assert.equal(WORLD.height, 2000);
  assert.equal(OBJECTS, WORLD.objects); assert.equal(OBJECTS.length, 14);
  assert.deepEqual(new Set(OBJECTS.map(object => object.id)), new Set(Object.keys(anchors)));
  assert.deepEqual(WORLD.checkpoints, [{id: 'entry', x: 300, y: 1720}]);
  assert.deepEqual(WORLD.exits, []);
  for (const object of OBJECTS) {
    assert.deepEqual([object.x, object.y], anchors[object.id]); assert.equal(object.radius, 110);
    assert.equal(isWalkable(WORLD, object.x, object.y), false, `${object.id} sits over physical equipment`);
  }
  assert.equal(nearbyTarget(WORLD, WORLD.checkpoints[0], OBJECTS), null);
});

test('each interaction has several reachable nearest-selected E approaches with body clearance', () => {
  const reachable = buildReachability(WORLD, WORLD.checkpoints[0]);
  assert.ok(reachable.size > 18000, 'open camp has broad connected walkable space');
  for (const object of OBJECTS) {
    assert.equal(reachable.canReach(object), true, `${object.id}: connected to entry`);
    const approaches = reachable.points.filter(point => Math.hypot(point.x - object.x, point.y - object.y) <= 110 &&
      nearbyTarget(WORLD, point, OBJECTS)?.id === object.id);
    assert.ok(approaches.length >= 12, `${object.id}: multiple E approaches, not a single precise pixel`);
    for (const point of approaches) assert.equal(isWalkable(WORLD, point.x, point.y), true);
  }
});

test('depot aisles, road, command and dispatch areas connect while equipment and berms block movement', () => {
  for (const point of [[-1, 100], [3200, 500], [100, 2000], [100, 20], [500, 1240], [1793, 450], [2500, 1190], [NaN, 10]]) {
    assert.equal(isWalkable(WORLD, ...point), false, `${point}`);
  }
  for (const [from, to] of [
    [{x: 300, y: 1720}, {x: 1000, y: 1720}],
    [{x: 1120, y: 1470}, {x: 1430, y: 1400}],
    [{x: 1430, y: 1400}, {x: 1730, y: 1150}],
    [{x: 1700, y: 710}, {x: 2450, y: 710}],
    [{x: 2580, y: 1650}, {x: 3060, y: 1650}],
  ]) assert.equal(segmentClear(WORLD, from, to), true, `open supply path ${JSON.stringify(from)}`);
  assert.equal(segmentClear(WORLD, {x: 1750, y: 450}, {x: 1850, y: 450}), false);
  assert.equal(nearbyTarget(WORLD, {x: 1750, y: 450}, [{id: 'across-berm', x: 1850, y: 450, radius: 110}]), null);
  assert.equal(nearbyTarget(WORLD, {x: 820, y: 1611}, OBJECTS), null, '111px cannot remotely select the cabinet');
  assert.equal(nearbyTarget(WORLD, {x: 2390, y: 1860}, OBJECTS), null, '120px cannot select the chest');
  assert.equal(nearbyTarget(WORLD, {x: 2390, y: 1820}, OBJECTS)?.id, 'chest');
});

test('six supply illustrations are local standalone text-free vectors with no active or remote content', () => {
  const images = ['bicycle', 'porters', 'artillery', 'rice', 'ammunition', 'engineers'];
  const contents = images.map(id => readFileSync(new URL(`../assets/room-three/${id}.svg`, import.meta.url), 'utf8'));
  assert.equal(new Set(contents).size, 6);
  for (const svg of contents) {
    assert.match(svg, /viewBox="0 0 600 400"/); assert.match(svg, /fill="#f2e8cf"/);
    assert.doesNotMatch(svg, /<(?:text|script|image|foreignObject)\b|(?:href|onload|onclick)=|url\(https?:/i);
    assert.match(svg, /<path\s+d="[^"]+"/); assert.match(svg, /<\/svg>\s*$/);
  }
});
