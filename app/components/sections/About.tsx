import Image from "next/image";
import Container from "../ui/Container";
import Divider from "../ui/Divider";
import Eyebrow from "../ui/Eyebrow";
import Heading from "../ui/Heading";
import Section from "../ui/Section";
import Text from "../ui/Text";

const specialities: string[] = [
  "Private Dining",
  "Buffet Catering",
  "Corporate Events",
  "Family Celebrations",
  "Chef at Home",
];

type Fact = {
  term: string;
  description: string;
};

const facts: Fact[] = [
  {
    term: "Private Events",
    description: "Dinners, celebrations and quiet evenings at home.",
  },
  {
    term: "Personal Menus",
    description: "Composed for every client, every season.",
  },
  {
    term: "Barcelona",
    description: "And wherever the table is set.",
  },
  {
    term: "Seasonal Products",
    description: "Chosen at the market, never from a catalogue.",
  },
];

export default function About() {
  return (
    <Section id="about" spacing="lg">
      <Container>
        <div className="grid items-center gap-16 md:grid-cols-2 md:gap-24">
          <div className="relative aspect-[2/3] w-full">
            <Image
              src="/photo/tolic/tolic3.jpg"
              alt="Anatolii Lukianchuk in his kitchen"
              fill
              sizes="(min-width: 768px) 45vw, 100vw"
              quality={100}
              className="object-cover"
            />
          </div>

          <div className="max-w-xl">
            <Eyebrow>About</Eyebrow>

            <Heading level={2} size="xl" className="mt-6">
              Meet Anatolii
            </Heading>

            <div className="mt-10 space-y-6">
              <Text>
                I am Anatolii Lukianchuk, a private chef based in Barcelona.
              </Text>
              <Text>
                For many years I have been creating dining experiences where
                every detail matters — from carefully selected ingredients to
                elegant presentation and warm hospitality.
              </Text>
              <Text>
                I work with private dinners, buffet catering, family
                celebrations and corporate events, composing a unique menu for
                every client.
              </Text>
              <Text>
                My philosophy is simple: outstanding food, honest products and
                unforgettable moments around one table.
              </Text>
            </div>
          </div>
        </div>

        <Divider spacing="lg" />

        <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_2fr] md:gap-24">
          <Eyebrow className="text-sm">Specialities</Eyebrow>

          <ul className="grid gap-x-16 gap-y-5 sm:grid-cols-2">
            {specialities.map((speciality) => (
              <li
                key={speciality}
                className="border-b border-zinc-200 pb-5 text-sm uppercase tracking-[0.2em] text-zinc-700"
              >
                {speciality}
              </li>
            ))}
          </ul>
        </div>

        <dl className="mt-28 grid gap-x-12 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {facts.map((fact) => (
            <div key={fact.term} className="border-t border-zinc-200 pt-6">
              <dt className="text-sm uppercase tracking-[0.2em] text-zinc-800">
                {fact.term}
              </dt>
              <dd className="mt-4 text-sm leading-6 text-zinc-500">
                {fact.description}
              </dd>
            </div>
          ))}
        </dl>

        <blockquote className="mx-auto mt-32 max-w-2xl text-center">
          <p className="font-serif text-3xl leading-snug text-zinc-700">
            The best memories begin around one table.
          </p>
          <footer className="mt-8">
            <Eyebrow className="text-sm">Anatolii Lukianchuk</Eyebrow>
          </footer>
        </blockquote>
      </Container>
    </Section>
  );
}
