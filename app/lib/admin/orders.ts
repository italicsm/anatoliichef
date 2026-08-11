import { getWriteClient } from "../supabase";
import { AdminError } from "./categories";

/**
 * Orders are read with the service role key: row level security has no policy
 * for them at all, which is what keeps customer names and phone numbers away
 * from the public key.
 */

export const ORDER_STATUSES = [
  "new",
  "confirmed",
  "done",
  "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  new: "Нове",
  confirmed: "Підтверджено",
  done: "Виконано",
  cancelled: "Скасовано",
};

export type AdminOrderItem = {
  id: string;
  menuSlug: string;
  categoryTitle: string;
  dishTitle: string;
  portion: string | null;
  price: number;
  quantity: number;
};

/** A request sent from the Contact section carries no dishes. */
export type AdminOrderKind = "order" | "booking";

export type AdminOrder = {
  id: string;
  kind: AdminOrderKind;
  number: string;
  createdAt: string;
  name: string;
  phone: string;
  eventDate: string | null;
  guests: string | null;
  comment: string | null;
  total: number;
  status: OrderStatus;
  items: AdminOrderItem[];
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

export function isOrderStatus(value: string): value is OrderStatus {
  return (ORDER_STATUSES as readonly string[]).includes(value);
}

export async function listOrders(limit = 100): Promise<AdminOrder[]> {
  const { data, error } = await requireClient()
    .from("orders")
    .select(
      `id, kind, number, created_at, name, phone, event_date, guests, comment, total, status,
       order_items (id, menu_slug, category_title, dish_title, portion, price, quantity)`
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new AdminError(error.message);
  }

  type ItemRow = {
    id: string;
    menu_slug: string;
    category_title: string;
    dish_title: string;
    portion: string | null;
    price: number;
    quantity: number;
  };

  type Row = {
    id: string;
    kind: string;
    number: string;
    created_at: string;
    name: string;
    phone: string;
    event_date: string | null;
    guests: string | null;
    comment: string | null;
    total: number;
    status: string;
    order_items: ItemRow[] | null;
  };

  return ((data ?? []) as unknown as Row[]).map((row) => ({
    id: row.id,
    kind: row.kind === "booking" ? "booking" : "order",
    number: row.number,
    createdAt: row.created_at,
    name: row.name,
    phone: row.phone,
    eventDate: row.event_date,
    guests: row.guests,
    comment: row.comment,
    total: row.total,
    status: isOrderStatus(row.status) ? row.status : "new",
    items: (row.order_items ?? []).map((item) => ({
      id: item.id,
      menuSlug: item.menu_slug,
      categoryTitle: item.category_title,
      dishTitle: item.dish_title,
      portion: item.portion,
      price: item.price,
      quantity: item.quantity,
    })),
  }));
}

export async function setOrderStatus(
  id: string,
  status: OrderStatus
): Promise<void> {
  const { error } = await requireClient()
    .from("orders")
    .update({ status })
    .eq("id", id);

  if (error) {
    throw new AdminError(error.message);
  }
}

export async function countNewOrders(): Promise<number> {
  const { count, error } = await requireClient()
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("status", "new");

  if (error) {
    throw new AdminError(error.message);
  }

  return count ?? 0;
}
