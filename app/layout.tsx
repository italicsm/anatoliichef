import type { Metadata } from "next";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import CartDrawer from "./components/ui/CartDrawer";
import { fontVariables } from "./fonts";
import { CartProvider } from "./lib/cart-store";
import "./globals.css";

export const metadata: Metadata = {
  title: "Anatolii Lukianchuk",
  description: "Private Chef in Barcelona",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${fontVariables} min-h-screen`}
      >
        <CartProvider>
          <Header />
          {children}
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
