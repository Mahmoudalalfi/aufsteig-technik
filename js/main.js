import { collectRefs } from "./core/refs.js";
import { getDeviceHints, applyDeviceClasses } from "./utils/device.js";
import { initHero } from "./controllers/hero.js";
import { initMenu, initMenuStripIndicator } from "./controllers/menu.js";
import { initFaqAccordion } from "./controllers/faq.js";
import { initPartnersMotion } from "./controllers/partners.js";
import { initContactForm } from "./controllers/contact.js";
import { initServiceProductTabs } from "./controllers/services.js";
import { initProjectDeck } from "./controllers/project-deck.js";
import { initAchievementShowcase } from "./controllers/achievements.js";
import { initRatingsMarquee } from "./controllers/ratings.js";
import { initScrollNavMorph } from "./controllers/scroll-nav.js";
import { initSmoothScroll } from "./controllers/smooth-scroll.js";
import { initScrollTimelines } from "./controllers/scroll-timelines.js";
import { initStatsCountUp } from "./controllers/stats-countup.js";
import { initHeroLoad } from "./controllers/hero-load.js";
import { initSplitReveal } from "./controllers/split-reveal.js";
import { initStaggerReveals } from "./controllers/stagger-reveals.js";
import { initMagnetic } from "./controllers/magnetic.js";
import { initCardTilt } from "./controllers/card-tilt.js";
import { initAboutSlideshow } from "./controllers/about-slideshow.js";

/**
 * Hero intro + split-text reveals must run after i18n apply(), which uses textContent
 * on [data-i18n] and strips word-wrap markup. See i18n-site.js setTimeout.
 */
window.__runAfterI18nApply = () => {
  initHeroLoad();
  initSplitReveal();
  /* Scroll timelines measure DOM + i18n text; run once (avoid duplicate ScrollTriggers). */
  if (!window.__scrollTimelinesReady) {
    initScrollTimelines(refs);
    window.__scrollTimelinesReady = true;
  }
  initStatsCountUp();
  requestAnimationFrame(() => {
    if (window.ScrollTrigger) window.ScrollTrigger.refresh();
  });
};

applyDeviceClasses(getDeviceHints());

const refs = collectRefs();

// Core
initHero(refs);
initMenu(refs);
initMenuStripIndicator();
initFaqAccordion();
initPartnersMotion();
initContactForm();
initServiceProductTabs();
initProjectDeck();
initAchievementShowcase();
initRatingsMarquee();
initAboutSlideshow();
initScrollNavMorph();
initSmoothScroll();
requestAnimationFrame(() => {
  if (window.ScrollTrigger) window.ScrollTrigger.refresh();
});

// Premium interactions — split reveal runs from __runAfterI18nApply after i18n apply()
initStaggerReveals(); // grid / card stagger entrances
initMagnetic();       // magnetic CTAs
initCardTilt();       // 3-D tilt on hover

window.addEventListener(
  "load",
  () => {
    if (window.ScrollTrigger) window.ScrollTrigger.refresh();
  },
  { once: true }
);
