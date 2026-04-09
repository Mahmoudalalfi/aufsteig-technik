import { ACHIEVEMENT_PROJECTS } from "../model/achievements.js";

function bindAchievementCompare(compareRoot, handleEl) {
  if (!compareRoot || !handleEl) return;

  let dragging = false;
  let activePointerId = null;

  function pctFromClientX(clientX) {
    const rect = compareRoot.getBoundingClientRect();
    if (rect.width <= 0) return 50;
    return ((clientX - rect.left) / rect.width) * 100;
  }

  function setComparePct(rawPct) {
    const pct = Math.max(0, Math.min(100, rawPct));
    compareRoot.style.setProperty("--compare-pct", String(pct));
    handleEl.setAttribute("aria-valuenow", String(Math.round(pct)));
  }

  function onPointerDown(e) {
    if (e.button !== 0) return;
    dragging = true;
    activePointerId = e.pointerId;
    compareRoot.setPointerCapture(e.pointerId);
    setComparePct(pctFromClientX(e.clientX));
  }

  function onPointerMove(e) {
    if (!dragging || e.pointerId !== activePointerId) return;
    setComparePct(pctFromClientX(e.clientX));
  }

  function endDrag(e) {
    if (e.pointerId !== activePointerId) return;
    dragging = false;
    activePointerId = null;
    try {
      compareRoot.releasePointerCapture(e.pointerId);
    } catch {}
  }

  function onKeyDown(e) {
    if (e.target !== handleEl) return;
    const step = e.shiftKey ? 12 : 5;
    const current = Number.parseFloat(
      getComputedStyle(compareRoot).getPropertyValue("--compare-pct").trim()
    );
    const base = Number.isFinite(current) ? current : 50;
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      setComparePct(base - step);
    } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      setComparePct(base + step);
    } else if (e.key === "Home") {
      e.preventDefault();
      setComparePct(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setComparePct(100);
    }
  }

  compareRoot.addEventListener("pointerdown", onPointerDown);
  compareRoot.addEventListener("pointermove", onPointerMove);
  compareRoot.addEventListener("pointerup", endDrag);
  compareRoot.addEventListener("pointercancel", endDrag);
  handleEl.addEventListener("keydown", onKeyDown);
}

export function initAchievementShowcase() {
  const showcase = document.getElementById("achievementShowcase");
  const compareRoot = document.getElementById("achievementCompare");
  const imageBeforeEl = document.getElementById("achievementImageBefore");
  const imageAfterEl = document.getElementById("achievementImageAfter");
  const handleEl = document.getElementById("achievementCompareHandle");
  const titleEl = document.getElementById("achievementTitle");
  const messageEl = document.getElementById("achievementMessage");
  const highlightsEl = document.getElementById("achievementHighlights");
  const dotsWrap = document.getElementById("achievementDots");
  if (
    !showcase ||
    !compareRoot ||
    !imageBeforeEl ||
    !imageAfterEl ||
    !handleEl ||
    !titleEl ||
    !messageEl ||
    !highlightsEl ||
    !dotsWrap
  ) {
    return;
  }

  const projects = ACHIEVEMENT_PROJECTS;
  const dots = Array.from(dotsWrap.querySelectorAll("[data-achievement-dot]"));
  let active = 0;
  let intervalId = null;

  function setComparePct(pct) {
    const v = Math.max(0, Math.min(100, pct));
    compareRoot.style.setProperty("--compare-pct", String(v));
    handleEl.setAttribute("aria-valuenow", String(Math.round(v)));
  }

  bindAchievementCompare(compareRoot, handleEl);

  function syncDots() {
    dots.forEach((dot, idx) => {
      const isActive = idx === active;
      dot.classList.toggle("is-active", isActive);
      dot.setAttribute("aria-selected", isActive ? "true" : "false");
    });
  }

  function render(nextIndex, animate = true) {
    active = ((nextIndex % projects.length) + projects.length) % projects.length;
    const project = projects[active];

    const apply = () => {
      imageBeforeEl.src = project.imageBefore;
      imageAfterEl.src = project.imageAfter;
      titleEl.textContent = project.title;
      messageEl.textContent = project.message;
      highlightsEl.innerHTML = project.highlights.map((line) => `<li>${line}</li>`).join("");
      setComparePct(50);
      syncDots();
    };

    if (!animate) {
      apply();
      return;
    }

    showcase.classList.add("is-transitioning");
    window.setTimeout(() => {
      apply();
      showcase.classList.remove("is-transitioning");
    }, 260);
  }

  function startAuto() {
    if (intervalId) return;
    intervalId = window.setInterval(() => render(active + 1, true), 4600);
  }

  function stopAuto() {
    if (!intervalId) return;
    window.clearInterval(intervalId);
    intervalId = null;
  }

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const idx = Number(dot.getAttribute("data-achievement-dot"));
      render(idx, true);
    });
  });

  const achievementCarousel = document.getElementById("achievementCarousel");
  const achievementPrev = achievementCarousel?.querySelector('[data-achievement-action="prev"]');
  const achievementNext = achievementCarousel?.querySelector('[data-achievement-action="next"]');
  achievementPrev?.addEventListener("click", () => {
    render(active - 1, true);
  });
  achievementNext?.addEventListener("click", () => {
    render(active + 1, true);
  });

  showcase.addEventListener("mouseenter", stopAuto);
  showcase.addEventListener("mouseleave", startAuto);
  showcase.addEventListener("focusin", stopAuto);
  showcase.addEventListener("focusout", startAuto);

  render(0, false);
  startAuto();
}
