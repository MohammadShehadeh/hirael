import {
  DM_Sans,
  Figtree,
  Geist,
  IBM_Plex_Sans,
  Instrument_Sans,
  Inter,
  Manrope,
  Noto_Sans,
  Outfit,
  Space_Grotesk,
} from "next/font/google";

/**
 * Sans-serif options for the Customizer's Font picker. Inter is the site
 * font and is preloaded from the root layout; the alternatives are declared
 * here with `preload: false` so their @font-face rules exist but no bytes
 * download until a visitor actually picks one. The Customizer applies a
 * choice by writing `font.style.fontFamily` to `--font-sans-active`, which
 * `--font-sans` in globals.css falls through to Inter without.
 */
export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geist = Geist({ subsets: ["latin"], preload: false });
const manrope = Manrope({ subsets: ["latin"], preload: false });
const figtree = Figtree({ subsets: ["latin"], preload: false });
const dmSans = DM_Sans({ subsets: ["latin"], preload: false });
const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  preload: false,
});
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], preload: false });
const outfit = Outfit({ subsets: ["latin"], preload: false });
const instrumentSans = Instrument_Sans({ subsets: ["latin"], preload: false });
const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  preload: false,
});

export interface FontOption {
  name: string;
  title: string;
  /** `font-family` value from next/font, ready for a CSS custom property. */
  family: string;
}

export const FONTS: FontOption[] = [
  { name: "inter", title: "Inter", family: inter.style.fontFamily },
  { name: "geist", title: "Geist", family: geist.style.fontFamily },
  { name: "manrope", title: "Manrope", family: manrope.style.fontFamily },
  { name: "figtree", title: "Figtree", family: figtree.style.fontFamily },
  { name: "dm-sans", title: "DM Sans", family: dmSans.style.fontFamily },
  {
    name: "ibm-plex-sans",
    title: "IBM Plex Sans",
    family: ibmPlexSans.style.fontFamily,
  },
  {
    name: "space-grotesk",
    title: "Space Grotesk",
    family: spaceGrotesk.style.fontFamily,
  },
  { name: "outfit", title: "Outfit", family: outfit.style.fontFamily },
  {
    name: "instrument-sans",
    title: "Instrument Sans",
    family: instrumentSans.style.fontFamily,
  },
  { name: "noto-sans", title: "Noto Sans", family: notoSans.style.fontFamily },
];

export const FONT_BY_NAME: Record<string, FontOption> = Object.fromEntries(
  FONTS.map((font) => [font.name, font]),
);
