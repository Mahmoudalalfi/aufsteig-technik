/**
 * Scroll / motion tuning for touch, narrow viewports, and reduced motion.
 * Lenis + iOS Safari momentum scrolling often fights GSAP ScrollTrigger; native scroll is smoother on phones.
 */
export function getMotionProfile() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const narrowViewport = window.matchMedia("(max-width: 900px)").matches;
  const touchLike = coarsePointer || narrowViewport;
  const useLenis = !reduceMotion && !touchLike;

  if (reduceMotion) {
    return {
      reduceMotion: true,
      touchLike,
      useLenis: false,
      scrubHero: 0.22,
      scrubService: 0.22,
      scrub: 0.22,
      scrubBottom: 0.24,
      heroLerp: 0.35,
      maxCanvasDpr: 2
    };
  }

  return {
    reduceMotion: false,
    touchLike,
    useLenis,
    scrubHero: touchLike ? 1.42 : 1.15,
    scrubService: touchLike ? 1.22 : 1.05,
    scrub: touchLike ? 1.14 : 1,
    scrubBottom: touchLike ? 1.32 : 1.08,
    heroLerp: touchLike ? 0.2 : 0.16,
    maxCanvasDpr: touchLike ? 2 : 2.75
  };
}
