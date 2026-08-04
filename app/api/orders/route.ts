import { NextResponse } from "next/server";
import { notifyOrder } from "../../lib/notify";
import { recordOrder } from "../../lib/order-log";
import { createOrderNumber, parseOrderInput, resolveOrder } from "../../lib/order";

/**
 * Guards against the same submission arriving twice — a double click, a
 * retried fetch, an impatient reload. The client sends a request id; the
 * first request wins and every repeat gets the original order number back
 * instead of creating a second order.
 *
 * In memory, so it does not survive a restart and is not shared between
 * serverless instances. It covers the realistic case (one user, one tab,
 * a few seconds apart) and moves into the database with order storage.
 */
const RECENT_TTL_MS = 10 * 60 * 1000;
const recentRequests = new Map<string, { number: string; at: number }>();

function rememberRequest(requestId: string, number: string): void {
  const now = Date.now();

  for (const [key, value] of recentRequests) {
    if (now - value.at > RECENT_TTL_MS) {
      recentRequests.delete(key);
    }
  }

  recentRequests.set(requestId, { number, at: now });
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { errors: [{ field: "body", message: "Malformed request." }] },
      { status: 400 }
    );
  }

  const requestId =
    typeof body === "object" && body !== null && "requestId" in body
      ? String((body as { requestId: unknown }).requestId)
      : "";

  if (requestId) {
    const seen = recentRequests.get(requestId);

    if (seen) {
      return NextResponse.json(
        { number: seen.number, duplicate: true },
        { status: 200 }
      );
    }
  }

  const { input, errors } = parseOrderInput(body);

  if (!input) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  const { order, errors: resolveErrors } = await resolveOrder(input);

  if (!order) {
    return NextResponse.json({ errors: resolveErrors }, { status: 409 });
  }

  const record = {
    ...order,
    number: createOrderNumber(),
    createdAt: new Date(),
  };

  const deliveries = await notifyOrder(record);
  const delivered = deliveries.some((delivery) => delivery.delivered);

  await recordOrder(record, deliveries);

  if (!delivered) {
    console.error("[order] every channel failed", record.number, deliveries);

    return NextResponse.json(
      {
        errors: [
          {
            field: "form",
            message: "We could not send your order. Please call instead.",
          },
        ],
      },
      { status: 502 }
    );
  }

  if (requestId) {
    rememberRequest(requestId, record.number);
  }

  return NextResponse.json(
    { number: record.number, total: record.total },
    { status: 201 }
  );
}
