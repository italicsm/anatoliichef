import Link from "next/link";
import DishForm from "../../../components/admin/DishForm";
import DishStatus from "../../../components/admin/DishStatus";
import { formatPrice } from "../../../lib/format";
import { listDishes } from "../../../lib/admin/dishes";
import { ADMIN_LOCALE, t } from "../../../lib/i18n";
import { createDishAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function DishesPage() {
  let dishes;

  try {
    dishes = await listDishes();
  } catch (error) {
    return (
      <p className="text-red-700">
        {error instanceof Error ? error.message : "Помилка бази даних."}
      </p>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-extralight tracking-wide text-zinc-900">
        Страви
      </h1>

      <ul className="mt-10">
        {dishes.map((dish) => (
          <li key={dish.id} className="border-b border-zinc-200 py-5">
            <Link
              href={`/admin/dishes/${dish.id}`}
              className="flex flex-wrap items-start justify-between gap-x-8 gap-y-3"
            >
              <span className="flex items-center gap-3">
                <DishStatus
                  isActive={dish.isActive}
                  placementCount={dish.placementCount}
                />

                <span className="text-zinc-900">
                  {t(dish.title, ADMIN_LOCALE)}
                </span>
              </span>

              <span className="flex flex-wrap items-center gap-x-8 gap-y-2">
                {dish.pricing.length === 0 ? (
                  <span className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                    ціни не задані
                  </span>
                ) : (
                  dish.pricing.map((entry, index) => (
                    <span
                      key={`${entry.menuTitle.uk ?? index}-${entry.price}`}
                      className="flex items-baseline gap-3"
                    >
                      <span className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                        {t(entry.menuTitle, ADMIN_LOCALE)}
                      </span>
                      {entry.portion ? (
                        <span className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                          {entry.portion}
                        </span>
                      ) : null}
                      <span className="tabular-nums text-zinc-700">
                        {formatPrice(entry.price)}
                      </span>
                    </span>
                  ))
                )}

                <span className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                  фото: {dish.photoCount}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {dishes.length === 0 ? (
        <p className="mt-10 text-zinc-500">Страв поки немає.</p>
      ) : null}

      <section className="mt-14 border-t border-zinc-200 pt-10">
        <h2 className="text-xs uppercase tracking-[0.25em] text-zinc-500">
          Нова страва
        </h2>

        <div className="mt-8">
          <DishForm action={createDishAction} submitLabel="Створити" />
        </div>
      </section>
    </div>
  );
}
