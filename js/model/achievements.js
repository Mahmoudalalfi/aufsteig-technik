export const ACHIEVEMENT_PROJECTS = [
    {
      imageBefore: "assets/achievements-pencil/OTSNE.png",
      imageAfter: "assets/achievements-real/OTSNE-after.png",
      title: "Berlin Office Tower Lift Modernization",
      message: "Completed a full control and cabin modernization with phased downtime windows, improving passenger flow and reliability.",
      highlights: [
        "New drive + control integration completed",
        "Dispatch response time improved across the site",
        "TUV-ready documentation delivered at handover"
      ]
    },
    {
      imageBefore: "assets/achievements-pencil/NkMkx.png",
      imageAfter: "assets/achievements-real/NkMkx-after.png",
      title: "Frankfurt Transit Escalator Reliability Upgrade",
      message: "Delivered a station-wide escalator upgrade focused on safer step-chain performance and lower recurring faults.",
      highlights: [
        "Safer step-chain and drive components installed",
        "Maintenance turnaround reduced across peak hours",
        "Service continuity preserved during rollout phases"
      ]
    },
    {
      imageBefore: "assets/achievements-pencil/LZ4Gx.png",
      imageAfter: "assets/achievements-real/LZ4Gx-after.png",
      title: "Munich Hospital Bed-Lift Deployment",
      message: "Installed medical-grade bed lifts with precision leveling and dependable operating cycles for clinical workflows.",
      highlights: [
        "Patient transport lift packages commissioned",
        "Precision stopping and door safety tuned",
        "Handover completed with clinical team training"
      ]
    },
    {
      imageBefore: "assets/achievements-pencil/l1F8g.png",
      imageAfter: "assets/achievements-real/l1F8g-after.png",
      title: "Panoramic Lobby Lift Experience Renewal",
      message: "Rebuilt a premium lobby journey with panoramic lift integration, refreshed controls, and smoother vertical circulation.",
      highlights: [
        "Panoramic cabins integrated into existing core",
        "Control panels and wayfinding upgraded",
        "Passenger movement quality significantly improved"
      ]
    }
  ];

export const ACHIEVEMENT_PROJECTS_DE = [
    {
      imageBefore: "assets/achievements-pencil/OTSNE.png",
      imageAfter: "assets/achievements-real/OTSNE-after.png",
      title: "Berliner B\u00fcroturm-Aufzugsmodernisierung",
      message: "Vollst\u00e4ndige Steuerungs- und Kabinenmodernisierung mit phasenweisen Ausfallzeitfenstern, Verbesserung des Fahrgastflusses und der Zuverl\u00e4ssigkeit.",
      highlights: [
        "Neuer Antrieb + Steuerungsintegration abgeschlossen",
        "Einsatzreaktionszeit standortweit verbessert",
        "T\u00dcV-konforme Dokumentation bei \u00dcbergabe geliefert"
      ]
    },
    {
      imageBefore: "assets/achievements-pencil/NkMkx.png",
      imageAfter: "assets/achievements-real/NkMkx-after.png",
      title: "Frankfurter Transitrolltreppen-Zuverl\u00e4ssigkeitsupgrade",
      message: "Stationsweites Rolltreppen-Upgrade mit sichererer Stufenketten-Performance und weniger wiederkehrenden St\u00f6rungen.",
      highlights: [
        "Sicherere Stufenketten- und Antriebskomponenten installiert",
        "Wartungsdurchlaufzeit in Spitzenzeiten reduziert",
        "Servicekontinuit\u00e4t w\u00e4hrend der Einf\u00fchrungsphasen gew\u00e4hrleistet"
      ]
    },
    {
      imageBefore: "assets/achievements-pencil/LZ4Gx.png",
      imageAfter: "assets/achievements-real/LZ4Gx-after.png",
      title: "M\u00fcnchner Krankenhaus-Bettaufzug-Bereitstellung",
      message: "Installation medizinischer Bettaufz\u00fcge mit Pr\u00e4zisionsnivellierung und zuverl\u00e4ssigen Betriebszyklen f\u00fcr klinische Abl\u00e4ufe.",
      highlights: [
        "Patiententransport-Aufzugspakete in Betrieb genommen",
        "Pr\u00e4zisionsstopp und T\u00fcrsicherheit eingestellt",
        "\u00dcbergabe mit klinischer Teamschulung abgeschlossen"
      ]
    },
    {
      imageBefore: "assets/achievements-pencil/l1F8g.png",
      imageAfter: "assets/achievements-real/l1F8g-after.png",
      title: "Panoramaaufzug-Lobby-Erneuerung",
      message: "Premium-Lobby-Erlebnis mit Panoramaaufzug-Integration, erneuerten Steuerungen und verbesserter vertikaler Zirkulation.",
      highlights: [
        "Panoramakabinen in bestehenden Kern integriert",
        "Schalttafeln und Wegf\u00fchrung aufger\u00fcstet",
        "Fahrgastbewegungsqualit\u00e4t deutlich verbessert"
      ]
    }
  ];

export function getAchievements(lang) {
  if (lang === "de") return ACHIEVEMENT_PROJECTS_DE;
  return ACHIEVEMENT_PROJECTS;
}
