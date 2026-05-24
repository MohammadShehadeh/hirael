import Link from "next/link"
import type { Metadata } from "next"
import { ArrowRight } from "lucide-react"

import { BlockCategories } from "@/components/showcase/block-categories"
import { InstallBlock } from "@/components/showcase/install-block"
import { SiteFooter } from "@/components/showcase/site-footer"
import { SiteHeader } from "@/components/showcase/site-header"
import { SITE } from "@/lib/site"
import {
  BLOCKS_BY_KIND,
  REGISTRY,
  REGISTRY_BY_CATEGORY,
  type BlockKind,
} from "@/registry/msh-ui/registry-meta"

export const metadata: Metadata = {
  title: `${SITE.name} — ${SITE.description}`,
  description: SITE.longDescription,
  openGraph: {
    title: `${SITE.name} — ${SITE.description}`,
    description: SITE.longDescription,
    type: "website",
  },
}

export default function LandingPage() {
  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
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
    <section className="relative">
      <div
        aria-hidden
        className="bg-dot-grid pointer-events-none absolute inset-0 opacity-40"
        style={{
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 30%, black 20%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 30%, black 20%, transparent 75%)",
        }}
      />

      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <div className="relative mx-auto flex flex-col items-center gap-6 border border-border bg-background/30 px-6 py-14 text-center sm:gap-7 sm:py-20 md:py-24">
          <CornerMarks />

          <h1
            className="text-balance text-3xl leading-[1.05] tracking-[-0.025em] sm:text-4xl md:text-5xl lg:text-6xl"
            style={{ fontFamily: "var(--font-fraunces), ui-serif, serif" }}
          >
            <span className="font-normal text-muted-foreground">
              Production-grade
            </span>{" "}
            <span className="font-semibold">shadcn pieces</span>
            <br />
            <span className="font-normal text-muted-foreground">for</span>{" "}
            <span className="font-semibold">real</span>{" "}
            <span className="font-normal text-muted-foreground">&amp;</span>{" "}
            <span className="font-semibold">shipped</span>{" "}
            <span className="font-normal text-muted-foreground">products.</span>
          </h1>

          <p className="max-w-xl text-balance text-sm text-muted-foreground sm:text-base">
            The {stable} components shadcn doesn&apos;t ship plus {blocks}{" "}
            section blocks — distributed via the shadcn CLI, copied straight
            into your repo. Zero runtime dependency.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <Link
              href="/components"
              className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-foreground bg-foreground px-4 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
            >
              Components
            </Link>
            <Link
              href="/blocks"
              className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:border-foreground/40 hover:bg-accent"
            >
              Blocks
            </Link>
          </div>

          <div className="w-full max-w-md pt-2">
            <InstallBlock name="multi-select" />
          </div>
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* Section blocks grid                                                        */
/* -------------------------------------------------------------------------- */

const BLOCK_ORDER: BlockKind[] = [
  "hero",
  "feature",
  "pricing",
  "testimonial",
  "cta",
  "faq",
  "login",
  "header",
  "footer",
  "not-found",
]

function CategoryGrid() {
  const blocksTotal = BLOCK_ORDER.reduce(
    (sum, k) => sum + BLOCKS_BY_KIND[k].length,
    0
  )

  return (
    <section className="border-t border-border">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <header className="mb-10 flex flex-col gap-2 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              ◆ Section blocks
            </span>
            <h2
              className="text-balance text-2xl tracking-[-0.02em] sm:text-3xl"
              style={{ fontFamily: "var(--font-fraunces), ui-serif, serif" }}
            >
              <span className="font-semibold">Compose</span>{" "}
              <span className="font-normal text-muted-foreground">
                full pages, faster.
              </span>
            </h2>
          </div>
          <div className="flex items-center gap-4 self-start sm:self-auto">
            <span className="font-mono text-[10px] tabular-nums uppercase tracking-[0.08em] text-muted-foreground">
              {blocksTotal} shipped · {BLOCK_ORDER.length} / 17 categories
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
