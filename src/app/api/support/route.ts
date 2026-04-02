import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Email invalide" }, { status: 400 });
    }

    await resend.emails.send({
      from: "support@config-pc.ch",
      to: "support@config-pc.ch",
      replyTo: email,
      subject: `[Support] ${subject}`,
      text: `Nouveau message de support\n\nNom : ${name}\nEmail : ${email}\nSujet : ${subject}\n\nMessage :\n${message}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <h2 style="color: #4f8ef7; margin-bottom: 16px;">Nouveau message de support</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #666; font-size: 14px; width: 80px;">Nom</td><td style="padding: 8px 0; font-size: 14px; font-weight: 600;">${name}</td></tr>
            <tr><td style="padding: 8px 0; color: #666; font-size: 14px;">Email</td><td style="padding: 8px 0; font-size: 14px;"><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding: 8px 0; color: #666; font-size: 14px;">Sujet</td><td style="padding: 8px 0; font-size: 14px; font-weight: 600;">${subject}</td></tr>
          </table>
          <div style="margin-top: 16px; padding: 16px; background: #F8F9FA; border-radius: 8px; border-left: 3px solid #4f8ef7;">
            <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #333; white-space: pre-wrap;">${message}</p>
          </div>
        </div>
      `,
    });

    // Auto-reply to user
    await resend.emails.send({
      from: "support@config-pc.ch",
      to: email,
      subject: "Nous avons bien reçu votre message — config-pc.ch",
      text: `Bonjour ${name},\n\nMerci de nous avoir contactés. Nous avons bien reçu votre message et vous répondrons sous 24h.\n\nÀ bientôt,\nL'équipe config-pc.ch`,
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 24px;">
          <h2 style="color: #4f8ef7;">Merci pour votre message !</h2>
          <p style="color: #444; line-height: 1.6;">Bonjour ${name},</p>
          <p style="color: #444; line-height: 1.6;">Nous avons bien reçu votre message et vous répondrons sous <strong>24 heures ouvrables</strong>.</p>
          <p style="color: #888; font-size: 13px;">L'équipe config-pc.ch</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Support email error:", err);
    return NextResponse.json({ error: "Erreur lors de l'envoi" }, { status: 500 });
  }
}
