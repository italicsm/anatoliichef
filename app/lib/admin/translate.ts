import { getGeminiKey, getGeminiModel } from "./settings";

/**
 * Machine translation of site copy, triggered by the "Переклад АІ" button.
 *
 * Two decisions worth keeping:
 *
 * Translation happens in the editor, not on render. Rendering would pay for and
 * wait on an API call for every visitor, produce slightly different wording
 * between requests, and — worst of all — leave the chef unable to correct a bad
 * result. Stored values are ordinary editable fields.
 *
 * The result is a draft. Dish names are the hardest thing to machine
 * translate: «Оселедець під шубою» has no honest literal rendering. The prompt
 * says so explicitly, and the chef reviews the fields before saving.
 *
 * The function is deliberately field-agnostic: a dish, a category, a menu and
 * the About block all send a bag of named Ukrainian strings and get the same
 * bag back translated. Adding a translatable field anywhere costs nothing here.
 */

const ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models";

export type TranslationTarget = "en" | "es";

const LANGUAGE_NAMES: Record<TranslationTarget, string> = {
  en: "English",
  es: "Spanish (Spain)",
};

export class TranslationError extends Error {}

/** Field name → text. The same keys come back translated. */
export type TranslationValues = Record<string, string>;

export type TranslationRequest = {
  /** What this text is, so the model picks the right register. */
  context: string;
  fields: TranslationValues;
  targets?: TranslationTarget[];
};

function buildPrompt(
  request: TranslationRequest,
  target: TranslationTarget
): string {
  return [
    `You are translating the website of Anatolii Lukianchuk, a private chef in Barcelona.`,
    `This text is: ${request.context}.`,
    `Translate from Ukrainian into ${LANGUAGE_NAMES[target]}.`,
    ``,
    `Rules:`,
    `- Keep the tone of a premium but understated restaurant. Concise, no marketing superlatives.`,
    `- Use the culinary or everyday term a native speaker would expect in this place.`,
    `- Traditional dishes with no equivalent keep a transliterated name, with a short clarification only if the original had one.`,
    `- Never add ingredients, portions, claims or sentences that are not in the original.`,
    `- Keep paragraph and line breaks exactly as they are.`,
    `- Do not translate the chef's name, phone numbers, emails or links.`,
    `- Reply with a JSON object using exactly these keys: ${Object.keys(
      request.fields
    ).join(", ")}.`,
    ``,
    `Source JSON:`,
    JSON.stringify(request.fields, null, 2),
  ].join("\n");
}

function extractValues(text: string, keys: string[]): TranslationValues | null {
  // The model usually replies with bare JSON, sometimes fenced in markdown.
  const match = text.match(/\{[\s\S]*\}/);

  if (!match) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(match[0]);

    if (typeof parsed !== "object" || parsed === null) {
      return null;
    }

    const record = parsed as Record<string, unknown>;
    const values: TranslationValues = {};

    for (const key of keys) {
      values[key] = typeof record[key] === "string" ? record[key] : "";
    }

    return values;
  } catch {
    return null;
  }
}

async function translateOne(
  request: TranslationRequest,
  target: TranslationTarget,
  key: string,
  model: string
): Promise<TranslationValues> {
  const response = await fetch(
    `${ENDPOINT}/${model}:generateContent?key=${encodeURIComponent(key)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: buildPrompt(request, target) }] }],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: "application/json",
        },
      }),
    }
  );

  if (!response.ok) {
    const detail = await response.text().catch(() => "");

    throw new TranslationError(
      `Gemini відповів ${response.status}. ${detail.slice(0, 200)}`
    );
  }

  const payload: unknown = await response.json();
  const text =
    (payload as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    }).candidates?.[0]?.content?.parts?.[0]?.text ?? "";

  const values = extractValues(text, Object.keys(request.fields));

  if (!values) {
    throw new TranslationError("Не вдалося розібрати відповідь перекладача.");
  }

  return values;
}

export type TranslationOutput = Record<TranslationTarget, TranslationValues>;

/**
 * Translates into every requested target and returns the result — the caller
 * decides what to do with it. Nothing here writes to the database.
 *
 * Empty source fields are dropped before the request: asking a model to
 * translate nothing invites it to invent something.
 */
export async function translateFields(
  request: TranslationRequest
): Promise<TranslationOutput> {
  const fields: TranslationValues = {};

  for (const [name, value] of Object.entries(request.fields)) {
    const trimmed = value.trim();

    if (trimmed) {
      fields[name] = trimmed;
    }
  }

  if (Object.keys(fields).length === 0) {
    throw new TranslationError("Немає українського тексту для перекладу.");
  }

  const key = await getGeminiKey();

  if (!key) {
    throw new TranslationError(
      "Ключ Gemini не заданий. Додайте його в розділі «Налаштування»."
    );
  }

  const model = await getGeminiModel();
  const targets = request.targets ?? (["en", "es"] as TranslationTarget[]);
  const output = {} as TranslationOutput;

  for (const target of targets) {
    output[target] = await translateOne(
      { ...request, fields },
      target,
      key,
      model
    );
  }

  return output;
}
