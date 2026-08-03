import {
  categories,
  dishes,
  menuTypes,
  placements,
} from "./menu-data";
import type {
  MenuCategory,
  MenuType,
  MenuTypeSlug,
  MenuView,
  PlacedDish,
} from "./types";

/**
 * Every query is async so that swapping the mock source for Supabase does not
 * touch a single call site.
 */

const byPosition = <T extends { position: number }>(a: T, b: T) =>
  a.position - b.position;

export async function getMenuTypes(): Promise<MenuType[]> {
  return [...menuTypes].sort(byPosition);
}

export async function getMenuBySlug(
  slug: MenuTypeSlug
): Promise<MenuView | null> {
  const menuType = menuTypes.find((candidate) => candidate.slug === slug);

  if (!menuType) {
    return null;
  }

  const menuCategories: MenuCategory[] = categories
    .filter((category) => category.menuTypeId === menuType.id)
    .sort(byPosition)
    .map((category) => {
      const placedDishes = placements
        .filter((placement) => placement.categoryId === category.id)
        .sort(byPosition)
        .reduce<PlacedDish[]>((accumulator, placement) => {
          const dish = dishes.find(
            (candidate) => candidate.id === placement.dishId
          );

          if (dish?.isActive) {
            accumulator.push({ placement, dish });
          }

          return accumulator;
        }, []);

      return { category, dishes: placedDishes };
    })
    .filter((menuCategory) => menuCategory.dishes.length > 0);

  return { menuType, categories: menuCategories };
}
