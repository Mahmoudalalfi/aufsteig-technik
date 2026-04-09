import { HERO_FRAME_COUNT, HERO_FRAME_BASE, HERO_FRAME_EXT } from "../model/hero-config.js";
import { appState } from "../model/app-state.js";
import { clamp } from "../utils/math.js";
import { getMotionProfile } from "../utils/motion-profile.js";

const images = new Array(HERO_FRAME_COUNT);

function framePath(index) {
  return `${HERO_FRAME_BASE}${String(index + 1).padStart(4, "0")}${HERO_FRAME_EXT}`;
}

export function initHero(refs) {
  const { canvas } = refs;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const state = appState.hero;
  const motion = getMotionProfile();

  function setCanvasSize() {
    state.viewportW = window.innerWidth;
    state.viewportH = window.innerHeight;
    const ratio = Math.min(window.devicePixelRatio || 1, motion.maxCanvasDpr);
    canvas.width = Math.round(state.viewportW * ratio);
    canvas.height = Math.round(state.viewportH * ratio);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(ratio, ratio);
    ctx.imageSmoothingEnabled = true;
  }

  function drawCover(img) {
    const scale = Math.max(state.viewportW / img.width, state.viewportH / img.height);
    const drawW = img.width * scale;
    const drawH = img.height * scale;
    const x = (state.viewportW - drawW) / 2;
    const y = (state.viewportH - drawH) / 2;
    ctx.drawImage(img, x, y, drawW, drawH);
  }

  function drawSequenceFrame(frameFloat) {
    const index = Math.round(clamp(frameFloat, 0, HERO_FRAME_COUNT - 1));
    if (index === state.activeBase) return;
    const img = images[index];
    if (!img || !img.complete) return;
    ctx.clearRect(0, 0, state.viewportW, state.viewportH);
    drawCover(img);
    state.activeBase = index;
  }

  function preloadFrames() {
    for (let i = 0; i < HERO_FRAME_COUNT; i += 1) {
      const img = new Image();
      img.src = framePath(i);
      img.decoding = "async";
      img.loading = "eager";
      img.onload = () => {
        state.loaded += 1;
        if (i === 0) drawSequenceFrame(0);
      };
      images[i] = img;
    }
  }

  function renderLoop() {
    state.currentFrame += (state.targetFrame - state.currentFrame) * motion.heroLerp;
    drawSequenceFrame(state.currentFrame);
    requestAnimationFrame(renderLoop);
  }

  setCanvasSize();
  preloadFrames();
  const onViewportChange = () => {
    setCanvasSize();
    if (window.ScrollTrigger) window.ScrollTrigger.refresh();
  };
  window.addEventListener("resize", onViewportChange, { passive: true });
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", onViewportChange, { passive: true });
  }
  window.addEventListener("orientationchange", onViewportChange, { passive: true });
  requestAnimationFrame(renderLoop);
}
