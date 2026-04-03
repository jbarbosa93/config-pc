import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import { getServiceSupabase } from "@/lib/supabase";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripeKey || !webhookSecret) {
    return NextResponse.json({ error: "Stripe non configuré" }, { status: 503 });
  }

  const stripe = new Stripe(stripeKey, { apiVersion: "2026-03-25.dahlia" });
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) return NextResponse.json({ error: "No signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook error";
    console.error("Webhook signature verification failed:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCompletedSession(stripe, session);
      break;
    }
    case "checkout.session.expired":
      console.log("Checkout session expired:", (event.data.object as Stripe.Checkout.Session).id);
      break;
    default:
      console.log("Unhandled event type:", event.type);
  }

  return NextResponse.json({ received: true });
}

async function handleCompletedSession(stripe: Stripe, session: Stripe.Checkout.Session) {
  try {
    // Retrieve full session with line items
    const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ["line_items"],
    });

    const lineItems = fullSession.line_items?.data ?? [];
    const customerEmail = fullSession.customer_details?.email ?? fullSession.customer_email ?? null;
    const amountTotal = fullSession.amount_total;

    // 1. Persist order to Supabase
    const supabase = getServiceSupabase();
    if (supabase) {
      const { error } = await supabase.from("orders").upsert(
        {
          stripe_session_id: session.id,
          customer_email: customerEmail,
          amount_total: amountTotal,
          currency: fullSession.currency ?? "chf",
          status: "completed",
          items: lineItems.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            amount_total: item.amount_total,
            currency: item.currency,
          })),
          metadata: fullSession.metadata ?? {},
        },
        { onConflict: "stripe_session_id" }
      );
      if (error) console.error("Failed to persist order:", error.message);
    }

    // 2. Send confirmation email to customer
    if (customerEmail) {
      const amountCHF = amountTotal != null ? (amountTotal / 100).toFixed(2) : "—";
      const itemLines = lineItems
        .map((item) => `• ${item.description} — CHF ${((item.amount_total ?? 0) / 100).toFixed(2)}`)
        .join("\n");

      await resend.emails.send({
        from: "config-pc.ch <no-reply@config-pc.ch>",
        to: customerEmail,
        subject: "Confirmation de votre commande — config-pc.ch",
        text: `Bonjour,

Merci pour votre commande sur config-pc.ch !

Récapitulatif :
${itemLines}

Total : CHF ${amountCHF}
Référence : ${session.id.slice(-12).toUpperCase()}

Notre équipe vous contactera sous 24–48h pour organiser la livraison ou le retrait.

À bientôt,
L'équipe config-pc.ch`,
        html: `
<div style="font-family:sans-serif;max-width:520px;margin:0 auto;color:#0A0A0A">
  <h2 style="font-size:22px;margin-bottom:4px">Commande confirmée ✅</h2>
  <p style="color:#666;margin-bottom:24px">Merci pour votre achat sur <strong>config-pc.ch</strong> !</p>

  <div style="background:#F8F8F8;border-radius:12px;padding:16px 20px;margin-bottom:20px">
    <p style="font-size:12px;text-transform:uppercase;letter-spacing:.05em;color:#888;margin:0 0 10px">Récapitulatif</p>
    ${lineItems.map((item) => `
    <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #EBEBEB">
      <span style="font-size:14px">${item.description}</span>
      <span style="font-size:14px;font-weight:600">CHF ${((item.amount_total ?? 0) / 100).toFixed(2)}</span>
    </div>`).join("")}
    <div style="display:flex;justify-content:space-between;padding:10px 0 0;font-weight:700;font-size:16px">
      <span>Total</span>
      <span>CHF ${amountCHF}</span>
    </div>
  </div>

  <p style="font-size:12px;color:#AAA;margin-bottom:20px">Référence : ${session.id.slice(-12).toUpperCase()}</p>

  <p style="font-size:14px;color:#444;line-height:1.6">Notre équipe vous contactera sous <strong>24–48h</strong> pour organiser la livraison ou le retrait.</p>

  <p style="font-size:13px;color:#888;margin-top:24px">À bientôt,<br>L'équipe config-pc.ch</p>
</div>`,
      });
    }
  } catch (err) {
    console.error("handleCompletedSession error:", err);
  }
}
