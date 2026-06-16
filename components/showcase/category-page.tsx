import Link from "next/link";
import { ArrowRight, ChevronLeft } from "lucide-react";

import type { CategoryMeta } from "@/components/showcase/block-categories";
import { BlockPreview } from "@/components/showcase/block-preview";
import { Breadcrumbs } from "@/components/showcase/breadcrumbs";
import { SectionLabel } from "@/components/showcase/page-header";
import {
  BLOCKS_BY_KIND,
  entryEmbedHref,
  entryHref,
  type RegistryEntryMeta,
} from "@/registry/hirael/registry-meta";

export function CategoryPage({ category }: { category: CategoryMeta }) {
  const blocks: RegistryEntryMeta[] = category.blockKind
    ? BLOCKS_BY_KIND[category.blockKind]
    : [];

  return (
    <div className="container flex w-full flex-col gap-10 py-10 sm:gap-12 sm:py-12 md:py-16">
      <Breadcrumbs
        items={[
          { label: "Blocks", href: "/blocks" },
          { label: category.title },
        ]}
      />

      <header className="flex flex-col gap-5 border-b border-border pb-8 sm:pb-10">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-foreground">
            ◆ {category.title.toLowerCase()}
          </span>
          {category.comingSoon && (
            <span className="rounded-sm border border-border bg-card px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Roadmap
            </span>
          )}
        </div>
        <h1 className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
          {category.title}.
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
          {category.description}
        </p>
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {category.comingSoon
            ? "Planned · not yet shipped"
            : `${blocks.length} block${blocks.length === 1 ? "" : "s"}`}
        </p>
      </header>

      {category.comingSoon ? (
        <RoadmapState category={category} />
      ) : (
        <BlocksGrid blocks={blocks} />
      )}
    </div>
  );
}

function BlocksGrid({ blocks }: { blocks: RegistryEntryMeta[] }) {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-baseline justify-between">
        <SectionLabel>Variants</SectionLabel>
        <span className="font-mono text-[10px] tabular-nums uppercase tracking-[0.08em] text-muted-foreground">
          {blocks.length} variant{blocks.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-2">
        {blocks.map((entry) => (
          <Link
            key={entry.name}
            href={entryHref(entry)}
            className="group flex flex-col overflow-hidden rounded-sm border border-border bg-background transition-colors hover:border-foreground focus-visible:border-foreground outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            <BlockPreview
              embedHref={entryEmbedHref(entry)}
              title={entry.title}
            />

            <div className="flex flex-col gap-2 p-4 sm:p-5">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-base font-medium tracking-[-0.01em]">
                  {entry.title}
                </h3>
                <span className="size-1.5 shrink-0 rounded-full bg-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">
                {entry.blockTagline ?? entry.description}
              </p>
              <div className="mt-2 flex items-center justify-between gap-2 border-t border-border pt-2.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                <span className="truncate">{entryHref(entry)}</span>
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
  );
}

function RoadmapState({ category }: { category: CategoryMeta }) {
  return (
    <section className="flex flex-col gap-8">
      <div className="relative overflow-hidden rounded-md border border-border bg-card/30 p-8 sm:p-12">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.04] mask-[radial-gradient(ellipse_at_top,black,transparent_70%)]"
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
            {category.description} We&apos;re drafting variants now, first one
            ships when it&apos;s good enough that we&apos;d copy it into our own
            products.
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-widest">
            <Link
              href="/blocks"
              className="inline-flex items-center gap-1.5 rounded-sm border border-border bg-background px-3 py-1.5 text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
            >
              <ChevronLeft className="size-3" />
              All categories
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
