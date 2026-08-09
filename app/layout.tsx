import type { Metadata } from "next";
import { headers } from "next/headers";
import { fontVariables } from "./fonts";
import { DEFAULT_LOCALE, isLocale } from "./lib/locale";
import "./globals.css";

/**
 * Only the document itself: language, fonts, global stylesheet. The site shell
 * lives in [locale]/layout.tsx and the panel in admin/(panel)/layout.tsx, so
 * neither can leak into the other.
 */
export const metadata: Metadata = {
  title: "Anatolii Lukianchuk",
  description: "Private Chef in Barcelona",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Set by middleware from the URL segment; absent for /admin, which is
  // Ukrainian only.
  const requested = (await headers()).get("x-locale");
  const locale = requested && isLocale(requested) ? requested : DEFAULT_LOCALE;

  return (
    <html lang={locale}>
      <body className={`${fontVariables} min-h-screen`}>{children}</body>
    </html>
  );
}
