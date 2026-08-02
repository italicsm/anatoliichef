import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
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
  description: "Private Chef in Valencia",
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
        {children}
      </body>
    </html>
  );
}
