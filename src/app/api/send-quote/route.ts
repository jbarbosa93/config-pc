import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

interface QuoteRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address: string;
  npa: string;
  city: string;
  country: string;
  message?: string;
  delivery: boolean;
  assembly: boolean;
  configName: string;
  components: { type: string; name: string; price_fr: number; price_ch: number }[];
  totalFR: number;
  totalCH: number;
  market: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: QuoteRequest = await request.json();

    const isCH = body.market === "suisse";
    const currency = isCH ? "CHF" : "€";
    const total = isCH ? body.totalCH : body.totalFR;

    const componentLines = body.components
      .map(
        (c) =>
          `• ${c.type}: ${c.name} — ${isCH ? `${c.price_ch} CHF` : `${c.price_fr}€`}`
      )
      .join("\n");

    const assemblyLine = body.assembly
      ? `\nOption montage : +150 CHF`
      : "";
    const deliveryLine = body.delivery
      ? `\nLivraison à domicile : Oui`
      : "";
    const totalWithAssembly = body.assembly ? total + 150 : total;

    const emailBody = `
Bonjour ${body.firstName},

Merci pour votre demande de devis sur ConfigPC.ch !

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VOTRE CONFIGURATION : ${body.configName}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${componentLines}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL ESTIMÉ : ${totalWithAssembly} ${currency}${assemblyLine}${deliveryLine}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ADRESSE DE LIVRAISON :
${body.firstName} ${body.lastName}
${body.address}
${body.npa} ${body.city}
${body.country}
${body.phone ? `Tél: ${body.phone}` : ""}

${body.message ? `MESSAGE :\n${body.message}\n` : ""}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Nous vous recontacterons sous 24h pour confirmer les disponibilités et le prix final.

Les prix affichés sont indicatifs et seront confirmés lors de la finalisation du devis.

Cordialement,
L'équipe ConfigPC.ch
    `.trim();

    await resend.emails.send({
      from: "ConfigPC.ch <onboarding@resend.dev>",
      to: body.email,
      subject: `Votre devis ConfigPC.ch — ${body.configName}`,
      text: emailBody,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Send quote error:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi du devis" },
      { status: 500 }
    );
  }
}
