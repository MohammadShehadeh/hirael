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
} from 'next/font/google';

export const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const geist = Geist({ subsets: ['latin'], preload: false });
const manrope = Manrope({ subsets: ['latin'], preload: false });
const figtree = Figtree({ subsets: ['latin'], preload: false });
const dmSans = DM_Sans({ subsets: ['latin'], preload: false });
const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  preload: false,
});
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], preload: false });
const outfit = Outfit({ subsets: ['latin'], preload: false });
const instrumentSans = Instrument_Sans({ subsets: ['latin'], preload: false });
const notoSans = Noto_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  preload: false,
});

export interface FontOption {
  name: string;
  title: string;
  family: string;
}

export const FONTS: FontOption[] = [
  { name: 'inter', title: 'Inter', family: inter.style.fontFamily },
  { name: 'geist', title: 'Geist', family: geist.style.fontFamily },
  { name: 'manrope', title: 'Manrope', family: manrope.style.fontFamily },
  { name: 'figtree', title: 'Figtree', family: figtree.style.fontFamily },
  { name: 'dm-sans', title: 'DM Sans', family: dmSans.style.fontFamily },
  {
    name: 'ibm-plex-sans',
    title: 'IBM Plex Sans',
    family: ibmPlexSans.style.fontFamily,
  },
  {
    name: 'space-grotesk',
    title: 'Space Grotesk',
    family: spaceGrotesk.style.fontFamily,
  },
  { name: 'outfit', title: 'Outfit', family: outfit.style.fontFamily },
  {
    name: 'instrument-sans',
    title: 'Instrument Sans',
    family: instrumentSans.style.fontFamily,
  },
  { name: 'noto-sans', title: 'Noto Sans', family: notoSans.style.fontFamily },
];

export const FONT_BY_NAME: Record<string, FontOption> = Object.fromEntries(FONTS.map((font) => [font.name, font]));
