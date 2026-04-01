import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";

function checkAuth(req: NextRequest): boolean {
  const auth = req.headers.get("authorization");
  return auth === `Bearer ${process.env.ADMIN_PASSWORD}`;
}

// POST upsert price for a component + site
export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const supabase = getServiceSupabase();

  const { data, error } = await supabase
    .from("component_prices")
    .upsert(
      {
        component_id: body.component_id,
        site: body.site,
        price: body.price,
        currency: body.currency || "CHF",
        url: body.url || "",
        in_stock: body.in_stock ?? true,
      },
      { onConflict: "component_id,site" }
    )
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// DELETE price
export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const supabase = getServiceSupabase();
  const { error } = await supabase.from("component_prices").delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
