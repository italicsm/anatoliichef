import { getWriteClient } from "../supabase";
import { AdminError } from "./categories";

/**
 * Secrets the owner can rotate without a deploy.
 *
 * The environment wins when it is set: that is the standard place for a
 * secret, encrypted at rest by the host and never part of a backup of the
 * database. The table is the fallback, so the panel can supply a key on a
 * deployment where nobody can edit environment variables.
 */

export const GEMINI_KEY = "gemini_api_key";
export const GEMINI_MODEL = "gemini_model";

export const DEFAULT_GEMINI_MODEL = "gemini-2.0-flash";

/**
 * Where a new order is sent. Same rule as the Gemini key: the environment wins
 * when it is set, the table is the fallback so the chef can change the
 * destination without a deploy.
 */
export const TELEGRAM_TOKEN = "telegram_bot_token";
export const TELEGRAM_CHAT = "telegram_chat_id";
export const RESEND_KEY = "resend_api_key";
export const ORDER_EMAIL_TO = "order_email_to";
export const ORDER_EMAIL_FROM = "order_email_from";

export type SettingSource = "env" | "database" | null;

/** A secret: whether it exists and where from, never the value itself. */
export type SecretState = { isSet: boolean; source: SettingSource };

/** A plain setting: safe to show, so the panel can prefill the field. */
export type ValueState = { value: string; source: SettingSource };

function requireClient() {
  const client = getWriteClient();

  if (!client) {
    throw new AdminError(
      "Немає доступу до бази: не заданий SUPABASE_SECRET_KEY."
    );
  }

  return client;
}

export async function readSetting(key: string): Promise<string | null> {
  const client = getWriteClient();

  if (!client) {
    return null;
  }

  const { data, error } = await client
    .from("app_settings")
    .select("value")
    .eq("key", key)
    .maybeSingle();

  if (error) {
    console.error(`[settings] could not read "${key}"`, error);

    return null;
  }

  const value = (data as { value: string } | null)?.value ?? null;

  return value && value.trim() ? value : null;
}

export async function writeSetting(
  key: string,
  value: string
): Promise<void> {
  const { error } = await requireClient().from("app_settings").upsert(
    { key, value, updated_at: new Date().toISOString() },
    { onConflict: "key" }
  );

  if (error) {
    throw new AdminError(error.message);
  }
}

export async function clearSetting(key: string): Promise<void> {
  const { error } = await requireClient()
    .from("app_settings")
    .delete()
    .eq("key", key);

  if (error) {
    throw new AdminError(error.message);
  }
}

/** Environment first, database second. Never returned to the browser. */
export async function getGeminiKey(): Promise<string | null> {
  return process.env.GEMINI_API_KEY ?? (await readSetting(GEMINI_KEY));
}

export async function getGeminiModel(): Promise<string> {
  return (
    process.env.GEMINI_MODEL ??
    (await readSetting(GEMINI_MODEL)) ??
    DEFAULT_GEMINI_MODEL
  );
}

/** For the panel: whether a key exists, without ever showing it. */
export async function describeGeminiKey(): Promise<{
  isSet: boolean;
  source: "env" | "database" | null;
}> {
  if (process.env.GEMINI_API_KEY) {
    return { isSet: true, source: "env" };
  }

  const stored = await readSetting(GEMINI_KEY);

  return stored
    ? { isSet: true, source: "database" }
    : { isSet: false, source: null };
}

async function describeSecret(
  key: string,
  fromEnv: string | undefined
): Promise<SecretState> {
  if (fromEnv) {
    return { isSet: true, source: "env" };
  }

  const stored = await readSetting(key);

  return stored
    ? { isSet: true, source: "database" }
    : { isSet: false, source: null };
}

async function describeValue(
  key: string,
  fromEnv: string | undefined
): Promise<ValueState> {
  if (fromEnv) {
    return { value: fromEnv, source: "env" };
  }

  const stored = await readSetting(key);

  return stored
    ? { value: stored, source: "database" }
    : { value: "", source: null };
}

export async function getTelegramToken(): Promise<string | null> {
  return process.env.TELEGRAM_BOT_TOKEN ?? (await readSetting(TELEGRAM_TOKEN));
}

export async function getTelegramChat(): Promise<string | null> {
  return process.env.TELEGRAM_CHAT_ID ?? (await readSetting(TELEGRAM_CHAT));
}

export async function getResendKey(): Promise<string | null> {
  return process.env.RESEND_API_KEY ?? (await readSetting(RESEND_KEY));
}

export async function getOrderEmailTo(): Promise<string | null> {
  return process.env.ORDER_EMAIL_TO ?? (await readSetting(ORDER_EMAIL_TO));
}

export async function getOrderEmailFrom(): Promise<string | null> {
  return process.env.ORDER_EMAIL_FROM ?? (await readSetting(ORDER_EMAIL_FROM));
}

export type NotificationSettings = {
  telegramToken: SecretState;
  telegramChat: ValueState;
  resendKey: SecretState;
  emailTo: ValueState;
  emailFrom: ValueState;
};

/** Everything the settings screen needs, with the secrets kept as booleans. */
export async function describeNotificationSettings(): Promise<NotificationSettings> {
  const [telegramToken, telegramChat, resendKey, emailTo, emailFrom] =
    await Promise.all([
      describeSecret(TELEGRAM_TOKEN, process.env.TELEGRAM_BOT_TOKEN),
      describeValue(TELEGRAM_CHAT, process.env.TELEGRAM_CHAT_ID),
      describeSecret(RESEND_KEY, process.env.RESEND_API_KEY),
      describeValue(ORDER_EMAIL_TO, process.env.ORDER_EMAIL_TO),
      describeValue(ORDER_EMAIL_FROM, process.env.ORDER_EMAIL_FROM),
    ]);

  return { telegramToken, telegramChat, resendKey, emailTo, emailFrom };
}
