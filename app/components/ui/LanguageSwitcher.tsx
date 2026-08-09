"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LOCALES, LOCALE_LABELS, withLocale, type Locale } from "../../lib/locale";

type LanguageSwitcherProps = {
  locale: Locale;
  /** Header mode: drops the current language, which the page already shows. */
  compact?: boolean;
  className?: string;
};

/**
 * Keeps the reader on the same page in another language: the current path is
 * reused with its locale segment swapped, instead of sending everyone back to
 * the home page.
 *
 * In compact mode only the alternatives are listed. The reader can see which
 * language they are reading; what they need from this control is the way out
 * of it, and the header has no room for a label that answers a question nobody
 * asked. The mobile panel has the room, so it keeps the full row.
 */
export default function LanguageSwitcher({
  locale,
  compact = false,
  className = "",
}: LanguageSwitcherProps) {
  const pathname = usePathname();
  const options = compact
    ? LOCALES.filter((option) => option !== locale)
    : LOCALES;

  return (
    <nav
      aria-label="Language"
      className={`flex items-center gap-4 text-sm uppercase tracking-[0.2em] ${className}`}
    >
      {options.map((option) => (
        <Link
          key={option}
          href={withLocale(pathname, option)}
          hrefLang={option}
          aria-current={option === locale ? "true" : undefined}
          className={
            option === locale
              ? "text-zinc-900"
              : "text-zinc-500 transition-colors hover:text-zinc-900"
          }
        >
          {LOCALE_LABELS[option]}
        </Link>
      ))}
    </nav>
  );
}
