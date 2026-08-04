import { notFound } from "next/navigation";
import { t } from "../../lib/i18n";
import { getMenuBySlug } from "../../lib/menu";
import type { MenuTypeSlug } from "../../lib/types";
import Button from "../ui/Button";
import Container from "../ui/Container";
import DishCard from "../ui/DishCard";
import Divider from "../ui/Divider";
import Eyebrow from "../ui/Eyebrow";
import Heading from "../ui/Heading";
import MenuCategoryNav from "../ui/MenuCategoryNav";
import Section from "../ui/Section";
import Text from "../ui/Text";

type MenuPageProps = {
  menuSlug: MenuTypeSlug;
};

/**
 * The whole menu page for any menu type. /furshet and /banquet differ only by
 * the slug they pass in — everything else comes from the data layer.
 */
export default async function MenuPage({ menuSlug }: MenuPageProps) {
  const menu = await getMenuBySlug(menuSlug);

  if (!menu) {
    notFound();
  }

  const { menuType, categories } = menu;

  const navItems = categories.map(({ category, dishes }) => ({
    id: category.id,
    title: t(category.title),
    count: dishes.length,
  }));

  return (
    <>
      <header className="pt-14 pb-10">
        <Container>
          <div className="grid gap-8 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <Eyebrow className="text-sm">Menu</Eyebrow>

              <Heading level={1} size="xl" className="mt-4">
                {t(menuType.title)}
              </Heading>
            </div>

            <div className="md:col-span-5">
              <Text size="lg">{t(menuType.description)}</Text>
            </div>
          </div>
        </Container>
      </header>

      {categories.length > 0 ? (
        <MenuCategoryNav items={navItems} />
      ) : (
        <Section spacing="sm">
          <Container>
            <Text muted>This menu is being updated.</Text>
          </Container>
        </Section>
      )}

      {categories.map(({ category, dishes }, index) => (
        <Section
          key={category.id}
          id={category.id}
          spacing="sm"
          className="scroll-mt-40"
        >
          <Container>
            <div className="flex items-baseline gap-5">
              <span className="text-xs tabular-nums tracking-[0.2em] text-zinc-400">
                {String(index + 1).padStart(2, "0")}
              </span>

              <Heading level={2} size="lg">
                {t(category.title)}
              </Heading>
            </div>

            <ul className="mt-10 grid gap-x-14 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
              {dishes.map((placedDish) => (
                <li key={placedDish.placement.id} className="flex">
                  <DishCard placedDish={placedDish} menuSlug={menuSlug} />
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ))}

      <Section spacing="lg">
        <Container>
          <Divider spacing="none" />

          <div className="mt-14 text-center">
            <Heading level={2} size="xl">
              Ready to plan your event?
            </Heading>

            <Text muted className="mx-auto mt-6 max-w-lg">
              Tell me the date, the format and the number of guests — I will
              compose a menu around them.
            </Text>

            <div className="mt-12">
              <Button
                href="/#contact"
                className="text-sm uppercase tracking-[0.2em]"
              >
                Reserve a Dinner
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
