import Image from "next/image";
import Link from "next/link";
import { getDictionary } from "../../lib/dictionary";
import { t } from "../../lib/i18n";
import type { Locale } from "../../lib/locale";
import { getMenuTypes } from "../../lib/menu";
import BoldOnHover from "../ui/BoldOnHover";
import Container from "../ui/Container";
import Eyebrow from "../ui/Eyebrow";
import ScrollIndicator from "../ui/ScrollIndicator";
import SiteSocialLinks from "../ui/SiteSocialLinks";

/**
 * Two layouts, one markup tree.
 *
 * From xl up the photo is lifted out of the flow and pinned to the right edge
 * of the container, so it always sits on the same vertical line as the header.
 * Its size comes from the section height, and the section height is capped by
 * the window width — h-[min(100svh,66vw)]. That pairing is what removes the
 * empty band under the photo: whatever the window shape, the square frame
 * fills the section exactly instead of leaving slack below itself.
 * min-h protects the text column on short windows.
 *
 * Below xl the same element falls back into the flow underneath the text and
 * the section height becomes automatic.
 */
export default async function Hero({ locale }: { locale: Locale }) {
  const menuTypes = await getMenuTypes();
  const dictionary = getDictionary(locale);

  return (
    <section className="relative overflow-hidden bg-white xl:-mt-20 xl:h-[min(100svh,66vw)] xl:min-h-[44rem] xl:pt-20">
      <Container className="relative flex h-full flex-col justify-center py-14 xl:py-0">
        <div className="relative z-10 max-w-2xl">
          <h1 className="font-sans text-6xl font-thin leading-[0.94] tracking-tight text-zinc-800 sm:text-7xl xl:text-[7rem]">
            Anatolii
            <br />
            Lukianchuk
          </h1>

          <Eyebrow className="mt-7 pl-1">{dictionary.hero.role}</Eyebrow>

          <p className="mt-10 max-w-[18rem] pl-1 font-serif text-2xl leading-snug text-zinc-700">
            {dictionary.hero.tagline}
          </p>

          <nav
            aria-label="Menus"
            className="mt-14 flex flex-wrap gap-x-12 gap-y-6 pl-1"
          >
            {menuTypes.map((menuType) => (
              <Link
                key={menuType.id}
                href={`/${locale}/${menuType.slug}`}
                className="group inline-block border-b border-zinc-300 pb-3 text-sm uppercase tracking-[0.25em] text-zinc-800 transition-colors hover:border-zinc-900"
              >
                <BoldOnHover>{t(menuType.title, locale)}</BoldOnHover>
              </Link>
            ))}
          </nav>

          <SiteSocialLinks size="sm" className="mt-10 pl-1" />
        </div>

        {/*
          The containing block is the container's padding box, so both offsets
          compensate for it. -top-20 cancels the section's pt-20 to reach under
          the header.

          The right offset is a clamped overhang rather than a fixed number.
          −5rem pushes the frame 80px past the container, 104px past the header
          content line; max() with (80rem − 100vw) / 2 — the gap between the
          container and the window — stops it at the window edge on narrower
          screens. Going flush to that edge would clip the photo's feathered
          border and replace the dissolve with a hard vertical cut, which is
          why the overhang is deliberately capped short of it.
        */}
        {/*
          The file is square, but the chef stands to the right of it: the left
          22% is empty white left there for the desktop composition. Fitting
          that whole square into a square frame is why the photo looked small
          on a phone — a fifth of the width was nothing.

          Below xl the frame is 3:4 and the image covers it from the right
          edge, which crops away that empty band and nothing else. The subject
          gains a third of its width without touching the file.
        */}
        <div className="hero-photo-fade relative z-0 mt-12 aspect-[3/4] w-full xl:absolute xl:bottom-0 xl:-top-20 xl:right-[max(calc((80rem-100vw)/2),-5rem)] xl:mt-0 xl:aspect-square xl:w-auto">
          <Image
            src="/photo/tolic/tolic4.jpg"
            alt={dictionary.hero.photoAlt}
            fill
            priority
            sizes="(min-width: 1280px) 66vw, 100vw"
            quality={100}
            className="object-cover object-right xl:object-contain xl:object-top"
          />
        </div>

        <div className="hidden xl:absolute xl:bottom-14 xl:left-6 xl:block">
          <ScrollIndicator locale={locale} />
        </div>
      </Container>
    </section>
  );
}
