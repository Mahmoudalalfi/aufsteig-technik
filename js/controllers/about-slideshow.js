/**
 * About Section Slideshow
 * Smooth crossfade auto-playing slideshow with progress bar, dot & arrow navigation.
 */
export function initAboutSlideshow() {
  const root = document.getElementById('aboutSlideshow');
  if (!root) return;

  const slides = Array.from(root.querySelectorAll('.about-slide'));
  const dots = Array.from(root.querySelectorAll('[data-slide-dot]'));
  const arrows = Array.from(root.querySelectorAll('[data-slide-dir]'));
  const progressBar = document.getElementById('aboutSlideshowProgress');

  if (slides.length < 2) return;

  const INTERVAL = 5000;      // 5 seconds per slide
  const TICK = 40;             // progress update interval in ms

  let current = 0;
  let timer = null;
  let progressTimer = null;
  let elapsed = 0;
  let paused = false;

  function goTo(index, skipAnimation) {
    if (index === current && !skipAnimation) return;

    const prev = current;
    current = ((index % slides.length) + slides.length) % slides.length;

    // Animate exit
    slides[prev].classList.add('is-exiting');
    slides[prev].classList.remove('is-active');

    // Activate new slide
    slides[current].classList.add('is-active');
    slides[current].classList.remove('is-exiting');

    // Clean up exiting class after animation
    setTimeout(() => {
      slides[prev].classList.remove('is-exiting');
    }, 900);

    // Update dots
    dots.forEach((d, i) => d.classList.toggle('is-active', i === current));

    // Reset progress
    resetProgress();
  }

  function next() {
    goTo(current + 1);
  }

  function prev() {
    goTo(current - 1);
  }

  function resetProgress() {
    elapsed = 0;
    if (progressBar) progressBar.style.width = '0%';
  }

  function startAutoplay() {
    stopAutoplay();
    resetProgress();

    progressTimer = setInterval(() => {
      if (paused) return;
      elapsed += TICK;
      const pct = Math.min((elapsed / INTERVAL) * 100, 100);
      if (progressBar) progressBar.style.width = pct + '%';

      if (elapsed >= INTERVAL) {
        next();
      }
    }, TICK);
  }

  function stopAutoplay() {
    if (progressTimer) {
      clearInterval(progressTimer);
      progressTimer = null;
    }
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  }

  // Arrow clicks
  arrows.forEach(btn => {
    btn.addEventListener('click', () => {
      const dir = btn.dataset.slideDir;
      if (dir === 'next') next();
      else prev();
      startAutoplay();
    });
  });

  // Dot clicks
  dots.forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.slideDot, 10);
      goTo(idx);
      startAutoplay();
    });
  });

  // Pause on hover
  root.addEventListener('mouseenter', () => { paused = true; });
  root.addEventListener('mouseleave', () => { paused = false; });

  // Touch/swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  root.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    paused = true;
  }, { passive: true });

  root.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) next();
      else prev();
    }
    paused = false;
    startAutoplay();
  }, { passive: true });

  // Visibility API — pause when tab is hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      paused = true;
    } else {
      paused = false;
    }
  });

  // Intersection Observer — only autoplay when in view
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          paused = false;
          if (!progressTimer) startAutoplay();
        } else {
          paused = true;
        }
      });
    },
    { threshold: 0.2 }
  );
  observer.observe(root);

  // Init
  startAutoplay();
}
