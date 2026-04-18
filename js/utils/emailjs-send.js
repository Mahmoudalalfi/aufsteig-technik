import { EMAILJS_PUBLIC_KEY, EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID } from "../config/emailjs.js";

let initialised = false;

function init() {
  if (initialised) return;
  if (typeof emailjs === "undefined") return;
  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  initialised = true;
}

export async function sendConfirmationEmail({ toEmail, toName, subject, message, extraRows }) {
  try {
    init();
    if (typeof emailjs === "undefined") return;

    // Build plain-text summary of project rows (if any)
    const rowsText = (extraRows || [])
      .filter(r => r.value && String(r.value).trim() && String(r.value).trim() !== "—")
      .map(r => `${r.label}: ${String(r.value).trim()}`)
      .join("\n");

    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      to_email:     toEmail,
      subject:      subject,
      reply_to:     "Info@aufstiegtechnik.de",
      user_name:    toName || "there",
      user_message: message || rowsText || "",
    });
  } catch (err) {
    console.warn("[EmailJS] confirmation email failed:", err);
  }
}
