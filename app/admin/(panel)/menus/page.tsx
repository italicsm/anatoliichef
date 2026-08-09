import MenuTypeForm from "../../../components/admin/MenuTypeForm";
import { listMenuTypeDetails } from "../../../lib/admin/menu-types";
import { ADMIN_LOCALE, t } from "../../../lib/i18n";

export const dynamic = "force-dynamic";

export default async function MenusPage() {
  let menuTypes;

  try {
    menuTypes = await listMenuTypeDetails();
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
        Меню
      </h1>

      <p className="mt-4 max-w-2xl text-sm text-zinc-500">
        Назва, опис і фото кожного меню. Фото показується в картці на головній
        сторінці. Створення нових типів меню поки недоступне — для нього
        потрібні власні адреси на сайті.
      </p>

      {menuTypes.map((menuType) => (
        <section
          key={menuType.id}
          className="mt-14 border-t border-zinc-200 pt-10"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h2 className="text-lg text-zinc-900">
              {t(menuType.title, ADMIN_LOCALE)}
            </h2>

            <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
              /{menuType.slug} · категорій: {menuType.categoryCount}
            </p>
          </div>

          <div className="mt-8">
            <MenuTypeForm menuType={menuType} />
          </div>
        </section>
      ))}
    </div>
  );
}
