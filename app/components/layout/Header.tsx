"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getDictionary } from "../../lib/dictionary";
import type { Locale } from "../../lib/locale";
import type { NavItem } from "../../lib/navigation";
import Button from "../ui/Button";
import CartButton from "../ui/CartButton";
import Container from "../ui/Container";
import LanguageSwitcher from "../ui/LanguageSwitcher";
import Logo from "../ui/Logo";
import type { SocialName } from "../ui/SocialIcon";
import MobileMenu from "./MobileMenu";
import Nav from "./Nav";

const SCROLL_THRESHOLD = 16;

type HeaderProps = {
  locale: Locale;
  navItems: NavItem[];
  social?: Partial<Record<SocialName, string>>;
};

export default function Header({ locale, navItems, social }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const dictionary = getDictionary(locale);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > SCROLL_THRESHOLD);

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        isScrolled
          ? "border-zinc-200/70 bg-white/85 backdrop-blur"
          : "border-transparent bg-transparent"
      }`}
    >
      <Container>
        {/* The container caps at 1280px, so the desktop row has one width to
            fit into no matter how wide the screen is. It only appears from xl,
            where the longest language still leaves slack; below that the
            burger holds everything. */}
        <div className="flex h-20 items-center justify-between gap-6">
          <Link href={`/${locale}`} aria-label={dictionary.header.home}>
            <Logo size="sm" className="xl:hidden" />
            <Logo size="md" className="hidden xl:inline-block" />
          </Link>

          <Nav items={navItems} className="hidden shrink-0 xl:block" />

          <div className="hidden items-center gap-6 xl:flex">
            <CartButton locale={locale} />
            <LanguageSwitcher locale={locale} compact />
            <Button
              href={`/${locale}#contact`}
              size="sm"
              className="whitespace-nowrap text-sm uppercase tracking-[0.15em]"
            >
              {dictionary.header.reserve}
            </Button>
          </div>

          {/* The cart stays reachable on small screens; everything else moves
              into the panel. */}
          <div className="flex items-center gap-5 xl:hidden">
            <CartButton locale={locale} />
            <MobileMenu locale={locale} navItems={navItems} social={social} />
          </div>
        </div>
      </Container>
    </header>
  );
}
