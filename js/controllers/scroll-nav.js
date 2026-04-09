export function initScrollNavMorph() {
  const topNav = document.querySelector(".top-nav");
  if (!topNav) return;

  const AT_TOP = 72;
  const COLLAPSE_AFTER = 130;
  const DELTA_UP = 3;
  const DELTA_DOWN = 4;

  let lastY = window.scrollY || 0;
  let ticking = false;

  function applyInitial() {
    const y = window.scrollY || 0;
    lastY = y;
    if (y > COLLAPSE_AFTER) topNav.classList.add("nav-scrolled");
    else topNav.classList.remove("nav-scrolled");
  }

  function update() {
    const y = window.scrollY || 0;
    const delta = y - lastY;
    lastY = y;

    if (y < AT_TOP) {
      topNav.classList.remove("nav-scrolled");
    } else if (delta < -DELTA_UP) {
      topNav.classList.remove("nav-scrolled");
    } else if (y > COLLAPSE_AFTER && delta > DELTA_DOWN) {
      topNav.classList.add("nav-scrolled");
    }

    ticking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true }
  );

  applyInitial();
}
