import type { Translated } from "./i18n";
import type { MenuTypeSlug } from "./types";

/**
 * Short labels for client components that must not import the catalogue —
 * pulling menu-data into the browser bundle would ship every dish just to
 * print two headings. Once menu types live in Supabase these come from there.
 */
export const menuTypeLabels: Record<MenuTypeSlug, Translated> = {
  furshet: { uk: "Фуршет", en: "Фуршет" },
  banquet: { uk: "Банкет", en: "Банкет" },
};
