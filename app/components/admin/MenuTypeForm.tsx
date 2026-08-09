"use client";

import { useActionState, useState } from "react";
import type { ActionState } from "../../admin/(panel)/menus/actions";
import { updateMenuTypeAction } from "../../admin/(panel)/menus/actions";
import type { AdminMenuTypeDetail } from "../../lib/admin/menu-types";
import Button from "../ui/Button";
import Spinner from "../ui/Spinner";
import AdminField from "./AdminField";
import ImageField from "./ImageField";
import TranslateButton from "./TranslateButton";

export default function MenuTypeForm({
  menuType,
}: {
  menuType: AdminMenuTypeDetail;
}) {
  const [state, action, isPending] = useActionState<ActionState, FormData>(
    updateMenuTypeAction,
    {}
  );

  const [titleUk, setTitleUk] = useState(menuType.title.uk ?? "");
  const [descriptionUk, setDescriptionUk] = useState(
    menuType.description.uk ?? ""
  );
  const [titleEn, setTitleEn] = useState(menuType.title.en ?? "");
  const [descriptionEn, setDescriptionEn] = useState(
    menuType.description.en ?? ""
  );
  const [titleEs, setTitleEs] = useState(menuType.title.es ?? "");
  const [descriptionEs, setDescriptionEs] = useState(
    menuType.description.es ?? ""
  );

  return (
    <form action={action} className="grid gap-8 md:grid-cols-2">
      <input type="hidden" name="id" value={menuType.id} />

      <AdminField
        label="Назва"
        name="titleUk"
        required
        value={titleUk}
        onChange={setTitleUk}
      />

      <AdminField
        label="Опис"
        name="descriptionUk"
        multiline
        value={descriptionUk}
        onChange={setDescriptionUk}
      />

      <TranslateButton
        className="border-t border-zinc-200 pt-8 md:col-span-2"
        context="the name of a menu format offered by a private chef (for example a standing buffet or a seated banquet) and its short description"
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
        placeholder="Buffet"
      />

      <AdminField
        label="Опис англійською"
        name="descriptionEn"
        multiline
        value={descriptionEn}
        onChange={setDescriptionEn}
      />

      <AdminField
        label="Назва іспанською"
        name="titleEs"
        value={titleEs}
        onChange={setTitleEs}
        placeholder="Bufé"
      />

      <AdminField
        label="Опис іспанською"
        name="descriptionEs"
        multiline
        value={descriptionEs}
        onChange={setDescriptionEs}
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
