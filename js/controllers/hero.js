import { HERO_FRAME_COUNT, HERO_FRAME_BASE, HERO_FRAME_EXT } from "../model/hero-config.js";
import { appState } from "../model/app-state.js";
import { clamp } from "../utils/math.js";
import { getDeviceHints } from "../utils/device.js";

const images = new Array(HERO_FRAME_COUNT);
const HERO_BG = "#050607";
/** After frame 0 is decoded, keep a thin pipeline so lazy imgs / PNGs can load. */
const MOBILE_LOAD_CONCURRENCY = 2;
const MOBILE_LOAD_CONCURRENCY_SAVE = 2;
const DESKTOP_LOAD_CONCURRENCY = 12;

function framePath(index) {
  return `${HERO_FRAME_BASE}${String(index + 1).padStart(4, "0")}${HERO_FRAME_EXT}`;
}

function isCoarsePointer() {
  return window.matchMedia("(pointer: coarse)").matches;
}

function isNarrowViewport() {
  return window.matchMedia("(max-width: 900px)").matches;
}

/** Fewer unique frames on touch = less bandwidth; scroll still maps to full range. */
function heroStride(hints) {
  if (!isCoarsePointer()) return 1;
  if (hints.saveData) return 3;
  return 2;
}

function buildLoadOrder(stride) {
  if (stride <= 1) {
    return Array.from({ length: HERO_FRAME_COUNT }, (_, i) => i);
  }
  const order = [];
  for (let i = 0; i < HERO_FRAME_COUNT; i += stride) {
    order.push(i);
  }
  const last = HERO_FRAME_COUNT - 1;
  if (order[order.length - 1] !== last) {
    order.push(last);
  }
  return order;
}

function ensureSlot(i) {
  if (!images[i]) {
    const img = new Image();
    img.decoding = "async";
    images[i] = img;
  }
  return images[i];
}

export function initHero(refs) {
  const { canvas, heroSequence } = refs;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const state = appState.hero;
  const stickyEl = canvas.closest(".sequence-sticky");

  function readViewportCssPixels() {
    if (stickyEl) {
      const r = stickyEl.getBoundingClientRect();
      const w = Math.max(1, Math.round(r.width));
      const h = Math.max(1, Math.round(r.height));
      return { w, h };
    }
    return {
      w: Math.max(1, window.innerWidth),
      h: Math.max(1, window.innerHeight)
    };
  }

  function setCanvasSize() {
    const { w, h } = readViewportCssPixels();
    state.viewportW = w;
    state.viewportH = h;
    const rawDpr = window.devicePixelRatio || 1;
    const hints = getDeviceHints();
    let cap = isCoarsePointer() || isNarrowViewport() ? 2 : 2.5;
    if (hints.saveData) cap = Math.min(cap, 1.5);
    else if (hints.lightMode && rawDpr > 2) cap = Math.min(cap, 1.75);
    const ratio = Math.min(rawDpr, cap);
    canvas.width = Math.round(state.viewportW * ratio);
    canvas.height = Math.round(state.viewportH * ratio);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(ratio, ratio);
    ctx.imageSmoothingEnabled = true;
    state.activeBase = -1;
    drawSequenceFrame(state.currentFrame, true);
  }

  function drawCover(img) {
    const scale = Math.max(state.viewportW / img.width, state.viewportH / img.height);
    const drawW = img.width * scale;
    const drawH = img.height * scale;
    const x = (state.viewportW - drawW) / 2;
    const y = (state.viewportH - drawH) / 2;
    ctx.drawImage(img, x, y, drawW, drawH);
  }

  function nearestLoadedFrame(preferred) {
    const p = clamp(preferred, 0, HERO_FRAME_COUNT - 1);
    const imgAt = images[p];
    if (imgAt?.complete && imgAt.naturalWidth > 0) return p;
    for (let d = 1; d < HERO_FRAME_COUNT; d += 1) {
      const hi = p + d;
      if (hi < HERO_FRAME_COUNT) {
        const im = images[hi];
        if (im?.complete && im.naturalWidth > 0) return hi;
      }
      const lo = p - d;
      if (lo >= 0) {
        const im = images[lo];
        if (im?.complete && im.naturalWidth > 0) return lo;
      }
    }
    return -1;
  }

  function drawSequenceFrame(frameFloat, forceRedraw) {
    const index = Math.round(clamp(frameFloat, 0, HERO_FRAME_COUNT - 1));
    const best = nearestLoadedFrame(index);
    if (!forceRedraw && best >= 0 && best === state.activeBase) return;

    ctx.clearRect(0, 0, state.viewportW, state.viewportH);

    if (best < 0) {
      state.activeBase = -1;
      return;
    }

    ctx.fillStyle = HERO_BG;
    ctx.fillRect(0, 0, state.viewportW, state.viewportH);
    drawCover(images[best]);
    state.activeBase = best;
  }

  function preloadFrames() {
    const hints = getDeviceHints();
    const stride = heroStride(hints);
    const loadOrder = buildLoadOrder(stride);
    const concurrency =
      isCoarsePointer() || isNarrowViewport()
        ? hints.saveData
          ? MOBILE_LOAD_CONCURRENCY_SAVE
          : MOBILE_LOAD_CONCURRENCY
        : DESKTOP_LOAD_CONCURRENCY;
    let inFlight = 0;
    let queuePos = 0;
    let firstFrameReady = false;

    const kick = () => {
      drawSequenceFrame(state.currentFrame, true);
    };

    const startOne = (i) => {
      const img = ensureSlot(i);
      inFlight += 1;
      const done = () => {
        inFlight -= 1;
        if (i === 0) firstFrameReady = true;
        kick();
        pump();
      };
      img.onload = () => {
        if (i === 0 && typeof img.decode === "function") {
          img.decode().then(done).catch(done);
        } else {
          done();
        }
      };
      img.onerror = done;
      img.src = framePath(i);
    };

    function pump() {
      while (inFlight < concurrency && queuePos < loadOrder.length) {
        const idx = loadOrder[queuePos];
        if (idx > 0 && !firstFrameReady) break;
        startOne(idx);
        queuePos += 1;
      }
    }

    startOne(0);
    queuePos = 1;
    pump();
  }

  let heroInView = true;
  if (heroSequence && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        heroInView = !!(e && e.isIntersecting);
      },
      { threshold: [0, 0.02, 0.15] }
    );
    io.observe(heroSequence);
  }

  const lerp = isCoarsePointer() ? 0.22 : 0.16;

  function renderLoop() {
    state.currentFrame += (state.targetFrame - state.currentFrame) * lerp;
    if (heroInView) {
      drawSequenceFrame(state.currentFrame, false);
    }
    requestAnimationFrame(renderLoop);
  }

  setCanvasSize();
  preloadFrames();

  const onLayoutChange = () => {
    setCanvasSize();
    if (window.ScrollTrigger) window.ScrollTrigger.refresh();
  };

  window.addEventListener("resize", onLayoutChange, { passive: true });

  /**
   * iOS/Android fire visualViewport resize constantly while the URL bar shows/hides during scroll.
   * That was resizing the canvas + ScrollTrigger.refresh every frame → heavy stutter.
   * Desktop: keep sync; touch devices: ignore (orientationchange + window resize still run).
   */
  if (window.visualViewport && !isCoarsePointer()) {
    window.visualViewport.addEventListener("resize", onLayoutChange, { passive: true });
  }

  window.addEventListener("orientationchange", onLayoutChange, { passive: true });

  requestAnimationFrame(renderLoop);
}
