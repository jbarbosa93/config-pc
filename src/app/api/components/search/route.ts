import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const supabase = getServiceSupabase();
  if (!supabase) return NextResponse.json(null);

  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name");
  if (!name) return NextResponse.json(null);

  const { data, error } = await supabase
    .from("components")
    .select("*, component_images(url, is_primary, alt_text, sort_order)")
    .eq("active", true)
    .ilike("name", `%${name}%`)
    .order("popularity_score", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) return NextResponse.json(null);
  return NextResponse.json(data);
}
