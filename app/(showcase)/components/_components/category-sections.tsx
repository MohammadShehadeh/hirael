import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { DemoCard } from '@/components/demo-card';
import { SectionLabel } from '@/components/page-header';
import { CATEGORY_LABELS, COMPONENT_CATEGORY_ORDER, REGISTRY_BY_CATEGORY } from '@/registry/hirael/registry-meta';

export const CategorySections = () => {
  return (
    <>
      {COMPONENT_CATEGORY_ORDER.map((category) => {
        const items = REGISTRY_BY_CATEGORY[category];
        if (!items.length) return null;
        return (
          <section key={category} id={category} className="flex scroll-mt-24 flex-col gap-5">
            <div className="flex items-baseline justify-between">
              <Link
                href={`/components/${category}`}
                className="group inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
              >
                <SectionLabel className="text-foreground">{CATEGORY_LABELS[category]}</SectionLabel>
                <ArrowRight className="size-3 text-muted-foreground transition-transform group-hover:translate-x-0.5 rtl:rotate-180" />
              </Link>
              <span className="text-xs tabular-nums text-muted-foreground">{items.length}</span>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((entry) => (
                <DemoCard key={entry.name} entry={entry} />
              ))}
            </div>
          </section>
        );
      })}
    </>
  );
};
