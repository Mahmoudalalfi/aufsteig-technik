import { CONTACT_INBOX_EMAIL } from "../config/inbox-email.js";
import { appendLogoAttachment, buildContactInboxMessage, buildContactConfirmationHtml } from "../utils/formsubmit-email.js";
import { isFormSubmitSuccess } from "../utils/formsubmit.js";
import { sendConfirmationEmail } from "../utils/emailjs-send.js";

/** FormSubmit; Reply-To via `_replyto`. Activate inbox on first use if FormSubmit asks. */

function contactT(key, fallback) {
  try {
    if (typeof window.siteT === "function") return window.siteT(key);
  } catch (_) {
    /* ignore */
  }
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
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const phone = String(fd.get("phone") || "").trim();
    const subjectRaw = String(fd.get("subject") || "").trim();
    const message = String(fd.get("message") || "").trim();

    const subject =
      subjectRaw ||
      contactT("contact.form.defaultSubject", "Website inquiry");
    const notificationSubject = `${subject} — ${email}`;

    /* `message` = visitor text only + footer. Name/email/phone are separate FormSubmit fields. */
    const inboxMessage = buildContactInboxMessage(message);

    setStatus(statusEl, "", null);
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = contactT("contact.form.sending", "Sending…");
    }

    const payload = new FormData();
    payload.append("name", name);
    payload.append("email", email);
    payload.append("phone", phone);
    payload.append("subject", subject);
    payload.append("_subject", notificationSubject);
    payload.append("message", inboxMessage);
    payload.append("_replyto", email);
    payload.append("_template", "table");
    await appendLogoAttachment(payload);

    const url = `https://formsubmit.co/ajax/${encodeURIComponent(CONTACT_INBOX_EMAIL)}`;

    try {
      const res = await fetch(url, {
        method: "POST",
        body: payload,
        headers: { Accept: "application/json" },
      });

      const data = await res.json().catch(() => null);
      const submitted = res.ok && isFormSubmitSuccess(data);
      if (submitted) {
        setStatus(statusEl, contactT("contact.form.success", "Thank you — your message was sent."), "success");
        form.reset();
        sendConfirmationEmail({
          toEmail:  email,
          toName:   name,
          subject:  "We received your inquiry — Aufstieg Technik",
          message:  message,
        });
      } else {
        const errMsg =
          data && typeof data.message === "string"
            ? data.message
            : contactT("contact.form.error", "Something went wrong. Please try again or email us directly.");
        setStatus(statusEl, errMsg, "error");
      }
    } catch {
      setStatus(
        statusEl,
        contactT("contact.form.error", "Something went wrong. Please try again or email us directly."),
        "error"
      );
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent =
          typeof window.siteT === "function"
            ? window.siteT(submitI18nKey)
            : defaultSubmitLabel;
      }
    }
  });
}
