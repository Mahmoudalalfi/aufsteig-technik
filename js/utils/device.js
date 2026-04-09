/**
 * Runtime hints for low-end phones, touch, and data-saver mode.
 */
export function getDeviceHints() {
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const narrow = window.matchMedia("(max-width: 900px)").matches;
  const saveData =
    typeof navigator !== "undefined" && navigator.connection && navigator.connection.saveData === true;

  return {
    coarsePointer: coarse,
    narrowViewport: narrow,
    saveData,
    /** Prefer lighter rendering (hero DPR, concurrency, optional animations). */
    lightMode: saveData || (coarse && narrow)
  };
}

export function applyDeviceClasses(hints) {
  const root = document.documentElement;
  root.classList.toggle("is-touch", hints.coarsePointer);
  root.classList.toggle("is-narrow", hints.narrowViewport);
  root.classList.toggle("is-save-data", hints.saveData);
  root.classList.toggle("is-light-mode", hints.lightMode);
}
