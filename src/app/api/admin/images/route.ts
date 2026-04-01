import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";

function checkAuth(req: NextRequest): boolean {
  const auth = req.headers.get("authorization");
  return auth === `Bearer ${process.env.ADMIN_PASSWORD}`;
}

const NO_DB = NextResponse.json({ error: "Database not configured" }, { status: 503 });

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const supabase = getServiceSupabase();
  if (!supabase) return NO_DB;

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const componentId = formData.get("component_id") as string | null;
  const isPrimary = formData.get("is_primary") === "true";
  const altText = (formData.get("alt_text") as string) || "";

  if (!file || !componentId) return NextResponse.json({ error: "Missing file or component_id" }, { status: 400 });

  const ext = file.name.split(".").pop() || "jpg";
  const path = `${componentId}/${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage.from("component-images").upload(path, file, { contentType: file.type });
  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

  const { data: urlData } = supabase.storage.from("component-images").getPublicUrl(path);

  if (isPrimary) {
    await supabase.from("component_images").update({ is_primary: false }).eq("component_id", componentId);
  }

  const { data, error } = await supabase
    .from("component_images")
    .insert({ component_id: componentId, url: urlData.publicUrl, is_primary: isPrimary, alt_text: altText })
    .select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const supabase = getServiceSupabase();
  if (!supabase) return NO_DB;

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const { error } = await supabase.from("component_images").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
