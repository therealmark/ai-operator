/**
 * AI Operator — Custom Analytics
 * Captures visitor data and sends to /api/track
 */
(function () {
  const API = 'https://z01mzuzo05.execute-api.us-east-1.amazonaws.com/prod/api/track';

  // ── Session / visitor identity ──────────────────────────────────────────────
  let vid = localStorage.getItem('_ao_vid');
  if (!vid) { vid = crypto.randomUUID(); localStorage.setItem('_ao_vid', vid); }

  let sid = sessionStorage.getItem('_ao_sid');
  if (!sid) { sid = crypto.randomUUID(); sessionStorage.setItem('_ao_sid', sid); }

  const isNew = !localStorage.getItem('_ao_seen');
  localStorage.setItem('_ao_seen', '1');

  // ── UTM / referrer ──────────────────────────────────────────────────────────
  const params  = new URLSearchParams(location.search);
  const utmSrc  = params.get('utm_source')   || '';
  const utmMed  = params.get('utm_medium')   || '';
  const utmCamp = params.get('utm_campaign') || '';
  const utmTerm = params.get('utm_term')     || '';
  const utmCont = params.get('utm_content')  || '';

  // ── Device info ─────────────────────────────────────────────────────────────
  const ua       = navigator.userAgent;
  const lang     = navigator.language || '';
  const screen_w = window.screen.width;
  const screen_h = window.screen.height;
  const dpr      = window.devicePixelRatio || 1;

  function deviceType() {
    if (/Mobi|Android|iPhone|iPad/i.test(ua)) return /iPad/i.test(ua) ? 'tablet' : 'mobile';
    return 'desktop';
  }

  // ── Core payload ────────────────────────────────────────────────────────────
  const base = {
    vid, sid,
    isNew,
    page:     location.pathname,
    referrer: document.referrer || '',
    utmSrc, utmMed, utmCamp, utmTerm, utmCont,
    ua,
    lang,
    screen:   `${screen_w}x${screen_h}@${dpr}x`,
    device:   deviceType(),
    ts:       new Date().toISOString(),
  };

  // ── Send helper ─────────────────────────────────────────────────────────────
  function send(type, extra = {}) {
    const payload = JSON.stringify({ ...base, type, ...extra });
    if (navigator.sendBeacon) {
      navigator.sendBeacon(API, new Blob([payload], { type: 'application/json' }));
    } else {
      fetch(API, { method: 'POST', body: payload, keepalive: true }).catch(() => {});
    }
  }

  // ── Scroll depth ────────────────────────────────────────────────────────────
  let maxScroll = 0;
  window.addEventListener('scroll', function () {
    const pct = Math.round(
      ((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight) * 100
    );
    if (pct > maxScroll) maxScroll = Math.min(pct, 100);
  }, { passive: true });

  // ── Time on page ────────────────────────────────────────────────────────────
  const pageStart = Date.now();

  window.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') {
      send('exit', { duration: Math.round((Date.now() - pageStart) / 1000), scrollDepth: maxScroll });
    }
  });

  // ── CTA click tracking ──────────────────────────────────────────────────────
  document.addEventListener('click', function (e) {
    const el = e.target.closest('[data-checkout], a[href^="https://calendar"], a[href^="mailto"]');
    if (!el) return;
    const label = el.getAttribute('data-checkout') ||
                  (el.href?.includes('calendar') ? 'calendar' : 'mailto');
    send('click', { label });
  });

  // ── Page view ───────────────────────────────────────────────────────────────
  send('pageview');

})();
