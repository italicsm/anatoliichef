import { categories, dishes, menuTypes, placements } from "./menu-data";
import { t, type Translated } from "./i18n";
import { formatPrice } from "./format";
import { getReadClient } from "./supabase";
import type { MenuTypeSlug } from "./types";

/** What the browser is allowed to send: an id and a quantity. Nothing else. */
export type OrderItemInput = {
  placementId: string;
  quantity: number;
};

export type OrderContactInput = {
  name: string;
  phone: string;
  eventDate?: string;
  guests?: string;
  comment?: string;
};

export type OrderInput = {
  contact: OrderContactInput;
  items: OrderItemInput[];
};

export type ValidationError = {
  field: string;
  message: string;
};

/** A line rebuilt on the server from trusted data. */
export type ResolvedOrderLine = {
  placementId: string;
  menuSlug: MenuTypeSlug;
  categoryTitle: string;
  dishTitle: string;
  portion: string | null;
  price: number;
  quantity: number;
  lineTotal: number;
};

export type ResolvedOrder = {
  contact: OrderContactInput;
  lines: ResolvedOrderLine[];
  total: number;
};

/** A resolved order that has been given an identity. */
export type OrderRecord = ResolvedOrder & {
  number: string;
  createdAt: Date;
};

const TIME_ZONE = "Europe/Madrid";

const dayKeyFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: TIME_ZONE,
  year: "2-digit",
  month: "2-digit",
  day: "2-digit",
});

const dateTimeFormatter = new Intl.DateTimeFormat("uk-UA", {
  timeZone: TIME_ZONE,
  dateStyle: "short",
  timeStyle: "short",
});

let currentDayKey = "";
let currentSequence = 0;

/**
 * #260804-001 — the chef's local day plus a counter, so two orders are never
 * confused over the phone.
 *
 * The counter lives in memory: it restarts when the server restarts, and a
 * second serverless instance would run its own sequence. Acceptable while
 * volume is low; it moves into the database together with order storage.
 */
export function createOrderNumber(now = new Date()): string {
  const dayKey = dayKeyFormatter.format(now).replaceAll("-", "");

  if (dayKey !== currentDayKey) {
    currentDayKey = dayKey;
    currentSequence = 0;
  }

  currentSequence += 1;

  return `#${dayKey}-${String(currentSequence).padStart(3, "0")}`;
}

export function formatOrderDateTime(date: Date): string {
  return dateTimeFormatter.format(date);
}

const MAX_QUANTITY = 500;
const MAX_COMMENT = 2000;

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Parses an untrusted request body. Everything the client sends about money
 * is discarded: prices, titles and portions are read from our own data, so a
 * tampered localStorage cannot change what an order costs.
 */
export function parseOrderInput(body: unknown): {
  input?: OrderInput;
  errors: ValidationError[];
} {
  const errors: ValidationError[] = [];

  if (typeof body !== "object" || body === null) {
    return { errors: [{ field: "body", message: "Malformed request." }] };
  }

  const raw = body as Record<string, unknown>;
  const rawContact = (raw.contact ?? {}) as Record<string, unknown>;

  const name = asString(rawContact.name);
  const phone = asString(rawContact.phone);
  const eventDate = asString(rawContact.eventDate);
  const guests = asString(rawContact.guests);
  const comment = asString(rawContact.comment);

  if (name.length < 2) {
    errors.push({ field: "name", message: "Please enter your name." });
  }

  // Deliberately permissive: international numbers vary too much for a regex
  // to be worth the false rejections.
  if (phone.replace(/\D/g, "").length < 6) {
    errors.push({ field: "phone", message: "Please enter a valid phone." });
  }

  if (comment.length > MAX_COMMENT) {
    errors.push({ field: "comment", message: "Comment is too long." });
  }

  const rawItems = Array.isArray(raw.items) ? raw.items : [];
  const items: OrderItemInput[] = [];

  for (const rawItem of rawItems) {
    if (typeof rawItem !== "object" || rawItem === null) {
      continue;
    }

    const item = rawItem as Record<string, unknown>;
    const placementId = asString(item.placementId);
    const quantity = Number(item.quantity);

    if (
      placementId &&
      Number.isInteger(quantity) &&
      quantity > 0 &&
      quantity <= MAX_QUANTITY
    ) {
      items.push({ placementId, quantity });
    }
  }

  if (items.length === 0) {
    errors.push({ field: "items", message: "Your cart is empty." });
  }

  if (errors.length > 0) {
    return { errors };
  }

  return {
    input: {
      contact: { name, phone, eventDate, guests, comment },
      items,
    },
    errors: [],
  };
}

type PricedPlacement = {
  menuSlug: MenuTypeSlug;
  categoryTitle: string;
  dishTitle: string;
  portion: string | null;
  price: number;
};

