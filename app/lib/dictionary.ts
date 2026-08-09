import type { Locale } from "./locale";
import { en } from "./dictionaries/en";
import { es } from "./dictionaries/es";
import { uk, type Dictionary } from "./dictionaries/uk";

export type { Dictionary };

const dictionaries: Record<Locale, Dictionary> = { uk, es, en };

/**
 * Synchronous on purpose: these are three small objects compiled into the
 * bundle, and an async loader would force every component that shows a label
 * to become async for no gain.
 */
export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
