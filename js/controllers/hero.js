/**
 * Full-viewport hero background video (no scroll-scrubbed frame sequence).
 */
export function initHero(refs) {
  const video = refs.heroVideo;
  if (!video || video.tagName !== "VIDEO") return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    video.pause();
    video.removeAttribute("autoplay");
    return;
  }

  const tryPlay = () => {
    const p = video.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
  };

  tryPlay();

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) video.pause();
    else tryPlay();
  });

  const { heroSequence } = refs;
  if (heroSequence && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        const vis = !!(entries[0] && entries[0].isIntersecting);
        if (vis) tryPlay();
        else video.pause();
      },
      { threshold: [0, 0.06] }
    );
    io.observe(heroSequence);
  }
}
