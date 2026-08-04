import { appendFile } from "node:fs/promises";
import type { DeliveryResult } from "./notify";
import type { OrderRecord } from "./order";

/**
 * The single place an order gets persisted. Today it appends one JSON object
 * per line to a local file; when Supabase arrives, only the body of this
 * function changes — callers already treat it as fire-and-forget storage.
 *
 * On Vercel the filesystem is read-only, so the write is skipped unless
 * ORDER_LOG_FILE points somewhere writable. Logging must never break an order
 * that was already delivered, hence the swallowed error.
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
