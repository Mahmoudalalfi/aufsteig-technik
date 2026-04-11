/**
 * Staggered entrance animations for every card/grid section.
 * Uses GSAP ScrollTrigger.batch() so items animate in as a group
 * the first time they enter the viewport.
 */
export function initStaggerReveals() {
  if (!window.gsap || !window.ScrollTrigger) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const gsap   = window.gsap;
  const ST     = window.ScrollTrigger;

  // [CSS selector, stagger seconds, y offset]
  const batches = [
    ['.stats-grid article',    0.10, 36],
    ['.capability-card',       0.09, 32],
    ['.process-grid article',  0.12, 36],
    ['.offer-tile',            0.055, 28],
    ['.person-card',           0.10, 32],
    ['.rating-card',           0.08, 28],
    ['.contact-card',          0.12, 28],
    ['.faq-list details',      0.07, 22],
    ['.trust-badge',           0.08, 20],
    ['.people-showcase-grid .person-card', 0.12, 36],
  ];

  batches.forEach(([sel, stagger, y]) => {
    const els = document.querySelectorAll(sel);
    if (!els.length) return;

    gsap.set(els, { opacity: 0, y });

    ST.batch(els, {
      once:  true,
      start: 'top 91%',
      onEnter: (batch) =>
        gsap.to(batch, {
          opacity:  1,
          y:        0,
          duration: 0.72,
          ease:     'power2.out',
          stagger,
          overwrite: true,
        }),
    });

    /* Reveal any elements already fully past the trigger threshold at register time.
       ST.batch won't fire onEnter for once:true triggers that start already-passed. */
    els.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.91) {
        gsap.set(el, { opacity: 1, y: 0 });
      }
    });
  });

  // Whole-block reveals (single elements that slide in)
  const blocks = [
    ['.intro-grid',           'top 92%', 0,  44],
    ['.trust-strip',          'top 92%', 0,  28],
    ['.capabilities-viewport','top 88%', 0,  32],
    ['.achievement-showcase', 'top 86%', 0,  40],
    ['.brain-card',           'top 84%', 0,  0 ],
    ['.contact-form-card',    'top 88%', 0,  32],
    ['.partners-strip',       'top 90%', 0,  24],
    ['.process-route-wrap',   'top 86%', 0,  20],
    ['.ratings-marquee',      'top 88%', 0,  24],
    ['.project-deck',         'top 88%', 0,  32],
  ];

  blocks.forEach(([sel, start, , y]) => {
    const el = document.querySelector(sel);
    if (!el) return;
    gsap.set(el, { opacity: 0, y });

    /* Parse the threshold from "top XX%" to check against current position. */
    const thresholdPct = parseFloat((start.match(/(\d+(?:\.\d+)?)%/) || [, '88'])[1]) / 100;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * thresholdPct) {
      gsap.set(el, { opacity: 1, y: 0 });
      return;
    }

    ST.create({
      trigger: el,
      start,
      once: true,
      onEnter() {
        gsap.to(el, { opacity: 1, y: 0, duration: 0.88, ease: 'power3.out' });
      },
    });
  });
}
