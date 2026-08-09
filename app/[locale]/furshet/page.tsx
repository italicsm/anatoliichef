import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MenuPage from "../../components/sections/MenuPage";
import { t } from "../../lib/i18n";
import { isLocale, DEFAULT_LOCALE } from "../../lib/locale";
import { getMenuBySlug } from "../../lib/menu";
import type { MenuTypeSlug } from "../../lib/types";

const menuSlug: MenuTypeSlug = "furshet";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const menu = await getMenuBySlug(menuSlug);

  if (!menu) {
    return {};
  }

  const language = isLocale(locale) ? locale : DEFAULT_LOCALE;

  return {
    title: `${t(menu.menuType.title, language)} — Anatolii Lukianchuk`,
    description: t(menu.menuType.description, language),
  };
}

export default async function FurshetPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return <MenuPage menuSlug={menuSlug} locale={locale} />;
}
