import { buildBrandedPlainEmail } from "../utils/formsubmit-email.js";
import { sendConfirmationEmail, sendInboxEmail } from "../utils/emailjs-send.js";

const DRAFT_KEY = "aufsteig_start_project_draft_v2";

const stepsTotal = 7;
let currentStep = 1;

function $(sel, root = document) {
  return root.querySelector(sel);
}

function $all(sel, root = document) {
  return Array.from(root.querySelectorAll(sel));
}

function setProgress(step) {
  const pct = Math.round(((step - 1) / (stepsTotal - 1)) * 100);
  const label = window.spI18n ? window.spI18n.stepLabel(step, stepsTotal) : `Step ${step} of ${stepsTotal}`;
  $("#spStepLabel").textContent = label;
  $("#spProgressBar").style.width = `${pct}%`;
  const track = $(".sp-progress-track");
  if (track) track.setAttribute("aria-valuenow", String(pct));
}

function setDraftStatus(text) {
  $("#spDraftStatus").textContent = text || "";
}

/** Legacy hook: steps use display:none/flex (no fixed height). Clear any old inline height. */
function syncStepsHeight() {
  const wrap = $(".sp-steps");
  if (wrap) wrap.style.height = "";
}
window.syncStepsHeight = syncStepsHeight;

function showStep(step) {
  const prevStep = currentStep;
  const dir = step < prevStep ? "back" : "forward";
  currentStep = step;

  const steps = $all(".sp-step");
  const nextEl = steps.find((el) => Number(el.dataset.step) === step);
  const prevEl = steps.find((el) => Number(el.dataset.step) === prevStep);

  steps.forEach((el) => {
    if (el === nextEl) return;
    el.classList.remove("is-active", "is-back");
  });

  if (nextEl) nextEl.classList.toggle("is-back", dir === "back");
  if (prevEl) prevEl.classList.remove("is-back");

  if (nextEl) {
    void nextEl.offsetWidth;
    nextEl.classList.add("is-active");
  }
  syncStepsHeight();

  $("#spBack").disabled = step === 1;
  $("#spNext").style.display = step === stepsTotal ? "none" : "inline-flex";
  $("#spSave").style.display = step === stepsTotal ? "none" : "inline-flex";
  setProgress(step);
  syncConditional();
  if (step === stepsTotal) renderReview();
  const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" });
}

function getFormData() {
  const form = $("#spForm");
  const fd = new FormData(form);

  const obj = {};
  for (const [k, v] of fd.entries()) {
    if (k === "files") continue;
    if (obj[k] !== undefined) {
      if (Array.isArray(obj[k])) obj[k].push(v);
      else obj[k] = [obj[k], v];
    } else {
      obj[k] = v;
    }
  }

  // Checkboxes not checked won't be present in FormData
  ["reqAccessibility", "reqEnergy", "reqRemoteMonitoring", "reqComplianceAudit"].forEach((name) => {
    obj[name] = Boolean(fd.get(name));
  });

  // Store full E.164 phone in the draft/review.
  const cc = String(obj.phoneCountry || "").trim();
  const national = String(obj.phone || "").trim();
  if (cc && national) {
    const nationalDigits = national.replace(/[^\d]/g, "");
    const ccDigits = cc.replace(/[^\d]/g, "");
    obj.phoneE164 = `+${ccDigits}${nationalDigits}`;
  } else {
    obj.phoneE164 = "";
  }

  return obj;
}

function saveDraft() {
  const data = getFormData();
  const payload = { data, savedAt: Date.now(), step: currentStep };
  localStorage.setItem(DRAFT_KEY, JSON.stringify(payload));
  setDraftStatus(window.spT ? window.spT("draft.saved") : "Draft saved.");
  setTimeout(() => setDraftStatus(""), 1500);
}

