export function initRatingsMarquee() {
  const marquee = document.getElementById("ratingsMarquee");
  const track = document.getElementById("ratingsTrack");
  if (!marquee || !track) return;

  const baseCards = Array.from(track.children);
  if (baseCards.length < 2) return;

  const clones = document.createDocumentFragment();
  baseCards.forEach((card) => {
    const clone = card.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    clones.appendChild(clone);
  });
  track.appendChild(clones);

  let baseWidth = 1;
  let offset = 0;
  let lastTick = performance.now();
  let rafId = 0;
  let paused = false;
  let offscreen = false;

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        offscreen = !(e && e.isIntersecting);
      },
      { root: null, rootMargin: "80px 0px", threshold: 0 }
    );
    io.observe(marquee);
  }

  const dragState = {
    active: false,
    pointerId: null,
    startX: 0,
    startOffset: 0
  };

  function computeBaseWidth() {
    const gapRaw = window.getComputedStyle(track).gap || "0";
    const gap = parseFloat(gapRaw) || 0;
    let width = 0;
    baseCards.forEach((card, idx) => {
      width += card.getBoundingClientRect().width;
      if (idx < baseCards.length - 1) width += gap;
    });
    baseWidth = Math.max(1, width);
    offset = ((offset % baseWidth) + baseWidth) % baseWidth;
  }

  function wrap(nextOffset) {
    if (baseWidth <= 0) return 0;
    let wrapped = nextOffset % baseWidth;
    if (wrapped < 0) wrapped += baseWidth;
    return wrapped;
  }

  function render() {
    track.style.transform = `translate3d(${-offset}px, 0, 0)`;
  }

  function tick(now) {
    const dt = Math.min(0.05, Math.max(0, (now - lastTick) / 1000));
    lastTick = now;

    if (!paused && !dragState.active && !offscreen) {
      const speed = 18;
      offset = wrap(offset + speed * dt);
      render();
    }

    rafId = requestAnimationFrame(tick);
  }

  function onPointerDown(e) {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    dragState.active = true;
    dragState.pointerId = e.pointerId;
    dragState.startX = e.clientX;
    dragState.startOffset = offset;
    marquee.classList.add("is-dragging");
    paused = true;
    if (marquee.setPointerCapture) marquee.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e) {
    if (!dragState.active || e.pointerId !== dragState.pointerId) return;
    const dx = e.clientX - dragState.startX;
    offset = wrap(dragState.startOffset - dx);
    render();
    if (e.cancelable) e.preventDefault();
  }

  function onPointerUp(e) {
    if (!dragState.active || e.pointerId !== dragState.pointerId) return;
    if (marquee.hasPointerCapture && marquee.hasPointerCapture(dragState.pointerId)) {
      marquee.releasePointerCapture(dragState.pointerId);
    }
    dragState.active = false;
    dragState.pointerId = null;
    marquee.classList.remove("is-dragging");
    paused = false;
  }

  marquee.addEventListener("pointerdown", onPointerDown);
  marquee.addEventListener("pointermove", onPointerMove);
  marquee.addEventListener("pointerup", onPointerUp);
  marquee.addEventListener("pointercancel", onPointerUp);
  marquee.addEventListener("lostpointercapture", onPointerUp);

  marquee.addEventListener("mouseenter", () => {
    paused = true;
  });
  marquee.addEventListener("mouseleave", () => {
    if (!dragState.active) paused = false;
  });

  marquee.addEventListener("focusin", () => {
    paused = true;
  });
  marquee.addEventListener("focusout", () => {
    if (!dragState.active) paused = false;
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      paused = true;
    } else if (!dragState.active) {
      paused = false;
      lastTick = performance.now();
    }
  });

  window.addEventListener(
    "resize",
    () => {
      computeBaseWidth();
      render();
    },
    { passive: true }
  );

  computeBaseWidth();
  render();
  rafId = requestAnimationFrame(tick);
}
