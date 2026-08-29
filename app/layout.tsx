import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, JetBrains_Mono } from 'next/font/google';
import './globals.css';

import { ThemeProvider } from '@/components/active-theme';
import { JsonLd } from '@/components/json-ld';
import { SkipLink } from '@/components/skip-link';
import { siteJsonLd } from '@/lib/seo';
import { SITE } from '@/lib/site';
import { customizerPrehydrationScript } from '@/lib/customizer';
import { inter } from '@/lib/fonts';
import { TooltipProvider } from '@/registry/hirael/bases/radix/ui/tooltip';

const jetBrainsMono = JetBrains_Mono({
  variable: '--font-jet-brains-mono',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
});

const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.description} - ${SITE.name}`,
    template: `%s - ${SITE.name}`,
  },
  description: SITE.longDescription,
  applicationName: SITE.name,
  keywords: [...SITE.keywords],
  authors: [{ name: SITE.author, url: SITE.authorUrl }],
  creator: SITE.author,
  publisher: SITE.author,
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE.url,
    title: `${SITE.description} - ${SITE.name}`,
    description: SITE.longDescription,
    siteName: SITE.name,
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: `${SITE.description} - ${SITE.name}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE.description} - ${SITE.name}`,
    description: SITE.longDescription,
    images: ['/opengraph-image'],
  },
  category: 'technology',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F4F2EC' },
    { media: '(prefers-color-scheme: dark)', color: '#0D1117' },
  ],
  colorScheme: 'light dark',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: customizerPrehydrationScript() }} />

        <JsonLd id="hirael-jsonld" data={siteJsonLd()} />

        {/* Machine-readable twins of the catalog, so an agent that lands on any
            page can find the registry without scraping it. */}
        <link rel="alternate" type="text/plain" title="llms.txt" href="/llms.txt" />
        <link rel="alternate" type="application/json" title="Registry catalog" href="/r/registry.json" />
      </head>
      <body className={`${inter.variable} ${jetBrainsMono.variable} ${cormorant.variable} font-sans antialiased`}>
        <SkipLink />
        <TooltipProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
