import Link from "next/link"
import type { Metadata } from "next"
import { ArrowRight, ArrowUpRight, Github } from "lucide-react"

import { InstallBlock } from "@/components/showcase/install-block"
import { SiteFooter } from "@/components/showcase/site-footer"
import { SiteHeader } from "@/components/showcase/site-header"
import { cn } from "@/lib/utils"
import { SITE } from "@/lib/site"
import {
  BLOCK_KIND_LABELS,
  BLOCKS_BY_KIND,
  CATEGORY_LABELS,
  REGISTRY,
  REGISTRY_BY_CATEGORY,
  type BlockKind,
  type ComponentCategory,
} from "@/registry/sabk/registry-meta"

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
        <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-6 border border-border bg-background/30 px-6 py-14 text-center sm:gap-7 sm:py-20 md:py-24">
          <CornerMarks />

          <div className="inline-flex items-center gap-1 rounded-full border border-border bg-card p-1 font-mono text-[10px] uppercase tracking-[0.12em]">
            <span className="rounded-full bg-foreground px-2.5 py-0.5 text-background">
              v{SITE.version}
            </span>
            <a
              href={`${SITE.githubUrl}/releases`}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1 px-2.5 py-0.5 text-muted-foreground transition-colors hover:text-foreground"
            >
              View changelog
              <ArrowUpRight className="size-2.5" />
            </a>
          </div>

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
              className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:border-foreground/40 hover:bg-accent"
            >
              Explore
            </Link>
            <a
              href={SITE.githubUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Github className="size-3.5" />
              Star on GitHub
            </a>
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
/* Category grid — every category is a card with a wireframe preview          */
/* -------------------------------------------------------------------------- */

const COMPONENT_CATEGORY_ORDER: ComponentCategory[] = [
  "inputs",
  "pickers",
  "files",
  "data",
  "display",
]

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

type CardLayout = {
  /** Where the title sits relative to the preview */
  align: "left" | "right" | "top" | "bottom" | "center"
}

const COMPONENT_LAYOUT: Record<ComponentCategory, CardLayout> = {
  inputs: { align: "left" },
  pickers: { align: "right" },
  files: { align: "top" },
  data: { align: "bottom" },
  display: { align: "left" },
  blocks: { align: "left" },
}

const BLOCK_LAYOUT: Record<BlockKind, CardLayout> = {
  hero: { align: "top" },
  feature: { align: "top" },
  pricing: { align: "right" },
  testimonial: { align: "top" },
  cta: { align: "left" },
  faq: { align: "bottom" },
  login: { align: "left" },
  header: { align: "center" },
  footer: { align: "top" },
  "not-found": { align: "center" },
}

function CategoryGrid() {
  const componentCards = COMPONENT_CATEGORY_ORDER.map((cat) => ({
    key: `c-${cat}`,
    href: "/components",
    title: CATEGORY_LABELS[cat],
    count: REGISTRY_BY_CATEGORY[cat].length,
    suffix: "components",
    layout: COMPONENT_LAYOUT[cat],
    preview: <ComponentPreview category={cat} />,
  }))

  const blockCards = BLOCK_ORDER.map((kind) => ({
    key: `b-${kind}`,
    href: `/blocks#${kind}`,
    title: BLOCK_KIND_LABELS[kind],
    count: BLOCKS_BY_KIND[kind].length,
    suffix: "blocks",
    layout: BLOCK_LAYOUT[kind],
    preview: <BlockPreview kind={kind} />,
  }))

  const cards = [...componentCards, ...blockCards]

  return (
    <section className="border-t border-border">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-foreground">
            Browse the catalog
          </h2>
          <Link
            href="/components"
            className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground transition-colors hover:text-foreground"
          >
            See everything
            <ArrowRight className="size-3" />
          </Link>
        </div>

        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <li key={card.key} className="h-32">
              <Link
                href={card.href}
                className="group relative flex h-full w-full overflow-hidden rounded-md border border-border bg-card p-4 transition-colors hover:border-foreground/40 hover:bg-accent"
              >
                <CardBody
                  title={card.title}
                  count={card.count}
                  suffix={card.suffix}
                  layout={card.layout}
                  preview={card.preview}
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function CardBody({
  title,
  count,
  suffix,
  layout,
  preview,
}: {
  title: string
  count: number
  suffix: string
  layout: CardLayout
  preview: React.ReactNode
}) {
  const meta = (
    <div className="flex flex-col gap-0.5 leading-tight">
      <h3 className="text-sm font-semibold tracking-[-0.01em] text-foreground">
        {title}
      </h3>
      <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
        {count} {suffix}
      </p>
    </div>
  )

  switch (layout.align) {
    case "left":
      return (
        <>
          <div className="flex shrink-0 flex-col justify-between">{meta}</div>
          <div className="ml-auto flex w-1/2 items-center justify-end">
            {preview}
          </div>
        </>
      )
    case "right":
      return (
        <>
          <div className="flex w-1/2 items-center">{preview}</div>
          <div className="ml-auto flex shrink-0 flex-col justify-between text-right">
            {meta}
          </div>
        </>
      )
    case "top":
      return (
        <div className="flex w-full flex-col gap-3">
          <div className="text-center">{meta}</div>
          <div className="flex flex-1 items-end justify-center">{preview}</div>
        </div>
      )
    case "bottom":
      return (
        <div className="flex w-full flex-col gap-3">
          <div className="flex flex-1 items-start justify-center">
            {preview}
          </div>
          <div className="text-center">{meta}</div>
        </div>
      )
    case "center":
    default:
      return (
        <div className="relative flex w-full items-center justify-center">
          <div className="absolute inset-x-0 flex justify-center">{preview}</div>
          <div className="relative z-10 rounded-sm bg-card px-2 py-0.5">
            {meta}
          </div>
        </div>
      )
  }
}

/* -------------------------------------------------------------------------- */
/* Wireframe skeletons                                                        */
/* -------------------------------------------------------------------------- */

const SKEL_DARK = "rounded-sm bg-foreground/15"
const SKEL_BORDER = "rounded-sm border border-border bg-background"

function ComponentPreview({ category }: { category: ComponentCategory }) {
  switch (category) {
    case "inputs":
      return (
        <div className="flex w-full max-w-[140px] flex-col gap-1.5">
          <div className={cn(SKEL_BORDER, "h-5 w-full px-1.5 py-1")}>
            <div className={cn(SKEL_DARK, "h-2 w-12")} />
          </div>
          <div className="flex gap-1">
            <span className={cn(SKEL_DARK, "h-3.5 w-10 rounded-full")} />
            <span className={cn(SKEL_DARK, "h-3.5 w-8 rounded-full")} />
            <span className={cn(SKEL_DARK, "h-3.5 w-6 rounded-full")} />
          </div>
        </div>
      )
    case "pickers":
      return (
        <div className={cn(SKEL_BORDER, "grid grid-cols-4 gap-0.5 p-1.5")}>
          {Array.from({ length: 12 }).map((_, i) => (
            <span
              key={i}
              className={cn(
                "size-2.5 rounded-[2px]",
                i === 6 ? "bg-foreground" : "bg-muted"
              )}
            />
          ))}
        </div>
      )
    case "files":
      return (
        <div
          className={cn(
            "flex h-14 w-24 flex-col items-center justify-center gap-1 rounded-md border border-dashed border-border bg-background"
          )}
        >
          <span className={cn(SKEL_DARK, "h-1.5 w-10")} />
          <span className={cn(SKEL_DARK, "h-1 w-6 opacity-60")} />
        </div>
      )
    case "data":
      return (
        <div className="flex w-full max-w-[160px] flex-col gap-0.5">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span className={cn(SKEL_DARK, "h-1.5 w-8")} />
              <span className={cn(SKEL_DARK, "h-1.5 flex-1 opacity-60")} />
              <span className={cn(SKEL_DARK, "h-1.5 w-6 opacity-60")} />
            </div>
          ))}
        </div>
      )
    case "display":
    default:
      return (
        <div className={cn(SKEL_BORDER, "flex w-32 flex-col gap-1.5 p-2")}>
          <div className="flex items-center gap-1">
            <span className="size-3 rounded-full bg-foreground/80" />
            <span className={cn(SKEL_DARK, "h-1.5 w-12")} />
          </div>
          <span className={cn(SKEL_DARK, "h-1 w-full opacity-60")} />
          <span className={cn(SKEL_DARK, "h-1 w-3/4 opacity-60")} />
        </div>
      )
  }
}

