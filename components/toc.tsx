'use client';

import * as React from 'react';
import { cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { Badge } from '@/registry/hirael/bases/radix/ui/badge';

export interface TocItem {
  id: string;
  label: string;
}

interface TocProps {
  items: TocItem[];
  className?: string;
}

const tocLinkVariants = cva('block border-s py-1 ps-3 text-[13px] leading-snug transition-colors', {
  variants: {
    active: {
      true: 'border-s-accent-cool font-medium text-foreground',
      false: 'border-s-border/60 text-muted-foreground hover:border-s-foreground/40 hover:text-foreground',
    },
  },
  defaultVariants: { active: false },
});

export const Toc = ({ items, className }: TocProps) => {
  const active = useActiveSection(items.map((i) => i.id));

  if (items.length < 2) return null;

  return (
    <nav aria-label="On this page" className={cn('flex flex-col gap-3', className)}>
      <p className="text-xs text-muted-foreground uppercase">On this page</p>
      <ul className="flex flex-col">
        {items.map((item) => {
          const isActive = item.id === active;

          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={isActive ? 'location' : undefined}
                className={tocLinkVariants({ active: isActive })}
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export const TocChips = ({ items, className }: TocProps) => {
  const active = useActiveSection(items.map((i) => i.id));

  if (items.length < 2) return null;

  return (
    <nav aria-label="On this page" className={cn('flex items-center gap-1.5 overflow-x-auto pb-0.5', className)}>
      {items.map((item) => {
        const isActive = item.id === active;

        return (
          <Badge key={item.id} variant={isActive ? 'secondary' : 'outline'} asChild>
            <a href={`#${item.id}`} aria-current={isActive ? 'location' : undefined}>
              {item.label}
            </a>
          </Badge>
        );
      })}
    </nav>
  );
};

const useActiveSection = (ids: string[]) => {
  const [active, setActive] = React.useState<string | null>(ids[0] ?? null);
  // Joined so the effect reruns when the ids change, not when the array is a new object.
  const key = ids.join('|');

  React.useEffect(() => {
    const sectionIds = key ? key.split('|') : [];
    if (sectionIds.length === 0) return;

    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        const current = sectionIds.find((id) => visible.has(id));
        if (current) setActive(current);
      },
      // Clear the sticky tabs, and mark a heading active before it leaves the top third.
      { rootMargin: '-72px 0px -66% 0px', threshold: 0 },
    );

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [key]);

  return active;
};
