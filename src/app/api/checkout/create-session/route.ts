import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return NextResponse.json({ error: "Stripe non configuré" }, { status: 503 });
  }

  const stripe = new Stripe(stripeKey, { apiVersion: "2026-03-25.dahlia" });

  try {
    const body = await req.json();
    const { items, assembly, customerEmail, successUrl, cancelUrl } = body;

    if (!items?.length) {
      return NextResponse.json({ error: "Panier vide" }, { status: 400 });
    }

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item: { name: string; price_ch: number; type: string; quantity?: number }) => ({
      price_data: {
        currency: "chf",
        product_data: {
          name: item.name,
          description: item.type,
        },
        unit_amount: Math.round(item.price_ch * 100), // centimes
      },
      quantity: item.quantity || 1,
    }));

    // Add assembly fee if requested
    if (assembly) {
      lineItems.push({
        price_data: {
          currency: "chf",
          product_data: {
            name: "Montage du PC",
            description: "Assemblage professionnel de votre configuration",
          },
          unit_amount: 15000, // 150 CHF
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      customer_email: customerEmail || undefined,
      success_url: successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/commande/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/commander`,
      locale: "fr",
      shipping_address_collection: {
        allowed_countries: ["CH"],
      },
      metadata: {
        source: "config-pc.ch",
      },
    });

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur Stripe";
    console.error("Stripe create-session error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
