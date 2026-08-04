import Image from "next/image";
import Link from "next/link";
import { t } from "../../lib/i18n";
import { getMenuTypes } from "../../lib/menu";
import BoldOnHover from "../ui/BoldOnHover";
import Container from "../ui/Container";
import Eyebrow from "../ui/Eyebrow";
import ScrollIndicator from "../ui/ScrollIndicator";
import SocialLinks from "../ui/SocialLinks";

export default async function Hero() {
  const menuTypes = await getMenuTypes();

  return (
    <section className="relative -mt-20 flex h-[100svh] items-center overflow-hidden bg-white pt-20">
      <div className="absolute inset-y-0 right-[9%] w-[53%]">
        <Image
          src="/photo/tolic/tolic231.jpg"
          alt="Anatolii Lukianchuk with freshly baked bread"
          fill
          priority
          sizes="53vw"
          quality={100}
          className="object-contain object-top saturate-[0.7] transition-[filter] duration-700 ease-out hover:saturate-100 motion-reduce:transition-none"
        />
      </div>

      <Container className="relative z-10 w-full">
        <div className="max-w-2xl">
          <h1 className="font-sans text-[7rem] font-thin leading-[0.94] tracking-tight text-zinc-800">
            Anatolii
            <br />
            Lukianchuk
          </h1>

          <Eyebrow className="mt-7 pl-1">Private Chef</Eyebrow>

          <p className="mt-10 max-w-[18rem] pl-1 font-serif text-2xl leading-snug text-zinc-700">
            Creating unforgettable dining experiences in Barcelona.
          </p>

          <nav aria-label="Menus" className="mt-14 flex gap-12 pl-1">
            {menuTypes.map((menuType) => (
              <Link
                key={menuType.id}
                href={`/${menuType.slug}`}
                className="group inline-block border-b border-zinc-300 pb-3 text-sm uppercase tracking-[0.25em] text-zinc-800 transition-colors hover:border-zinc-900"
              >
                <BoldOnHover>{t(menuType.title)}</BoldOnHover>
              </Link>
            ))}
          </nav>

          <SocialLinks size="sm" className="mt-10 pl-1" />
        </div>
      </Container>

      <Container className="absolute inset-x-0 bottom-14 z-10">
        <ScrollIndicator className="pl-1" />
      </Container>
    </section>
  );
}
