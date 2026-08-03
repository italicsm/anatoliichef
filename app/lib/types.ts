import type { Translated } from "./i18n";

export type MenuTypeSlug = "furshet" | "banquet";

/**
 * Domain model. Field names and relations map one to one onto the planned
 * Supabase tables: menu_types, categories, dishes, dish_photos, placements.
 *
 * The rule that holds the whole model together: a dish carries no price and
 * no menu membership. Both live on Placement, so the same dish can appear in
 * both menus at different prices without ever being duplicated.
 */

export type MenuType = {
  id: string;
  slug: MenuTypeSlug;
  title: Translated;
  description: Translated;
  photo: string;
  position: number;
};

export type Category = {
  id: string;
  menuTypeId: MenuType["id"];
  title: Translated;
  position: number;
};

export type DishPhoto = {
  id: string;
  url: string;
  alt: Translated;
  position: number;
};

export type Dish = {
  id: string;
  title: Translated;
  description: Translated;
  photos: DishPhoto[];
  isActive: boolean;
};

export type Placement = {
  id: string;
  dishId: Dish["id"];
  categoryId: Category["id"];
  /** Integer cents. See formatPrice. */
  price: number;
  /** Free text such as "100 g" or "1 pc"; null when it does not apply. */
  portion: string | null;
  position: number;
};

/**
 * Read models assembled for rendering. Pages consume these, never the raw
 * tables, so swapping the mock source for Supabase changes no component.
 */

export type PlacedDish = {
  placement: Placement;
  dish: Dish;
};

export type MenuCategory = {
  category: Category;
  dishes: PlacedDish[];
};

export type MenuView = {
  menuType: MenuType;
  categories: MenuCategory[];
};
