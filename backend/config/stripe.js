/**
 * Stripe Payment Gateway Configuration
 * 
 * Concept:
 * Stripe handles credit/debit card processing and escrow checkouts.
 * If live test keys are configured (starting with `sk_test_`), we initialize the Stripe SDK.
 * Otherwise, a safe mock mode is provided so full contract milestone payouts can be tested
 * locally without needing real API keys.
 */
let stripeClient = null;

if (
  process.env.STRIPE_SECRET_KEY &&
  !process.env.STRIPE_SECRET_KEY.includes('placeholder')
) {
  try {
    const Stripe = require('stripe');
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    });
    console.log('[Stripe] Initialized with Secret Key');
  } catch (err) {
    console.warn('[Stripe] Failed to initialize Stripe client, running in mock mode:', err.message);
  }
} else {
  console.log('[Stripe] Running in simulated/mock payment mode for development');
}

module.exports = {
  stripeClient,
  isMockMode: !stripeClient,
};
