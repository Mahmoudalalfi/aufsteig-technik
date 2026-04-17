/**
 * Renders a thin gradient progress line fixed at the top of the viewport.
 * Uses GSAP ScrollTrigger when available, falls back to a scroll listener.
 */
export function initScrollProgress() {
  const bar = document.createElement('div');
  bar.className = 'scroll-progress-bar';
  bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);

  // Always use a passive scroll listener — scrub: 0 ScrollTrigger fires on every frame
  // and adds unnecessary overhead, especially on touch devices.
  const update = () => {
    const s = window.scrollY ?? document.documentElement.scrollTop ?? 0;
    const h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${h > 0 ? s / h : 0})`;
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
}
