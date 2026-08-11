import Image from "next/image";
import { getDictionary } from "../../lib/dictionary";
import { t } from "../../lib/i18n";
import type { Locale } from "../../lib/locale";
import {
  getAboutContent,
  toLines,
  toParagraphs,
} from "../../lib/site-content";
import Container from "../ui/Container";
import Divider from "../ui/Divider";
import Eyebrow from "../ui/Eyebrow";
import Heading from "../ui/Heading";
import Section from "../ui/Section";
import Text from "../ui/Text";

export default async function About({ locale }: { locale: Locale }) {
  const content = await getAboutContent();
  const dictionary = getDictionary(locale);
  const paragraphs = toParagraphs(t(content.body, locale));
  const specialities = toLines(t(content.specialities, locale));

  const entries = [
    ...specialities.map((term) => ({ term, description: null as string | null })),
    ...dictionary.about.facts.map((fact) => ({
      term: fact.term,
      description: fact.description,
    })),
  ];

  return (
    <Section id="about" spacing="lg">
      <Container>
        <div className="grid items-center gap-16 md:grid-cols-2 md:gap-24">
          <div className="relative aspect-[2/3] w-full">
            <Image
              src={content.photo ?? "/photo/tolic/tolic3.jpg"}
              alt={dictionary.about.photoAlt}
              fill
              sizes="(min-width: 768px) 45vw, 100vw"
              quality={100}
              className="object-cover"
            />
          </div>

          <div className="max-w-xl">
            <Eyebrow>{dictionary.about.eyebrow}</Eyebrow>

            <Heading level={2} size="xl" className="mt-6">
              {t(content.heading, locale)}
            </Heading>

            <div className="mt-10 space-y-6">
              {paragraphs.map((paragraph) => (
                <Text key={paragraph.slice(0, 32)}>{paragraph}</Text>
              ))}
            </div>
          </div>
        </div>

        <Divider spacing="lg" />

        {/*
          One block, two sources. The bare specialities come from the panel and
          the chef edits them; the four with a sentence under them are written
          copy and live in the dictionaries. They were stacked as two lists that
          answered the same question — what this chef does — so they are one
          list now, and a missing description is simply a shorter entry.
        */}
        <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_2fr] md:gap-24">
          <Eyebrow className="text-sm">{dictionary.about.specialities}</Eyebrow>

          <dl className="grid gap-x-16 sm:grid-cols-2">
            {/* The two sources are edited independently, so the same word can
                appear in both; the index keeps the keys unique either way. */}
            {entries.map((entry, index) => (
              <div
                key={`${index}-${entry.term}`}
                className="border-b border-zinc-200 py-5 first:pt-0 sm:[&:nth-child(2)]:pt-0"
              >
                <dt className="text-sm uppercase tracking-[0.2em] text-zinc-800">
                  {entry.term}
                </dt>

                {entry.description ? (
                  <dd className="mt-3 font-serif text-lg leading-7 text-zinc-500">
                    {entry.description}
                  </dd>
                ) : null}
              </div>
            ))}
          </dl>
        </div>

        <blockquote className="mx-auto mt-20 max-w-2xl text-center">
          <p className="font-serif text-3xl leading-snug text-zinc-700">
            {t(content.quote, locale)}
          </p>
          <footer className="mt-8">
            <Eyebrow className="text-sm">Anatolii Lukianchuk</Eyebrow>
          </footer>
        </blockquote>
      </Container>
    </Section>
  );
}
