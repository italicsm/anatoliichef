"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { getDictionary } from "../../lib/dictionary";
import type { Locale } from "../../lib/locale";
import type { NavItem } from "../../lib/navigation";
import Button from "../ui/Button";
import CloseButton from "../ui/CloseButton";
import Container from "../ui/Container";
import Eyebrow from "../ui/Eyebrow";
import LanguageSwitcher from "../ui/LanguageSwitcher";
import Logo from "../ui/Logo";
import type { SocialName } from "../ui/SocialIcon";
import SocialLinks from "../ui/SocialLinks";

type MobileMenuProps = {
  locale: Locale;
  navItems: NavItem[];
  className?: string;
  social?: Partial<Record<SocialName, string>>;
};

/**
 * Same native <dialog> approach as the cart drawer and the lightbox: Esc,
 * focus containment and an inert background come from the platform.
 *
 * The panel must be closed by hand when a link is followed — the hash links
 * navigate without unmounting anything, so the dialog would otherwise stay
 * open over the section the guest just asked for.
 */
export default function MobileMenu({
  locale,
  navItems,
  className = "",
  social,
}: MobileMenuProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const dictionary = getDictionary(locale);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    if (isOpen && !dialog.open) {
      dialog.showModal();
    }

    if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label={dictionary.header.openMenu}
        aria-expanded={isOpen}
        className={`p-2 text-zinc-800 transition-colors hover:text-zinc-500 ${className}`}
      >
        <svg
          width="24"
          height="12"
          viewBox="0 0 24 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          aria-hidden="true"
        >
          <path d="M0 1h24M0 11h24" />
        </svg>
      </button>

      <dialog
        ref={dialogRef}
        onClose={() => setIsOpen(false)}
        aria-label={dictionary.header.openMenu}
        className="menu-dialog fixed inset-0 m-0 h-full max-h-none w-full max-w-none bg-white p-0"
      >
        <div className="flex h-full flex-col">
          <Container className="flex h-20 shrink-0 items-center justify-between">
            <Logo size="sm" />

            <CloseButton
              onClick={() => setIsOpen(false)}
              label={dictionary.header.close}
            />
          </Container>

          <Container className="flex flex-1 flex-col justify-center overflow-y-auto py-10">
            <nav aria-label="Main">
              <ul>
                {navItems.map((item) => (
                  <li key={item.href} className="border-b border-zinc-200">
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="block py-5 text-2xl uppercase tracking-[0.15em] text-zinc-900"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mt-12">
              <Button
                href={`/${locale}#contact`}
                onClick={() => setIsOpen(false)}
                className="w-full text-sm uppercase tracking-[0.2em]"
              >
                {dictionary.header.reserve}
              </Button>
            </div>
          </Container>

          <Container className="shrink-0 border-t border-zinc-200 py-8">
            <div className="flex items-center justify-between gap-6">
              <div>
                <Eyebrow className="text-xs">
                  {dictionary.header.language}
                </Eyebrow>
                <LanguageSwitcher locale={locale} className="mt-3" />
              </div>

              <SocialLinks size="sm" links={social} />
            </div>
          </Container>
        </div>
      </dialog>
    </>
  );
}
