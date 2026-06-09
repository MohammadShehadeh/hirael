import Link from "next/link"
import type { Metadata } from "next"
import { ArrowRight, ArrowUpRight } from "lucide-react"

import { BlockCategories } from "@/components/showcase/block-categories"
import { InstallBlock } from "@/components/showcase/install-block"
import { SiteFooter } from "@/components/showcase/site-footer"
import { SiteHeader } from "@/components/showcase/site-header"
import { SITE } from "@/lib/site"
import { RegistryDemo } from "@/registry/hirael/registry-demos"
import {
  BLOCK_KIND_ORDER,
  BLOCKS_BY_KIND,
  REGISTRY,
  REGISTRY_BY_CATEGORY,
  REGISTRY_BY_NAME,
} from "@/registry/hirael/registry-meta"
import { Marquee } from "@/registry/hirael/ui/marquee"

export const metadata: Metadata = {
  title: `${SITE.name} — ${SITE.description}`,
  description: SITE.longDescription,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.description}`,
    description: SITE.longDescription,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${SITE.name} — ${SITE.description}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.description}`,
    description: SITE.longDescription,
    creator: SITE.twitterHandle,
    site: SITE.twitterHandle,
    images: ["/opengraph-image"],
  },
}

export default function LandingPage() {
  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <LiveRegistry />
        <CategoryGrid />
      </main>
      <SiteFooter />
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Hero                                                                       */
/* -------------------------------------------------------------------------- */

function CornerMarks() {
  return (
    <>
      <span aria-hidden className="corner-mark -left-1.5 -top-1.5" />
      <span aria-hidden className="corner-mark -right-1.5 -top-1.5" />
      <span aria-hidden className="corner-mark -bottom-1.5 -left-1.5" />
      <span aria-hidden className="corner-mark -bottom-1.5 -right-1.5" />
    </>
  )
}

function Hero() {
  const components = REGISTRY.filter((r) => r.category !== "blocks")
  const stable = components.filter((r) => r.status === "stable").length
  const blocks = REGISTRY_BY_CATEGORY.blocks.length

  return (
    <section className="relative flex min-h-[calc(100svh-3.5rem)] items-center overflow-hidden">
      <span aria-hidden className="ambient-halo" />
      <div
        aria-hidden
        className="bg-dot-grid pointer-events-none absolute inset-0 opacity-25"
        style={{
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 30%, black 20%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 30%, black 20%, transparent 75%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <div className="relative mx-auto flex flex-col items-center gap-6 border border-border bg-background/30 px-6 py-14 text-center sm:gap-7 sm:py-20 md:py-24">
          <CornerMarks />

          <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/40 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground backdrop-blur-md">
            <span className="state-dot" />
            <span>Live</span>
          </span>

          <h1
            className="text-balance text-4xl leading-[1.02] sm:text-5xl md:text-6xl lg:text-7xl"
            style={{ fontFamily: "var(--font-cormorant), ui-serif, serif" }}
          >
            <span
              className="font-semibold"
              style={{ letterSpacing: "-0.025em" }}
            >
              Tools
            </span>{" "}
            <span
              className="font-normal text-muted-foreground"
              style={{ letterSpacing: "0.005em" }}
            >
              for
            </span>{" "}
            <span
              className="font-semibold"
              style={{ letterSpacing: "-0.025em" }}
            >
              builders
            </span>
            <br />
            <span
              className="font-normal text-muted-foreground"
              style={{ letterSpacing: "0.005em" }}
            >
              who think in
            </span>{" "}
            <span
              className="font-semibold"
              style={{ letterSpacing: "-0.025em" }}
            >
              systems.
            </span>
          </h1>

          <p className="max-w-xl text-balance text-sm text-muted-foreground sm:text-base">
            A component registry for the pieces every real product needs —{" "}
            {stable} components and {blocks} section blocks, distributed via
            the shadcn CLI. Minimal. Thoughtful. Built to last.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <Link
              href="/components"
              className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-foreground bg-foreground px-4 text-sm font-medium text-background transition-colors hover:bg-foreground/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cool focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Components
            </Link>
            <Link
              href="/blocks"
              className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:border-foreground/40 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cool focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Blocks
            </Link>
          </div>

          <div className="w-full max-w-md pt-2">
            <InstallBlock
              name="multi-select"
              className="glass-panel border-0"
            />
          </div>

          <div
            aria-hidden
            className="w-full max-w-2xl pt-4 [mask-image:linear-gradient(to_right,transparent,black_18%,black_82%,transparent)]"
          >
            <Marquee pauseOnHover duration={45} gap="2.5rem">
              {components
                .filter((c) => c.status === "stable")
                .map((c) => (
                  <span
                    key={c.name}
                    className="whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground"
                  >
                    /{c.name}
                  </span>
                ))}
            </Marquee>
          </div>
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* Live registry — real demos, rendered on the landing page                   */
/* -------------------------------------------------------------------------- */

const LIVE_DEMOS = [
  "multi-select",
  "rating",
  "animated-number",
  "copy-button",
] as const

function LiveRegistry() {
  const stableCount = REGISTRY.filter(
    (r) => r.category !== "blocks" && r.status === "stable"
  ).length

  return (
    <section className="relative">
      <hr className="rule-gradient" />
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <header className="mb-10 flex flex-col gap-2 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-2">
            <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              <span className="text-foreground/90">/01</span>
              <span className="h-px w-4 bg-border" />
              Live registry
            </span>
            <h2
              className="text-balance text-2xl tracking-[-0.02em] sm:text-3xl"
              style={{ fontFamily: "var(--font-cormorant), ui-serif, serif" }}
            >
              <span className="font-semibold">Real components,</span>{" "}
              <span className="font-normal text-muted-foreground">
                running live.
              </span>
            </h2>
          </div>
          <div className="flex items-center gap-4 self-start sm:self-auto">
            <span className="font-mono text-[10px] tabular-nums uppercase tracking-[0.08em] text-muted-foreground">
              {LIVE_DEMOS.length} of {stableCount} · the exact source the CLI
              installs
            </span>
            <Link
              href="/components"
              className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground transition-colors hover:text-foreground"
            >
              See all
              <ArrowRight className="size-3" />
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-md border border-border bg-border md:grid-cols-2">
          {LIVE_DEMOS.map((name) => {
            const entry = REGISTRY_BY_NAME[name]
            if (!entry) return null
            return (
              <article key={name} className="flex flex-col bg-card">
                <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-2.5 sm:px-5">
                  <div className="flex items-baseline gap-3">
                    <h3 className="text-sm font-medium tracking-[-0.01em]">
                      {entry.title}
                    </h3>
                    <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground">
                      /{entry.name}
                    </span>
                  </div>
                  <Link
                    href={`/${entry.name}`}
                    aria-label={`Open ${entry.title} docs`}
                    className="inline-flex size-6 shrink-0 items-center justify-center rounded-sm border border-border text-muted-foreground transition-colors hover:border-foreground/40 hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <ArrowUpRight className="size-3" />
                  </Link>
                </div>
                <div className="flex min-h-[280px] flex-1 items-center justify-center p-6 sm:p-8">
                  <RegistryDemo name={entry.name} />
                </div>
              </article>
            )
          })}
        </div>

        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Not screenshots — click around. Every demo is the shipped source.
        </p>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* Section blocks grid                                                        */
/* -------------------------------------------------------------------------- */

function CategoryGrid() {
  const blocksTotal = BLOCK_KIND_ORDER.reduce(
    (sum, k) => sum + BLOCKS_BY_KIND[k].length,
    0
  )

  return (
    <section className="relative">
      <hr className="rule-gradient" />
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <header className="mb-10 flex flex-col gap-2 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-2">
            <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              <span className="text-foreground/90">/02</span>
              <span className="h-px w-4 bg-border" />
              Section blocks
            </span>
            <h2
              className="text-balance text-2xl tracking-[-0.02em] sm:text-3xl"
              style={{ fontFamily: "var(--font-cormorant), ui-serif, serif" }}
            >
              <span className="font-semibold">Compose</span>{" "}
              <span className="font-normal text-muted-foreground">
                full pages, faster.
              </span>
            </h2>
          </div>
          <div className="flex items-center gap-4 self-start sm:self-auto">
            <span className="font-mono text-[10px] tabular-nums uppercase tracking-[0.08em] text-muted-foreground">
              {blocksTotal} blocks · {BLOCK_KIND_ORDER.length} categories
            </span>
            <Link
              href="/blocks"
              className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground transition-colors hover:text-foreground"
            >
              See all
              <ArrowRight className="size-3" />
            </Link>
          </div>
        </header>

        <BlockCategories variant="indexed" />
      </div>
    </section>
  )
}
