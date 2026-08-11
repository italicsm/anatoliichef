"use server";

import { revalidatePath } from "next/cache";
import { AdminError } from "../../../lib/admin/categories";
import {
  GEMINI_KEY,
  GEMINI_MODEL,
  ORDER_EMAIL_FROM,
  ORDER_EMAIL_TO,
  RESEND_KEY,
  TELEGRAM_CHAT,
  TELEGRAM_TOKEN,
  clearSetting,
  writeSetting,
} from "../../../lib/admin/settings";
import { listTelegramChats, sendTestNotification } from "../../../lib/notify";

export type ActionState = {
  error?: string;
  savedAt?: number;
};

/**
 * The key is write-only from the panel: it can be replaced or cleared, never
 * read back. A secret that can be displayed is a secret that can be copied off
 * a screen or out of a page cache.
 */
export async function saveGeminiSettingsAction(
  _previous: ActionState,
  formData: FormData
): Promise<ActionState> {
  const key = String(formData.get("apiKey") ?? "").trim();
  const model = String(formData.get("model") ?? "").trim();
  const shouldClear = formData.get("clearKey") === "on";

  try {
    if (shouldClear) {
      await clearSetting(GEMINI_KEY);
    } else if (key) {
      await writeSetting(GEMINI_KEY, key);
    }

    if (model) {
      await writeSetting(GEMINI_MODEL, model);
    }

    revalidatePath("/admin/settings");

    return { savedAt: Date.now() };
  } catch (error) {
    return {
      error:
        error instanceof AdminError
          ? error.message
          : "Не вдалося зберегти налаштування.",
    };
  }
}

/**
 * Destinations, not secrets, are prefilled in the form, so an empty field here
 * means "clear it" for the visible values and "leave it alone" for the keys.
 * Anything else would make it impossible to remove an address, or would wipe a
 * token every time the chef edited an e-mail.
 */
export async function saveNotificationsAction(
  _previous: ActionState,
  formData: FormData
): Promise<ActionState> {
  const read = (field: string) => String(formData.get(field) ?? "").trim();

  const telegramToken = read("telegramToken");
  const resendKey = read("resendKey");

  try {
    if (formData.get("clearTelegramToken") === "on") {
      await clearSetting(TELEGRAM_TOKEN);
    } else if (telegramToken) {
      await writeSetting(TELEGRAM_TOKEN, telegramToken);
    }

    if (formData.get("clearResendKey") === "on") {
      await clearSetting(RESEND_KEY);
    } else if (resendKey) {
      await writeSetting(RESEND_KEY, resendKey);
    }

    for (const [field, key] of [
      ["telegramChat", TELEGRAM_CHAT],
      ["emailTo", ORDER_EMAIL_TO],
      ["emailFrom", ORDER_EMAIL_FROM],
    ] as const) {
      const value = read(field);

      if (value) {
        await writeSetting(key, value);
      } else {
        await clearSetting(key);
      }
    }

    revalidatePath("/admin/settings");

    return { savedAt: Date.now() };
  } catch (error) {
    return {
      error:
        error instanceof AdminError
          ? error.message
          : "Не вдалося зберегти налаштування.",
    };
  }
}

export type TestResult = {
  channel: string;
  delivered: boolean;
  reason?: string;
};

/** Sends a sample order through every configured channel. */
export async function sendTestNotificationAction(): Promise<{
  results: TestResult[];
  error?: string;
}> {
  try {
    const results = await sendTestNotification();

    if (results.length === 0) {
      return {
        results: [],
        error:
          "Жоден канал не налаштований: заповніть Telegram або пошту й збережіть.",
      };
    }

    return { results };
  } catch (error) {
    return {
      results: [],
      error:
        error instanceof Error ? error.message : "Не вдалося надіслати.",
    };
  }
}

/** Chat ids the bot has seen, so the chef does not have to find one by hand. */
export async function findTelegramChatsAction(token?: string): Promise<{
  chats: { id: string; title: string }[];
  error?: string;
}> {
  try {
    const chats = await listTelegramChats(token);

    if (chats.length === 0) {
      return {
        chats: [],
        error:
          "Бот не бачить жодного чату. Найнадійніше: відкрийте бота в Telegram особистим чатом і натисніть «Start», тоді спробуйте ще раз. У групі бот отримує повідомлення лише якщо в @BotFather вимкнено режим приватності.",
      };
    }

    return { chats };
  } catch (error) {
    return {
      chats: [],
      error: error instanceof Error ? error.message : "Telegram не відповів.",
    };
  }
}
