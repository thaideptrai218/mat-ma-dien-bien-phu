import Phaser from 'phaser';
import {PLAYER_BODY, collisionRects, nearbyTarget} from '../core/world-geometry.js';
import {registerCharacterAnimations, characterAnimationKey, CHARACTER_FRAME} from '../game/character-animation.js';
import {WORLD} from './world.js';
import {createRoomOneArtwork} from './art.js';
import {bindRoomOneInput, movementVelocity} from './input.js';

export class RoomOneScene extends Phaser.Scene {
  constructor(callbacks = {}, {world = WORLD, artFactory = createRoomOneArtwork,
    sceneKey = 'room-one', textureKey = 'room-one-archive', initialGoal = 'letter'} = {}) {
    super({key: sceneKey});
    this.callbacks = callbacks; this.map = world; this.heldKeys = new Set();
    this.artFactory = artFactory; this.textureKey = textureKey;
    this.facing = 'up'; this.sprinting = false; this.walking = false;
    this.windowFocused = true; this.nearby = null; this.goalId = initialGoal;
    this.lastPosition = null; this.didPhysicsStep = false; this.lastPublish = -Infinity;
  }

  create() {
    if (this.tornDown) return;
    registerCharacterAnimations(this);
    this.add.image(0, 0, this.artFactory(this, this.map, this.textureKey)).setOrigin(0).setDepth(-20);
    this.solids = this.physics.add.staticGroup();
    for (const [x, y, w, h] of collisionRects(this.map)) {
      const zone = this.add.zone(x + w / 2, y + h / 2, w, h);
      this.physics.add.existing(zone, true); this.solids.add(zone);
    }
    const spawn = this.map.checkpoints[0];
    this.shadow = this.add.ellipse(spawn.x, spawn.y + 4, 34, 13, 0x18221b, .5).setDepth(2);
    this.player = this.physics.add.sprite(spawn.x, spawn.y, 'minh-normal', 15)
      .setOrigin(CHARACTER_FRAME.originX, CHARACTER_FRAME.originY).setDepth(5);
    this.player.body.setSize(PLAYER_BODY.width, PLAYER_BODY.height, false)
      .setOffset(CHARACTER_FRAME.bodyOffsetX, CHARACTER_FRAME.bodyOffsetY);
    this.player.setCollideWorldBounds(true); this.player.body.setMaxVelocity(390, 390);
    this.physics.world.setBounds(0, 0, this.map.width, this.map.height);
    this.collider = this.physics.add.collider(this.player, this.solids);
    this.nameLabel = this.add.text(spawn.x, spawn.y + 23, 'QUANG', {
      fontFamily: '"DBP Text", serif', fontSize: '13px', color: '#f6e7bb',
      backgroundColor: '#21392dd9', padding: {x: 7, y: 3},
    }).setOrigin(.5, 0).setDepth(9);
    this.goalMarker = this.add.graphics().setDepth(3);
    this.nearbyMarker = this.add.graphics().setDepth(3);
    this.prompt = this.add.text(0, 0, '', {
      fontFamily: '"DBP Text", serif', fontSize: '18px', color: '#fff1c9',
      backgroundColor: '#172d24ee', padding: {x: 13, y: 9},
    }).setOrigin(.5, 1).setDepth(12).setVisible(false);
    const camera = this.cameras.main;
    camera.setBounds(0, 0, this.map.width, this.map.height).setRoundPixels(true);
    camera.startFollow(this.player, true, .14, .14); camera.setDeadzone(100, 60);
    camera.centerOn(spawn.x, spawn.y);
    this.windowFocused = document.hasFocus(); this.unbindInput = bindRoomOneInput(this);
    this.lastPosition = {x: spawn.x, y: spawn.y};
    this.markPhysicsStep = () => { this.didPhysicsStep = true; };
    this.physics.world.on(Phaser.Physics.Arcade.Events.WORLD_STEP, this.markPhysicsStep);
    this.events.on(Phaser.Scenes.Events.POST_UPDATE, this.afterPhysics, this);
    this.resizeCamera = size => camera.setSize(size.width, size.height);
    this.scale.on(Phaser.Scale.Events.RESIZE, this.resizeCamera);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.teardown());
    this.player.play(characterAnimationKey(this.facing, false));
    this.setGoal(this.goalId); this.updateNearby(); this.publishPosition(true);
    this.callbacks.onReady?.(this);
  }

  motionUnavailable() {
    return Boolean(this.callbacks.isPaused?.() || document.hidden || !this.windowFocused ||
      document.activeElement !== this.game.canvas);
  }

  focus() {
    this.clearKeys();
    if (!this.callbacks.isPaused?.()) this.game?.canvas?.focus({preventScroll: true});
  }

  clearKeys() {
    this.heldKeys.clear(); this.sprinting = false; this.walking = false;
    this.player?.body?.setVelocity(0, 0);
    if (this.player?.anims) {
      this.lastPosition = {x: this.player.x, y: this.player.y};
      this.player.play(characterAnimationKey(this.facing, false), true);
      this.player.anims.timeScale = 1;
    }
    this.callbacks.audio?.reportMotion({distance: 0, blocked: true});
  }

  update() {
    if (!this.player) return;
    if (this.motionUnavailable()) { this.clearKeys(); return; }
    const velocity = movementVelocity(this.heldKeys);
    this.sprinting = velocity.sprinting;
    this.player.setVelocity(velocity.x, velocity.y);
  }

  afterPhysics() {
    if (!this.player || !this.didPhysicsStep) return;
    this.didPhysicsStep = false;
    const point = {x: this.player.x, y: this.player.y}, previous = this.lastPosition || point;
    const dx = point.x - previous.x, dy = point.y - previous.y;
    const distance = this.motionUnavailable() ? 0 : Math.hypot(dx, dy);
    this.walking = distance > .01;
    if (this.walking) this.facing = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up');
    this.player.play(characterAnimationKey(this.facing, this.walking), true);
    this.player.anims.timeScale = this.sprinting && this.walking ? 1.5 : 1;
    this.shadow.setPosition(point.x, point.y + 4);
    this.nameLabel.setPosition(point.x, point.y + 23);
    this.lastPosition = point;
    this.callbacks.audio?.reportMotion({distance, blocked: !this.walking, sprinting: this.sprinting});
    this.updateNearby(); this.publishPosition();
  }

  updateNearby() {
    if (!this.player) return;
    const target = nearbyTarget(this.map, this.player, this.map.objects);
    if (this.nearby?.id === target?.id) return;
    this.nearby = target; this.nearbyMarker.clear();
    this.prompt.setVisible(Boolean(target));
    if (target) {
      this.nearbyMarker.lineStyle(2, 0xf4d896, .9).strokeCircle(target.x, target.y, 42);
      this.prompt.setText(`E  ·  ${target.label}`).setPosition(target.x, Math.max(88, target.y - 76));
    }
    this.publishPosition(true);
  }

  interactNearby() {
    if (this.motionUnavailable()) return;
    this.updateNearby();
    if (!this.nearby) return;
    const id = this.nearby.id; this.clearKeys(); this.callbacks.onInteract?.(id);
  }

  setGoal(id) {
    this.goalId = id;
    if (!this.goalMarker || this.paintedGoalId === id) return;
    this.paintedGoalId = id;
    this.goalMarker.clear();
    const object = this.map.objects.find(item => item.id === id);
    if (!object) return;
    this.goalMarker.lineStyle(4, 0xebc66f, .9).strokeCircle(object.x, object.y, 58);
    this.goalMarker.lineStyle(1, 0xebc66f, .35).strokeCircle(object.x, object.y, 66);
    this.goalMarker.fillStyle(0xf4d28a).fillTriangle(object.x - 10, object.y - 76, object.x + 10, object.y - 76, object.x, object.y - 63);
  }

  getPosition() {
    const spawn = this.map.checkpoints[0];
    return Object.freeze({x: this.player?.x ?? spawn.x, y: this.player?.y ?? spawn.y,
      nearbyId: this.nearby?.id || null, sprinting: this.sprinting});
  }

  getSnapshot() {
    const camera = this.cameras?.main;
    return { ...this.getPosition(), player: this.getPosition(), world: this.map,
      camera: camera ? {x: camera.scrollX, y: camera.scrollY, width: camera.width, height: camera.height} : null,
      walking: this.walking, facing: this.facing, goalId: this.goalId};
  }

  publishPosition(force = false) {
    const now = this.time?.now || 0;
    if (!force && now - this.lastPublish < 60) return;
    this.lastPublish = now; this.callbacks.onPosition?.(this.getPosition());
  }

  resetPosition() {
    if (!this.player) return;
    this.clearKeys(); const spawn = this.map.checkpoints[0];
    this.player.body.reset(spawn.x, spawn.y); this.lastPosition = {x: spawn.x, y: spawn.y};
    this.shadow.setPosition(spawn.x, spawn.y + 4); this.nameLabel.setPosition(spawn.x, spawn.y + 23);
    this.cameras.main.centerOn(spawn.x, spawn.y); this.updateNearby(); this.publishPosition(true);
  }

  teardown() {
    if (this.tornDown) return;
    this.tornDown = true;
    this.unbindInput?.(); this.unbindInput = null;
    this.events?.off(Phaser.Scenes.Events.POST_UPDATE, this.afterPhysics, this);
    this.physics?.world?.off(Phaser.Physics.Arcade.Events.WORLD_STEP, this.markPhysicsStep);
    this.scale?.off(Phaser.Scale.Events.RESIZE, this.resizeCamera);
    if (this.collider?.world) this.collider.destroy();
    this.collider = null;
    if (this.solids?.scene) { this.solids.clear(true, true); this.solids.destroy(); }
    this.solids = null;
    if (this.textures?.exists(this.textureKey)) this.textures.remove(this.textureKey);
  }
}
