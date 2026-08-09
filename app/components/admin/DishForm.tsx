"use client";

import { useActionState, useState } from "react";
import type { ActionState } from "../../admin/(panel)/dishes/actions";
import type { AdminDish } from "../../lib/admin/dishes";
import Button from "../ui/Button";
import Spinner from "../ui/Spinner";
import AdminField, { adminLabelStyles } from "./AdminField";
import TranslateButton from "./TranslateButton";

type DishFormProps = {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  submitLabel: string;
  dish?: AdminDish;
};

/**
 * Ukrainian is typed by hand; the other two languages come from the translate
 * button and stay editable afterwards. The translated fields are controlled
 * state so the button can rewrite them.
 */
export default function DishForm({
  action,
  submitLabel,
  dish,
}: DishFormProps) {
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    action,
    {}
  );

  const [titleUk, setTitleUk] = useState(dish?.title.uk ?? "");
  const [descriptionUk, setDescriptionUk] = useState(dish?.description.uk ?? "");
  const [titleEn, setTitleEn] = useState(dish?.title.en ?? "");
  const [descriptionEn, setDescriptionEn] = useState(dish?.description.en ?? "");
  const [titleEs, setTitleEs] = useState(dish?.title.es ?? "");
  const [descriptionEs, setDescriptionEs] = useState(dish?.description.es ?? "");

  return (
    <form action={formAction} className="grid gap-8 md:grid-cols-2">
      {dish ? <input type="hidden" name="id" value={dish.id} /> : null}

      <AdminField
        label="Назва"
        name="titleUk"
        required
        value={titleUk}
        onChange={setTitleUk}
        placeholder="Тартар з яловичини"
      />

      <AdminField
        label="Опис"
        name="descriptionUk"
        multiline
        value={descriptionUk}
        onChange={setDescriptionUk}
        placeholder="Яловичина ручного зрізу, каперси, жовток"
      />

      <TranslateButton
        className="border-t border-zinc-200 pt-8 md:col-span-2"
        context="a dish on a private chef's menu: its name and a one-line description"
        source={{ title: titleUk, description: descriptionUk }}
        onTranslated={({ en, es }) => {
          setTitleEn(en.title ?? "");
          setDescriptionEn(en.description ?? "");
          setTitleEs(es.title ?? "");
          setDescriptionEs(es.description ?? "");
        }}
      />

      <AdminField
        label="Назва англійською"
        name="titleEn"
        value={titleEn}
        onChange={setTitleEn}
        placeholder="Beef tartare"
      />

      <AdminField
        label="Опис англійською"
        name="descriptionEn"
        multiline
        value={descriptionEn}
        onChange={setDescriptionEn}
        placeholder="Hand-cut beef, capers, egg yolk"
      />

      <AdminField
        label="Назва іспанською"
        name="titleEs"
        value={titleEs}
        onChange={setTitleEs}
        placeholder="Tartar de ternera"
      />

      <AdminField
        label="Опис іспанською"
        name="descriptionEs"
        multiline
        value={descriptionEs}
        onChange={setDescriptionEs}
        placeholder="Ternera cortada a cuchillo, alcaparras, yema"
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

        {state.savedAt && !state.error ? (
          <p aria-live="polite" className="mt-4 text-sm text-emerald-700">
            Збережено.
          </p>
        ) : null}
      </div>
    </form>
  );
}
