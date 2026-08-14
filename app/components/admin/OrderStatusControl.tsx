"use client";

import { startTransition, useActionState, useOptimistic } from "react";
import {
  setOrderStatusAction,
  type ActionState,
} from "../../admin/(panel)/orders/actions";
import {
  ORDER_STATUSES,
  ORDER_STATUS_LABELS,
  type OrderStatus,
} from "../../lib/admin/orders";

type OrderStatusControlProps = {
  id: string;
  status: OrderStatus;
};

/**
 * Green means it needs attention, blue means it is agreed, grey means it is
 * behind us, dark red means it is off. The dot and the word carry the same
 * colour so the row can be read at a glance down a long list.
 */
const styleByStatus: Record<OrderStatus, { dot: string; text: string }> = {
  new: { dot: "bg-emerald-500", text: "text-emerald-700" },
  confirmed: { dot: "bg-blue-600", text: "text-blue-700" },
  done: { dot: "bg-zinc-400", text: "text-zinc-500" },
  cancelled: { dot: "bg-red-900", text: "text-red-900" },
};

export default function OrderStatusControl({
  id,
  status,
}: OrderStatusControlProps) {
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    setOrderStatusAction,
    {}
  );

  /**
   * Two earlier attempts at this were both wrong, and in opposite ways.
   *
   * An uncontrolled select left the colours showing the previous status until
   * the page came back with fresh data. Copying the prop into `useState` and
   * syncing it with an effect was worse: the effect also fired for the stale
   * render that arrives first, so the word jumped back and then forward again.
   *
   * `useOptimistic` is the mechanism made for this. It shows the chosen value
   * for as long as the action is in flight and then hands control back to the
   * server's value on its own — no effect, no second copy of the truth, and
   * nothing to keep in sync.
   */
  const [shownStatus, showStatus] = useOptimistic<OrderStatus, OrderStatus>(
    status,
    (_previous, next) => next
  );

  function handleChange(next: OrderStatus) {
    const formData = new FormData();

    formData.set("id", id);
    formData.set("status", next);

    // Both calls belong to the same transition: React only accepts an
    // optimistic update from inside one, and pairing them is what ties the
    // shown value to the request that is carrying it.
    startTransition(() => {
      showStatus(next);
      formAction(formData);
    });
  }

  const styles = styleByStatus[shownStatus];

  return (
    <form action={formAction} className="flex flex-wrap items-center gap-3">
      <input type="hidden" name="id" value={id} />

      <span
        aria-hidden="true"
        className={`h-2.5 w-2.5 shrink-0 rounded-full transition-colors ${styles.dot}`}
      />

      {/* Changing it is the whole interaction, so it submits on change; the
          button below is the fallback for browsers with scripting off. */}
      <select
        name="status"
        value={shownStatus}
        aria-busy={isPending}
        onChange={(event) =>
          handleChange(event.currentTarget.value as OrderStatus)
        }
        className={`border-b border-zinc-300 bg-transparent py-1 text-xs uppercase tracking-[0.2em] outline-none transition-colors focus:border-zinc-900 ${styles.text}`}
      >
        {ORDER_STATUSES.map((option) => (
          <option key={option} value={option} className="text-zinc-900">
            {ORDER_STATUS_LABELS[option]}
          </option>
        ))}
      </select>

      <noscript>
        <button
          type="submit"
          className="text-xs uppercase tracking-[0.2em] text-zinc-500"
        >
          Змінити
        </button>
      </noscript>

      {state.error ? (
        <span aria-live="polite" className="text-xs text-red-700">
          {state.error}
        </span>
      ) : null}
    </form>
  );
}
