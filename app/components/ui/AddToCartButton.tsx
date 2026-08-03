"use client";

import type { CartLineDraft } from "../../lib/cart";
import { useCart } from "../../lib/cart-store";
import { t } from "../../lib/i18n";
import QuantityStepper from "./QuantityStepper";

type AddToCartButtonProps = {
  draft: CartLineDraft;
  className?: string;
};

export default function AddToCartButton({
  draft,
  className = "",
}: AddToCartButtonProps) {
  const { lines, add, setQuantity } = useCart();
  const line = lines.find(
    (candidate) => candidate.placementId === draft.placementId
  );

  if (line) {
    return (
      <QuantityStepper
        quantity={line.quantity}
        onChange={(quantity) => setQuantity(draft.placementId, quantity)}
        label={t(draft.title)}
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
      Add to order
    </button>
  );
}
