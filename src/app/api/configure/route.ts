import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import type { ConfigRequest } from "@/lib/types";
import { getServiceSupabase } from "@/lib/supabase";
import type { DBComponent } from "@/lib/db-types";

const client = new Anthropic();

const SYSTEM_PROMPT = `Tu es un expert hardware PC avec 15 ans d'expérience. Tu connais parfaitement les composants 2024-2025 et leurs prix réels sur le marché suisse.

RÈGLES DE PRIX STRICTES :
- Tous les prix sont UNIQUEMENT en CHF (francs suisses). Aucun EUR.
- Utilise les prix RÉELS de vente constatés en Q1 2025 sur Digitec, Galaxus, Brack et Interdiscount.
- Ne donne JAMAIS de prix MSRP/constructeur. Donne le prix de vente moyen constaté en Suisse.
- Composants de référence 2025 : AMD Ryzen 7000/9000, Intel Core 14e/15e gen, NVIDIA RTX 4000/5000, AMD RX 7000/9000, DDR5, NVMe Gen4/Gen5.
- Le site cible uniquement le marché SUISSE. price_fr = 0 toujours.

RÈGLES POUR config_name (IMPORTANT) :
- Génère un nom accrocheur, court (2-3 mots max), évocateur et en français
- Style : "Le Chasseur", "L'Invincible", "La Fusée", "Le Titan", "L'Éclaireur", "Le Sage", "La Bête", "L'Artisan"
- Le nom doit refléter le niveau de la config (budget = sage/discret, haut de gamme = titan/invincible)
- NE PAS utiliser des noms génériques comme "Gaming 1080p" ou "Config Bureautique"

Tu donnes des recommandations précises, justifiées, optimisées pour le rapport qualité/prix. Tu évites les incompatibilités (socket CPU/carte mère, DDR4 vs DDR5, taille boîtier, puissance alimentation).

Tu dois TOUJOURS répondre avec un JSON valide et rien d'autre. Pas de texte avant ou après le JSON.

Le format de sortie est :
{
  "config_name": "string - nom accrocheur court (ex: 'Le Chasseur', 'La Fusée', 'L'Invincible')",
  "total_estimated": number,
  "components": [
    {
      "type": "CPU | GPU | RAM | Stockage | Carte mère | Alimentation | Boîtier | Refroidissement",
      "name": "string - nom exact du produit tel qu'on le trouve en magasin",
      "reason": "string - justification courte (1 phrase)",
      "full_description": "string - description complète 2-3 phrases expliquant pourquoi ce composant est idéal pour cet usage",
      "price_fr": number,
      "price_ch": number,
      "search_terms": ["string"],
      "priority": "essentiel | recommande | optionnel",
      "specs": {
        "clé": "valeur"
      },
      "image_url": "string - URL directe vers l'image officielle du fabricant pour ce produit exact (ex: image sur amd.com, nvidia.com, corsair.com etc.)",
      "manufacturer_url": "string - URL de la page officielle du fabricant pour ce produit"
    }
  ],
  "compatibility_notes": "string",
  "upgrade_path": "string",
  "alternatives": []
}

RÈGLES POUR specs (adapté au type de composant) :
- CPU: Cores/Threads, Fréquence boost, TDP, Socket, Cache L3
- GPU: VRAM, Architecture, TDP, Sorties vidéo
- RAM: Type, Fréquence, Latence CL, Capacité
- Stockage: Capacité, Interface, Lecture séq., Écriture séq.
- Carte mère: Socket, Chipset, Format, RAM max
- Alimentation: Puissance, Certification 80+, Modulaire
- Boîtier: Format, Emplacements ventilateurs, Fenêtre latérale
- Refroidissement: Type, TDP supporté, Niveau sonore

RÈGLES POUR image_url :
- Donne l'URL directe d'une image officielle du fabricant si tu la connais
- Sinon mets une chaîne vide ""

RÈGLES POUR manufacturer_url :
- Donne l'URL de la page produit sur le site officiel du fabricant
- Ex: "https://www.amd.com/fr/products/processors/desktops/ryzen/7000-series/amd-ryzen-5-7600.html"
- Si tu ne connais pas l'URL exacte, donne la page catégorie du fabricant`;

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
- Budget : ${config.budget} CHF
- Résolution visée : ${config.resolution}
- Jeux / logiciels favoris : ${config.favoriteGames || "Non spécifié"}
- Niveau technique : ${config.techLevel}
- Marché : Suisse (CHF uniquement)

