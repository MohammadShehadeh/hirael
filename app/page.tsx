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
        <div className="relative mx-auto flex flex-col items-center gap-6 border border-border bg-background/30 px-6 py-14 text-center sm:gap-7 sm:py-20 md:py-24">
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
  /** Tailwind col-span class for wide cards */
  span?: "1" | "2"
}

const COMPONENT_LAYOUT: Record<ComponentCategory, CardLayout> = {
  inputs: { align: "left", span: "2" },
  pickers: { align: "right" },
  files: { align: "top" },
  data: { align: "left", span: "2" },
  display: { align: "right" },
  blocks: { align: "left" },
}

const BLOCK_LAYOUT: Record<BlockKind, CardLayout> = {
  hero: { align: "top", span: "2" },
  feature: { align: "top" },
  pricing: { align: "top" },
  testimonial: { align: "right" },
  cta: { align: "left" },
  faq: { align: "bottom" },
  login: { align: "right" },
  header: { align: "top", span: "2" },
  footer: { align: "top", span: "2" },
  "not-found": { align: "center" },
}

function CategoryGrid() {
  const componentTotal = COMPONENT_CATEGORY_ORDER.reduce(
    (sum, c) => sum + REGISTRY_BY_CATEGORY[c].length,
    0
  )
  const blocksTotal = BLOCK_ORDER.reduce(
    (sum, k) => sum + BLOCKS_BY_KIND[k].length,
    0
  )

  return (
    <section className="border-t border-border">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <header className="mb-8 flex flex-col gap-2 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              ◆ Catalog
            </span>
            <h2
              className="text-balance text-2xl tracking-[-0.02em] sm:text-3xl"
              style={{ fontFamily: "var(--font-fraunces), ui-serif, serif" }}
            >
              <span className="font-semibold">Everything</span>{" "}
              <span className="font-normal text-muted-foreground">
                we ship.
              </span>
            </h2>
          </div>
          <Link
            href="/components"
            className="inline-flex items-center gap-1 self-start font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground transition-colors hover:text-foreground sm:self-auto"
          >
            See everything
            <ArrowRight className="size-3" />
          </Link>
        </header>

        <CatalogGroup
          label="Components"
          count={componentTotal}
          items={COMPONENT_CATEGORY_ORDER.map((cat) => ({
            key: `c-${cat}`,
            href: "/components",
            title: CATEGORY_LABELS[cat],
            count: REGISTRY_BY_CATEGORY[cat].length,
            suffix: "components",
            layout: COMPONENT_LAYOUT[cat],
            preview: <ComponentPreview category={cat} />,
          }))}
        />

        <div className="mt-10">
          <CatalogGroup
            label="Section blocks"
            count={blocksTotal}
            items={BLOCK_ORDER.map((kind) => ({
              key: `b-${kind}`,
              href: `/blocks#${kind}`,
              title: BLOCK_KIND_LABELS[kind],
              count: BLOCKS_BY_KIND[kind].length,
              suffix: "blocks",
              layout: BLOCK_LAYOUT[kind],
              preview: <BlockPreview kind={kind} />,
            }))}
          />
        </div>
      </div>
    </section>
  )
}

type CatalogItem = {
  key: string
  href: string
  title: string
  count: number
  suffix: string
  layout: CardLayout
  preview: React.ReactNode
}

