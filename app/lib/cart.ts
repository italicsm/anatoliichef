import type { Translated } from "./i18n";
import type { MenuTypeSlug, PlacedDish } from "./types";

/**
 * A cart line points at a placement, never at a dish: the same dish costs
 * different money in different menus, so the placement is the only thing that
 * identifies what the guest actually ordered.
 *
 * Title, price and portion are stored as a snapshot so the cart can render
 * without shipping the whole catalogue to the browser. The server must
 * re-read the current price from the database before an order is accepted —
 * a snapshot in localStorage is a display value, never a source of truth.
 */
export type CartLine = {
  placementId: string;
  dishId: string;
  menuSlug: MenuTypeSlug;
  title: Translated;
  portion: string | null;
  /** Integer cents, snapshot taken when the line was added. */
  price: number;
  photo: string | null;
  quantity: number;
};

export type CartLineDraft = Omit<CartLine, "quantity">;

export function toCartLineDraft(
  placedDish: PlacedDish,
  menuSlug: MenuTypeSlug
): CartLineDraft {
  const { dish, placement } = placedDish;
  const [photo] = dish.photos;

  return {
    placementId: placement.id,
    dishId: dish.id,
    menuSlug,
    title: dish.title,
    portion: placement.portion,
    price: placement.price,
    photo: photo?.url ?? null,
  };
}

export function addLine(
  lines: CartLine[],
  draft: CartLineDraft,
  quantity = 1
): CartLine[] {
  const existing = lines.find(
    (line) => line.placementId === draft.placementId
  );

  if (!existing) {
    return [...lines, { ...draft, quantity }];
  }

  return lines.map((line) =>
    line.placementId === draft.placementId
      ? { ...line, quantity: line.quantity + quantity }
      : line
  );
}

export function setLineQuantity(
  lines: CartLine[],
  placementId: string,
  quantity: number
): CartLine[] {
  if (quantity <= 0) {
    return removeLine(lines, placementId);
  }

  return lines.map((line) =>
    line.placementId === placementId ? { ...line, quantity } : line
  );
}

export function removeLine(
  lines: CartLine[],
  placementId: string
): CartLine[] {
  return lines.filter((line) => line.placementId !== placementId);
}

export function cartCount(lines: CartLine[]): number {
  return lines.reduce((total, line) => total + line.quantity, 0);
}

export function cartTotal(lines: CartLine[]): number {
  return lines.reduce((total, line) => total + line.price * line.quantity, 0);
}

export type CartGroup = {
  menuSlug: MenuTypeSlug;
  lines: CartLine[];
};

/** Keeps furshet and banquet visually separate in the cart and in the order. */
export function groupByMenu(lines: CartLine[]): CartGroup[] {
  const order: MenuTypeSlug[] = ["furshet", "banquet"];

  return order
    .map((menuSlug) => ({
      menuSlug,
      lines: lines.filter((line) => line.menuSlug === menuSlug),
    }))
    .filter((group) => group.lines.length > 0);
}
