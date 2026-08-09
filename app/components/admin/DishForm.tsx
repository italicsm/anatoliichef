"use client";

import { useActionState } from "react";
import type { ActionState } from "../../admin/(panel)/dishes/actions";
import type { AdminDish } from "../../lib/admin/dishes";
import Button from "../ui/Button";
import Spinner from "../ui/Spinner";
import AdminField, { adminLabelStyles } from "./AdminField";

type DishFormProps = {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  submitLabel: string;
  dish?: AdminDish;
};

export default function DishForm({
  action,
  submitLabel,
  dish,
}: DishFormProps) {
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    action,
    {}
  );

  return (
    <form action={formAction} className="grid gap-8 md:grid-cols-2">
      {dish ? <input type="hidden" name="id" value={dish.id} /> : null}

      <AdminField
        label="Назва"
        name="titleUk"
        required
        defaultValue={dish?.title.uk}
        placeholder="Тартар з яловичини"
      />

      <AdminField
        label="Назва англійською"
        name="titleEn"
        defaultValue={dish?.title.en}
        placeholder="Beef tartare"
      />

      <AdminField
        label="Опис"
        name="descriptionUk"
        multiline
        defaultValue={dish?.description.uk}
        placeholder="Яловичина ручного зрізу, каперси, жовток"
      />

      <AdminField
        label="Опис англійською"
        name="descriptionEn"
        multiline
        defaultValue={dish?.description.en}
        placeholder="Hand-cut beef, capers, egg yolk"
      />

      {dish ? (
        <label className="flex items-center gap-3 self-end pb-2">
          <input
            type="checkbox"
            name="isActive"
            defaultChecked={dish.isActive}
            className="h-4 w-4 accent-zinc-900"
          />
          <span className={adminLabelStyles}>Показувати на сайті</span>
        </label>
      ) : null}

      <div className="md:col-span-2">
        <Button
          type="submit"
          size="sm"
          disabled={isPending}
          className="gap-3 text-xs uppercase tracking-[0.2em]"
        >
          {isPending ? <Spinner /> : null}
          {submitLabel}
        </Button>

        {state.error ? (
          <p aria-live="polite" className="mt-4 text-sm text-red-700">
            {state.error}
          </p>
        ) : null}
      </div>
    </form>
  );
}
