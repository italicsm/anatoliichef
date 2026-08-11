"use client";

import { getDictionary } from "../../lib/dictionary";
import type { Locale } from "../../lib/locale";

type QuantityStepperProps = {
  quantity: number;
  onChange: (quantity: number) => void;
  label: string;
  locale: Locale;
  className?: string;
};

/**
 * Exported so the add button can wear the same square. Pressing it turns it
 * into this stepper, and the + keeps its size and position through that change
 * instead of jumping.
 */
export const stepperButtonStyles =
  "flex h-7 w-7 items-center justify-center border border-zinc-200 text-zinc-500 transition-colors hover:border-zinc-900 hover:text-zinc-900";

export default function QuantityStepper({
  quantity,
  onChange,
  label,
  locale,
  className = "",
}: QuantityStepperProps) {
  const dictionary = getDictionary(locale);
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <button
        type="button"
        onClick={() => onChange(quantity - 1)}
        aria-label={`${dictionary.dish.removeOne}: ${label}`}
        className={stepperButtonStyles}
      >
        −
      </button>

      <span
        aria-live="polite"
        className="min-w-5 text-center text-sm tabular-nums text-zinc-900"
      >
        {quantity}
      </span>

      <button
        type="button"
        onClick={() => onChange(quantity + 1)}
        aria-label={`${dictionary.dish.addOne}: ${label}`}
        className={stepperButtonStyles}
      >
        +
      </button>
    </div>
  );
}
