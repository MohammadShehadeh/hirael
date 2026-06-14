import type { Metadata, Viewport } from "next"
import { Cormorant_Garamond, Geist_Mono, Inter } from "next/font/google"
import Script from "next/script"
import "./globals.css"

import { ThemeProvider } from "@/components/showcase/theme-provider"
import { SITE } from "@/lib/site"
import { themePrehydrationScript } from "@/lib/theme"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} | ${SITE.description}`,
    template: `%s | ${SITE.name}`,
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
    title: `${SITE.name} | ${SITE.description}`,
    description: SITE.longDescription,
    siteName: SITE.name,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${SITE.name} | ${SITE.description}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} | ${SITE.description}`,
    description: SITE.longDescription,
    images: ["/opengraph-image"],
  },
  category: "technology",
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
  colorScheme: "light dark",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
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
        className={`${inter.variable} ${geistMono.variable} ${cormorant.variable} antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
