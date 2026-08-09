"use client";

import { useActionState } from "react";
import type { ActionState } from "../../admin/(panel)/content/actions";
import Button from "../ui/Button";
import Spinner from "../ui/Spinner";

type ContentFormProps = {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  children: React.ReactNode;
};

/** Shared shell: layout, submit button, pending state, feedback. */
export default function ContentForm({ action, children }: ContentFormProps) {
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    action,
    {}
  );

  return (
    <form action={formAction} className="grid gap-8 md:grid-cols-2">
      {children}

      <div className="md:col-span-2">
        <Button
          type="submit"
          size="sm"
          disabled={isPending}
          className="gap-3 text-xs uppercase tracking-[0.2em]"
        >
          {isPending ? <Spinner /> : null}
          {isPending ? "Зберігаємо" : "Зберегти"}
        </Button>

        {state.error ? (
          <p aria-live="polite" className="mt-4 text-sm text-red-700">
            {state.error}
          </p>
        ) : null}

        {state.savedAt && !state.error ? (
          <p aria-live="polite" className="mt-4 text-sm text-emerald-700">
            Збережено.
          </p>
        ) : null}
      </div>
    </form>
  );
}
