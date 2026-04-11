(function () {
  "use strict";

  var STORAGE_KEY = "aufsteig_sp_lang";
  var DEFAULT_LANG = "en";
  var currentLang = DEFAULT_LANG;

  var T = {
    en: {
      "nav.home": "Home",
      "nav.about": "About",
      "nav.partners": "Our Partners",
      "nav.services": "Services",
      "nav.products": "Products",
      "nav.contact": "Contact Us",
      "nav.faq": "FAQ",

      "hero.eyebrow": "Elevators & Escalators / Germany",
      "hero.title1": "Vertical mobility",
      "hero.title2": "without friction",
      "hero.desc": "Aufsteig Technik builds, modernizes, and maintains premium systems for offices, retail, transit hubs, and residential towers.",
      "hero.cta.tagline": "24/7 Monitoring. Fast dispatch. T\u00dcV-ready maintenance.",
      "hero.cta.btn": "Book a site assessment",

      "about.chip": "Made for high-traffic buildings",
      "about.title": "Safe, quiet, efficient movement from lobby to top floor.",
      "about.desc": "We deliver engineering supply and contracting excellence across elevators, lifts, and advanced electromechanical systems for commercial, industrial, and residential projects.",
      "about.stat1.val": "18+",
      "about.stat1.label": "Years of engineering and installation experience",
      "about.stat2.val": "250+",
      "about.stat2.label": "Completed elevator and escalator project deliveries",
      "about.stat3.val": "98%",
      "about.stat3.label": "Average service uptime under maintenance contracts",
      "about.trust": "Certified partner of",
      "about.trust.monitoring": "24/7 Monitoring",
      "about.trust.compliant": "EN 81 Compliant",
      "about.slide1": "Industry Exhibition \u2014 Showcasing smart elevator solutions",
      "about.slide2": "Partnership Agreement \u2014 Strengthening global alliances",
      "about.slide3": "International Partnership \u2014 Egypt & Germany collaboration",
      "about.slide4": "Certified Excellence \u2014 T\u00dcV S\u00dcD & DEKRA official partnerships",

      "svc.title": "Tools that work with your building, not against it",
      "svc.pill1": "Designed for calm, not chaos",
      "svc.pill2": "The effortless way to begin",
      "svc.pill3": "Stay fully focused",
      "svc.pill4": "Small steps. Zero guilt",
      "svc.bottom1": "No downtime. No complicated operations.",
      "svc.bottom2": "Just reliable movement, clearly managed.",
      "svc.cta": "Request proposal",
      "svc.card1.kicker": "Control Center",
      "svc.card1.title": "Designed for calm, not chaos",
      "svc.card1.desc": "Live system status is presented in one clean view so teams can act fast without digging through noisy dashboards.",
      "svc.card1.meta1": "Site Health",
      "svc.card1.meta2": "Calm Lobby Flow",
      "svc.card2.kicker": "Dispatch Intelligence",
      "svc.card2.title": "The effortless way to begin",
      "svc.card2.desc": "Incident intake, team assignment, and part selection are streamlined into one guided flow for faster first response.",
      "svc.card2.meta1": "Rapid Dispatch",
      "svc.card2.meta2": "Interior Access Ready",
      "svc.card3.kicker": "Flow Focus",
      "svc.card3.title": "Stay fully focused",
      "svc.card3.desc": "Peak-hour diagnostics highlight congestion and tune stop logic automatically to keep rider movement consistent.",
      "svc.card3.meta1": "Panel Analytics",
      "svc.card3.meta2": "Focused Control",
      "svc.card4.kicker": "Modernization Path",
      "svc.card4.title": "Small steps. Zero guilt",
      "svc.card4.desc": "Upgrades are phased so your building stays operational while each cycle improves energy efficiency and compliance.",
      "svc.card4.meta1": "Modernization",
      "svc.card4.meta2": "Escalator Upgrade",

      "partners.chip": "Our Partners",
      "partners.title": "Global partners, local execution.",
      "partners.desc": "We collaborate with OEMs, parts suppliers, and specialist teams to keep systems compliant, stocked, and running.",
      "cap1.kicker": "Control & Drives",
      "cap1.title": "Precision systems sourcing for stable ride quality.",
      "cap1.desc": "Fast access to controllers, VVVF drives, safety circuits, and compliant documentation for planned upgrades and urgent recoveries.",
      "cap2.kicker": "Field Coverage",
      "cap2.title": "Dispatch structure built for real-world downtime pressure.",
      "cap2.desc": "Regional technician network with tiered response levels, coordinated triage, and portfolio-level reporting for multi-site operators.",
      "cap3.kicker": "Parts Readiness",
      "cap3.title": "Critical components available before failures escalate.",
      "cap3.desc": "Recommended spare-part plans and fast availability for door operators, rollers, sensors, and control panels to reduce repeat outages.",
      "cap4.kicker": "Compliance Support",
      "cap4.title": "Inspection confidence with traceable service evidence.",
      "cap4.desc": "TUV and EN 81 aligned workflows, clear maintenance history, and inspection-ready handover packs prepared for audit windows.",

      "people.chip": "Some of our employees",
      "people.title": "Meet some of the people behind Aufsteig Technik.",
      "people.desc": "A snapshot of team members across engineering, field service, and operations who help keep projects moving.",
      "person1.bubble": "Hi, I plan upgrade roadmaps and keep every modernization step clear.",
      "person1.name": "Felix Schneider",
      "person1.role": "Engineering Manager",
      "person1.desc": "Planning, modernization scope, and compliance documentation.",
      "person2.bubble": "Hi, I handle diagnostics on site and coordinate fast technician dispatch.",
      "person2.name": "Matthias Wagner",
      "person2.role": "Field Service Lead",
      "person2.desc": "On-site diagnostics, repairs, and dispatch coordination.",
      "person3.bubble": "Hi, I manage scheduling, parts readiness, and practical client updates.",
      "person3.name": "Anna Becker",
      "person3.role": "Operations Coordinator",
      "person3.desc": "SLA scheduling, parts readiness, and client reporting.",
      "showcase1.bubble": "Hi, we handle on-site installation quality checks and keep each commissioning step aligned.",
      "showcase1.name": "Company Workers On Site",
      "showcase1.role": "Installation Specialists",
      "showcase1.desc": "On-site equipment setup, alignment verification, and final commissioning support for escalator systems.",
      "showcase2.bubble": "Escalator assembly workflow with stage-by-stage installation and quality checkpoints.",
      "showcase2.name": "Escalator Assembly Workflow",
      "showcase2.role": "Process & Quality Snapshot",
      "showcase2.desc": "A real installation process view showing assembly sequencing, fit-up control, and readiness checks before commissioning.",

      "ach.chip": "Project Achievements",

      "brain.title": "Choose your next upgrade phase, whenever you\u2019re ready",
      "brain.tag1": "Cabin Retrofit",
      "brain.tag2": "Drive Upgrade",
      "brain.tag3": "Control System",
      "brain.tag4": "Safety Check",
      "brain.tag5": "Energy Tune",
      "brain.headline": "For buildings that cannot afford downtime.",
      "brain.cta": "Book a site assessment",

      "sg.chip": "Services",
      "sg.title": "Everything your building needs to keep moving.",
      "sg.desc": "From supply and installation to monitoring, modernization, and audits\u2014delivered with calm process and fast dispatch.",
      "sg.specL.kicker": "System Specs",
      "sg.specL.0": "Space-saving integrated controls",
      "sg.specL.1": "Converter + microcomputer board",
      "sg.specL.2": "Stable ride quality under high traffic",
      "sg.specR.kicker": "Performance",
      "sg.specR.0": "Higher drive efficiency, lower energy use",
      "sg.specR.1": "Environmentally responsible operation",
      "sg.specR.2": "Safety-first engineering for passengers",
      "sg.tab.supply": "Elevators & Lifts Supply",
      "sg.tab.installation": "Mechanical & Electrical Installation",
      "sg.tab.maintenance": "Maintenance & After-Sales",
      "sg.tab.contracting": "Engineering Contracting",
      "sg.tab.supplies": "Premium Technical Supplies",
      "sg.tab.compliance": "Compliance & Safety Audits",

      "proc.s1.label": "STEP 01",
      "proc.s1.title": "Site Survey & Technical Planning",
      "proc.s1.desc": "Full site inspection, load analysis, shaft review, and layout planning for the optimal system configuration.",
      "proc.s2.label": "STEP 02",
      "proc.s2.title": "Procurement & Supply",
      "proc.s2.desc": "Certified systems, control units, and components sourced from trusted global manufacturing partners.",
      "proc.s3.label": "STEP 03",
      "proc.s3.title": "Installation & Commissioning",
      "proc.s3.desc": "Installation by certified engineers, comprehensive safety testing, calibration, and operational handover.",

      "wwo.chip": "What We Offer",
      "wwo.title": "Solutions tailored to every vertical mobility need.",
      "wwo.desc": "Product and solution categories across passenger transport, heavy-duty systems, modernization, and specialized lift applications.",
      "wwo.cta": "Browse design catalog",
      "wwo.t1.t": "Passenger Lifts",
      "wwo.t1.d": "Standard or custom, hydraulic or traction, MR or MRL.",
      "wwo.t2.t": "Freight Lifts",
      "wwo.t2.d": "Heavy-duty transport solutions for high-load logistics use.",
      "wwo.t3.t": "Home Solutions",
      "wwo.t3.d": "Compact, accessible lift systems for residential projects.",
      "wwo.t4.t": "Modernization Solutions",
      "wwo.t4.d": "From partial upgrades to complete replacement and performance renewal.",
      "wwo.t5.t": "Escalators & Moving Walks",
      "wwo.t5.d": "Efficient people-moving systems for high-frequency environments.",
      "wwo.t6.t": "Anti-vandal Lifts",
      "wwo.t6.d": "Durable lift configurations for demanding public utility areas.",
      "wwo.t7.t": "Firefighting Lifts",
      "wwo.t7.d": "Specialized systems supporting emergency response operations.",
      "wwo.t8.t": "Earthquake Resistant Lifts",
      "wwo.t8.d": "Detection-ready systems designed for seismic safety scenarios.",
      "wwo.t9.t": "Accessibility Solutions",
      "wwo.t9.d": "Comfort-first autonomy solutions for inclusive building access.",
      "wwo.t10.t": "Parking Systems",
      "wwo.t10.d": "Vertical transport configurations for parking and utility spaces.",
      "wwo.t11.t": "Marine Solutions",
      "wwo.t11.d": "Specialized elevator systems adapted for marine applications.",
      "wwo.t12.t": "Custom Solutions",
      "wwo.t12.d": "Tailor-made packages aligned with unique architectural demands.",

      "port.chip": "Latest Completed Work",
      "port.title": "Our engineering and elevator project portfolio.",
      "port.p1.t": "Passenger Elevator Installation",
      "port.p1.d": "High-capacity passenger system with smooth frequency-converter control and low-noise cabin performance.",
      "port.p2.t": "Commercial Escalator Modernization",
      "port.p2.d": "Drive, control, and safety upgrades for high-traffic retail infrastructure with reduced downtime windows.",
      "port.p3.t": "Hospital Bed Lift Deployment",
      "port.p3.d": "Medical-grade elevator installation focused on safe transport cycles, clean operations, and reliability.",
      "port.p4.t": "Panoramic Lift Lobby Upgrade",
      "port.p4.d": "Full lobby redesign with panoramic lift integration, updated control panels, and premium passenger flow guidance.",
      "port.p5.t": "Transit Escalator Reliability Program",
      "port.p5.d": "Station escalator modernization with condition monitoring, safer step-chain systems, and faster maintenance turnarounds.",

      "rat.chip": "Client Ratings",
      "rat.title": "Trusted by top operators across Germany.",
      "rat.q1": "\u201cReliable execution and excellent uptime gains.\u201d",
      "rat.q2": "\u201cModernization quality exceeded our internal benchmark.\u201d",
      "rat.q3": "\u201cFast response, clear reporting, and strong technical discipline.\u201d",
      "rat.q4": "\u201cConsistent performance uplift across multiple facilities.\u201d",
      "rat.q5": "\u201cProfessional delivery with safety and reliability at the core.\u201d",
      "rat.q6": "\u201cOutstanding maintenance quality and minimal service disruption.\u201d",
      "rat.q7": "\u201cA dependable partner for mission-critical transport systems.\u201d",

      "faq.chip": "FAQ",
      "faq.title.pre": "We are here to help. If you did not find the answer to your question, ",
      "faq.title.link": "email us",
      "faq.title.post": " anytime.",
      "faq.q1": "Do you service both elevators and escalators?",
      "faq.a1": "Yes. We maintain elevators, escalators, moving walks, and hybrid mobility systems across commercial and residential properties.",
      "faq.q2": "Can you modernize older systems without full replacement?",
      "faq.a2": "Absolutely. We can retrofit key components in phases to reduce outages while bringing performance and safety up to modern standards.",
      "faq.q3": "Do you offer contracts for multi-site portfolios?",
      "faq.a3": "Yes. We provide centralized reporting, SLA-based response levels, and regional technician coverage for portfolio operators.",
      "faq.q4": "How fast is emergency response in major German cities?",
      "faq.a4": "Most metro areas receive dispatch within 60 minutes depending on contract tier and real-time traffic conditions.",
      "faq.q5": "How often should elevators and escalators be maintained?",
      "faq.a5": "It depends on traffic, age, and building type. We recommend a preventive schedule tailored to usage, with higher-frequency checks for high-traffic sites like retail and transit hubs.",
      "faq.q6": "Do you handle T\u00dcV preparation and documentation?",
      "faq.a6": "Yes. We prepare checklists, service records, and corrective actions so your system is inspection-ready with clear documentation and traceable maintenance history.",
      "faq.q7": "Can you modernize systems with minimal downtime?",
      "faq.a7": "Yes. We plan modernization in phases\u2014controls, drive, safety, and cabin\u2014so your building stays operational while performance and compliance improve step by step.",
      "faq.q8": "Do you provide spare parts and long-term support?",
      "faq.a8": "We source certified parts, maintain recommended spares for critical sites, and track part compatibility so repairs are faster and repeat issues are reduced.",
      "faq.q9": "What information should I send when reporting a fault?",
      "faq.a9": "Share the building address, system type, any fault code shown on the panel, time of incident, and photos/videos if possible. This helps us dispatch the right technician and parts.",

      "contact.chip": "Get in touch",
      "contact.title": "Questions or concerns?",
      "contact.desc": "Tell us what building you manage and what you need. We\u2019ll reply with clear next steps, timeline, and a transparent quote.",
      "contact.email.label": "Email",
      "contact.email.hint": "Send drawings, photos, or fault codes",
      "contact.address.label": "Address",
      "contact.form.name": "Full Name *",
      "contact.form.email": "Email *",
      "contact.form.phone": "Phone",
      "contact.form.subject": "Subject",
      "contact.form.message": "Message *",
      "contact.form.consent": "I agree to be contacted about this request.",
      "contact.form.submit": "Submit now",

      "slogan.l1": "Elevating",
      "slogan.l2": "everyday mobility",
      "slogan.l3": "with trusted precision.",

      "footer.desc": "Reliable vertical transportation for offices, retail, infrastructure, and living spaces.",
      "footer.cta": "Start your project",
      "footer.info": "Information",
      "footer.contact": "Contact",
      "footer.techConfig": "Technical Configurations",
      "footer.shaftPlans": "Shaft Layout Plans",
      "footer.projects": "Projects",

      "mq1.1": "Engineered for Safety",
      "mq1.2": "Built for Performance",
      "mq1.3": "Elevating Tomorrow Together",
      "mq1.4": "T\u00dcV S\u00dcD Certified",
      "mq1.5": "DEKRA Partner",
      "mq1.6": "18 Years of Excellence",
      "mq1.7": "250+ Projects Delivered",
      "mq1.8": "Germany \u2014 Berlin \u00b7 Munich \u00b7 Frankfurt",

      "mq2.1": "24/7 Monitoring",
      "mq2.2": "Fast Dispatch",
      "mq2.3": "EN 81 Compliant",
      "mq2.4": "Elevator Supply",
      "mq2.5": "Escalator Modernization",
      "mq2.6": "Cabin Retrofit",
      "mq2.7": "Drive Upgrade",
      "mq2.8": "Safety Audits"
    },

    de: {
      "nav.home": "Startseite",
      "nav.about": "\u00dcber uns",
      "nav.partners": "Unsere Partner",
      "nav.services": "Dienstleistungen",
      "nav.products": "Produkte",
      "nav.contact": "Kontakt",
      "nav.faq": "FAQ",

      "hero.eyebrow": "Aufz\u00fcge & Rolltreppen / Deutschland",
      "hero.title1": "Vertikale Mobilit\u00e4t",
      "hero.title2": "ohne Reibung",
      "hero.desc": "Aufsteig Technik baut, modernisiert und wartet Premium-Systeme f\u00fcr B\u00fcros, Einzelhandel, Verkehrsknotenpunkte und Wohnt\u00fcrme.",
      "hero.cta.tagline": "24/7-\u00dcberwachung. Schneller Einsatz. T\u00dcV-konforme Wartung.",
      "hero.cta.btn": "Standortbewertung buchen",

      "about.chip": "F\u00fcr Geb\u00e4ude mit hohem Verkehrsaufkommen",
      "about.title": "Sichere, leise und effiziente Bewegung von der Lobby bis zum Dachgeschoss.",
      "about.desc": "Wir liefern erstklassige Ingenieurversorgung und Vertragsleistungen f\u00fcr Aufz\u00fcge und fortschrittliche elektromechanische Systeme f\u00fcr gewerbliche, industrielle und Wohnprojekte.",
      "about.stat1.val": "18+",
      "about.stat1.label": "Jahre Erfahrung in Technik und Installation",
      "about.stat2.val": "250+",
      "about.stat2.label": "Abgeschlossene Aufzugs- und Rolltreppenprojekte",
      "about.stat3.val": "98%",
      "about.stat3.label": "Durchschnittliche Betriebszeit unter Wartungsvertr\u00e4gen",
      "about.trust": "Zertifizierter Partner von",
      "about.trust.monitoring": "24/7-\u00dcberwachung",
      "about.trust.compliant": "EN 81 konform",
      "about.slide1": "Industrieausstellung \u2014 Pr\u00e4sentation intelligenter Aufzugsl\u00f6sungen",
      "about.slide2": "Partnerschaftsvereinbarung \u2014 St\u00e4rkung globaler Allianzen",
      "about.slide3": "Internationale Partnerschaft \u2014 Zusammenarbeit \u00c4gypten & Deutschland",
      "about.slide4": "Zertifizierte Exzellenz \u2014 Offizielle T\u00dcV S\u00dcD & DEKRA Partnerschaften",

      "svc.title": "Werkzeuge, die mit Ihrem Geb\u00e4ude arbeiten, nicht dagegen",
      "svc.pill1": "F\u00fcr Ruhe konzipiert, nicht Chaos",
      "svc.pill2": "Der m\u00fchelose Weg zu beginnen",
      "svc.pill3": "Voll konzentriert bleiben",
      "svc.pill4": "Kleine Schritte. Kein schlechtes Gewissen",
      "svc.bottom1": "Keine Ausfallzeiten. Keine komplizierten Abl\u00e4ufe.",
      "svc.bottom2": "Nur zuverl\u00e4ssige Bewegung, klar verwaltet.",
      "svc.cta": "Angebot anfordern",
      "svc.card1.kicker": "Kontrollzentrum",
      "svc.card1.title": "F\u00fcr Ruhe konzipiert, nicht Chaos",
      "svc.card1.desc": "Der Live-Systemstatus wird in einer \u00fcbersichtlichen Ansicht dargestellt, damit Teams schnell handeln k\u00f6nnen.",
      "svc.card1.meta1": "Standortzustand",
      "svc.card1.meta2": "Ruhiger Lobbyfluss",
      "svc.card2.kicker": "Einsatzintelligenz",
      "svc.card2.title": "Der m\u00fchelose Weg zu beginnen",
      "svc.card2.desc": "St\u00f6rungsaufnahme, Teamzuweisung und Teileauswahl werden in einem gef\u00fchrten Ablauf zusammengefasst.",
      "svc.card2.meta1": "Schneller Einsatz",
      "svc.card2.meta2": "Innenraumzugang bereit",
      "svc.card3.kicker": "Flussfokus",
      "svc.card3.title": "Voll konzentriert bleiben",
      "svc.card3.desc": "Sto\u00dfzeiten-Diagnosen erkennen Staus und optimieren die Stopplogik automatisch f\u00fcr konsistente Fahrgastbewegung.",
      "svc.card3.meta1": "Panel-Analyse",
      "svc.card3.meta2": "Fokussierte Steuerung",
      "svc.card4.kicker": "Modernisierungspfad",
      "svc.card4.title": "Kleine Schritte. Kein schlechtes Gewissen",
      "svc.card4.desc": "Upgrades werden phasenweise durchgef\u00fchrt, damit Ihr Geb\u00e4ude betriebsbereit bleibt.",
      "svc.card4.meta1": "Modernisierung",
      "svc.card4.meta2": "Rolltreppen-Upgrade",

      "partners.chip": "Unsere Partner",
      "partners.title": "Globale Partner, lokale Umsetzung.",
      "partners.desc": "Wir arbeiten mit OEMs, Teilelieferanten und Spezialistenteams zusammen, um Systeme konform und betriebsbereit zu halten.",
      "cap1.kicker": "Steuerung & Antriebe",
      "cap1.title": "Pr\u00e4zise Systembeschaffung f\u00fcr stabile Fahrqualit\u00e4t.",
      "cap1.desc": "Schneller Zugang zu Steuerungen, VVVF-Antrieben, Sicherheitskreisen und konformer Dokumentation.",
      "cap2.kicker": "Fl\u00e4chenabdeckung",
      "cap2.title": "Einsatzstruktur f\u00fcr realen Ausfallzeitdruck konzipiert.",
      "cap2.desc": "Regionales Technikernetzwerk mit gestuften Reaktionsebenen und Portfolio-Berichterstattung.",
      "cap3.kicker": "Teilebereitschaft",
      "cap3.title": "Kritische Komponenten verf\u00fcgbar, bevor Ausf\u00e4lle eskalieren.",
      "cap3.desc": "Empfohlene Ersatzteilpl\u00e4ne und schnelle Verf\u00fcgbarkeit f\u00fcr T\u00fcrantriebe, Rollen, Sensoren und Schalttafeln.",
      "cap4.kicker": "Compliance-Support",
      "cap4.title": "Pr\u00fcfungssicherheit mit nachverfolgbaren Servicenachweisen.",
      "cap4.desc": "T\u00dcV- und EN 81-konforme Arbeitsabl\u00e4ufe, klare Wartungshistorie und pr\u00fcfungsbereite \u00dcbergabepakete.",

      "people.chip": "Einige unserer Mitarbeiter",
      "people.title": "Lernen Sie einige der Menschen hinter Aufsteig Technik kennen.",
      "people.desc": "Ein \u00dcberblick \u00fcber Teammitglieder in Technik, Au\u00dfendienst und Betrieb.",
      "person1.bubble": "Hallo, ich plane Upgrade-Roadmaps und halte jeden Modernisierungsschritt klar.",
      "person1.name": "Felix Schneider",
      "person1.role": "Ingenieur-Manager",
      "person1.desc": "Planung, Modernisierungsumfang und Compliance-Dokumentation.",
      "person2.bubble": "Hallo, ich k\u00fcmmere mich um Diagnosen vor Ort und koordiniere den schnellen Technikereinsatz.",
      "person2.name": "Matthias Wagner",
      "person2.role": "Au\u00dfendienst-Leiter",
      "person2.desc": "Vor-Ort-Diagnosen, Reparaturen und Einsatzkoordination.",
      "person3.bubble": "Hallo, ich verwalte Terminplanung, Teilebereitschaft und praktische Kundenupdates.",
      "person3.name": "Anna Becker",
      "person3.role": "Betriebskoordinatorin",
      "person3.desc": "SLA-Planung, Teilebereitschaft und Kundenberichterstattung.",
      "showcase1.bubble": "Hallo, wir f\u00fchren Qualit\u00e4tskontrollen bei der Installation vor Ort durch.",
      "showcase1.name": "Firmenmitarbeiter vor Ort",
      "showcase1.role": "Installationsspezialisten",
      "showcase1.desc": "Vor-Ort-Ger\u00e4teeinrichtung, Ausrichtungspr\u00fcfung und Inbetriebnahmeunterst\u00fctzung.",
      "showcase2.bubble": "Rolltreppen-Montageworkflow mit stufenweiser Installation und Qualit\u00e4tspr\u00fcfpunkten.",
      "showcase2.name": "Rolltreppen-Montageworkflow",
      "showcase2.role": "Prozess- & Qualit\u00e4ts\u00fcbersicht",
      "showcase2.desc": "Eine echte Installationsprozessansicht mit Montagesequenzierung und Bereitschaftspr\u00fcfungen.",

      "ach.chip": "Projektleistungen",

      "brain.title": "W\u00e4hlen Sie Ihre n\u00e4chste Upgrade-Phase, wann immer Sie bereit sind",
      "brain.tag1": "Kabinenr\u00fcckr\u00fcstung",
      "brain.tag2": "Antriebsupgrade",
      "brain.tag3": "Steuerungssystem",
      "brain.tag4": "Sicherheitscheck",
      "brain.tag5": "Energieoptimierung",
      "brain.headline": "F\u00fcr Geb\u00e4ude, die sich keine Ausfallzeit leisten k\u00f6nnen.",
      "brain.cta": "Standortbewertung buchen",

      "sg.chip": "Dienstleistungen",
      "sg.title": "Alles, was Ihr Geb\u00e4ude braucht, um in Bewegung zu bleiben.",
      "sg.desc": "Von Lieferung und Installation bis zu \u00dcberwachung, Modernisierung und Audits \u2014 mit ruhigem Prozess und schnellem Einsatz.",
      "sg.specL.kicker": "Systemspezifikationen",
      "sg.specL.0": "Platzsparende integrierte Steuerungen",
      "sg.specL.1": "Umrichter + Mikrocomputerplatine",
      "sg.specL.2": "Stabile Fahrqualit\u00e4t bei hohem Verkehr",
      "sg.specR.kicker": "Leistung",
      "sg.specR.0": "H\u00f6here Antriebseffizienz, geringerer Energieverbrauch",
      "sg.specR.1": "Umweltverantwortlicher Betrieb",
      "sg.specR.2": "Sicherheit an erster Stelle f\u00fcr Fahrg\u00e4ste",
      "sg.tab.supply": "Aufz\u00fcge & Aufzugsversorgung",
      "sg.tab.installation": "Mechanische & Elektrische Installation",
      "sg.tab.maintenance": "Wartung & Kundendienst",
      "sg.tab.contracting": "Ingenieur-Vertragsleistungen",
      "sg.tab.supplies": "Premium Technische Versorgung",
      "sg.tab.compliance": "Compliance & Sicherheitsaudits",

      "proc.s1.label": "SCHRITT 01",
      "proc.s1.title": "Standortbesichtigung & Technische Planung",
      "proc.s1.desc": "Vollst\u00e4ndige Standortinspektion, Lastanalyse, Schachtpr\u00fcfung und Layoutplanung f\u00fcr die optimale Systemkonfiguration.",
      "proc.s2.label": "SCHRITT 02",
      "proc.s2.title": "Beschaffung & Lieferung",
      "proc.s2.desc": "Zertifizierte Systeme, Steuereinheiten und Komponenten von vertrauensw\u00fcrdigen globalen Fertigungspartnern.",
      "proc.s3.label": "SCHRITT 03",
      "proc.s3.title": "Installation & Inbetriebnahme",
      "proc.s3.desc": "Installation durch zertifizierte Ingenieure, umfassende Sicherheitspr\u00fcfung, Kalibrierung und Betriebs\u00fcbergabe.",

      "wwo.chip": "Was wir bieten",
      "wwo.title": "L\u00f6sungen f\u00fcr jeden Bedarf an vertikaler Mobilit\u00e4t.",
      "wwo.desc": "Produkt- und L\u00f6sungskategorien f\u00fcr Personentransport, Schwerlastsysteme, Modernisierung und spezialisierte Aufzugsanwendungen.",
      "wwo.cta": "Designkatalog durchst\u00f6bern",
      "wwo.t1.t": "Personenaufz\u00fcge",
      "wwo.t1.d": "Standard oder individuell, hydraulisch oder Seilantrieb, MR oder MRL.",
      "wwo.t2.t": "Lastenaufz\u00fcge",
      "wwo.t2.d": "Schwerlast-Transportl\u00f6sungen f\u00fcr logistischen Hochlast-Einsatz.",
      "wwo.t3.t": "Heiml\u00f6sungen",
      "wwo.t3.d": "Kompakte, barrierefreie Aufzugssysteme f\u00fcr Wohnprojekte.",
      "wwo.t4.t": "Modernisierungsl\u00f6sungen",
      "wwo.t4.d": "Von Teilupgrades bis zum vollst\u00e4ndigen Austausch und Leistungserneuerung.",
      "wwo.t5.t": "Rolltreppen & Fahrsteige",
      "wwo.t5.d": "Effiziente Personenbef\u00f6rderungssysteme f\u00fcr Hochfrequenzbereiche.",
      "wwo.t6.t": "Vandalismusgesch\u00fctzte Aufz\u00fcge",
      "wwo.t6.d": "Robuste Aufzugskonfigurationen f\u00fcr anspruchsvolle \u00f6ffentliche Bereiche.",
      "wwo.t7.t": "Feuerwehraufz\u00fcge",
      "wwo.t7.d": "Spezialsysteme zur Unterst\u00fctzung von Notfalleins\u00e4tzen.",
      "wwo.t8.t": "Erdbebenresistente Aufz\u00fcge",
      "wwo.t8.d": "Erkennungsbereite Systeme f\u00fcr Erdbebensicherheitsszenarien.",
      "wwo.t9.t": "Barrierefreie L\u00f6sungen",
      "wwo.t9.d": "Komfort-orientierte Autonomiel\u00f6sungen f\u00fcr barrierefreien Geb\u00e4udezugang.",
      "wwo.t10.t": "Parksysteme",
      "wwo.t10.d": "Vertikaltransportkonfigurationen f\u00fcr Park- und Nutzfl\u00e4chen.",
      "wwo.t11.t": "Marinel\u00f6sungen",
      "wwo.t11.d": "Spezialisierte Aufzugssysteme f\u00fcr Marineanwendungen.",
      "wwo.t12.t": "Individuelle L\u00f6sungen",
      "wwo.t12.d": "Ma\u00dfgeschneiderte Pakete f\u00fcr einzigartige architektonische Anforderungen.",

      "port.chip": "Neueste abgeschlossene Arbeiten",
      "port.title": "Unser Ingenieur- und Aufzugsprojektportfolio.",
      "port.p1.t": "Personenaufzugsinstallation",
      "port.p1.d": "Hochkapazit\u00e4ts-Personensystem mit sanfter Frequenzumrichtersteuerung und ger\u00e4uscharmer Kabinenleistung.",
      "port.p2.t": "Kommerzielle Rolltreppenmodernisierung",
      "port.p2.d": "Antriebs-, Steuerungs- und Sicherheitsupgrades f\u00fcr stark frequentierte Einzelhandelsinfrastruktur.",
      "port.p3.t": "Krankenhausbettaufzug-Bereitstellung",
      "port.p3.d": "Medizinische Aufzugsinstallation mit Fokus auf sichere Transportzyklen und Zuverl\u00e4ssigkeit.",
      "port.p4.t": "Panoramaaufzug-Lobby-Upgrade",
      "port.p4.d": "Vollst\u00e4ndige Lobby-Neugestaltung mit Panoramaaufzug-Integration und aktualisierten Schalttafeln.",
      "port.p5.t": "Transitrolltreppen-Zuverl\u00e4ssigkeitsprogramm",
      "port.p5.d": "Bahnhofsrolltreppen-Modernisierung mit Zustands\u00fcberwachung und sichereren Stufenkettensystemen.",

      "rat.chip": "Kundenbewertungen",
      "rat.title": "Von f\u00fchrenden Betreibern in ganz Deutschland vertraut.",
      "rat.q1": "\u201eZuverl\u00e4ssige Ausf\u00fchrung und hervorragende Verf\u00fcgbarkeitssteigerungen.\u201c",
      "rat.q2": "\u201eModernisierungsqualit\u00e4t hat unseren internen Ma\u00dfstab \u00fcbertroffen.\u201c",
      "rat.q3": "\u201eSchnelle Reaktion, klare Berichterstattung und starke technische Disziplin.\u201c",
      "rat.q4": "\u201eKonsistente Leistungssteigerung \u00fcber mehrere Einrichtungen.\u201c",
      "rat.q5": "\u201eProfessionelle Lieferung mit Sicherheit und Zuverl\u00e4ssigkeit im Kern.\u201c",
      "rat.q6": "\u201eHerausragende Wartungsqualit\u00e4t und minimale Serviceunterbrechung.\u201c",
      "rat.q7": "\u201eEin zuverl\u00e4ssiger Partner f\u00fcr gesch\u00e4ftskritische Transportsysteme.\u201c",

      "faq.chip": "FAQ",
      "faq.title.pre": "Wir sind hier, um zu helfen. Wenn Sie die Antwort auf Ihre Frage nicht gefunden haben, ",
      "faq.title.link": "schreiben Sie uns",
      "faq.title.post": " jederzeit.",
      "faq.q1": "Warten Sie sowohl Aufz\u00fcge als auch Rolltreppen?",
      "faq.a1": "Ja. Wir warten Aufz\u00fcge, Rolltreppen, Fahrsteige und hybride Mobilit\u00e4tssysteme in gewerblichen und Wohnimmobilien.",
      "faq.q2": "K\u00f6nnen Sie \u00e4ltere Systeme ohne vollst\u00e4ndigen Austausch modernisieren?",
      "faq.a2": "Absolut. Wir k\u00f6nnen Schl\u00fcsselkomponenten phasenweise nachr\u00fcsten, um Ausf\u00e4lle zu reduzieren.",
      "faq.q3": "Bieten Sie Vertr\u00e4ge f\u00fcr Mehrstandort-Portfolios an?",
      "faq.a3": "Ja. Wir bieten zentralisierte Berichterstattung, SLA-basierte Reaktionsebenen und regionale Technikerabdeckung.",
      "faq.q4": "Wie schnell ist die Notfallreaktion in deutschen Gro\u00dfst\u00e4dten?",
      "faq.a4": "Die meisten Metropolregionen erhalten einen Einsatz innerhalb von 60 Minuten.",
      "faq.q5": "Wie oft sollten Aufz\u00fcge und Rolltreppen gewartet werden?",
      "faq.a5": "Es h\u00e4ngt von Verkehr, Alter und Geb\u00e4udetyp ab. Wir empfehlen einen pr\u00e4ventiven Zeitplan, der auf die Nutzung zugeschnitten ist.",
      "faq.q6": "\u00dcbernehmen Sie die T\u00dcV-Vorbereitung und Dokumentation?",
      "faq.a6": "Ja. Wir erstellen Checklisten, Serviceprotokolle und Korrekturma\u00dfnahmen, damit Ihr System pr\u00fcfungsbereit ist.",
      "faq.q7": "K\u00f6nnen Sie Systeme mit minimaler Ausfallzeit modernisieren?",
      "faq.a7": "Ja. Wir planen Modernisierungen in Phasen \u2014 Steuerung, Antrieb, Sicherheit und Kabine.",
      "faq.q8": "Bieten Sie Ersatzteile und langfristigen Support?",
      "faq.a8": "Wir beschaffen zertifizierte Teile und verfolgen die Teilekompatibilit\u00e4t f\u00fcr schnellere Reparaturen.",
      "faq.q9": "Welche Informationen sollte ich bei der Meldung eines Fehlers senden?",
      "faq.a9": "Teilen Sie die Geb\u00e4udeadresse, den Systemtyp, Fehlercode, Zeitpunkt und wenn m\u00f6glich Fotos/Videos mit.",

      "contact.chip": "Kontakt aufnehmen",
      "contact.title": "Fragen oder Anliegen?",
      "contact.desc": "Teilen Sie uns mit, welches Geb\u00e4ude Sie verwalten und was Sie ben\u00f6tigen. Wir antworten mit klaren n\u00e4chsten Schritten und einem transparenten Angebot.",
      "contact.email.label": "E-Mail",
      "contact.email.hint": "Zeichnungen, Fotos oder Fehlercodes senden",
      "contact.address.label": "Adresse",
      "contact.form.name": "Vollst\u00e4ndiger Name *",
      "contact.form.email": "E-Mail *",
      "contact.form.phone": "Telefon",
      "contact.form.subject": "Betreff",
      "contact.form.message": "Nachricht *",
      "contact.form.consent": "Ich stimme zu, bez\u00fcglich dieser Anfrage kontaktiert zu werden.",
      "contact.form.submit": "Jetzt absenden",

      "slogan.l1": "Wir heben",
      "slogan.l2": "allt\u00e4gliche Mobilit\u00e4t",
      "slogan.l3": "mit verl\u00e4sslicher Pr\u00e4zision.",

      "footer.desc": "Zuverl\u00e4ssiger Vertikaltransport f\u00fcr B\u00fcros, Einzelhandel, Infrastruktur und Wohnr\u00e4ume.",
      "footer.cta": "Projekt starten",
      "footer.info": "Information",
      "footer.contact": "Kontakt",
      "footer.techConfig": "Technische Konfigurationen",
      "footer.shaftPlans": "Schachtlayoutpl\u00e4ne",
      "footer.projects": "Projekte",

      "mq1.1": "Entwickelt f\u00fcr Sicherheit",
      "mq1.2": "Gebaut f\u00fcr Leistung",
      "mq1.3": "Gemeinsam die Zukunft gestalten",
      "mq1.4": "T\u00dcV S\u00dcD Zertifiziert",
      "mq1.5": "DEKRA Partner",
      "mq1.6": "18 Jahre Exzellenz",
      "mq1.7": "250+ Projekte abgeschlossen",
      "mq1.8": "Deutschland \u2014 Berlin \u00b7 M\u00fcnchen \u00b7 Frankfurt",

      "mq2.1": "24/7 \u00dcberwachung",
      "mq2.2": "Schneller Einsatz",
      "mq2.3": "EN 81 Konform",
      "mq2.4": "Aufzugsversorgung",
      "mq2.5": "Rolltreppenmodernisierung",
      "mq2.6": "Kabinenr\u00fcckr\u00fcstung",
      "mq2.7": "Antriebsupgrade",
      "mq2.8": "Sicherheitsaudits"
    }
  };

  function t(key) {
    var dict = T[currentLang] || T[DEFAULT_LANG];
    return dict[key] !== undefined ? dict[key] : (T[DEFAULT_LANG][key] || key);
  }

  function lang() { return currentLang; }

  function apply(langCode) {
    if (!T[langCode]) langCode = DEFAULT_LANG;
    currentLang = langCode;
    try { localStorage.setItem(STORAGE_KEY, langCode); } catch (e) {}

    document.documentElement.lang = langCode;
    document.documentElement.dir = "ltr";

    var els = document.querySelectorAll("[data-i18n]");
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      var key = el.getAttribute("data-i18n");
      var val = t(key);

      var anchor = el.querySelector("a");
      if (anchor) {
        var nodes = el.childNodes;
        for (var n = 0; n < nodes.length; n++) {
          if (nodes[n].nodeType === 3 && nodes[n].textContent.trim()) {
            nodes[n].textContent = val;
            break;
          }
        }
        continue;
      }

      var bold = el.querySelector("b");
      if (bold) {
        var bNodes = el.childNodes;
        for (var j = 0; j < bNodes.length; j++) {
          if (bNodes[j].nodeType === 3) {
            bNodes[j].textContent = val + " ";
            break;
          }
        }
      } else {
        el.textContent = val;
      }
    }

    var phEls = document.querySelectorAll("[data-i18n-ph]");
    for (var p = 0; p < phEls.length; p++) {
      phEls[p].placeholder = t(phEls[p].getAttribute("data-i18n-ph"));
    }

    var langBtns = document.querySelectorAll("[data-lang]");
    for (var b = 0; b < langBtns.length; b++) {
      langBtns[b].classList.toggle("is-active", langBtns[b].getAttribute("data-lang") === langCode);
    }

    window.dispatchEvent(new CustomEvent("site-lang-changed"));

    if (window.spI18n && typeof window.spI18n.apply === "function") {
      window.spI18n.apply(langCode);
    }

    /* Hero + split reveals use word spans; apply() replaces [data-i18n] text and removes them.
       main.js assigns __runAfterI18nApply — run after apply so GSAP targets real DOM. */
    window.setTimeout(function () {
      if (typeof window.__runAfterI18nApply === "function") {
        window.__runAfterI18nApply();
      }
    }, 0);
  }

  function boot() {
    var langBtns = document.querySelectorAll("[data-lang]");
    for (var i = 0; i < langBtns.length; i++) {
      langBtns[i].addEventListener("click", function () {
        apply(this.getAttribute("data-lang"));
      });
    }
    var saved = DEFAULT_LANG;
    try { saved = localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG; } catch (e) {}
    if (T[saved]) apply(saved);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  window.siteI18n = { t: t, apply: apply, lang: lang };
  window.siteT = t;
})();
