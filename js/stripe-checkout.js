/**
 * Sidekick — Stripe Payment Links
 * Uses test links on localhost or when URL has ?test=1; otherwise live.
 */
(() => {
  const TEST = {
    'sidekick-kit': 'https://buy.stripe.com/28EfZg1ICbTWfzqeGZb7y0b',
  };

  const LIVE = {
    'sidekick-kit': 'https://buy.stripe.com/8x2cN42MG8HK2ME7exb7y0c',
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
