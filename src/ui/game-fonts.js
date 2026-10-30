export const GAME_FONTS = Object.freeze({ display: 'DBP Display', body: 'DBP Text', handwriting: 'DBP Hand' });

const faces = [
  '400 20px "DBP Text"', '600 20px "DBP Text"', '700 20px "DBP Text"',
  '400 20px "DBP Display"', '700 20px "DBP Display"', 'italic 400 20px "DBP Display"',
  '400 21px "DBP Hand"',
];

// Room labels are baked into Canvas textures only once, after these faces settle.
// A failed local font request must not prevent the player from starting the game.
export function loadGameFonts(fontSet) {
  if (!fontSet?.load) return Promise.resolve([]);
  return Promise.allSettled(faces.map(face => Promise.resolve().then(() =>
    fontSet.load(face, 'Điện Biên Phủ · Những ngày quyết định · Nắm đấm thép'))));
}
