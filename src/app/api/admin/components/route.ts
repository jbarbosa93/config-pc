import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";

function checkAuth(req: NextRequest): boolean {
  const auth = req.headers.get("authorization");
  return auth === `Bearer ${process.env.ADMIN_PASSWORD}`;
}

// GET all components
export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = getServiceSupabase();
  const { data, error } = await supabase
    .from("components")
    .select("*, component_images(*), component_prices(*)")
    .order("type")
    .order("popularity_score", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST create component
export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const supabase = getServiceSupabase();

  const { data, error } = await supabase
    .from("components")
    .insert({
      type: body.type,
      name: body.name,
      brand: body.brand,
      specs: body.specs || {},
      price_ch: body.price_ch || 0,
      price_fr: body.price_fr || 0,
      socket: body.socket || null,
      chipset: body.chipset || null,
      form_factor: body.form_factor || null,
      tdp: body.tdp || null,
      description: body.description || "",
      manufacturer_url: body.manufacturer_url || "",
      popularity_score: body.popularity_score || 0,
      release_year: body.release_year || null,
      available_ch: body.available_ch ?? true,
      active: body.active ?? true,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

// PUT update component
export async function PUT(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  if (!body.id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const supabase = getServiceSupabase();
  const { id, ...updates } = body;

  const { data, error } = await supabase
    .from("components")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// DELETE component
export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const supabase = getServiceSupabase();
  const { error } = await supabase.from("components").delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
