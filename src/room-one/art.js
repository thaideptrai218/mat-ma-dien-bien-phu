const C = {floor: '#554f3b', wood: '#756043', edge: '#362f25', paper: '#e5d6ae', ink: '#4a503c', gold: '#e7c982'};
function rect(ctx, x, y, w, h, color) { ctx.fillStyle = color; ctx.fillRect(x, y, w, h); }
function line(ctx, points, color, width = 2) {
  ctx.strokeStyle = color; ctx.lineWidth = width; ctx.beginPath();
  points.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke();
}
function label(ctx, text, x, y, size = 20, color = C.paper, family = 'DBP Text') {
  ctx.font = `600 ${size}px "${family}", serif`; ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.fillText(text, x, y);
}
function paper(ctx, x, y, w = 40, h = 50, angle = -.06) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(angle);
  rect(ctx, -w / 2 + 3, -h / 2 + 4, w, h, '#211e2455');
  rect(ctx, -w / 2, -h / 2, w, h, C.paper);
  for (let i = 10; i < h - 7; i += 7) rect(ctx, -w / 2 + 6, -h / 2 + i, w - 13 - (i % 3) * 3, 1, '#71674b80');
  ctx.restore();
}
function lamp(ctx, x, y) {
  const glow = ctx.createRadialGradient(x, y, 12, x, y, 180);
  glow.addColorStop(0, '#f0c36b35'); glow.addColorStop(1, '#f0c36b00');
  ctx.fillStyle = glow; ctx.fillRect(x - 180, y - 180, 360, 360);
  rect(ctx, x - 15, y + 14, 30, 7, '#342e22'); rect(ctx, x - 4, y - 5, 8, 24, '#9f8650');
  rect(ctx, x - 12, y - 22, 24, 29, '#d4ba72'); rect(ctx, x - 7, y - 18, 14, 23, '#ffdfa0');
  line(ctx, [[x - 13, y - 24], [x - 8, y - 32], [x + 8, y - 32], [x + 13, y - 24]], '#312e25', 3);
}
function timber(ctx, [x, y, w, h]) {
  rect(ctx, x + 7, y + 12, w, h, '#171f1c66'); rect(ctx, x, y, w, h, '#363d30');
  if (w > h) {
    for (let bx = x; bx < x + w; bx += 108) {
      rect(ctx, bx + 2, y + 2, Math.min(104, x + w - bx - 2), h - 4, '#77674b');
      rect(ctx, bx + 5, y + 5, Math.min(98, x + w - bx - 5), 4, '#a18a61');
      line(ctx, [[bx + 12, y + h - 9], [Math.min(bx + 92, x + w), y + h - 9]], '#504933');
    }
  } else {
    for (let by = y; by < y + h; by += 58) {
      rect(ctx, x + 2, by + 2, w - 4, Math.min(54, y + h - by - 2), '#75664b');
      rect(ctx, x + 4, by + 4, 4, Math.min(49, y + h - by - 4), '#aa9164');
    }
  }
}
function furniture(ctx, p) {
  const {x, y, w, h, kind} = p;
  rect(ctx, x + 7, y + 12, w + 1, h + 4, '#18251e55');
  rect(ctx, x, y, w, h, C.edge); rect(ctx, x + 5, y + 4, w - 10, h - 10, C.wood);
  for (let i = 15; i < h - 10; i += 18) rect(ctx, x + 7, y + i, w - 14, 1, '#aa8e5a44');
  if (['desk', 'comparison', 'letter'].includes(kind)) {
    rect(ctx, x + 10, y + h - 9, w - 20, 6, '#b3915c');
    for (const offset of [14, w - 22]) rect(ctx, x + offset, y + h, 8, 10, C.edge);
    paper(ctx, x + w * .5, y + h * .46, kind === 'comparison' ? 68 : 48, 48);
    if (kind === 'desk') {
      paper(ctx, x + w * .72, y + h * .45, 28, 35, .15);
      rect(ctx, x + 15, y + 18, 28, 36, p.station.startsWith('v') ? '#66754e' : '#5c7180');
      label(ctx, p.station.toUpperCase(), x + 29, y + 42, 15, '#eee2be');
      rect(ctx, x + w - 22, y + 15, 7, 16, '#282c24');
    }
    if (kind === 'comparison') { paper(ctx, x + 40, y + 45, 28, 43, -.13); paper(ctx, x + 139, y + 44, 28, 43, .1); }
    if (kind === 'letter') { line(ctx, [[x + 30, y + 16], [x + 52, y + 31], [x + 74, y + 16]], '#8b6a46'); rect(ctx, x + 49, y + 27, 7, 7, '#984c36'); }
  } else if (kind === 'shelf') {
    const vertical = h > w;
    for (let i = 12; i < (vertical ? h : w) - 16; i += 23) {
      const px = vertical ? x + 12 : x + i, py = vertical ? y + i : y + 12;
      rect(ctx, px, py, vertical ? w - 24 : 17, vertical ? 17 : h - 24, ['#9b936a', '#63705a', '#9c6d4a'][Math.floor(i / 23) % 3]);
      rect(ctx, px + 3, py + 6, vertical ? 22 : 10, 4, '#e0cf9a');
    }
  } else if (kind === 'bunk') {
    rect(ctx, x + 8, y + 10, w - 16, h - 20, '#777e62'); rect(ctx, x + 14, y + 20, w - 28, 46, '#c4bb94');
    rect(ctx, x + 12, y + 83, w - 24, h - 104, '#69775e');
    line(ctx, [[x + 17, y + 98], [x + w - 17, y + 98]], '#a6ab85', 3);
  } else if (kind === 'chest' || kind === 'crate' || kind === 'supply') {
    for (const offset of [w * .2, w * .75]) rect(ctx, x + offset, y + 2, 10, h - 4, '#333c30');
    rect(ctx, x + w / 2 - 7, y + h - 19, 14, 15, '#c5a55d');
    if (kind === 'crate') line(ctx, [[x + 8, y + 9], [x + w - 8, y + h - 10], [x + w - 8, y + 9], [x + 8, y + h - 10]], '#b09360', 5);
    if (kind === 'supply') { rect(ctx, x + 22, y + 17, w - 44, h - 35, '#848269'); line(ctx, [[x + w / 2, y + 17], [x + w / 2, y + h - 18]], '#b7b18d', 3); }
  } else if (kind === 'drawer') {
    for (let i = 0; i < 3; i++) { rect(ctx, x + 7, y + 7 + i * 26, w - 14, 22, '#92774d'); rect(ctx, x + w / 2 - 12, y + 14 + i * 26, 24, 5, '#363f35'); }
  } else if (kind === 'map') {
    rect(ctx, x + 8, y + 7, w - 16, h - 14, '#c3bb8b');
    line(ctx, [[x + 28, y + 60], [x + 65, y + 20], [x + 113, y + 55], [x + 157, y + 19], [x + 191, y + 42]], '#627d6e', 7);
    for (let i = 20; i < w - 20; i += 36) line(ctx, [[x + i, y + 10], [x + i, y + h - 10]], '#867f5c55', 1);
    rect(ctx, x + 94, y + 25, 44, 27, '#9e4c37'); label(ctx, 'A-03', x + 116, y + 44, 15, '#fff0c3');
  } else if (kind === 'radio') {
    rect(ctx, x + 9, y + 9, w - 18, h - 19, '#526050'); rect(ctx, x + 20, y + 18, 51, 31, '#263930');
    for (let i = 0; i < 4; i++) rect(ctx, x + 83, y + 17 + 9 * i, 35, 2, '#24332a');
    rect(ctx, x + 30, y + 23, 26, 12, '#bdad68'); line(ctx, [[x + w - 15, y + 5], [x + w - 33, y - 55]], '#b4ae8c', 3);
  } else if (kind === 'door') {
    rect(ctx, x + 9, y, w - 18, h - 4, '#4d6658');
    for (let i = 20; i < w - 10; i += 23) rect(ctx, x + i, y + 5, 2, h - 14, '#223a31');
    rect(ctx, x + w - 30, y + 28, 8, 8, '#e1c785');
  } else if (kind === 'lamp') lamp(ctx, x + w / 2, y + 15);
}

