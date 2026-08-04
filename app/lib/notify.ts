import type { OrderRecord } from "./order";
import { formatOrderMessage } from "./order";

/**
 * Both providers are plain HTTPS APIs, so no SDK is needed. Every sender
 * reports success or failure instead of throwing: one dead channel must never
 * lose an order that the other channel delivered.
 */

export type DeliveryResult = {
  channel: "telegram" | "email" | "console";
  delivered: boolean;
  reason?: string;
};

async function sendTelegram(message: string): Promise<DeliveryResult | null> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return null;
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          disable_web_page_preview: true,
        }),
      }
    );

    if (!response.ok) {
      return {
        channel: "telegram",
        delivered: false,
        reason: `HTTP ${response.status}`,
      };
    }

    return { channel: "telegram", delivered: true };
  } catch (error) {
    return {
      channel: "telegram",
      delivered: false,
      reason: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

async function sendEmail(
  message: string,
  subject: string
): Promise<DeliveryResult | null> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ORDER_EMAIL_TO;
  const from = process.env.ORDER_EMAIL_FROM;

  if (!apiKey || !to || !from) {
    return null;
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to, subject, text: message }),
    });

    if (!response.ok) {
      return {
        channel: "email",
        delivered: false,
        reason: `HTTP ${response.status}`,
      };
    }

    return { channel: "email", delivered: true };
  } catch (error) {
    return {
      channel: "email",
      delivered: false,
      reason: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function notifyOrder(
  order: OrderRecord
): Promise<DeliveryResult[]> {
  const message = formatOrderMessage(order);
  const subject = `Замовлення ${order.number} — ${order.contact.name}`;

  const results = (
    await Promise.all([sendTelegram(message), sendEmail(message, subject)])
  ).filter((result): result is DeliveryResult => result !== null);

  // Nothing configured yet: keep the order visible instead of silently
  // dropping it, so the form can be tested before any credentials exist.
  if (results.length === 0) {
    console.info(`[order] ${order.number}\n${message}`);

    return [{ channel: "console", delivered: true }];
  }

  return results;
}
