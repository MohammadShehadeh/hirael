"use client";

import { Cormorant_Garamond, Geist_Mono, Inter } from "next/font/google";
import { RefreshCw } from "lucide-react";
import "./globals.css";

import { LogoMark } from "@/components/showcase/logo";
import { Button } from "@/registry/hirael/ui/button";

// global-error replaces the root layout, so it has to bring its own document
// and fonts. We mirror the root layout's setup so the fallback still reads as
// Hirael instead of falling back to the browser's default serif.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export default function GlobalError() {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${geistMono.variable} ${cormorant.variable} antialiased`}
      >
        <main className="relative flex min-h-svh flex-col items-center justify-center gap-6 overflow-hidden bg-background px-6 text-center text-foreground">
          <div aria-hidden className="ambient-halo" />
          <div
            aria-hidden
            className="bg-dot-grid pointer-events-none absolute inset-0 opacity-40 mask-[radial-gradient(ellipse_55%_45%_at_50%_0%,black,transparent_75%)]"
          />

          <LogoMark className="relative size-8" />

          <div className="relative flex flex-col items-center gap-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Something went wrong
            </span>
            <h1 className="text-display text-balance text-3xl leading-[1.05] sm:text-4xl">
              This page failed to load.
            </h1>
            <p className="max-w-sm text-balance text-sm text-muted-foreground">
              An unexpected error occurred. Try refreshing the page or come back
              in a moment.
            </p>
          </div>

          <div className="relative flex flex-wrap items-center justify-center gap-3">
            <Button
              type="button"
              size="lg"
              onClick={() => window.location.reload()}
              className="h-11 rounded-full px-6 has-[>svg]:px-6"
            >
              <RefreshCw className="size-4" />
              Refresh page
            </Button>
            {/* Plain anchor forces a full document load rather than a client
                navigation, which is what recovery needs here. */}
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-11 rounded-full border-border bg-card/60 px-6 text-foreground backdrop-blur-sm hover:bg-accent hover:text-foreground dark:border-border dark:bg-card/60 dark:hover:bg-accent"
            >
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a href="/">Back to home</a>
            </Button>
          </div>
        </main>
      </body>
    </html>
  );
}
