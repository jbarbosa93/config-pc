import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/** Client-side Supabase (anon key, read-only via RLS) */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/** Server-side Supabase (service role, full access for admin) */
export function getServiceSupabase() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(supabaseUrl, serviceKey);
}
