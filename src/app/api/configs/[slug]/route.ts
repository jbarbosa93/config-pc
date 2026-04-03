import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (!slug) return NextResponse.json({ error: "Slug manquant" }, { status: 400 });

  const supabase = getServiceSupabase();
  if (!supabase) return NextResponse.json({ error: "DB non configurée" }, { status: 503 });

  const { data, error } = await supabase
    .from("shared_configs")
    .select("slug, config_name, total_estimated, config_data, created_at")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json({ error: "Config introuvable" }, { status: 404 });
  }

  return NextResponse.json(data);
}
