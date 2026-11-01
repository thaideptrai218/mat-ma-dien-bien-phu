import {CHARACTER_FRAME, characterSpec, characterTexture, characterClips, characterAtlasLayout,
  characterIdleFrame, characterAnimationKey} from './character-atlas.js';
import {activeHero} from '../heroes/hero-profiles.js';
export {CHARACTER_FRAME, characterAnimationKey, characterTexture} from './character-atlas.js';

// Sheet + measurement file per sprite (literal URLs so the bundler emits both).
const SHEETS = {
  long: {sheet:new URL('../../assets/characters/long/motion-sheet-with-idle.png', import.meta.url).href,
    manifest:new URL('../../assets/characters/long/manifest-with-idle.json', import.meta.url).href},
  quang: {sheet:new URL('../../assets/characters/quang-reference/motion-sheet.png', import.meta.url).href,
    manifest:new URL('../../assets/characters/quang-reference/manifest.json', import.meta.url).href},
};
const sourceKey = () => `${characterTexture()}-source`, manifestKey = () => `${characterTexture()}-manifest`;

export function preloadCharacter(scene) {
  if (scene.textures.exists(characterTexture())) return;
  const keys = [sourceKey(), manifestKey()], files = SHEETS[activeHero().sprite];
  scene.characterLoadFailure = file => {
    if (!scene.tornDown && keys.includes(file.key)) scene.characterError = `Không tải được hình nhân vật ${activeHero().name}.`;
  };
  scene.load.on('loaderror', scene.characterLoadFailure);
  if (!scene.textures.exists(keys[0])) scene.load.image(keys[0], files.sheet);
  if (!scene.cache.json.exists(keys[1])) scene.load.json(keys[1], files.manifest);
}

function packCharacter(scene) {
  const SOURCE_KEY = sourceKey(), MANIFEST_KEY = manifestKey(), CHARACTER_TEXTURE = characterTexture(), CHARACTER_COLUMNS = characterSpec().columns;
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
  const texture = characterTexture();
  if (!scene.textures.exists(texture)) packCharacter(scene);
  for (const clip of characterClips()) {
    if (scene.anims.exists(clip.key)) continue;
    scene.anims.create({...clip, frames:clip.frames.map(frame => ({key:texture, frame}))});
  }
  return true;
}

/** Stop on a complete standing pose immediately when movement input ends. */
export function snapCharacterToIdle(player, facing) {
  const frame = characterIdleFrame(facing);
  if (Number(player.frame.name) === frame && !player.anims.isPlaying) return;
  player.anims.stop();
  player.setFrame(frame);
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
