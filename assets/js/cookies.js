/* ════════════════════════════════════════════════════════════════════════════
   MATHrix – Cookie Consent
   Uses Google Analytics Consent Mode v2.
   Preference stored in localStorage under key 'mathrix-cookies'.
   Values: 'all' | 'essential'
   ════════════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const STORAGE_KEY = 'mathrix-cookies';
  const BANNER_ID   = 'cookie-banner';

  // ── Helpers ──────────────────────────────────────────────────────────────

  function getConsent() {
    return localStorage.getItem(STORAGE_KEY); // 'all' | 'essential' | null
  }

  function grantAnalytics() {
    if (typeof gtag === 'function') {
      gtag('consent', 'update', { analytics_storage: 'granted' });
    }
  }

  function denyAnalytics() {
    if (typeof gtag === 'function') {
      gtag('consent', 'update', { analytics_storage: 'denied' });
    }
  }

  function hideBanner() {
    const banner = document.getElementById(BANNER_ID);
    if (!banner) return;
    banner.classList.remove('visible');
    banner.classList.add('hiding');
    setTimeout(() => banner.remove(), 400);
  }

  function showBanner() {
    const banner = document.getElementById(BANNER_ID);
    if (!banner) return;
    // Small delay so CSS transition fires after paint
    requestAnimationFrame(() => {
      requestAnimationFrame(() => banner.classList.add('visible'));
    });
  }

  // ── Accept / Decline ─────────────────────────────────────────────────────

  function acceptAll() {
    localStorage.setItem(STORAGE_KEY, 'all');
    grantAnalytics();
    hideBanner();
  }

  function acceptEssential() {
    localStorage.setItem(STORAGE_KEY, 'essential');
    denyAnalytics();
    hideBanner();
  }

  // ── Init ─────────────────────────────────────────────────────────────────

  function init() {
    const consent = getConsent();

    // Restore previously granted consent (GA consent mode already defaulted to denied)
    if (consent === 'all') {
      grantAnalytics();
      return; // No need to show banner
    }

    if (consent === 'essential') {
      // Already denied — nothing to do, GA stays denied
      return;
    }

    // No preference yet — show banner
    showBanner();

    const btnAccept  = document.getElementById('cookie-accept');
    const btnDecline = document.getElementById('cookie-decline');

    if (btnAccept)  btnAccept.addEventListener('click',  acceptAll);
    if (btnDecline) btnDecline.addEventListener('click', acceptEssential);
  }

  // Run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
