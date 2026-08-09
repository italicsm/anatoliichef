"use client";

import { useCart } from "../../lib/cart-store";
import { getDictionary } from "../../lib/dictionary";
import type { Locale } from "../../lib/locale";

type CartButtonProps = {
  locale: Locale;
  className?: string;
};

/**
 * Icon and count only. The word for "cart" is the longest item in the header
 * in every language and says nothing the basket glyph does not; the accessible
 * name still spells it out for screen readers.
 */
export default function CartButton({ locale, className = "" }: CartButtonProps) {
  const { count, open } = useCart();
  const dictionary = getDictionary(locale);

  return (
    <button
      type="button"
      onClick={open}
      aria-label={`${dictionary.header.openCart} (${count})`}
      className={`flex items-center gap-2 text-zinc-800 transition-colors hover:text-zinc-500 ${className}`}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
      >
        <path d="M5 8h14l-1.2 11.2a1.6 1.6 0 0 1-1.6 1.4H7.8a1.6 1.6 0 0 1-1.6-1.4Z" />
        <path d="M9 8V6.2a3 3 0 0 1 6 0V8" />
      </svg>

      <span className="text-sm tabular-nums tracking-[0.1em] text-zinc-500">
        {count}
      </span>
    </button>
  );
}
