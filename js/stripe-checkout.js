/**
 * AI Operator — Stripe Payment Links
 * Uses test links on localhost or when URL has ?test=1; otherwise live.
 *
 * Slugs:
 *   ai-operator-kit       → 2-week bootcamp (one-time $25)
 *   fractional-architect  → monthly subscription (1 hr/week)
 */
(() => {
  const TEST = {
    'ai-operator-kit':      'https://buy.stripe.com/test_fZucN48gV26adLccXseME0a',
    'fractional-architect': null, // TODO: add test payment link
  };

  const LIVE = {
    'ai-operator-kit':      'https://buy.stripe.com/5kQ3cucng0be86Y0Q9b7y0e',
    'fractional-architect': null, // TODO: add live Stripe subscription payment link
  };

  const useTest = window.location.hostname === 'localhost' ||
                  new URLSearchParams(window.location.search).get('test') === '1';

  const links = useTest ? TEST : LIVE;

  document.querySelectorAll('[data-checkout]').forEach(btn => {
    const slug = btn.getAttribute('data-checkout');
    const url  = links[slug];
    if (!url) {
      // Not yet wired — fall back to calendar booking
      btn.addEventListener('click', () => {
        window.open('https://calendar.app.google/tN2C8hnMdvQDa8Vf7', '_blank', 'noopener');
      });
      return;
    }
    btn.addEventListener('click', () => { window.location.href = url; });
  });
})();
