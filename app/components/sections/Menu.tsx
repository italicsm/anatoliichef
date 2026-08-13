import Image from "next/image";
import Link from "next/link";
import { getDictionary } from "../../lib/dictionary";
import { t } from "../../lib/i18n";
import type { Locale } from "../../lib/locale";
import { getMenuTypes } from "../../lib/menu";
import BoldOnHover from "../ui/BoldOnHover";
import Container from "../ui/Container";
import Eyebrow from "../ui/Eyebrow";
import Heading from "../ui/Heading";
import Section from "../ui/Section";
import Text from "../ui/Text";

export default async function Menu({ locale }: { locale: Locale }) {
  const menuTypes = await getMenuTypes();
  const dictionary = getDictionary(locale);

  return (
    <Section id="menu" spacing="lg">
      <Container>
        <div className="max-w-xl">
          <Eyebrow>{dictionary.menuSection.eyebrow}</Eyebrow>

          <Heading level={2} size="xl" className="mt-6">
            {dictionary.menuSection.heading}
          </Heading>

          <Text className="mt-8">{dictionary.menuSection.body}</Text>
        </div>

        <ul className="mt-14 grid gap-12 md:grid-cols-2 md:gap-16">
          {menuTypes.map((menuType) => (
            <li key={menuType.id}>
              <Link href={`/${locale}/${menuType.slug}`} className="group block">
                {/* Landscape at every width: the portrait frame pushed the
                    dish names below the fold on a laptop, and the photos are
                    table settings — they read wide. */}
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
                  <Image
                    src={menuType.photo}
                    alt={t(menuType.title, locale)}
                    fill
                    sizes="(min-width: 768px) 45vw, 100vw"
                    quality={90}
                    className="object-cover saturate-[0.85] transition-[filter] duration-700 ease-out group-hover:saturate-100 motion-reduce:transition-none"
                  />
                </div>

                <Heading level={3} size="lg" className="mt-8">
                  {t(menuType.title, locale)}
                </Heading>

                <Text muted className="mt-4 max-w-md">
                  {t(menuType.description, locale)}
                </Text>

                <span className="mt-8 inline-block border-b border-zinc-300 pb-3 text-sm uppercase tracking-[0.25em] text-zinc-800 transition-colors group-hover:border-zinc-900">
                  <BoldOnHover>{dictionary.menuSection.viewMenu}</BoldOnHover>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
