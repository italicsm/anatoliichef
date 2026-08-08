import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Two clients, two levels of trust.
 *
 * The read client uses the publishable key. Row level security limits it to
 * selecting the menu, so it is safe in any context.
 *
 * The write client uses the service role key, which bypasses row level
 * security entirely. It must only ever be used inside route handlers and
 * server components — anything it touches is effectively unprotected.
 *
 * Both factories return null when their variables are absent instead of
 * throwing, so the site keeps running on the mock data source before Supabase
 * is configured, and a missing service key degrades to the file log rather
 * than losing an order.
 */

/*
 * Both naming schemes are accepted. Supabase's dashboard now hands out
 * SUPABASE_PUBLISHABLE_KEY / SUPABASE_SECRET_KEY, while its older guides and
 * the NEXT_PUBLIC_ convention are still widespread. Reading either avoids the
 * quiet failure mode where a variable is set under the other name and the site
 * silently keeps serving the mock data.
 *
 * All reads happen on the server, so the NEXT_PUBLIC_ prefix is not required
 * here — it only matters for values a browser bundle needs.
 */
const url =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;

const publishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;

const options = { auth: { persistSession: false } } as const;

let readClient: SupabaseClient | null = null;
let writeClient: SupabaseClient | null = null;

export function getReadClient(): SupabaseClient | null {
  if (!url || !publishableKey) {
    return null;
  }

  readClient ??= createClient(url, publishableKey, options);

  return readClient;
}

export function getWriteClient(): SupabaseClient | null {
  if (!url || !serviceRoleKey) {
    return null;
  }

  writeClient ??= createClient(url, serviceRoleKey, options);

  return writeClient;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(url && publishableKey);
}