export function createRoomOneArtwork(scene, world) {
  const key = 'room-one-archive';
  if (scene.textures.exists(key)) scene.textures.remove(key);
  const canvas = document.createElement('canvas'); canvas.width = world.width; canvas.height = world.height;
  const ctx = canvas.getContext('2d');
  rect(ctx, 0, 0, world.width, world.height, C.floor);
  for (let y = 48; y < 1552; y += 72) for (let x = 48; x < 2352; x += 96) {
    const shade = (x * 17 + y * 11) % 23;
    rect(ctx, x + 2, y + 2, 92, 68, `rgb(${78 + shade},${75 + shade},${55 + shade})`);
    rect(ctx, x + 8, y + 8, 30, 2, '#c3b77f0b');
  }
  // The green and slate archive mats distinguish the sides without obstructing travel.
  rect(ctx, 264, 414, 610, 690, '#52634c55'); rect(ctx, 1526, 414, 610, 690, '#4f627055');
  rect(ctx, 1080, 130, 240, 1340, '#b0a36a18');
  for (const x of [1084, 1312]) { rect(ctx, x, 130, 4, 1330, '#c4ac6955'); }
  for (let i = 0; i < 500; i++) {
    const x = 66 + ((i * 761) % 2268), y = 65 + ((i * 397) % 1460);
    rect(ctx, x, y, i % 3 + 1, 2, '#d1bd8020');
  }
  // Railway sleepers and drainage channels make the lower entry read as a bunker.
  for (let x = 310; x < 2100; x += 94) rect(ctx, x, 1474, 68, 9, '#3e3d2a');
  line(ctx, [[170, 1430], [2230, 1430]], '#343d2c', 4);
  for (const p of world.props) furniture(ctx, p);
  world.walls.forEach(wall => timber(ctx, wall));
  for (const [x, y] of [[280, 410], [1840, 430], [860, 220], [1540, 1275], [1170, 1110]]) lamp(ctx, x, y);
  paper(ctx, 755, 1134, 26, 35, .22); paper(ctx, 2070, 909, 32, 40, -.3);
  label(ctx, 'HỒ SƠ VIỆT NAM', 570, 425, 30, '#e0d5a5', 'DBP Display');
  label(ctx, 'HỒ SƠ PHÁP', 1828, 425, 30, '#d6dcce', 'DBP Display');
  label(ctx, 'TƯƠNG QUAN LỰC LƯỢNG · ĐẦU 1953', 1200, 1516, 20, '#cfc7a4');
  label(ctx, 'PHÒNG LƯU TRỮ', 1200, 185, 20, '#d4c48f', 'DBP Display');
  for (const object of world.objects.filter(o => o.type !== 'prop' && !o.gateId)) {
    const code = `${object.id[0].toUpperCase()}-0${object.id[1]}`;
    const text = object.type === 'document' ? `${code} · HỒ SƠ` : object.label;
    const y = object.id === 'door' ? 135 : object.y + (object.id === 'comparison' ? 91 : 85);
    const w = Math.max(116, ctx.measureText(text).width + 26);
    rect(ctx, object.x - w / 2, y - 24, w, 33, '#23352dde');
    label(ctx, text, object.x, y, 19, '#f0dfb2');
  }
  const vignette = ctx.createRadialGradient(1200, 800, 400, 1200, 800, 1480);
  vignette.addColorStop(0, '#101b1800'); vignette.addColorStop(1, '#101b1866');
  ctx.fillStyle = vignette; ctx.fillRect(0, 0, 2400, 1600);
  scene.textures.addCanvas(key, canvas); return key;
}
