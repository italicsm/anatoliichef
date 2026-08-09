import CategoryForm from "../../../components/admin/CategoryForm";
import CategoryRow from "../../../components/admin/CategoryRow";
import {
  listCategories,
  listMenuTypes,
  type AdminMenuType,
} from "../../../lib/admin/categories";
import { ADMIN_LOCALE, t } from "../../../lib/i18n";
import { createCategoryAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ menu?: string }>;
}) {
  const { menu } = await searchParams;

  let menuTypes: AdminMenuType[] = [];
  let loadError: string | null = null;

  try {
    menuTypes = await listMenuTypes();
  } catch (error) {
    loadError = error instanceof Error ? error.message : "Помилка бази даних.";
  }

  if (loadError) {
    return <p className="text-red-700">{loadError}</p>;
  }

  const active =
    menuTypes.find((candidate) => candidate.slug === menu) ?? menuTypes[0];

  if (!active) {
    return (
      <p className="text-zinc-500">
        Спершу створіть тип меню в розділі «Меню».
      </p>
    );
  }

  const categories = await listCategories(active.id);

  return (
    <div>
      <h1 className="text-2xl font-extralight tracking-wide text-zinc-900">
        Категорії
      </h1>

      <nav aria-label="Тип меню" className="mt-8 flex flex-wrap gap-8">
        {menuTypes.map((menuType) => (
          <a
            key={menuType.id}
            href={`/admin/categories?menu=${menuType.slug}`}
            aria-current={menuType.id === active.id ? "page" : undefined}
            className={`border-b pb-1 text-sm uppercase tracking-[0.2em] transition-colors ${
              menuType.id === active.id
                ? "border-zinc-900 text-zinc-900"
                : "border-transparent text-zinc-400 hover:text-zinc-700"
            }`}
          >
            {t(menuType.title, ADMIN_LOCALE)}
          </a>
        ))}
      </nav>

      <ul className="mt-10">
        {categories.map((category, index) => (
          <CategoryRow
            key={category.id}
            category={category}
            isFirst={index === 0}
            isLast={index === categories.length - 1}
          />
        ))}
      </ul>

      {categories.length === 0 ? (
        <p className="mt-10 text-zinc-500">У цьому меню ще немає категорій.</p>
      ) : null}

      <section className="mt-14 border-t border-zinc-200 pt-10">
        <h2 className="text-xs uppercase tracking-[0.25em] text-zinc-500">
          Нова категорія
        </h2>

        <div className="mt-6">
          <CategoryForm
            action={createCategoryAction}
            submitLabel="Додати"
            hidden={{ menuTypeId: active.id }}
            clearOnSave
          />
        </div>
      </section>
    </div>
  );
}
