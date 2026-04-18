const boundRevealGroups = new WeakSet();
const boundRevealSingles = new WeakSet();

const IS_TOUCH = window.matchMedia('(pointer: coarse)').matches;

function parseStartThreshold(start) {
  const pct = parseFloat((String(start).match(/(\d+(?:\.\d+)?)%/) || [, '88'])[1]) / 100;
  return Number.isFinite(pct) ? pct : 0.88;
}

/* ─── IntersectionObserver reveal (touch path — zero ScrollTrigger overhead) ─── */
function ioFadeUp(els, yPx = 28, staggerMs = 55) {
  if (!els || !els.length) return;
  const arr = Array.isArray(els) ? els : Array.from(els);

  arr.forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = `translateY(${yPx}px)`;
    el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
  });

  let nextDelay = 0;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const d = nextDelay;
      nextDelay += staggerMs;
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, d);
      io.unobserve(el);
    });
  }, { rootMargin: '0px 0px -6% 0px', threshold: 0.04 });

  arr.forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.bottom > 0 && r.top < window.innerHeight * 0.98) {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    } else {
      io.observe(el);
    }
  });
}

/* ─── bindDynamicReveals ─── */
export function bindDynamicReveals(root = document.body) {
  if (!root || (root.nodeType !== 1 && root.nodeType !== 9)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const scope = root.nodeType === 9 ? root.body || root.documentElement : root;

  if (IS_TOUCH) {
    // Touch: use IO for data-reveal-group
    const groupEls = [];
    if (scope.nodeType === 1 && scope.hasAttribute('data-reveal-group')) groupEls.push(scope);
    scope.querySelectorAll?.('[data-reveal-group]').forEach((el) => {
      if (!groupEls.includes(el)) groupEls.push(el);
    });
    groupEls.forEach((group) => {
      if (boundRevealGroups.has(group)) return;
      boundRevealGroups.add(group);
      const itemSel = group.dataset.revealItems || ':scope > *';
      let els;
      try { els = group.querySelectorAll(itemSel); } catch { return; }
      if (!els.length) return;
      const y = parseFloat(group.dataset.revealY || '28') || 28;
      const stagger = Math.round((parseFloat(group.dataset.revealStagger || '0.08') || 0.08) * 1000);
      ioFadeUp(els, y, stagger);
    });

    // Touch: use IO for data-reveal singles
    const singleEls = [];
    if (scope.nodeType === 1 && scope.hasAttribute('data-reveal') && !scope.hasAttribute('data-reveal-group')) singleEls.push(scope);
    scope.querySelectorAll?.('[data-reveal]:not([data-reveal-group])').forEach((el) => {
      if (!singleEls.includes(el)) singleEls.push(el);
    });
    singleEls.forEach((el) => {
      if (boundRevealSingles.has(el)) return;
      boundRevealSingles.add(el);
      const y = parseFloat(el.dataset.revealY || '28') || 28;
      ioFadeUp([el], y, 0);
    });
    return;
  }

  // Desktop: GSAP / ScrollTrigger path
  if (!window.gsap || !window.ScrollTrigger) return;
  const gsap = window.gsap;
  const ST = window.ScrollTrigger;

  const groupEls = [];
  if (scope.nodeType === 1 && scope.hasAttribute('data-reveal-group')) groupEls.push(scope);
  scope.querySelectorAll?.('[data-reveal-group]').forEach((el) => {
    if (!groupEls.includes(el)) groupEls.push(el);
  });
  groupEls.forEach((group) => {
    if (boundRevealGroups.has(group)) return;
    const itemSel = group.dataset.revealItems || ':scope > *';
    let els;
    try { els = group.querySelectorAll(itemSel); } catch { return; }
    if (!els.length) return;
    boundRevealGroups.add(group);
    const stagger = parseFloat(group.dataset.revealStagger || '0.1') || 0.1;
    const y = parseFloat(group.dataset.revealY || '32') || 32;
    gsap.set(els, { opacity: 0, y });
    ST.batch(els, {
      once: true, start: 'top 91%',
      onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 0.95, ease: 'power3.out', stagger, overwrite: true }),
    });
    els.forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.91) gsap.set(el, { opacity: 1, y: 0 });
    });
  });

  const singleEls = [];
  if (scope.nodeType === 1 && scope.hasAttribute('data-reveal') && !scope.hasAttribute('data-reveal-group')) singleEls.push(scope);
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
    if (rect.top < window.innerHeight * thresholdPct) { gsap.set(el, { opacity: 1, y: 0 }); return; }
    ST.create({ trigger: el, start, once: true, onEnter() { gsap.to(el, { opacity: 1, y: 0, duration: 1.05, ease: 'power4.out' }); } });
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
      if (!IS_TOUCH && window.ScrollTrigger) window.ScrollTrigger.refresh();
    }, 80);
  };
  new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true });
}

