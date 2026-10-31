// Paints one gate rect onto a Phaser Graphics object; looks depend on gate.style (see src/core/area-gates.js).
const BROWN = 0x8b7044, LIGHT = 0xceae6f, DARK = 0x4a3a24;

function bars(g, [x, y, w, h]) {
  g.fillStyle(BROWN, .95).fillRect(x, y, w, h);
  g.fillStyle(LIGHT, 1);
  if (h >= w) for (let yy = y + 6; yy < y + h - 3; yy += 22) g.fillRect(x, yy, w, 5);
  else for (let xx = x + 6; xx < x + w - 3; xx += 22) g.fillRect(xx, y, 5, h);
  g.lineStyle(2, DARK, .8).strokeRect(x, y, w, h);
}

function rope(g, [x, y, w, h]) {
  const horizontal = w >= h, post = 14, step = 70;
  g.lineStyle(5, 0x7a2a2a, 1);
  const length = horizontal ? w : h;
  for (let at = 0; at <= length; at += step) {
    const px = horizontal ? x + at : x + w / 2, py = horizontal ? y + h / 2 : y + at;
    g.fillStyle(0xc9a347, 1).fillCircle(px, py, post / 2);
    if (at + step <= length) g.lineBetween(px, py, horizontal ? px + step : px, horizontal ? py : py + step);
  }
  const lx = horizontal ? x + w : x + w / 2, ly = horizontal ? y + h / 2 : y + h;
  g.fillStyle(0xc9a347, 1).fillCircle(lx, ly, post / 2);
  g.lineBetween(horizontal ? x + Math.floor(length / step) * step : lx, horizontal ? ly : y + Math.floor(length / step) * step, lx, ly);
}

function curtain(g, [x, y, w, h]) {
  g.fillStyle(0x6f3b38, .94).fillRect(x, y, w, h);
  g.fillStyle(0x8c514b, .9);
  const along = w >= h;
  for (let at = 0; at < (along ? w : h); at += 20) along ? g.fillRect(x + at, y, 9, h) : g.fillRect(x, y + at, w, 9);
  g.lineStyle(2, DARK, .7).strokeRect(x, y, w, h);
}

function barrier(g, [x, y, w, h]) {
  g.fillStyle(0xf1ead6, 1).fillRect(x, y, w, h);
  g.fillStyle(0xa8352a, 1);
  const along = w >= h, size = Math.max(14, Math.min(w, h));
  for (let at = 0; at < (along ? w : h); at += size * 2) {
    const len = Math.min(size, (along ? w : h) - at);
    along ? g.fillRect(x + at, y, len, h) : g.fillRect(x, y + at, w, len);
  }
  g.lineStyle(2, DARK, .9).strokeRect(x, y, w, h);
}

function door(g, [x, y, w, h]) {
  g.fillStyle(0x6b5232, 1).fillRect(x, y, w, h);
  g.lineStyle(2, LIGHT, .9);
  for (let xx = x + 30; xx < x + w; xx += 30) g.lineBetween(xx, y, xx, y + h);
  g.fillStyle(0xd9b86a, 1).fillCircle(x + w - 14, y + h / 2, 5);
  g.lineStyle(2, DARK, .9).strokeRect(x, y, w, h);
}

const PAINTERS = {bars, rope, curtain, barrier, door};
export function paintGate(graphics, gate) {
  const paint = PAINTERS[gate.style] || bars;
  for (const rect of gate.rects) paint(graphics, rect);
}
