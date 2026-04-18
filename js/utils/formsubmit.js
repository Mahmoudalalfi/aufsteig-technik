/** FormSubmit /ajax JSON uses `success` as boolean or string "true". */
export function isFormSubmitSuccess(json) {
  if (!json || json.success === undefined || json.success === null) return false;
  return json.success === true || String(json.success).toLowerCase() === "true";
}
