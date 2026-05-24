import type { Metadata } from "next"
import { Cormorant_Garamond, Geist_Mono, Inter } from "next/font/google"
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
})

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} — ${SITE.description}`,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.longDescription,
  authors: [{ name: SITE.author, url: SITE.authorUrl }],
  creator: SITE.author,
  openGraph: {
    type: "website",
    title: `${SITE.name} — ${SITE.description}`,
    description: SITE.longDescription,
    siteName: SITE.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.description}`,
    description: SITE.longDescription,
  },
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
      </head>
      <body
        className={`${inter.variable} ${geistMono.variable} ${cormorant.variable} antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
