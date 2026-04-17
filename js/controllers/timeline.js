export function initTimeline() {
  const track = document.getElementById('timelineTrack');
  const svg   = document.getElementById('tlSnakeSvg');
  const path  = document.getElementById('tlSnakePath');
  if (!track || !svg || !path) return;

  // Build the snake path through each node dot centre
  function buildSnakePath() {
    const trackRect = track.getBoundingClientRect();
    const dots = track.querySelectorAll('.tl-node-dot');
    if (!dots.length) return;

    const points = Array.from(dots).map(dot => {
      const r = dot.getBoundingClientRect();
      return {
        x: r.left - trackRect.left + r.width / 2,
        y: r.top  - trackRect.top  + r.height / 2,
      };
    });

    // Build smooth cubic bezier snake through all points
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const midY = (prev.y + curr.y) / 2;
      // Control points create the S-curve swing
      d += ` C ${prev.x} ${midY}, ${curr.x} ${midY}, ${curr.x} ${curr.y}`;
    }

    path.setAttribute('d', d);

    // Set dasharray to total path length
    const len = path.getTotalLength();
    path.style.strokeDasharray = len;
    path.style.strokeDashoffset = len;
    return len;
  }

  let pathLen = buildSnakePath();
  window.addEventListener('resize', () => { pathLen = buildSnakePath(); });

  // Animate draw on scroll using ScrollTrigger if available
  if (window.gsap && window.ScrollTrigger) {
    window.ScrollTrigger.create({
      trigger: track,
      start: 'top 80%',
      end: 'bottom 20%',
      scrub: 1.2,
      onUpdate(self) {
        const offset = pathLen * (1 - self.progress);
        path.style.strokeDashoffset = offset;
      },
    });
  } else {
    // Fallback: IntersectionObserver fade-draw
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          path.style.transition = 'stroke-dashoffset 2.4s cubic-bezier(0.22,1,0.36,1)';
          path.style.strokeDashoffset = 0;
        }
      });
    }, { threshold: 0.1 });
    observer.observe(track);
  }
}
