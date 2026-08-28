import { Cairo, Inter, Manrope } from 'next/font/google';

export const inter = Inter({
  variable: '--font-novael-sans',
  subsets: ['latin'],
  display: 'swap',
});

export const manrope = Manrope({
  variable: '--font-novael-display',
  subsets: ['latin'],
  display: 'swap',
});

export const cairo = Cairo({
  variable: '--font-novael-arabic',
  subsets: ['arabic', 'latin'],
  display: 'swap',
});