function loadDraft() {
  const raw = localStorage.getItem(DRAFT_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function applyDraft(draft) {
  if (!draft || !draft.data) return;
  const form = $("#spForm");
  Object.entries(draft.data).forEach(([name, value]) => {
    const els = $all(`[name="${CSS.escape(name)}"]`, form);
    if (els.length === 0) return;

    els.forEach((el) => {
      if (el.type === "radio") {
        el.checked = String(el.value) === String(value);
      } else if (el.type === "checkbox") {
        if (Array.isArray(value)) {
          el.checked = value.includes(el.value);
        } else {
          el.checked = Boolean(value);
        }
      } else if (el.type === "hidden" && el.closest(".sp-field")) {
        // custom select — skip, syncCustomSelectLabels handles it after init
      } else {
        el.value = String(value ?? "");
      }
    });
  });
}

function clearErrors() {
  $all(".sp-field, .sp-fieldset").forEach((el) => el.classList.remove("is-invalid"));
  $all(".sp-error").forEach((el) => (el.textContent = ""));
}

function markInvalid(name, message) {
  const errorEl = $(`[data-error-for="${CSS.escape(name)}"]`);
  if (errorEl) errorEl.textContent = message;

  const field = $(`[name="${CSS.escape(name)}"]`)?.closest(".sp-field") || $(`[name="${CSS.escape(name)}"]`)?.closest(".sp-fieldset");
  if (field) field.classList.add("is-invalid");
}

function valueOf(name) {
  const els = $all(`[name="${CSS.escape(name)}"]`, $("#spForm"));
  if (els.length === 0) return "";
  const type = els[0].type;
  if (type === "radio") {
    const chosen = els.find((e) => e.checked);
    return chosen ? chosen.value : "";
  }
  if (type === "checkbox") return els[0].checked ? "Yes" : "";
  return els[0].value.trim();
}

function valuesOf(name) {
  const els = $all(`[name="${CSS.escape(name)}"]`, $("#spForm"));
  if (els.length === 0) return [];
  const type = els[0].type;
  if (type === "checkbox") return els.filter((e) => e.checked).map((e) => e.value);
  const v = valueOf(name);
  return v ? [v] : [];
}

function validateStep(step) {
  clearErrors();
  let ok = true;

  const _t = window.spT || ((k) => k);

  function req(name, label) {
    const v = valueOf(name);
    if (!v) {
      ok = false;
      markInvalid(name, label || _t("val.required"));
    }
  }

  function reqEmail(name) {
    const v = valueOf(name);
    if (!v) return req(name);
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    if (!valid) {
      ok = false;
      markInvalid(name, _t("val.email"));
    }
  }

  function reqIntlPhone(name) {
    const raw = valueOf(name);
    if (!raw) return req(name);
    const cc = valueOf("phoneCountry") || "+";
    const digits = String(raw).replace(/[^\d]/g, "");
    const ccDigits = String(cc).replace(/[^\d]/g, "");
    const valid = digits.length >= 7 && (ccDigits.length + digits.length) <= 15;
    if (!valid) {
      ok = false;
      markInvalid(name, _t("val.phone"));
    }
  }

  if (step === 1) {
    req("fullName");
    reqEmail("email");
    req("phoneCountry");
    reqIntlPhone("phone");
    req("country");
    req("city");
  }

  if (step === 2) {
    req("buildingContext");
    if (valuesOf("serviceLines").length === 0) {
      ok = false;
      markInvalid("serviceLines", _t("val.serviceLines"));
    }
    if (valuesOf("solutionCategories").length === 0) {
      ok = false;
      markInvalid("solutionCategories", _t("val.solutionCats"));
    }
    req("units");

    const multiScope =
      valuesOf("serviceLines").length > 1 || valuesOf("solutionCategories").length > 1;
    if (multiScope) {
      req("projectArea", _t("val.scopeDetail"));
    }
  }

  if (step === 3) {
    req("floors");
    req("buildingState");
    req("shaftAvailable");
    req("loadKg");
    req("dailyUsage");
  }

  if (step === 5) {
    req("address");
    req("timeline");
  }

  if (step === 6) {
    req("budget");
  }

  return ok;
}

function wantsLiftSupplyDetail() {
  const services = valuesOf("serviceLines");
  const sol = valuesOf("solutionCategories");
  if (services.includes("Elevators & Lifts Supply")) return true;
  const liftCats = new Set([
    "Passenger Lifts",
    "Freight Lifts",
    "Home Solutions",
    "Modernization Solutions",
    "Anti-vandal Lifts",
    "Firefighting Lifts",
    "Earthquake Resistant Lifts",
    "Accessibility Solutions",
    "Parking Systems",
    "Marine Solutions",
    "Custom Solutions",
  ]);
  return sol.some((s) => liftCats.has(s));
}

function syncConditional() {
  const elevatorOnly = $("#spElevatorOnly");
  if (elevatorOnly) {
    elevatorOnly.style.display = wantsLiftSupplyDetail() ? "block" : "none";
  }

  const areaWrap = $("#spProjectAreaWrap");
  if (areaWrap) {
    const multiScope =
      valuesOf("serviceLines").length > 1 || valuesOf("solutionCategories").length > 1;
    areaWrap.style.display = multiScope ? "block" : "none";
  }
  requestAnimationFrame(() => syncStepsHeight());
}

function renderReview() {
  const data = getFormData();

  const _rt = window.spT || ((k) => k);
  const groups = [
    [_rt("reviewGroup.client"), ["fullName", "companyName", "email", "phoneE164", "country", "city"]],
    [_rt("reviewGroup.services"), ["buildingContext", "serviceLines", "solutionCategories", "units", "projectArea"]],
    [_rt("reviewGroup.building"), ["floors", "buildingHeightM", "floorToFloorM", "buildingState", "shaftAvailable", "loadKg", "dailyUsage"]],
    [
      _rt("reviewGroup.technical"),
      [
        "resourceDocs",
        "supplyProductInterest",
        "elevatorType",
        "driveType",
        "speedMs",
        "doorType",
        "finish",
        "reqAccessibility",
        "reqEnergy",
        "reqRemoteMonitoring",
        "reqComplianceAudit",
      ],
    ],
    [_rt("reviewGroup.location"), ["address", "siteAccess", "timeline"]],
    [_rt("reviewGroup.budget"), ["budget", "notes"]],
  ];

  function pretty(key, value) {
    if (value === undefined || value === null) return "—";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (Array.isArray(value)) return value.length ? value.join(", ") : "—";
    const s = String(value).trim();
    return s ? s : "—";
  }

  const review = $("#spReview");
  review.innerHTML = "";

  groups.forEach(([title, keys]) => {
    const g = document.createElement("div");
    g.className = "sp-review-group";
    const h = document.createElement("h3");
    h.textContent = title;
    g.appendChild(h);

    keys.forEach((k) => {
      const row = document.createElement("div");
      row.className = "sp-review-row";
      const keyEl = document.createElement("div");
      keyEl.className = "sp-review-k";
      keyEl.textContent = labelFor(k);
      const valEl = document.createElement("div");
      valEl.className = "sp-review-v";
      valEl.textContent = pretty(k, data[k]);
      row.appendChild(keyEl);
      row.appendChild(valEl);
      g.appendChild(row);
    });
    review.appendChild(g);
  });
}

function labelFor(key) {
  const _t = window.spT || ((k) => null);
  const i18nMap = {
    fullName: "review.fullName",
    companyName: "review.companyName",
    email: "review.email",
    phoneCountry: "review.phoneCountry",
    phone: "review.phoneNational",
    phoneE164: "review.phone",
    country: "review.country",
    city: "review.city",
    buildingContext: "review.buildingContext",
    serviceLines: "review.serviceLines",
    solutionCategories: "review.solutionCategories",
    units: "review.units",
    projectArea: "review.scopeDetail",
    floors: "review.floors",
    buildingHeightM: "review.buildingHeight",
    floorToFloorM: "review.floorToFloor",
    buildingState: "review.buildingState",
    shaftAvailable: "review.shaftAvailable",
    loadKg: "review.loadKg",
    dailyUsage: "review.dailyUsage",
    resourceDocs: "review.resourceDocs",
    supplyProductInterest: "review.supplyProducts",
    elevatorType: "review.elevatorType",
    driveType: "review.driveType",
    speedMs: "review.speed",
    doorType: "review.doorType",
    finish: "review.finish",
    reqAccessibility: "review.reqAccessibility",
    reqEnergy: "review.reqEnergy",
    reqRemoteMonitoring: "review.reqRemoteMonitoring",
    reqComplianceAudit: "review.reqCompliance",
    address: "review.address",
    siteAccess: "review.siteAccess",
    timeline: "review.timeline",
    budget: "review.budget",
    notes: "review.notes",
  };
  if (i18nMap[key]) {
    const val = _t(i18nMap[key]);
    if (val && val !== i18nMap[key]) return val;
  }
  return key;
}

function prettyFieldValue(value) {
  if (value === undefined || value === null) return "—";
  if (typeof value === "boolean") {
    const y = window.spT ? window.spT("review.boolYes") : "Yes";
    const n = window.spT ? window.spT("review.boolNo") : "No";
    return value ? y : n;
  }
  if (Array.isArray(value)) return value.length ? value.join(", ") : "—";
  const s = String(value).trim();
  return s ? s : "—";
}

function buildProjectSections(data, formEl) {
  const _rt = window.spT || ((k) => k);
  const groups = [
    [_rt("reviewGroup.client"), ["fullName", "companyName", "email", "phoneCountry", "phone", "phoneE164", "country", "city"]],
    [_rt("reviewGroup.services"), ["buildingContext", "serviceLines", "solutionCategories", "units", "projectArea"]],
    [_rt("reviewGroup.building"), ["floors", "buildingHeightM", "floorToFloorM", "buildingState", "shaftAvailable", "loadKg", "dailyUsage"]],
    [
      _rt("reviewGroup.technical"),
      [
        "resourceDocs",
        "supplyProductInterest",
        "elevatorType",
        "driveType",
        "speedMs",
        "doorType",
        "finish",
        "reqAccessibility",
        "reqEnergy",
        "reqRemoteMonitoring",
        "reqComplianceAudit",
      ],
    ],
    [_rt("reviewGroup.location"), ["address", "siteAccess", "timeline"]],
    [_rt("reviewGroup.budget"), ["budget", "notes"]],
  ];

  const sections = [];
  const seen = new Set();

  groups.forEach(([sectionTitle, keys]) => {
    const rows = [];
    keys.forEach((key) => {
      if (!(key in data)) return;
      seen.add(key);
      rows.push({ label: labelFor(key), value: prettyFieldValue(data[key]) });
    });
    if (rows.length) sections.push({ sectionTitle, rows });
  });

  const extraRows = [];
  Object.keys(data).forEach((key) => {
    if (seen.has(key)) return;
    extraRows.push({ label: labelFor(key), value: prettyFieldValue(data[key]) });
  });
  if (extraRows.length) {
    sections.push({ sectionTitle: _rt("email.extraSection"), rows: extraRows });
  }

  const fileInput = formEl ? formEl.querySelector('input[name="files"]') : null;
  const fileRows = [];
  if (fileInput && fileInput.files && fileInput.files.length) {
    for (let i = 0; i < fileInput.files.length; i++) {
      fileRows.push({
        label: `${_rt("email.fileN")} ${i + 1}`,
        value: `${fileInput.files[i].name} (${Math.round(fileInput.files[i].size / 1024)} KB)`,
      });
    }
  } else {
    fileRows.push({ label: _rt("email.attachments"), value: _rt("email.none") });
  }
  sections.push({ sectionTitle: _rt("email.attachmentsSection"), rows: fileRows });

  return sections;
}

function buildProjectPlainMessage(data, formEl) {
  const _rt = window.spT || ((k) => k);
  const sections = buildProjectSections(data, formEl);
  const fullName = String(data.fullName || "").trim();
  const email = String(data.email || "").trim();

  return buildBrandedPlainEmail({
    title: _rt("email.projectTitle"),
    tagline: fullName && email ? `${fullName} · ${email}` : email || fullName || "",
    sections,
  });
}

async function submitProjectToInbox() {
  const data = getFormData();
  const formEl = $("#spForm");
  const email = String(data.email || "").trim();
  const fullName = String(data.fullName || "").trim();
  const bodyText = buildProjectPlainMessage(data, formEl);
  const subject = `Project request — ${fullName} — ${email}`;

  await sendInboxEmail({
    fromName:    fullName,
    fromEmail:   email,
    subject,
    message:     bodyText,
  });
  return { ok: true };
}

async function runSubmit() {
  const btn = $("#spSubmit");
  const msg = $("#spSubmitMsg");
  btn.classList.add("is-loading");
  btn.disabled = true;
  msg.classList.remove("is-error");
  msg.textContent = window.spT ? window.spT("submit.submitting") : "Submitting…";

  try {
    const result = await submitProjectToInbox();
    if (result.ok) {
      msg.textContent = window.spT
        ? window.spT("submit.success")
        : "Your project request has been submitted successfully. Our team will contact you shortly.";
      localStorage.removeItem(DRAFT_KEY);
      setDraftStatus("");
      const data = getFormData();
      const formEl = $("#spForm");
      const allRows = buildProjectSections(data, formEl).flatMap(s => s.rows || []);
      sendConfirmationEmail({
        toEmail:    String(data.email || "").trim(),
        toName:     String(data.fullName || "").trim(),
        subject:    "Your project request — Aufstieg Technik",
        extraRows:  allRows,
      });
    } else {
      msg.classList.add("is-error");
      msg.textContent =
        result.message ||
        (window.spT ? window.spT("submit.error") : "Could not send your request. Please try again.");
    }
  } catch {
    msg.classList.add("is-error");
    msg.textContent = window.spT ? window.spT("submit.error") : "Could not send your request. Please try again.";
  } finally {
    btn.classList.remove("is-loading");
    btn.disabled = false;
  }
}

function init() {
  const draft = loadDraft();
  if (draft) {
    applyDraft(draft);
    setDraftStatus(window.spT ? window.spT("draft.loaded") : "Draft loaded.");
    setTimeout(() => setDraftStatus(""), 1500);
    if (draft.step && Number(draft.step) >= 1 && Number(draft.step) <= stepsTotal) currentStep = Number(draft.step);
  }

  setProgress(currentStep);
  showStep(currentStep);

  const phoneCountry = $("#spPhoneCountry");
  const phoneInput = $("#spPhone");
  if (phoneCountry && phoneInput) {
    const normalize = (s) => String(s || "").replace(/[^\d]/g, "");

    function ensurePrefix() {
      const cc = String(phoneCountry.value || "").trim();
      const ccDigits = normalize(cc);
      const v = String(phoneInput.value || "").trim();

      // If user pasted full international number, strip the prefix and keep local digits.
      if (v.startsWith("+")) {
        const allDigits = normalize(v);
        const ccLen = normalize(cc).length;
        phoneInput.value = ccLen ? allDigits.slice(ccLen) : allDigits;
        return;
      }

      // If field is empty, just keep it empty; placeholder hints local number.
      if (!v) return;

      // Strip country code if user typed it into the national field
      const digits = normalize(v);
      if (ccDigits && digits.startsWith(ccDigits)) {
        phoneInput.value = digits.slice(ccDigits.length);
      } else {
        phoneInput.value = digits;
      }
    }

    phoneCountry.addEventListener("change", () => {
      ensurePrefix();
      saveDraft();
    });
    phoneInput.addEventListener("blur", ensurePrefix);
  }

  $("#spNext").addEventListener("click", () => {
    if (!validateStep(currentStep)) return;
    saveDraft();
    showStep(Math.min(stepsTotal, currentStep + 1));
  });

  $("#spBack").addEventListener("click", () => {
    showStep(Math.max(1, currentStep - 1));
  });

  $("#spSave").addEventListener("click", saveDraft);

  $("#spClearDraft").addEventListener("click", () => {
    localStorage.removeItem(DRAFT_KEY);
    setDraftStatus(window.spT ? window.spT("draft.cleared") : "Draft cleared.");
    setTimeout(() => setDraftStatus(""), 1500);
  });

  $("#spForm").addEventListener("input", () => {
    // Lightweight autosave for texty inputs; do not spam UI.
    try {
      const payload = { data: getFormData(), savedAt: Date.now(), step: currentStep };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(payload));
    } catch {}
  });

  $("#spForm").addEventListener("change", () => {
    syncConditional();
    try {
      const payload = { data: getFormData(), savedAt: Date.now(), step: currentStep };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(payload));
    } catch {}
  });

  window.addEventListener("resize", () => syncStepsHeight());
  window.addEventListener("load", () => syncStepsHeight());
  window.addEventListener("spi18n-changed", () => {
    setProgress(currentStep);
    requestAnimationFrame(() => syncStepsHeight());
  });
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => syncStepsHeight());
  }
  requestAnimationFrame(() => syncStepsHeight());

  $("#spForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    // Validate all required steps before submit.
    const requiredSteps = [1, 2, 3, 5, 6];
    for (const st of requiredSteps) {
      if (!validateStep(st)) {
        showStep(st);
        return;
      }
    }
    await runSubmit();
  });
}

init();

