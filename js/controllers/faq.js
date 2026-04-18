export function initFaqAccordion() {
  const items = Array.from(document.querySelectorAll(".faq-list details"));
  if (items.length === 0) return;

  const reduceMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const transitionDuration = 360;
  const expandedClass = "is-expanded";
  let switching = false;

  function finishClose(item, summary) {
    item.classList.remove("is-closing");
    item.classList.remove("is-opening");
    item.classList.remove(expandedClass);
    if (summary) summary.setAttribute("aria-expanded", "false");
  }

  function closeItem(item, summary) {
    if (!item.classList.contains(expandedClass) || item.classList.contains("is-closing")) {
      return Promise.resolve();
    }

    const drawer = item.querySelector(".faq-drawer");

    if (reduceMotion) {
      if (drawer) drawer.style.maxHeight = "0px";
      finishClose(item, summary);
      return Promise.resolve();
    }

    if (!drawer) {
      finishClose(item, summary);
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      let resolved = false;
      let timer = 0;
      const currentHeight = drawer.scrollHeight;
      drawer.style.maxHeight = `${currentHeight}px`;
      void drawer.offsetHeight;

      const done = () => {
        if (resolved) return;
        resolved = true;
        window.clearTimeout(timer);
        drawer.removeEventListener("transitionend", onTransitionEnd);
        drawer.style.maxHeight = "0px";
        finishClose(item, summary);
        resolve();
      };

      const onTransitionEnd = (event) => {
        if (event.target !== drawer) return;
        done();
      };

      item.classList.remove("is-opening");
      item.classList.add("is-closing");
      if (summary) summary.setAttribute("aria-expanded", "false");
      drawer.addEventListener("transitionend", onTransitionEnd);
      drawer.style.maxHeight = "0px";
      timer = window.setTimeout(done, transitionDuration + 60);
    });
  }

  function openItem(item, summary) {
    const drawer = item.querySelector(".faq-drawer");

    item.classList.add(expandedClass);
    item.classList.remove("is-closing");
    if (summary) summary.setAttribute("aria-expanded", "true");

    if (!drawer) return;

    const openHeight = drawer.scrollHeight;
    drawer.style.setProperty("--faq-open-height", `${openHeight}px`);

    if (reduceMotion) {
      item.classList.remove("is-opening");
      drawer.style.maxHeight = `${openHeight}px`;
      return;
    }

    drawer.style.maxHeight = "0px";
    void drawer.offsetHeight;
    item.classList.add("is-opening");
    drawer.style.maxHeight = `${openHeight}px`;

    let resolved = false;
    let timer = 0;
    const done = () => {
      if (resolved) return;
      resolved = true;
      window.clearTimeout(timer);
      drawer.removeEventListener("transitionend", onTransitionEnd);
      item.classList.remove("is-opening");
      drawer.style.maxHeight = `${drawer.scrollHeight}px`;
    };
    const onTransitionEnd = (event) => {
      if (event.target !== drawer) return;
      done();
    };
    drawer.addEventListener("transitionend", onTransitionEnd);
    timer = window.setTimeout(done, transitionDuration + 60);
  }

  items.forEach((item) => {
    const summary = item.querySelector("summary");
    const drawer = item.querySelector(".faq-drawer");
    if (!summary) return;

    const initiallyExpanded = item.hasAttribute("open");
    item.open = true;
    item.classList.toggle(expandedClass, initiallyExpanded);
    summary.setAttribute("aria-expanded", initiallyExpanded ? "true" : "false");

    if (drawer) {
      drawer.style.setProperty("--faq-open-height", `${drawer.scrollHeight}px`);
      drawer.style.maxHeight = initiallyExpanded ? `${drawer.scrollHeight}px` : "0px";
    }

    summary.addEventListener("click", async (event) => {
      event.preventDefault();
      if (switching) return;

      const isActive =
        item.classList.contains(expandedClass) && !item.classList.contains("is-closing");
      switching = true;

      if (isActive) {
        await closeItem(item, summary);
        switching = false;
        return;
      }

      const others = items.filter((other) => other !== item);
      await Promise.all(others.map((other) => closeItem(other, other.querySelector("summary"))));
      openItem(item, summary);
      switching = false;
    });
  });

  function closeAllOnOutside(e) {
    const faqList = document.querySelector(".faq-list");
    if (!faqList || faqList.contains(e.target)) return;
    items.forEach((item) => closeItem(item, item.querySelector("summary")));
  }

  document.addEventListener("click", closeAllOnOutside);
  document.addEventListener("touchstart", closeAllOnOutside, { passive: true });

  window.addEventListener(
    "resize",
    () => {
      items.forEach((item) => {
        const drawer = item.querySelector(".faq-drawer");
        if (!drawer) return;
        drawer.style.setProperty("--faq-open-height", `${drawer.scrollHeight}px`);
        if (item.classList.contains(expandedClass)) {
          drawer.style.maxHeight = `${drawer.scrollHeight}px`;
        }
      });
    },
    { passive: true }
  );
}
