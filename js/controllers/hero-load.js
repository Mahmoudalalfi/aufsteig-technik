/**
 * Cinematic hero entrance — v3.
 *
 * Sequence:
 *  1. Nav pill drops in
 *  2. Company name (serif) fades up as a single line
 *  3. Primary + secondary taglines fade up
 *  4. Corporate highlight fades
 *  5. Desc fades
 *  6. Buttons rise
 *  7. Scroll cue fades
 */
export function initHeroLoad() {
  if (!window.gsap) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const gsap = window.gsap;

  const serifLine   = document.querySelector('.h1-line--serif');
  const primaryLine = document.querySelector('.h1-line--primary');
  const lightLine   = document.querySelector('.h1-line--light');
  const corporate   = document.querySelector('.hero-corporate');
  const desc        = document.querySelector('.hero-desc');
  const actions   = document.querySelector('.hero-actions');
  const scrollCue = document.querySelector('.hero-scroll-cue');
  const sidePanel = document.querySelector('.hero-side-panel');
  const navPill   = document.querySelector('.nav-pill');

  // Kill stale tweens
  gsap.killTweensOf([serifLine, primaryLine, lightLine, corporate, desc, actions, scrollCue, sidePanel, navPill].filter(Boolean));

  // ── Initial states ──────────────────────────────────────────
  if (navPill)           gsap.set(navPill,     { opacity: 0, y: -12, scale: 0.95 });
  if (serifLine)         gsap.set(serifLine,   { opacity: 0, y: 24 });
  if (primaryLine)       gsap.set(primaryLine, { opacity: 0, y: 14 });
  if (lightLine)         gsap.set(lightLine,   { opacity: 0, y: 14 });
  if (corporate)         gsap.set(corporate,   { opacity: 0, y: 12 });
  if (desc)              gsap.set(desc,        { opacity: 0, y: 12 });
  if (actions)           gsap.set(actions,     { opacity: 0, y: 10 });
  if (scrollCue)         gsap.set(scrollCue,   { opacity: 0 });
  if (sidePanel)         gsap.set(sidePanel,   { opacity: 0, x: 36 });

  // ── Timeline ────────────────────────────────────────────────
  const tl = gsap.timeline({ delay: 0.12 });

  if (navPill) {
    tl.to(navPill, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out' });
  }

  if (serifLine) {
    tl.to(serifLine, { opacity: 1, y: 0, duration: 0.85, ease: 'power3.out' }, '-=0.38');
  }

  if (primaryLine) {
    tl.to(primaryLine, { opacity: 1, y: 0, duration: 0.72, ease: 'power2.out' }, '-=0.58');
  }

  if (lightLine) {
    tl.to(lightLine, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '-=0.58');
  }

  if (corporate) {
    tl.to(corporate, { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out' }, '-=0.48');
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
