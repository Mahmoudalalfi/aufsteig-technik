/**
 * Cinematic hero entrance — v3.
 *
 * Sequence:
 *  1. Nav pill drops in
 *  2. Eyebrow fades + slides from left
 *  3. Serif headline words cascade up through clip
 *  4. Light tracking subline fades up
 *  5. Desc fades
 *  6. Buttons rise
 *  7. Scroll cue fades
 */
import { wrapWords } from './split-reveal.js';

export function initHeroLoad() {
  if (!window.gsap) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const gsap = window.gsap;

  const eyebrow   = document.querySelector('.hero-overlay > .eyebrow');
  const serifLine = document.querySelector('.h1-line--serif');
  const lightLine = document.querySelector('.h1-line--light');
  const desc      = document.querySelector('.hero-desc');
  const actions   = document.querySelector('.hero-actions');
  const scrollCue = document.querySelector('.hero-scroll-cue');
  const sidePanel = document.querySelector('.hero-side-panel');
  const navPill   = document.querySelector('.nav-pill');

  // Wrap serif headline words for the clip reveal
  if (serifLine && !serifLine.querySelector('.sw-inner')) {
    wrapWords(serifLine);
  }
  const serifSpans = serifLine ? serifLine.querySelectorAll('.sw-inner') : [];

  // Kill stale tweens
  gsap.killTweensOf([eyebrow, lightLine, desc, actions, scrollCue, sidePanel, navPill].filter(Boolean));
  if (serifSpans.length) gsap.killTweensOf(serifSpans);

  // ── Initial states ──────────────────────────────────────────
  if (navPill)           gsap.set(navPill,     { opacity: 0, y: -12, scale: 0.95 });
  if (eyebrow)           gsap.set(eyebrow,     { opacity: 0, x: -22 });
  if (serifSpans.length) gsap.set(serifSpans,  { yPercent: 105, opacity: 0 });
  else if (serifLine)    gsap.set(serifLine,   { opacity: 0, y: 30 });
  if (lightLine)         gsap.set(lightLine,   { opacity: 0, y: 14 });
  if (desc)              gsap.set(desc,        { opacity: 0, y: 12 });
  if (actions)           gsap.set(actions,     { opacity: 0, y: 10 });
  if (scrollCue)         gsap.set(scrollCue,   { opacity: 0 });
  if (sidePanel)         gsap.set(sidePanel,   { opacity: 0, x: 36 });

  // ── Timeline ────────────────────────────────────────────────
  const tl = gsap.timeline({ delay: 0.12 });

  if (navPill) {
    tl.to(navPill, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out' });
  }

  if (eyebrow) {
    tl.to(eyebrow, { opacity: 1, x: 0, duration: 0.65, ease: 'power2.out' }, '-=0.28');
  }

  if (serifSpans.length) {
    tl.to(serifSpans, {
      yPercent: 0, opacity: 1,
      duration: 1.05, ease: 'power3.out',
      stagger: 0.036,
    }, '-=0.38');
  } else if (serifLine) {
    tl.to(serifLine, { opacity: 1, y: 0, duration: 0.95, ease: 'power3.out' }, '-=0.38');
  }

  if (lightLine) {
    tl.to(lightLine, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '-=0.62');
  }

  if (desc) {
    tl.to(desc, { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out' }, '-=0.42');
  }

  if (actions) {
    tl.to(actions, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.48');
  }

  if (sidePanel) {
    tl.to(sidePanel, { opacity: 1, x: 0, duration: 0.85, ease: 'power3.out' }, '-=0.6');
  }

  if (scrollCue) {
    tl.to(scrollCue, { opacity: 1, duration: 0.5, ease: 'power1.out' }, '-=0.3');
  }
}
