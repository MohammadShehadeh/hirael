import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { DemoCard } from '@/components/demo-card';
import { SectionHeading } from '@/components/page-header';
import { COMPONENTS, REGISTRY_BY_NAME } from '@/registry/hirael/registry-meta';
import { Button } from '@/registry/hirael/bases/radix/ui/button';

const FEATURED_COMPONENTS = [
  'multi-select',
  'date-range-picker',
  'tag-input',
  'combobox',
  'currency-input',
  'rating',
] as const;

export const FeaturedComponents = () => {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="w-full px-4 sm:px-6">
        <SectionHeading
          kicker="Components"
          title="Try them before you install."
          blurb={`${COMPONENTS.length} components, each running live here and on its own page, so you can test keyboard, RTL and both themes before you install. These six are the ones most products reach for first.`}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED_COMPONENTS.map((name) => (
            <DemoCard key={name} entry={REGISTRY_BY_NAME[name]} />
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <Button variant="outline" asChild>
            <Link href="/components">
              All components
              <ArrowRight className="size-4 rtl:rotate-180" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
