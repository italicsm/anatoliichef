import { getWriteClient } from "../supabase";
import { AdminError } from "./categories";

/** Entity module for editable page blocks. */

function requireClient() {
  const client = getWriteClient();

  if (!client) {
    throw new AdminError(
      "Немає доступу до бази: не заданий SUPABASE_SECRET_KEY."
    );
  }

  return client;
}

export async function readContentBlock(
  key: string
): Promise<Record<string, unknown>> {
  const { data, error } = await requireClient()
    .from("site_content")
    .select("data")
    .eq("key", key)
    .maybeSingle();

  if (error) {
    throw new AdminError(error.message);
  }

  return (data as { data: Record<string, unknown> } | null)?.data ?? {};
}

/**
 * Merges into the stored object rather than replacing it, so a form that only
 * knows about some of the fields cannot wipe the rest.
 */
export async function writeContentBlock(
  key: string,
  patch: Record<string, unknown>
): Promise<void> {
  const current = await readContentBlock(key);

  const { error } = await requireClient().from("site_content").upsert(
    {
      key,
      data: { ...current, ...patch },
      updated_at: new Date().toISOString(),
    },
    { onConflict: "key" }
  );

  if (error) {
    throw new AdminError(error.message);
  }
}
