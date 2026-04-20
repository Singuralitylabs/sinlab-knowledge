import { createBrowserClient } from "@supabase/ssr";
import { resolveSupabaseEnv } from "./env";

export function createClientSupabaseClient() {
  const { url, anonKey } = resolveSupabaseEnv();
  return createBrowserClient(url, anonKey);
}
