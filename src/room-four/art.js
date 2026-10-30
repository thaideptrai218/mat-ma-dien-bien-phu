const C = {floor: '#3d4947', edge: '#253531', wood: '#78664d', paper: '#ead9ae', gold: '#d8b66d'};
function rect(ctx, x, y, w, h, color) { ctx.fillStyle = color; ctx.fillRect(x, y, w, h); }
function line(ctx, points, color, width = 2) {
  ctx.beginPath(); ctx.strokeStyle = color; ctx.lineWidth = width;
  points.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke();
}
function label(ctx, text, x, y, size = 20, color = C.paper) {
  ctx.font = `600 ${size}px "DBP Text", serif`; ctx.textAlign = 'center'; ctx.fillStyle = color; ctx.fillText(text, x, y);
}
function paper(ctx, x, y, w = 48, h = 56, angle = -.08) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(angle);
  rect(ctx, -w / 2 + 4, -h / 2 + 4, w, h, '#10221f66');
  rect(ctx, -w / 2, -h / 2, w, h, C.paper);
  for (let row = 10; row < h - 7; row += 7) rect(ctx, -w / 2 + 7, -h / 2 + row, w - 15 - (row % 3) * 2, 1, '#73644d88');
  ctx.restore();
}
function lantern(ctx, x, y) {
  const glow = ctx.createRadialGradient(x, y, 5, x, y, 150);
  glow.addColorStop(0, '#ffd68a40'); glow.addColorStop(1, '#ffd68a00');
  ctx.fillStyle = glow; ctx.fillRect(x - 150, y - 150, 300, 300);
  rect(ctx, x - 15, y + 17, 30, 6, '#242e26'); rect(ctx, x - 11, y - 21, 22, 37, '#ab8e53');
  rect(ctx, x - 6, y - 16, 12, 27, '#ffe2a3');
  line(ctx, [[x - 11, y - 24], [x - 9, y - 33], [x + 9, y - 33], [x + 11, y - 24]], '#232e28', 3);
}
function wall(ctx, [x, y, w, h]) {
  rect(ctx, x + 6, y + 10, w, h, '#15292488'); rect(ctx, x, y, w, h, '#253a35');
  for (let bx = x + 3; bx < x + w; bx += 80) for (let by = y + 3; by < y + h; by += 38) {
    rect(ctx, bx, by, Math.min(76, x + w - bx - 3), Math.min(34, y + h - by - 3), '#66716a');
    rect(ctx, bx + 3, by + 3, Math.min(70, x + w - bx - 7), 3, '#8b90802e');
  }
}
function furniture(ctx, p) {
  const {x, y, w, h, kind} = p;
  if (kind === 'lamp') { lantern(ctx, x + w / 2, y + h / 2); return; }
  rect(ctx, x + 8, y + 12, w, h, '#15282377'); rect(ctx, x, y, w, h, C.edge);
  rect(ctx, x + 5, y + 5, w - 10, h - 10, C.wood);
  if (kind === 'case') {
    rect(ctx, x + 12, y + 10, w - 24, h - 23, '#a3ad8c');
    paper(ctx, x + 68, y + h / 2 - 5, 63, 46, -.06); paper(ctx, x + 145, y + h / 2 - 4, 54, 44, .08);
    rect(ctx, x + 13, y + 11, w - 26, 7, '#f9edc336');
    rect(ctx, x + w - 42, y + h - 27, 31, 19, '#355b56'); label(ctx, p.station, x + w - 27, y + h - 12, 13);
  } else if (kind === 'cipher') {
    rect(ctx, x + 16, y + 11, w - 32, h - 23, '#bfb48c');
    for (let row = 0; row < 6; row++) for (let col = 0; col < 5; col++) {
      rect(ctx, x + 69 + col * 12, y + 12 + row * 10, 10, 8, '#e4d4a6');
    }
    label(ctx, p.station, x + 33, y + 57, 30, '#4a4f3a');
    rect(ctx, x + w - 28, y + 26, 6, 37, '#3c3f2f');
  } else if (kind === 'crossword') {
    rect(ctx, x + 12, y + 10, w - 24, h - 20, '#d7c99d');
    const starts = [8, 7, 8, 0, 8, 3, 5], lengths = [8, 6, 6, 16, 5, 7, 12];
    starts.forEach((start, row) => {
      for (let col = start; col < start + lengths[row]; col++) rect(ctx, x + 36 + col * 12, y + 12 + row * 9, 10, 7, '#657161');
    });
  } else if (kind === 'chest') {
    rect(ctx, x + 8, y + 9, w - 16, h - 18, '#94774b');
    for (let row = 26; row < h - 12; row += 22) rect(ctx, x + 8, y + row, w - 16, 2, '#493e2c');
    for (const offset of [25, w - 37]) rect(ctx, x + offset, y + 5, 12, h - 10, '#bb9a58');
    rect(ctx, x + w / 2 - 13, y + h / 2 - 13, 26, 29, '#d4b771');
    rect(ctx, x + w / 2 - 3, y + h / 2 - 6, 6, 14, '#3f4937');
  } else if (kind === 'shelf') {
    const vertical = h > w;
    for (let offset = 12; offset < (vertical ? h : w) - 20; offset += 26) {
      const bx = vertical ? x + 11 : x + offset, by = vertical ? y + offset : y + 11;
      rect(ctx, bx, by, vertical ? w - 22 : 20, vertical ? 20 : h - 22, ['#a98d61', '#556e64', '#8d6049'][Math.floor(offset / 26) % 3]);
      rect(ctx, bx + 4, by + 6, 12, 5, '#dacb9b');
    }
  } else if (kind === 'radio') {
    rect(ctx, x + 10, y + 10, w - 20, h - 20, '#5e7063'); rect(ctx, x + 20, y + 22, 47, 29, '#293f36');
    rect(ctx, x + 27, y + 29, 32, 9, '#d1bd79');
    for (let row = 0; row < 5; row++) rect(ctx, x + 82, y + 21 + row * 7, 35, 2, '#263d33');
    line(ctx, [[x + w - 18, y + 5], [x + w - 36, y - 45]], '#c5bc8d', 3);
  } else if (kind === 'door') {
    rect(ctx, x + 8, y, w - 16, h - 6, '#3c6359');
    for (let col = 20; col < w - 10; col += 25) rect(ctx, x + col, y + 5, 2, h - 15, '#1c3932');
    rect(ctx, x + w - 31, y + 22, 9, 9, C.gold);
  }
}

