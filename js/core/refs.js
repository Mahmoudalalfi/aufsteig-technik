export function collectRefs() {
  const heroSequence = document.getElementById("heroSequence");
  return {
    root: document.documentElement,
    heroSequence,
    sequenceTrack: heroSequence?.querySelector(".sequence-track") ?? null,
    heroVideo: document.getElementById("heroVideo"),
    menuToggle: document.getElementById("menuToggle"),
    menuPanel: document.getElementById("menuPanel"),
    servicePills: Array.from(document.querySelectorAll("#servicePills li")),
    serviceSlides: Array.from(document.querySelectorAll(".service-story-slide")),
    serviceStoryTrack: document.querySelector(".service-story-stack"),
    serviceTrack: document.querySelector(".services-track"),
    serviceCard: document.getElementById("serviceStoryCard"),
    servicesSection: document.getElementById("services"),
    impactSection: document.getElementById("impactImage"),
    brainSection: document.getElementById("brainCta"),
    processSection: document.getElementById("process"),
    processCards: Array.from(document.querySelectorAll("#process .process-grid article")),
    processRoutePath: document.getElementById("processRoutePath"),
    processRouteProgress: document.getElementById("processRouteProgress"),
    processRouteMarker: document.getElementById("processRouteMarker"),
    processRouteGlow: document.getElementById("processRouteGlow"),
    processRoutePins: Array.from(document.querySelectorAll("#process .process-route-pin")),
    processTreasureRing: document.getElementById("processTreasureRing"),
    processTreasureX1: document.getElementById("processTreasureX1"),
    processTreasureX2: document.getElementById("processTreasureX2"),
    bottomSlogan: document.getElementById("bottomSlogan"),
    bottomSloganTitle: document.querySelector(".bottom-slogan-title"),
    bottomSloganBlur: document.querySelector(".bottom-slogan-title .is-blur")
  };
}
