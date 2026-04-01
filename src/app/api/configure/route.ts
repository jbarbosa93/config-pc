import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import type { ConfigRequest } from "@/lib/types";

const client = new Anthropic();

const SYSTEM_PROMPT = `Tu es un expert hardware PC avec 15 ans d'expérience. Tu connais parfaitement les composants 2024-2025 et leurs prix réels sur le marché.

RÈGLES DE PRIX STRICTES :
- Utilise les prix RÉELS de vente constatés en Q1 2025 sur LDLC, Amazon.fr, Digitec et Galaxus.
- Les prix suisses (CHF) doivent être 10 à 20% plus élevés que les prix français (EUR), ce qui reflète la réalité du marché suisse.
- Ne donne JAMAIS de prix MSRP/constructeur. Donne le prix de vente moyen constaté en magasin.
- Composants de référence 2025 : AMD Ryzen 7000/9000, Intel Core 14e/15e gen, NVIDIA RTX 4000/5000, AMD RX 7000/9000, DDR5, NVMe Gen4/Gen5.

Tu donnes des recommandations précises, justifiées, optimisées pour le rapport qualité/prix. Tu évites les incompatibilités (socket CPU/carte mère, DDR4 vs DDR5, taille boîtier, puissance alimentation).

Tu dois TOUJOURS répondre avec un JSON valide et rien d'autre. Pas de texte avant ou après le JSON.

Le format de sortie est :
{
  "config_name": "string - nom court de la config",
  "total_estimated": number,
  "components": [
    {
      "type": "CPU | GPU | RAM | Stockage | Carte mère | Alimentation | Boîtier | Refroidissement",
      "name": "string - nom exact du produit tel qu'on le trouve en magasin",
      "reason": "string - justification courte (1 phrase)",
      "price_fr": number,
      "price_ch": number,
      "search_terms": ["string - termes de recherche pour trouver le produit"],
      "priority": "essentiel | recommande | optionnel",
      "stock_status": "in_stock | variable | check",
      "specs": {
        "clé": "valeur"
      }
    }
  ],
  "compatibility_notes": "string",
  "upgrade_path": "string",
  "alternatives": []
}

RÈGLES POUR stock_status :
- "in_stock" : composant populaire, généralement disponible partout
- "variable" : composant très demandé, stock fluctuant
- "check" : composant rare, récent ou en fin de vie, vérifier avant achat

RÈGLES POUR specs (adapté au type) :
- CPU: Cores, Fréquence, TDP, Socket, Cache
- GPU: VRAM, Architecture, TDP, Ports
- RAM: Fréquence, Latence, Capacité
- Stockage: Capacité, Interface, Lecture, Écriture
- Carte mère: Socket, Chipset, Format, RAM max
- Alimentation: Puissance, Certification, Modularité
- Boîtier: Format, Ventilateurs inclus, Compatibilité GPU
- Refroidissement: Type, TDP max, Niveau sonore`;

function buildUserPrompt(config: ConfigRequest): string {
  const usageLabels: Record<string, string> = {
    gaming: "Gaming",
    streaming: "Streaming / Création de contenu",
    montage: "Montage vidéo / 3D",
    bureautique: "Bureautique / Productivité",
    polyvalent: "Polyvalent (un peu de tout)",
  };
  const marketLabels: Record<string, string> = {
    france: "France uniquement",
    suisse: "Suisse uniquement",
    both: "France et Suisse",
  };

  return `Configure un PC optimisé avec ces critères :
- Usage principal : ${usageLabels[config.usage]}
- Budget : ${config.budget}€
- Résolution visée : ${config.resolution}
- Jeux / logiciels favoris : ${config.favoriteGames || "Non spécifié"}
- Niveau technique : ${config.techLevel}
- Marché : ${marketLabels[config.market]}

IMPORTANT : Les prix doivent être réalistes et correspondre aux prix de vente réels en Q1 2025. Les prix suisses doivent être 10-20% plus élevés que les prix français. Reste dans le budget de ${config.budget}€. Inclus tous les composants essentiels (CPU, GPU, RAM, stockage, carte mère, alimentation, boîtier, refroidissement). Inclus les specs techniques détaillées et le stock_status pour chaque composant.`;
}

export async function POST(request: NextRequest) {
  try {
    const body: ConfigRequest = await request.json();

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 3000,
      messages: [
        {
          role: "user",
          content: buildUserPrompt(body),
        },
      ],
      system: SYSTEM_PROMPT,
    });

    const text =
      message.content[0].type === "text" ? message.content[0].text : "";

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "Réponse invalide du modèle" },
        { status: 500 }
      );
    }

    const config = JSON.parse(jsonMatch[0]);
    return NextResponse.json(config);
  } catch (error) {
    console.error("Configure API error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la génération de la configuration" },
      { status: 500 }
    );
  }
}
