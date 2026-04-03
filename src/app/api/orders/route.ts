import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

/** GET /api/orders?session_id=cs_xxx — fetch session details from Stripe */
export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id");
  if (!sessionId) return NextResponse.json({ error: "Missing session_id" }, { status: 400 });

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });

  try {
    const stripe = new Stripe(stripeKey, { apiVersion: "2026-03-25.dahlia" });
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    });

    return NextResponse.json({
      id: session.id,
      status: session.status,
      customerEmail: session.customer_details?.email ?? session.customer_email,
      amountTotal: session.amount_total,
      currency: session.currency,
      lineItems: session.line_items?.data.map((item) => ({
        description: item.description,
        quantity: item.quantity,
        amountTotal: item.amount_total,
      })) ?? [],
    });
  } catch (err) {
    console.error("Failed to retrieve Stripe session:", err);
    return NextResponse.json({ error: "Session introuvable" }, { status: 404 });
  }
}
