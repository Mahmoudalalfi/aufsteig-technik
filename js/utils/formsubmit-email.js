/**
 * Email helpers for both forms.
 *
 * Company inbox (FormSubmit):  plain-text — FormSubmit renders it in their table.
 * User confirmation (EmailJS): full branded HTML — sent client-side via EmailJS SDK.
 *
 * FormSubmit NEVER renders HTML in message / _autoresponse fields — it always
 * escapes them. Do not put HTML there.
 */

import { publicSiteOrigin } from "../config/public-site.js";

function formatValue(value) {
  if (value === undefined || value === null) return "—";
  const s = String(value).trim();
  return s || "—";
}

function indentBlock(text, indent) {
  return String(text)
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => indent + line)
    .join("\n");
}

function esc(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function strings() {
  const de = typeof document !== "undefined" && document.documentElement.lang === "de";
  if (de) {
    return {
      company: "AUFSTIEG TECHNIK",
      tagline: "Aufzugstechnik · Gebäudeautomation · Wartung",
      foot: "Gesendet über aufsteigtechnik.de · Antworten Sie auf diese E-Mail, um den Absender zu erreichen.",
      projectFoot: "Anhänge: aufsteig-logo.png ist das Firmenlogo; andere Dateien stammen vom Absender.",
      website: "aufsteigtechnik.de",
      copyright: `© ${new Date().getFullYear()} Aufstieg Technik GmbH. Alle Rechte vorbehalten.`,
      address: "Lagerhof Straße 2, 04103 Leipzig, Deutschland",
      logoLine: "Logo (Vorschau):",
      webLine: "Website:",
    };
  }
  return {
    company: "AUFSTIEG TECHNIK",
    tagline: "Elevator Technology · Building Automation · Maintenance",
    foot: "Sent via aufsteigtechnik.de · Reply to this email to reach the sender.",
    projectFoot: "Attachments: aufsteig-logo.png is the company logo when included; other files are from the submitter.",
    website: "aufsteigtechnik.de",
    copyright: `© ${new Date().getFullYear()} Aufstieg Technik GmbH. All rights reserved.`,
    address: "Lagerhof Straße 2, 04103 Leipzig, Germany",
    logoLine: "Logo preview:",
    webLine: "Website:",
  };
}

/* ══════════════════════════════════════════════════════════════════
   COMPANY INBOX — plain text (FormSubmit table shows these fine)
══════════════════════════════════════════════════════════════════ */

/** Contact form: plain-text message for company inbox — just the visitor's text */
export function buildContactInboxMessage(userMessage) {
  return String(userMessage || "").trim();
}

/** Project wizard: plain-text message for company inbox */
export function buildBrandedPlainEmail(opts) {
  const origin = publicSiteOrigin().replace(/\/$/, "");
  const logoUrl = `${origin}/aufsteig-logo.png`;
  const t = strings();

  const lines = [];
  lines.push(`${t.company} — ${opts.title || "Submission"}`);
  if (opts.tagline) lines.push(opts.tagline);
  lines.push(`${t.logoLine} ${logoUrl}  (PNG also attached when possible)`);
  lines.push(`${t.webLine} ${origin}`);
  lines.push("");
  lines.push("—".repeat(52));
  lines.push("");

  for (const sec of opts.sections || []) {
    if (sec.sectionTitle) {
      lines.push(`▸ ${String(sec.sectionTitle)}`);
      lines.push("-".repeat(40));
    }
    for (const row of sec.rows || []) {
      const label = String(row.label);
      const val = formatValue(row.value);
      lines.push(`${label}:`);
      lines.push(indentBlock(val, "  "));
      lines.push("");
    }
  }

  lines.push("—".repeat(52));
  lines.push(t.projectFoot);
  lines.push(t.foot);

  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

/* ══════════════════════════════════════════════════════════════════
   USER CONFIRMATION — branded HTML (sent via EmailJS, not FormSubmit)
══════════════════════════════════════════════════════════════════ */

function buildHtmlShell({ logoUrl, title, preheader, bodyHtml, t }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${esc(title)}</title>
</head>
<body style="margin:0;padding:0;background-color:#eef1f6;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
<div style="display:none;font-size:1px;color:#eef1f6;max-height:0;overflow:hidden;">${esc(preheader)}</div>
<table width="100%" cellpadding="0" cellspacing="0" style="background:#eef1f6;padding:32px 16px 48px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0"
  style="max-width:600px;width:100%;border-radius:12px;overflow:hidden;
         box-shadow:0 8px 32px rgba(10,22,40,0.15);">

  <!-- HEADER -->
  <tr>
    <td style="background:linear-gradient(150deg,#071120 0%,#0d2045 50%,#122d60 100%);
               padding:40px 48px 32px;text-align:center;">
      <img src="${esc(logoUrl)}" alt="Aufstieg Technik" width="110"
           style="display:block;margin:0 auto 20px;max-width:110px;height:auto;"/>
      <div style="font-size:19px;font-weight:700;color:#ffffff;
                  letter-spacing:2px;text-transform:uppercase;">
        ${esc(t.company)}
      </div>
      <div style="font-size:11px;color:#6b93c4;letter-spacing:1px;
                  text-transform:uppercase;margin-top:5px;">
        ${esc(t.tagline)}
      </div>
      <div style="width:40px;height:3px;background:linear-gradient(90deg,#1e5fc2,#4a8fff);
                  border-radius:2px;margin:18px auto 0;"></div>
    </td>
  </tr>

  <!-- BODY -->
  <tr>
    <td style="background:#ffffff;padding:40px 48px 32px;">
      ${bodyHtml}
    </td>
  </tr>

  <!-- FOOTER -->
  <tr>
    <td style="background:#f3f6fa;border-top:1px solid #dde3ec;padding:24px 48px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="font-size:12px;color:#5a6a85;line-height:1.8;">
            <strong style="color:#0d2045;">${esc(t.address)}</strong><br/>
            <a href="https://${esc(t.website)}" style="color:#1e5fc2;text-decoration:none;font-weight:600;">
              ${esc(t.website)}
            </a>
          </td>
          <td align="right" style="vertical-align:middle;">
            <img src="${esc(logoUrl)}" alt="" width="44"
                 style="opacity:0.20;max-width:44px;height:auto;"/>
          </td>
        </tr>
      </table>
      <div style="border-top:1px solid #dde3ec;margin-top:16px;padding-top:14px;
                  font-size:11px;color:#9aa5ba;text-align:center;line-height:1.6;">
        ${esc(t.foot)}<br/>${esc(t.copyright)}
      </div>
    </td>
  </tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

function contactInfoBlock(t) {
  return `
  <table width="100%" cellpadding="0" cellspacing="0"
    style="margin:24px 0;background:#f0f6ff;border-radius:8px;">
    <tr>
      <td style="padding:18px 20px;border-right:1px solid #dce7f7;width:50%;vertical-align:top;">
        <div style="font-size:10px;font-weight:700;color:#1e5fc2;letter-spacing:1px;
                    text-transform:uppercase;margin-bottom:8px;">Phone</div>
        <div style="font-size:13px;color:#0d2045;font-weight:600;line-height:1.8;">
          +49 155 1060 1054<br/>+49 176 2147 5191<br/>+49 174 9740646
        </div>
      </td>
      <td style="padding:18px 20px;width:50%;vertical-align:top;">
        <div style="font-size:10px;font-weight:700;color:#1e5fc2;letter-spacing:1px;
                    text-transform:uppercase;margin-bottom:8px;">Email</div>
        <div style="font-size:13px;color:#0d2045;font-weight:600;line-height:1.8;">
          Ceo@aufstiegtechnik.de<br/>Info@aufstiegtechnik.de
        </div>
      </td>
    </tr>
  </table>`;
}

/** Branded HTML confirmation for contact form — sent via EmailJS */
export function buildContactConfirmationHtml(opts = {}) {
  const origin = publicSiteOrigin().replace(/\/$/, "");
  const logoUrl = `${origin}/aufsteig-logo.png`;
  const t = strings();
  const { name = "", message = "" } = opts;

  const greeting = name ? `Thank you for reaching out, ${esc(name)}!` : "Thank you for reaching out!";
  const msgBlock = message
    ? `<div style="margin-top:24px;">
        <div style="font-size:10px;font-weight:700;color:#1e5fc2;letter-spacing:1.2px;
                    text-transform:uppercase;padding-bottom:8px;
                    border-bottom:2px solid #e4eaf3;margin-bottom:12px;">
          Your Message
        </div>
        <div style="background:#f7f9fc;border-radius:6px;padding:16px 18px;
                    font-size:13px;color:#2d3a4e;line-height:1.75;
                    border:1px solid #e4eaf3;white-space:pre-wrap;word-break:break-word;">
          ${esc(message).replace(/\n/g, "<br/>")}
        </div>
      </div>`
    : "";

  const bodyHtml = `
    <h1 style="font-size:22px;font-weight:700;color:#0d2045;margin:0 0 12px;">
      ${greeting}
    </h1>
    <p style="font-size:15px;color:#3d4f6b;line-height:1.7;margin:0 0 8px;">
      We've received your inquiry and will reply within <strong>1–2 business days</strong>
      with clear next steps, a timeline, and a transparent quote.
    </p>
    <p style="font-size:14px;color:#64748b;margin:0 0 4px;">You can also reach us directly:</p>
    ${contactInfoBlock(t)}
    ${msgBlock}
  `;

  return buildHtmlShell({
    logoUrl,
    title: "We received your inquiry — Aufstieg Technik",
    preheader: "Thank you! We'll reply within 1–2 business days.",
    bodyHtml,
    t,
  });
}

/** Branded HTML confirmation for project wizard — sent via EmailJS */
export function buildProjectConfirmationHtml(opts = {}) {
  const origin = publicSiteOrigin().replace(/\/$/, "");
  const logoUrl = `${origin}/aufsteig-logo.png`;
  const t = strings();
  const { name = "", sections = [] } = opts;

  const greeting = name ? `Thank you, ${esc(name)}!` : "Thank you!";

  const sectionsHtml = sections
    .map(
      (sec) => {
        if (!sec.rows || !sec.rows.length) return "";
        const rowsHtml = sec.rows
          .map(
            (r, i) => `
          <tr style="background:${i % 2 === 0 ? "#ffffff" : "#f7f9fc"};">
            <td width="40%" style="padding:9px 12px 9px 0;font-size:12px;font-weight:600;
                                   color:#64748b;vertical-align:top;border-bottom:1px solid #edf0f7;">
              ${esc(r.label)}
            </td>
            <td width="60%" style="padding:9px 0 9px 12px;font-size:13px;color:#0d2045;
                                   vertical-align:top;border-bottom:1px solid #edf0f7;
                                   word-break:break-word;">
              ${esc(formatValue(r.value))}
            </td>
          </tr>`
          )
          .join("");
        return `
        <div style="margin-bottom:24px;">
          <div style="font-size:10px;font-weight:700;color:#1e5fc2;letter-spacing:1.2px;
                      text-transform:uppercase;padding-bottom:8px;
                      border-bottom:2px solid #e4eaf3;margin-bottom:12px;">
            ${esc(sec.sectionTitle || "Details")}
          </div>
          <table width="100%" cellpadding="0" cellspacing="0">${rowsHtml}</table>
        </div>`;
      }
    )
    .join("");

  const bodyHtml = `
    <h1 style="font-size:22px;font-weight:700;color:#0d2045;margin:0 0 12px;">
      ${greeting}
    </h1>
    <p style="font-size:15px;color:#3d4f6b;line-height:1.7;margin:0 0 8px;">
      Your project request has been received. Our expert team will review it and
      contact you with <strong>clear next steps, a timeline, and a transparent quote</strong>.
    </p>
    <div style="background:#f0f6ff;border-left:4px solid #1e5fc2;border-radius:0 8px 8px 0;
                padding:14px 18px;margin:20px 0;font-size:14px;color:#1a2f50;font-weight:600;">
      ✅ Project request submitted successfully
    </div>
    <p style="font-size:14px;color:#64748b;margin:0 0 4px;">Need to reach us sooner?</p>
    ${contactInfoBlock(t)}
    ${sectionsHtml ? `<div style="margin-top:8px;">${sectionsHtml}</div>` : ""}
  `;

  return buildHtmlShell({
    logoUrl,
    title: "Project request received — Aufstieg Technik",
    preheader: "Your project request has been received. We'll be in touch shortly.",
    bodyHtml,
    t,
  });
}

/* ══════════════════════════════════════════════════════════════════
   LOGO ATTACHMENT
══════════════════════════════════════════════════════════════════ */
export async function appendLogoAttachment(formData) {
  const url = `${publicSiteOrigin().replace(/\/$/, "")}/aufsteig-logo.png`;
  try {
    const res = await fetch(url, { mode: "cors", credentials: "omit", cache: "force-cache" });
    if (!res.ok) return;
    const blob = await res.blob();
    if (!blob || blob.size < 64) return;
    formData.append("attachment", blob, "aufsteig-logo.png");
  } catch {
    /* CORS, offline, or blocked — fails quietly */
  }
}
