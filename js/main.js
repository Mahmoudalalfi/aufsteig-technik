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

applyDeviceClasses(getDeviceHints());

const refs = collectRefs();

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
initScrollNavMorph();
initSmoothScroll();
initScrollTimelines(refs);
