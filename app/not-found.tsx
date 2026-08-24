import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getRepoStars } from "@/lib/github";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you were looking for could not be found.",
  robots: { index: false, follow: false },
};

export default async function NotFound() {
  const stars = await getRepoStars();
  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader stars={stars} />
      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        <section className="relative overflow-hidden">
          <div aria-hidden className="ambient-halo" />
          <div
            aria-hidden
            className="bg-dot-grid pointer-events-none absolute inset-0 opacity-40 mask-[radial-gradient(ellipse_60%_45%_at_50%_0%,black,transparent_75%)]"
          />
          <div className="relative container flex w-full flex-col items-center gap-6 py-24 text-center sm:py-28 lg:py-36">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3.5 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground backdrop-blur-sm">
              <span
                aria-hidden
                className="size-1 rounded-full bg-muted-foreground"
              />
              404 · Not found
            </span>

            <h1 className="text-display text-4xl leading-[1.04] sm:text-6xl md:text-7xl">
              This page isn&apos;t in the registry.
            </h1>

            <p className="max-w-md text-base text-muted-foreground sm:text-lg">
              The link may be broken, or the page may have moved. Everything
              Hirael ships is still a click away.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
              <Link
                href="/"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <ArrowLeft className="size-4 rtl:rotate-180" />
                Back to home
              </Link>
              <Link
                href="/components"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-card/60 px-6 text-sm font-medium text-foreground backdrop-blur-sm transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Browse components
                <ArrowRight className="size-4 rtl:rotate-180" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
