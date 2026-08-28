import { Inter, Instrument_Serif } from 'next/font/google';

export const inter = Inter({
  variable: '--font-asme-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const instrumentSerif = Instrument_Serif({
  variable: '--font-asme-serif',
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  display: 'swap',
});
