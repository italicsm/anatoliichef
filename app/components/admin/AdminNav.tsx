"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type AdminNavItem = {
  label: string;
  href: string;
};

/**
 * Adding a screen to the admin means adding a line here and a folder under
 * app/admin — the guard in middleware already covers anything below /admin.
 */
const items: AdminNavItem[] = [
  { label: "Меню", href: "/admin/menus" },
  { label: "Категорії", href: "/admin/categories" },
  { label: "Страви", href: "/admin/dishes" },
  { label: "Про шефа", href: "/admin/content/about" },
  { label: "Контакти", href: "/admin/content/contact" },
  { label: "Замовлення", href: "/admin/orders" },
  { label: "Налаштування", href: "/admin/settings" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Розділи панелі">
      <ul className="flex flex-wrap gap-x-8 gap-y-3">
        {items.map((item) => {
          const isActive = pathname.startsWith(item.href);

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`border-b pb-1 text-xs uppercase tracking-[0.2em] transition-colors ${
                  isActive
                    ? "border-zinc-900 text-zinc-900"
                    : "border-transparent text-zinc-400 hover:text-zinc-700"
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
