import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import CartDrawer from "./components/ui/CartDrawer";
import { CartProvider } from "./lib/cart-store";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-title",
});

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
        className={`${inter.className} ${cormorant.variable} min-h-screen`}
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
