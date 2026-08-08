"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  addLine,
  cartCount,
  cartTotal,
  removeLine,
  setLineQuantity,
  type CartLine,
  type CartLineDraft,
} from "./cart";

// Bumped when placement ids changed shape: the mock used readable slugs, the
// database issues uuids, so a cart saved before the migration can no longer be
// priced. A new key drops those carts silently instead of showing the guest an
// order that cannot be placed.
const STORAGE_KEY = "anatolii-cart-v2";

type CartContextValue = {
  lines: CartLine[];
  count: number;
  total: number;
  isOpen: boolean;
  add: (draft: CartLineDraft, quantity?: number) => void;
  setQuantity: (placementId: string, quantity: number) => void;
  remove: (placementId: string) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function readStoredLines(): CartLine[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : null;

    return Array.isArray(parsed) ? (parsed as CartLine[]) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Starting empty on both server and client keeps the first paint identical;
  // the stored cart arrives one tick later.
  useEffect(() => {
    setLines(readStoredLines());
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, isHydrated]);

  const add = useCallback((draft: CartLineDraft, quantity = 1) => {
    setLines((current) => addLine(current, draft, quantity));
  }, []);

  const setQuantity = useCallback((placementId: string, quantity: number) => {
    setLines((current) => setLineQuantity(current, placementId, quantity));
  }, []);

  const remove = useCallback((placementId: string) => {
    setLines((current) => removeLine(current, placementId));
  }, []);

  const clear = useCallback(() => setLines([]), []);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      count: cartCount(lines),
      total: cartTotal(lines),
      isOpen,
      add,
      setQuantity,
      remove,
      clear,
      open,
      close,
    }),
    [lines, isOpen, add, setQuantity, remove, clear, open, close]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}
