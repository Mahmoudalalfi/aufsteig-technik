/**
 * Magnetic button effect.
 * Elements with class .btn-magnetic slightly follow the cursor,
 * then snap back with an elastic spring when the mouse leaves.
 * Touch devices are skipped.
 */
export function initMagnetic() {
  // Only pointer devices — skip touch-only hardware
  if (window.matchMedia('(pointer: coarse)').matches) return;
  if (!window.gsap) return;

  const gsap = window.gsap;

  document.querySelectorAll('.btn-magnetic').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const r  = btn.getBoundingClientRect();
      const cx = r.left + r.width  / 2;
      const cy = r.top  + r.height / 2;
      const dx = (e.clientX - cx) * 0.32;
      const dy = (e.clientY - cy) * 0.32;
      gsap.to(btn, {
        x:        dx,
        y:        dy,
        duration: 0.32,
        ease:     'power2.out',
        overwrite: 'auto',
      });
    });

    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, {
        x:        0,
        y:        0,
        duration: 0.72,
        ease:     'elastic.out(1, 0.42)',
        overwrite: 'auto',
      });
    });

    // Subtle scale on press
    btn.addEventListener('mousedown', () => {
      gsap.to(btn, { scale: 0.95, duration: 0.14, ease: 'power2.out' });
    });
    btn.addEventListener('mouseup', () => {
      gsap.to(btn, { scale: 1,    duration: 0.38, ease: 'elastic.out(1, 0.5)' });
    });
  });
}
