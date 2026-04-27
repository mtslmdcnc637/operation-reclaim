import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-04-22.dahlia',
});

export async function POST(request: NextRequest) {
  try {
    const { planId, email, codeName } = await request.json();

    if (!planId || planId === 'recruta') {
      return NextResponse.json({ error: 'Plano inválido' }, { status: 400 });
    }

    // Map plan to Stripe price
    // In production, these would be real Stripe Price IDs
    const priceMap: Record<string, string> = {
      agente: process.env.STRIPE_PRICE_AGENTE || 'price_agente',
      diretor: process.env.STRIPE_PRICE_DIRETOR || 'price_diretor',
    };

    const priceId = priceMap[planId];
    if (!priceId) {
      return NextResponse.json({ error: 'Plano não encontrado' }, { status: 400 });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/#pricing`,
      metadata: {
        planId,
        email,
        codeName,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Erro ao criar sessão de pagamento' },
      { status: 500 }
    );
  }
}
