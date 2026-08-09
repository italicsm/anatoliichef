"use client";

import { useActionState } from "react";
import type { ActionState } from "../../admin/(panel)/menus/actions";
import { updateMenuTypeAction } from "../../admin/(panel)/menus/actions";
import type { AdminMenuTypeDetail } from "../../lib/admin/menu-types";
import Button from "../ui/Button";
import Spinner from "../ui/Spinner";
import AdminField from "./AdminField";
import ImageField from "./ImageField";

export default function MenuTypeForm({
  menuType,
}: {
  menuType: AdminMenuTypeDetail;
}) {
  const [state, action, isPending] = useActionState<ActionState, FormData>(
    updateMenuTypeAction,
    {}
  );

  return (
    <form action={action} className="grid gap-8 md:grid-cols-2">
      <input type="hidden" name="id" value={menuType.id} />

      <AdminField
        label="Назва"
        name="titleUk"
        required
        defaultValue={menuType.title.uk}
      />

      <AdminField
        label="Назва англійською"
        name="titleEn"
        defaultValue={menuType.title.en}
      />

      <AdminField
        label="Опис"
        name="descriptionUk"
        multiline
        defaultValue={menuType.description.uk}
      />

      <AdminField
        label="Опис англійською"
        name="descriptionEn"
        multiline
        defaultValue={menuType.description.en}
      />

      <div className="md:col-span-2">
        <ImageField
          label="Фото меню"
          name="photo"
          currentUrl={menuType.photo}
          removeName="removePhoto"
          hint="Показується на головній сторінці, у картці цього меню."
        />
      </div>

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
