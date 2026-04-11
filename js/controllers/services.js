import { SERVICE_CATALOG, getServiceCatalog } from "../model/service-catalog.js";

export function initServiceProductTabs() {
  const servicesSection = document.getElementById("servicesGrid");
  const tabsWrap = document.getElementById("serviceTabs");
  const productsGrid = document.getElementById("serviceProductsGrid");
  const productsTitle = document.getElementById("serviceProductsTitle");
  const productsLead = document.getElementById("serviceProductsLead");
  const productsActions = document.getElementById("serviceProductsActions");
  const productsCta = document.getElementById("serviceProductsCta");
  const productsCtaSecondary = document.getElementById("serviceProductsCtaSecondary");
  if (!tabsWrap || !productsGrid || !productsTitle || !productsLead || !servicesSection || !productsActions || !productsCta || !productsCtaSecondary) return;

  const tabs = Array.from(tabsWrap.querySelectorAll(".service-tab"));
  if (tabs.length === 0) return;
  const leftSpecs = Array.from(document.querySelectorAll("[data-spec-left]"));
  const rightSpecs = Array.from(document.querySelectorAll("[data-spec-right]"));
  const leftItems = Array.from(document.querySelectorAll(".service-specs--left .service-spec-item"));
  const rightItems = Array.from(document.querySelectorAll(".service-specs--right .service-spec-item"));
  const canAnimateSpecs = leftSpecs.length > 0 && rightSpecs.length > 0;

  const SERVICE_SPECS = {
    en: {
      supply: {
        left: [
          "Integrated converter + microcomputer control board",
          "Compact cabinet footprint for tighter shaft planning",
          "Smooth acceleration profile for daily passenger comfort"
        ],
        right: [
          "Lower operating energy demand under normal traffic",
          "Reliable, stable operation across mixed building loads",
          "Safety-forward ride behavior with consistent control response"
        ]
      },
      installation: {
        left: [
          "High-performance Drive Unit: ET125/ET150 escalator reducer with ZC toothed drive",
          "Low-noise operation at 57 dB with compact build and low vibration profile",
          "Integrated structure and precise commissioning enable smoother acceleration and deceleration control"
        ],
        right: [
          "High-efficiency operation: drive efficiency in normal operation is above 88%",
          "Variable-frequency motor drive supports stable start, braking, and stopping at 5.5-15 kW",
          "Reducer configuration supports 11-37 kW range; Kadion machine driving efficiency is above 22%"
        ]
      },
      maintenance: {
        left: [
          "Preventive diagnostics before component fatigue escalates",
          "Door and drive tuning for smoother peak-hour flow",
          "Service logs structured for fast technical decisions"
        ],
        right: [
          "Reduced energy drift through periodic performance tuning",
          "Stable ride behavior with fewer unplanned interruptions",
          "Safety checks embedded in every maintenance cycle"
        ]
      },
      contracting: {
        left: [
          "Survey-to-design planning for constrained building geometry",
          "Control architecture tailored to lifecycle upgrades",
          "Execution phasing that protects occupancy continuity"
        ],
        right: [
          "Efficiency-focused scope decisions before procurement",
          "Environmental impact considered in modernization path",
          "Risk-managed delivery with safety-first milestones"
        ]
      },
      supplies: {
        left: [
          "High-grade components selected for control compatibility",
          "Retrofit-ready kits that reduce integration friction",
          "Consistent part quality for long-term system behavior"
        ],
        right: [
          "Energy-aware component choices for modernized systems",
          "Reliable operation with fewer stress-induced failures",
          "Compliance-friendly technical baseline across sites"
        ]
      },
      compliance: {
        left: [
          "Multi-level safety system integrated across critical escalator components",
          "Continuous monitoring and fault diagnostics strengthen system-level safety",
          "Control logic detects component anomalies before they escalate"
        ],
        right: [
          "Safety devices and control diagnostics work together to reduce risk exposure",
          "Inspection-ready records support recurring safety audits and traceability",
          "Comprehensive protection improves reliability and passenger assurance"
        ]
      }
    },
    de: {
      supply: {
        left: [
          "Integrierter Umrichter + Mikrocomputer-Steuerplatine",
          "Kompakter Schrankgrundriss f\u00fcr engere Schachtplanung",
          "Sanftes Beschleunigungsprofil f\u00fcr t\u00e4glichen Fahrgastkomfort"
        ],
        right: [
          "Geringerer Energiebedarf im Normalbetrieb",
          "Zuverl\u00e4ssiger, stabiler Betrieb bei gemischten Geb\u00e4udelasten",
          "Sicherheitsorientiertes Fahrverhalten mit konsistenter Steuerungsreaktion"
        ]
      },
      installation: {
        left: [
          "Hochleistungsantrieb: ET125/ET150 Rolltreppengetriebe mit ZC-Zahnantrieb",
          "Ger\u00e4uscharmer Betrieb bei 57 dB mit kompakter Bauweise und niedrigem Vibrationsprofil",
          "Integrierte Struktur und pr\u00e4zise Inbetriebnahme erm\u00f6glichen sanftere Beschleunigungs- und Verz\u00f6gerungssteuerung"
        ],
        right: [
          "Hocheffizienter Betrieb: Antriebseffizienz im Normalbetrieb \u00fcber 88%",
          "Frequenzumrichter-Motorantrieb unterst\u00fctzt stabilen Start, Bremsen und Stopp bei 5,5-15 kW",
          "Getriebekonfiguration unterst\u00fctzt 11-37 kW Bereich; Kadion-Maschinenantriebseffizienz \u00fcber 22%"
        ]
      },
      maintenance: {
        left: [
          "Pr\u00e4ventive Diagnostik vor Komponentenerm\u00fcdung",
          "T\u00fcr- und Antriebsabstimmung f\u00fcr reibungsloseren Sto\u00dfzeitenfluss",
          "Serviceprotokolle f\u00fcr schnelle technische Entscheidungen strukturiert"
        ],
        right: [
          "Reduzierte Energieabweichung durch periodische Leistungsoptimierung",
          "Stabiles Fahrverhalten mit weniger ungeplanten Unterbrechungen",
          "Sicherheitspr\u00fcfungen in jeden Wartungszyklus integriert"
        ]
      },
      contracting: {
        left: [
          "Vermessungs-zu-Design-Planung f\u00fcr eingeschr\u00e4nkte Geb\u00e4udegeometrie",
          "Steuerungsarchitektur auf Lebenszyklus-Upgrades zugeschnitten",
          "Ausf\u00fchrungsphasen, die Belegungskontinuit\u00e4t sch\u00fctzen"
        ],
        right: [
          "Effizienzorientierte Umfangsentscheidungen vor der Beschaffung",
          "Umweltauswirkungen im Modernisierungspfad ber\u00fccksichtigt",
          "Risikogesteuerter Lieferung mit Sicherheits-Meilensteinen"
        ]
      },
      supplies: {
        left: [
          "Hochwertige Komponenten f\u00fcr Steuerungskompatibilit\u00e4t ausgew\u00e4hlt",
          "Nachr\u00fcstf\u00e4hige Kits zur Reduzierung der Integrationsreibung",
          "Konsistente Teilequalit\u00e4t f\u00fcr langfristiges Systemverhalten"
        ],
        right: [
          "Energiebewusste Komponentenwahl f\u00fcr modernisierte Systeme",
          "Zuverl\u00e4ssiger Betrieb mit weniger stressbedingten Ausf\u00e4llen",
          "Compliance-freundliche technische Basis \u00fcber Standorte hinweg"
        ]
      },
      compliance: {
        left: [
          "Mehrstufiges Sicherheitssystem \u00fcber kritische Rolltreppenkomponenten integriert",
          "Kontinuierliche \u00dcberwachung und Fehlerdiagnostik st\u00e4rken Systemsicherheit",
          "Steuerungslogik erkennt Komponentenanomalien bevor sie eskalieren"
        ],
        right: [
          "Sicherheitsger\u00e4te und Steuerungsdiagnostik arbeiten zusammen zur Risikominderung",
          "Pr\u00fcfungsbereite Aufzeichnungen unterst\u00fctzen wiederkehrende Sicherheitsaudits",
          "Umfassender Schutz verbessert Zuverl\u00e4ssigkeit und Fahrgastvertrauen"
        ]
      }
    }

  };

  let currentServiceKey = "supply";
  let specPulseIndex = 0;
  let specPulseTimer = null;
  const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function getLang() {
    return (window.siteI18n && window.siteI18n.lang) ? window.siteI18n.lang() : "en";
  }

  function getSpecsForLang(lang) {
    return SERVICE_SPECS[lang] || SERVICE_SPECS.en;
  }

  function animateProductsIn() {
    if (reduceMotion) return;
    const cards = Array.from(productsGrid.querySelectorAll(".product-card"));
    cards.forEach((card, idx) => {
      if (typeof card.animate !== "function") return;
      card.animate(
        [
          { opacity: 0, transform: "translateY(12px) scale(0.985)" },
          { opacity: 1, transform: "translateY(0) scale(1)" }
        ],
        {
          duration: 420,
          delay: idx * 46,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          fill: "both"
        }
      );
    });
  }

  function renderProducts(serviceKey) {
    const lang = getLang();
    const catalog = getServiceCatalog(lang);
    const selected = catalog[serviceKey];
    if (!selected) return;
    productsTitle.textContent = selected.title;
    productsLead.textContent = selected.lead;
    const hasCta = Boolean(selected.ctaHref && selected.ctaLabel);
    const hasSecondaryCta = Boolean(selected.secondaryCtaHref && selected.secondaryCtaLabel);
    const hasAnyCta = hasCta || hasSecondaryCta;
    productsActions.hidden = !hasAnyCta;
    productsActions.style.display = hasAnyCta ? "flex" : "none";
    productsCta.hidden = !hasCta;
    productsCta.style.display = hasCta ? "inline-flex" : "none";
    if (hasCta) {
      productsCta.textContent = selected.ctaLabel;
      productsCta.href = selected.ctaHref;
    } else {
      productsCta.textContent = "";
      productsCta.href = "#";
    }

    productsCtaSecondary.hidden = !hasSecondaryCta;
    productsCtaSecondary.style.display = hasSecondaryCta ? "inline-flex" : "none";
    if (hasSecondaryCta) {
      productsCtaSecondary.textContent = selected.secondaryCtaLabel;
      productsCtaSecondary.href = selected.secondaryCtaHref;
    } else {
      productsCtaSecondary.textContent = "";
      productsCtaSecondary.href = "#";
    }
    productsGrid.innerHTML = selected.products
      .map(
        (product) => `
        <article class="product-card">
          <div class="product-card-image" style="background-image:url('${product.img}');"></div>
          <h5>${product.name}</h5>
          <p>${product.desc}</p>
        </article>
      `
      )
      .join("");
    animateProductsIn();
  }

  function setSpecPulse(index) {
    leftItems.forEach((item, idx) => item.classList.toggle("is-active", idx === index));
    rightItems.forEach((item, idx) => item.classList.toggle("is-active", idx === index));
  }

  function markSpecItemRefresh(item) {
    if (!item || reduceMotion) return;
    item.classList.remove("is-updating");
    void item.offsetWidth;
    item.classList.add("is-updating");
  }

  function restartSpecPulse() {
    if (!canAnimateSpecs) return;
    if (specPulseTimer) clearInterval(specPulseTimer);
    setSpecPulse(specPulseIndex);
    specPulseTimer = setInterval(() => {
      specPulseIndex = (specPulseIndex + 1) % Math.min(leftItems.length, rightItems.length, 3);
      setSpecPulse(specPulseIndex);
    }, 1700);
  }

  function writeSpecLine(node, value, delayMs) {
    if (!node) return;
    const item = node.closest(".service-spec-item");
    const run = () => {
      if (item) item.classList.remove("is-live");
      node.textContent = value;
      if (item) {
        markSpecItemRefresh(item);
        void item.offsetWidth;
        item.classList.add("is-live");
      }
    };
    if (delayMs > 0 && !reduceMotion) window.setTimeout(run, delayMs);
    else run();
  }

  function renderSpecs(serviceKey) {
    if (!canAnimateSpecs) return;
    const lang = getLang();
    const specsByLang = getSpecsForLang(lang);
    const defaultSpecs = specsByLang.supply;
    const specSet = specsByLang[serviceKey] || defaultSpecs;
    leftSpecs.forEach((node, idx) => writeSpecLine(node, specSet.left[idx] || defaultSpecs.left[idx] || "", idx * 70));
    rightSpecs.forEach((node, idx) => writeSpecLine(node, specSet.right[idx] || defaultSpecs.right[idx] || "", 210 + idx * 70));
    restartSpecPulse();
  }

  function setActiveTab(serviceKey) {
    currentServiceKey = serviceKey;
    let activeTab = null;
    tabs.forEach((tab) => {
      const active = tab.dataset.serviceKey === serviceKey;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", active ? "true" : "false");
      tab.setAttribute("tabindex", active ? "0" : "-1");
      if (active) activeTab = tab;
    });
    if (activeTab && !reduceMotion) {
      activeTab.classList.remove("is-pop");
      void activeTab.offsetWidth;
      activeTab.classList.add("is-pop");
    }
    renderProducts(serviceKey);
    renderSpecs(serviceKey);
  }

  const previewByTap = window.matchMedia && window.matchMedia("(hover: none)").matches;

  tabs.forEach((tab) => {
    tab.addEventListener("pointerenter", () => {
      tab.classList.add("is-hover-preview");
    });
    tab.addEventListener("pointerleave", () => {
      tab.classList.remove("is-hover-preview");
    });
    tab.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        tab.click();
      }
    });
  });

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      if (previewByTap) {
        const wasOpen = tab.classList.contains("is-preview-revealed");
        tabs.forEach((t) => {
          if (t !== tab) t.classList.remove("is-preview-revealed");
        });
        tab.classList.toggle("is-preview-revealed", !wasOpen);
      }
      setActiveTab(tab.dataset.serviceKey || "supply");
    });
  });

  if (previewByTap) {
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".service-tab")) {
        tabs.forEach((t) => t.classList.remove("is-preview-revealed"));
      }
    });
  }

  window.addEventListener("site-lang-changed", () => {
    renderProducts(currentServiceKey);
    renderSpecs(currentServiceKey);
  });

  servicesSection.classList.add("is-specs-visible");
  if (!reduceMotion) {
    window.requestAnimationFrame(() => {
      servicesSection.classList.add("is-specs-visible");
    });
  }

  setActiveTab("supply");
}
