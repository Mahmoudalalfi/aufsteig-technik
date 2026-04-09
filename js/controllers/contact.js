export function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const fd = new FormData(form);
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const phone = String(fd.get("phone") || "").trim();
    const subject = String(fd.get("subject") || "Website inquiry").trim();
    const message = String(fd.get("message") || "").trim();

    const body = [`Name: ${name}`, `Email: ${email}`, phone ? `Phone: ${phone}` : null, "", message]
      .filter(Boolean)
      .join("\n");

    const mailto = `mailto:info@aufsteig-technik.de?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  });
}
