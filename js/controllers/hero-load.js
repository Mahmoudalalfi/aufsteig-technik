/**
 * Cinematic hero entrance on first page load.
 *
 * Sequence:
 *  1. Eyebrow text fades + rises
 *  2. H1 words stagger up through clip (uses wrapWords from split-reveal.js)
 *  3. Body paragraph fades in
 *  4. CTA bar slides up
 *
 * A subtle "reveal curtain" also wipes up from the nav pill.
 */
import { wrapWords } from './split-reveal.js';

export function initHeroLoad() {
  if (!window.gsap) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const gsap = window.gsap;

  const eyebrow  = document.querySelector('.hero-copy .eyebrow');
  const h1       = document.querySelector('.hero-copy h1');
  const bodyText = document.querySelector('.hero-copy > p');
  const ctaBar   = document.querySelector('.hero-cta-bar');
  const navPill  = document.querySelector('.nav-pill');

  const killList = [eyebrow, bodyText, ctaBar, navPill, h1].filter(Boolean);
  if (h1) killList.push(...h1.querySelectorAll('.sw-inner'));
  gsap.killTweensOf(killList);

  /* i18n apply() uses textContent on title spans and strips prior wrapWords() markup. */
  if (h1 && !h1.querySelector('.sw-inner')) {
    wrapWords(h1);
  }

  const h1Spans = h1 ? h1.querySelectorAll('.sw-inner') : [];

  // Set initial states
  if (eyebrow)  gsap.set(eyebrow,  { opacity: 0, y: 18 });
  if (h1Spans.length) gsap.set(h1Spans, { yPercent: 150, opacity: 0 });
  else if (h1)  gsap.set(h1,       { opacity: 0, y: 32 });
  if (bodyText) gsap.set(bodyText, { opacity: 0, y: 22 });
  if (ctaBar)   gsap.set(ctaBar,   { opacity: 0, y: 22 });
  if (navPill)  gsap.set(navPill,  { opacity: 0, y: -14, scale: 0.94 });

  const tl = gsap.timeline({ delay: 0.18 });

  // Nav pill drops in first
  if (navPill) {
    tl.to(navPill, {
      opacity: 1, y: 0, scale: 1,
      duration: 0.6, ease: 'power3.out',
    });
  }

  // Eyebrow
  if (eyebrow) {
    tl.to(eyebrow, {
      opacity: 1, y: 0,
      duration: 0.65, ease: 'power2.out',
    }, '-=0.3');
  }

  // H1 words stagger
  if (h1Spans.length) {
    tl.to(h1Spans, {
      yPercent: 0, opacity: 1,
      duration: 0.82, ease: 'power3.out',
      stagger: 0.055,
    }, '-=0.38');
  } else if (h1) {
    tl.to(h1, { opacity: 1, y: 0, duration: 0.82, ease: 'power3.out' }, '-=0.38');
  }

  // Body paragraph
  if (bodyText) {
    tl.to(bodyText, {
      opacity: 1, y: 0,
      duration: 0.68, ease: 'power2.out',
    }, '-=0.52');
  }

  // CTA bar
  if (ctaBar) {
    tl.to(ctaBar, {
      opacity: 1, y: 0,
      duration: 0.68, ease: 'power2.out',
    }, '-=0.48');
  }
}
