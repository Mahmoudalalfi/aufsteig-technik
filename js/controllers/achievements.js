import { ACHIEVEMENT_PROJECTS, getAchievements } from "../model/achievements.js";

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

/** Warm the browser cache so src swaps don’t flash blank while decoding. */
function preloadAchievementImages(projectList) {
  projectList.forEach((p) => {
    const a = new Image();
    a.decoding = "async";
    a.src = p.imageBefore;
    const b = new Image();
    b.decoding = "async";
    b.src = p.imageAfter;
  });
}

/** Shortest path on a ring: +1 = “next” visually, -1 = “prev”. */
function slideDirection(from, to, len) {
  let d = to - from;
  if (d > len / 2) d -= len;
  if (d < -len / 2) d += len;
  if (d === 0) return 1;
  return d > 0 ? 1 : -1;
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

  const slidePanelEl = showcase.querySelector(".achievement-slide-panel");

  function getLang() {
    try { return localStorage.getItem("aufsteig_sp_lang") || "en"; } catch(e) { return "en"; }
  }
  let projects = getAchievements(getLang());
  const dots = Array.from(dotsWrap.querySelectorAll("[data-achievement-dot]"));
  let active = 0;

  function refreshProjects() {
    projects = getAchievements(getLang());
    applyProject(active);
  }
  window.addEventListener("site-lang-changed", refreshProjects);
  let intervalId = null;
  let slideTl = null;

  const reducedMotion =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

  function applyProject(index) {
    const project = projects[index];
    imageBeforeEl.src = project.imageBefore;
    imageAfterEl.src = project.imageAfter;
    titleEl.textContent = project.title;
    messageEl.textContent = project.message;
    highlightsEl.innerHTML = project.highlights.map((line) => `<li>${line}</li>`).join("");
    setComparePct(50);
  }

  function resetSlideTransforms() {
    const g = window.gsap;
    if (g && slidePanelEl) {
      g.set(slidePanelEl, { x: 0, opacity: 1, overwrite: true });
    } else if (slidePanelEl) {
      slidePanelEl.style.removeProperty("transform");
      slidePanelEl.style.removeProperty("opacity");
    }
  }

  function cancelSlideTimeline() {
    if (slideTl) {
      slideTl.kill();
      slideTl = null;
    }
    showcase.classList.remove("is-ach-sliding");
    resetSlideTransforms();
  }

  function runFadeTransition(nextIndex) {
    showcase.classList.add("is-transitioning");
    window.setTimeout(() => {
      applyProject(nextIndex);
      showcase.classList.remove("is-transitioning");
    }, 260);
  }

  function runSlideTransition(dir) {
    const g = window.gsap;
    if (!g || !slidePanelEl) {
      applyProject(active);
      return;
    }

    cancelSlideTimeline();

    /*
     * Travel distance ≈ panel width (we use ~96% to shorten the “empty card” phase slightly).
     * Too small a nudge leaves most of the panel on-screen and the handoff reads as a snap.
     *
     * dir === 1 (next): exit left (−x), swap content, start from the right (+x), ease to 0.
     * dir === −1 (prev): the inverse.
     */
    const rawW = slidePanelEl.offsetWidth || showcase.clientWidth;
    /* Slightly under full width so less empty card shows during the handoff; keep ≥ ~96% to avoid snap. */
    const dist = Math.max(Math.ceil(rawW * 0.96), 112);
    const exitX = -dir * dist;
    const enterX = dir * dist;

    showcase.classList.add("is-ach-sliding");

    slideTl = g.timeline({
      onComplete: () => {
        slideTl = null;
        showcase.classList.remove("is-ach-sliding");
        /* Explicit x reset — clearProps:"transform" can leave a bad composited state and a stuck translate. */
        g.set(slidePanelEl, { x: 0, overwrite: true });
      },
    });

    slideTl.to(slidePanelEl, {
      x: exitX,
      duration: 0.48,
      ease: "power2.inOut",
      force3D: true,
    });

    slideTl.add(() => {
      applyProject(active);
      g.set(slidePanelEl, { x: enterX });
    });

    slideTl.to(slidePanelEl, {
      x: 0,
      duration: 0.55,
      ease: "power3.out",
      force3D: true,
    });
  }

  function render(nextIndex, animate = true, forcedDir) {
    const len = projects.length;
    const next = ((nextIndex % len) + len) % len;
    const from = active;
    if (next === from) return;

    const dir =
      forcedDir === 1 || forcedDir === -1 ? forcedDir : slideDirection(from, next, len);

    active = next;
    syncDots();

    if (!animate) {
      cancelSlideTimeline();
      applyProject(active);
      return;
    }

    if (reducedMotion) {
      cancelSlideTimeline();
      runFadeTransition(active);
      return;
    }

    if (window.gsap && slidePanelEl) {
      runSlideTransition(dir);
    } else {
      runFadeTransition(active);
    }
  }

  function startAuto() {
    if (intervalId) return;
    intervalId = window.setInterval(() => render(active + 1, true, 1), 4600);
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
  achievementCarousel?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-achievement-action]");
    if (!btn || !achievementCarousel.contains(btn)) return;
    e.preventDefault();
    const action = btn.getAttribute("data-achievement-action");
    if (action === "prev") render(active - 1, true, -1);
    else if (action === "next") render(active + 1, true, 1);
  });

  showcase.addEventListener("mouseenter", stopAuto);
  showcase.addEventListener("mouseleave", startAuto);
  showcase.addEventListener("focusin", stopAuto);
  showcase.addEventListener("focusout", startAuto);

  preloadAchievementImages(projects);
  render(0, false);
  startAuto();
}
