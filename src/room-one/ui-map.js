import { WORLD } from './world.js';
import { element } from './ui-elements.js';

const NS = 'http://www.w3.org/2000/svg';
function shape(tag, attributes, text) {
  const node = document.createElementNS(NS, tag);
  for (const [key, value] of Object.entries(attributes)) node.setAttribute(key, String(value));
  if (text) node.textContent = text;
  return node;
}

export function createRoomMap({ position = {}, goal = {}, state = {} } = {}, compact = false, world = WORLD) {
  const wrapper = element('div', compact ? 'r1-map r1-map-compact' : 'r1-map');
  const svg = shape('svg', { viewBox: `0 0 ${world.width} ${world.height}`, role: 'img', 'aria-label': 'Sơ đồ căn phòng: vị trí Quang, vật dụng và mục tiêu hiện tại' });
  svg.append(shape('rect', { x: 0, y: 0, width: world.width, height: world.height, fill: '#d9ccaa' }));
  svg.append(shape('rect', { x: 35, y: 35, width: world.width - 70, height: world.height - 70, fill: '#ece1c6', stroke: '#9e8967', 'stroke-width': 12 }));
  for (const wall of world.walls || []) {
    const [x, y, width, height] = Array.isArray(wall) ? wall : [wall.x, wall.y, wall.w || wall.width, wall.h || wall.height];
    svg.append(shape('rect', { x, y, width, height, fill: '#4b5747' }));
  }
  for (const prop of world.props || []) {
    svg.append(shape('rect', { x: prop.x, y: prop.y, width: prop.w || prop.width, height: prop.h || prop.height, rx: 8, fill: prop.solid ? '#8f7656' : '#c3b592', stroke: '#7b654c', 'stroke-width': 5 }));
  }
  const seen = new Set([...(state.seenObjectIds || []), ...(state.collectedNoteIds || [])]);
  for (const object of world.objects || []) {
    const current = goal.id === object.id;
    if (current) svg.append(shape('circle', { cx: object.x, cy: object.y, r: 90, fill: 'none', stroke: '#9c572e', 'stroke-width': 13, 'stroke-dasharray': '22 12' }));
    svg.append(shape('circle', { cx: object.x, cy: object.y, r: compact ? 30 : 24, fill: current ? '#9c572e' : seen.has(object.id) ? '#355547' : '#8b806b', stroke: '#f7edd8', 'stroke-width': 6 }));
    const label = object.label.match(/^[VP]-\d+/)?.[0] || object.label;
    if (!compact) svg.append(shape('text', { x: object.x, y: object.y + 65, 'text-anchor': 'middle', fill: '#233b30', 'font-size': 33, 'font-family': 'DBP Text, serif', 'font-weight': 600 }, label));
  }
  if (Number.isFinite(position.x) && Number.isFinite(position.y)) {
    svg.append(shape('circle', { cx: position.x, cy: position.y, r: compact ? 45 : 34, fill: '#224e73', stroke: '#fff8e6', 'stroke-width': 12 }));
    if (!compact) svg.append(shape('text', { x: position.x, y: position.y - 65, 'text-anchor': 'middle', fill: '#224e73', 'font-size': 35, 'font-family': 'DBP Text, serif', 'font-weight': 700 }, 'Quang'));
  }
  wrapper.append(svg);
  if (!compact) {
    const legend = element('p', 'r1-map-legend', '● Quang   ◉ Mục tiêu   ● Đã xem   ● Vật dụng');
    wrapper.append(legend, element('p', 'r1-muted', 'Sơ đồ kể chuyện của căn phòng. Dùng WASD hoặc phím mũi tên để đi đến vật dụng.'));
  }
  return wrapper;
}
