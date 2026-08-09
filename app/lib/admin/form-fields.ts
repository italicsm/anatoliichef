import type { Translated } from "../i18n";

/**
 * Reads one translatable field out of a form: `titleUk`, `titleEn`, `titleEs`.
 *
 * An empty language is left out rather than filled with the Ukrainian text.
 * Copying the source into `en` looks like a translation to every reader of the
 * row — it is how «Фуршет» ended up as the English name of the buffet menu —
 * and it hides from the panel which fields still need work. A missing key
 * degrades to Ukrainian at render time anyway, and that at least is honest.
 */
export function readTranslated(formData: FormData, field: string): Translated {
  const read = (suffix: string) =>
    String(formData.get(`${field}${suffix}`) ?? "").trim();

  const uk = read("Uk");
  const en = read("En");
  const es = read("Es");

  return {
    ...(uk ? { uk } : {}),
    ...(en ? { en } : {}),
    ...(es ? { es } : {}),
  };
}
