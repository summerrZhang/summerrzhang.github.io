/**
 * Mouse NPC — simple version.
 * Idle in bounds; when cursor enters trigger radius, pick one cardinal direction
 * (away from cursor; diagonal = pick axis by which is larger), move a fixed distance, then stop.
 * Sprites: idle, horizontal (2 frames), vertical (5 frames).
 */
(function () {
  const FRAME_SIZE = 20;
  const BOUNDS = { left: 144, top: 130, right: 497, bottom: 337 };
  const TRIGGER_RADIUS = 50;
  const MOVE_DISTANCE = 48;   // total pixels to move in one burst
  const MOVE_SPEED = 2;      // pixels per frame while moving
  const HORIZONTAL_FRAMES = 2;
  const VERTICAL_FRAMES = 5;

  const scene = document.getElementById('scene');
  if (!scene) {
    console.log('[Mouse] No #scene found, aborting.');
    return;
  }

  let mouseEl = null;
  let cursorScene = { x: 0, y: 0 };
  let isMoving = false;
  let moveDirection = null;  // 'left' | 'right' | 'up' | 'down'
  let moveRemaining = 0;     // pixels left to move in this burst
  let animTime = 0;
  /** When idle, show last frame of this direction (so we don't snap to left-facing idle). null = use default idle. */
  let lastFacingDirection = null;

  function getSceneScale() {
    const t = scene.style.transform || '';
    const m = t.match(/scale\(([^)]+)\)/);
    return m ? parseFloat(m[1]) : 1;
  }

  function sceneFromClient(clientX, clientY) {
    const rect = scene.getBoundingClientRect();
    const scale = getSceneScale();
    return {
      x: (clientX - rect.left) / scale,
      y: (clientY - rect.top) / scale
    };
  }

  function getMouseCenter() {
    if (!mouseEl) return { x: 0, y: 0 };
    const left = parseFloat(mouseEl.style.left) || BOUNDS.left;
    const top_ = parseFloat(mouseEl.style.top) || BOUNDS.top;
    return { x: left + FRAME_SIZE / 2, y: top_ + FRAME_SIZE / 2 };
  }

  function distance(a, b) {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
  }

  function clampToBounds(left, top_) {
    const L = Math.max(BOUNDS.left, Math.min(BOUNDS.right - FRAME_SIZE, left));
    const T = Math.max(BOUNDS.top, Math.min(BOUNDS.bottom - FRAME_SIZE, top_));
    return { left: L, top: T };
  }

  function setPosition(left, top_) {
    if (!mouseEl) return;
    const c = clampToBounds(left, top_);
    mouseEl.style.left = c.left + 'px';
    mouseEl.style.top = c.top + 'px';
  }

  /**
   * Cursor right of mouse → mouse moves left.
   * Cursor up of mouse → mouse moves down.
   * Diagonal: pick axis where cursor offset is larger (more on left/right vs more on up/down).
   */
  function chooseDirection(cursor, center) {
    const dx = cursor.x - center.x;  // cursor right → dx > 0 → mouse move left
    const dy = cursor.y - center.y;  // cursor below → dy > 0 → mouse move up
    const useHorizontal = Math.abs(dx) >= Math.abs(dy);
    let dir;
    if (useHorizontal) {
      dir = dx >= 0 ? 'left' : 'right';
    } else {
      dir = dy >= 0 ? 'up' : 'down';
    }
    console.log('[Mouse] chooseDirection: dx=', dx.toFixed(0), 'dy=', dy.toFixed(0), '→', dir);
    return dir;
  }

  function setSprite(state, direction, frameIndex) {
    if (!mouseEl) return;
    const img = mouseEl.querySelector('.mouse-sprite');
    if (!img) return;

    if (state === 'idle') {
      img.style.backgroundImage = 'url("assets/movingstuff/mouse_idle.png")';
      img.style.backgroundSize = `${FRAME_SIZE}px ${FRAME_SIZE}px`;
      img.style.backgroundPosition = '0 0';
      img.style.transform = 'scaleX(1) scaleY(1)';
      return;
    }
    if (state === 'horizontal') {
      const scaleX = direction === 'right' ? -1 : 1;
      img.style.backgroundImage = 'url("assets/movingstuff/mouse_horizontal.png")';
      img.style.backgroundSize = `${FRAME_SIZE * HORIZONTAL_FRAMES}px ${FRAME_SIZE}px`;
      img.style.backgroundPosition = `-${(frameIndex ?? 0) * FRAME_SIZE}px 0`;
      img.style.transform = `scaleX(${scaleX}) scaleY(1)`;
      return;
    }
    if (state === 'vertical') {
      const scaleY = direction === 'down' ? -1 : 1;
      img.style.backgroundImage = 'url("assets/movingstuff/mouse_vertical.png")';
      img.style.backgroundSize = `${FRAME_SIZE * VERTICAL_FRAMES}px ${FRAME_SIZE}px`;
      img.style.backgroundPosition = `-${(frameIndex ?? 0) * FRAME_SIZE}px 0`;
      img.style.transform = `scaleX(1) scaleY(${scaleY})`;
    }
  }

  /** Idle pose using last frame of the given direction (so mouse "stays facing" how it was moving). */
  function setSpriteIdleFacing() {
    if (!lastFacingDirection) {
      setSprite('idle');
      return;
    }
    const dir = lastFacingDirection;
    if (dir === 'left' || dir === 'right') {
      setSprite('horizontal', dir, HORIZONTAL_FRAMES - 1);
    } else {
      setSprite('vertical', dir, VERTICAL_FRAMES - 1);
    }
  }

  function tick() {
    const currentLeft = parseFloat(mouseEl.style.left) || BOUNDS.left;
    const currentTop = parseFloat(mouseEl.style.top) || BOUNDS.top;
    const center = getMouseCenter();
    const dist = distance(cursorScene, center);

    if (isMoving) {
      let step = Math.min(MOVE_SPEED, moveRemaining);
      let newLeft = currentLeft;
      let newTop = currentTop;
      if (moveDirection === 'left') newLeft -= step;
      if (moveDirection === 'right') newLeft += step;
      if (moveDirection === 'up') newTop -= step;
      if (moveDirection === 'down') newTop += step;

      const clamped = clampToBounds(newLeft, newTop);
      const actualMoved = Math.abs(clamped.left - currentLeft) + Math.abs(clamped.top - currentTop);
      setPosition(clamped.left, clamped.top);
      moveRemaining -= actualMoved;

      animTime += 1;
      if (moveDirection === 'left' || moveDirection === 'right') {
        const fi = Math.floor(animTime / 6) % HORIZONTAL_FRAMES;
        setSprite('horizontal', moveDirection, fi);
      } else {
        const fi = Math.floor(animTime / 6) % VERTICAL_FRAMES;
        setSprite('vertical', moveDirection, fi);
      }

      if (moveRemaining <= 0 || actualMoved < step) {
        console.log('[Mouse] Move finished. direction=', moveDirection, 'remaining=', moveRemaining, 'hitBound=', actualMoved < step);
        lastFacingDirection = moveDirection;
        isMoving = false;
        moveDirection = null;
        setSpriteIdleFacing();
      }
    } else {
      if (dist < TRIGGER_RADIUS) {
        moveDirection = chooseDirection(cursorScene, center);
        moveRemaining = MOVE_DISTANCE;
        animTime = 0;
        isMoving = true;
        console.log('[Mouse] Triggered! dist=', dist.toFixed(0), 'direction=', moveDirection, 'moveRemaining=', moveRemaining);
      } else {
        setSpriteIdleFacing();
      }
    }

    requestAnimationFrame(tick);
  }

  function createMouseElement() {
    const startLeft = (BOUNDS.left + BOUNDS.right) / 2 - FRAME_SIZE / 2;
    const startTop = (BOUNDS.top + BOUNDS.bottom) / 2 - FRAME_SIZE / 2;
    const container = document.createElement('div');
    container.id = 'mouse-npc';
    container.className = 'mouse-npc';
    container.style.cssText = `position:absolute; width:${FRAME_SIZE}px; height:${FRAME_SIZE}px; left:${startLeft}px; top:${startTop}px; overflow:hidden; pointer-events:none; z-index:5;`;
    const sprite = document.createElement('div');
    sprite.className = 'mouse-sprite';
    sprite.style.cssText = `width:${FRAME_SIZE}px; height:${FRAME_SIZE}px; background-repeat:no-repeat; image-rendering: pixelated;`;
    container.appendChild(sprite);
    scene.appendChild(container);
    mouseEl = container;
    setSprite('idle');
    console.log('[Mouse] Element created at', startLeft, startTop, 'bounds:', BOUNDS);
  }

  function onMouseMove(e) {
    cursorScene = sceneFromClient(e.clientX, e.clientY);
  }

  function init() {
    console.log('[Mouse] init');
    createMouseElement();
    window.addEventListener('mousemove', onMouseMove);
    requestAnimationFrame(tick);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
