import Link from "next/link"
import type { Metadata } from "next"
import {
  ArrowRight,
  ArrowUpRight,
  Boxes,
  Download,
  Languages,
  Layers,
  MonitorSmartphone,
  SunMoon,
} from "lucide-react"

import { BlockCategories } from "@/components/showcase/block-categories"
import { InstallBlock } from "@/components/showcase/install-block"
import { SiteFooter } from "@/components/showcase/site-footer"
import { SiteHeader } from "@/components/showcase/site-header"
import { SITE } from "@/lib/site"
import { RegistryDemo } from "@/registry/hirael/registry-demos"
import {
  BLOCK_KIND_ORDER,
  BLOCKS_BY_KIND,
  COMPONENTS,
  REGISTRY_BY_NAME,
  entryHref,
} from "@/registry/hirael/registry-meta"

export const metadata: Metadata = {
  title: `${SITE.name} | ${SITE.description}`,
  description: SITE.longDescription,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} | ${SITE.description}`,
    description: SITE.longDescription,
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
}

export default function LandingPage() {
  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <LiveRegistry />
        <WhyHirael />
        <CategoryGrid />
      </main>
      <SiteFooter />
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Hero — borderless panel with contained texture                             */
/* -------------------------------------------------------------------------- */

function Hero() {
  return (
    <section className="relative px-4 pt-4 pb-2 sm:px-6 sm:pt-6 lg:px-8">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[1.75rem] border border-border bg-card/30 sm:rounded-[2rem]">
        {/* Texture lives inside the panel: soft drifting halo, then a masked dot grid. */}
        <div aria-hidden className="ambient-halo" />
        <div
          aria-hidden
          className="bg-dot-grid pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_60%_55%_at_50%_0%,black,transparent_80%)]"
        />

        <div className="relative mx-auto w-full max-w-3xl px-6 py-20 sm:py-24 lg:py-28">
          <div className="flex flex-col items-center gap-6 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/40 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground backdrop-blur-sm">
              <span aria-hidden className="size-1 rounded-full bg-muted-foreground" />
              shadcn-compatible registry
            </span>

            <h1 className="text-display text-balance text-5xl leading-[1.04] sm:text-6xl md:text-7xl">
              The components shadcn/ui{" "}
              <span className="italic text-foreground/90">doesn&apos;t</span> ship.
            </h1>

            <p className="max-w-xl text-balance text-base text-muted-foreground sm:text-lg">
              Multi-select, combobox, tag input, file dropzone, plus full
              section blocks. Install them with the shadcn CLI and the source
              lands in your repo. No package to update, no runtime dependency.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
              <Link
                href="/components"
                className="group inline-flex h-11 items-center gap-2 rounded-full bg-primary ps-6 pe-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Browse components
                <span className="flex size-7 items-center justify-center rounded-full bg-background/15 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5">
                  <ArrowRight className="size-4 rtl:rotate-180" />
                </span>
              </Link>
              <Link
                href="/blocks"
                className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-card/60 px-6 text-sm font-medium text-foreground backdrop-blur-sm transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Browse blocks
              </Link>
            </div>

            <div className="w-full max-w-md pt-4">
              <InstallBlock name="multi-select" />
            </div>
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
  const componentCount = COMPONENTS.length

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
            <h2 className="text-display text-balance text-3xl sm:text-4xl">
              Working demos, not screenshots.
            </h2>
          </div>
          <div className="flex items-center gap-4 self-start sm:self-auto">
            <span className="font-mono text-[10px] tabular-nums uppercase tracking-[0.08em] text-muted-foreground">
              {LIVE_DEMOS.length} of {componentCount} components
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

        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border shadow-elevated md:grid-cols-2">
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
                    href={entryHref(entry)}
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
          Click around. Each demo runs the same source the CLI installs.
        </p>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* Why Hirael — blueprint grid of what a source-first registry gives you       */
/* -------------------------------------------------------------------------- */

const FEATURES: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  body: string
  visual?: "terminal" | "stack" | "swatches"
}[] = [
  {
    icon: Download,
    title: "Copies into your repo",
    body: "The CLI writes the source into your project. Nothing in node_modules, no version to bump.",
    visual: "terminal",
  },
  {
    icon: Layers,
    title: "Any React stack",
    body: "Next, Remix, Vite, Astro. Anywhere React and Tailwind already run.",
    visual: "stack",
  },
  {
    icon: Boxes,
    title: "Built on shadcn",
    body: "Radix primitives, shadcn conventions, your components.json. A peer, not a replacement.",
  },
  {
    icon: SunMoon,
    title: "Light and dark",
    body: "Theme-aware through CSS variables, so every item inherits your tokens in both modes.",
    visual: "swatches",
  },
  {
    icon: Languages,
    title: "RTL, no config",
    body: "Logical properties throughout, so dir=rtl works with nothing extra to wire up.",
  },
  {
    icon: MonitorSmartphone,
    title: "Responsive by default",
    body: "Built to hold their shape from small phones to ultra-wide displays.",
  },
]

function WhyHirael() {
  return (
    <section className="relative">
      <hr className="rule-gradient" />
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <header className="mb-12 flex flex-col gap-3 sm:mb-16">
          <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            <span className="text-foreground/90">/02</span>
            <span className="h-px w-4 bg-border" />
            Why Hirael
          </span>
          <h2 className="text-display text-balance text-3xl sm:text-4xl">
            Own the source, not a dependency.
          </h2>
          <p className="max-w-xl text-balance text-sm text-muted-foreground sm:text-base">
            Install with the shadcn CLI and the code lands in your repo, ready
            to read and change. Built the way shadcn ships its primitives.
          </p>
        </header>

        <div className="relative grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {FEATURES.map((feature) => {
            const Icon = feature.icon
            return (
              <article
                key={feature.title}
                className="group relative flex flex-col gap-5 rounded-2xl border border-border bg-card/40 px-6 pt-7 pb-6 backdrop-blur-sm transition-colors duration-200 hover:border-foreground/20 hover:bg-card/70"
              >
                {/* Soft glow from the top edge, contained to the card. */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(70%_55%_at_50%_0%,color-mix(in_oklch,var(--foreground)_6%,transparent),transparent)] opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                />

                {/* Glowing dashed medallion holding the icon. */}
                <span className="relative flex size-11 shrink-0 items-center justify-center rounded-full border border-dashed border-border bg-background">
                  <span
                    aria-hidden
                    className="absolute inset-0 scale-[1.6] rounded-full bg-[radial-gradient(circle,color-mix(in_oklch,var(--foreground)_14%,transparent),transparent_70%)] blur-md"
                  />
                  <Icon className="relative size-4 text-foreground/80" />
                </span>

                <div className="relative flex flex-col gap-1.5">
                  <h3 className="text-sm font-medium tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {feature.body}
                  </p>
                </div>

                {feature.visual && (
                  <div className="relative mt-auto pt-1">
                    <FeatureVisual kind={feature.visual} />
                  </div>
                )}
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function FeatureVisual({ kind }: { kind: "terminal" | "stack" | "swatches" }) {
  if (kind === "terminal") {
    return (
      <div className="flex items-center gap-2 overflow-hidden rounded-md border border-border bg-card px-3 py-2">
        <span aria-hidden className="font-mono text-[11px] text-muted-foreground">
          $
        </span>
        <code className="truncate font-mono text-[11px] text-foreground/90">
          npx shadcn@latest add{" "}
          <span className="text-muted-foreground">
            https://hirael.com/r/combobox.json
          </span>
        </code>
      </div>
    )
  }

  if (kind === "stack") {
    return (
      <div className="flex flex-wrap gap-1.5">
        {["Next", "Remix", "Vite", "Astro"].map((name) => (
          <span
            key={name}
            className="rounded-sm border border-border bg-card px-2 py-0.5 font-mono text-[10px] tracking-tight text-muted-foreground"
          >
            {name}
          </span>
        ))}
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1.5">
      {["bg-foreground", "bg-muted-foreground", "bg-secondary", "bg-background"].map(
        (swatch) => (
          <span
            key={swatch}
            className={`size-6 rounded-md border border-border ${swatch}`}
          />
        )
      )}
    </div>
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
              <span className="text-foreground/90">/03</span>
              <span className="h-px w-4 bg-border" />
              Section blocks
            </span>
            <h2 className="text-display text-balance text-3xl sm:text-4xl">
              Blocks for whole sections of a page.
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
