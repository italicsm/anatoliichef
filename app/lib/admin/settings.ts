import { getWriteClient } from "../supabase";
import { AdminError } from "./categories";

/**
 * Secrets the owner can rotate without a deploy.
 *
 * The environment wins when it is set: that is the standard place for a
 * secret, encrypted at rest by the host and never part of a backup of the
 * database. The table is the fallback, so the panel can supply a key on a
 * deployment where nobody can edit environment variables.
 */

export const GEMINI_KEY = "gemini_api_key";
export const GEMINI_MODEL = "gemini_model";

export const DEFAULT_GEMINI_MODEL = "gemini-2.0-flash";

function requireClient() {
  const client = getWriteClient();

  if (!client) {
    throw new AdminError(
      "Немає доступу до бази: не заданий SUPABASE_SECRET_KEY."
    );
  }

  return client;
}

export async function readSetting(key: string): Promise<string | null> {
  const client = getWriteClient();

  if (!client) {
    return null;
  }

  const { data, error } = await client
    .from("app_settings")
    .select("value")
    .eq("key", key)
    .maybeSingle();

  if (error) {
    console.error(`[settings] could not read "${key}"`, error);

    return null;
  }

  const value = (data as { value: string } | null)?.value ?? null;

  return value && value.trim() ? value : null;
}

export async function writeSetting(
  key: string,
  value: string
): Promise<void> {
  const { error } = await requireClient().from("app_settings").upsert(
    { key, value, updated_at: new Date().toISOString() },
    { onConflict: "key" }
  );

  if (error) {
    throw new AdminError(error.message);
  }
}

export async function clearSetting(key: string): Promise<void> {
  const { error } = await requireClient()
    .from("app_settings")
    .delete()
    .eq("key", key);

  if (error) {
    throw new AdminError(error.message);
  }
}

/** Environment first, database second. Never returned to the browser. */
export async function getGeminiKey(): Promise<string | null> {
  return process.env.GEMINI_API_KEY ?? (await readSetting(GEMINI_KEY));
}

export async function getGeminiModel(): Promise<string> {
  return (
    process.env.GEMINI_MODEL ??
    (await readSetting(GEMINI_MODEL)) ??
    DEFAULT_GEMINI_MODEL
  );
}

/** For the panel: whether a key exists, without ever showing it. */
export async function describeGeminiKey(): Promise<{
  isSet: boolean;
  source: "env" | "database" | null;
}> {
  if (process.env.GEMINI_API_KEY) {
    return { isSet: true, source: "env" };
  }

  const stored = await readSetting(GEMINI_KEY);

  return stored
    ? { isSet: true, source: "database" }
    : { isSet: false, source: null };
}
