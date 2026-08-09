import { t } from "../../lib/i18n";
import { getContactContent } from "../../lib/site-content";
import Button from "../ui/Button";
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

export default async function Contact() {
  const content = await getContactContent();

  // Location stays plain text: the brief ruled out an embedded map, and a link
  // with nowhere sensible to go is worse than no link.
  const contactDetails: ContactDetail[] = [
    {
      label: "Phone",
      value: content.phone,
      href: `tel:${content.phone.replace(/\s/g, "")}`,
    },
    {
      label: "Email",
      value: content.email,
      href: `mailto:${content.email}`,
    },
    { label: "Location", value: t(content.location) },
  ];

  return (
    <Section id="contact" spacing="lg">
      <Container>
        <div className="grid gap-16 md:grid-cols-2 md:gap-24">
          <div className="max-w-xl">
            <Eyebrow>Contact</Eyebrow>

            <Heading level={2} size="xl" className="mt-6">
              {t(content.heading)}
            </Heading>

            <div className="mt-10 space-y-6">
              <Text>{t(content.body)}</Text>
              <Text muted>{t(content.availability)}</Text>
            </div>

            <div className="mt-12">
              <Button className="text-sm uppercase tracking-[0.2em]">
                Reserve a Dinner
              </Button>
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
              <Eyebrow className="text-sm">Elsewhere</Eyebrow>

              <SiteSocialLinks className="mt-6" />
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
