"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "../ui/Button";
import CartButton from "../ui/CartButton";
import Container from "../ui/Container";
import LanguageSwitcher from "../ui/LanguageSwitcher";
import Logo from "../ui/Logo";
import MobileMenu from "./MobileMenu";
import Nav from "./Nav";

const SCROLL_THRESHOLD = 16;

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

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
        <div className="flex h-20 items-center justify-between gap-6 md:gap-10">
          <Link href="/" aria-label="Anatolii Lukianchuk — home">
            <Logo size="sm" className="md:hidden" />
            <Logo size="md" className="hidden md:inline-block" />
          </Link>

          <Nav className="hidden md:block" />

          <div className="hidden items-center gap-8 md:flex">
            <CartButton />
            <LanguageSwitcher activeLocale="UA" />
            <Button
              href="/#contact"
              size="sm"
              className="whitespace-nowrap text-sm uppercase tracking-[0.15em]"
            >
              Reserve a Dinner
            </Button>
          </div>

          {/* The cart stays reachable on small screens; everything else moves
              into the panel. */}
          <div className="flex items-center gap-5 md:hidden">
            <CartButton />
            <MobileMenu />
          </div>
        </div>
      </Container>
    </header>
  );
}
