import { notFound } from "next/navigation";
import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";
import CartDrawer from "../components/ui/CartDrawer";
import { CartProvider } from "../lib/cart-store";
import { LOCALES, isLocale } from "../lib/locale";
import { getNavItems } from "../lib/navigation";
import { getContactContent } from "../lib/site-content";

/**
 * The public shell. It sits under [locale] so that /admin, which shares the
 * root layout, inherits neither the site header nor the language segment.
 */
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  // The header is a client component: it cannot read the database or await
  // anything, so both the navigation and the social links arrive as props.
  const [navItems, contact] = await Promise.all([
    getNavItems(locale),
    getContactContent(),
  ]);

  return (
    <CartProvider>
      <Header
        locale={locale}
        navItems={navItems}
        social={{
          telegram: contact.telegram,
          whatsapp: contact.whatsapp,
          instagram: contact.instagram,
          facebook: contact.facebook,
        }}
      />
      {children}
      <Footer locale={locale} />
      <CartDrawer locale={locale} />
    </CartProvider>
  );
}
