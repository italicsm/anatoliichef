"use client";

import { useEffect, useState } from "react";
import { getDictionary } from "../../lib/dictionary";
import type { Locale } from "../../lib/locale";

const HIDE_AFTER_PX = 40;

type ScrollIndicatorProps = {
  locale: Locale;
  className?: string;
};

/**
 * Visible only at the very top of the page: it invites the first scroll and
 * then gets out of the way, returning when the guest comes back up.
 */
export default function ScrollIndicator({
  locale,
  className = "",
}: ScrollIndicatorProps) {
  const [isVisible, setIsVisible] = useState(true);
  const dictionary = getDictionary(locale);

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY < HIDE_AFTER_PX);

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      aria-hidden={!isVisible}
      className={`flex items-center gap-5 text-zinc-400 transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none ${
        isVisible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      } ${className}`}
    >
      <svg
        width="14"
        height="42"
        viewBox="0 0 14 42"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        aria-hidden="true"
      >
        <path d="M7 0 V40 M1 34 L7 40 L13 34" />
      </svg>

      <span className="text-xs uppercase tracking-[0.3em]">
        {dictionary.hero.scroll}
      </span>
    </div>
  );
}
