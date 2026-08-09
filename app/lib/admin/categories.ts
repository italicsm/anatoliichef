import type { Translated } from "../i18n";
import { getWriteClient } from "../supabase";
import { slugify, uniqueSlug } from "./slug";

/**
 * Data access for one entity, kept in its own module. The next screens get
 * lib/admin/dishes.ts and lib/admin/menu-types.ts with the same shape, so an
 * entity is added by adding a file rather than by growing a shared one.
 *
 * Everything here runs through the service role client, which is only ever
 * reachable from server actions and route handlers.
 */

export type AdminCategory = {
  id: string;
  menuTypeId: string;
  slug: string;
  title: Translated;
  photo: string | null;
  position: number;
  dishCount: number;
};

export type AdminMenuType = {
  id: string;
  slug: string;
  title: Translated;
  position: number;
};

export class AdminError extends Error {}

function requireClient() {
  const client = getWriteClient();

  if (!client) {
    throw new AdminError(
      "Немає доступу до бази: не заданий SUPABASE_SECRET_KEY."
    );
  }

  return client;
}

export async function listMenuTypes(): Promise<AdminMenuType[]> {
  const { data, error } = await requireClient()
    .from("menu_types")
    .select("id, slug, title, position")
    .order("position");

  if (error) {
    throw new AdminError(error.message);
  }

  return (data ?? []) as AdminMenuType[];
}

export async function listCategories(
  menuTypeId: string
): Promise<AdminCategory[]> {
  const { data, error } = await requireClient()
    .from("categories")
    .select("id, menu_type_id, slug, title, photo, position, placements(id)")
    .eq("menu_type_id", menuTypeId)
    .order("position");

  if (error) {
    throw new AdminError(error.message);
  }

  type Row = {
    id: string;
    menu_type_id: string;
    slug: string;
    title: Translated;
    photo: string | null;
    position: number;
    placements: { id: string }[] | null;
  };

  return ((data ?? []) as unknown as Row[]).map((row) => ({
    id: row.id,
    menuTypeId: row.menu_type_id,
    slug: row.slug,
    title: row.title,
    photo: row.photo,
    position: row.position,
    dishCount: row.placements?.length ?? 0,
  }));
}

export async function getCategoryPhoto(id: string): Promise<string | null> {
  const { data, error } = await requireClient()
    .from("categories")
    .select("photo")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new AdminError(error.message);
  }

  return (data as { photo: string | null } | null)?.photo ?? null;
}

export async function createCategory(input: {
  menuTypeId: string;
  title: Translated;
}): Promise<void> {
  const client = requireClient();

  const { data: siblings } = await client
    .from("categories")
    .select("slug, position")
    .eq("menu_type_id", input.menuTypeId);

  const rows = (siblings ?? []) as { slug: string; position: number }[];

  // New categories land at the end rather than fighting for position 1.
  const position =
    rows.reduce((max, row) => Math.max(max, row.position), 0) + 1;

  const slug = uniqueSlug(
    slugify(input.title.uk ?? input.title.en ?? ""),
    new Set(rows.map((row) => row.slug))
  );

  const { error } = await client.from("categories").insert({
    menu_type_id: input.menuTypeId,
    slug,
    title: input.title,
    position,
  });

  if (error) {
    throw new AdminError(error.message);
  }
}

/**
 * Renaming leaves the slug alone on purpose: it is an internal handle, and
 * churning it would break any seed or migration that refers to the row.
 */
export async function updateCategory(
  id: string,
  input: { title: Translated; photo?: string | null }
): Promise<void> {
  const patch: Record<string, unknown> = { title: input.title };

  if (input.photo !== undefined) {
    patch.photo = input.photo;
  }

  const { error } = await requireClient()
    .from("categories")
    .update(patch)
    .eq("id", id);

  if (error) {
    throw new AdminError(error.message);
  }
}

export async function deleteCategory(id: string): Promise<void> {
  const client = requireClient();

  // Deleting a category cascades to its placements, which would silently drop
  // dishes from the menu. Refusing while it is populated makes that explicit.
  const { count, error: countError } = await client
    .from("placements")
    .select("id", { count: "exact", head: true })
    .eq("category_id", id);

  if (countError) {
    throw new AdminError(countError.message);
  }

  if ((count ?? 0) > 0) {
    throw new AdminError(
      `Спершу приберіть страви з категорії: їх там ${count}.`
    );
  }

  const { error } = await client.from("categories").delete().eq("id", id);

  if (error) {
    throw new AdminError(error.message);
  }
}

/** Swaps a category with its neighbour, so ordering needs no drag and drop. */
export async function moveCategory(
  id: string,
  direction: "up" | "down"
): Promise<void> {
  const client = requireClient();

  const { data: current, error } = await client
    .from("categories")
    .select("id, menu_type_id, position")
    .eq("id", id)
    .single();

  if (error || !current) {
    throw new AdminError(error?.message ?? "Категорію не знайдено.");
  }

  const row = current as { id: string; menu_type_id: string; position: number };

  const { data: neighbour } = await client
    .from("categories")
    .select("id, position")
    .eq("menu_type_id", row.menu_type_id)
    [direction === "up" ? "lt" : "gt"]("position", row.position)
    .order("position", { ascending: direction !== "up" })
    .limit(1)
    .maybeSingle();

  if (!neighbour) {
    return;
  }

  const other = neighbour as { id: string; position: number };

  await client
    .from("categories")
    .update({ position: other.position })
    .eq("id", row.id);

  await client
    .from("categories")
    .update({ position: row.position })
    .eq("id", other.id);
}
