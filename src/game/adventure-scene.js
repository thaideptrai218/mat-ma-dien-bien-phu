import Phaser from 'phaser';
import {getMap} from '../content/world-data.js';
import {PLAYER_BODY,normalizedDirection,resolveCheckpoint,collisionRects,nearbyTarget,segmentClear} from '../core/world-geometry.js';
import {registerCharacterAnimations,characterAnimationKey,CHARACTER_FRAME} from './character-animation.js';
import {createRoomTexture} from './room-art.js';
import {bindSceneInput} from './scene-input.js';

export class AdventureScene extends Phaser.Scene{
  constructor(callbacks={}){
    super({key:'adventure'});this.callbacks=callbacks;this.heldKeys=new Set();this.inputBlocked=false;
    this.settings={reducedMotion:false,brightness:'normal'};this.facing='down';this.walking=false;this.nearby=null;
    this.windowFocused=true;this.map=null;this.lastPosition=null;this.checkpointZones=new Set();this.gates=[];
  }
  create(){
    registerCharacterAnimations(this);
    this.player=this.physics.add.sprite(0,0,'quang-normal',0).setOrigin(CHARACTER_FRAME.originX,CHARACTER_FRAME.originY);
    this.player.body.setSize(PLAYER_BODY.width,PLAYER_BODY.height,false).setOffset(CHARACTER_FRAME.bodyOffsetX,CHARACTER_FRAME.bodyOffsetY);
    this.player.setCollideWorldBounds(true);this.player.body.setMaxVelocity(260,260);
    this.nameLabel=this.add.text(0,0,'QUANG',{fontFamily:'Segoe UI, Tahoma, sans-serif',fontSize:'15px',color:'#efdfb1'}).setOrigin(.5,0).setDepth(10);
    this.windowFocused=document.hasFocus();this.unbindInput=bindSceneInput(this);
    this.didPhysicsStep=false;this.markPhysicsStep=()=>{this.didPhysicsStep=true;};
    this.physics.world.on(Phaser.Physics.Arcade.Events.WORLD_STEP,this.markPhysicsStep);
    this.events.on(Phaser.Scenes.Events.POST_UPDATE,this.afterPhysics,this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>{
      this.unbindInput?.();this.events.off(Phaser.Scenes.Events.POST_UPDATE,this.afterPhysics,this);
      this.physics.world.off(Phaser.Physics.Arcade.Events.WORLD_STEP,this.markPhysicsStep);this.clearMap();
    });
    const state=this.callbacks.getState?.()||{};this.applySettings(state.settings||{});
    this.enterChapter(state.chapterId||'museum',state.checkpointId||'entry');this.callbacks.onReady?.(this);
  }
  clearMap(){
    this.wallCollider?.destroy();this.wallCollider=null;this.solids?.clear(true,true);this.solids?.destroy();this.solids=null;
    this.gates.forEach(gate=>gate.art.destroy());this.gates=[];
    this.background?.destroy();this.background=null;
    if(this.mapTextureKey&&this.textures.exists(this.mapTextureKey))this.textures.remove(this.mapTextureKey);
    this.mapTextureKey=null;
  }
  enterChapter(chapterId,checkpointId='entry'){
    const map=getMap(chapterId),checkpoint=resolveCheckpoint(map,checkpointId);if(!map||!checkpoint||!this.player)return false;
    this.clearMotion();this.clearMap();this.map=map;this.mapTextureKey=createRoomTexture(this,map);
    this.background=this.add.image(0,0,this.mapTextureKey).setOrigin(0).setDepth(-10);
    this.solids=this.physics.add.staticGroup();
    const addBody=([x,y,w,h])=>{const zone=this.add.zone(x+w/2,y+h/2,w,h);this.physics.add.existing(zone,true);this.solids.add(zone);return zone;};
    collisionRects(map).forEach(addBody);
    for(const exit of map.exits){
      if(!exit.gate)continue;
      const [x,y,w,h]=exit.gate,zone=addBody(exit.gate),art=this.add.graphics().setDepth(2);
      art.fillStyle(0x8b7044,1).fillRect(x-4,y,w+8,h);art.fillStyle(0xceae6f,1);
      for(let yy=y+8;yy<y+h;yy+=26)art.fillRect(x,yy,w,5);
      this.gates.push({exit,zone,art});
    }
    this.wallCollider=this.physics.add.collider(this.player,this.solids);
    this.physics.world.setBounds(0,0,map.width,map.height);
    this.player.body.reset(checkpoint.x,checkpoint.y);this.player.setDepth(5);this.lastPosition={x:checkpoint.x,y:checkpoint.y};
    const camera=this.cameras.main;camera.setBounds(0,0,map.width,map.height);camera.setRoundPixels(true);
    camera.startFollow(this.player,true,this.settings.reducedMotion?1:.15,this.settings.reducedMotion?1:.15);
    camera.setDeadzone(160,90);camera.centerOn(checkpoint.x,checkpoint.y);
    this.facing='down';this.playPose(false);this.nameLabel.setPosition(checkpoint.x,checkpoint.y+18);
    this.checkpointZones=this.zonesAt(this.player);this.nearby=null;
    this.refreshProgress(this.callbacks.getState?.()||{});this.updateNearby();return true;
  }
  gateLocked(exit,state){
    return Boolean((exit.requiresRoomId&&!state.completedRoomIds?.includes(exit.requiresRoomId))||
      (exit.requiresBeatId&&!state.completedBeatIds?.includes(exit.requiresBeatId)));
  }
  refreshProgress(state){
    for(const gate of this.gates){const locked=this.gateLocked(gate.exit,state);gate.zone.body.enable=locked;gate.art.setVisible(locked);}
    if(this.map)this.updateNearby();
  }
  setInputBlocked(value){this.inputBlocked=Boolean(value);this.clearMotion();}
  applySettings(settings={}){
    this.settings={...this.settings,...settings};
    if(this.cameras?.main)this.cameras.main.setLerp(this.settings.reducedMotion?1:.15,this.settings.reducedMotion?1:.15);
    if(this.player)this.playPose(this.walking);
  }
  motionUnavailable(){return this.inputBlocked||document.hidden||!this.windowFocused||document.activeElement!==this.game.canvas;}
  clearMotion(){
    this.heldKeys.clear();this.player?.body?.setVelocity(0,0);this.walking=false;
    if(this.player){this.lastPosition={x:this.player.x,y:this.player.y};this.playPose(false);}
    this.callbacks.onMotion?.({distance:0,facing:this.facing,blocked:true});
  }
  playPose(walking){
    this.walking=walking;this.player.play(characterAnimationKey(this.facing,walking,this.settings.reducedMotion),true);
  }
  update(){
    if(!this.player||!this.map)return;
    if(this.motionUnavailable()){this.player.setVelocity(0,0);return;}
    const held=this.heldKeys;
    const x=Number(held.has('KeyD')||held.has('ArrowRight'))-Number(held.has('KeyA')||held.has('ArrowLeft'));
    const y=Number(held.has('KeyS')||held.has('ArrowDown'))-Number(held.has('KeyW')||held.has('ArrowUp'));
    const velocity=normalizedDirection(x,y,260);this.player.setVelocity(velocity.x,velocity.y);
  }
  afterPhysics(){
    if(!this.player||!this.map)return;
    // Rendering can run faster than the fixed 60Hz physics clock. A render-only
    // frame must not reset a real walk pose or the distance-based step cadence.
    if(!this.didPhysicsStep){
      if(this.motionUnavailable()||(!this.player.body.velocity.x&&!this.player.body.velocity.y)){
        this.playPose(false);this.callbacks.onMotion?.({distance:0,facing:this.facing,blocked:true});
      }
      return;
    }
    this.didPhysicsStep=false;
    const point={x:this.player.x,y:this.player.y},previous=this.lastPosition||point;
    const dx=point.x-previous.x,dy=point.y-previous.y,distance=this.motionUnavailable()?0:Math.hypot(dx,dy);
    if(distance>.01){this.facing=Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up');this.playPose(true);}
    else this.playPose(false);
    this.lastPosition=point;this.nameLabel.setPosition(point.x,point.y+18);
    this.callbacks.onMotion?.({distance,facing:this.facing,blocked:distance<=.01});
    if(!this.motionUnavailable()){
      const zones=this.zonesAt(point),state=this.callbacks.getState?.()||{};
      for(const checkpointId of zones)if(!this.checkpointZones.has(checkpointId)&&state.checkpointId!==checkpointId)
        this.callbacks.onCheckpoint?.({chapterId:this.map.id,checkpointId});
      this.checkpointZones=zones;
    }
    this.updateNearby();
  }
  zonesAt(point){
    return new Set(this.map.checkpoints.filter(checkpoint=>Math.hypot(point.x-checkpoint.x,point.y-checkpoint.y)<=checkpoint.radius&&
      segmentClear(this.map,point,checkpoint)).map(checkpoint=>checkpoint.id));
  }
  updateNearby(){
    const state=this.callbacks.getState?.()||{};
    const target=nearbyTarget(this.map,this.player,[...this.map.interactables,...this.map.exits]);
    const next=target?Object.freeze({...target,locked:target.type==='exit'&&this.gateLocked(target,state)}):null;
    if(this.nearby?.id!==next?.id||this.nearby?.locked!==next?.locked){this.nearby=next;this.callbacks.onNearby?.(next);}
  }
  interactNearby(){
    if(this.motionUnavailable()||!this.nearby)return;
    this.clearMotion();const target=this.nearby;
    if(target.type==='exit')this.callbacks.onExit?.(target);else this.callbacks.onInteract?.(target);
  }
  getSnapshot(){
    const camera=this.cameras?.main;
    return Object.freeze({chapterId:this.map?.id||null,map:this.map?Object.freeze({id:this.map.id,width:this.map.width,height:this.map.height}):null,
      player:this.player?Object.freeze({x:this.player.x,y:this.player.y,bodyWidth:this.player.body.width,bodyHeight:this.player.body.height}):null,
      camera:camera?Object.freeze({x:camera.scrollX,y:camera.scrollY,width:camera.width,height:camera.height}):null,
      nearby:this.nearby?Object.freeze({...this.nearby}):null,facing:this.facing,walking:this.walking,
      frame:this.walking?(this.player.anims.currentFrame?.index||1)-1:0,inputBlocked:this.inputBlocked,paused:this.player?this.motionUnavailable():true});
  }
}