function CatalogGroup({
  label,
  count,
  items,
}: {
  label: string
  count: number
  items: CatalogItem[]
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between">
        <h3 className="font-mono text-[11px] uppercase tracking-[0.14em] text-foreground">
          {label}
        </h3>
        <span className="font-mono text-[10px] tabular-nums uppercase tracking-[0.08em] text-muted-foreground">
          {count} total
        </span>
      </div>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((card) => (
          <li
            key={card.key}
            className={cn(
              "h-44",
              card.layout.span === "2" && "sm:col-span-2"
            )}
          >
            <Link
              href={card.href}
              className="group relative flex h-full w-full overflow-hidden rounded-md border border-border bg-card transition-colors hover:border-foreground/40 hover:bg-accent"
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

  const previewWrap = (
    <div className="relative flex h-full w-full items-center justify-center transition-transform duration-300 ease-out group-hover:scale-[1.03]">
      {preview}
    </div>
  )

  switch (layout.align) {
    case "left":
      return (
        <div className="grid h-full w-full grid-cols-[auto_1fr] items-stretch">
          <div className="z-10 flex shrink-0 flex-col justify-between p-4">
            {meta}
            <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground/80 group-hover:text-foreground">
              browse →
            </span>
          </div>
          <div className="relative overflow-hidden">{previewWrap}</div>
        </div>
      )
    case "right":
      return (
        <div className="grid h-full w-full grid-cols-[1fr_auto] items-stretch">
          <div className="relative overflow-hidden">{previewWrap}</div>
          <div className="z-10 flex shrink-0 flex-col items-end justify-between p-4 text-right">
            {meta}
            <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground/80 group-hover:text-foreground">
              browse →
            </span>
          </div>
        </div>
      )
    case "top":
      return (
        <div className="grid h-full w-full grid-rows-[auto_1fr]">
          <div className="z-10 flex items-center justify-between gap-3 px-4 pt-4">
            {meta}
            <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground/80 group-hover:text-foreground">
              browse →
            </span>
          </div>
          <div className="relative overflow-hidden px-4 pb-4 pt-3">
            {previewWrap}
          </div>
        </div>
      )
    case "bottom":
      return (
        <div className="grid h-full w-full grid-rows-[1fr_auto]">
          <div className="relative overflow-hidden px-4 pb-3 pt-4">
            {previewWrap}
          </div>
          <div className="z-10 flex items-center justify-between gap-3 px-4 pb-4">
            {meta}
            <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground/80 group-hover:text-foreground">
              browse →
            </span>
          </div>
        </div>
      )
    case "center":
    default:
      return (
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            {previewWrap}
          </div>
          <div className="relative z-10 rounded-md border border-border bg-card/90 px-3 py-1.5 backdrop-blur-sm">
            {meta}
          </div>
        </div>
      )
  }
}

/* -------------------------------------------------------------------------- */
/* Wireframe skeletons                                                        */
/* -------------------------------------------------------------------------- */

const SKEL_BORDER = "rounded-sm border border-border bg-background"
const SKEL_SOLID = "rounded-sm bg-foreground"

function Bar({
  w,
  className,
}: {
  w: string
  className?: string
}) {
  return (
    <span
      className={cn("block h-1.5 rounded-full bg-foreground/15", className)}
      style={{ width: w }}
    />
  )
}

function ComponentPreview({ category }: { category: ComponentCategory }) {
  switch (category) {
    case "inputs":
      return (
        <div className="flex w-full max-w-[260px] flex-col gap-2">
          {/* MultiSelect trigger with chips */}
          <div
            className={cn(SKEL_BORDER, "flex items-center gap-1 px-2 py-1.5")}
          >
            <span className="rounded-sm bg-foreground/10 px-1.5 py-0.5 text-[8px] font-medium text-foreground">
              react
            </span>
            <span className="rounded-sm bg-foreground/10 px-1.5 py-0.5 text-[8px] font-medium text-foreground">
              tailwind
            </span>
            <span className="rounded-sm bg-foreground/10 px-1.5 py-0.5 text-[8px] font-medium text-foreground">
              shadcn
            </span>
            <span className="ml-auto text-[10px] text-muted-foreground">
              ⌄
            </span>
          </div>
          {/* Popover dropdown */}
          <div
            className={cn(
              SKEL_BORDER,
              "flex flex-col gap-1 px-2 py-1.5 shadow-sm"
            )}
          >
            {["Next.js", "Radix", "Lucide"].map((label, i) => (
              <div key={label} className="flex items-center gap-1.5">
                <span
                  className={cn(
                    "size-2.5 shrink-0 rounded-[2px] border border-border",
                    i < 2 && "bg-foreground"
                  )}
                />
                <span className="text-[9px] text-muted-foreground">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )
    case "pickers":
      return (
        <div
          className={cn(SKEL_BORDER, "flex w-[150px] flex-col gap-1.5 p-2")}
        >
          <div className="flex items-center justify-between">
            <span className="text-[8px] font-medium text-foreground">May</span>
            <span className="text-[8px] text-muted-foreground">2026</span>
          </div>
          <div className="grid grid-cols-7 gap-[2px]">
            {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
              <span
                key={i}
                className="text-center text-[7px] text-muted-foreground/70"
              >
                {d}
              </span>
            ))}
            {Array.from({ length: 28 }).map((_, i) => {
              const inRange = i >= 9 && i <= 15
              const isStart = i === 9
              const isEnd = i === 15
              return (
                <span
                  key={i}
                  className={cn(
                    "flex h-3 items-center justify-center text-[7px]",
                    inRange ? "bg-foreground/15" : "",
                    isStart || isEnd
                      ? "rounded-sm bg-foreground text-background"
                      : "text-foreground/70"
                  )}
                >
                  {i + 1}
                </span>
              )
            })}
          </div>
        </div>
      )
    case "files":
      return (
        <div className="flex w-full max-w-[200px] flex-col items-center gap-1.5">
          <div className="flex h-16 w-full flex-col items-center justify-center gap-1 rounded-md border border-dashed border-border bg-background">
            <span className="text-[10px] text-muted-foreground">↑</span>
            <span className="text-[8px] font-medium text-foreground">
              Drop files here
            </span>
            <span className="text-[7px] text-muted-foreground/70">
              or click to browse
            </span>
          </div>
          <div
            className={cn(
              SKEL_BORDER,
              "flex w-full items-center gap-1.5 px-1.5 py-1"
            )}
          >
            <span className="size-3 rounded-sm bg-foreground/20" />
            <Bar w="50%" className="opacity-70" />
            <span className="ml-auto text-[8px] text-muted-foreground">
              82%
            </span>
          </div>
        </div>
      )
    case "data":
      return (
        <div
          className={cn(SKEL_BORDER, "flex w-full max-w-[320px] flex-col p-1.5")}
        >
          {/* table header */}
          <div className="flex items-center gap-3 border-b border-border px-1 pb-1">
            {["Name", "Status", "Updated"].map((h, i) => (
              <span
                key={h}
                className={cn(
                  "text-[8px] font-medium uppercase tracking-wider text-muted-foreground",
                  i === 0 && "flex-1"
                )}
              >
                {h}
              </span>
            ))}
          </div>
          {/* rows */}
          {[
            { name: "MultiSelect", status: "stable" },
            { name: "YearPicker", status: "stable" },
            { name: "TagInput", status: "stable" },
            { name: "ColorPicker", status: "soon" },
          ].map((row) => (
            <div
              key={row.name}
              className="flex items-center gap-3 border-b border-border/60 px-1 py-1 last:border-0"
            >
              <span className="flex-1 text-[8px] font-medium text-foreground">
                {row.name}
              </span>
              <span
                className={cn(
                  "rounded-sm px-1 text-[7px] uppercase tracking-wider",
                  row.status === "stable"
                    ? "bg-foreground/10 text-foreground"
                    : "border border-border text-muted-foreground"
                )}
              >
                {row.status}
              </span>
              <Bar w="2rem" className="opacity-60" />
            </div>
          ))}
        </div>
      )
    case "display":
    default:
      return (
        <div
          className={cn(SKEL_BORDER, "flex w-[180px] flex-col gap-1.5 p-2")}
        >
          <div className="flex items-center gap-1.5">
            <span className="size-5 rounded-full bg-foreground/80" />
            <div className="flex flex-1 flex-col gap-0.5">
              <Bar w="55%" className="!h-1" />
              <Bar w="40%" className="!h-1 opacity-60" />
            </div>
            <span className="text-[9px] font-medium text-foreground">
              42 ↑
            </span>
          </div>
          <div className="h-px bg-border" />
          <div className="flex items-center justify-between">
            <span className="rounded-sm bg-foreground/10 px-1.5 py-0.5 text-[8px] text-foreground">
              feature
            </span>
            <span className="text-[8px] text-muted-foreground">just now</span>
          </div>
        </div>
      )
  }
}

function BlockPreview({ kind }: { kind: BlockKind }) {
  switch (kind) {
    case "hero":
      return (
        <div className="flex w-full max-w-[360px] flex-col items-center gap-2">
          <span className="rounded-full border border-border bg-background px-2 py-0.5 text-[8px] uppercase tracking-wider text-muted-foreground">
            v1 · live
          </span>
          <span
            className="font-semibold text-foreground"
            style={{
              fontFamily: "var(--font-fraunces), ui-serif, serif",
              fontSize: 22,
              lineHeight: 1.05,
            }}
          >
            Big serif headline
          </span>
          <div className="flex flex-col items-center gap-0.5">
            <Bar w="180px" className="opacity-60" />
            <Bar w="140px" className="opacity-50" />
          </div>
          <div className="flex gap-1.5">
            <span className={cn(SKEL_SOLID, "h-4 w-16")} />
            <span className={cn(SKEL_BORDER, "h-4 w-16")} />
          </div>
        </div>
      )
    case "feature":
      return (
        <div className="flex w-full max-w-[260px] items-stretch gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={cn(
                SKEL_BORDER,
                "flex flex-1 flex-col items-center gap-1 p-1.5"
              )}
            >
              <span className="flex size-5 items-center justify-center rounded-md border border-border bg-card">
                <span className="size-2 rounded-sm bg-foreground/40" />
              </span>
              <Bar w="80%" className="!h-1" />
              <Bar w="60%" className="!h-1 opacity-60" />
            </div>
          ))}
        </div>
      )
    case "pricing":
      return (
        <div className="flex items-end gap-1.5">
          {[
            { tall: false, label: "Free" },
            { tall: true, label: "Pro" },
            { tall: false, label: "Team" },
          ].map((tier, i) => (
            <div
              key={i}
              className={cn(
                SKEL_BORDER,
                "flex flex-col items-center gap-1 px-2 py-2",
                tier.tall && "border-foreground/40",
                tier.tall ? "h-24 w-16" : "h-20 w-14"
              )}
            >
              <span className="text-[8px] font-medium uppercase tracking-wider text-muted-foreground">
                {tier.label}
              </span>
              <span
                className={cn(
                  "font-semibold text-foreground",
                  tier.tall ? "text-base" : "text-sm"
                )}
                style={{
                  fontFamily: "var(--font-fraunces), ui-serif, serif",
                }}
              >
                ${tier.tall ? 29 : i === 0 ? 0 : 99}
              </span>
              <div className="flex w-full flex-col items-center gap-0.5">
                <Bar w="80%" className="!h-0.5 opacity-60" />
                <Bar w="60%" className="!h-0.5 opacity-60" />
                <Bar w="70%" className="!h-0.5 opacity-60" />
              </div>
              {tier.tall && (
                <span
                  className={cn(SKEL_SOLID, "mt-auto h-2 w-full rounded-sm")}
                />
              )}
            </div>
          ))}
        </div>
      )
    case "testimonial":
      return (
        <div
          className={cn(SKEL_BORDER, "flex w-[220px] flex-col gap-2 p-2.5")}
        >
          <div className="flex gap-0.5">
            {[0, 1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className="text-[10px] leading-none text-foreground"
              >
                ★
              </span>
            ))}
          </div>
          <div className="flex flex-col gap-0.5">
            <Bar w="100%" className="!h-1 opacity-60" />
            <Bar w="90%" className="!h-1 opacity-60" />
            <Bar w="60%" className="!h-1 opacity-60" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-5 rounded-full bg-foreground/70" />
            <div className="flex flex-col gap-0.5">
              <Bar w="60px" className="!h-1" />
              <Bar w="40px" className="!h-0.5 opacity-60" />
            </div>
          </div>
        </div>
      )
    case "cta":
      return (
        <div
          className={cn(SKEL_BORDER, "flex w-full max-w-[200px] flex-col items-center gap-1.5 p-2")}
        >
          <span
            className="font-semibold text-foreground"
            style={{
              fontFamily: "var(--font-fraunces), ui-serif, serif",
              fontSize: 14,
              lineHeight: 1.1,
            }}
          >
            Ready to ship?
          </span>
          <Bar w="80%" className="!h-1 opacity-60" />
          <div className="mt-0.5 flex gap-1">
            <span className={cn(SKEL_SOLID, "h-3.5 w-12")} />
            <span className={cn(SKEL_BORDER, "h-3.5 w-10")} />
          </div>
        </div>
      )
    case "faq":
      return (
        <div className="flex w-full max-w-[260px] flex-col divide-y divide-border rounded-md border border-border bg-background">
          {[
            { q: "What is msh ui?", open: true },
            { q: "How do I install?", open: false },
            { q: "Is it free?", open: false },
          ].map((item, i) => (
            <div key={i} className="px-2 py-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-medium text-foreground">
                  {item.q}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {item.open ? "−" : "+"}
                </span>
              </div>
              {item.open && (
                <div className="mt-1 flex flex-col gap-0.5">
                  <Bar w="100%" className="!h-1 opacity-60" />
                  <Bar w="70%" className="!h-1 opacity-60" />
                </div>
              )}
            </div>
          ))}
        </div>
      )
    case "login":
      return (
        <div
          className={cn(SKEL_BORDER, "flex w-[180px] flex-col gap-1.5 p-2.5")}
        >
          <span
            className="text-center font-semibold text-foreground"
            style={{
              fontFamily: "var(--font-fraunces), ui-serif, serif",
              fontSize: 12,
            }}
          >
            Sign in
          </span>
          <div className={cn(SKEL_BORDER, "h-4 px-1.5")}>
            <Bar w="40%" className="mt-1 !h-1 opacity-60" />
          </div>
          <div className={cn(SKEL_BORDER, "h-4 px-1.5")}>
            <Bar w="60%" className="mt-1 !h-1 opacity-60" />
          </div>
          <span className={cn(SKEL_SOLID, "h-4 w-full")} />
          <div className="flex items-center gap-1">
            <span className="h-px flex-1 bg-border" />
            <span className="text-[7px] uppercase text-muted-foreground">
              or
            </span>
            <span className="h-px flex-1 bg-border" />
          </div>
          <div className="flex gap-1">
            <span className={cn(SKEL_BORDER, "h-3.5 flex-1")} />
            <span className={cn(SKEL_BORDER, "h-3.5 flex-1")} />
          </div>
        </div>
      )
    case "header":
      return (
        <div
          className={cn(
            SKEL_BORDER,
            "flex w-full max-w-[440px] items-center gap-2 px-3 py-2"
          )}
        >
          <span
            className="font-semibold text-foreground"
            style={{
              fontFamily: "var(--font-fraunces), ui-serif, serif",
              fontSize: 12,
              lineHeight: 1,
            }}
          >
            Brand
          </span>
          <div className="ml-4 flex flex-1 items-center gap-3">
            {["Home", "Docs", "Pricing", "About"].map((l) => (
              <span key={l} className="text-[9px] text-muted-foreground">
                {l}
              </span>
            ))}
          </div>
          <span className={cn(SKEL_BORDER, "h-4 w-12")} />
          <span className={cn(SKEL_SOLID, "h-4 w-14")} />
        </div>
      )
    case "footer":
      return (
        <div className="flex w-full max-w-[460px] flex-col gap-2">
          <div className="grid grid-cols-4 gap-3 border-b border-border pb-2">
            {["Product", "Resources", "Company", "Legal"].map((col) => (
              <div key={col} className="flex flex-col gap-1">
                <span className="text-[8px] font-semibold uppercase tracking-wider text-foreground">
                  {col}
                </span>
                <Bar w="80%" className="!h-1 opacity-60" />
                <Bar w="60%" className="!h-1 opacity-60" />
                <Bar w="70%" className="!h-1 opacity-60" />
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[8px] uppercase tracking-wider text-muted-foreground">
              © 2026
            </span>
            <div className="flex gap-1">
              <span className="size-3 rounded-full bg-foreground/15" />
              <span className="size-3 rounded-full bg-foreground/15" />
              <span className="size-3 rounded-full bg-foreground/15" />
            </div>
          </div>
        </div>
      )
    case "not-found":
      return (
        <div className="flex flex-col items-center gap-1">
          <span
            className="leading-none text-foreground/15"
            style={{
              fontFamily: "var(--font-fraunces), ui-serif, serif",
              fontSize: 84,
              fontWeight: 600,
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
