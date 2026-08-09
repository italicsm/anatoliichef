import type { Metadata } from "next";
import { fontVariables } from "./fonts";
import "./globals.css";

/**
 * Only the document itself: language, fonts, global stylesheet. The site shell
 * lives in (site)/layout.tsx and the panel in admin/(panel)/layout.tsx, so
 * neither can leak into the other.
 */
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
      <body className={`${fontVariables} min-h-screen`}>{children}</body>
    </html>
  );
}
