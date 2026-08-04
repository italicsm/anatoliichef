import { Cormorant_Garamond, Inter, The_Nautigal } from "next/font/google";

/**
 * Every typeface decision lives here. Components never name a family — they
 * use the semantic utilities (font-sans, font-serif, font-signature), which
 * globals.css maps onto these variables. Swapping a family means editing this
 * file and nothing else.
 *
 * Roles:
 *   sans      — headings and interface: navigation, buttons, labels, prices
 *   serif     — the Hero tagline and the About quote
 *   signature — the logotype
 *
 * A display serif for headings was tried here (Newsreader, as a free stand-in
 * for Canela) and rolled back — headings stay on Inter. Re-enabling it means
 * adding the family below and one line in the @theme block.
 */

export const sans = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-cormorant",
});

/**
 * The Nautigal: a calligraphic script with fuller letterforms than Island
 * Moments, so it holds its shape at a slightly smaller size.
 *
 * Brittany Signature (the original request) is a paid licence; to use it,
 * drop the file into app/fonts/ and swap this for next/font/local — nothing
 * outside this file changes.
 *
 * Other candidates tried: Island Moments, Alex Brush, Italianno, Allura,
 * Sacramento.
 */
export const signature = The_Nautigal({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-nautigal",
});

/** Applied once on <body>. */
export const fontVariables = `${sans.className} ${sans.variable} ${serif.variable} ${signature.variable}`;
