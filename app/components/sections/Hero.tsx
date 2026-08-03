import Image from "next/image";
import Button from "../ui/Button";
import Container from "../ui/Container";
import Eyebrow from "../ui/Eyebrow";

export default function Hero() {
  return (
    <section className="relative -mt-20 flex h-[100svh] items-center overflow-hidden bg-white pt-20">
      <div className="absolute inset-y-0 right-[4%] w-[53%]">
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
          <h1 className="text-[7rem] font-thin leading-[0.94] tracking-tight text-zinc-800">
            Anatolii
            <br />
            Lukianchuk
          </h1>

          <Eyebrow className="mt-7 pl-1">Private Chef</Eyebrow>

          <p className="mt-10 max-w-[18rem] pl-1 font-serif text-2xl leading-snug text-zinc-700">
            Creating unforgettable dining experiences in Barcelona.
          </p>

          <div className="mt-12 pl-1">
            <Button
              href="/#contact"
              className="text-xs uppercase tracking-[0.2em]"
            >
              Reserve a Dinner
            </Button>
          </div>
        </div>
      </Container>

      <Container className="absolute inset-x-0 bottom-14 z-10">
        <div className="flex items-center gap-5 pl-1 text-zinc-400">
          <svg
            width="14"
            height="42"
            viewBox="0 0 14 42"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            aria-hidden="true"
          >
            <path d="M7 0 V40 M1 34 L7 40 L13 34" />
          </svg>
          <span className="text-xs uppercase tracking-[0.3em]">Scroll</span>
        </div>
      </Container>
    </section>
  );
}
