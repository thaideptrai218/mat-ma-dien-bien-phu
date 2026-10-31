export const CHARACTER_TEXTURE = 'long-hero';
// Motion sheet: 16 columns per direction row, walk cycle in 0-7 and run cycle in 8-15.
export const CHARACTER_COLUMNS = 16;
export const CHARACTER_DIRECTIONS = Object.freeze(['down', 'left', 'right', 'up']);
export const CHARACTER_FRAME = Object.freeze({width:160, height:192, scale:.5,
  originX:.5, originY:176/192, bodyWidth:48, bodyHeight:32, bodyOffsetX:56, bodyOffsetY:160});
const poses = Object.freeze({idle:[0], walk:[0,1,2,3,4,5,6,7], run:[8,9,10,11,12,13,14,15]});

export function characterAnimationKey(facing, motion = 'idle', reduced = false) {
  if (!CHARACTER_DIRECTIONS.includes(facing) || !Object.hasOwn(poses, motion)) throw new Error('Invalid character animation.');
  return `${CHARACTER_TEXTURE}-${facing}-${reduced ? 'idle' : motion}`;
}

export function characterClips() {
  return CHARACTER_DIRECTIONS.flatMap((facing, row) => Object.entries(poses).map(([motion, columns]) => ({
    key:characterAnimationKey(facing, motion), frames:columns.map(column => row*CHARACTER_COLUMNS+column),
    frameRate:motion === 'run' ? 12 : 8, repeat:motion === 'idle' ? 0 : -1,
  })));
}

/** One measured transform retains contact/flight height and body scale across every pose. */
export function characterAtlasLayout(manifest, imageWidth, imageHeight) {
  const {columns, rows, sourceWidth, sourceHeight, crop, anchor} = manifest || {};
  const finite = value => Number.isFinite(value);
  if (columns !== CHARACTER_COLUMNS || rows !== 4 || sourceWidth !== imageWidth || sourceHeight !== imageHeight ||
      !Number.isInteger(imageWidth/CHARACTER_COLUMNS) || !Number.isInteger(imageHeight/4)) throw new Error('Invalid character sheet dimensions.');
  const tileWidth = imageWidth/CHARACTER_COLUMNS, tileHeight = imageHeight/4;
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
  return {width:frameWidth*CHARACTER_COLUMNS, height:frameHeight*4, tileWidth, tileHeight, scale,
    frames:Array.from({length:CHARACTER_COLUMNS*4}, (_, index) => ({
      source:{x:(index%CHARACTER_COLUMNS)*tileWidth+crop.x, y:Math.floor(index/CHARACTER_COLUMNS)*tileHeight+crop.y, width:crop.width, height:crop.height},
      target:{x:(index%CHARACTER_COLUMNS)*frameWidth+centerX+(crop.x-anchor.x)*scale,
        y:Math.floor(index/CHARACTER_COLUMNS)*frameHeight+176+(crop.y-anchor.y)*scale, width:crop.width*scale, height:crop.height*scale},
    }))};
}
