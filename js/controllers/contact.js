import { sendConfirmationEmail, sendInboxEmail } from "../utils/emailjs-send.js";

function contactT(key, fallback) {
  try {
    if (typeof window.siteT === "function") return window.siteT(key);
  } catch (_) {}
  return fallback;
}

function setStatus(el, text, kind) {
  if (!el) return;
  el.hidden = !text;
  el.textContent = text;
  el.classList.remove("contact-form-status--success", "contact-form-status--error");
  if (kind === "success") el.classList.add("contact-form-status--success");
  if (kind === "error") el.classList.add("contact-form-status--error");
}

export function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const statusEl = document.getElementById("contactFormStatus");
  const submitBtn = form.querySelector('button[type="submit"]');
  const submitI18nKey = submitBtn?.getAttribute("data-i18n") || "contact.form.submit";
  const defaultSubmitLabel = submitBtn ? submitBtn.textContent : "";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fd = new FormData(form);
    const name       = String(fd.get("name")    || "").trim();
    const email      = String(fd.get("email")   || "").trim();
    const phone      = String(fd.get("phone")   || "").trim();
    const subjectRaw = String(fd.get("subject") || "").trim();
    const message    = String(fd.get("message") || "").trim();

    const subject = subjectRaw || contactT("contact.form.defaultSubject", "Website inquiry");

    // Full details for company inbox
    const inboxMessage = [
      `Name:    ${name}`,
      `Email:   ${email}`,
      phone ? `Phone:   ${phone}` : null,
      `Subject: ${subject}`,
      ``,
      `Message:`,
      message,
    ].filter(l => l !== null).join("\n");

    setStatus(statusEl, "", null);
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = contactT("contact.form.sending", "Sending...");
    }

    try {
      await sendInboxEmail({
        fromName:  name,
        fromEmail: email,
        subject:   `${subject} — ${name} — ${email}`,
        message:   inboxMessage,
      });

      setStatus(statusEl, contactT("contact.form.success", "Thank you — your message was sent."), "success");
      form.reset();

      sendConfirmationEmail({
        toEmail: email,
        toName:  name,
        subject: "We received your inquiry — Aufstieg Technik",
        message: message,
      });
    } catch {
      setStatus(statusEl, contactT("contact.form.error", "Something went wrong. Please try again or email us directly."), "error");
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = typeof window.siteT === "function"
          ? window.siteT(submitI18nKey)
          : defaultSubmitLabel;
      }
    }
  });
}
