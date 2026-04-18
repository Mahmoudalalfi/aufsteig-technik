/**
 * Canonical public origin for plain-text email links (FormSubmit does not send HTML mail).
 * Local dev (Live Server, etc.) cannot host images for inbox recipients — use production URL.
 */
export function publicSiteOrigin() {
  if (typeof window === "undefined" || !window.location) return "https://aufstiegtechnik.de";
  const { hostname, origin } = window.location;
  if (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "[::1]" ||
    hostname.endsWith(".local")
  ) {
    return "https://aufstiegtechnik.de";
  }
  return origin;
}
