"use client";

import { useCart } from "../../lib/cart-store";

type CartButtonProps = {
  className?: string;
};

export default function CartButton({ className = "" }: CartButtonProps) {
  const { count, open } = useCart();

  return (
    <button
      type="button"
      onClick={open}
      aria-label={`Open cart, ${count} items`}
      className={`text-sm uppercase tracking-[0.2em] text-zinc-800 transition-colors hover:text-zinc-500 ${className}`}
    >
      Cart
      <span className="ml-2 tabular-nums text-zinc-500">({count})</span>
    </button>
  );
}
