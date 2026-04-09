import { getMotionProfile } from "../utils/motion-profile.js";

export function initSmoothScroll() {
  if (!window.Lenis) return;
  const { useLenis } = getMotionProfile();
  if (!useLenis) {
    document.documentElement.classList.add("native-scroll");
    return;
  }

  let lenis;
  try {
    lenis = new window.Lenis({
      duration: 1.08,
      wheelMultiplier: 0.95,
      smoothWheel: true,
      touchMultiplier: 1.2,
      __experimental__naiveDimensions: true
    });
  } catch {
    lenis = new window.Lenis({
      duration: 1.08,
      wheelMultiplier: 0.95,
      smoothWheel: true,
      touchMultiplier: 1.2
    });
  }

  lenis.on("scroll", () => {
    if (window.ScrollTrigger) window.ScrollTrigger.update();
  });

  if (window.gsap) {
    window.gsap.ticker.add((time) => lenis.raf(time * 1000));
    window.gsap.ticker.lagSmoothing(0);
  } else {
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  let resizeTimer = 0;
  const safeResize = () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      requestAnimationFrame(() => {
        try {
          lenis.resize();
        } catch {}
      });
    }, 120);
  };

  lenis.stop();
  const startLenis = () => {
    try {
      lenis.resize();
      lenis.start();
    } catch {}
  };

  window.addEventListener("load", startLenis, { passive: true });
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
    } catch {}
  }

  document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
    img.addEventListener("load", safeResize, { passive: true });
    img.addEventListener("error", safeResize, { passive: true });
  });
}