/** Authoritative prices, straight from the database. */
async function readPlacementsFromDatabase(
  placementIds: string[]
): Promise<Map<string, PricedPlacement> | null> {
  const client = getReadClient();

  if (!client) {
    return null;
  }

  const { data, error } = await client
    .from("placements")
    .select(
      `id, price, portion,
       dishes ( title, is_active ),
       categories ( title, menu_types ( slug ) )`
    )
    .in("id", placementIds);

  if (error || !data) {
    console.error("[order] could not read placements", error);

    return null;
  }

  type Row = {
    id: string;
    price: number;
    portion: string | null;
    dishes: { title: Translated; is_active: boolean } | null;
    categories:
      | { title: Translated; menu_types: { slug: string } | null }
      | null;
  };

  const priced = new Map<string, PricedPlacement>();

  for (const row of data as unknown as Row[]) {
    const menuSlug = row.categories?.menu_types?.slug;

    if (!row.dishes?.is_active || !row.categories || !menuSlug) {
      continue;
    }

    priced.set(row.id, {
      menuSlug: menuSlug as MenuTypeSlug,
      categoryTitle: t(row.categories.title),
      dishTitle: t(row.dishes.title),
      portion: row.portion,
      price: row.price,
    });
  }

  return priced;
}

/** The same lookup against the in-memory source, used before Supabase exists. */
function readPlacementsFromMock(
  placementIds: string[]
): Map<string, PricedPlacement> {
  const priced = new Map<string, PricedPlacement>();

  for (const id of placementIds) {
    const placement = placements.find((candidate) => candidate.id === id);

    if (!placement) {
      continue;
    }

    const category = categories.find(
      (candidate) => candidate.id === placement.categoryId
    );
    const dish = dishes.find((candidate) => candidate.id === placement.dishId);
    const menuType = menuTypes.find(
      (candidate) => candidate.id === category?.menuTypeId
    );

    if (!category || !dish || !menuType || !dish.isActive) {
      continue;
    }

    priced.set(id, {
      menuSlug: menuType.slug,
      categoryTitle: t(category.title),
      dishTitle: t(dish.title),
      portion: placement.portion,
      price: placement.price,
    });
  }

  return priced;
}

/**
 * Rebuilds the order from authoritative data. Anything the browser claimed
 * about money is discarded here; an item whose placement no longer exists is
 * dropped, because the menu may have changed while the cart sat in
 * localStorage.
 */
export async function resolveOrder(
  input: OrderInput
): Promise<{ order?: ResolvedOrder; errors: ValidationError[] }> {
  const placementIds = input.items.map((item) => item.placementId);

  const priced =
    (await readPlacementsFromDatabase(placementIds)) ??
    readPlacementsFromMock(placementIds);

  const lines: ResolvedOrderLine[] = [];

  for (const item of input.items) {
    const placement = priced.get(item.placementId);

    if (!placement) {
      continue;
    }

    lines.push({
      placementId: item.placementId,
      menuSlug: placement.menuSlug,
      categoryTitle: placement.categoryTitle,
      dishTitle: placement.dishTitle,
      portion: placement.portion,
      price: placement.price,
      quantity: item.quantity,
      lineTotal: placement.price * item.quantity,
    });
  }

  if (lines.length === 0) {
    return {
      errors: [
        {
          field: "items",
          message: "These dishes are no longer available.",
        },
      ],
    };
  }

  const total = lines.reduce((sum, line) => sum + line.lineTotal, 0);

  return { order: { contact: input.contact, lines, total }, errors: [] };
}

/** Plain-text summary shared by Telegram and e-mail. */
export function formatOrderMessage(order: OrderRecord): string {
  const { contact, lines, total } = order;

  const header = [
    `Нове замовлення ${order.number}`,
    formatOrderDateTime(order.createdAt),
    "",
    `Ім'я: ${contact.name}`,
    `Телефон: ${contact.phone}`,
    contact.eventDate ? `Дата: ${contact.eventDate}` : null,
    contact.guests ? `Гостей: ${contact.guests}` : null,
    contact.comment ? `Коментар: ${contact.comment}` : null,
  ].filter(Boolean);

  const menuOrder: MenuTypeSlug[] = ["furshet", "banquet"];
  const menuTitles: Record<MenuTypeSlug, string> = {
    furshet: "Фуршет",
    banquet: "Банкет",
  };

  const body = menuOrder.flatMap((menuSlug) => {
    const menuLines = lines.filter((line) => line.menuSlug === menuSlug);

    if (menuLines.length === 0) {
      return [];
    }

    return [
      "",
      `— ${menuTitles[menuSlug]} —`,
      ...menuLines.map(
        (line) =>
          `${line.dishTitle}${line.portion ? ` (${line.portion})` : ""} × ${
            line.quantity
          } = ${formatPrice(line.lineTotal)}`
      ),
    ];
  });

  return [...header, ...body, "", `Разом: ${formatPrice(total)}`].join("\n");
}
