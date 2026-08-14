"use client";

import { useActionState, useEffect, useState } from "react";
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
  const [state, action, isPending] = useActionState<ActionState, FormData>(
    setOrderStatusAction,
    {}
  );

  /**
   * The chosen status lives here, not in the server's prop.
   *
   * With an uncontrolled select the colours only changed once the page had
   * re-rendered with fresh data, and until then the row still showed the old
   * status — the database had already been updated, the screen had not. Holding
   * it locally makes the change immediate and independent of when the refresh
   * lands.
   */
  const [current, setCurrent] = useState<OrderStatus>(status);

  // The server is still the source of truth: if the page comes back with a
  // different value — someone else's edit, or ours having failed — it wins.
  useEffect(() => setCurrent(status), [status]);

  const styles = styleByStatus[current];

  return (
    <form action={action} className="flex flex-wrap items-center gap-3">
      <input type="hidden" name="id" value={id} />

      <span
        aria-hidden="true"
        className={`h-2.5 w-2.5 shrink-0 rounded-full transition-colors ${styles.dot}`}
      />

      {/* Submitting on change keeps it to one click; the button is the
          fallback for browsers with scripting restrictions. */}
      <select
        name="status"
        value={current}
        disabled={isPending}
        onChange={(event) => {
          setCurrent(event.currentTarget.value as OrderStatus);
          event.currentTarget.form?.requestSubmit();
        }}
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
