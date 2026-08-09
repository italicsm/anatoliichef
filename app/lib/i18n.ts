import type { Locale } from "./locale";

/** Content and interface share one set of languages; see lib/locale.ts. */
export type ContentLocale = Locale;

/**
 * Mirrors the JSONB columns planned for Supabase: one row per entity,
 * one key per language. Adding a language never touches the schema.
 */
export type Translated = Partial<Record<ContentLocale, string>>;

/**
 * Only a fallback for code paths that have no request context — pages read
 * the locale from the address instead.
 */
export const DEFAULT_LOCALE: ContentLocale = "uk";

/**
 * The panel is used by the chef, so it always shows Ukrainian regardless of
 * what the public site is currently rendering.
 */
export const ADMIN_LOCALE: ContentLocale = "uk";

const FALLBACK_ORDER: ContentLocale[] = ["uk", "es", "en"];

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
