import type { Translated } from "./i18n";
import {
  categories as mockCategories,
  dishes as mockDishes,
  menuTypes as mockMenuTypes,
  placements as mockPlacements,
} from "./menu-data";
import { getReadClient } from "./supabase";
import type {
  MenuCategory,
  MenuType,
  MenuTypeSlug,
  MenuView,
  PlacedDish,
} from "./types";

/**
 * Every query is async so that the source can change without touching a call
 * site. Supabase is used when it is configured; otherwise the in-memory data
 * keeps the site working, which is what makes the migration reversible.
 */

const byPosition = <T extends { position: number }>(a: T, b: T) =>
  a.position - b.position;

// ------------------------------------------------------------------ row shapes

type MenuTypeRow = {
  id: string;
  slug: string;
  title: Translated;
  description: Translated | null;
  photo: string | null;
  position: number;
};

type DishPhotoRow = {
  id: string;
  url: string;
  alt: Translated | null;
  position: number;
};

type DishRow = {
  id: string;
  title: Translated;
  description: Translated | null;
  is_active: boolean;
  dish_photos: DishPhotoRow[] | null;
};

type PlacementRow = {
  id: string;
  price: number;
  portion: string | null;
  position: number;
  dishes: DishRow | null;
};

type CategoryRow = {
  id: string;
  title: Translated;
  position: number;
  placements: PlacementRow[] | null;
};

const MENU_QUERY = `
  id,
  title,
  position,
  placements (
    id,
    price,
    portion,
    position,
    dishes (
      id,
      title,
      description,
      is_active,
      dish_photos ( id, url, alt, position )
    )
  )
`;

function toMenuType(row: MenuTypeRow): MenuType {
  return {
    id: row.id,
    slug: row.slug as MenuTypeSlug,
    title: row.title,
    description: row.description ?? {},
    photo: row.photo ?? "",
    position: row.position,
  };
}

function toPlacedDish(row: PlacementRow): PlacedDish | null {
  const dish = row.dishes;

  if (!dish || !dish.is_active) {
    return null;
  }

  return {
    placement: {
      id: row.id,
      dishId: dish.id,
      categoryId: "",
      price: row.price,
      portion: row.portion,
      position: row.position,
    },
    dish: {
      id: dish.id,
      title: dish.title,
      description: dish.description ?? {},
      isActive: dish.is_active,
      photos: (dish.dish_photos ?? []).sort(byPosition).map((photo) => ({
        id: photo.id,
        url: photo.url,
        alt: photo.alt ?? dish.title,
        position: photo.position,
      })),
    },
  };
}

// --------------------------------------------------------------- mock fallback

function mockMenuTypeList(): MenuType[] {
  return [...mockMenuTypes].sort(byPosition);
}

function mockMenu(slug: MenuTypeSlug): MenuView | null {
  const menuType = mockMenuTypes.find((candidate) => candidate.slug === slug);

  if (!menuType) {
    return null;
  }

  const categories: MenuCategory[] = mockCategories
    .filter((category) => category.menuTypeId === menuType.id)
    .sort(byPosition)
    .map((category) => {
      const dishes = mockPlacements
        .filter((placement) => placement.categoryId === category.id)
        .sort(byPosition)
        .reduce<PlacedDish[]>((accumulator, placement) => {
          const dish = mockDishes.find(
            (candidate) => candidate.id === placement.dishId
          );

          if (dish?.isActive) {
            accumulator.push({ placement, dish });
          }

          return accumulator;
        }, []);

      return { category, dishes };
    })
    .filter((menuCategory) => menuCategory.dishes.length > 0);

  return { menuType, categories };
}

// ---------------------------------------------------------------------- queries

export async function getMenuTypes(): Promise<MenuType[]> {
  const client = getReadClient();

  if (!client) {
    return mockMenuTypeList();
  }

  const { data, error } = await client
    .from("menu_types")
    .select("id, slug, title, description, photo, position")
    .order("position");

  if (error || !data) {
    console.error("[menu] could not read menu types", error);

    return mockMenuTypeList();
  }

  return (data as MenuTypeRow[]).map(toMenuType);
}

export async function getMenuBySlug(
  slug: MenuTypeSlug
): Promise<MenuView | null> {
  const client = getReadClient();

  if (!client) {
    return mockMenu(slug);
  }

  const { data: menuTypeRow, error: menuTypeError } = await client
    .from("menu_types")
    .select("id, slug, title, description, photo, position")
    .eq("slug", slug)
    .maybeSingle();

  if (menuTypeError) {
    console.error("[menu] could not read the menu type", menuTypeError);

    return mockMenu(slug);
  }

  if (!menuTypeRow) {
    return null;
  }

  const menuType = toMenuType(menuTypeRow as MenuTypeRow);

  const { data: categoryRows, error: categoriesError } = await client
    .from("categories")
    .select(MENU_QUERY)
    .eq("menu_type_id", menuType.id)
    .order("position");

  if (categoriesError || !categoryRows) {
    console.error("[menu] could not read categories", categoriesError);

    return mockMenu(slug);
  }

  const categories: MenuCategory[] = (
    categoryRows as unknown as CategoryRow[]
  )
    .sort(byPosition)
    .map((row) => {
      const dishes = (row.placements ?? [])
        .sort(byPosition)
        .map(toPlacedDish)
        .filter((placed): placed is PlacedDish => placed !== null)
        .map((placed) => ({
          ...placed,
          placement: { ...placed.placement, categoryId: row.id },
        }));

      return {
        category: {
          id: row.id,
          menuTypeId: menuType.id,
          title: row.title,
          position: row.position,
        },
        dishes,
      };
    })
    .filter((menuCategory) => menuCategory.dishes.length > 0);

  return { menuType, categories };
}
