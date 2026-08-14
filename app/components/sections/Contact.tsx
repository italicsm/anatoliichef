import Image from "next/image";
import { getDictionary } from "../../lib/dictionary";
import { t } from "../../lib/i18n";
import type { Locale } from "../../lib/locale";
import { getContactContent } from "../../lib/site-content";
import BookingDialog from "../ui/BookingDialog";
import Container from "../ui/Container";
import Eyebrow from "../ui/Eyebrow";
import Heading from "../ui/Heading";
import Section from "../ui/Section";
import SiteSocialLinks from "../ui/SiteSocialLinks";
import Text from "../ui/Text";

type ContactDetail = {
  label: string;
  value: string;
  href?: string;
};

export default async function Contact({ locale }: { locale: Locale }) {
  const content = await getContactContent();
  const dictionary = getDictionary(locale);

  // Location stays plain text: the brief ruled out an embedded map, and a link
  // with nowhere sensible to go is worse than no link.
  const contactDetails: ContactDetail[] = [
    {
      label: dictionary.contact.phone,
      value: content.phone,
      href: `tel:${content.phone.replace(/\s/g, "")}`,
    },
    {
      label: dictionary.contact.email,
      value: content.email,
      href: `mailto:${content.email}`,
    },
    { label: dictionary.contact.location, value: t(content.location, locale) },
  ];

  // A little less ceiling than the preset: the section above ends with an
  // ornament rather than a paragraph, so the two paddings meeting made a hole
  // instead of a breath.
  return (
    <Section id="contact" spacing="lg" className="md:pt-24">
      <Container>
        <div className="grid gap-16 md:grid-cols-2 md:gap-24">
          <div className="max-w-xl">
            <Eyebrow>{dictionary.contact.eyebrow}</Eyebrow>

            <Heading level={2} size="xl" className="mt-6">
              {t(content.heading, locale)}
            </Heading>

            <div className="mt-10 space-y-6">
              <Text>{t(content.body, locale)}</Text>
              <Text muted>{t(content.availability, locale)}</Text>
            </div>

            <div className="mt-12">
              <BookingDialog locale={locale} />
            </div>
          </div>

          <div className="md:pt-2">
            <dl>
              {contactDetails.map((detail) => (
                <div
                  key={detail.label}
                  className="grid gap-2 border-b border-zinc-200 py-6 sm:grid-cols-[10rem_1fr] sm:gap-8"
                >
                  <dt className="text-sm uppercase tracking-[0.2em] text-zinc-500">
                    {detail.label}
                  </dt>
                  <dd className="text-lg text-zinc-800">
                    {detail.href ? (
                      <a
                        href={detail.href}
                        className="transition-colors hover:text-zinc-500"
                      >
                        {detail.value}
                      </a>
                    ) : (
                      detail.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-12">
              <Eyebrow className="text-sm">{dictionary.contact.elsewhere}</Eyebrow>

              <SiteSocialLinks className="mt-6" />
            </div>

            {/*
              An ornament, not information: it fills the space the contact list
              leaves at the bottom of the column and says "Mediterranean"
              without a word. Hidden below md, where that space does not exist
              and the branch would only push the footer further away.

              aria-hidden with an empty alt keeps it out of the screen reader's
              path — there is nothing here to describe.

              The box carries the file's own proportions rather than a height.
              A fixed height left almost 200px of empty box above the branch,
              because the picture is wide and the column narrow — the image ran
              out of width long before it filled that height.
            */}
            <div className="relative mt-20 -mb-20 hidden aspect-[1536/516] w-full md:block">
              <Image
                src="/photo/oliva.jpg"
                alt=""
                aria-hidden="true"
                fill
                sizes="(min-width: 768px) 45vw, 0px"
                className="object-contain object-right-bottom"
              />
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
