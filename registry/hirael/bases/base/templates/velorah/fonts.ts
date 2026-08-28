import { Inter, Instrument_Serif } from 'next/font/google';

export const inter = Inter({
  variable: '--font-velorah-sans',
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
});

export const instrumentSerif = Instrument_Serif({
  variable: '--font-velorah-serif',
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  display: 'swap',
});
