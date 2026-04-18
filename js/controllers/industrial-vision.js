/**

 * Industrial Vision — intro + panel entrance, parallax orbs; pillar selection by click / keyboard only (no hover swap).

 */

export function initIndustrialVision() {

  const section = document.getElementById("industrialVision");

  if (!section) return;

  if (!window.gsap || !window.ScrollTrigger) return;

  // Kill any existing ScrollTriggers for this section to avoid stale positions
  window.ScrollTrigger.getAll()
    .filter(st => st.trigger === section)
    .forEach(st => st.kill());



  const gsap = window.gsap;

  gsap.registerPlugin(window.ScrollTrigger);



  const intro = section.querySelector(".industrial-vision-intro");

  const panel = section.querySelector(".industrial-vision-panel");

  const items = section.querySelectorAll("[data-iv-item]");

  const orbs = section.querySelectorAll(".industrial-vision-orb");



  if (!intro || !items.length) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;



  function setActive(target) {

    items.forEach((item) => {

      const on = item === target;

      item.classList.toggle("is-active", on);

      item.setAttribute("aria-current", on ? "true" : "false");

      item.setAttribute("tabindex", on ? "0" : "-1");

    });

  }



  const initial = section.querySelector(".industrial-vision-item.is-active") || items[0];

  if (initial) setActive(initial);

  items.forEach((item) => {

    item.addEventListener("click", () => setActive(item));

    item.addEventListener("keydown", (e) => {

      const list = Array.from(items);

      const i = list.indexOf(item);

      if (e.key === "Enter" || e.key === " ") {

        e.preventDefault();

        setActive(item);

        return;

      }

      if (e.key === "ArrowDown" && i < list.length - 1) {

        e.preventDefault();

        list[i + 1].focus();

        setActive(list[i + 1]);

      } else if (e.key === "ArrowUp" && i > 0) {

        e.preventDefault();

        list[i - 1].focus();

        setActive(list[i - 1]);

      }

    });

  });



  if (prefersReducedMotion) return;

  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  const enterTargets = panel ? [intro, panel] : [intro];

  if (isTouch) {
    // Touch: IntersectionObserver, zero ScrollTrigger
    const allEls = [...enterTargets, ...Array.from(items)];
    // Set hidden with no transition first so browser paints them invisible
    allEls.forEach((el) => {
      el.style.transition = 'none';
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
    });
    let delay = 0;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const d = delay; delay += 70;
        // Double rAF so hidden state is committed before transition starts
        requestAnimationFrame(() => requestAnimationFrame(() => {
          setTimeout(() => {
            el.style.transition = 'opacity 0.7s cubic-bezier(0.22,1,0.36,1), transform 0.7s cubic-bezier(0.22,1,0.36,1)';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
          }, d);
        }));
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -5% 0px', threshold: 0.05 });
    requestAnimationFrame(() => requestAnimationFrame(() => {
      allEls.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.5) {
          el.style.transition = 'none';
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        } else {
          io.observe(el);
        }
      });
    }));
    return;
  }

  // Desktop: GSAP ScrollTrigger entrance
  gsap.set(enterTargets, { opacity: 0, y: 36 });
  gsap.set(items, { opacity: 0, y: 28 });

  const tl = gsap.timeline({ scrollTrigger: { trigger: section, start: "top 90%", once: true } });
  tl.to(enterTargets, { opacity: 1, y: 0, duration: 0.75, stagger: 0.12, ease: "power3.out" })
    .to(items, { opacity: 1, y: 0, duration: 0.55, stagger: 0.07, ease: "power3.out" }, "-=0.35");

  if (!isTouch) {
    orbs.forEach((orb, i) => {

      gsap.to(orb, {

        y: i % 2 ? -44 : 52,

        x: i % 2 ? 24 : -18,

        scrollTrigger: {

          trigger: section,

          start: "top bottom",

          end: "bottom top",

          scrub: 1.15,

        },

      });

    });
  }

}


