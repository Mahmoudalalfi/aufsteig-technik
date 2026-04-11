import { clamp } from "../utils/math.js";
import { appState } from "../model/app-state.js";

/**
 * Touch: services use a short scrub so the stack
 * stays tied to scroll (long scrub + iOS momentum + stale ST measurements reads as “broken”).
 */
function touchScrollTuning() {
  const touch = window.matchMedia("(pointer: coarse)").matches;
  if (!touch) {
    return { scrubService: 1.05, scrub: 1, scrubBottom: 1.08 };
  }
  return { scrubService: 0.42, scrub: 1.38, scrubBottom: 1.55 };
}

function debounceScrollTriggerRefresh(ScrollTrigger, ms = 120) {
  let t = 0;
  return () => {
    window.clearTimeout(t);
    t = window.setTimeout(() => {
      try {
        ScrollTrigger.refresh();
      } catch {
        /* ignore */
      }
    }, ms);
  };
}

export function initScrollTimelines(refs) {
  if (!window.gsap || !window.ScrollTrigger) return;

  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  gsap.registerPlugin(ScrollTrigger);

  const st = touchScrollTuning();
  ScrollTrigger.config({ ignoreMobileResize: true });

  if (refs.serviceTrack && refs.servicesSection && refs.serviceCard && refs.serviceSlides.length > 0) {
    const setStoryTrackY = gsap.quickSetter(refs.serviceStoryTrack, "y", "px");
    /** Pixel offset of each slide’s top within the stack (handles unequal slide heights on mobile). */
    let serviceSlideYs = [0];

    function refreshServiceStepSize() {
      const slides = refs.serviceSlides;
      if (!slides.length) return;
      const stackStyle = window.getComputedStyle(refs.serviceStoryTrack);
      const gap = parseFloat(stackStyle.rowGap || stackStyle.gap || "26") || 26;
      const ys = [];
      let acc = 0;
      slides.forEach((slide, i) => {
        ys.push(acc);
        acc += slide.offsetHeight;
        if (i < slides.length - 1) acc += gap;
      });
      serviceSlideYs = ys;
      appState.serviceSlideStepY =
        ys.length > 1 ? ys[1] - ys[0] : slides[0].offsetHeight + gap;
    }

    refreshServiceStepSize();

    const scheduleStRefresh = debounceScrollTriggerRefresh(ScrollTrigger);

    if (refs.serviceStoryTrack && window.ResizeObserver) {
      const ro = new ResizeObserver(() => scheduleStRefresh());
      ro.observe(refs.serviceStoryTrack);
      refs.serviceSlides.forEach((slide) => ro.observe(slide));
    }

    if (window.visualViewport && window.matchMedia("(pointer: coarse)").matches) {
      window.visualViewport.addEventListener("resize", scheduleStRefresh, { passive: true });
    }

    window.addEventListener("load", scheduleStRefresh, { passive: true });
    window.setTimeout(scheduleStRefresh, 0);

    function setServiceStep(step) {
      if (step === appState.activeServiceStep) return;
      appState.activeServiceStep = step;

      refs.servicePills.forEach((pill, idx) => {
        pill.classList.toggle("is-active", idx === step);
      });

      refs.serviceSlides.forEach((slide, idx) => {
        slide.classList.toggle("is-active", idx === step);
      });
    }

    ScrollTrigger.create({
      trigger: refs.serviceTrack,
      start: "top top",
      end: () => `+=${Math.max(1, refs.serviceTrack.offsetHeight - window.innerHeight)}`,
      scrub: st.scrubService,
      fastScrollEnd: true,
      invalidateOnRefresh: true,
      onRefresh: refreshServiceStepSize,
      onUpdate(self) {
        const slides = refs.serviceSlides;
        const last = slides.length - 1;
        const p = clamp(self.progress * last, 0, last);
        const i0 = Math.min(Math.floor(p), last);
        const i1 = Math.min(Math.ceil(p), last);
        const y0 = serviceSlideYs[i0] ?? 0;
        const y1 = serviceSlideYs[i1] ?? y0;
        let y = i0 === i1 ? y0 : y0 + (y1 - y0) * (p - i0);
        const maxY = serviceSlideYs[last] ?? 0;
        y = clamp(y, 0, maxY);

        if (refs.serviceStoryTrack) {
          setStoryTrackY(-y);
        }

        setServiceStep(Math.round(p));
      }
    });
  }

  if (
    refs.processSection &&
    refs.processRoutePath &&
    refs.processRouteProgress &&
    refs.processRouteMarker &&
    refs.processRouteGlow &&
    refs.processCards.length > 0
  ) {
    const routeLength = refs.processRoutePath.getTotalLength();
    if (!Number.isFinite(routeLength) || routeLength <= 0) {
      /* Path not measurable yet (e.g. display:none) — skip broken ScrollTrigger. */
    } else {
    // Visual tweak: place the first dot on the clearly-visible part of the stroke.
    // (The very start of the curve reads as "detached" due to the immediate bend.)
    const routeStartOffset = Math.min(180, Math.max(120, routeLength * 0.12));
    const usableRouteLength = Math.max(1, routeLength - routeStartOffset);
    const lastStep = refs.processCards.length - 1;
    const stepFractions = refs.processCards.map((_, idx) => (lastStep > 0 ? idx / lastStep : 0));

    refs.processRouteProgress.style.strokeDasharray = `${routeLength}`;
    refs.processRouteProgress.style.strokeDashoffset = `${routeLength}`;

    const touchDevice = window.matchMedia("(pointer: coarse)").matches;
    const pulseTween = touchDevice
      ? null
      : gsap.to(refs.processRouteGlow, {
          attr: { r: 19 },
          opacity: 0.22,
          duration: 1,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true
        });

    function setProcessStep(step) {
      if (step === appState.activeProcessStep) return;
      appState.activeProcessStep = step;
      refs.processCards.forEach((card, idx) => card.classList.toggle("is-active", idx === step));
      refs.processRoutePins.forEach((pin, idx) => pin.classList.toggle("is-active", idx <= step));
    }

    function renderProcessRoute(progress) {
      const clamped = clamp(progress, 0, 1);
      const rawLen = routeStartOffset + usableRouteLength * clamped;
      const currentLength = Math.min(Math.max(rawLen, 0), routeLength);
      const point = refs.processRoutePath.getPointAtLength(currentLength);

      refs.processRouteProgress.style.strokeDashoffset = `${routeLength - currentLength}`;
      refs.processRouteMarker.setAttribute("cx", `${point.x}`);
      refs.processRouteMarker.setAttribute("cy", `${point.y}`);
      refs.processRouteGlow.setAttribute("cx", `${point.x}`);
      refs.processRouteGlow.setAttribute("cy", `${point.y}`);

      const step = Math.min(lastStep, Math.round(clamped * lastStep));
      setProcessStep(step);
    }

    function refreshRoutePins() {
      refs.processRoutePins.forEach((pin, idx) => {
        const t = stepFractions[idx] ?? 0;
        const len = Math.min(Math.max(routeStartOffset + usableRouteLength * t, 0), routeLength);
        const point = refs.processRoutePath.getPointAtLength(len);
        pin.setAttribute("cx", `${point.x}`);
        pin.setAttribute("cy", `${point.y}`);
      });
    }

    function placeTreasureAtEnd() {
      if (!refs.processTreasureRing || !refs.processTreasureX1 || !refs.processTreasureX2) return;
      const endPoint = refs.processRoutePath.getPointAtLength(routeLength);
      const x = endPoint.x;
      const y = endPoint.y;
      const r = 19;
      const d = 8;

      refs.processTreasureRing.setAttribute("cx", `${x}`);
      refs.processTreasureRing.setAttribute("cy", `${y}`);
      refs.processTreasureRing.setAttribute("r", `${r}`);

      refs.processTreasureX1.setAttribute("x1", `${x - d}`);
      refs.processTreasureX1.setAttribute("y1", `${y - d}`);
      refs.processTreasureX1.setAttribute("x2", `${x + d}`);
      refs.processTreasureX1.setAttribute("y2", `${y + d}`);

      refs.processTreasureX2.setAttribute("x1", `${x + d}`);
      refs.processTreasureX2.setAttribute("y1", `${y - d}`);
      refs.processTreasureX2.setAttribute("x2", `${x - d}`);
      refs.processTreasureX2.setAttribute("y2", `${y + d}`);
    }

    refreshRoutePins();
    placeTreasureAtEnd();
    renderProcessRoute(0);

    /* Tight scrub: global st.scrub is ~1s+ on desktop / 1.38s on touch — path feels stuck or “not moving”. */
    const processRouteScrub = touchDevice ? 0.35 : 0.45;

    ScrollTrigger.create({
      trigger: refs.processSection,
      start: "top 82%",
      end: "bottom 38%",
      scrub: processRouteScrub,
      fastScrollEnd: true,
      invalidateOnRefresh: true,
      onRefresh() {
        refreshRoutePins();
        placeTreasureAtEnd();
      },
      onUpdate(self) {
        renderProcessRoute(self.progress);
      }
    });

    if (pulseTween) {
      ScrollTrigger.create({
        trigger: refs.processSection,
        start: "top bottom",
        end: "bottom top",
        onEnter: () => pulseTween.play(),
        onEnterBack: () => pulseTween.play(),
        onLeave: () => pulseTween.pause(),
        onLeaveBack: () => pulseTween.pause()
      });
    }
    }
  }

  gsap.utils.toArray(".intro-grid, .stats-grid article, .service-products-grid article, .rating-card, .faq-list details").forEach((el) => {
    gsap.fromTo(
      el,
      { y: 34, opacity: 0.2 },
      {
        y: 0,
        opacity: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          end: "top 56%",
          scrub: st.scrub
        }
      }
    );
  });

  const servicesGrid = document.querySelector("#servicesGrid .service-products-grid");
  if (servicesGrid) {
    const cards = Array.from(servicesGrid.querySelectorAll("article"));
    gsap.fromTo(
      cards,
      { y: 22, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: "power2.out",
        stagger: 0.08,
        scrollTrigger: { trigger: servicesGrid, start: "top 80%" }
      }
    );
  }

  const capabilitiesScroll = document.getElementById("capabilitiesScroll");
  const capabilitiesViewport = document.getElementById("capabilitiesViewport");
  const capabilitiesTrack = document.getElementById("capabilitiesTrack");
  const capabilitiesProgress = document.getElementById("capabilitiesProgress");
  if (capabilitiesScroll && capabilitiesViewport && capabilitiesTrack) {
    const cards = Array.from(capabilitiesTrack.querySelectorAll(".capability-card"));
    cards.forEach((card, idx) => {
      gsap.fromTo(
        card,
        { y: 26, opacity: 0.2, scale: 0.97 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 88%",
            end: "top 58%",
            scrub: st.scrub,
            onEnter: () => cards.forEach((item, itemIdx) => item.classList.toggle("is-active", itemIdx === idx)),
            onEnterBack: () => cards.forEach((item, itemIdx) => item.classList.toggle("is-active", itemIdx === idx))
          }
        }
      );
    });

    ScrollTrigger.create({
      trigger: capabilitiesScroll,
      start: "top 82%",
      end: "bottom 34%",
      scrub: st.scrub,
      onUpdate(self) {
        if (capabilitiesProgress) {
          capabilitiesProgress.style.transform = `scaleX(${Math.max(0.06, self.progress).toFixed(4)})`;
        }
      }
    });
  }

  if (refs.impactSection) {
    const showcase = refs.impactSection.querySelector(".achievement-showcase");
    if (showcase) {
      gsap.fromTo(
        showcase,
        { y: 24, opacity: 0.3 },
        {
          y: 0,
          opacity: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: refs.impactSection,
            start: "top 84%",
            end: "top 58%",
            scrub: st.scrub
          }
        }
      );
    }
  }

  if (refs.brainSection) {
    ScrollTrigger.create({
      trigger: refs.brainSection,
      start: "top bottom",
      end: "bottom top",
      scrub: st.scrub,
      onUpdate(self) {
        refs.root.style.setProperty("--brain-parallax", `${(self.progress - 0.5) * 34}px`);
      }
    });

    gsap.fromTo(
      refs.brainSection.querySelectorAll(".brain-left h3, .brain-tags span, .brain-right h2, .brain-right .btn-light"),
      { opacity: 0.2, y: 26 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.05,
        ease: "power2.out",
        scrollTrigger: {
          trigger: refs.brainSection,
          start: "top 86%",
          end: "top 48%",
          scrub: st.scrub
        }
      }
    );
  }

  if (refs.bottomSlogan && refs.bottomSloganTitle) {
    gsap.fromTo(
      refs.bottomSloganTitle,
      { y: 92 },
      {
        y: 0,
        ease: "power2.out",
        scrollTrigger: {
          trigger: refs.bottomSlogan,
          start: "top 92%",
          end: "bottom top",
          scrub: st.scrubBottom
        }
      }
    );

    if (refs.bottomSloganBlur) {
      gsap.fromTo(
        refs.bottomSloganBlur,
        { y: 56, filter: "blur(12px)", opacity: 0.24 },
        {
          y: 22,
          filter: "blur(5.2px)",
          opacity: 0.86,
          ease: "sine.out",
          scrollTrigger: {
            trigger: refs.bottomSlogan,
            start: "top 88%",
            end: "bottom top",
            scrub: st.scrubBottom
          }
        }
      );
    }
  }
}

