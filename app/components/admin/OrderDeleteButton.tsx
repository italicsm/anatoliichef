"use client";

import { useActionState, useEffect, useState } from "react";
import {
  deleteOrderAction,
  type ActionState,
} from "../../admin/(panel)/orders/actions";
import Spinner from "../ui/Spinner";

type OrderDeleteButtonProps = {
  id: string;
  number: string;
};

/**
 * Deleting an order cannot be undone — the row and its items are gone from the
 * database — so it takes two presses rather than one, and the second one names
 * the order out loud. A browser `confirm()` would have done the same job in one
 * line, but it looks nothing like the rest of the panel and cannot be styled.
 *
 * The confirmation resets itself after a few seconds: a button left sitting in
 * the armed state is a trap for the next click that lands near it.
 */
export default function OrderDeleteButton({
  id,
  number,
}: OrderDeleteButtonProps) {
  const [state, action, isPending] = useActionState<ActionState, FormData>(
    deleteOrderAction,
    {}
  );
  const [isArmed, setIsArmed] = useState(false);

  useEffect(() => {
    if (!isArmed) {
      return;
    }

    const timer = setTimeout(() => setIsArmed(false), 5000);

    return () => clearTimeout(timer);
  }, [isArmed]);

  if (!isArmed) {
    return (
      <button
        type="button"
        onClick={() => setIsArmed(true)}
        className="text-xs uppercase tracking-[0.2em] text-zinc-400 transition-colors hover:text-red-700"
      >
        Видалити
        {state.error ? (
          <span aria-live="polite" className="ml-3 text-red-700">
            {state.error}
          </span>
        ) : null}
      </button>
    );
  }

  return (
    <form action={action} className="flex items-center gap-4">
      <input type="hidden" name="id" value={id} />

      <span className="text-xs uppercase tracking-[0.2em] text-zinc-500">
        Видалити {number}?
      </span>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-red-700 transition-opacity hover:opacity-70 disabled:opacity-40"
      >
        {isPending ? <Spinner /> : null}
        Так
      </button>

      <button
        type="button"
        onClick={() => setIsArmed(false)}
        className="text-xs uppercase tracking-[0.2em] text-zinc-400 transition-colors hover:text-zinc-900"
      >
        Ні
      </button>
    </form>
  );
}
