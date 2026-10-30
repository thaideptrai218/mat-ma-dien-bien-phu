const C = {earth: '#56583e', road: '#9b8861', ink: '#263c38', olive: '#758064', wood: '#80633f',
  paper: '#eddfb6', copper: '#c49b65'};
function rect(c, x, y, w, h, color) { c.fillStyle = color; c.fillRect(x, y, w, h); }
function path(c, points, color, width = 2, fill = false) {
  c.beginPath(); c.strokeStyle = color; c.fillStyle = color; c.lineWidth = width;
  points.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y));
  if (fill) { c.closePath(); c.fill(); } else c.stroke();
}
function circle(c, x, y, r, color, width = 0) {
  c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2);
  if (width) { c.strokeStyle = color; c.lineWidth = width; c.stroke(); }
  else { c.fillStyle = color; c.fill(); }
}
function label(c, text, x, y, size = 20, color = C.paper) {
  c.fillStyle = color; c.textAlign = 'center'; c.font = `600 ${size}px "DBP Text", serif`; c.fillText(text, x, y);
}
function paper(c, x, y, angle = -.08) {
  c.save(); c.translate(x, y); c.rotate(angle);
  rect(c, -28, -22, 60, 49, '#1d2c2555'); rect(c, -32, -26, 60, 49, C.paper);
  for (let row = -16; row < 16; row += 7) rect(c, -23, row, 40 - (row % 3) * 3, 2, '#887451');
  c.restore();
}
function lamp(c, x, y) {
  const glow = c.createRadialGradient(x, y, 2, x, y, 130);
  glow.addColorStop(0, '#f4d89144'); glow.addColorStop(1, '#f4d89100');
  c.fillStyle = glow; c.fillRect(x - 130, y - 130, 260, 260);
  rect(c, x - 14, y + 18, 28, 6, C.ink); rect(c, x - 10, y - 17, 20, 34, C.copper);
  rect(c, x - 6, y - 12, 12, 25, '#ffe4a4');
  path(c, [[x - 10, y - 19], [x - 7, y - 30], [x + 7, y - 30], [x + 10, y - 19]], C.ink, 3);
}
function wheel(c, x, y, r) {
  circle(c, x, y, r, C.ink, 5); circle(c, x, y, 4, C.copper);
  for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) path(c, [[x, y], [x + Math.cos(a) * r, y + Math.sin(a) * r]], C.copper, 1);
}
function worker(c, x, y, angle = 0, load = false) {
  c.save(); c.translate(x, y); c.rotate(angle);
  path(c, [[-8, 12], [-14, 37], [-4, 41], [3, 17], [13, 39], [23, 36], [10, 9]], C.ink, 7);
  path(c, [[-11, -14], [12, -14], [15, 15], [-12, 15]], C.olive, 1, true);
  path(c, [[-10, -10], [-26, 8], [-42, 7]], C.ink, 8);
  circle(c, 1, -25, 12, '#ba9c70');
  path(c, [[-20, -28], [0, -44], [21, -27]], C.paper, 1, true);
  if (load) {
    path(c, [[-63, -11], [53, -22]], C.wood, 4);
    for (const side of [-51, 41]) {
      path(c, [[side, -14], [side - 6, 22]], C.copper, 2);
      path(c, [[side - 24, 21], [side + 20, 21], [side + 14, 52], [side - 18, 52]], '#b59b6a', 1, true);
      for (let row = 28; row < 49; row += 7) path(c, [[side - 18, row], [side + 14, row]], C.wood, 1);
    }
  }
  c.restore();
}
function furniture(c, p) {
  const {x, y, w, h, kind} = p;
  if (kind === 'lamp') { lamp(c, x + w / 2, y + h / 2); return; }
  rect(c, x + 8, y + 10, w, h, '#1f302655'); rect(c, x, y, w, h, C.ink);
  rect(c, x + 5, y + 5, w - 10, h - 10, C.wood);
  if (kind === 'paper' || kind === 'command') {
    rect(c, x + 10, y + 9, w - 20, h - 18, '#9c916d');
    paper(c, x + w * .34, y + h / 2); paper(c, x + w * .7, y + h / 2, .08);
    if (p.station) label(c, p.station, x + w - 17, y + h - 10, 12, C.ink);
  } else if (kind === 'radio') {
    rect(c, x + 12, y + 10, w - 24, h - 20, C.olive);
    rect(c, x + 23, y + 20, 55, 29, C.ink); rect(c, x + 29, y + 25, 41, 9, C.paper);
    for (let row = 0; row < 5; row++) rect(c, x + 96, y + 21 + row * 7, 34, 2, C.ink);
    circle(c, x + 49, y + 58, 6, C.copper); path(c, [[x + w - 19, y + 6], [x + w - 37, y - 55]], C.copper, 3);
  } else if (kind === 'archive') {
    for (let col = 0; col < 3; col++) {
      rect(c, x + 10 + col * 58, y + 10, 52, h - 20, '#7b8062');
      rect(c, x + 21 + col * 58, y + 27, 30, 11, C.paper); rect(c, x + 27 + col * 58, y + 48, 19, 5, C.ink);
    }
  } else if (kind === 'chest') {
    for (let row = 20; row < h - 8; row += 23) rect(c, x + 8, y + row, w - 16, 2, '#443c2c');
    for (const offset of [25, w - 37]) rect(c, x + offset, y + 5, 12, h - 10, C.copper);
    rect(c, x + w / 2 - 14, y + h / 2 - 14, 28, 30, C.copper);
    rect(c, x + w / 2 - 3, y + h / 2 - 6, 6, 14, C.ink);
  } else if (kind === 'tools') {
    for (let i = 0; i < 3; i++) {
      path(c, [[x + 18 + i * 37, y + 49], [x + 47 + i * 37, y + 15]], C.paper, 5);
      path(c, [[x + 34 + i * 37, y + 13], [x + 59 + i * 37, y + 9], [x + 52 + i * 37, y + 30]], '#a7ada0', 1, true);
    }
  } else if (kind === 'door') {
    rect(c, x + 9, y + 8, w - 18, h - 16, '#66795c'); path(c, [[x + 22, y + 18], [x + w - 22, y + h - 18]], C.copper, 4);
  } else {
    for (let col = 10; col < w - 20; col += 49) {
      rect(c, x + col, y + 10, Math.min(43, w - col - 8), h - 20, kind === 'cargo' ? '#b8a478' : '#987748');
      path(c, [[x + col + 4, y + 15], [x + col + 35, y + h - 15]], '#544b34', 2);
      rect(c, x + col + 11, y + h / 2 - 5, 20, 10, C.paper);
    }
    if (kind === 'cart') { wheel(c, x + 25, y + h, 17); wheel(c, x + w - 25, y + h, 17); }
  }
}

