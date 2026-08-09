"use client";

import type { CartLineDraft } from "../../lib/cart";
import { useCart } from "../../lib/cart-store";
import { getDictionary } from "../../lib/dictionary";
import { t } from "../../lib/i18n";
import type { Locale } from "../../lib/locale";
import QuantityStepper from "./QuantityStepper";

type AddToCartButtonProps = {
  draft: CartLineDraft;
  locale: Locale;
  className?: string;
};

export default function AddToCartButton({
  draft,
  locale,
  className = "",
}: AddToCartButtonProps) {
  const { lines, add, setQuantity } = useCart();
  const dictionary = getDictionary(locale);
  const line = lines.find(
    (candidate) => candidate.placementId === draft.placementId
  );

  if (line) {
    return (
      <QuantityStepper
        quantity={line.quantity}
        onChange={(quantity) => setQuantity(draft.placementId, quantity)}
        label={t(draft.title, locale)}
        locale={locale}
        className={className}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => add(draft)}
      className={`border-b border-zinc-300 pb-1 text-xs uppercase tracking-[0.25em] text-zinc-500 transition-colors hover:border-zinc-900 hover:text-zinc-900 ${className}`}
    >
      {dictionary.dish.addToOrder}
    </button>
  );
}
