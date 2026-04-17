/**
 * Staggered entrance animations for every card/grid section.
 * Uses GSAP ScrollTrigger.batch() so items animate in as a group
 * the first time they enter the viewport.
 *
 * Dynamic bindings (optional): declare behavior in HTML so animations attach
 * without editing this file. Scanned on init, after i18n (see main.js), and when
 * new nodes are added (MutationObserver).
 *
 *   data-reveal-group          — container; children get staggered fade-up
 *   data-reveal-items=".sel"   — optional child selector (default :scope > *)
 *   data-reveal-stagger="0.12" — stagger gap in seconds
 *   data-reveal-y="32"         — initial y offset in px
 *
 *   data-reveal                — single block fade-up (not used with data-reveal-group)
 *   data-reveal-start="top 91%"
 *   data-reveal-y="26"
 */

const boundRevealGroups = new WeakSet();
const boundRevealSingles = new WeakSet();

function parseStartThreshold(start) {
  const pct = parseFloat((String(start).match(/(\d+(?:\.\d+)?)%/) || [, '88'])[1]) / 100;
  return Number.isFinite(pct) ? pct : 0.88;
}

/**
 * Binds [data-reveal-group] and [data-reveal] under root (default document.body).
 * Safe to call repeatedly; already-bound elements are skipped.
 */
