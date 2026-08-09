import { notFound } from "next/navigation";
import About from "../components/sections/About";
import Contact from "../components/sections/Contact";
import Hero from "../components/sections/Hero";
import Menu from "../components/sections/Menu";
import { isLocale } from "../lib/locale";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return (
    <>
      <Hero locale={locale} />
      <Menu locale={locale} />
      <About locale={locale} />
      <Contact locale={locale} />
    </>
  );
}
