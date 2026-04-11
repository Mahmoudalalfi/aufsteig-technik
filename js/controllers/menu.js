export function initMenu(refs) {
  const { menuToggle, menuPanel } = refs;
  if (!menuToggle || !menuPanel) return;

  menuToggle.addEventListener("click", () => {
    const isOpen = menuPanel.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  menuPanel.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuPanel.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

export function initMenuStripIndicator() {
  const strip = document.querySelector(".menu-strip");
  if (!strip) return;

  const indicator = strip.querySelector(".menu-strip-indicator");
  const links = Array.from(strip.querySelectorAll("a"));
  if (!indicator || links.length === 0) return;

  function moveTo(link) {
    const width = Math.round(link.offsetWidth);
    const x = Math.round(link.offsetLeft);
    indicator.style.width = `${width}px`;
    indicator.style.transform = `translateX(${x}px)`;
  }

  function setCurrent(link) {
    links.forEach((item) => item.classList.remove("is-current"));
    if (link) link.classList.add("is-current");
  }

  function activeLink() {
    return strip.querySelector("a.is-active") || links[0];
  }

  moveTo(activeLink());
  setCurrent(activeLink());

  links.forEach((link) => {
    link.addEventListener("mouseenter", () => {
      moveTo(link);
      setCurrent(link);
    });
    link.addEventListener("focus", () => {
      moveTo(link);
      setCurrent(link);
    });
  });

  strip.addEventListener("mouseleave", () => {
    const active = activeLink();
    moveTo(active);
    setCurrent(active);
  });

  window.addEventListener(
    "resize",
    () => {
      const active = activeLink();
      moveTo(active);
      setCurrent(active);
    },
    { passive: true }
  );

  window.addEventListener("load", () => {
    const active = activeLink();
    moveTo(active);
    setCurrent(active);
  });

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      const active = activeLink();
      moveTo(active);
      setCurrent(active);
    });
  }
}
