"use client";

import Image from "next/image";
import { useActionState } from "react";
import {
  addDishPhotoAction,
  deleteDishPhotoAction,
  makeDishPhotoMainAction,
  type ActionState,
} from "../../admin/(panel)/dishes/actions";
import type { AdminDishPhoto } from "../../lib/admin/dishes";
import Button from "../ui/Button";
import Spinner from "../ui/Spinner";
import ImageField from "./ImageField";

type DishPhotosProps = {
  dishId: string;
  photos: AdminDishPhoto[];
};

/**
 * The first photo is the one the public card shows, so ordering *is* the
 * "main photo" setting — no separate flag that could contradict it.
 */
export default function DishPhotos({ dishId, photos }: DishPhotosProps) {
  return (
    <div>
      <h2 className="text-xs uppercase tracking-[0.25em] text-zinc-500">
        Фото
      </h2>

      {photos.length === 0 ? (
        <p className="mt-6 text-zinc-500">
          Фото ще немає — на сайті картка страви буде без зображення.
        </p>
      ) : (
        <ul className="mt-6 flex flex-wrap gap-6">
          {photos.map((photo, index) => (
            <li key={photo.id} className="w-40">
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100">
                <Image
                  src={photo.url}
                  alt=""
                  fill
                  sizes="160px"
                  className="object-cover"
                />
              </div>

              {index === 0 ? (
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-zinc-900">
                  Головне
                </p>
              ) : (
                <MakeMain id={photo.id} />
              )}

              <RemovePhoto id={photo.id} />
            </li>
          ))}
        </ul>
      )}

      <AddPhoto dishId={dishId} />
    </div>
  );
}

function AddPhoto({ dishId }: { dishId: string }) {
  const [state, action, isPending] = useActionState<ActionState, FormData>(
    addDishPhotoAction,
    {}
  );

  return (
    <form action={action} className="mt-10 max-w-xl">
      <input type="hidden" name="dishId" value={dishId} />

      <ImageField
        label="Додати фото"
        name="photo"
        hint="JPG, PNG, WebP або AVIF, до 8 МБ. Перше фото стає головним."
      />

      <Button
        type="submit"
        size="sm"
        disabled={isPending}
        className="mt-6 gap-3 text-xs uppercase tracking-[0.2em]"
      >
        {isPending ? <Spinner /> : null}
        {isPending ? "Завантажуємо" : "Завантажити"}
      </Button>

      {state.error ? (
        <p aria-live="polite" className="mt-4 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}

function MakeMain({ id }: { id: string }) {
  const [state, action, isPending] = useActionState<ActionState, FormData>(
    makeDishPhotoMainAction,
    {}
  );

  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        disabled={isPending}
        className="mt-2 text-xs uppercase tracking-[0.2em] text-zinc-400 transition-colors hover:text-zinc-900 disabled:opacity-40"
      >
        Зробити головним
      </button>
      {state.error ? (
        <p className="mt-1 text-xs text-red-700">{state.error}</p>
      ) : null}
    </form>
  );
}

function RemovePhoto({ id }: { id: string }) {
  const [state, action, isPending] = useActionState<ActionState, FormData>(
    deleteDishPhotoAction,
    {}
  );

  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        disabled={isPending}
        className="mt-1 text-xs uppercase tracking-[0.2em] text-zinc-400 transition-colors hover:text-red-700 disabled:opacity-40"
      >
        {isPending ? "Видаляємо" : "Видалити"}
      </button>
      {state.error ? (
        <p className="mt-1 text-xs text-red-700">{state.error}</p>
      ) : null}
    </form>
  );
}
