/**
 * Lenis smooth scroll + ScrollTrigger.
 * Also handles:
 *  - Smooth anchor navigation for all nav links (both pill and menu-strip)
 *  - Back-to-top button visibility + click
 */
export function initSmoothScroll() {
  if (!window.Lenis) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.documentElement.classList.add("native-scroll");
    initBackToTop(null);
    return;
  }

  if (window.matchMedia("(pointer: coarse)").matches) {
    document.documentElement.classList.add("native-scroll");
    initBackToTop(null);
    return;
  }

  let lenis;
  try {
    lenis = new window.Lenis({
      lerp: 0.085,
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

  // ── Smooth anchor navigation for all nav links ──────────────
  // Nav offset: the nav pill is ~74px from top of viewport. Add 16px extra breathing.
  const NAV_OFFSET = -90;

  function handleAnchorClick(e) {
    const href = e.currentTarget.getAttribute("href");
    if (!href || !href.startsWith("#")) return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    lenis.scrollTo(target, {
      offset: NAV_OFFSET,
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo ease out
    });
  }

  // Desktop strip + mobile panel
  document.querySelectorAll(".menu-strip a, .menu-panel a").forEach((link) => {
    link.addEventListener("click", handleAnchorClick);
  });

  // ── Back-to-top ─────────────────────────────────────────────
  initBackToTop(lenis);

  // ── Resize helpers ──────────────────────────────────────────
  let resizeTimer = 0;
  const safeResize = () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      requestAnimationFrame(() => {
        try { lenis.resize(); } catch { /* ignore */ }
      });
    }, 120);
  };

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      try { lenis.resize(); } catch { /* ignore */ }
    });
  });

  window.addEventListener("load", () => {
    try {
      lenis.resize();
      if (window.ScrollTrigger) window.ScrollTrigger.refresh();
    } catch { /* ignore */ }
  }, { passive: true, once: true });

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
    } catch { /* ignore */ }
  }

  document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
    img.addEventListener("load", safeResize, { passive: true });
    img.addEventListener("error", safeResize, { passive: true });
  });
}

/**
 * Back-to-top button.
 * @param {object|null} lenis  Pass lenis instance for smooth scroll, null for native.
 */
function initBackToTop(lenis) {
  const btn = document.getElementById("backToTop");
  if (!btn) return;

  const SHOW_AFTER = 400; // px scrolled before button appears

  function update() {
    const y = window.scrollY || 0;
    if (y > SHOW_AFTER) {
      btn.classList.add("is-visible");
    } else {
      btn.classList.remove("is-visible");
    }
  }

  window.addEventListener("scroll", update, { passive: true });
  update();

  btn.addEventListener("click", () => {
    if (lenis) {
      lenis.scrollTo(0, {
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });
}
