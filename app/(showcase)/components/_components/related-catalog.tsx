import Link from 'next/link';
import { ArrowRight, Frame, Layers, type LucideIcon } from 'lucide-react';

import { BLOCK_KIND_ORDER, REGISTRY_BY_CATEGORY, TEMPLATES } from '@/registry/hirael/registry-meta';

interface RelatedLinkProps {
  href: string;
  icon: LucideIcon;
  title: string;
  detail: string;
}

const RelatedLink = ({ href, icon: Icon, title, detail }: RelatedLinkProps) => {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between gap-4 rounded-md border border-border bg-card p-4 transition-colors hover:bg-accent"
    >
      <div className="flex items-center gap-3">
        <span className="inline-flex size-9 items-center justify-center rounded-md border border-border bg-background">
          <Icon className="size-4 text-foreground" />
        </span>
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium">{title}</span>
          <span className="text-xs text-muted-foreground uppercase">{detail}</span>
        </div>
      </div>
      <ArrowRight className="size-4 text-muted-foreground transition-transform duration-150 ease-out group-hover:translate-x-0.5 group-hover:text-foreground rtl:rotate-180" />
    </Link>
  );
};

export const RelatedCatalog = () => {
  const blocks = REGISTRY_BY_CATEGORY.blocks;

  return (
    <section className="grid gap-3 border-t border-border pt-10 sm:grid-cols-2">
      <RelatedLink
        href="/blocks"
        icon={Layers}
        title={`${blocks.length} section blocks`}
        detail={`${BLOCK_KIND_ORDER.length} categories, preview and install`}
      />
      <RelatedLink
        href="/templates"
        icon={Frame}
        title={`${TEMPLATES.length} full-page templates`}
        detail="landing pages, preview and install"
      />
    </section>
  );
};
