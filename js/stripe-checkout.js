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
    'ai-operator-kit':      'https://book.stripe.com/test_7sY3cubt77qu5eGf5AeME0c',
    'fractional-architect': 'https://buy.stripe.com/test_8x2dR82WB4ei4aCf5AeME0d',
  };

  const LIVE = {
    'ai-operator-kit':      'https://book.stripe.com/cNi3cucnggacgDu56pb7y0g',
    'fractional-architect': 'https://buy.stripe.com/00waEW2MG7DG3QI2Yhb7y0h',
  };

  const useTest = window.location.hostname === 'localhost' ||
                  new URLSearchParams(window.location.search).get('test') === '1';

  const links = useTest ? TEST : LIVE;

  document.querySelectorAll('[data-checkout]').forEach(btn => {
    const slug = btn.getAttribute('data-checkout');
    const url  = links[slug];
    if (!url) return;
    btn.addEventListener('click', () => { window.location.href = url; });
  });
})();
