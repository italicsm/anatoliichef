"use server";

import {
  TranslationError,
  translateFields,
  type TranslationValues,
} from "../../lib/admin/translate";

export type TranslateResult =
  | { ok: true; en: TranslationValues; es: TranslationValues }
  | { ok: false; error: string };

/**
 * The one entry point behind every "Переклад АІ" button — dishes, categories,
 * menus and the page blocks all call this.
 *
 * It is a server action rather than an API route so the Gemini key stays where
 * it is: read from the database on the server, never sent to the browser. The
 * browser posts Ukrainian text and receives translated text, nothing else.
 *
 * Nothing here writes to the database. The chef sees the result in the form
 * fields and decides whether to keep it before pressing save.
 */
export async function translateFieldsAction(input: {
  context: string;
  fields: TranslationValues;
}): Promise<TranslateResult> {
  try {
    const output = await translateFields({
      context: input.context,
      fields: input.fields,
      targets: ["en", "es"],
    });

    return { ok: true, en: output.en, es: output.es };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof TranslationError
          ? error.message
          : "Не вдалося перекласти.",
    };
  }
}
