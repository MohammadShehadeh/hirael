import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Layers, Palette } from "lucide-react";

import { InlineCodeBlock } from "@/components/code-block";
import { InstallBlock } from "@/components/install-block";
import { PageHeader, SectionLabel } from "@/components/page-header";
import { highlightCode } from "@/lib/highlight";
import { SITE } from "@/lib/site";
import {
  BLOCK_KIND_LABELS,
  BLOCK_KIND_ORDER,
  BLOCKS_BY_KIND,
  CATEGORY_LABELS,
  COMPONENT_CATEGORY_ORDER,
  COMPONENTS,
  REGISTRY_BY_CATEGORY,
  entryHref,
} from "@/registry/hirael/registry-meta";

const COMPOSE_SNIPPET = `import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectTrigger,
} from "@/components/ui/multi-select"

<MultiSelect value={value} onValueChange={setValue} options={options}>
  <MultiSelectTrigger placeholder="Pick…" />
  <MultiSelectContent searchPlaceholder="Filter…" />
</MultiSelect>`;

const COMPONENTS_DESCRIPTION =
  "Every component in the Hirael registry: multi-select, combobox, tag input, currency input, file dropzone, and the rest shadcn/ui leaves out.";

export const metadata: Metadata = {
  title: "Components",
  description: COMPONENTS_DESCRIPTION,
  alternates: {
    canonical: "/components",
  },
  openGraph: {
    type: "website",
    url: `${SITE.url}/components`,
    siteName: SITE.name,
    title: `Components | ${SITE.name}`,
    description: COMPONENTS_DESCRIPTION,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `Components | ${SITE.name}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Components | ${SITE.name}`,
    description: COMPONENTS_DESCRIPTION,
    images: ["/opengraph-image"],
  },
};

