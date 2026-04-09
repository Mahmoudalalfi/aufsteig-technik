import { getDeviceHints } from "../utils/device.js";

export function initPartnersMotion() {
  if (!window.gsap || !window.ScrollTrigger) return;
  const gsap = window.gsap;
  const enterDur = getDeviceHints().lightMode ? 0.42 : 0.7;

  gsap.utils.toArray(".capabilities-viewport, .person-card, .partners-strip").forEach((el) => {
    gsap.fromTo(
      el,
      { y: 14, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: enterDur,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 85%" }
      }
    );
  });
}
