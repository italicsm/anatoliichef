/**
 * Slugs are an internal handle, never shown to the administrator and never
 * part of a public URL — categories are anchored by id and dishes have no page
 * of their own. They exist so that seeds and migrations can reference a row
 * without hardcoding a uuid, which is why they are generated rather than typed.
 */

const UKRAINIAN: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "h", ґ: "g", д: "d", е: "e", є: "ie", ж: "zh",
  з: "z", и: "y", і: "i", ї: "i", й: "i", к: "k", л: "l", м: "m", н: "n",
  о: "o", п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "kh", ц: "ts",
  ч: "ch", ш: "sh", щ: "shch", ь: "", ю: "iu", я: "ia",
};

export function slugify(input: string): string {
  const transliterated = input
    .toLowerCase()
    .split("")
    .map((character) => UKRAINIAN[character] ?? character)
    .join("");

  const slug = transliterated
    // Strip accents left over from Latin scripts: crème -> creme.
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

  // A title made entirely of symbols still needs a handle.
  return slug || `item-${Date.now().toString(36)}`;
}

/** Appends -2, -3 … until the candidate is free. */
export function uniqueSlug(base: string, taken: Set<string>): string {
  if (!taken.has(base)) {
    return base;
  }

  let suffix = 2;

  while (taken.has(`${base}-${suffix}`)) {
    suffix += 1;
  }

  return `${base}-${suffix}`;
}