export default async function ComponentsIndex() {
  const components = COMPONENTS;
  const blocks = REGISTRY_BY_CATEGORY.blocks;
  const composeHtml = await highlightCode(COMPOSE_SNIPPET, "tsx");

  return (
    <div className="container flex w-full flex-col gap-14 py-16 sm:gap-16 sm:py-20">
      <PageHeader
        kicker="Components"
        title="The full registry."
        blurb={`The components shadcn/ui doesn't ship: multi-select, combobox, tag input, currency input, file dropzone, plus ${blocks.length} section blocks across ${BLOCK_KIND_ORDER.length} categories. Everything installs through the shadcn CLI, so the source ends up in your repo and stays yours to edit.`}
      >
        <InstallBlock name="multi-select" className="mt-2 w-full max-w-md" />
      </PageHeader>

      <section className="flex flex-col gap-8">
        <div className="flex items-baseline justify-between">
          <SectionLabel>Components</SectionLabel>
          <span className="font-mono text-[10px] tabular-nums uppercase tracking-[0.08em] text-muted-foreground">
            {components.length} total
          </span>
        </div>

        {COMPONENT_CATEGORY_ORDER.map((cat) => {
          const items = REGISTRY_BY_CATEGORY[cat];
          if (!items.length) return null;
          return (
            <div key={cat} className="flex flex-col gap-3">
              <div className="flex items-baseline justify-between">
                <Link
                  href={`/components/${cat}`}
                  className="group inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-foreground"
                >
                  {CATEGORY_LABELS[cat]}
                  <ArrowRight className="size-3 transition-transform duration-150 ease-out group-hover:translate-x-0.5" />
                </Link>
                <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
                  {items.length}
                </span>
              </div>
              <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
                {items.map((entry) => (
                  <li key={entry.name}>
                    <Link
                      href={entryHref(entry)}
                      className="group flex h-full flex-col justify-between gap-3 bg-card p-4 transition-colors hover:bg-accent"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-base font-medium tracking-[-0.01em]">
                            {entry.title}
                          </h3>
                          <span
                            aria-hidden
                            className="size-1.5 rounded-full bg-foreground"
                          />
                        </div>
                        <p className="mt-1.5 text-xs text-muted-foreground">
                          {entry.description}
                        </p>
                      </div>
                      <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground group-hover:text-foreground">
                        {entryHref(entry)} →
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </section>

      <section className="flex flex-col gap-8 border-t border-border pt-10">
        <div className="flex items-baseline justify-between">
          <SectionLabel>Section blocks</SectionLabel>
          <Link
            href="/blocks"
            className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
          >
            {blocks.length} blocks · view all
            <ArrowRight className="size-3" />
          </Link>
        </div>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Drop-in section compositions: heroes, features, pricing, testimonials,
          CTAs, FAQs, auth, navigation, errors. Each block shares the same
          registry pipeline; copy a block in one command.
        </p>
        <div className="flex flex-col gap-px overflow-hidden rounded-md border border-border bg-border">
          {BLOCK_KIND_ORDER.map((kind) => {
            const items = BLOCKS_BY_KIND[kind];
            if (!items.length) return null;
            return (
              <div
                key={kind}
                className="flex flex-col gap-3 bg-card px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-baseline gap-3">
                  <h3 className="font-mono text-[11px] uppercase tracking-[0.12em] text-foreground">
                    {BLOCK_KIND_LABELS[kind]}
                  </h3>
                  <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
                    {items.length}
                  </span>
                </div>
                <ul className="flex flex-wrap gap-2">
                  {items.map((entry) => (
                    <li key={entry.name}>
                      <Link
                        href={entryHref(entry)}
                        className="group inline-flex items-center gap-1.5 rounded-sm border border-border bg-background px-2 py-1 font-mono text-[11px] tracking-tight transition-colors hover:border-foreground/40 hover:bg-accent"
                        title={entry.title}
                      >
                        <span className="text-foreground">{entry.name}</span>
                        <ArrowRight className="size-3 text-muted-foreground transition-transform duration-150 ease-out group-hover:translate-x-0.5 group-hover:text-foreground" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      <section className="flex flex-col gap-5 border-t border-border pt-10">
        <SectionLabel>Composition (the shadcn way)</SectionLabel>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Every compound component ships as flat top-level exports, no
          namespacing, no convenience wrappers. The bare name is the root
          primitive and holds state; every rendered piece carries a
          <code className="mx-1 rounded-sm bg-muted px-1 py-0.5 font-mono text-[11px] text-foreground">
            data-slot
          </code>
          attribute for downstream styling.
        </p>
        <InlineCodeBlock code={COMPOSE_SNIPPET} html={composeHtml} />
      </section>

      <section className="grid gap-3 border-t border-border pt-10 sm:grid-cols-2">
        <Link
          href="/theme"
          className="group flex items-center justify-between gap-4 rounded-md border border-border bg-card p-4 transition-colors hover:bg-accent"
        >
          <div className="flex items-center gap-3">
            <span className="inline-flex size-9 items-center justify-center rounded-md border border-border bg-background">
              <Palette className="size-4 text-foreground" />
            </span>
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium">Theme playground</span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                preset switcher · token swatches
              </span>
            </div>
          </div>
          <ArrowRight className="size-4 text-muted-foreground transition-transform duration-150 ease-out group-hover:translate-x-0.5 group-hover:text-foreground" />
        </Link>
        <Link
          href="/blocks"
          className="group flex items-center justify-between gap-4 rounded-md border border-border bg-card p-4 transition-colors hover:bg-accent"
        >
          <div className="flex items-center gap-3">
            <span className="inline-flex size-9 items-center justify-center rounded-md border border-border bg-background">
              <Layers className="size-4 text-foreground" />
            </span>
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium">
                All {blocks.length} blocks
              </span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {BLOCK_KIND_ORDER.length} categories · preview + install
              </span>
            </div>
          </div>
          <ArrowRight className="size-4 text-muted-foreground transition-transform duration-150 ease-out group-hover:translate-x-0.5 group-hover:text-foreground" />
        </Link>
      </section>
    </div>
  );
}
