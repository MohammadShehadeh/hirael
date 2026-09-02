import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, Frame, Layers } from 'lucide-react';

import { InlineCodeBlock } from '@/components/code-block';
import { CollectionJsonLd } from '@/components/collection-json-ld';
import { DemoCard } from '@/components/demo-card';
import { InstallBlock } from '@/components/install-block';
import { PageHeader, SectionLabel } from '@/components/page-header';
import { highlightCode } from '@/lib/highlight';
import { listingMetadata } from '@/lib/seo';
import {
  BLOCK_KIND_ORDER,
  CATEGORY_LABELS,
  COMPONENT_CATEGORY_ORDER,
  COMPONENTS,
  REGISTRY_BY_CATEGORY,
  TEMPLATES,
} from '@/registry/hirael/registry-meta';

const COMPOSE_SNIPPET = `import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectTrigger,
} from "@/components/multi-select"

<MultiSelect value={value} onValueChange={setValue} options={options}>
  <MultiSelectTrigger placeholder="Pick…" />
  <MultiSelectContent searchPlaceholder="Filter…" />
</MultiSelect>`;

const COMPONENTS_DESCRIPTION =
  'Every component in the Hirael registry: multi-select, combobox, tag input, currency input, file dropzone, and the rest shadcn/ui leaves out.';

export const metadata: Metadata = listingMetadata({
  path: '/components',
  title: 'React components for shadcn/ui',
  description: COMPONENTS_DESCRIPTION,
  keywords: [
    'react components',
    'shadcn components',
    'shadcn registry',
    'multi-select react',
    'combobox react',
    'tag input react',
    'tailwind components',
  ],
});

export default async function ComponentsIndex() {
  const blocks = REGISTRY_BY_CATEGORY.blocks;
  const composeHtml = await highlightCode(COMPOSE_SNIPPET, 'tsx');

  return (
    <div className="container flex w-full flex-col gap-14 py-16 sm:gap-16 sm:py-20">
      <CollectionJsonLd
        id="components-index"
        path="/components"
        name="Components"
        description={COMPONENTS_DESCRIPTION}
        entries={COMPONENTS}
      />
      <PageHeader
        kicker="Components"
        title="The full registry."
        blurb={`${COMPONENTS.length} components shadcn/ui doesn't ship, live below so you can try each one before installing. One command copies the source into your repo.`}
      >
        <InstallBlock name="multi-select" className="mt-2 w-full max-w-md" />
      </PageHeader>

      <nav aria-label="Component categories" className="-mt-6 flex flex-wrap justify-center gap-2">
        {COMPONENT_CATEGORY_ORDER.map((cat) => (
          <a
            key={cat}
            href={`#${cat}`}
            className="rounded-full border border-border bg-card px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
          >
            {CATEGORY_LABELS[cat]}
            <span className="ms-1.5 tabular-nums text-muted-foreground/60">{REGISTRY_BY_CATEGORY[cat].length}</span>
          </a>
        ))}
      </nav>

      {COMPONENT_CATEGORY_ORDER.map((cat) => {
        const items = REGISTRY_BY_CATEGORY[cat];
        if (!items.length) return null;
        return (
          <section key={cat} id={cat} className="flex scroll-mt-24 flex-col gap-5">
            <div className="flex items-baseline justify-between">
              <Link
                href={`/components/${cat}`}
                className="group inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
              >
                <SectionLabel className="text-foreground">{CATEGORY_LABELS[cat]}</SectionLabel>
                <ArrowRight className="size-3 text-muted-foreground transition-transform group-hover:translate-x-0.5 rtl:rotate-180" />
              </Link>
              <span className="font-mono text-[10px] tabular-nums text-muted-foreground">{items.length}</span>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((entry) => (
                <DemoCard key={entry.name} entry={entry} />
              ))}
            </div>
          </section>
        );
      })}

      <section className="flex flex-col gap-5 border-t border-border pt-10">
        <SectionLabel>Composition (the shadcn way)</SectionLabel>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Every compound component ships as flat top-level exports, no namespacing, no convenience wrappers. The bare
          name is the root primitive and holds state; every rendered piece carries a
          <code className="mx-1 rounded-sm bg-muted px-1 py-0.5 font-mono text-[11px] text-foreground">data-slot</code>
          attribute for downstream styling.
        </p>
        <InlineCodeBlock code={COMPOSE_SNIPPET} html={composeHtml} />
      </section>

      <section className="grid gap-3 border-t border-border pt-10 sm:grid-cols-2">
        <Link
          href="/blocks"
          className="group flex items-center justify-between gap-4 rounded-md border border-border bg-card p-4 transition-colors hover:bg-accent"
        >
          <div className="flex items-center gap-3">
            <span className="inline-flex size-9 items-center justify-center rounded-md border border-border bg-background">
              <Layers className="size-4 text-foreground" />
            </span>
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium">{blocks.length} section blocks</span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {BLOCK_KIND_ORDER.length} categories, preview and install
              </span>
            </div>
          </div>
          <ArrowRight className="size-4 text-muted-foreground transition-transform duration-150 ease-out group-hover:translate-x-0.5 group-hover:text-foreground rtl:rotate-180" />
        </Link>
        <Link
          href="/templates"
          className="group flex items-center justify-between gap-4 rounded-md border border-border bg-card p-4 transition-colors hover:bg-accent"
        >
          <div className="flex items-center gap-3">
            <span className="inline-flex size-9 items-center justify-center rounded-md border border-border bg-background">
              <Frame className="size-4 text-foreground" />
            </span>
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium">{TEMPLATES.length} full-page templates</span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                landing pages, preview and install
              </span>
            </div>
          </div>
          <ArrowRight className="size-4 text-muted-foreground transition-transform duration-150 ease-out group-hover:translate-x-0.5 group-hover:text-foreground rtl:rotate-180" />
        </Link>
      </section>
    </div>
  );
}
