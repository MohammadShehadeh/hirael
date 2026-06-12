"use client"

import { Cormorant_Garamond, Geist_Mono, Inter } from "next/font/google"
import { RefreshCw } from "lucide-react"
import "./globals.css"

import { LogoMark } from "@/components/showcase/logo"

// global-error replaces the root layout, so it has to bring its own document
// and fonts. We mirror the root layout's setup so the fallback still reads as
// Hirael instead of falling back to the browser's default serif.
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

export default function GlobalError() {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${geistMono.variable} ${cormorant.variable} antialiased`}
      >
        <main className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background px-6 text-center text-foreground">
          <LogoMark className="size-8" />

          <div className="flex flex-col items-center gap-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Something went wrong
            </span>
            <h1 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
              This page failed to load.
            </h1>
            <p className="max-w-sm text-balance text-sm text-muted-foreground">
              A new version may have just shipped. Refreshing the page usually
              clears it up.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <RefreshCw className="size-4" />
              Refresh page
            </button>
            {/* Plain anchor forces a full document load rather than a client
                navigation, which is what recovery needs here. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border bg-card px-5 text-sm font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Back to home
            </a>
          </div>
        </main>
      </body>
    </html>
  )
}