function BlockPreview({ kind }: { kind: BlockKind }) {
  switch (kind) {
    case "hero":
      return (
        <div className="flex w-full max-w-[180px] flex-col items-center gap-1.5">
          <span className={cn(SKEL_DARK, "h-2 w-32")} />
          <span className={cn(SKEL_DARK, "h-1.5 w-24 opacity-60")} />
          <div className="mt-1 flex gap-1">
            <span className="h-3.5 w-10 rounded-sm bg-foreground" />
            <span className={cn(SKEL_BORDER, "h-3.5 w-10")} />
          </div>
        </div>
      )
    case "feature":
      return (
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex flex-col items-center gap-0.5">
              <span className={cn(SKEL_BORDER, "size-5")} />
              <span className={cn(SKEL_DARK, "h-1 w-5 opacity-60")} />
            </div>
          ))}
        </div>
      )
    case "pricing":
      return (
        <div className="flex items-end gap-1">
          <div className={cn(SKEL_BORDER, "h-10 w-9")} />
          <div
            className={cn(SKEL_BORDER, "h-12 w-9 border-foreground/40")}
          />
          <div className={cn(SKEL_BORDER, "h-10 w-9")} />
        </div>
      )
    case "testimonial":
      return (
        <div className={cn(SKEL_BORDER, "flex w-full max-w-[180px] flex-col gap-1 p-2")}>
          <span className={cn(SKEL_DARK, "h-1 w-full opacity-50")} />
          <span className={cn(SKEL_DARK, "h-1 w-4/5 opacity-50")} />
          <div className="mt-1 flex items-center gap-1">
            <span className="size-3 rounded-full bg-foreground/70" />
            <span className={cn(SKEL_DARK, "h-1 w-10")} />
          </div>
        </div>
      )
    case "cta":
      return (
        <div className="flex w-full max-w-[140px] items-center gap-1.5">
          <div className="flex flex-1 flex-col gap-1">
            <span className={cn(SKEL_DARK, "h-1.5 w-20")} />
            <span className={cn(SKEL_DARK, "h-1 w-16 opacity-60")} />
          </div>
          <span className="h-4 w-12 rounded-sm bg-foreground" />
        </div>
      )
    case "faq":
      return (
        <div className="flex w-full max-w-[180px] flex-col divide-y divide-border rounded-sm border border-border">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center justify-between px-1.5 py-1">
              <span className={cn(SKEL_DARK, "h-1.5 w-16 opacity-70")} />
              <span className={cn(SKEL_DARK, "size-1.5 rounded-full")} />
            </div>
          ))}
        </div>
      )
    case "login":
      return (
        <div className={cn(SKEL_BORDER, "flex w-32 flex-col gap-1 p-2")}>
          <span className={cn(SKEL_DARK, "h-2 w-full")} />
          <span className={cn(SKEL_DARK, "h-2 w-full")} />
          <span className="h-2 w-full rounded-sm bg-foreground" />
        </div>
      )
    case "header":
      return (
        <div
          className={cn(SKEL_BORDER, "flex w-44 items-center gap-1 px-2 py-1")}
        >
          <span className="size-2 rounded-sm bg-foreground" />
          <div className="flex flex-1 items-center justify-center gap-1.5">
            <span className={cn(SKEL_DARK, "h-1 w-4 opacity-60")} />
            <span className={cn(SKEL_DARK, "h-1 w-4 opacity-60")} />
            <span className={cn(SKEL_DARK, "h-1 w-4 opacity-60")} />
          </div>
          <span className="h-2.5 w-7 rounded-sm bg-foreground" />
        </div>
      )
    case "footer":
      return (
        <div className="grid w-full max-w-[200px] grid-cols-4 gap-2">
          {[0, 1, 2, 3].map((col) => (
            <div key={col} className="flex flex-col gap-0.5">
              <span className={cn(SKEL_DARK, "h-1 w-full")} />
              <span className={cn(SKEL_DARK, "h-1 w-3/4 opacity-60")} />
              <span className={cn(SKEL_DARK, "h-1 w-3/4 opacity-60")} />
            </div>
          ))}
        </div>
      )
    case "not-found":
      return (
        <div className="flex items-baseline gap-1">
          <span
            className="font-semibold text-muted-foreground/40"
            style={{
              fontFamily: "var(--font-fraunces), ui-serif, serif",
              fontSize: 42,
              lineHeight: 1,
            }}
          >
            404
          </span>
        </div>
      )
    default:
      return null
  }
}