export function initStaggerReveals() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  if (IS_TOUCH) {
    // ── TOUCH: pure IntersectionObserver, zero ScrollTrigger ──
    const batchSelectors = [
      ['.capability-card',       32, 60],
      ['.process-grid article',  36, 70],
      ['.offer-tile',            28, 40],
      ['.person-card',           32, 65],
      ['.rating-card',           28, 50],
      ['.contact-card',          28, 70],
      ['.faq-list details',      22, 45],
      ['.people-showcase-grid .person-card', 36, 65],
      ['.vmv-card',              40, 70],
      ['.office-card',           36, 70],
      ['.facility-card',         36, 70],
      ['.reel-card',             40, 65],
      ['.market-approach-item',  40, 70],
      ['.core-focus-item',       40, 70],
      ['.tech-innovation-item',  40, 70],
      ['.technical-standards-item', 40, 70],
      ['.safety-concept-item',   40, 70],
    ];
    batchSelectors.forEach(([sel, y, staggerMs]) => {
      ioFadeUp(document.querySelectorAll(sel), y, staggerMs);
    });

    const singleSelectors = [
      '.capabilities-viewport', '.achievement-showcase', '.brain-card',
      '.contact-form-card', '.partners-strip', '.process-route-wrap',
      '.ratings-marquee', '.timeline-section .section-head',
      '.partners-reel-hook', '.partners-reel-chip', '.timeline-spine',
      '.project-deck', '.vmv-header .chip', '.vmv-header p',
      '.offices-header .chip', '.offices-header p',
      '.facilities-header .chip', '.facilities-header p',
      '.partners-head p', '.services-signature-head p',
      '.offers-head p', '.ratings-head p',
      '.market-approach-head', '.market-approach-panel',
      '.core-focus-head', '.core-focus-panel',
      '.tech-innovation-head', '.tech-innovation-panel',
      '.technical-standards-head', '.technical-standards-panel',
      '.safety-concept-head', '.safety-concept-panel',
    ];
    singleSelectors.forEach((sel) => {
      const el = document.querySelector(sel);
      if (el) ioFadeUp([el], 24, 0);
    });

    // Timeline items: simple fade-up
    document.querySelectorAll('.timeline-item').forEach((item) => {
      ioFadeUp([item], 24, 0);
      // Also add tl-visible when it enters
      const io2 = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('tl-visible'); io2.unobserve(e.target); } });
      }, { threshold: 0.05 });
      io2.observe(item);
    });

    bindDynamicReveals(document.body);
    initRevealMutationObserver();
    return;
  }

  // ── DESKTOP: GSAP ScrollTrigger path (unchanged) ──
  if (!window.gsap || !window.ScrollTrigger) return;
  const gsap = window.gsap;
  const ST   = window.ScrollTrigger;

  const batches = [
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
      once: true, start: 'top 91%',
      onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 0.95, ease: 'power3.out', stagger, overwrite: true }),
    });
    els.forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.91) gsap.set(el, { opacity: 1, y: 0 });
    });
  });

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
    const thresholdPct = parseFloat((start.match(/(\d+(?:\.\d+)?)%/) || [, '88'])[1]) / 100;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * thresholdPct) { gsap.set(el, { opacity: 1, y: 0 }); return; }
    ST.create({ trigger: el, start, once: true, onEnter() { gsap.to(el, { opacity: 1, y: 0, duration: 1.05, ease: 'power4.out' }); } });
  });

  document.querySelectorAll('.timeline-item').forEach((item) => {
    const isRight = item.classList.contains('tl-right');
    gsap.set(item, { opacity: 0, x: isRight ? 50 : -50 });
    const rect = item.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.91) { gsap.set(item, { opacity: 1, x: 0 }); item.classList.add('tl-visible'); return; }
    ST.create({ trigger: item, start: 'top 88%', once: true, onEnter() {
      gsap.to(item, { opacity: 1, x: 0, duration: 0.95, ease: 'power4.out' });
      item.classList.add('tl-visible');
    }});
  });

  bindDynamicReveals(document.body);
  initRevealMutationObserver();
}
