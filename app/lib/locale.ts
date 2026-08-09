/**
 * Three languages, all of them prefixed: /uk, /es, /en. Ukrainian is the
 * default, so a request without a prefix is redirected to /uk rather than
 * served silently — one page, one address, no duplicate content for search.
 */

export const LOCALES = ["uk", "es", "en"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "uk";

/** Labels for the switcher, in their own language rather than translated. */
export const LOCALE_LABELS: Record<Locale, string> = {
  uk: "UA",
  es: "ES",
  en: "EN",
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/**
 * Swaps the locale segment of a path, keeping the rest intact, so the
 * switcher lands on the same page in another language instead of the home
 * page.
 */
export function withLocale(pathname: string, locale: Locale): string {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length > 0 && isLocale(segments[0])) {
    segments[0] = locale;
  } else {
    segments.unshift(locale);
  }

  return `/${segments.join("/")}`;
}

/** Reads the locale out of a pathname, falling back to the default. */
export function localeFromPathname(pathname: string): Locale {
  const [first] = pathname.split("/").filter(Boolean);

  return first && isLocale(first) ? first : DEFAULT_LOCALE;
}

/**
 * Picks the best match from an Accept-Language header. Only used for the
 * first visit to a bare path; after that the address itself decides.
 */
export function matchLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) {
    return DEFAULT_LOCALE;
  }

  const ranked = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag, quality] = part.trim().split(";q=");

      return { tag: tag.toLowerCase(), quality: Number(quality ?? 1) };
    })
    .sort((a, b) => b.quality - a.quality);

  for (const { tag } of ranked) {
    const base = tag.split("-")[0];

    if (isLocale(base)) {
      return base;
    }
  }

  return DEFAULT_LOCALE;
}
