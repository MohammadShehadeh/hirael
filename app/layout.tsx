import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, JetBrains_Mono, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

import { ThemeProvider } from "@/components/active-theme";
import { SITE } from "@/lib/site";
import { themePrehydrationScript } from "@/lib/theme";
import { TooltipProvider } from "@/registry/hirael/ui/tooltip";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jet-brains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
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
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE.url,
    title: `${SITE.description} - ${SITE.name}`,
    description: SITE.longDescription,
    siteName: SITE.name,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${SITE.description} - ${SITE.name}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.description} - ${SITE.name}`,
    description: SITE.longDescription,
    images: ["/opengraph-image"],
  },
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F4F2EC" },
    { media: "(prefers-color-scheme: dark)", color: "#0D1117" },
  ],
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className="scroll-smooth"
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: themePrehydrationScript() }}
        />

        <Script
          id="hirael-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: SITE.name,
              alternateName: ["Hirael", "shadcn registry"],
              description: SITE.longDescription,
              url: SITE.url,
              applicationCategory: "DeveloperApplication",
              operatingSystem: "Any",
              softwareVersion: SITE.version,
              isAccessibleForFree: true,
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              author: {
                "@type": "Person",
                name: SITE.author,
                url: SITE.authorUrl,
              },
              creator: {
                "@type": "Person",
                name: SITE.author,
                url: SITE.authorUrl,
              },
              sameAs: [SITE.githubUrl],
            }),
          }}
        />
      </head>
      <body
        className={`${inter.className} ${jetBrainsMono.variable} ${cormorant.variable} antialiased`}
      >
        <TooltipProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
