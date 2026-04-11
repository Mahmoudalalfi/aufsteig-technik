/**
 * 3-D perspective tilt on hover for elements with class .tilt-card.
 * Rotates toward the cursor, scales up slightly, and springs back on leave.
 * Skipped on touch devices and when reduced-motion is preferred.
 */
export function initCardTilt() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!window.gsap) return;

  const gsap = window.gsap;
  const MAX_TILT  = 9;    // degrees
  const DURATION  = 0.35;

  document.querySelectorAll('.tilt-card').forEach((card) => {
    // Needed for child elements to feel the 3-D space
    gsap.set(card, { transformStyle: 'preserve-3d', transformPerspective: 800 });

    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left)  / r.width  - 0.5;   // -0.5 → 0.5
      const y = (e.clientY - r.top)   / r.height - 0.5;

      gsap.to(card, {
        rotateX: -y * MAX_TILT * 2,
        rotateY: x * MAX_TILT * 2,
        scale: 1.025,
        duration: DURATION,
        ease:     'power2.out',
        overwrite: 'auto',
      });

      // Subtle inner shine that follows the cursor
      const shine = card._tiltShine;
      if (shine) {
        const px = (x + 0.5) * 100;
        const py = (y + 0.5) * 100;
        gsap.to(shine, {
          opacity:  0.12,
          background: `radial-gradient(circle at ${px}% ${py}%, rgba(255,255,255,0.55) 0%, transparent 68%)`,
          duration: DURATION,
          ease:     'power2.out',
          overwrite: 'auto',
        });
      }
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateX:  0,
        rotateY:  0,
        scale:    1,
        duration: 0.65,
        ease:     'elastic.out(1, 0.4)',
        overwrite: 'auto',
      });
      const shine = card._tiltShine;
      if (shine) {
        gsap.to(shine, { opacity: 0, duration: 0.4, overwrite: 'auto' });
      }
    });

    // Inject a shine overlay inside each tilt card
    const shine = document.createElement('span');
    shine.className = 'tilt-shine';
    shine.setAttribute('aria-hidden', 'true');
    card.appendChild(shine);
    card._tiltShine = shine;
  });
}
