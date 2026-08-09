"use server";

import { revalidatePath } from "next/cache";
import { AdminError } from "../../../lib/admin/categories";
import {
  GEMINI_KEY,
  GEMINI_MODEL,
  clearSetting,
  writeSetting,
} from "../../../lib/admin/settings";

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
