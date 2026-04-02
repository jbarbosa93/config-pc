import { getServiceSupabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const supabase = getServiceSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "DB not configured" }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const search = searchParams.get("search");

  // Supabase PostgREST has a hard limit of 1000 rows per request.
  // We paginate internally to retrieve all results.
  const PAGE_SIZE = 1000;
  let allData: unknown[] = [];
  let offset = 0;
  let keepFetching = true;

  while (keepFetching) {
    let query = supabase
      .from("components")
      .select("*, component_images(url, is_primary, alt_text)")
      .eq("active", true)
      .order("popularity_score", { ascending: false })
      .range(offset, offset + PAGE_SIZE - 1);

    if (type && type !== "all") {
      query = query.eq("type", type);
    }

    if (search) {
      query = query.or(
        `name.ilike.%${search}%,brand.ilike.%${search}%,description.ilike.%${search}%`
      );
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      keepFetching = false;
    } else {
      allData = allData.concat(data);
      if (data.length < PAGE_SIZE) {
        keepFetching = false;
      } else {
        offset += PAGE_SIZE;
      }
    }
  }

  return NextResponse.json(allData);
}
