/**
 * Supabase client singleton.
 *
 * Reads VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY from the build
 * environment. Throws on construction if either is missing so a
 * misconfigured deploy fails loud at startup instead of at first
 * request.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error(
    "Missing Supabase env vars. Copy .env.example to .env.local " +
      "and fill VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.",
  );
}

export const supabase: SupabaseClient = createClient(url, anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});