export function bindDynamicReveals(root = document.body) {
  if (!window.gsap || !window.ScrollTrigger) return;
  if (!root || (root.nodeType !== 1 && root.nodeType !== 9)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const gsap = window.gsap;
  const ST = window.ScrollTrigger;

  const scope = root.nodeType === 9 ? root.body || root.documentElement : root;

  const groupEls = [];
  if (scope.nodeType === 1 && scope.hasAttribute('data-reveal-group')) groupEls.push(scope);
  scope.querySelectorAll?.('[data-reveal-group]').forEach((el) => {
    if (!groupEls.includes(el)) groupEls.push(el);
  });

  groupEls.forEach((group) => {
    if (boundRevealGroups.has(group)) return;
    const itemSel = group.dataset.revealItems || ':scope > *';
    let els;
    try {
      els = group.querySelectorAll(itemSel);
    } catch {
      return;
    }
    if (!els.length) return;

    boundRevealGroups.add(group);

    const stagger = parseFloat(group.dataset.revealStagger || '0.1') || 0.1;
    const y = parseFloat(group.dataset.revealY || '32') || 32;

    gsap.set(els, { opacity: 0, y });

    ST.batch(els, {
      once: true,
      start: 'top 91%',
      onEnter: (batch) =>
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          duration: 0.72,
          ease: 'power2.out',
          stagger,
          overwrite: true,
        }),
    });

    els.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.91) {
        gsap.set(el, { opacity: 1, y: 0 });
      }
    });
  });

  const singleEls = [];
  if (scope.nodeType === 1 && scope.hasAttribute('data-reveal') && !scope.hasAttribute('data-reveal-group')) {
    singleEls.push(scope);
  }
  scope.querySelectorAll?.('[data-reveal]:not([data-reveal-group])').forEach((el) => {
    if (!singleEls.includes(el)) singleEls.push(el);
  });

  singleEls.forEach((el) => {
    if (boundRevealSingles.has(el)) return;
    boundRevealSingles.add(el);

    const start = el.dataset.revealStart || 'top 91%';
    const y = parseFloat(el.dataset.revealY || '28') || 28;
    const thresholdPct = parseStartThreshold(start);

    gsap.set(el, { opacity: 0, y });

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

let revealObserverBound = false;

function initRevealMutationObserver() {
  if (revealObserverBound || typeof MutationObserver === 'undefined') return;
  revealObserverBound = true;

  let t = 0;
  const schedule = () => {
    clearTimeout(t);
    t = window.setTimeout(() => {
      bindDynamicReveals(document.body);
      if (window.ScrollTrigger) window.ScrollTrigger.refresh();
    }, 80);
  };

  const mo = new MutationObserver(schedule);
  mo.observe(document.body, { childList: true, subtree: true });
}

export function initStaggerReveals() {
  if (!window.gsap || !window.ScrollTrigger) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const gsap   = window.gsap;
  const ST     = window.ScrollTrigger;
  const isTouch = window.matchMedia('(pointer: coarse)').matches;

  // [CSS selector, stagger seconds, y offset]
  const batches = [
    /* About list + stats: scroll scrub (scroll-timelines) + about-dynamics.js */
    ['.capability-card',       0.09, 32],
    ['.process-grid article',  0.12, 36],
    ['.offer-tile',            0.055, 28],
    ['.person-card',           0.10, 32],
    ['.rating-card',           0.08, 28],
    ['.contact-card',          0.12, 28],
    ['.faq-list details',      0.07, 22],
    ['.people-showcase-grid .person-card', 0.12, 36],
    ['.vmv-card',      0.12, 40],
    ['.office-card',   0.12, 36],
    ['.facility-card', 0.12, 36],
    ['.reel-card',     0.10, 40],
    ['.market-approach-item', 0.12, 40],
    ['.core-focus-item', 0.12, 40],
    ['.tech-innovation-item', 0.12, 40],
    ['.technical-standards-item', 0.12, 40],
    ['.safety-concept-item', 0.12, 40],
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
    ['.capabilities-viewport','top 88%', 0,  32],
    ['.achievement-showcase', 'top 86%', 0,  40],
    ['.brain-card',           'top 84%', 0,  0 ],
    ['.contact-form-card',    'top 88%', 0,  32],
    ['.partners-strip',       'top 90%', 0,  24],
    ['.process-route-wrap',   'top 86%', 0,  20],
    ['.ratings-marquee',      'top 88%', 0,  24],
    ['.timeline-section .section-head', 'top 88%', 0, 28],
    ['.partners-reel-hook',             'top 88%', 0, 24],
    ['.partners-reel-chip',             'top 88%', 0, 16],
    ['.timeline-spine',                 'top 85%', 0,  0 ],
    ['.project-deck',                   'top 88%', 0, 32],
    ['.vmv-header .chip',               'top 88%', 0, 16],
    ['.vmv-header p',                   'top 88%', 0, 20],
    ['.offices-header .chip',           'top 88%', 0, 16],
    ['.offices-header p',               'top 88%', 0, 20],
    ['.facilities-header .chip',        'top 88%', 0, 16],
    ['.facilities-header p',            'top 88%', 0, 20],
    ['.partners-head p',                'top 88%', 0, 20],
    ['.services-signature-head p',      'top 88%', 0, 20],
    ['.offers-head p',                  'top 88%', 0, 20],
    ['.ratings-head p',                 'top 88%', 0, 20],
    ['.market-approach-head',           'top 90%', 0, 26],
    ['.market-approach-panel',          'top 91%', 0, 36],
    ['.core-focus-head',                'top 91%', 0, 24],
    ['.core-focus-panel',               'top 91%', 0, 32],
    ['.tech-innovation-head',           'top 91%', 0, 24],
    ['.tech-innovation-panel',          'top 91%', 0, 32],
    ['.technical-standards-head',       'top 91%', 0, 24],
    ['.technical-standards-panel',      'top 91%', 0, 32],
    ['.safety-concept-head',            'top 91%', 0, 24],
    ['.safety-concept-panel',           'top 91%', 0, 32],
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

  // Timeline items: horizontal slide on desktop, simple fade-up on mobile
  document.querySelectorAll('.timeline-item').forEach((item) => {
    const isRight = item.classList.contains('tl-right');
    if (isTouch) {
      gsap.set(item, { opacity: 0, y: 24 });
    } else {
      gsap.set(item, { opacity: 0, x: isRight ? 50 : -50 });
    }
    const rect = item.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.91) {
      gsap.set(item, { opacity: 1, x: 0, y: 0 });
      item.classList.add('tl-visible');
      return;
    }
    ST.create({
      trigger: item,
      start: 'top 88%',
      once: true,
      onEnter() {
        gsap.to(item, { opacity: 1, x: 0, y: 0, duration: 0.72, ease: 'power3.out' });
        item.classList.add('tl-visible');
      },
    });
  });

  bindDynamicReveals(document.body);
  initRevealMutationObserver();

  // Safety net for touch: after page load + 1.5s, force-show anything still hidden.
  // Prevents elements staying invisible if a ScrollTrigger batch fires late or misses.
  if (isTouch) {
    const forceReveal = () => {
      window.setTimeout(() => {
        document.querySelectorAll('[style*="opacity: 0"], [style*="opacity:0"]').forEach((el) => {
          el.style.opacity = '1';
          el.style.transform = 'none';
        });
      }, 1500);
    };
    if (document.readyState === 'complete') {
      forceReveal();
    } else {
      window.addEventListener('load', forceReveal, { once: true });
    }
  }
}
