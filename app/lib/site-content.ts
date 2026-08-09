import type { Translated } from "./i18n";
import { getReadClient } from "./supabase";

/**
 * Editable page copy. One row per block, keyed by name, shape defined here.
 *
 * Every getter falls back to the values the sections shipped with, so a
 * missing row, an unreachable database or a half-filled form degrades to the
 * original page rather than to an empty one.
 */

export type AboutContent = {
  heading: Translated;
  body: Translated;
  specialities: Translated;
  quote: Translated;
  photo: string | null;
};

export type ContactContent = {
  heading: Translated;
  body: Translated;
  availability: Translated;
  phone: string;
  email: string;
  location: Translated;
  telegram: string;
  whatsapp: string;
  instagram: string;
  facebook: string;
};

export const ABOUT_FALLBACK: AboutContent = {
  heading: { en: "Meet Anatolii" },
  body: {
    en: "I am Anatolii Lukianchuk, a private chef based in Barcelona.\n\nFor many years I have been creating dining experiences where every detail matters — from carefully selected ingredients to elegant presentation and warm hospitality.\n\nI work with private dinners, buffet catering, family celebrations and corporate events, composing a unique menu for every client.\n\nMy philosophy is simple: outstanding food, honest products and unforgettable moments around one table.",
  },
  specialities: {
    en: "Private Dining\nBuffet Catering\nCorporate Events\nFamily Celebrations\nChef at Home",
  },
  quote: { en: "The best memories begin around one table." },
  photo: "/photo/tolic/tolic3.jpg",
};

export const CONTACT_FALLBACK: ContactContent = {
  heading: { en: "Let’s create something memorable together." },
  body: {
    en: "Whether you’re planning an intimate dinner, a buffet or a corporate event, I would be delighted to create a unique culinary experience for you.",
  },
  availability: { en: "Available in Barcelona and surrounding areas." },
  phone: "+34 600 000 000",
  email: "hello@anatoliilukianchuk.com",
  location: { en: "Barcelona, Spain" },
  telegram: "https://t.me/anatoliichef",
  whatsapp: "https://wa.me/34600000000",
  instagram: "https://instagram.com/anatoliichef",
  facebook: "https://facebook.com/anatoliichef",
};

async function readBlock(key: string): Promise<Record<string, unknown> | null> {
  const client = getReadClient();

  if (!client) {
    return null;
  }

  const { data, error } = await client
    .from("site_content")
    .select("data")
    .eq("key", key)
    .maybeSingle();

  if (error) {
    console.error(`[content] could not read "${key}"`, error);

    return null;
  }

  return (data as { data: Record<string, unknown> } | null)?.data ?? null;
}

function translated(value: unknown, fallback: Translated): Translated {
  return value && typeof value === "object" ? (value as Translated) : fallback;
}

function text(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim() ? value : fallback;
}

export async function getAboutContent(): Promise<AboutContent> {
  const block = await readBlock("about");

  if (!block) {
    return ABOUT_FALLBACK;
  }

  return {
    heading: translated(block.heading, ABOUT_FALLBACK.heading),
    body: translated(block.body, ABOUT_FALLBACK.body),
    specialities: translated(block.specialities, ABOUT_FALLBACK.specialities),
    quote: translated(block.quote, ABOUT_FALLBACK.quote),
    photo:
      typeof block.photo === "string" && block.photo
        ? block.photo
        : ABOUT_FALLBACK.photo,
  };
}

export async function getContactContent(): Promise<ContactContent> {
  const block = await readBlock("contact");

  if (!block) {
    return CONTACT_FALLBACK;
  }

  return {
    heading: translated(block.heading, CONTACT_FALLBACK.heading),
    body: translated(block.body, CONTACT_FALLBACK.body),
    availability: translated(
      block.availability,
      CONTACT_FALLBACK.availability
    ),
    phone: text(block.phone, CONTACT_FALLBACK.phone),
    email: text(block.email, CONTACT_FALLBACK.email),
    location: translated(block.location, CONTACT_FALLBACK.location),
    telegram: text(block.telegram, CONTACT_FALLBACK.telegram),
    whatsapp: text(block.whatsapp, CONTACT_FALLBACK.whatsapp),
    instagram: text(block.instagram, CONTACT_FALLBACK.instagram),
    facebook: text(block.facebook, CONTACT_FALLBACK.facebook),
  };
}

/** Blank lines separate paragraphs; single lines separate list items. */
export function toParagraphs(value: string): string[] {
  return value
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export function toLines(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}
