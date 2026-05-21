import Link from "next/link"
import type { Metadata } from "next"
import { ArrowRight, Check, Github } from "lucide-react"

import { InstallBlock } from "@/components/showcase/install-block"
import { SiteFooter } from "@/components/showcase/site-footer"
import { SiteHeader } from "@/components/showcase/site-header"
import { SITE } from "@/lib/site"
import {
  BLOCK_KIND_LABELS,
  BLOCK_KIND_ORDER,
  BLOCKS_BY_KIND,
  CATEGORY_LABELS,
  REGISTRY,
  REGISTRY_BY_CATEGORY,
  type ComponentCategory,
} from "@/registry/sabk/registry-meta"

const CATEGORY_ORDER: ComponentCategory[] = [
  "inputs",
  "pickers",
  "files",
  "data",
  "display",
]

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
  const components = REGISTRY.filter((r) => r.category !== "blocks")
  const blocks = REGISTRY_BY_CATEGORY.blocks
  const stableComponents = components.filter((r) => r.status === "stable")

  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Hero
          stable={stableComponents.length}
          total={components.length}
          blocks={blocks.length}
        />
        <ComponentsGrid />
        <BlocksList />
      </main>
      <SiteFooter />
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Hero — compact, info-first                                                 */
/* -------------------------------------------------------------------------- */

function Hero({
  stable,
  total,
  blocks,
}: {
  stable: number
  total: number
  blocks: number
}) {
  const stats: { label: string; value: string }[] = [
    { label: "stable", value: `${stable} / ${total}` },
    { label: "blocks", value: `${blocks}` },
    { label: "runtime deps", value: "0" },
    { label: "license", value: "MIT" },
  ]

  return (
    <section className="relative border-b border-border">
      <div
        aria-hidden
        className="bg-dot-grid pointer-events-none absolute inset-0 opacity-50"
        style={{
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 0%, black 30%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 0%, black 30%, transparent 80%)",
        }}
      />
      <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 pb-12 pt-12 sm:px-6 sm:pb-16 sm:pt-16 lg:px-8">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-sm border border-border bg-card px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              <span
                aria-hidden
                className="size-1 rounded-full bg-foreground"
              />
              v{SITE.version}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              peer of shadcn · not a replacement
            </span>
          </div>

          <h1 className="text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.035em] sm:text-5xl">
            shadcn&apos;s missing pieces.
          </h1>

          <p className="max-w-2xl text-balance text-base text-muted-foreground">
            {stable} production-grade components shadcn doesn&apos;t ship —
            multi-select, combobox, tag input, currency input, file dropzone —
            plus {blocks} section blocks. Distributed via the shadcn CLI:
            source lands in your repo, zero runtime dependency.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
          <InstallBlock name="multi-select" className="min-w-0" />
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/components"
              className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Browse components
              <ArrowRight className="size-3.5" />
            </Link>
            <a
              href={SITE.githubUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-border bg-card px-3 text-sm font-medium text-foreground transition-colors hover:border-foreground/40 hover:bg-accent"
            >
              <Github className="size-3.5" />
              GitHub
            </a>
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.label}
              className="flex flex-col gap-0.5 bg-card px-3 py-2.5"
            >
              <dt className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
                {item.label}
              </dt>
              <dd className="font-mono text-sm tabular-nums text-foreground">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* Components — every category, full list, dense                              */
/* -------------------------------------------------------------------------- */

function ComponentsGrid() {
  const total = REGISTRY.filter((r) => r.category !== "blocks").length
  const stable = REGISTRY.filter(
    (r) => r.category !== "blocks" && r.status === "stable"
  ).length

  return (
    <section className="border-b border-border">
      <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-foreground">
            Components
          </h2>
          <span className="font-mono text-[10px] tabular-nums uppercase tracking-[0.08em] text-muted-foreground">
            {stable} / {total} stable
          </span>
        </div>

        <div className="flex flex-col gap-6">
          {CATEGORY_ORDER.map((cat) => {
            const items = REGISTRY_BY_CATEGORY[cat]
            if (!items.length) return null
            return (
              <div key={cat} className="flex flex-col gap-2">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                    {CATEGORY_LABELS[cat]}
                  </h3>
                  <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
                    {items.filter((i) => i.status === "stable").length} /{" "}
                    {items.length}
                  </span>
                </div>
                <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((entry) => (
                    <li key={entry.name}>
                      <Link
                        href={`/${entry.name}`}
                        className="group flex h-full flex-col justify-between gap-2 bg-card p-3 transition-colors hover:bg-accent"
                      >
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="text-sm font-medium tracking-[-0.01em]">
                              {entry.title}
                            </h4>
                            {entry.status === "planned" ? (
                              <span className="rounded-sm border border-border px-1.5 font-mono text-[9px] uppercase tracking-[0.08em] text-muted-foreground">
                                soon
                              </span>
                            ) : (
                              <Check
                                aria-hidden
                                className="size-3 text-muted-foreground"
                              />
                            )}
                          </div>
                          <p className="text-[11px] leading-snug text-muted-foreground line-clamp-2">
                            {entry.description}
                          </p>
                        </div>
                        <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground group-hover:text-foreground">
                          /{entry.name} →
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* Blocks — kind-by-kind, dense                                               */
/* -------------------------------------------------------------------------- */

function BlocksList() {
  const blocksCount = REGISTRY_BY_CATEGORY.blocks.length

  return (
    <section className="border-b border-border">
      <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-foreground">
            Section blocks
          </h2>
          <Link
            href="/blocks"
            className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground transition-colors hover:text-foreground"
          >
            {blocksCount} blocks · view all
            <ArrowRight className="size-3" />
          </Link>
        </div>

        <div className="flex flex-col gap-px overflow-hidden rounded-md border border-border bg-border">
          {BLOCK_KIND_ORDER.map((kind) => {
            const items = BLOCKS_BY_KIND[kind]
            if (!items.length) return null
            return (
              <div
                key={kind}
                className="flex flex-col gap-2 bg-card px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-baseline gap-3">
                  <h3 className="font-mono text-[11px] uppercase tracking-[0.12em] text-foreground">
                    {BLOCK_KIND_LABELS[kind]}
                  </h3>
                  <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
                    {items.length}
                  </span>
                </div>
                <ul className="flex flex-wrap gap-1.5">
                  {items.map((entry) => (
                    <li key={entry.name}>
                      <Link
                        href={`/blocks/${entry.name}`}
                        className="group inline-flex items-center gap-1.5 rounded-sm border border-border bg-background px-2 py-0.5 font-mono text-[11px] tracking-tight transition-colors hover:border-foreground/40 hover:bg-accent"
                        title={entry.title}
                      >
                        <span className="text-foreground">{entry.name}</span>
                        <ArrowRight className="size-3 text-muted-foreground transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-foreground" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
