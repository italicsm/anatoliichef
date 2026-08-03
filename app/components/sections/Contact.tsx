import Button from "../ui/Button";
import Container from "../ui/Container";
import Eyebrow from "../ui/Eyebrow";
import Heading from "../ui/Heading";
import Section from "../ui/Section";
import Text from "../ui/Text";

/**
 * TODO: replace the placeholders below with the real contact details.
 * Everything the section renders comes from these two arrays.
 */
type ContactDetail = {
  label: string;
  value: string;
  href?: string;
};

const contactDetails: ContactDetail[] = [
  { label: "Phone", value: "+34 600 000 000", href: "tel:+34600000000" },
  {
    label: "Email",
    value: "hello@anatoliilukianchuk.com",
    href: "mailto:hello@anatoliilukianchuk.com",
  },
  { label: "Location", value: "Barcelona, Spain" },
];

type SocialLink = {
  label: string;
  href: string;
};

const socialLinks: SocialLink[] = [
  { label: "Telegram", href: "https://t.me/anatoliichef" },
  { label: "WhatsApp", href: "https://wa.me/34600000000" },
  { label: "Instagram", href: "https://instagram.com/anatoliichef" },
  { label: "Facebook", href: "https://facebook.com/anatoliichef" },
];

export default function Contact() {
  return (
    <Section id="contact" spacing="lg">
      <Container>
        <div className="grid gap-16 md:grid-cols-2 md:gap-24">
          <div className="max-w-xl">
            <Eyebrow>Contact</Eyebrow>

            <Heading level={2} size="xl" className="mt-6">
              Let’s create something memorable together.
            </Heading>

            <div className="mt-10 space-y-6">
              <Text>
                Whether you’re planning an intimate dinner, a buffet or a
                corporate event, I would be delighted to create a unique
                culinary experience for you.
              </Text>
              <Text muted>Available in Barcelona and surrounding areas.</Text>
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

              <ul className="mt-6 flex flex-wrap gap-x-10 gap-y-4">
                {socialLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm uppercase tracking-[0.2em] text-zinc-800 transition-colors hover:text-zinc-500"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
