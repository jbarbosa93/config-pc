import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";

function generateSlug(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let slug = "config-";
  for (let i = 0; i < 6; i++) slug += chars[Math.floor(Math.random() * chars.length)];
  return slug;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { config } = body;

    if (!config || !config.config_name || !Array.isArray(config.components)) {
      return NextResponse.json({ error: "Config invalide" }, { status: 400 });
    }

    const supabase = getServiceSupabase();
    if (!supabase) return NextResponse.json({ error: "DB non configurée" }, { status: 503 });

    // Try up to 3 times to get a unique slug
    let slug = "";
    for (let attempt = 0; attempt < 3; attempt++) {
      const candidate = generateSlug();
      const { data } = await supabase
        .from("shared_configs")
        .select("slug")
        .eq("slug", candidate)
        .maybeSingle();
      if (!data) { slug = candidate; break; }
    }
    if (!slug) return NextResponse.json({ error: "Erreur génération slug" }, { status: 500 });

    const { error } = await supabase.from("shared_configs").insert({
      slug,
      config_name: config.config_name,
      total_estimated: config.total_estimated,
      config_data: config,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("shared_configs insert error:", error.message);
      return NextResponse.json({ error: "Erreur sauvegarde" }, { status: 500 });
    }

    return NextResponse.json({ slug, url: `https://config-pc.ch/config/${slug}` });
  } catch (err) {
    console.error("save config error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
