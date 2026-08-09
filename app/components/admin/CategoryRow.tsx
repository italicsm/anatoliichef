"use client";

import { useState } from "react";
import type { AdminCategory } from "../../lib/admin/categories";
import { ADMIN_LOCALE, t } from "../../lib/i18n";
import {
  deleteCategoryAction,
  moveCategoryAction,
  updateCategoryAction,
} from "../../admin/(panel)/categories/actions";
import CategoryForm from "./CategoryForm";

type CategoryRowProps = {
  category: AdminCategory;
  isFirst: boolean;
  isLast: boolean;
};

const iconButton =
  "flex h-7 w-7 items-center justify-center border border-zinc-200 text-zinc-500 transition-colors hover:border-zinc-900 hover:text-zinc-900 disabled:opacity-30 disabled:hover:border-zinc-200 disabled:hover:text-zinc-500";

export default function CategoryRow({
  category,
  isFirst,
  isLast,
}: CategoryRowProps) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <li className="border-b border-zinc-200 py-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-zinc-900">{t(category.title, ADMIN_LOCALE)}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-zinc-400">
            страв: {category.dishCount}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <form action={moveCategoryAction}>
            <input type="hidden" name="id" value={category.id} />
            <input type="hidden" name="direction" value="up" />
            <button
              type="submit"
              disabled={isFirst}
              aria-label="Підняти вище"
              className={iconButton}
            >
              ↑
            </button>
          </form>

          <form action={moveCategoryAction}>
            <input type="hidden" name="id" value={category.id} />
            <input type="hidden" name="direction" value="down" />
            <button
              type="submit"
              disabled={isLast}
              aria-label="Опустити нижче"
              className={iconButton}
            >
              ↓
            </button>
          </form>

          <button
            type="button"
            onClick={() => setIsEditing((current) => !current)}
            className="text-xs uppercase tracking-[0.2em] text-zinc-500 transition-colors hover:text-zinc-900"
          >
            {isEditing ? "Скасувати" : "Змінити"}
          </button>

          <DeleteButton id={category.id} />
        </div>
      </div>

      {isEditing ? (
        <div className="mt-6">
          <CategoryForm
            action={updateCategoryAction}
            submitLabel="Зберегти"
            hidden={{ id: category.id }}
            defaults={{
              titleUk: category.title.uk ?? "",
              titleEn: category.title.en ?? "",
              titleEs: category.title.es ?? "",
            }}
            photoUrl={category.photo}
            withPhoto
            onSaved={() => setIsEditing(false)}
          />
        </div>
      ) : null}
    </li>
  );
}

function DeleteButton({ id }: { id: string }) {
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      action={async (formData: FormData) => {
        const result = await deleteCategoryAction({}, formData);

        setError(result.error ?? null);
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="text-xs uppercase tracking-[0.2em] text-zinc-400 transition-colors hover:text-red-700"
      >
        Видалити
      </button>
      {error ? (
        <p aria-live="polite" className="mt-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}
    </form>
  );
}
