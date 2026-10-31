import {CHARACTER_TEXTURE, CHARACTER_FRAME, CHARACTER_COLUMNS, characterClips, characterAtlasLayout} from './character-atlas.js';
export {CHARACTER_TEXTURE, CHARACTER_FRAME, characterAnimationKey} from './character-atlas.js';
const SOURCE_KEY = `${CHARACTER_TEXTURE}-source`, MANIFEST_KEY = `${CHARACTER_TEXTURE}-manifest`;
const sheetUrl = new URL('../../assets/characters/long/motion-sheet.png', import.meta.url).href;
const manifestUrl = new URL('../../assets/characters/long/manifest.json', import.meta.url).href;

export function preloadCharacter(scene) {
  if (scene.textures.exists(CHARACTER_TEXTURE)) return;
  scene.characterLoadFailure = file => {
    if (!scene.tornDown && [SOURCE_KEY, MANIFEST_KEY].includes(file.key)) scene.characterError = 'Không tải được hình nhân vật Long.';
  };
  scene.load.on('loaderror', scene.characterLoadFailure);
  if (!scene.textures.exists(SOURCE_KEY)) scene.load.image(SOURCE_KEY, sheetUrl);
  if (!scene.cache.json.exists(MANIFEST_KEY)) scene.load.json(MANIFEST_KEY, manifestUrl);
}

function packCharacter(scene) {
  if (!scene.textures.exists(SOURCE_KEY)) throw new Error('Character image is missing.');
  const image = scene.textures.get(SOURCE_KEY).getSourceImage();
  const manifest = scene.cache.json.get(MANIFEST_KEY);
  const layout = characterAtlasLayout(manifest, image.width, image.height);
  const source = document.createElement('canvas'); source.width = image.width; source.height = image.height;
  const sourceContext = source.getContext('2d', {willReadFrequently:true});
  if (!sourceContext) throw new Error('Canvas is unavailable.');
  sourceContext.drawImage(image, 0, 0);
  const rgba = sourceContext.getImageData(0, 0, image.width, image.height).data;
  for (let row=0; row<4; row++) for (let column=0; column<CHARACTER_COLUMNS; column++) {
    let visible = false;
    for (let y=0; y<layout.tileHeight; y++) for (let x=0; x<layout.tileWidth; x++) {
      const alpha = rgba[((row*layout.tileHeight+y)*image.width+column*layout.tileWidth+x)*4+3];
      visible ||= alpha > 0;
      if (alpha && (x === 0 || y === 0 || x === layout.tileWidth-1 || y === layout.tileHeight-1))
        throw new Error('Character poses need transparent margins.');
      const crop = manifest.crop;
      if (alpha && (x < crop.x || x >= crop.x+crop.width || y < crop.y || y >= crop.y+crop.height))
        throw new Error('Character crop would clip a pose.');
    }
    if (!visible) throw new Error('Character pose is empty.');
  }
  const canvas = document.createElement('canvas'); canvas.width = layout.width; canvas.height = layout.height;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas is unavailable.');
  context.imageSmoothingEnabled = true; context.imageSmoothingQuality = 'high';
  for (const {source:s, target:t} of layout.frames)
    context.drawImage(image, s.x, s.y, s.width, s.height, t.x, t.y, t.width, t.height);
  scene.textures.addSpriteSheet(CHARACTER_TEXTURE, canvas, {frameWidth:CHARACTER_FRAME.width, frameHeight:CHARACTER_FRAME.height});
}

export function registerCharacterAnimations(scene) {
  if (scene.tornDown) return false;
  if (scene.characterError) throw new Error(scene.characterError);
  if (!scene.textures.exists(CHARACTER_TEXTURE)) packCharacter(scene);
  for (const clip of characterClips()) {
    if (scene.anims.exists(clip.key)) continue;
    scene.anims.create({...clip, frames:clip.frames.map(frame => ({key:CHARACTER_TEXTURE, frame}))});
  }
  return true;
}

export function releaseCharacterLoader(scene) {
  if (scene.characterLoadFailure) scene.load?.off('loaderror', scene.characterLoadFailure);
  scene.characterLoadFailure = null;
}

export function characterSnapshot(scene) {
  const player = scene.player;
  return player ? {texture:player.texture.key, frame:player.frame.name, motion:scene.motion,
    animation:player.anims.currentAnim?.key || null, reducedMotion:Boolean(scene.reducedMotion?.matches),
    scale:{x:player.scaleX,y:player.scaleY}, origin:{x:player.originX,y:player.originY},
    body:{width:player.body.width,height:player.body.height,x:player.body.x,y:player.body.y}} : null;
}
