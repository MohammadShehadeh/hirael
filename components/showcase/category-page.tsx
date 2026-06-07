import Link from "next/link"
import { ArrowRight, ArrowUpRight, ChevronLeft } from "lucide-react"

import type { CategoryMeta } from "@/components/showcase/block-categories"
import { BlockPreview } from "@/components/showcase/block-preview"
import {
  BLOCKS_BY_KIND,
  type RegistryEntryMeta,
} from "@/registry/hirael/registry-meta"

export function CategoryPage({ category }: { category: CategoryMeta }) {
  const blocks: RegistryEntryMeta[] = category.blockKind
    ? BLOCKS_BY_KIND[category.blockKind]
    : []

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-10 sm:gap-12 sm:px-6 sm:py-12 md:px-10 md:py-16">
      <Breadcrumb title={category.title} />

      <header className="flex flex-col gap-5 border-b border-border pb-8 sm:pb-10">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-foreground">
            ◆ {category.title.toLowerCase()}
          </span>
          {category.comingSoon && (
            <span className="rounded-sm border border-border bg-card px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
              Roadmap
            </span>
          )}
        </div>
        <h1
          className="text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.02em] sm:text-5xl"
          style={{ fontFamily: "var(--font-cormorant), ui-serif, serif" }}
        >
          {category.title}.
        </h1>
        <p className="max-w-2xl text-base text-muted-foreground">
          {category.description}
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {category.comingSoon
            ? "Planned · not yet shipped"
            : `${blocks.length} block${blocks.length === 1 ? "" : "s"} · MIT`}
        </p>
      </header>

      {category.comingSoon ? (
        <RoadmapState category={category} />
      ) : (
        <BlocksGrid blocks={blocks} />
      )}
    </div>
  )
}

function Breadcrumb({ title }: { title: string }) {
  return (
    <nav className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
      <Link
        href="/blocks"
        className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
      >
        <ChevronLeft className="size-3" />
        Blocks
      </Link>
      <span className="text-muted-foreground/50">/</span>
      <span className="text-foreground">{title}</span>
    </nav>
  )
}

function BlocksGrid({ blocks }: { blocks: RegistryEntryMeta[] }) {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-baseline justify-between">
        <h2 className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
          Variants
        </h2>
        <span className="font-mono text-[10px] tabular-nums uppercase tracking-[0.08em] text-muted-foreground">
          {blocks.length} variant{blocks.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-2">
        {blocks.map((entry) => (
          <Link
            key={entry.name}
            href={`/blocks/${entry.name}`}
            className="group flex flex-col overflow-hidden rounded-sm border border-border bg-background transition-colors hover:border-foreground focus-visible:border-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <BlockPreview name={entry.name} title={entry.title} />

            <div className="flex flex-col gap-2 p-4 sm:p-5">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-base font-medium tracking-[-0.015em]">
                  {entry.title}
                </h3>
                <span className="size-1.5 shrink-0 rounded-full bg-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">
                {entry.blockTagline ?? entry.description}
              </p>
              <div className="mt-2 flex items-center justify-between gap-2 border-t border-border pt-2.5 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                <span className="truncate">/blocks/{entry.name}</span>
                <span className="inline-flex shrink-0 items-center gap-1 text-muted-foreground transition-colors group-hover:text-foreground">
                  view
                  <ArrowRight className="size-3 transition-transform duration-150 ease-out group-hover:translate-x-0.5" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

function RoadmapState({ category }: { category: CategoryMeta }) {
  return (
    <section className="flex flex-col gap-8">
      <div className="relative overflow-hidden rounded-md border border-border bg-card/30 p-8 sm:p-12">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.04] [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
            backgroundSize: "16px 16px",
          }}
        />
        <div className="relative flex flex-col gap-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            In design
          </span>
          <h3 className="text-balance text-2xl font-medium tracking-[-0.02em] sm:text-3xl">
            {category.title} blocks are on the roadmap.
          </h3>
          <p className="max-w-xl text-sm text-muted-foreground">
            {category.description} We&apos;re drafting variants now — the
            first one ships when it&apos;s good enough that we&apos;d copy it
            into our own products.
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.1em]">
            <Link
              href="/blocks"
              className="inline-flex items-center gap-1.5 rounded-sm border border-border bg-background px-3 py-1.5 text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
            >
              <ChevronLeft className="size-3" />
              All categories
            </Link>
            <a
              href="https://github.com/MohammadShehadeh/forgecn/issues"
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 rounded-sm border border-border bg-background px-3 py-1.5 text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
            >
              Request variant
              <ArrowUpRight className="size-3" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
