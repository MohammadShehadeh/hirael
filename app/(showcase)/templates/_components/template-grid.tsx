import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { BlockPreview } from '@/components/block-preview';
import { TEMPLATES, entryFileLabel, entryHref, type RegistryEntryMeta } from '@/registry/hirael/registry-meta';

interface TemplateCardProps {
  entry: RegistryEntryMeta;
}

const TemplateCard = ({ entry }: TemplateCardProps) => {
  return (
    <Link
      href={entryHref(entry)}
      className="group flex flex-col overflow-hidden rounded-sm border border-border bg-background outline-none transition-colors hover:border-foreground focus-visible:border-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
    >
      <BlockPreview entry={entry} />

      <div className="flex flex-1 flex-col gap-2 p-4 sm:p-5">
        <h2 className="text-base font-medium tracking-[-0.01em]">{entry.title}</h2>
        <p className="line-clamp-2 text-xs text-muted-foreground">{entry.description}</p>
        {entry.dependencies?.length ? (
          <div className="flex flex-wrap gap-1.5">
            {entry.dependencies.map((dep) => (
              <span
                key={dep}
                className="rounded-full border border-border px-2 py-0.5 text-xs uppercase text-muted-foreground"
              >
                {dep}
              </span>
            ))}
          </div>
        ) : null}
        <div className="mt-auto flex items-center justify-between gap-2 border-t border-border pt-2.5 text-xs uppercase text-muted-foreground">
          <span>{entryFileLabel(entry)}</span>
          <span className="inline-flex shrink-0 items-center gap-1 transition-colors group-hover:text-foreground">
            view
            <ArrowRight className="size-3 transition-transform duration-150 ease-out group-hover:translate-x-0.5 rtl:rotate-180" />
          </span>
        </div>
      </div>
    </Link>
  );
};

export const TemplateGrid = () => {
  return (
    <section className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-2">
      {TEMPLATES.map((entry) => (
        <TemplateCard key={entry.name} entry={entry} />
      ))}
    </section>
  );
};
