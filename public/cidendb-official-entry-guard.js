/* SUN-TEL CIDENDB OFFICIAL ENTRY GUARD
 * The pilot shop never receives CID identity data in URL query parameters.
 * OTP and identity verification remain inside CidenDB.
 */
(function sunTelCidenDbOfficialEntryGuard() {
  const ENTRY_BASE = String(window.CIDENDB_ENTRY_BASE || "https://bridge-db.cidenbridge.com").replace(/\/$/, "");
  const unsafeIdentityParams = ["cid", "twin", "token", "access_token", "jwt", "authToken"];

  try {
    const cleanUrl = new URL(window.location.href);
    let dirty = false;
    unsafeIdentityParams.forEach((key) => {
      if (cleanUrl.searchParams.has(key)) {
        cleanUrl.searchParams.delete(key);
        dirty = true;
      }
    });
    if (dirty) window.history.replaceState({}, "", cleanUrl.pathname + cleanUrl.search + cleanUrl.hash);
  } catch (_) {}

  function officialLoginUrl() {
    const url = new URL("/api/bridge/cidendb/login/start", ENTRY_BASE);
    url.searchParams.set("consumer", "suntelshop");
    url.searchParams.set("return_to", window.location.origin + window.location.pathname + "#cidenbridge");
    return url.toString();
  }

  document.addEventListener("click", function replaceLegacyCidentiaEntry(event) {
    const link = event.target && event.target.closest ? event.target.closest("a") : null;
    if (!link) return;
    const href = String(link.getAttribute("href") || "");
    const label = String(link.textContent || "").toLowerCase();
    const isLegacyEntry = href.includes("cidentiaapp.vercel.app/login") || label.includes("login with cidentia");
    if (!isLegacyEntry) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    window.location.assign(officialLoginUrl());
  }, true);

  window.sunTelOpenCidenDbLogin = function () { window.location.assign(officialLoginUrl()); };
})();
