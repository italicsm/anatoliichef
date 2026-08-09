import type { Metadata } from "next";
import MenuPage from "../../components/sections/MenuPage";
import { t } from "../../lib/i18n";
import { getMenuBySlug } from "../../lib/menu";
import type { MenuTypeSlug } from "../../lib/types";

const menuSlug: MenuTypeSlug = "banquet";

export async function generateMetadata(): Promise<Metadata> {
  const menu = await getMenuBySlug(menuSlug);

  if (!menu) {
    return {};
  }

  return {
    title: `${t(menu.menuType.title)} — Anatolii Lukianchuk`,
    description: t(menu.menuType.description),
  };
}

export default function BanquetPage() {
  return <MenuPage menuSlug={menuSlug} />;
}
