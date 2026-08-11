"use client";

import type { CartLineDraft } from "../../lib/cart";
import { useCart } from "../../lib/cart-store";
import { getDictionary } from "../../lib/dictionary";
import { t } from "../../lib/i18n";
import type { Locale } from "../../lib/locale";
import QuantityStepper, { stepperButtonStyles } from "./QuantityStepper";

type AddToCartButtonProps = {
  draft: CartLineDraft;
  locale: Locale;
  className?: string;
};

/**
 * A square + that becomes the quantity stepper once the dish is in the order.
 * Same box, same glyph, same place — pressing it changes what is around the
 * plus rather than replacing it, so nothing on the line moves.
 */
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
      // The name is in the label because the glyph alone would read as "plus
      // button" repeated down the whole menu.
      aria-label={`${dictionary.dish.addToOrder}: ${t(draft.title, locale)}`}
      className={`shrink-0 ${stepperButtonStyles} ${className}`}
    >
      +
    </button>
  );
}
