import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";

/** Public API: search components in DB by type */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const budget = searchParams.get("budget") ? parseInt(searchParams.get("budget")!) : null;

  const supabase = getServiceSupabase();
  let query = supabase
    .from("components")
    .select("*, component_images(url, is_primary, alt_text)")
    .eq("active", true)
    .eq("available_ch", true);

  if (type) query = query.eq("type", type);
  if (budget) query = query.lte("price_ch", budget);

  query = query.order("popularity_score", { ascending: false }).limit(20);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
