import type { Translated } from "../i18n";
import { getWriteClient } from "../supabase";
import { AdminError } from "./categories";

/** Entity module, same shape as categories.ts and dishes.ts. */

export type AdminMenuTypeDetail = {
  id: string;
  slug: string;
  title: Translated;
  description: Translated;
  photo: string | null;
  position: number;
  categoryCount: number;
};

function requireClient() {
  const client = getWriteClient();

  if (!client) {
    throw new AdminError(
      "Немає доступу до бази: не заданий SUPABASE_SECRET_KEY."
    );
  }

  return client;
}

export async function listMenuTypeDetails(): Promise<AdminMenuTypeDetail[]> {
  const { data, error } = await requireClient()
    .from("menu_types")
    .select("id, slug, title, description, photo, position, categories(id)")
    .order("position");

  if (error) {
    throw new AdminError(error.message);
  }

  type Row = {
    id: string;
    slug: string;
    title: Translated;
    description: Translated | null;
    photo: string | null;
    position: number;
    categories: { id: string }[] | null;
  };

  return ((data ?? []) as unknown as Row[]).map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description ?? {},
    photo: row.photo,
    position: row.position,
    categoryCount: row.categories?.length ?? 0,
  }));
}

export async function getMenuTypePhoto(id: string): Promise<string | null> {
  const { data, error } = await requireClient()
    .from("menu_types")
    .select("photo")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new AdminError(error.message);
  }

  return (data as { photo: string | null } | null)?.photo ?? null;
}

export async function updateMenuType(
  id: string,
  input: {
    title: Translated;
    description: Translated;
    /** undefined keeps the current photo, null clears it. */
    photo?: string | null;
  }
): Promise<void> {
  const patch: Record<string, unknown> = {
    title: input.title,
    description: input.description,
  };

  if (input.photo !== undefined) {
    patch.photo = input.photo;
  }

  const { error } = await requireClient()
    .from("menu_types")
    .update(patch)
    .eq("id", id);

  if (error) {
    throw new AdminError(error.message);
  }
}
