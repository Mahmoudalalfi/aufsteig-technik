export function initAboutDynamics() {
  if (window.__aboutDynamicsReady) return;

  const section = document.getElementById("about");
  if (!section) return;

  const bullets     = section.querySelectorAll(".about-intro-list li");
  const trust       = section.querySelector(".trust-strip");
  const orgCard     = section.querySelector(".about-org-card");
  const orgHeading  = section.querySelector(".about-org-heading");
  const orgLead     = section.querySelector(".about-org-lead");
  const orgItems    = section.querySelectorAll(".about-org-item");
  const workCard    = section.querySelector(".about-philo-card");
  const philoHeading  = section.querySelector(".about-philo-heading");
  const philoPillars  = section.querySelectorAll(".about-philo-pillar");
  const philoCells    = section.querySelectorAll(".about-philo-cell");

  if (!bullets.length && !orgCard && !workCard) return;

  window.__aboutDynamicsReady = true;

  // Reduced motion or no animation libs: show everything immediately
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    section.classList.add("about-live");
    orgCard?.classList.add("about-org-ready");
    workCard?.classList.add("about-philo-ready");
    return;
  }

  const IS_TOUCH = window.matchMedia("(pointer: coarse)").matches;

  if (IS_TOUCH) {
    // Touch: IntersectionObserver fade-up, zero ScrollTrigger
    function ioReveal(els, yPx, staggerMs, onDone) {
      const arr = Array.isArray(els) ? els : (els instanceof NodeList ? Array.from(els) : (els ? [els] : []));
      if (!arr.length) { onDone && onDone(); return; }
      // Set hidden with no transition first
      arr.forEach((el) => {
        el.style.transition = 'none';
        el.style.opacity = '0';
        el.style.transform = `translateY(${yPx}px)`;
      });
      let delay = 0;
      let done = 0;
      function revealOne(el) {
        const d = delay; delay += staggerMs;
        requestAnimationFrame(() => requestAnimationFrame(() => {
          setTimeout(() => {
            el.style.transition = 'opacity 0.7s cubic-bezier(0.22,1,0.36,1), transform 0.7s cubic-bezier(0.22,1,0.36,1)';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
            done++;
            if (done === arr.length && onDone) onDone();
          }, d);
        }));
      }
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          revealOne(entry.target);
          io.unobserve(entry.target);
        });
      }, { rootMargin: '0px 0px -5% 0px', threshold: 0.05 });
      requestAnimationFrame(() => requestAnimationFrame(() => {
        arr.forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.top < window.innerHeight * 0.5) {
            el.style.transition = 'none';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
            done++;
            if (done === arr.length && onDone) onDone();
          } else {
            io.observe(el);
          }
        });
      }));
    }

    ioReveal(bullets, 18, 60, () => section.classList.add("about-live"));
    if (trust) ioReveal([trust], 20, 0);
    if (orgHeading) ioReveal([orgHeading], 18, 0);
    if (orgLead) ioReveal([orgLead], 12, 0);
    if (orgItems.length) ioReveal(orgItems, 28, 65, () => orgCard?.classList.add("about-org-ready"));
    if (philoHeading) ioReveal([philoHeading], 16, 0);
    if (philoPillars.length) ioReveal(philoPillars, 20, 65);
    if (philoCells.length) ioReveal(philoCells, 24, 55, () => workCard?.classList.add("about-philo-ready"));
    return;
  }

  // Desktop: GSAP ScrollTrigger path
  if (!window.gsap || !window.ScrollTrigger) return;
  const gsap = window.gsap;
  const ST   = window.ScrollTrigger;

  gsap.set(bullets, { opacity: 0, x: -22 });
  if (trust)          gsap.set(trust,         { opacity: 0, y: 20 });
  if (orgHeading)     gsap.set(orgHeading,     { opacity: 0, y: 18 });
  if (orgLead)        gsap.set(orgLead,        { opacity: 0, y: 12 });
  if (orgItems.length) gsap.set(orgItems,      { opacity: 0, y: 32 });
  if (philoHeading)   gsap.set(philoHeading,   { opacity: 0, y: 16 });
  if (philoPillars.length) gsap.set(philoPillars, { opacity: 0, y: 20 });
  if (philoCells.length)   gsap.set(philoCells,   { opacity: 0, y: 28 });

  const playIntro = () => {
    const tl = gsap.timeline({ defaults: { ease: "power2.out" }, onComplete: () => section.classList.add("about-live") });
    if (bullets.length) tl.to(bullets, { opacity: 1, x: 0, duration: 0.58, stagger: 0.085 });
    if (trust) tl.to(trust, { opacity: 1, y: 0, duration: 0.62, ease: "power3.out" }, bullets.length ? "-=0.28" : 0);
    if (!bullets.length && !trust) section.classList.add("about-live");
  };

  const playOrg = () => {
    if (!orgCard || !orgItems.length) return;
    const tl = gsap.timeline({ onComplete: () => orgCard.classList.add("about-org-ready") });
    if (orgHeading) tl.to(orgHeading, { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" });
    if (orgLead) tl.to(orgLead, { opacity: 1, y: 0, duration: 0.52, ease: "power2.out" }, orgHeading ? "-=0.28" : 0);
    tl.to(orgItems, { opacity: 1, y: 0, duration: 0.62, stagger: 0.11, ease: "power2.out" }, orgLead ? "-=0.2" : orgHeading ? "-=0.15" : 0);
  };

  const playPhilo = () => {
    if (!workCard) return;
    const tl = gsap.timeline({ onComplete: () => workCard.classList.add("about-philo-ready") });
    if (philoHeading) tl.to(philoHeading, { opacity: 1, y: 0, duration: 0.52, ease: "power3.out" });
    if (philoPillars.length) tl.to(philoPillars, { opacity: 1, y: 0, duration: 0.55, stagger: 0.11, ease: "power2.out" }, philoHeading ? "-=0.28" : 0);
    if (philoCells.length) tl.to(philoCells, { opacity: 1, y: 0, duration: 0.58, stagger: 0.1, ease: "power3.out" }, philoPillars.length ? "-=0.25" : philoHeading ? "-=0.2" : 0);
  };

  const fire = (trigger, threshold, start, fn) => {
    const r = trigger.getBoundingClientRect();
    if (r.top < window.innerHeight * threshold) { fn(); }
    else { ST.create({ trigger, start, once: true, onEnter: fn }); }
  };

  fire(section,  0.82, "top 82%", playIntro);
  if (orgCard && orgItems.length) fire(orgCard, 0.88, "top 86%", playOrg);
  if (workCard) fire(workCard, 0.88, "top 86%", playPhilo);
}
