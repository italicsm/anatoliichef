"use client";

import { useActionState } from "react";
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

const dotByStatus: Record<OrderStatus, string> = {
  new: "bg-emerald-500",
  confirmed: "bg-zinc-900",
  done: "bg-zinc-300",
  cancelled: "bg-zinc-300",
};

export default function OrderStatusControl({
  id,
  status,
}: OrderStatusControlProps) {
  const [state, action, isPending] = useActionState<ActionState, FormData>(
    setOrderStatusAction,
    {}
  );

  return (
    <form action={action} className="flex flex-wrap items-center gap-3">
      <input type="hidden" name="id" value={id} />

      <span
        aria-hidden="true"
        className={`h-2.5 w-2.5 shrink-0 rounded-full ${dotByStatus[status]}`}
      />

      {/* Submitting on change keeps it to one click; the button is the
          fallback for browsers with scripting restrictions. */}
      <select
        name="status"
        defaultValue={status}
        disabled={isPending}
        onChange={(event) => event.currentTarget.form?.requestSubmit()}
        className="border-b border-zinc-300 bg-transparent py-1 text-xs uppercase tracking-[0.2em] text-zinc-700 outline-none transition-colors focus:border-zinc-900"
      >
        {ORDER_STATUSES.map((option) => (
          <option key={option} value={option}>
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
