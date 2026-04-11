/**
 * Renders a thin gradient progress line fixed at the top of the viewport.
 * Uses GSAP ScrollTrigger when available, falls back to a scroll listener.
 */
export function initScrollProgress() {
  const bar = document.createElement('div');
  bar.className = 'scroll-progress-bar';
  bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);

  if (window.gsap && window.ScrollTrigger) {
    window.ScrollTrigger.create({
      trigger: document.documentElement,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0,
      onUpdate(self) {
        bar.style.transform = `scaleX(${self.progress})`;
      },
    });
  } else {
    const update = () => {
      const s = window.scrollY;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = `scaleX(${h > 0 ? s / h : 0})`;
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
  }
}
