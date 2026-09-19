import { Barlow, Instrument_Serif } from 'next/font/google';

export const barlow = Barlow({
  variable: '--font-prism-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  display: 'swap',
});

export const instrumentSerif = Instrument_Serif({
  variable: '--font-prism-serif',
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  display: 'swap',
});
