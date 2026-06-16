import Link from "next/link";

import { Breadcrumbs } from "@/components/showcase/breadcrumbs";
import { SectionLabel } from "@/components/showcase/page-header";
import {
  CATEGORY_LABELS,
  COMPONENT_CATEGORY_DESCRIPTIONS,
  REGISTRY_BY_CATEGORY,
  entryHref,
  type COMPONENT_CATEGORY_ORDER,
} from "@/registry/hirael/registry-meta";

type ComponentCategory = (typeof COMPONENT_CATEGORY_ORDER)[number];

export function ComponentCategoryPage({
  category,
}: {
  category: ComponentCategory;
}) {
  const items = REGISTRY_BY_CATEGORY[category];
  const label = CATEGORY_LABELS[category];

  return (
    <div className="container flex w-full flex-col gap-10 py-10 sm:gap-12 sm:py-12 md:py-16">
      <Breadcrumbs
        items={[{ label: "Components", href: "/components" }, { label }]}
      />

      <header className="flex flex-col gap-5 border-b border-border pb-8 sm:pb-10">
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-foreground">
          ◆ {label.toLowerCase()}
        </span>
        <h1 className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
          {label}.
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
          {COMPONENT_CATEGORY_DESCRIPTIONS[category]}
        </p>
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {items.length} component{items.length === 1 ? "" : "s"}
        </p>
      </header>

      <section className="flex flex-col gap-6">
        <div className="flex items-baseline justify-between">
          <SectionLabel>Components</SectionLabel>
          <span className="font-mono text-[10px] tabular-nums uppercase tracking-[0.08em] text-muted-foreground">
            {items.length} total
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
      </section>
    </div>
  );
}
