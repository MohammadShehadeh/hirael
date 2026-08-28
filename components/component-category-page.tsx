import { Breadcrumbs } from '@/components/breadcrumbs';
import { DemoCard } from '@/components/demo-card';
import {
  CATEGORY_LABELS,
  COMPONENT_CATEGORY_DESCRIPTIONS,
  REGISTRY_BY_CATEGORY,
  type COMPONENT_CATEGORY_ORDER,
} from '@/registry/hirael/registry-meta';

type ComponentCategory = (typeof COMPONENT_CATEGORY_ORDER)[number];

export const ComponentCategoryPage = ({ category }: { category: ComponentCategory }) => {
  const items = REGISTRY_BY_CATEGORY[category];
  const label = CATEGORY_LABELS[category];

  return (
    <div className="container flex w-full flex-col gap-10 py-10 sm:gap-12 sm:py-12 md:py-16">
      <Breadcrumbs items={[{ label: 'Components', href: '/components' }, { label }]} />

      <header className="flex flex-col gap-4 border-b border-border pb-8 sm:pb-10">
        <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">{label}.</h1>
        <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
          {COMPONENT_CATEGORY_DESCRIPTIONS[category]}
        </p>
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {items.length} component{items.length === 1 ? '' : 's'}
        </p>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((entry) => (
          <DemoCard key={entry.name} entry={entry} />
        ))}
      </section>
    </div>
  );
};
