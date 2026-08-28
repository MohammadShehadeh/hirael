import { Inter, Instrument_Serif } from 'next/font/google';

export const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

export const instrumentSerif = Instrument_Serif({
  variable: '--font-instrument-serif',
  subsets: ['latin', 'latin-ext'],
  weight: '400',
  style: ['normal', 'italic'],
  display: 'swap',
});
