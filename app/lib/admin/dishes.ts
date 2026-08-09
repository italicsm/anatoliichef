import type { Translated } from "../i18n";
import { getWriteClient } from "../supabase";
import { AdminError } from "./categories";
import { slugify, uniqueSlug } from "./slug";

/**
 * Same shape as lib/admin/categories.ts — an entity per module.
 *
 * A dish here is only its identity: name, description, photos. Where it is
 * sold and for how much lives in placements, which is why this module exposes
 * both and never lets a price be written onto a dish.
 */

export type DishPricing = {
  menuTitle: Translated;
  price: number;
  portion: string | null;
};

export type AdminDish = {
  id: string;
  slug: string;
  title: Translated;
  description: Translated;
  isActive: boolean;
  photoCount: number;
  placementCount: number;
  /** Where the dish is sold and for how much, ordered by menu. */
  pricing: DishPricing[];
};

export type AdminPlacement = {
  id: string;
  categoryId: string;
  categoryTitle: Translated;
  menuTitle: Translated;
  menuSlug: string;
  price: number;
  portion: string | null;
  position: number;
};

export type CategoryOption = {
  id: string;
  title: Translated;
  menuTitle: Translated;
  menuPosition: number;
  position: number;
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

/** "12,50" and "12.5" both mean 1250 cents. Stored as integers, always. */
export function parsePrice(input: string): number | null {
  const normalised = input.trim().replace(",", ".");

  if (!/^\d+(\.\d{1,2})?$/.test(normalised)) {
    return null;
  }

  return Math.round(Number(normalised) * 100);
}

export function formatPriceInput(cents: number): string {
  return (cents / 100).toFixed(2);
}

export async function listDishes(): Promise<AdminDish[]> {
  const { data, error } = await requireClient()
    .from("dishes")
    .select(
      `id, slug, title, description, is_active,
       dish_photos(id),
       placements(price, portion, categories(menu_types(title, position)))`
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw new AdminError(error.message);
  }

  type PricingRow = {
    price: number;
    portion: string | null;
    categories: {
      menu_types: { title: Translated; position: number } | null;
    } | null;
  };

  type Row = {
    id: string;
    slug: string;
    title: Translated;
    description: Translated | null;
    is_active: boolean;
    dish_photos: { id: string }[] | null;
    placements: PricingRow[] | null;
  };

  return ((data ?? []) as unknown as Row[]).map((row) => {
    const placements = row.placements ?? [];

    return {
      id: row.id,
      slug: row.slug,
      title: row.title,
      description: row.description ?? {},
      isActive: row.is_active,
      photoCount: row.dish_photos?.length ?? 0,
      placementCount: placements.length,
      pricing: placements
        .map((placement) => ({
          menuTitle: placement.categories?.menu_types?.title ?? {},
          price: placement.price,
          portion: placement.portion,
          menuPosition: placement.categories?.menu_types?.position ?? 0,
        }))
        .sort((a, b) => a.menuPosition - b.menuPosition)
        .map(({ menuTitle, price, portion }) => ({
          menuTitle,
          price,
          portion,
        })),
    };
  });
}

export async function getDish(id: string): Promise<AdminDish | null> {
  const { data, error } = await requireClient()
    .from("dishes")
    .select("id, slug, title, description, is_active, dish_photos(id), placements(id)")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new AdminError(error.message);
  }

  if (!data) {
    return null;
  }

  const row = data as unknown as {
    id: string;
    slug: string;
    title: Translated;
    description: Translated | null;
    is_active: boolean;
    dish_photos: { id: string }[] | null;
    placements: { id: string }[] | null;
  };

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description ?? {},
    isActive: row.is_active,
    photoCount: row.dish_photos?.length ?? 0,
    placementCount: row.placements?.length ?? 0,
    // The editor renders prices through PlacementEditor, which loads them in
    // full; the summary is only needed by the list.
    pricing: [],
  };
}

export async function createDish(input: {
  title: Translated;
  description: Translated;
}): Promise<string> {
  const client = requireClient();

  const { data: existing } = await client.from("dishes").select("slug");

  const slug = uniqueSlug(
    slugify(input.title.uk ?? input.title.en ?? ""),
    new Set(((existing ?? []) as { slug: string }[]).map((row) => row.slug))
  );

  const { data, error } = await client
    .from("dishes")
    .insert({ slug, title: input.title, description: input.description })
    .select("id")
    .single();

  if (error || !data) {
    throw new AdminError(error?.message ?? "Не вдалося створити страву.");
  }

  return (data as { id: string }).id;
}

/** The slug is left untouched by renames — see lib/admin/slug.ts. */
export async function updateDish(
  id: string,
  input: {
    title: Translated;
    description: Translated;
    isActive: boolean;
  }
): Promise<void> {
  const { error } = await requireClient()
    .from("dishes")
    .update({
      title: input.title,
      description: input.description,
      is_active: input.isActive,
    })
    .eq("id", id);

  if (error) {
    throw new AdminError(error.message);
  }
}

export async function deleteDish(id: string): Promise<void> {
  const client = requireClient();

  // Deleting cascades to placements, which would remove the dish from menus
  // without saying so. Hiding it is almost always what was actually meant.
  const { count, error: countError } = await client
    .from("placements")
    .select("id", { count: "exact", head: true })
    .eq("dish_id", id);

  if (countError) {
    throw new AdminError(countError.message);
  }

  if ((count ?? 0) > 0) {
    throw new AdminError(
      `Страва стоїть у меню (${count}). Приберіть її з меню або сховайте замість видалення.`
    );
  }

  const { error } = await client.from("dishes").delete().eq("id", id);

  if (error) {
    throw new AdminError(error.message);
  }
}

