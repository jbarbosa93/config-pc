import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import type { AlternativesRequest } from "@/lib/types";

const client = new Anthropic();

const SYSTEM_PROMPT = `Tu es un expert hardware PC avec 15 ans d'expérience. Tu connais parfaitement les composants 2024-2025 et leurs compatibilités. Tu connais les prix du marché suisse (Digitec, Galaxus, Brack, Interdiscount).

Tu dois TOUJOURS répondre avec un JSON valide et rien d'autre.
Tous les prix sont UNIQUEMENT en CHF (francs suisses). Aucun EUR.

Le format de sortie est :
{
  "alternatives": [
    {
      "tier": "budget | equilibre | performance | overkill",
      "name": "string - nom exact du produit",
      "reason": "string - une ligne courte de justification",
      "price_fr": 0,
      "price_ch": number,
      "search_terms": ["string"],
      "compatible": true/false,
      "compatibility_warning": "string - vide si compatible, sinon explication courte"
    }
  ]
}`;

export async function POST(request: NextRequest) {
  try {
    const body: AlternativesRequest = await request.json();

    const otherComponents = body.all_components
      .filter((c) => c.type !== body.component_type)
      .map((c) => `- ${c.type}: ${c.name}`)
      .join("\n");

    const userPrompt = `Je cherche 4 alternatives pour remplacer mon ${body.component_type} actuel (${body.current_component.name}) dans cette config :

Autres composants de la config :
${otherComponents}

Usage : ${body.usage}
Budget total : ${body.budget} CHF

Donne-moi exactement 4 alternatives dans cet ordre :
1. "budget" — le moins cher qui fait le job
2. "equilibre" — meilleur rapport qualité/prix
3. "performance" — pour les exigeants
4. "overkill" — le meilleur sans compromis

Pour chaque alternative, vérifie la compatibilité avec les autres composants (socket CPU, type RAM DDR4/DDR5, taille boîtier, puissance alimentation, etc).
Prix UNIQUEMENT en CHF (marché suisse). Mets price_fr à 0.
Ne propose PAS le composant actuel (${body.current_component.name}).`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      messages: [{ role: "user", content: userPrompt }],
      system: SYSTEM_PROMPT,
    });

    const text =
      message.content[0].type === "text" ? message.content[0].text : "";

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "Reponse invalide du modele" },
        { status: 500 }
      );
    }

    const data = JSON.parse(jsonMatch[0]);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Alternatives API error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la generation des alternatives" },
      { status: 500 }
    );
  }
}
