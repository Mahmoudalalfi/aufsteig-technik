import { clamp } from "../utils/math.js";

export function initProjectDeck() {
  const deck = document.getElementById("projectDeck");
  if (!deck) return;

  const cards = Array.from(deck.querySelectorAll(".project-deck-card"));
  if (cards.length === 0) return;

  const dots = Array.from(document.querySelectorAll(".project-deck-dots [data-deck-dot]"));
  const navButtons = Array.from(deck.querySelectorAll("[data-deck-action]"));
  const deckState = { active: 0 };

  const lastIndex = cards.length - 1;
  deck.setAttribute("tabindex", "0");

  function deckPeekPx() {
    const w = window.innerWidth;
    if (w <= 640) return 52;
    if (w <= 980) return 96;
    return 172;
  }

  function syncDots() {
    dots.forEach((dot) => {
      const idx = Number(dot.getAttribute("data-deck-dot"));
      dot.classList.toggle("is-active", idx === deckState.active);
      dot.setAttribute("aria-selected", idx === deckState.active ? "true" : "false");
    });
  }

  function renderDeck() {
    const peek = deckPeekPx();

    cards.forEach((card, idx) => {
      const rel = idx - deckState.active;
      const abs = Math.abs(rel);
      const isActive = rel === 0;
      const side = rel < 0 ? -1 : 1;

      let x;
      let y;
      let scale;
      let opacity;
      let blur;
      let z;

      if (abs === 0) {
        x = 0;
        y = 0;
        scale = 1;
        opacity = 1;
        blur = 0;
        z = 100;
      } else if (abs === 1) {
        x = rel * peek;
        y = 10;
        scale = 0.96;
        opacity = 0.9;
        blur = 0.6;
        z = 84;
      } else {
        x = side * 220;
        y = 14;
        scale = 0.92;
        opacity = 0.2;
        blur = 2.2;
        z = 64;
      }

      card.style.transform = `translate3d(calc(-50% + ${x}px), ${y}px, 0) scale(${scale}) rotate(0deg)`;
      card.style.opacity = String(opacity);
      card.style.zIndex = String(z);
      card.style.pointerEvents = isActive ? "auto" : "none";
      card.style.filter = `blur(${blur.toFixed(2)}px)`;
      card.classList.toggle("is-front", isActive);
      card.setAttribute("aria-hidden", isActive ? "false" : "true");
    });

    syncDots();
  }

  function goToIndex(target) {
    const to = clamp(target, 0, lastIndex);
    if (to === deckState.active) {
      return;
    }

    deckState.active = to;
    renderDeck();
  }

  deck.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goToIndex(deckState.active + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goToIndex(deckState.active - 1);
    }
  });

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const idx = Number(dot.getAttribute("data-deck-dot"));
      goToIndex(idx);
    });
  });

  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const action = btn.getAttribute("data-deck-action");
      if (action === "next") {
        goToIndex(deckState.active + 1);
      } else {
        goToIndex(deckState.active - 1);
      }
    });
  });

  let swipeX0 = null;
  deck.addEventListener(
    "touchstart",
    (e) => {
      if (!e.changedTouches[0]) return;
      swipeX0 = e.changedTouches[0].clientX;
    },
    { passive: true }
  );
  deck.addEventListener(
    "touchend",
    (e) => {
      if (swipeX0 == null || !e.changedTouches[0]) return;
      const dx = e.changedTouches[0].clientX - swipeX0;
      swipeX0 = null;
      if (Math.abs(dx) < 48) return;
      if (dx < 0) goToIndex(deckState.active + 1);
      else goToIndex(deckState.active - 1);
    },
    { passive: true }
  );
  deck.addEventListener("touchcancel", () => {
    swipeX0 = null;
  });

  window.addEventListener("resize", renderDeck, { passive: true });
  renderDeck();
}
