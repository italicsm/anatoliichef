export type Locale = "ES" | "EN" | "UA";

type LanguageSwitcherProps = {
  locales?: readonly Locale[];
  activeLocale?: Locale;
  className?: string;
};

const defaultLocales: readonly Locale[] = ["ES", "EN", "UA"];

export default function LanguageSwitcher({
  locales = defaultLocales,
  activeLocale = "ES",
  className = "",
}: LanguageSwitcherProps) {
  return (
    <nav
      aria-label="Language"
      className={`flex items-center gap-4 text-xs uppercase tracking-[0.2em] ${className}`}
    >
      {locales.map((locale) => (
        <span
          key={locale}
          aria-current={locale === activeLocale ? "true" : undefined}
          className={
            locale === activeLocale
              ? "text-zinc-900"
              : "text-zinc-400 transition hover:text-zinc-900"
          }
        >
          {locale}
        </span>
      ))}
    </nav>
  );
}