// ---------------------------------------------------------------------- photos

export type AdminDishPhoto = {
  id: string;
  url: string;
  position: number;
};

export async function listDishPhotos(
  dishId: string
): Promise<AdminDishPhoto[]> {
  const { data, error } = await requireClient()
    .from("dish_photos")
    .select("id, url, position")
    .eq("dish_id", dishId)
    .order("position");

  if (error) {
    throw new AdminError(error.message);
  }

  return (data ?? []) as AdminDishPhoto[];
}

export async function addDishPhoto(input: {
  dishId: string;
  url: string;
  alt: Translated;
}): Promise<void> {
  const client = requireClient();

  const { data: last } = await client
    .from("dish_photos")
    .select("position")
    .eq("dish_id", input.dishId)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  const position = ((last as { position: number } | null)?.position ?? 0) + 1;

  const { error } = await client.from("dish_photos").insert({
    dish_id: input.dishId,
    url: input.url,
    alt: input.alt,
    position,
  });

  if (error) {
    throw new AdminError(error.message);
  }
}

export async function getDishPhotoUrl(id: string): Promise<string | null> {
  const { data, error } = await requireClient()
    .from("dish_photos")
    .select("url")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new AdminError(error.message);
  }

  return (data as { url: string } | null)?.url ?? null;
}

export async function deleteDishPhoto(id: string): Promise<void> {
  const { error } = await requireClient()
    .from("dish_photos")
    .delete()
    .eq("id", id);

  if (error) {
    throw new AdminError(error.message);
  }
}

/**
 * The card shows the first photo, so "make main" is simply moving it to
 * position zero rather than a separate flag that could disagree with the order.
 */
export async function makeDishPhotoMain(id: string): Promise<void> {
  const client = requireClient();

  const { data: photo, error } = await client
    .from("dish_photos")
    .select("id, dish_id")
    .eq("id", id)
    .single();

  if (error || !photo) {
    throw new AdminError(error?.message ?? "Фото не знайдено.");
  }

  const row = photo as { id: string; dish_id: string };

  const { data: siblings } = await client
    .from("dish_photos")
    .select("id")
    .eq("dish_id", row.dish_id)
    .neq("id", row.id)
    .order("position");

  await client.from("dish_photos").update({ position: 0 }).eq("id", row.id);

  const rest = (siblings ?? []) as { id: string }[];

  for (const [index, sibling] of rest.entries()) {
    await client
      .from("dish_photos")
      .update({ position: index + 1 })
      .eq("id", sibling.id);
  }
}

// ------------------------------------------------------------------ placements

export async function listPlacements(
  dishId: string
): Promise<AdminPlacement[]> {
  const { data, error } = await requireClient()
    .from("placements")
    .select(
      "id, price, portion, position, category_id, categories(title, menu_types(slug, title, position))"
    )
    .eq("dish_id", dishId);

  if (error) {
    throw new AdminError(error.message);
  }

  type Row = {
    id: string;
    price: number;
    portion: string | null;
    position: number;
    category_id: string;
    categories: {
      title: Translated;
      menu_types: { slug: string; title: Translated; position: number } | null;
    } | null;
  };

  return ((data ?? []) as unknown as Row[])
    .map((row) => ({
      id: row.id,
      categoryId: row.category_id,
      categoryTitle: row.categories?.title ?? {},
      menuTitle: row.categories?.menu_types?.title ?? {},
      menuSlug: row.categories?.menu_types?.slug ?? "",
      price: row.price,
      portion: row.portion,
      position: row.position,
    }))
    .sort((a, b) => a.menuSlug.localeCompare(b.menuSlug));
}

export async function listCategoryOptions(): Promise<CategoryOption[]> {
  const { data, error } = await requireClient()
    .from("categories")
    .select("id, title, position, menu_types(title, position)")
    .order("position");

  if (error) {
    throw new AdminError(error.message);
  }

  type Row = {
    id: string;
    title: Translated;
    position: number;
    menu_types: { title: Translated; position: number } | null;
  };

  return ((data ?? []) as unknown as Row[])
    .map((row) => ({
      id: row.id,
      title: row.title,
      menuTitle: row.menu_types?.title ?? {},
      menuPosition: row.menu_types?.position ?? 0,
      position: row.position,
    }))
    .sort(
      (a, b) => a.menuPosition - b.menuPosition || a.position - b.position
    );
}

export async function addPlacement(input: {
  dishId: string;
  categoryId: string;
  price: number;
  portion: string | null;
}): Promise<void> {
  const client = requireClient();

  const { data: last } = await client
    .from("placements")
    .select("position")
    .eq("category_id", input.categoryId)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  const position = ((last as { position: number } | null)?.position ?? 0) + 1;

  const { error } = await client.from("placements").insert({
    dish_id: input.dishId,
    category_id: input.categoryId,
    price: input.price,
    portion: input.portion,
    position,
  });

  if (error) {
    throw new AdminError(
      error.code === "23505"
        ? "Ця страва вже є в цій категорії."
        : error.message
    );
  }
}

export async function updatePlacement(
  id: string,
  input: { price: number; portion: string | null }
): Promise<void> {
  const { error } = await requireClient()
    .from("placements")
    .update({ price: input.price, portion: input.portion })
    .eq("id", id);

  if (error) {
    throw new AdminError(error.message);
  }
}

export async function removePlacement(id: string): Promise<void> {
  const { error } = await requireClient()
    .from("placements")
    .delete()
    .eq("id", id);

  if (error) {
    throw new AdminError(error.message);
  }
}
