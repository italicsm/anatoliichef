import { appendFile } from "node:fs/promises";
import type { DeliveryResult } from "./notify";
import type { OrderRecord } from "./order";
import { getWriteClient } from "./supabase";

/**
 * The single place an order gets persisted.
 *
 * Supabase first; the JSON line file is the fallback for local development and
 * for the case where the service role key is missing. Either way the failure
 * is swallowed: an order already delivered to Telegram must not be reported as
 * failed because storage was unavailable. That is also why the console line is
 * unconditional — it is the last resort copy.
 */
export async function recordOrder(
  order: OrderRecord,
  deliveries: DeliveryResult[]
): Promise<void> {
  const entry = {
    number: order.number,
    createdAt: order.createdAt.toISOString(),
    contact: order.contact,
    total: order.total,
    lines: order.lines.map((line) => ({
      placementId: line.placementId,
      menuSlug: line.menuSlug,
      dish: line.dishTitle,
      portion: line.portion,
      price: line.price,
      quantity: line.quantity,
    })),
    deliveries,
  };

  console.info(`[order] ${order.number}`, JSON.stringify(entry));

  if (await saveToDatabase(order)) {
    return;
  }

  await saveToFile(entry);
}

async function saveToDatabase(order: OrderRecord): Promise<boolean> {
  const client = getWriteClient();

  if (!client) {
    return false;
  }

  try {
    const { data, error } = await client
      .from("orders")
      .insert({
        kind: order.kind,
        number: order.number,
        created_at: order.createdAt.toISOString(),
        name: order.contact.name,
        phone: order.contact.phone,
        event_date: order.contact.eventDate || null,
        guests: order.contact.guests || null,
        comment: order.contact.comment || null,
        total: order.total,
      })
      .select("id")
      .single();

    if (error || !data) {
      console.error("[order] could not insert the order", error);

      return false;
    }

    // A booking has no lines, and inserting an empty array is a round trip
    // that can only fail.
    if (order.lines.length === 0) {
      return true;
    }

    const { error: itemsError } = await client.from("order_items").insert(
      order.lines.map((line) => ({
        order_id: (data as { id: string }).id,
        placement_id: line.placementId,
        menu_slug: line.menuSlug,
        category_title: line.categoryTitle,
        dish_title: line.dishTitle,
        portion: line.portion,
        price: line.price,
        quantity: line.quantity,
      }))
    );

    if (itemsError) {
      console.error("[order] could not insert order items", itemsError);

      return false;
    }

    return true;
  } catch (error) {
    console.error("[order] database write failed", error);

    return false;
  }
}

async function saveToFile(entry: unknown): Promise<void> {
  const file =
    process.env.ORDER_LOG_FILE ??
    (process.env.NODE_ENV === "development" ? "orders.jsonl" : null);

  if (!file) {
    return;
  }

  try {
    await appendFile(file, `${JSON.stringify(entry)}\n`, "utf8");
  } catch (error) {
    console.error("[order] could not write the log file", error);
  }
}