export function createRoomFourArtwork(scene, world, key = 'room-four-archive') {
  if (scene.textures.exists(key)) scene.textures.remove(key);
  const canvas = document.createElement('canvas'); canvas.width = world.width; canvas.height = world.height;
  const ctx = canvas.getContext('2d'); rect(ctx, 0, 0, world.width, world.height, C.floor);
  for (let y = 48; y < world.height - 48; y += 80) for (let x = 48; x < world.width - 48; x += 112) {
    const shade = (x * 11 + y * 7) % 17;
    rect(ctx, x + 2, y + 2, 108, 76, `rgb(${56 + shade},${67 + shade},${62 + shade})`);
    line(ctx, [[x + 12, y + 69], [x + 64, y + 69]], '#bdc1a812', 1);
  }
  // A faded diagram on the archive floor evokes siege maps without asserting geography.
  rect(ctx, 760, 470, 1280, 960, '#c4b4800c');
  for (let offset = 0; offset < 4; offset++) {
    line(ctx, [[790 + offset * 18, 1320], [920 + offset * 18, 980], [1000 + offset * 18, 820],
      [900 + offset * 18, 690], [1220 + offset * 18, 650]], '#b5a77516', 4);
    line(ctx, [[2010 - offset * 18, 1380], [1900 - offset * 18, 930], [1810 - offset * 18, 770],
      [1880 - offset * 18, 690], [1570 - offset * 18, 650]], '#b5a77516', 4);
  }
  rect(ctx, 800, 144, 1200, 245, '#819a8c1c');
  ctx.strokeStyle = '#d6b86d55'; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(1400, 950, 225, 230, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.strokeStyle = '#d6b86d22'; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(1400, 950, 244, 249, 0, 0, Math.PI * 2); ctx.stroke();
  for (const p of world.props) furniture(ctx, p);
  world.walls.forEach(bounds => wall(ctx, bounds));
  for (const [x, y] of [[780, 240], [2020, 240], [780, 1440], [2170, 1450], [1240, 740], [1560, 740]]) lantern(ctx, x, y);
  paper(ctx, 1015, 1305, 33, 43, .16); paper(ctx, 2155, 1000, 30, 40, -.2);
  label(ctx, 'PHÒNG 4 · NHỮNG NGÀY QUYẾT ĐỊNH', 1400, 1720, 26, '#ded4b2');
  label(ctx, 'PHÒNG LƯU TRỮ · TRÂM', 1400, 1470, 21, '#b8c6b1');
  label(ctx, 'GÓC GIẢI MÃ', 1400, 365, 23, '#d4bd7c');
  label(ctx, 'BỐ CỤC HỌC TẬP · KHÔNG PHẢI BẢN ĐỒ TÁC CHIẾN', 1400, 1694, 14, '#aeb9a2');
  for (const object of world.objects.filter(item => item.type !== 'prop')) {
    const y = object.id === 'door' ? 142 : object.y + (object.id === 'chest' ? 105 : 84);
    ctx.font = '600 18px "DBP Text", serif';
    const w = Math.max(140, ctx.measureText(object.label).width + 26);
    rect(ctx, object.x - w / 2, y - 22, w, 32, '#1c342eee'); label(ctx, object.label, object.x, y, 18);
  }
  const vignette = ctx.createRadialGradient(1400, 900, 500, 1400, 900, 1720);
  vignette.addColorStop(0, '#0d252000'); vignette.addColorStop(1, '#0d252075');
  ctx.fillStyle = vignette; ctx.fillRect(0, 0, world.width, world.height);
  scene.textures.addCanvas(key, canvas); return key;
}
