import Image from "next/image";
import Link from "next/link";
import { t } from "../../lib/i18n";
import { getMenuTypes } from "../../lib/menu";
import Container from "../ui/Container";
import Eyebrow from "../ui/Eyebrow";
import Heading from "../ui/Heading";
import Section from "../ui/Section";
import Text from "../ui/Text";

export default async function Menu() {
  const menuTypes = await getMenuTypes();

  return (
    <Section id="menu" spacing="lg">
      <Container>
        <div className="max-w-xl">
          <Eyebrow>Menu</Eyebrow>

          <Heading level={2} size="xl" className="mt-6">
            Two ways to set the table
          </Heading>

          <Text className="mt-8">
            Every menu is composed for the occasion. Choose the format, and we
            will shape the dishes around it.
          </Text>
        </div>

        <ul className="mt-20 grid gap-12 md:grid-cols-2 md:gap-16">
          {menuTypes.map((menuType) => (
            <li key={menuType.id}>
              <Link href={`/${menuType.slug}`} className="group block">
                <div className="relative aspect-[4/5] w-full overflow-hidden">
                  <Image
                    src={menuType.photo}
                    alt={t(menuType.title)}
                    fill
                    sizes="(min-width: 768px) 45vw, 100vw"
                    quality={90}
                    className="object-cover saturate-[0.85] transition-[filter] duration-700 ease-out group-hover:saturate-100 motion-reduce:transition-none"
                  />
                </div>

                <Heading level={3} size="lg" className="mt-8">
                  {t(menuType.title)}
                </Heading>

                <Text muted className="mt-4 max-w-md">
                  {t(menuType.description)}
                </Text>

                <span className="mt-8 inline-block text-sm uppercase tracking-[0.2em] text-zinc-800 transition-colors group-hover:text-zinc-500">
                  View menu
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
