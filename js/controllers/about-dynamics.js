/**
 * About section — intro, trust, organizational structure, work philosophy (separate scroll triggers).
 */
export function initAboutDynamics() {
  if (!window.gsap || !window.ScrollTrigger) return;
  if (window.__aboutDynamicsReady) return;

  const gsap = window.gsap;
  const ST = window.ScrollTrigger;
  const section = document.getElementById("about");
  if (!section) return;

  const bullets = section.querySelectorAll(".about-intro-list li");
  const trust = section.querySelector(".trust-strip");
  const orgCard = section.querySelector(".about-org-card");
  const orgHeading = section.querySelector(".about-org-heading");
  const orgLead = section.querySelector(".about-org-lead");
  const orgItems = section.querySelectorAll(".about-org-item");
  const workCard = section.querySelector(".about-philo-card");
  const philoHeading = section.querySelector(".about-philo-heading");
  const philoPillars = section.querySelectorAll(".about-philo-pillar");
  const philoCells = section.querySelectorAll(".about-philo-cell");

  if (!bullets.length && !orgCard && !workCard) return;

  window.__aboutDynamicsReady = true;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    section.classList.add("about-live");
    orgCard?.classList.add("about-org-ready");
    workCard?.classList.add("about-philo-ready");
    return;
  }

  gsap.set(bullets, { opacity: 0, x: -22 });
  if (trust) gsap.set(trust, { opacity: 0, y: 20 });
  if (orgHeading) gsap.set(orgHeading, { opacity: 0, y: 18 });
  if (orgLead) gsap.set(orgLead, { opacity: 0, y: 12 });
  if (orgItems.length) gsap.set(orgItems, { opacity: 0, y: 32 });
  if (philoHeading) gsap.set(philoHeading, { opacity: 0, y: 16 });
  if (philoPillars.length) gsap.set(philoPillars, { opacity: 0, y: 20 });
  if (philoCells.length) gsap.set(philoCells, { opacity: 0, y: 28 });

  const playIntro = () => {
    const tl = gsap.timeline({
      defaults: { ease: "power2.out" },
      onComplete: () => section.classList.add("about-live"),
    });
    if (bullets.length) {
      tl.to(bullets, {
        opacity: 1,
        x: 0,
        duration: 0.58,
        stagger: 0.085,
      });
    }
    if (trust) {
      tl.to(
        trust,
        { opacity: 1, y: 0, duration: 0.62, ease: "power3.out" },
        bullets.length ? "-=0.28" : 0
      );
    }
    if (!bullets.length && !trust) {
      section.classList.add("about-live");
    }
  };

  const playOrg = () => {
    if (!orgCard || !orgItems.length) return;
    const tl = gsap.timeline({
      onComplete: () => orgCard.classList.add("about-org-ready"),
    });
    if (orgHeading) {
      tl.to(orgHeading, {
        opacity: 1,
        y: 0,
        duration: 0.55,
        ease: "power3.out",
      });
    }
    if (orgLead) {
      tl.to(
        orgLead,
        { opacity: 1, y: 0, duration: 0.52, ease: "power2.out" },
        orgHeading ? "-=0.28" : 0
      );
    }
    tl.to(
      orgItems,
      {
        opacity: 1,
        y: 0,
        duration: 0.62,
        stagger: 0.11,
        ease: "power2.out",
      },
      orgLead ? "-=0.2" : orgHeading ? "-=0.15" : 0
    );
  };

  const playPhilo = () => {
    if (!workCard) return;
    const tl = gsap.timeline({
      onComplete: () => workCard.classList.add("about-philo-ready"),
    });
    if (philoHeading) {
      tl.to(philoHeading, {
        opacity: 1,
        y: 0,
        duration: 0.52,
        ease: "power3.out",
      });
    }
    if (philoPillars.length) {
      tl.to(
        philoPillars,
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.11,
          ease: "power2.out",
        },
        philoHeading ? "-=0.28" : 0
      );
    }
    if (philoCells.length) {
      tl.to(
        philoCells,
        {
          opacity: 1,
          y: 0,
          duration: 0.58,
          stagger: 0.1,
          ease: "power3.out",
        },
        philoPillars.length ? "-=0.25" : philoHeading ? "-=0.2" : 0
      );
    }
  };

  const thresholdIntro = 0.82;
  const rectSection = section.getBoundingClientRect();
  if (rectSection.top < window.innerHeight * thresholdIntro) {
    playIntro();
  } else {
    ST.create({
      trigger: section,
      start: "top 82%",
      once: true,
      onEnter: playIntro,
    });
  }

  if (orgCard && orgItems.length) {
    const thresholdOrg = 0.88;
    const rectOrg = orgCard.getBoundingClientRect();
    if (rectOrg.top < window.innerHeight * thresholdOrg) {
      playOrg();
    } else {
      ST.create({
        trigger: orgCard,
        start: "top 86%",
        once: true,
        onEnter: playOrg,
      });
    }
  }

  if (workCard) {
    const thresholdPhilo = 0.88;
    const rectW = workCard.getBoundingClientRect();
    if (rectW.top < window.innerHeight * thresholdPhilo) {
      playPhilo();
    } else {
      ST.create({
        trigger: workCard,
        start: "top 86%",
        once: true,
        onEnter: playPhilo,
      });
    }
  }
}
