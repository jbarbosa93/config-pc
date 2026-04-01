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
    .select(`
      id, type, name, brand, specs, price_ch, price_fr,
      socket, chipset, form_factor, tdp, description,
      manufacturer_url, popularity_score, release_year,
      component_images(url, is_primary, alt_text, order_index),
      component_prices(id, site, price, currency, url, in_stock)
    `)
    .eq("active", true)
    .ilike("name", `%${name}%`)
    .order("popularity_score", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) return NextResponse.json(null);
  return NextResponse.json(data);
}
