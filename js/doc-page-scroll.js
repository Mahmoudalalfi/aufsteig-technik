/**
 * Smooth scrolling for standalone documentation pages (no GSAP).
 * Desktop: Lenis when available. Touch / reduced-motion: CSS only.
 * Matches index tuning: soft lerp + autoRaf (no manual raf loop).
 */
(function () {
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var coarse = window.matchMedia("(pointer: coarse)").matches;

  if (reduced) {
    return;
  }

  if (!window.Lenis || coarse) {
    document.documentElement.style.scrollBehavior = "smooth";
    return;
  }

  var lenis;
  try {
    lenis = new window.Lenis({
      lerp: 0.085,
      wheelMultiplier: 0.94,
      smoothWheel: true,
      touchMultiplier: 0.92,
      // Let native overflow containers (like catalog lightboxes) consume wheel/touch input.
      prevent: function (node) {
        return !!(
          node &&
          node.closest &&
          node.closest(".lightbox-stage, [data-native-scroll], .matrix")
        );
      },
      autoRaf: true,
      autoResize: true,
    });
  } catch (e) {
    document.documentElement.style.scrollBehavior = "smooth";
    return;
  }

  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      try {
        lenis.resize();
      } catch (err) {
        /* ignore */
      }
    });
  });

  window.addEventListener(
    "load",
    function () {
      try {
        lenis.resize();
      } catch (err) {
        /* ignore */
      }
    },
    { passive: true, once: true }
  );

  var resizeTimer = 0;
  window.addEventListener(
    "resize",
    function () {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(function () {
        requestAnimationFrame(function () {
          try {
            lenis.resize();
          } catch (err) {
            /* ignore */
          }
        });
      }, 120);
    },
    { passive: true }
  );
})();
