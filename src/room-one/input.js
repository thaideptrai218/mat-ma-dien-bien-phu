import {normalizedDirection} from '../core/world-geometry.js';

const movement = new Set(['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight', 'ShiftLeft', 'ShiftRight']);
const shortcuts = {KeyM: 'M', KeyN: 'N', KeyQ: 'Q', Escape: 'Escape'};

export function movementVelocity(keys) {
  const x = Number(keys.has('KeyD') || keys.has('ArrowRight')) - Number(keys.has('KeyA') || keys.has('ArrowLeft'));
  const y = Number(keys.has('KeyS') || keys.has('ArrowDown')) - Number(keys.has('KeyW') || keys.has('ArrowUp'));
  const sprinting = Boolean((x || y) && (keys.has('ShiftLeft') || keys.has('ShiftRight')));
  return {...normalizedDirection(x, y, sprinting ? 390 : 260), sprinting};
}

export function bindRoomOneInput(scene) {
  const canvas = scene.game.canvas, cleanup = [];
  const listen = (node, event, handler) => {
    node.addEventListener(event, handler);
    cleanup.push(() => node.removeEventListener(event, handler));
  };
  canvas.tabIndex = 0;
  canvas.setAttribute('role', 'region');
  canvas.setAttribute('aria-label', 'Phòng hồ sơ. WASD hoặc mũi tên để đi; Shift để chạy; E tương tác; M bản đồ; N sổ tay; Q nhiệm vụ. Tab để rời bản đồ.');
  scene.input.keyboard?.disableGlobalCapture();
  if (scene.input.keyboard) scene.input.keyboard.enabled = false;
  listen(canvas, 'pointerdown', () => scene.focus());
  listen(canvas, 'keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey || document.activeElement !== canvas) return;
    if (!movement.has(event.code) && event.code !== 'KeyE' && !shortcuts[event.code]) return;
    event.preventDefault();
    event.stopPropagation();
    if (scene.motionUnavailable()) { scene.clearKeys(); return; }
    if (movement.has(event.code)) {
      // Repeat events from a key held across a modal/focus boundary cannot rearm it.
      if (!event.repeat || scene.heldKeys.has(event.code)) scene.heldKeys.add(event.code);
      return;
    }
    if (event.repeat) return;
    if (event.code === 'KeyE') scene.interactNearby();
    else { scene.clearKeys(); scene.callbacks.onShortcut?.(shortcuts[event.code]); }
  });
  listen(window, 'keyup', event => scene.heldKeys.delete(event.code));
  listen(canvas, 'blur', () => scene.clearKeys());
  listen(canvas, 'focus', () => scene.clearKeys());
  listen(window, 'blur', () => { scene.windowFocused = false; scene.clearKeys(); });
  listen(window, 'focus', () => { scene.windowFocused = true; scene.clearKeys(); });
  listen(document, 'visibilitychange', () => scene.clearKeys());
  return () => { cleanup.forEach(remove => remove()); scene.clearKeys(); };
}
