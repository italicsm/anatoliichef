export type ContentLocale = "uk" | "en" | "es";

/**
 * Mirrors the JSONB columns planned for Supabase: one row per entity,
 * one key per language. Adding a language never touches the schema.
 */
export type Translated = Partial<Record<ContentLocale, string>>;

/**
 * The site still renders English copy. Flip this to "uk" once the
 * Ukrainian texts arrive; nothing else needs to change.
 */
export const DEFAULT_LOCALE: ContentLocale = "en";

/**
 * The panel is used by the chef, so it always shows Ukrainian regardless of
 * what the public site is currently rendering.
 */
export const ADMIN_LOCALE: ContentLocale = "uk";

const FALLBACK_ORDER: ContentLocale[] = ["uk", "en", "es"];

/**
 * Reads a translated value, falling back to the first language that has one
 * so a missing translation degrades to visible text instead of an empty node.
 */
export function t(
  value: Translated,
  locale: ContentLocale = DEFAULT_LOCALE
): string {
  const preferred = value[locale];

  if (preferred) {
    return preferred;
  }

  for (const fallback of FALLBACK_ORDER) {
    const candidate = value[fallback];

    if (candidate) {
      return candidate;
    }
  }

  return "";
}
