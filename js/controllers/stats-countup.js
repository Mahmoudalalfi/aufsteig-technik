/**
 * Animates stat numbers counting up when they scroll into view.
 * Uses IntersectionObserver — no GSAP dependency.
 *
 * Runs after i18n apply() (see main.js __runAfterI18nApply) so [data-i18n] values are final.
 * Observes each h4 (not the whole card) with a modest threshold so the effect reliably fires.
 */
let statsCountObserver = null;

export function initStatsCountUp() {
  if (statsCountObserver) {
    statsCountObserver.disconnect();
    statsCountObserver = null;
  }

  const statsGrid = document.querySelector(".stats-grid");
  if (!statsGrid) return;

  const items = statsGrid.querySelectorAll("article");
  if (!items.length) return;

  /** Parse a display string like "18+" or "98%" into { prefix:'', value:18, suffix:'+' } */
  function parseLabel(text) {
    const match = text.trim().match(/^([^0-9]*)(\d+(?:\.\d+)?)([^0-9]*)$/);
    if (!match) return null;
    return { prefix: match[1], value: parseFloat(match[2]), suffix: match[3] };
  }

  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  function animateCount(el, from, to, suffix, prefix, duration) {
    const start = performance.now();
    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutExpo(progress);
      const current = Math.round(from + (to - from) * eased);
      el.textContent = prefix + current + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  statsCountObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        statsCountObserver.unobserve(entry.target);

        const h4 = entry.target;
        if (h4.tagName !== "H4") return;
        const parsed = parseLabel(h4.textContent);
        if (!parsed) return;

        animateCount(h4, 0, parsed.value, parsed.suffix, parsed.prefix, 1400);
      });
    },
    {
      /* Whole-card 50% was often never reached; observe h4 + modest threshold. */
      threshold: 0.22,
      /* Expand root downward so numbers start counting just before they fully enter view. */
      rootMargin: "0px 0px 22% 0px"
    }
  );

  items.forEach((item) => {
    const h4 = item.querySelector("h4");
    if (h4) statsCountObserver.observe(h4);
  });
}
