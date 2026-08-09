"use client";

import { useActionState } from "react";
import {
  addPlacementAction,
  removePlacementAction,
  updatePlacementAction,
  type ActionState,
} from "../../admin/(panel)/dishes/actions";
import {
  formatPriceInput,
  type AdminPlacement,
  type CategoryOption,
} from "../../lib/admin/dishes";
import { ADMIN_LOCALE, t } from "../../lib/i18n";
import Button from "../ui/Button";
import Spinner from "../ui/Spinner";
import { adminFieldStyles, adminLabelStyles } from "./AdminField";

type PlacementEditorProps = {
  dishId: string;
  placements: AdminPlacement[];
  categories: CategoryOption[];
};

/**
 * Where the dish is sold and for how much. This is the screen that makes the
 * data model visible to the chef: the same dish sits in several menus, each
 * row with its own price and portion, and nothing is duplicated.
 */
export default function PlacementEditor({
  dishId,
  placements,
  categories,
}: PlacementEditorProps) {
  const used = new Set(placements.map((placement) => placement.categoryId));
  const available = categories.filter((category) => !used.has(category.id));

  return (
    <div>
      <h2 className="text-xs uppercase tracking-[0.25em] text-zinc-500">
        У меню
      </h2>

      {placements.length === 0 ? (
        <p className="mt-6 text-zinc-500">
          Страва ще не входить у жодне меню — доки не додасте, на сайті її не
          буде.
        </p>
      ) : (
        <ul className="mt-6">
          {placements.map((placement) => (
            <PlacementRow key={placement.id} placement={placement} />
          ))}
        </ul>
      )}

      {available.length > 0 ? (
        <AddPlacement dishId={dishId} categories={available} />
      ) : (
        <p className="mt-8 text-sm text-zinc-400">
          Страва вже є в усіх наявних категоріях.
        </p>
      )}
    </div>
  );
}

function PlacementRow({ placement }: { placement: AdminPlacement }) {
  const [state, action, isPending] = useActionState<ActionState, FormData>(
    updatePlacementAction,
    {}
  );

  return (
    <li className="border-b border-zinc-200 py-5">
      <div className="flex flex-wrap items-end gap-6">
        <div className="min-w-48">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
            {t(placement.menuTitle, ADMIN_LOCALE)}
          </p>
          <p className="mt-1 text-zinc-900">{t(placement.categoryTitle, ADMIN_LOCALE)}</p>
        </div>

        <form action={action} className="flex flex-wrap items-end gap-4">
          <input type="hidden" name="id" value={placement.id} />

          <div className="w-28">
            <label className={adminLabelStyles} htmlFor={`price-${placement.id}`}>
              Ціна, €
            </label>
            <input
              id={`price-${placement.id}`}
              name="price"
              defaultValue={formatPriceInput(placement.price)}
              inputMode="decimal"
              className={`${adminFieldStyles} mt-2`}
            />
          </div>

          <div className="w-28">
            <label
              className={adminLabelStyles}
              htmlFor={`portion-${placement.id}`}
            >
              Порція
            </label>
            <input
              id={`portion-${placement.id}`}
              name="portion"
              defaultValue={placement.portion ?? ""}
              placeholder="120 g"
              className={`${adminFieldStyles} mt-2`}
            />
          </div>

          <Button
            type="submit"
            size="sm"
            disabled={isPending}
            className="gap-2 text-xs uppercase tracking-[0.2em]"
          >
            {isPending ? <Spinner /> : null}
            Зберегти
          </Button>
        </form>

        <RemovePlacement id={placement.id} />
      </div>

      {state.error ? (
        <p aria-live="polite" className="mt-3 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}
    </li>
  );
}

function RemovePlacement({ id }: { id: string }) {
  const [state, action, isPending] = useActionState<ActionState, FormData>(
    removePlacementAction,
    {}
  );

  return (
    <form action={action} className="pb-2">
      <input type="hidden" name="id" value={id} />

      <button
        type="submit"
        disabled={isPending}
        className="text-xs uppercase tracking-[0.2em] text-zinc-400 transition-colors hover:text-red-700 disabled:opacity-40"
      >
        {isPending ? "Прибираємо" : "Прибрати з меню"}
      </button>

      {state.error ? (
        <p aria-live="polite" className="mt-2 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}

function AddPlacement({
  dishId,
  categories,
}: {
  dishId: string;
  categories: CategoryOption[];
}) {
  const [state, action, isPending] = useActionState<ActionState, FormData>(
    addPlacementAction,
    {}
  );

  return (
    <form action={action} className="mt-10 flex flex-wrap items-end gap-4">
      <input type="hidden" name="dishId" value={dishId} />

      <div className="min-w-56">
        <label className={adminLabelStyles} htmlFor="placement-category">
          Додати в категорію
        </label>
        <select
          id="placement-category"
          name="categoryId"
          required
          className={`${adminFieldStyles} mt-2`}
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {t(category.menuTitle, ADMIN_LOCALE)} — {t(category.title, ADMIN_LOCALE)}
            </option>
          ))}
        </select>
      </div>

      <div className="w-28">
        <label className={adminLabelStyles} htmlFor="placement-price">
          Ціна, €
        </label>
        <input
          id="placement-price"
          name="price"
          required
          inputMode="decimal"
          placeholder="12,50"
          className={`${adminFieldStyles} mt-2`}
        />
      </div>

      <div className="w-28">
        <label className={adminLabelStyles} htmlFor="placement-portion">
          Порція
        </label>
        <input
          id="placement-portion"
          name="portion"
          placeholder="120 g"
          className={`${adminFieldStyles} mt-2`}
        />
      </div>

      <Button
        type="submit"
        size="sm"
        disabled={isPending}
        className="gap-2 text-xs uppercase tracking-[0.2em]"
      >
        {isPending ? <Spinner /> : null}
        Додати
      </Button>

      {state.error ? (
        <p aria-live="polite" className="w-full text-sm text-red-700">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
