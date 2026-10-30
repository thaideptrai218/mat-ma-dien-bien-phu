function rect(ctx, x, y, w, h, color) {ctx.fillStyle = color; ctx.fillRect(x, y, w, h);}
function label(ctx, text, x, y, size = 21, color = '#e9d7a5') {
  ctx.font = `600 ${size}px "DBP Text", serif`; ctx.textAlign = 'center'; ctx.fillStyle = color; ctx.fillText(text, x, y);
}

export function createRoomFiveArtwork(scene, world, key = 'room-five-reconstruction') {
  if (scene.textures.exists(key)) scene.textures.remove(key);
  const canvas = document.createElement('canvas'); canvas.width = world.width; canvas.height = world.height;
  const ctx = canvas.getContext('2d');
  rect(ctx, 0, 0, world.width, world.height, '#3c4b43');
  for (let y = 48; y < world.height - 48; y += 80) for (let x = 48; x < world.width - 48; x += 100) {
    rect(ctx, x + 2, y + 2, 96, 76, (x + y) % 160 === 48 ? '#49574a' : '#435245');
    rect(ctx, x + 6, y + 8, 88, 2, '#82917222');
  }
  rect(ctx, 910, 140, 180, 1100, '#b9a36518');
  for (const x of [915, 1081]) rect(ctx, x, 140, 4, 1100, '#c5ad6744');
  for (const [x, y, w, h] of world.walls) {
    rect(ctx, x, y, w, h, '#26372f');
    rect(ctx, x + 5, y + 5, Math.max(3, w - 10), Math.max(3, h - 10), '#756e52');
  }
  for (const p of world.props) {
    const {x, y, w, h, kind} = p;
    rect(ctx, x + 8, y + 12, w, h, '#15282066');
    rect(ctx, x, y, w, h, '#2c382b'); rect(ctx, x + 6, y + 6, w - 12, h - 12, '#85714e');
    if (kind === 'assembly') {
      rect(ctx, x + 14, y + 14, w - 28, h - 28, '#cabb8b');
      for (let i = 0; i < 4; i++) {
        const px = x + 70 + (i % 2) * 100, py = y + 30 + Math.floor(i / 2) * 55;
        rect(ctx, px, py, 91, 48, ['#a28555', '#626f4e', '#5d7664', '#a5936b'][i]);
        label(ctx, ['I', 'II', 'III', 'IV'][i], px + 45, py + 32, 23, '#f6e4b5');
      }
    } else if (kind === 'door') {
      rect(ctx, x + 12, y + 4, w - 24, h - 8, '#4d6150');
      rect(ctx, x + w / 2 - 2, y + 6, 4, h - 12, '#233b30');
      rect(ctx, x + w / 2 - 18, y + 31, 8, 12, '#d0b573');
      rect(ctx, x + w / 2 + 10, y + 31, 8, 12, '#d0b573');
    } else if (kind === 'reflection') {
      const glow = ctx.createRadialGradient(x + w / 2, y + h / 2, 4, x + w / 2, y + h / 2, 200);
      glow.addColorStop(0, '#f8d88b55'); glow.addColorStop(1, '#f8d88b00');
      ctx.fillStyle = glow; ctx.fillRect(x - 110, y - 110, w + 220, h + 220);
      rect(ctx, x + 18, y + 14, w - 36, h - 28, '#e5d3a3');
      label(ctx, 'LẮNG NGHE', x + w / 2, y + 55, 19, '#4b593e');
    } else if (kind === 'lamp') {
      rect(ctx, x + 13, y - 10, 20, h, '#ceb575'); rect(ctx, x + 18, y - 5, 10, 27, '#ffe1a1');
    } else if (kind === 'satchel') {
      rect(ctx, x + 12, y + 12, w - 24, h - 20, '#72765a');
      rect(ctx, x + 42, y - 7, 48, 10, '#a39a68');
      rect(ctx, x + 47, y + 21, 35, 24, '#a59561');
    } else {
      for (let by = y + 14; by < y + h - 12; by += 28) for (let bx = x + 12; bx < x + w - 12; bx += 24) {
        rect(ctx, bx, by, 17, Math.min(22, y + h - by - 8), ['#a1986c', '#66735a', '#996e4d'][bx % 3]);
      }
    }
  }
  label(ctx, 'CĂN PHÒNG CUỐI · BỨC TRANH HÒA BÌNH', 1000, 520, 28);
  label(ctx, 'BỐ CỤC HƯ CẤU CHO TRÒ CHƠI HỌC TẬP', 1000, 565, 17, '#b4b397');
  for (const o of world.objects) {
    const w = Math.max(160, o.label.length * 10 + 30);
    rect(ctx, o.x - w / 2, o.y + 98, w, 36, '#223b30dd');
    label(ctx, o.label, o.x, o.y + 123, 18);
  }
  scene.textures.addCanvas(key, canvas); return key;
}
