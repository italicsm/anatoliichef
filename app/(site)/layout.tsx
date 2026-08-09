import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";
import CartDrawer from "../components/ui/CartDrawer";
import { CartProvider } from "../lib/cart-store";
import { getContactContent } from "../lib/site-content";

/**
 * The public shell. It lives in a route group so that /admin, which shares the
 * same root layout, does not inherit the site header, the footer or the cart —
 * the panel is a different application wearing the same typography.
 */
export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The header is a client component, so it cannot read the database itself.
  // Passing the links down keeps the mobile panel on the same source as the
  // rest of the site instead of a hardcoded copy.
  const contact = await getContactContent();

  return (
    <CartProvider>
      <Header
        social={{
          telegram: contact.telegram,
          whatsapp: contact.whatsapp,
          instagram: contact.instagram,
          facebook: contact.facebook,
        }}
      />
      {children}
      <Footer />
      <CartDrawer />
    </CartProvider>
  );
}
