import {
  getOrderEmailFrom,
  getOrderEmailTo,
  getResendKey,
  getTelegramChat,
  getTelegramToken,
} from "./admin/settings";
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

/**
 * Both APIs explain themselves in the response body and say nothing useful in
 * the status code: Resend's 403 covers an unverified domain, a revoked key and
 * a Cloudflare block alike. Carrying the text through is the difference
 * between a fixable message and a number to guess at.
 */
async function describeFailure(response: Response): Promise<string> {
  const body = await response.text().catch(() => "");

  try {
    const parsed: unknown = JSON.parse(body);
    const message =
      parsed && typeof parsed === "object" && "message" in parsed
        ? String((parsed as { message: unknown }).message)
        : "";

    if (message) {
      return `HTTP ${response.status}: ${message}`;
    }
  } catch {
    // Not JSON — fall through to the raw text.
  }

  const trimmed = body.replace(/\s+/g, " ").trim().slice(0, 200);

  return trimmed ? `HTTP ${response.status}: ${trimmed}` : `HTTP ${response.status}`;
}

async function sendTelegram(message: string): Promise<DeliveryResult | null> {
  // Read through the settings layer rather than from the environment: the chef
  // can change where orders land from the panel, without a deploy.
  const [token, chatId] = await Promise.all([
    getTelegramToken(),
    getTelegramChat(),
  ]);

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
        reason: await describeFailure(response),
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
  const [apiKey, to, from] = await Promise.all([
    getResendKey(),
    getOrderEmailTo(),
    getOrderEmailFrom(),
  ]);

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
        reason: await describeFailure(response),
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

/**
 * Sends a sample through the same two senders the real order uses, so a
 * misconfigured destination is found by pressing a button rather than by an
 * order that never arrives.
 */
export async function sendTestNotification(): Promise<DeliveryResult[]> {
  const message = [
    "Перевірка звʼязку.",
    "",
    "Якщо ви це читаєте, замовлення з сайту приходитимуть сюди.",
  ].join("\n");

  const results = (
    await Promise.all([
      sendTelegram(message),
      sendEmail(message, "Перевірка звʼязку — сайт шефа"),
    ])
  ).filter((result): result is DeliveryResult => result !== null);

  return results;
}

/**
 * Chat ids Telegram has seen recently.
 *
 * A bot cannot write to a person by @username — it needs a numeric chat id,
 * and it only learns that id once the person writes to the bot first. This
 * turns that awkward fact into two clicks: write anything to the bot, then
 * press the button.
 *
 * `candidate` is the token currently typed into the form. Looking there first
 * is the whole point: the chat id is needed before anything can be saved, so a
 * button that only worked after saving would ask people to save a
 * configuration they cannot finish yet.
 */
export async function listTelegramChats(
  candidate?: string
): Promise<{ id: string; title: string }[]> {
  const token = candidate?.trim() || (await getTelegramToken());

  if (!token) {
    throw new Error("Спершу вкажіть токен бота.");
  }

  // Ask who the bot is first: a mistyped token and a silent chat produce the
  // same empty list otherwise, and the two need very different fixes.
  const identity = await fetch(`https://api.telegram.org/bot${token}/getMe`);

  if (!identity.ok) {
    throw new Error(
      identity.status === 401
        ? "Telegram не приймає цей токен. Перевірте, чи скопійований він повністю."
        : `Telegram відповів ${identity.status} на getMe.`
    );
  }

  const response = await fetch(
    `https://api.telegram.org/bot${token}/getUpdates?allowed_updates=${encodeURIComponent(
      JSON.stringify(["message", "my_chat_member", "channel_post"])
    )}`
  );

  if (!response.ok) {
    throw new Error(`Telegram відповів ${response.status}`);
  }

  type Chat = {
    id?: number;
    title?: string;
    username?: string;
    first_name?: string;
  };

  const payload = (await response.json()) as {
    result?: {
      message?: { chat?: Chat };
      channel_post?: { chat?: Chat };
      my_chat_member?: { chat?: Chat };
    }[];
  };

  const chats = new Map<string, string>();

  for (const update of payload.result ?? []) {
    // Being added to a group is an update in its own right, and it is the one
    // that arrives before anybody types anything.
    const chat =
      update.message?.chat ??
      update.channel_post?.chat ??
      update.my_chat_member?.chat;

    if (!chat?.id) {
      continue;
    }

    const title =
      chat.title ??
      [chat.first_name, chat.username ? `@${chat.username}` : null]
        .filter(Boolean)
        .join(" ");

    chats.set(String(chat.id), title ?? "");
  }

  return [...chats].map(([id, title]) => ({ id, title }));
}
