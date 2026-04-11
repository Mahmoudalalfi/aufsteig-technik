(function () {
  "use strict";

  var STORAGE_KEY = "aufsteig_sp_lang";
  var DEFAULT_LANG = "en";
  var currentLang = DEFAULT_LANG;

  var translations = {
    en: {
      /* ── TOPBAR ── */
      "clearDraft":           "Clear draft",
      "backToSite":           "Back to site",

      /* ── HERO ── */
      "hero.chip":            "Start your project",
      "hero.title":           "Project Request",
      "hero.lead":            "Tell us which Aufsteig Technik services and solution categories match your build \u2014 aligned with the service categories, \u201CWhat We Offer\u201D range, and technical resources published on aufsteigtechnik.de. Your progress is saved locally on this device.",

      /* ── PROGRESS ── */
      "progress.step":        "Step {n} of {total}",

      /* ── STEP 1 – Client Information ── */
      "step1.title":          "Client Information",
      "step1.fullName":       "Full Name",
      "step1.companyName":    "Company Name",
      "step1.email":          "Email Address",
      "step1.phone":          "Phone Number",
      "step1.phoneHelp":      "Use international format (e.g. +49\u2026)",
      "step1.country":        "Country",
      "step1.city":           "City",
      "step1.select":         "Select\u2026",

      /* ── STEP 2 – Services & Solutions ── */
      "step2.title":          "Services & Solutions",
      "step2.lead":           "Match the same service lines and solution categories shown under Services and \u201CWhat We Offer\u201D on the main site.",
      "step2.buildingContext": "Building or site context",

      "step2.residential.title": "Residential & housing",
      "step2.residential.desc":  "Homes, apartments, and residential-focused vertical transport (e.g. home lift solutions).",
      "step2.commercial.title":  "Commercial & retail",
      "step2.commercial.desc":   "Offices, retail, hotels \u2014 aligned with passenger lifts, modernization, and high-traffic escalators.",
      "step2.publicTransport.title": "Public transport & infrastructure",
      "step2.publicTransport.desc":  "Transit, hubs, and heavy-duty escalator contexts (detailed shaft plans, HD series references).",
      "step2.industrial.title":  "Industrial & logistics",
      "step2.industrial.desc":   "Freight lifts, heavy-load platforms, and logistics-oriented systems from our supply range.",
      "step2.mixedUse.title":    "Mixed-use / other",
      "step2.mixedUse.desc":     "Phased upgrades, multi-building rollouts, or custom scope \u2014 per Engineering Contracting on the site.",

      "step2.serviceLines":      "Which Aufsteig Technik service lines apply?",
      "step2.serviceHint":       "Same categories as the Services section: Elevators & Lifts Supply through Compliance & Safety Audits.",

      "step2.elevatorSupply.title": "Elevators & Lifts Supply",
      "step2.elevatorSupply.desc":  "Passenger, panoramic, freight, home mobility, hospital bed, MRL kits \u2014 see product grid on the site.",
      "step2.installation.title":   "Mechanical & Electrical Installation",
      "step2.installation.desc":    "VVVF drive, control cabinets, door operators, safety circuits, landing call panels.",
      "step2.maintenance.title":    "Maintenance & After-Sales",
      "step2.maintenance.desc":     "PM checklists, emergency response, lubrication, door cycle tuning, remote diagnostics, spare-parts SLA.",
      "step2.contracting.title":    "Engineering Contracting",
      "step2.contracting.desc":     "Site survey package, technical design dossier, execution planning, commissioning, documentation handover.",
      "step2.supplies.title":       "Premium Technical Supplies",
      "step2.supplies.desc":        "Retrofit components; linked to the standard vs optional parts matrix on the site.",
      "step2.compliance.title":     "Compliance & Safety Audits",
      "step2.compliance.desc":      "Audit checklists, T\u00dcV / EN 81\u2013oriented workflows, safety device references.",

      "step2.solutionCats":   "Which \u201CWhat We Offer\u201D solution categories are in scope?",
      "step2.solutionHint":   "Same titles as the What We Offer tiles (Products section on the homepage).",

      "step2.passengerLifts":       "Passenger Lifts",
      "step2.passengerLifts.desc":  "Standard or custom; hydraulic or traction; MR or MRL.",
      "step2.freightLifts":         "Freight Lifts",
      "step2.freightLifts.desc":    "Heavy-duty transport for logistics use.",
      "step2.homeSolutions":        "Home Solutions",
      "step2.homeSolutions.desc":   "Compact, accessible residential lift systems.",
      "step2.modernization":        "Modernization Solutions",
      "step2.modernization.desc":   "Partial upgrades through full replacement.",
      "step2.escalators":           "Escalators & Moving Walks",
      "step2.escalators.desc":      "People-moving systems for high-frequency environments.",
      "step2.antiVandal":           "Anti-vandal Lifts",
      "step2.antiVandal.desc":      "Durable configurations for public utility areas.",
      "step2.firefighting":         "Firefighting Lifts",
      "step2.firefighting.desc":    "Emergency-response\u2013oriented systems.",
      "step2.earthquake":           "Earthquake Resistant Lifts",
      "step2.earthquake.desc":      "Seismic safety scenarios.",
      "step2.accessibility":        "Accessibility Solutions",
      "step2.accessibility.desc":   "Inclusive building access.",
      "step2.parking":              "Parking Systems",
      "step2.parking.desc":         "Vertical transport for parking and utility spaces.",
      "step2.marine":               "Marine Solutions",
      "step2.marine.desc":          "Marine-adapted elevator systems.",
      "step2.custom":               "Custom Solutions",
      "step2.custom.desc":          "Tailor-made packages for unique architecture.",

      "step2.units":          "Number of units / systems",
      "step2.unitsHelp":      "Elevators, escalators, or moving walks you need quoted or phased.",
      "step2.scopeDetail":    "Scope detail",
      "step2.scopePlaceholder": "If you selected more than one service line or solution category, briefly note zones, phases, or buildings (e.g. Tower A passenger lifts, retail bank escalators, moving walk in connector).",

      /* ── STEP 3 – Site & Building ── */
      "step3.title":          "Site & Building",
      "step3.lead":           "Aligns with our process step \u201CSite Survey & Technical Planning\u201D \u2014 shaft review, load analysis, and layout context.",
      "step3.floors":         "Number of Floors",
      "step3.buildingHeight": "Building Height (meters)",
      "step3.floorToFloor":   "Floor-to-Floor Height (optional)",
      "step3.buildingState":  "New Building or Existing",
      "step3.newConstruction":"New Construction",
      "step3.existingBuilding":"Existing Building (modernization)",
      "step3.shaftAvailability":"Shaft Availability",
      "step3.yes":            "Yes",
      "step3.no":             "No",
      "step3.loadCapacity":   "Load Capacity Required (kg)",
      "step3.dailyUsage":     "Estimated Daily Usage",
      "step3.low":            "Low",
      "step3.medium":         "Medium",
      "step3.high":           "High",
      "step3.dailyUsageHelp": "Helps size durability and dispatch \u2014 matching \u201Cstable ride quality under high traffic\u201D on the Services section.",

      /* ── STEP 4 – Technical Details & Resources ── */
      "step4.title":          "Technical Details & Resources",
      "step4.lead":           "Optional detail tied to our published technical pages: design catalog, shaft layouts, detailed plan sheets, parts matrix, and safety overview.",
      "step4.resourceDocs":   "On-site resources to reference (optional)",
      "step4.resourceHint":   "Check the materials you want our team to walk through with you \u2014 the same pages linked from Services and Products.",
      "step4.designCatalog":  "Design catalog \u2014 cabin designs, materials & finishes, door systems (CAT-1\u2013CAT-9)",
      "step4.shaftMatrix":    "Shaft layout matrix \u2014 escalator / moving walk arrangement types",
      "step4.planSheets":     "Detailed shaft plan sheets \u2014 HD-1200 family (HDB-30-2, HDB-30-3, HDB-35-2) and public transport sheets (HDG-30, HD-2200)",
      "step4.techConfig":     "Technical configurations \u2014 standard vs optional parts (balustrade, landing plate, step, pallets, handrail, drive)",
      "step4.safetyOverview": "Escalator safety & detection devices overview diagram",

      "step4.liftSupplyFocus":"Lift supply focus (Elevators & Lifts Supply)",
      "step4.liftSupplyHint": "Product names match the Elevators & Lifts Supply grid on the homepage.",
      "step4.supplyProducts": "Which supply products are you interested in? (optional)",
      "step4.passengerLiftUnit":"Passenger Lift Unit",
      "step4.panoramicLift":  "Panoramic Glass Lift",
      "step4.freightPlatform":"Freight Lift Platform",
      "step4.homeMobility":   "Home Mobility Lift",
      "step4.hospitalBed":    "Hospital Bed Lift",
      "step4.machineRoom":    "Machine Room Lift Kit",

      "step4.primaryConfig":  "Primary lift configuration",
      "step4.driveLayout":    "Drive / layout (as on What We Offer)",
      "step4.hydraulic":      "Hydraulic",
      "step4.traction":       "Traction",
      "step4.machineRoomMR":  "Machine room (MR)",
      "step4.machineRoomless":"Machine room-less (MRL)",
      "step4.driveHelp":      "Matches passenger lift wording: hydraulic or traction, MR or MRL.",

      "step4.speed":          "Speed requirement (m/s)",
      "step4.doorSystems":    "Door systems interest",
      "step4.doorCatalog":    "Review via design catalog (automatic & swing door systems)",
      "step4.doorAutomatic":  "Automatic sliding (site-specific)",
      "step4.doorOther":      "Other / to be defined at technical review",
      "step4.doorHelp":       "Door systems catalog sheet CAT-9 covers automatic and swing options.",
      "step4.cabinInterior":  "Cabin / interior direction",
      "step4.cabinPlaceholder":"e.g. Purity, A310, L310, L510 families from the design catalog\u2026",

      "step4.priorities":         "Priorities (match site offerings)",
      "step4.reqAccessibility":   "Accessibility Solutions (inclusive access)",
      "step4.reqEnergy":          "Higher drive efficiency / lower energy use (system specs on Services)",
      "step4.reqRemoteMonitoring":"Remote diagnostics & monitoring interest (Maintenance & After-Sales)",
      "step4.reqCompliance":      "Compliance & Safety Audits \u2014 T\u00dcV / EN 81\u2013oriented workflow",

      /* ── STEP 5 – Location & Schedule ── */
      "step5.title":          "Location & Schedule",
      "step5.lead":           "Supports our process steps: Procurement & Supply \u2192 Installation & Commissioning (site access affects installation sequencing).",
      "step5.address":        "Project address",
      "step5.siteAccess":     "Site access & working constraints",
      "step5.siteAccessPlaceholder": "Loading bay, crane access, hours, noise limits \u2014 relevant for installation & commissioning as described in our process section.",
      "step5.timeline":       "Target timeline",
      "step5.timeline1":      "Site survey & planning window (0\u20133 months)",
      "step5.timeline2":      "Procurement & supply alignment (3\u20136 months)",
      "step5.timeline3":      "Flexible / phased commissioning (6+ months)",

      /* ── STEP 6 – Budget & Notes ── */
      "step6.title":          "Budget & Notes",
      "step6.lead":           "Mention optional deliverables you care about: spare-parts SLA, remote diagnostics, commissioning protocol, T\u00dcV-ready documentation \u2014 aligned with Maintenance, Contracting, and Compliance on the site.",
      "step6.budgetRange":    "Estimated budget range",
      "step6.low":            "Low",
      "step6.medium":         "Medium",
      "step6.high":           "High",
      "step6.notes":          "Additional notes & deliverables",
      "step6.notesPlaceholder":"e.g. phased modernization, multi-building rollout, documentation & handover pack, energy tune, cabin retrofit \u2014 reference any homepage or service detail that applies.",
      "step6.fileUpload":     "File upload (optional: drawings, PDFs)",
      "step6.fileHelp":       "Files are not uploaded in this demo; we follow up by email for technical design dossier materials if needed.",

      /* ── STEP 7 – Review & Submit ── */
      "step7.title":          "Review & Submit",
      "step7.lead":           "Confirm everything looks right. You can go back to edit any step.",
      "step7.submit":         "Submit request",

      /* ── NAV ── */
      "nav.back":             "Back",
      "nav.saveDraft":        "Save draft",
      "nav.next":             "Next",

      /* ── VALIDATION ── */
      "val.required":         "This field is required.",
      "val.email":            "Enter a valid email address.",
      "val.phone":            "Enter a valid phone number for the selected country code.",
      "val.serviceLines":     "Select at least one service line from the site (Services section).",
      "val.solutionCats":     "Select at least one \u201CWhat We Offer\u201D category.",
      "val.scopeDetail":      "Please describe scope across the selected services or categories.",

      /* ── DRAFT STATUS ── */
      "draft.saved":          "Draft saved.",
      "draft.loaded":         "Draft loaded.",
      "draft.cleared":        "Draft cleared.",

      /* ── SUBMIT ── */
      "submit.submitting":    "Submitting\u2026",
      "submit.success":       "Your project request has been submitted successfully. Our team will contact you shortly.",

      /* ── REVIEW LABELS ── */
      "review.fullName":          "Full name",
      "review.companyName":       "Company name",
      "review.email":             "Email",
      "review.phone":             "Phone (international)",
      "review.country":           "Country",
      "review.city":              "City",
      "review.buildingContext":    "Building / site context",
      "review.serviceLines":      "Service lines (homepage Services)",
      "review.solutionCategories":"Solution categories (What We Offer)",
      "review.units":             "Units / systems",
      "review.scopeDetail":       "Scope detail",
      "review.floors":            "Floors",
      "review.buildingHeight":    "Building height (m)",
      "review.floorToFloor":      "Floor-to-floor (m)",
      "review.buildingState":     "New build vs modernization",
      "review.shaftAvailable":    "Shaft available",
      "review.loadKg":            "Load (kg)",
      "review.dailyUsage":        "Daily usage",
      "review.resourceDocs":      "Resources to reference (site pages)",
      "review.supplyProducts":    "Lift supply products (homepage grid)",
      "review.elevatorType":      "Primary lift configuration",
      "review.driveType":         "Drive / layout (MR / MRL / hydraulic / traction)",
      "review.speed":             "Speed (m/s)",
      "review.doorType":          "Door systems interest",
      "review.finish":            "Cabin / interior direction",
      "review.reqAccessibility":  "Accessibility Solutions priority",
      "review.reqEnergy":         "Energy / efficiency priority",
      "review.reqRemoteMonitoring":"Remote diagnostics interest",
      "review.reqCompliance":     "Compliance & safety audits",
      "review.address":           "Project address",
      "review.siteAccess":        "Site access & constraints",
      "review.timeline":          "Target timeline",
      "review.budget":            "Budget range",
      "review.notes":             "Additional notes",

      /* ── REVIEW GROUP TITLES ── */
      "reviewGroup.client":    "Client information",
      "reviewGroup.services":  "Services & solutions",
      "reviewGroup.building":  "Site & building",
      "reviewGroup.technical": "Technical details & resources",
      "reviewGroup.location":  "Location & schedule",
      "reviewGroup.budget":    "Budget & notes",

      /* ── BOOLEAN ── */
      "bool.yes":              "Yes",
      "bool.no":               "No"
    },

    /* ================================================================
       GERMAN
       ================================================================ */
    de: {
      "clearDraft":           "Entwurf l\u00F6schen",
      "backToSite":           "Zur\u00FCck zur Seite",

      "hero.chip":            "Projekt starten",
      "hero.title":           "Projektanfrage",
      "hero.lead":            "Teilen Sie uns mit, welche Aufsteig Technik Dienstleistungen und L\u00F6sungskategorien zu Ihrem Bauvorhaben passen \u2014 abgestimmt auf die Servicekategorien, das \u201EWas wir bieten\u201C-Angebot und die technischen Ressourcen auf aufsteigtechnik.de. Ihr Fortschritt wird lokal auf diesem Ger\u00E4t gespeichert.",

      "progress.step":        "Schritt {n} von {total}",

      "step1.title":          "Kundeninformationen",
      "step1.fullName":       "Vollst\u00E4ndiger Name",
      "step1.companyName":    "Firmenname",
      "step1.email":          "E-Mail-Adresse",
      "step1.phone":          "Telefonnummer",
      "step1.phoneHelp":      "Internationales Format verwenden (z.B. +49\u2026)",
      "step1.country":        "Land",
      "step1.city":           "Stadt",
      "step1.select":         "Ausw\u00E4hlen\u2026",

      "step2.title":          "Dienstleistungen & L\u00F6sungen",
      "step2.lead":           "W\u00E4hlen Sie die gleichen Dienstleistungsbereiche und L\u00F6sungskategorien, die unter Services und \u201EWas wir bieten\u201C auf der Hauptseite angezeigt werden.",
      "step2.buildingContext": "Geb\u00E4ude- oder Standortkontext",

      "step2.residential.title": "Wohngeb\u00E4ude",
      "step2.residential.desc":  "Eigenheime, Wohnungen und wohnorientierter Vertikaltransport (z.B. Homelift-L\u00F6sungen).",
      "step2.commercial.title":  "Gewerbe & Einzelhandel",
      "step2.commercial.desc":   "B\u00FCros, Einzelhandel, Hotels \u2014 passend zu Personenaufz\u00FCgen, Modernisierung und stark frequentierten Rolltreppen.",
      "step2.publicTransport.title": "\u00D6ffentlicher Verkehr & Infrastruktur",
      "step2.publicTransport.desc":  "Nahverkehr, Knotenpunkte und Hochleistungs-Rolltreppenanwendungen (detaillierte Schachtpl\u00E4ne, HD-Serien-Referenzen).",
      "step2.industrial.title":  "Industrie & Logistik",
      "step2.industrial.desc":   "Lastenaufz\u00FCge, Schwerlastplattformen und logistikorientierte Systeme aus unserem Lieferprogramm.",
      "step2.mixedUse.title":    "Mischnutzung / Sonstige",
      "step2.mixedUse.desc":     "Phasenweise Upgrades, Mehrgeb\u00E4ude-Rollouts oder individuelle Projektumf\u00E4nge \u2014 gem\u00E4\u00DF Engineering Contracting auf der Website.",

      "step2.serviceLines":      "Welche Aufsteig Technik Dienstleistungsbereiche treffen zu?",
      "step2.serviceHint":       "Dieselben Kategorien wie im Bereich Dienstleistungen: Aufz\u00FCge & Aufzugsversorgung bis Compliance & Sicherheitsaudits.",

      "step2.elevatorSupply.title": "Aufz\u00FCge & Aufzugsversorgung",
      "step2.elevatorSupply.desc":  "Personen-, Panorama-, Lasten-, Heimlift-, Krankenhausbett-, MRL-Baus\u00E4tze \u2014 siehe Produktraster auf der Website.",
      "step2.installation.title":   "Mechanische & Elektrische Installation",
      "step2.installation.desc":    "VVVF-Antrieb, Schaltschr\u00E4nke, T\u00FCrantriebe, Sicherheitskreise, Stockwerksruftableaus.",
      "step2.maintenance.title":    "Wartung & Kundendienst",
      "step2.maintenance.desc":     "PM-Checklisten, Notfalldienst, Schmierung, T\u00FCrzyklus-Einstellung, Ferndiagnose, Ersatzteil-SLA.",
      "step2.contracting.title":    "Ingenieur-Vertragsleistungen",
      "step2.contracting.desc":     "Standortbesichtigungspaket, technisches Designdossier, Ausf\u00FChrungsplanung, Inbetriebnahme, Dokumentations\u00FCbergabe.",
      "step2.supplies.title":       "Premium Technische Versorgung",
      "step2.supplies.desc":        "Nachr\u00FCstkomponenten; verkn\u00FCpft mit der Standard- vs. optionalen Teilematrix auf der Website.",
      "step2.compliance.title":     "Compliance & Sicherheitsaudits",
      "step2.compliance.desc":      "Audit-Checklisten, T\u00dcV / EN 81-orientierte Arbeitsabl\u00E4ufe, Sicherheitsger\u00E4te-Referenzen.",

      "step2.solutionCats":   "Welche \u201EWas wir bieten\u201C-L\u00F6sungskategorien fallen in den Umfang?",
      "step2.solutionHint":   "Dieselben Titel wie die \u201EWas wir bieten\u201C-Kacheln (Produktbereich auf der Startseite).",

      "step2.passengerLifts":       "Personenaufz\u00FCge",
      "step2.passengerLifts.desc":  "Standard oder individuell; hydraulisch oder Seil; mit oder ohne Maschinenraum.",
      "step2.freightLifts":         "Lastenaufz\u00FCge",
      "step2.freightLifts.desc":    "Schwerlasttransport f\u00FCr Logistikanwendungen.",
      "step2.homeSolutions":        "Heiml\u00F6sungen",
      "step2.homeSolutions.desc":   "Kompakte, barrierefreie Wohnaufzugssysteme.",
      "step2.modernization":        "Modernisierungsl\u00F6sungen",
      "step2.modernization.desc":   "Teilupgrades bis hin zum vollst\u00E4ndigen Austausch.",
      "step2.escalators":           "Rolltreppen & Fahrsteige",
      "step2.escalators.desc":      "Personenbef\u00F6rderungssysteme f\u00FCr Hochfrequenzbereiche.",
      "step2.antiVandal":           "Vandalismusgesch\u00FCtzte Aufz\u00FCge",
      "step2.antiVandal.desc":      "Robuste Konfigurationen f\u00FCr \u00F6ffentliche Bereiche.",
      "step2.firefighting":         "Feuerwehraufz\u00FCge",
      "step2.firefighting.desc":    "Notfalleinsatzorientierte Systeme.",
      "step2.earthquake":           "Erdbebenresistente Aufz\u00FCge",
      "step2.earthquake.desc":      "Szenarien f\u00FCr Erdbebensicherheit.",
      "step2.accessibility":        "Barrierefreie L\u00F6sungen",
      "step2.accessibility.desc":   "Barrierefreier Geb\u00E4udezugang.",
      "step2.parking":              "Parksysteme",
      "step2.parking.desc":         "Vertikaltransport f\u00FCr Park- und Nutzfl\u00E4chen.",
      "step2.marine":               "Marinel\u00F6sungen",
      "step2.marine.desc":          "F\u00FCr den Marineeinsatz angepasste Aufzugssysteme.",
      "step2.custom":               "Individuelle L\u00F6sungen",
      "step2.custom.desc":          "Ma\u00DFgeschneiderte Pakete f\u00FCr einzigartige Architektur.",

      "step2.units":          "Anzahl der Einheiten / Systeme",
      "step2.unitsHelp":      "Aufz\u00FCge, Rolltreppen oder Fahrsteige, die Sie angeboten oder phasenweise ben\u00F6tigen.",
      "step2.scopeDetail":    "Umfangsdetails",
      "step2.scopePlaceholder": "Wenn Sie mehr als eine Dienstleistungslinie oder L\u00F6sungskategorie ausgew\u00E4hlt haben, notieren Sie kurz Bereiche, Phasen oder Geb\u00E4ude (z.B. Turm A Personenaufz\u00FCge, Rolltreppe Einzelhandelsbank, Fahrsteig im Verbindungsgang).",

      "step3.title":          "Standort & Geb\u00E4ude",
      "step3.lead":           "Ausgerichtet an unserem Prozessschritt \u201EStandortbesichtigung & Technische Planung\u201C \u2014 Schachtpr\u00FCfung, Lastanalyse und Layoutkontext.",
      "step3.floors":         "Anzahl der Stockwerke",
      "step3.buildingHeight": "Geb\u00E4udeh\u00F6he (Meter)",
      "step3.floorToFloor":   "Geschossh\u00F6he (optional)",
      "step3.buildingState":  "Neubau oder Bestand",
      "step3.newConstruction":"Neubau",
      "step3.existingBuilding":"Bestandsgeb\u00E4ude (Modernisierung)",
      "step3.shaftAvailability":"Schachtverf\u00FCgbarkeit",
      "step3.yes":            "Ja",
      "step3.no":             "Nein",
      "step3.loadCapacity":   "Erforderliche Tragf\u00E4higkeit (kg)",
      "step3.dailyUsage":     "Gesch\u00E4tzte t\u00E4gliche Nutzung",
      "step3.low":            "Niedrig",
      "step3.medium":         "Mittel",
      "step3.high":           "Hoch",
      "step3.dailyUsageHelp": "Hilft bei der Dimensionierung von Haltbarkeit und Steuerung \u2014 passend zu \u201Estabile Fahrqualit\u00E4t bei hohem Verkehrsaufkommen\u201C im Servicebereich.",

      "step4.title":          "Technische Details & Ressourcen",
      "step4.lead":           "Optionale Details verkn\u00FCpft mit unseren ver\u00F6ffentlichten technischen Seiten: Designkatalog, Schachtlayouts, detaillierte Planbl\u00E4tter, Teilematrix und Sicherheits\u00FCbersicht.",
      "step4.resourceDocs":   "Vor-Ort-Ressourcen zum Nachschlagen (optional)",
      "step4.resourceHint":   "Markieren Sie die Materialien, die unser Team mit Ihnen durchgehen soll \u2014 dieselben Seiten, die unter Services und Produkte verlinkt sind.",
      "step4.designCatalog":  "Designkatalog \u2014 Kabinendesigns, Materialien & Oberfl\u00E4chen, T\u00FCrsysteme (CAT-1\u2013CAT-9)",
      "step4.shaftMatrix":    "Schachtlayout-Matrix \u2014 Rolltreppen- / Fahrsteig-Anordnungstypen",
      "step4.planSheets":     "Detaillierte Schachtplanbl\u00E4tter \u2014 HD-1200-Familie (HDB-30-2, HDB-30-3, HDB-35-2) und \u00D6PNV-Planbl\u00E4tter (HDG-30, HD-2200)",
      "step4.techConfig":     "Technische Konfigurationen \u2014 Standard- vs. optionale Teile (Balustrade, Landeplatte, Stufe, Paletten, Handlauf, Antrieb)",
      "step4.safetyOverview": "\u00DCbersichtsdiagramm der Rolltreppensicherheits- und Erkennungsger\u00E4te",

      "step4.liftSupplyFocus":"Aufzugsversorgungsschwerpunkt (Aufz\u00FCge & Aufzugsversorgung)",
      "step4.liftSupplyHint": "Produktnamen entsprechen dem Aufzugsversorgungsraster auf der Startseite.",
      "step4.supplyProducts": "An welchen Versorgungsprodukten sind Sie interessiert? (optional)",
      "step4.passengerLiftUnit":"Personenaufzugseinheit",
      "step4.panoramicLift":  "Panorama-Glasaufzug",
      "step4.freightPlatform":"Lastenaufzugsplattform",
      "step4.homeMobility":   "Heim-Mobilit\u00E4tsaufzug",
      "step4.hospitalBed":    "Krankenhausbettaufzug",
      "step4.machineRoom":    "Maschinenraum-Aufzugsbausatz",

      "step4.primaryConfig":  "Prim\u00E4re Aufzugskonfiguration",
      "step4.driveLayout":    "Antrieb / Layout (wie in \u201EWas wir bieten\u201C)",
      "step4.hydraulic":      "Hydraulisch",
      "step4.traction":       "Seilantrieb",
      "step4.machineRoomMR":  "Maschinenraum (MR)",
      "step4.machineRoomless":"Maschinenraumlos (MRL)",
      "step4.driveHelp":      "Entspricht der Personenaufzugs-Terminologie: hydraulisch oder Seilantrieb, MR oder MRL.",

      "step4.speed":          "Geschwindigkeitsanforderung (m/s)",
      "step4.doorSystems":    "Interesse an T\u00FCrsystemen",
      "step4.doorCatalog":    "\u00DCberpr\u00FCfung \u00FCber Designkatalog (automatische & Dreht\u00FCrsysteme)",
      "step4.doorAutomatic":  "Automatisch schiebend (standortspezifisch)",
      "step4.doorOther":      "Sonstige / bei technischer Pr\u00FCfung zu definieren",
      "step4.doorHelp":       "T\u00FCrsystem-Katalogblatt CAT-9 umfasst automatische und Schwenkoptionen.",
      "step4.cabinInterior":  "Kabine / Innenausstattungsrichtung",
      "step4.cabinPlaceholder":"z.B. Purity, A310, L310, L510 Familien aus dem Designkatalog\u2026",

      "step4.priorities":         "Priorit\u00E4ten (passend zu Website-Angeboten)",
      "step4.reqAccessibility":   "Barrierefreie L\u00F6sungen (inklusiver Zugang)",
      "step4.reqEnergy":          "H\u00F6here Antriebseffizienz / geringerer Energieverbrauch (Systemspezifikationen unter Services)",
      "step4.reqRemoteMonitoring":"Interesse an Ferndiagnose & \u00DCberwachung (Wartung & Kundendienst)",
      "step4.reqCompliance":      "Compliance & Sicherheitsaudits \u2014 T\u00dcV / EN 81-orientierter Workflow",

      "step5.title":          "Standort & Zeitplan",
      "step5.lead":           "Unterst\u00FCtzt unsere Prozessschritte: Beschaffung & Lieferung \u2192 Installation & Inbetriebnahme (der Standortzugang beeinflusst die Installationsreihenfolge).",
      "step5.address":        "Projektadresse",
      "step5.siteAccess":     "Standortzugang & Arbeitsbeschr\u00E4nkungen",
      "step5.siteAccessPlaceholder": "Ladezone, Kranzugang, Arbeitszeiten, L\u00E4rmbeschr\u00E4nkungen \u2014 relevant f\u00FCr Installation & Inbetriebnahme wie im Prozessbereich beschrieben.",
      "step5.timeline":       "Zielterminsplan",
      "step5.timeline1":      "Standortbesichtigung & Planungszeitraum (0\u20133 Monate)",
      "step5.timeline2":      "Beschaffung & Lieferabstimmung (3\u20136 Monate)",
      "step5.timeline3":      "Flexible / phasenweise Inbetriebnahme (6+ Monate)",

      "step6.title":          "Budget & Hinweise",
      "step6.lead":           "Erw\u00E4hnen Sie optionale Leistungen, die Ihnen wichtig sind: Ersatzteil-SLA, Ferndiagnose, Inbetriebnahmeprotokoll, T\u00dcV-konforme Dokumentation \u2014 abgestimmt auf Wartung, Contracting und Compliance auf der Website.",
      "step6.budgetRange":    "Gesch\u00E4tzter Budgetrahmen",
      "step6.low":            "Niedrig",
      "step6.medium":         "Mittel",
      "step6.high":           "Hoch",
      "step6.notes":          "Zus\u00E4tzliche Hinweise & Leistungen",
      "step6.notesPlaceholder":"z.B. phasenweise Modernisierung, Mehrgeb\u00E4ude-Rollout, Dokumentations- & \u00DCbergabepaket, Energieoptimierung, Kabinennachr\u00FCstung \u2014 verweisen Sie auf alle zutreffenden Details der Startseite oder des Servicebereichs.",
      "step6.fileUpload":     "Datei-Upload (optional: Zeichnungen, PDFs)",
      "step6.fileHelp":       "Dateien werden in dieser Demo nicht hochgeladen; wir kontaktieren Sie per E-Mail f\u00FCr technische Designunterlagen bei Bedarf.",

      "step7.title":          "\u00DCberpr\u00FCfen & Absenden",
      "step7.lead":           "Best\u00E4tigen Sie, dass alles korrekt ist. Sie k\u00F6nnen zur\u00FCckgehen und jeden Schritt bearbeiten.",
      "step7.submit":         "Anfrage absenden",

      "nav.back":             "Zur\u00FCck",
      "nav.saveDraft":        "Entwurf speichern",
      "nav.next":             "Weiter",

      "val.required":         "Dieses Feld ist erforderlich.",
      "val.email":            "Geben Sie eine g\u00FCltige E-Mail-Adresse ein.",
      "val.phone":            "Geben Sie eine g\u00FCltige Telefonnummer f\u00FCr die ausgew\u00E4hlte Landesvorwahl ein.",
      "val.serviceLines":     "W\u00E4hlen Sie mindestens eine Dienstleistungslinie von der Website (Bereich Dienstleistungen).",
      "val.solutionCats":     "W\u00E4hlen Sie mindestens eine \u201EWas wir bieten\u201C-Kategorie.",
      "val.scopeDetail":      "Bitte beschreiben Sie den Umfang \u00FCber die ausgew\u00E4hlten Dienste oder Kategorien.",

      "draft.saved":          "Entwurf gespeichert.",
      "draft.loaded":         "Entwurf geladen.",
      "draft.cleared":        "Entwurf gel\u00F6scht.",

      "submit.submitting":    "Wird gesendet\u2026",
      "submit.success":       "Ihre Projektanfrage wurde erfolgreich gesendet. Unser Team wird sich in K\u00FCrze bei Ihnen melden.",

      "review.fullName":          "Vollst\u00E4ndiger Name",
      "review.companyName":       "Firmenname",
      "review.email":             "E-Mail",
      "review.phone":             "Telefon (international)",
      "review.country":           "Land",
      "review.city":              "Stadt",
      "review.buildingContext":    "Geb\u00E4ude- / Standortkontext",
      "review.serviceLines":      "Dienstleistungsbereiche (Startseite Services)",
      "review.solutionCategories":"L\u00F6sungskategorien (Was wir bieten)",
      "review.units":             "Einheiten / Systeme",
      "review.scopeDetail":       "Umfangsdetails",
      "review.floors":            "Stockwerke",
      "review.buildingHeight":    "Geb\u00E4udeh\u00F6he (m)",
      "review.floorToFloor":      "Geschossh\u00F6he (m)",
      "review.buildingState":     "Neubau vs. Modernisierung",
      "review.shaftAvailable":    "Schacht verf\u00FCgbar",
      "review.loadKg":            "Last (kg)",
      "review.dailyUsage":        "T\u00E4gliche Nutzung",
      "review.resourceDocs":      "Referenzressourcen (Website-Seiten)",
      "review.supplyProducts":    "Aufzugsversorgungsprodukte (Startseiten-Raster)",
      "review.elevatorType":      "Prim\u00E4re Aufzugskonfiguration",
      "review.driveType":         "Antrieb / Layout (MR / MRL / hydraulisch / Seil)",
      "review.speed":             "Geschwindigkeit (m/s)",
      "review.doorType":          "Interesse an T\u00FCrsystemen",
      "review.finish":            "Kabine / Innenausstattungsrichtung",
      "review.reqAccessibility":  "Priorit\u00E4t Barrierefreie L\u00F6sungen",
      "review.reqEnergy":         "Energie- / Effizienzpriorit\u00E4t",
      "review.reqRemoteMonitoring":"Interesse an Ferndiagnose",
      "review.reqCompliance":     "Compliance & Sicherheitsaudits",
      "review.address":           "Projektadresse",
      "review.siteAccess":        "Standortzugang & Beschr\u00E4nkungen",
      "review.timeline":          "Zielterminsplan",
      "review.budget":            "Budgetrahmen",
      "review.notes":             "Zus\u00E4tzliche Hinweise",

      "reviewGroup.client":    "Kundeninformationen",
      "reviewGroup.services":  "Dienstleistungen & L\u00F6sungen",
      "reviewGroup.building":  "Standort & Geb\u00E4ude",
      "reviewGroup.technical": "Technische Details & Ressourcen",
      "reviewGroup.location":  "Standort & Zeitplan",
      "reviewGroup.budget":    "Budget & Hinweise",

      "bool.yes":              "Ja",
      "bool.no":               "Nein"
    }
  };

  /* ────────────────────────────────────────────
     Helpers
     ──────────────────────────────────────────── */

  function t(key) {
    var dict = translations[currentLang] || translations[DEFAULT_LANG];
    return dict[key] !== undefined ? dict[key] : (translations[DEFAULT_LANG][key] || key);
  }

  function stepLabel(n, total) {
    return t("progress.step")
      .replace("{n}", n)
      .replace("{total}", total);
  }

  function lang() {
    return currentLang;
  }

  /* ────────────────────────────────────────────
     apply(langCode)
     ──────────────────────────────────────────── */

  function apply(langCode) {
    if (!translations[langCode]) langCode = DEFAULT_LANG;
    currentLang = langCode;

    try { localStorage.setItem(STORAGE_KEY, langCode); } catch (e) { /* quota / private mode */ }

    var root = document.documentElement;
    root.lang = langCode;
    root.dir = "ltr";

    /* — data-i18n: text content (preserve child <b>) — */
    var i18nEls = document.querySelectorAll("[data-i18n]");
    for (var i = 0; i < i18nEls.length; i++) {
      var el = i18nEls[i];
      var key = el.getAttribute("data-i18n");
      var value = t(key);

      var boldChild = el.querySelector("b");
      if (boldChild) {
        var nodes = el.childNodes;
        for (var j = 0; j < nodes.length; j++) {
          if (nodes[j].nodeType === 3) {
            nodes[j].textContent = value + " ";
            break;
          }
        }
      } else {
        el.textContent = value;
      }
    }

    /* — data-i18n-ph: placeholder — */
    var phEls = document.querySelectorAll("[data-i18n-ph]");
    for (var p = 0; p < phEls.length; p++) {
      phEls[p].placeholder = t(phEls[p].getAttribute("data-i18n-ph"));
    }

    /* — data-i18n-aria: aria-label — */
    var ariaEls = document.querySelectorAll("[data-i18n-aria]");
    for (var a = 0; a < ariaEls.length; a++) {
      ariaEls[a].setAttribute("aria-label", t(ariaEls[a].getAttribute("data-i18n-aria")));
    }

    /* — language switcher active states — */
    var langBtns = document.querySelectorAll("[data-lang]");
    for (var b = 0; b < langBtns.length; b++) {
      if (langBtns[b].getAttribute("data-lang") === langCode) {
        langBtns[b].classList.add("is-active");
      } else {
        langBtns[b].classList.remove("is-active");
      }
    }

    /* — recalc step heights + notify form — */
    requestAnimationFrame(function () {
      if (typeof window.syncStepsHeight === "function") window.syncStepsHeight();
      window.dispatchEvent(new CustomEvent("spi18n-changed"));
    });
  }

  /* ────────────────────────────────────────────
     Boot
     ──────────────────────────────────────────── */

  function boot() {
    /* Bind language switcher buttons */
    var langBtns = document.querySelectorAll("[data-lang]");
    for (var i = 0; i < langBtns.length; i++) {
      langBtns[i].addEventListener("click", function () {
        apply(this.getAttribute("data-lang"));
      });
    }

    /* Restore saved language */
    var saved = DEFAULT_LANG;
    try { saved = localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG; } catch (e) { /* private mode */ }

    if (saved !== DEFAULT_LANG && translations[saved]) {
      apply(saved);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  /* ────────────────────────────────────────────
     Public API
     ──────────────────────────────────────────── */

  window.spI18n = {
    t: t,
    apply: apply,
    lang: lang,
    stepLabel: stepLabel
  };

  window.spT = t;

})();
