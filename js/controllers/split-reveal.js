/**
 * Split-text word-by-word reveal.
 * Walks every text node inside a target element, wraps each word in:
 *   <span class="sw"><span class="sw-inner">word</span></span>
 * Then GSAP animates .sw-inner from translateY(110%) → 0 with stagger.
 *
 * The outer .sw has overflow:hidden so the clip effect is clean.
 */

function wrapWords(el) {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
  const nodes = [];
  let n;
  while ((n = walker.nextNode())) nodes.push(n);

  nodes.forEach((tn) => {
    // Split on whitespace but preserve the gaps
    const parts = tn.textContent.split(/(\s+)/);
    const frag = document.createDocumentFragment();
    parts.forEach((p) => {
      if (/^\s+$/.test(p)) {
        // Preserve whitespace as-is
        frag.appendChild(document.createTextNode(p));
      } else if (p) {
        const outer = document.createElement('span');
        outer.className = 'sw';
        const inner = document.createElement('span');
        inner.className = 'sw-inner';
        inner.textContent = p;
        outer.appendChild(inner);
        frag.appendChild(outer);
      }
    });
    tn.parentNode.replaceChild(frag, tn);
  });
}

export function initSplitReveal() {
  if (!window.gsap || !window.ScrollTrigger) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  // On touch: skip word-split entirely — too many hidden spans causes invisible headings
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const gsap = window.gsap;
  const ST = window.ScrollTrigger;

  // [selector, ScrollTrigger start value]
  const targets = [
    ['#services .dark h3',          'top 82%'],
    ['#services .service-story-slide h4', 'top 82%'],
    ['.service-photo-meta strong', 'top 86%'],
    ['.services-signature-head h3', 'top 88%'],
    ['.section-head h3',            'top 88%'],
    ['.brain-left h3',              'top 84%'],
    ['.brain-right h2',             'top 84%'],
    ['.ratings-head h3',            'top 88%'],
    ['.contact-left h2',            'top 88%'],
    ['.faq-wrap h3',                'top 88%'],
    ['.offers-head h3',             'top 88%'],
    ['.process-grid h4',            'top 90%'],
    ['.vmv-header h2',              'top 86%'],
    ['.vmv-card h3',                'top 88%'],
    ['.offices-header h2',          'top 88%'],
    ['.capability-card h4',         'top 90%'],
  ];

  targets.forEach(([sel, start]) => {
    document.querySelectorAll(sel).forEach((el) => {
      const hasSplit = el.querySelector('.sw-inner');
      if (el.dataset.srDone === '1' && hasSplit) return;

      if (el.dataset.srDone === '1' && !hasSplit) {
        gsap.killTweensOf(el.querySelectorAll('.sw-inner'));
        ST.getAll().forEach((st) => {
          if (st.vars && st.vars.trigger === el) st.kill(false);
        });
        delete el.dataset.srDone;
      }

      el.dataset.srDone = '1';
      wrapWords(el);

      const spans = el.querySelectorAll('.sw-inner');
      if (!spans.length) return;

      gsap.set(spans, { yPercent: 110, opacity: 0 });

      const trigger = ST.create({
        trigger: el,
        start,
        once: true,
        onEnter() {
          gsap.to(spans, {
            yPercent: 0,
            opacity: 1,
            duration: 1.0,
            ease: 'power4.out',
            stagger: 0.04,
          });
        },
      });

      /* If the element is already in the viewport at registration time
         (e.g. after a ScrollTrigger.refresh() repositions it), the onEnter
         callback won't fire for a once:true trigger. Detect and play immediately. */
      if (trigger && trigger.progress === 1) {
        gsap.set(spans, { yPercent: 0, opacity: 1 });
        trigger.kill();
      }
    });
  });
}

/**
 * Also exported so hero-load.js can reuse the word-wrapper.
 */
export { wrapWords };
