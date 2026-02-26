/**
 * AI Operator — Stripe Payment Links
 * Uses test links on localhost or when URL has ?test=1; otherwise live.
 */
(() => {
  const TEST = {
    'ai-operator-kit': 'https://buy.stripe.com/test_fZucN48gV26adLccXseME0a',
  };

  const LIVE = {
    'ai-operator-kit': 'https://buy.stripe.com/28EfZg1ICbTWfzqeGZb7y0b',
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
