import { Cairo, Inter, Manrope } from 'next/font/google';

export const inter = Inter({
  variable: '--font-aurael-sans',
  subsets: ['latin'],
  display: 'swap',
});

export const manrope = Manrope({
  variable: '--font-aurael-display',
  subsets: ['latin'],
  display: 'swap',
});

export const cairo = Cairo({
  variable: '--font-aurael-arabic',
  subsets: ['arabic', 'latin'],
  display: 'swap',
});
