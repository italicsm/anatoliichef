"use client";

import { useActionState } from "react";
import type { ActionState } from "../actions";

type DeleteDishProps = {
  id: string;
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
};

export default function DeleteDish({ id, action }: DeleteDishProps) {
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    action,
    {}
  );

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={id} />

      <h2 className="text-xs uppercase tracking-[0.25em] text-zinc-500">
        Видалити страву
      </h2>

      <p className="mt-4 max-w-lg text-sm text-zinc-500">
        Видалення можливе, лише коли страва не входить у жодне меню. Щоб
        тимчасово прибрати її з сайту, зніміть галочку «Показувати на сайті» —
        так збережеться історія й розміщення.
      </p>

      <button
        type="submit"
        disabled={isPending}
        className="mt-6 text-xs uppercase tracking-[0.2em] text-zinc-400 transition-colors hover:text-red-700 disabled:opacity-40"
      >
        {isPending ? "Видаляємо" : "Видалити назавжди"}
      </button>

      {state.error ? (
        <p aria-live="polite" className="mt-4 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