IMPORTANT : Tous les prix doivent être en CHF (marché suisse, Digitec/Galaxus/Brack). Mets price_fr à 0. Reste dans le budget de ${config.budget} CHF. Inclus tous les composants essentiels (CPU, GPU, RAM, stockage, carte mère, alimentation, boîtier, refroidissement). Génère un nom de config accrocheur et évocateur. Inclus les specs techniques, full_description, image_url et manufacturer_url pour chaque composant.`;
}

/** Fetch available components from DB to give Claude real data */
async function getDBComponents(budget: number): Promise<DBComponent[]> {
  try {
    const supabase = getServiceSupabase();
    if (!supabase) return [];
    const { data } = await supabase
      .from("components")
      .select("*, component_images(url, is_primary)")
      .eq("active", true)
      .eq("available_ch", true)
      .lte("price_ch", budget * 0.6) // individual component should be < 60% of total budget
      .order("popularity_score", { ascending: false })
      .limit(100);
    return (data as DBComponent[]) || [];
  } catch {
    return [];
  }
}

/** Format DB components as context for Claude */
function formatDBContext(dbComponents: DBComponent[]): string {
  if (dbComponents.length === 0) return "";

  const grouped: Record<string, DBComponent[]> = {};
  for (const c of dbComponents) {
    if (!grouped[c.type]) grouped[c.type] = [];
    grouped[c.type].push(c);
  }

  let ctx = "\n\nCOMPOSANTS DISPONIBLES DANS NOTRE BASE DE DONNÉES (utilise-les en priorité) :\n";
  for (const [type, items] of Object.entries(grouped)) {
    ctx += `\n${type}:\n`;
    for (const item of items.slice(0, 5)) {
      ctx += `- ${item.name} | ${item.price_ch} CHF / ${item.price_fr}€ | Socket: ${item.socket || "N/A"} | TDP: ${item.tdp || "N/A"}W\n`;
    }
  }
  ctx += "\nSi un composant de notre DB correspond au besoin, utilise son nom exact et ses prix. Sinon, recommande un composant que tu connais.";
  return ctx;
}

export async function POST(request: NextRequest) {
  try {
    const body: ConfigRequest = await request.json();

    // Fetch components from our DB to enrich Claude's context
    const dbComponents = await getDBComponents(body.budget);
    const dbContext = formatDBContext(dbComponents);

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      messages: [
        {
          role: "user",
          content: buildUserPrompt(body) + dbContext,
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

    // Force CHF-only: zero out any EUR prices and remove non-Swiss store references
    if (config.components) {
      for (const comp of config.components) {
        comp.price_fr = 0;
        // If Claude hallucinated non-Swiss stores in search_terms, clean them
        if (comp.search_terms) {
          comp.search_terms = comp.search_terms.filter((t: string) =>
            !t.toLowerCase().includes("amazon") && !t.toLowerCase().includes("ldlc") && !t.toLowerCase().includes("cdiscount")
          );
        }
      }
    }

    // Enrich components with DB images if available
    if (dbComponents.length > 0 && config.components) {
      for (const comp of config.components) {
        const match = dbComponents.find(
          (db) => db.name.toLowerCase() === comp.name.toLowerCase()
        );
        if (match) {
          const images = (match as DBComponent & { component_images?: { url: string; is_primary: boolean }[] }).component_images;
          const primary = images?.find((img) => img.is_primary);
          if (primary) comp.image_url = primary.url;
          if (match.manufacturer_url) comp.manufacturer_url = match.manufacturer_url;
          if (match.description) comp.full_description = match.description;
          // Use DB prices as source of truth
          comp.price_ch = match.price_ch;
          comp.price_fr = match.price_fr;
          if (match.specs && Object.keys(match.specs).length > 0) comp.specs = match.specs;
        }
      }
    }

    return NextResponse.json(config);
  } catch (error) {
    console.error("Configure API error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la génération de la configuration" },
      { status: 500 }
    );
  }
}
