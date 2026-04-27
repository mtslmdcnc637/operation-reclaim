import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-04-22.dahlia',
  typescript: true,
});

export const STRIPE_PLANS = {
  recruta: null, // free
  agente: process.env.STRIPE_PRICE_AGENTE || 'price_agente_placeholder',
  diretor: process.env.STRIPE_PRICE_DIRETOR || 'price_diretor_placeholder',
};
