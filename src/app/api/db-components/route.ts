import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const supabase = getServiceSupabase();
  if (!supabase) return NextResponse.json([]);

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const budget = searchParams.get("budget") ? parseInt(searchParams.get("budget")!) : null;

  const limitParam = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : 20;

  let query = supabase
    .from("components")
    .select("*, component_images(url, is_primary, alt_text)")
    .eq("active", true);

  if (type) query = query.eq("type", type);
  if (budget) query = query.lte("price_ch", budget);

  query = query.order("popularity_score", { ascending: false }).limit(Math.min(limitParam, 200));

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