export function createRoomThreeArtwork(scene, world, key = 'room-three-camp') {
  if (scene.textures.exists(key)) scene.textures.remove(key);
  const canvas = document.createElement('canvas'); canvas.width = world.width; canvas.height = world.height;
  const c = canvas.getContext('2d'); rect(c, 0, 0, world.width, world.height, C.earth);
  // Repeated contour strokes and scattered grass make this an outdoor hillside camp.
  for (let y = 80; y < 1900; y += 62) for (let x = 70; x < 3100; x += 77) {
    const n = (x * 17 + y * 11) % 23;
    path(c, [[x, y], [x + 8, y - 7 - n / 3], [x + 12, y + 2]], '#a0a07329', 2);
  }
  for (let i = 0; i < 10; i++) path(c, [[80, 110 + i * 49], [390, 70 + i * 56], [710, 110 + i * 60], [940, 190 + i * 62]], '#bdaf7a28', 3);
  const road = [[210, 1760], [720, 1670], [950, 1560], [1430, 1400], [1730, 1150], [1850, 960], [1920, 750], [2500, 1010], [2870, 1550], [3030, 1840]];
  c.lineJoin = 'round'; c.lineCap = 'round'; path(c, road, '#394933', 240); path(c, road, C.road, 210);
  for (const shift of [-55, 55]) path(c, road.map(([x, y]) => [x + shift, y]), '#796f4d', 4);
  path(c, [[1940, 740], [2150, 460], [2560, 440]], '#9b8861', 135);
  // Depot tarpaulin and the command tent are open-sided; only marked furniture is solid.
  path(c, [[280, 1290], [1020, 1290], [1090, 1600], [350, 1630]], '#344e4570', 1, true);
  path(c, [[1830, 380], [2440, 380], [2520, 680], [1900, 680]], '#344a3e80', 1, true);
  path(c, [[1830, 380], [2150, 300], [2440, 380]], '#7f8a68', 1, true);
  path(c, [[1855, 397], [2465, 655]], '#a8ae8270', 3);
  for (const [x, y] of [[300, 1310], [1040, 1590], [1850, 395], [2470, 665]]) { circle(c, x, y, 7, C.wood); }
  // A small transport vignette shows the work behind the papers without claiming geography.
  wheel(c, 1080, 1060, 31); wheel(c, 1190, 1060, 31);
  path(c, [[1080, 1060], [1110, 1010], [1160, 1060], [1080, 1060], [1150, 1010], [1190, 1060]], C.ink, 5);
  rect(c, 1078, 965, 115, 65, '#b39a67'); path(c, [[1095, 966], [1095, 1028], [1174, 1028], [1174, 966]], C.wood, 3);
  worker(c, 1240, 1030, -.2); worker(c, 920, 1430, .12, true);
  // Static rope team and wheeled artillery sit beside the uphill road.
  wheel(c, 1210, 500, 42); wheel(c, 1285, 485, 42);
  path(c, [[1235, 480], [1100, 435]], C.ink, 29); path(c, [[1250, 505], [1360, 565]], C.wood, 15);
  path(c, [[1240, 505], [1455, 620], [1580, 600]], C.paper, 3);
  worker(c, 1450, 600, -.5); worker(c, 1550, 638, -.5);
  world.walls.forEach(([x, y, w, h]) => {
    rect(c, x + 5, y + 6, w, h, '#263c3266'); rect(c, x, y, w, h, '#465b43');
    for (let offset = 5; offset < Math.max(w, h); offset += 25) circle(c, w > h ? x + offset : x + w / 2, w > h ? y + h / 2 : y + offset, 10, '#718064');
  });
  world.props.forEach(prop => furniture(c, prop));
  label(c, 'KHO HẬU PHƯƠNG', 690, 1370, 25); label(c, 'ĐƯỜNG VẬN CHUYỂN', 1390, 920, 23);
  label(c, 'LỀU CHỈ HUY', 2160, 360, 25); label(c, 'TRẠM NHẬN TIN', 2780, 1370, 23);
  label(c, 'PHÒNG 3 · MẬT MÃ HẬU PHƯƠNG', 1550, 1880, 29);
  label(c, 'BỐ CỤC HỌC TẬP · KHÔNG PHẢI BẢN ĐỒ TÁC CHIẾN', 1550, 1910, 15, '#d5ceb0');
  for (const object of world.objects.filter(item => item.type !== 'prop')) {
    const y = object.y + (object.id === 'chest' ? 105 : 80);
    c.font = '600 18px "DBP Text", serif'; const width = c.measureText(object.label).width + 25;
    rect(c, object.x - width / 2, y - 23, width, 33, '#233c32ee'); label(c, object.label, object.x, y, 18);
  }
  scene.textures.addCanvas(key, canvas); return key;
}
