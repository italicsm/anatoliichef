import Link from "next/link";
import { notFound } from "next/navigation";
import DishForm from "../../../../components/admin/DishForm";
import DishStatus from "../../../../components/admin/DishStatus";
import PlacementEditor from "../../../../components/admin/PlacementEditor";
import DishPhotos from "../../../../components/admin/DishPhotos";
import {
  getDish,
  listCategoryOptions,
  listDishPhotos,
  listPlacements,
} from "../../../../lib/admin/dishes";
import { ADMIN_LOCALE, t } from "../../../../lib/i18n";
import { deleteDishAction, updateDishAction } from "../actions";
import DeleteDish from "./DeleteDish";

export const dynamic = "force-dynamic";

export default async function DishPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const dish = await getDish(id);

  if (!dish) {
    notFound();
  }

  const [placements, categories, photos] = await Promise.all([
    listPlacements(id),
    listCategoryOptions(),
    listDishPhotos(id),
  ]);

  return (
    <div>
      <Link
        href="/admin/dishes"
        className="text-xs uppercase tracking-[0.2em] text-zinc-400 transition-colors hover:text-zinc-900"
      >
        ← Усі страви
      </Link>

      <div className="mt-6 flex flex-wrap items-center gap-5">
        <h1 className="text-2xl font-extralight tracking-wide text-zinc-900">
          {t(dish.title, ADMIN_LOCALE)}
        </h1>

        <DishStatus
          isActive={dish.isActive}
          placementCount={dish.placementCount}
        />
      </div>

      <section className="mt-10">
        <DishForm
          action={updateDishAction}
          submitLabel="Зберегти"
          dish={dish}
        />
      </section>

      <section className="mt-16 border-t border-zinc-200 pt-10">
        <DishPhotos dishId={dish.id} photos={photos} />
      </section>

      <section className="mt-16 border-t border-zinc-200 pt-10">
        <PlacementEditor
          dishId={dish.id}
          placements={placements}
          categories={categories}
        />
      </section>

      <section className="mt-16 border-t border-zinc-200 pt-10">
        <DeleteDish id={dish.id} action={deleteDishAction} />
      </section>
    </div>
  );
}
