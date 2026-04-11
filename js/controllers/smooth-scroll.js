/**
 * Lenis smooth scroll + ScrollTrigger without the old “molasses” feel.
 *
 * What went wrong before:
 * - Long easing (`duration` ~1s) made the wheel feel disconnected.
 * - Pairing a heavy `duration` with `gsap.ticker(lenis.raf)` plus many scrub timelines + hero canvas saturated the main thread.
 *
 * This setup:
 * - Uses **lerp** (not a huge `duration`) so motion is silky without the old multi‑second pipeline lag.
 * - **Lower lerp + slightly lower wheelMultiplier** = buttery glide (gentler steps, softer catch‑up).
 * - Uses **autoRaf: true** only — no `gsap.ticker.add(lenis.raf)` (Lenis owns one RAF loop).
 * - Calls `ScrollTrigger.update()` on Lenis `scroll` (GSAP’s recommended hook).
 * - Sets `gsap.ticker.lagSmoothing(0)` so scrub tweens stay tied to scroll samples.
 */
export function initSmoothScroll() {
  if (!window.Lenis) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.documentElement.classList.add("native-scroll");
    return;
  }

  if (window.matchMedia("(pointer: coarse)").matches) {
    document.documentElement.classList.add("native-scroll");
    return;
  }

  let lenis;
  try {
    lenis = new window.Lenis({
      // Lower lerp = silkier, more “buttery” follow (default Lenis is ~0.1). Too low feels disconnected.
      lerp: 0.085,
      // Slightly softer wheel steps so the target doesn’t jump — reads as smoother, not twitchy.
      wheelMultiplier: 0.94,
      touchMultiplier: 0.92,
      smoothWheel: true,
      autoRaf: true,
      autoResize: true,
    });
  } catch {
    return;
  }

  lenis.on("scroll", () => {
    if (window.ScrollTrigger) window.ScrollTrigger.update();
  });

  if (window.gsap) {
    window.gsap.ticker.lagSmoothing(0);
  }

  let resizeTimer = 0;
  const safeResize = () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      requestAnimationFrame(() => {
        try {
          lenis.resize();
        } catch {
          /* ignore */
        }
      });
    }, 120);
  };

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      try {
        lenis.resize();
      } catch {
        /* ignore */
      }
    });
  });

  window.addEventListener(
    "load",
    () => {
      try {
        lenis.resize();
        if (window.ScrollTrigger) window.ScrollTrigger.refresh();
      } catch {
        /* ignore */
      }
    },
    { passive: true, once: true }
  );

  window.addEventListener("resize", safeResize, { passive: true });

  if (window.ResizeObserver) {
    try {
      let lastResizeAt = 0;
      const ro = new ResizeObserver(() => {
        const now = performance.now();
        if (now - lastResizeAt < 400) return;
        lastResizeAt = now;
        safeResize();
      });
      ro.observe(document.body);
    } catch {
      /* ignore */
    }
  }

  document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
    img.addEventListener("load", safeResize, { passive: true });
    img.addEventListener("error", safeResize, { passive: true });
  });
}
