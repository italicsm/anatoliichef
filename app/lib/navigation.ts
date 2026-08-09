import { getDictionary } from "./dictionary";
import { t } from "./i18n";
import type { Locale } from "./locale";
import { getMenuTypes } from "./menu";

export type NavItem = {
  label: string;
  href: string;
};

/**
 * One source for the desktop row and the mobile panel.
 *
 * Menu entries come from the database rather than a constant: renaming Фуршет
 * in the panel has to rename it in the navigation too, and a menu added later
 * has to appear without a deploy.
 */
export async function getNavItems(locale: Locale): Promise<NavItem[]> {
  const dictionary = getDictionary(locale);
  const menuTypes = await getMenuTypes();

  return [
    ...menuTypes.map((menuType) => ({
      label: t(menuType.title, locale),
      href: `/${locale}/${menuType.slug}`,
    })),
    { label: dictionary.nav.about, href: `/${locale}#about` },
    { label: dictionary.nav.contact, href: `/${locale}#contact` },
  ];
}
