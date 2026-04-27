import Stripe from 'stripe';

let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_placeholder', {
      apiVersion: '2026-04-22.dahlia',
    });
  }
  return stripeInstance;
}

export const STRIPE_PLANS = {
  recruta: null,
  agente: process.env.STRIPE_PRICE_AGENTE || 'price_agente_placeholder',
  diretor: process.env.STRIPE_PRICE_DIRETOR || 'price_diretor_placeholder',
};
