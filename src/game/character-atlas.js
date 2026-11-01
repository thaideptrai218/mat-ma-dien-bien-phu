import {activeHero} from '../heroes/hero-profiles.js';

export const CHARACTER_DIRECTIONS = Object.freeze(['down', 'left', 'right', 'up']);
export const CHARACTER_FRAME = Object.freeze({width:160, height:192, scale:.5,
  originX:.5, originY:176/192, bodyWidth:48, bodyHeight:32, bodyOffsetX:56, bodyOffsetY:160});

// One sprite sheet per hero: 4 direction rows × `columns` poses. Long's 17th column is a full standing pose;
// Quang's 1st column is his standing pose.
const SPECS = Object.freeze({
  long: Object.freeze({texture:'long-hero', columns:17, rates:{idle:8, walk:10, run:15},
    poses:Object.freeze({idle:[16], walk:[0,1,2,3,4,5,6], run:[8,9,10,11,12,13,14]})}),
  quang: Object.freeze({texture:'quang-hero', columns:8, rates:{idle:8, walk:8, run:12},
    poses:Object.freeze({idle:[0], walk:[1,2,3,4], run:[5,6,7,6]})}),
});

/** Sprite configuration of the hero chosen for this run. */
export const characterSpec = () => SPECS[activeHero().sprite];
export const characterTexture = () => characterSpec().texture;

export function characterAnimationKey(facing, motion = 'idle', reduced = false) {
  const spec = characterSpec();
  if (!CHARACTER_DIRECTIONS.includes(facing) || !Object.hasOwn(spec.poses, motion)) throw new Error('Invalid character animation.');
  return `${spec.texture}-${facing}-${reduced ? 'idle' : motion}`;
}

export function characterClips() {
  const spec = characterSpec();
  return CHARACTER_DIRECTIONS.flatMap((facing, row) => Object.entries(spec.poses).map(([motion, columns]) => ({
    key:characterAnimationKey(facing, motion), frames:columns.map(column => row*spec.columns+column),
    frameRate:spec.rates[motion], repeat:motion === 'idle' ? 0 : -1,
  })));
}

export function characterIdleFrame(facing) {
  const row = CHARACTER_DIRECTIONS.indexOf(facing), spec = characterSpec();
  if (row < 0) throw new Error('Invalid character direction.');
  return row * spec.columns + spec.poses.idle[0];
}

/** One measured transform retains contact/flight height and body scale across every pose. */
export function characterAtlasLayout(manifest, imageWidth, imageHeight) {
  const {columns:COLUMNS} = characterSpec();
  const {columns, rows, sourceWidth, sourceHeight, crop, anchor} = manifest || {};
  const finite = value => Number.isFinite(value);
  if (columns !== COLUMNS || rows !== 4 || sourceWidth !== imageWidth || sourceHeight !== imageHeight ||
      !Number.isInteger(imageWidth/COLUMNS) || !Number.isInteger(imageHeight/4)) throw new Error('Invalid character sheet dimensions.');
  const tileWidth = imageWidth/COLUMNS, tileHeight = imageHeight/4;
  if (!crop || !anchor || ![crop.x,crop.y,crop.width,crop.height,anchor.x,anchor.y].every(finite) ||
      ![crop.x,crop.y,crop.width,crop.height].every(Number.isInteger) || crop.x < 0 || crop.y < 0 ||
      crop.width <= 0 || crop.height <= 0 || crop.x+crop.width > tileWidth || crop.y+crop.height > tileHeight ||
      anchor.x <= crop.x || anchor.x >= crop.x+crop.width || anchor.y <= crop.y || anchor.y > tileHeight)
    throw new Error('Invalid character crop or ground anchor.');
  // Keep two output pixels clear around every pose, including the foot contact baseline.
  const {width:frameWidth, height:frameHeight} = CHARACTER_FRAME;
  const centerX=frameWidth/2, halfWidth=centerX-2;
  const scale = Math.min(halfWidth/(anchor.x-crop.x), halfWidth/(crop.x+crop.width-anchor.x),
    174/(anchor.y-crop.y), crop.y+crop.height > anchor.y ? 14/(crop.y+crop.height-anchor.y) : Infinity);
  return {width:frameWidth*COLUMNS, height:frameHeight*4, tileWidth, tileHeight, scale,
    frames:Array.from({length:COLUMNS*4}, (_, index) => ({
      source:{x:(index%COLUMNS)*tileWidth+crop.x, y:Math.floor(index/COLUMNS)*tileHeight+crop.y, width:crop.width, height:crop.height},
      target:{x:(index%COLUMNS)*frameWidth+centerX+(crop.x-anchor.x)*scale,
        y:Math.floor(index/COLUMNS)*frameHeight+176+(crop.y-anchor.y)*scale, width:crop.width*scale, height:crop.height*scale},
    }))};
}
