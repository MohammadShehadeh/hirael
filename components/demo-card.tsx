'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useRegistryBase } from '@/components/active-theme';
import { NewBadge } from '@/components/new-badge';
import { RegistryDemo } from '@/registry/hirael/registry-demos';
import { CATEGORY_LABELS, entryHref, type RegistryEntryMeta } from '@/registry/hirael/registry-meta';

export interface DemoCardProps {
  entry: RegistryEntryMeta;
  className?: string;
  compact?: boolean;
  addedAt?: string;
}

export const DemoCard = ({ entry, className, compact = false, addedAt }: DemoCardProps) => {
  const href = entryHref(entry);
  const [engaged, setEngaged] = React.useState(false);
  const hoverCapable = useHoverCapable();

  return (
    <article
      data-slot="demo-card"
      data-customizer-scope=""
      onPointerEnter={() => setEngaged(true)}
      onPointerLeave={() => setEngaged(false)}
      onFocus={() => setEngaged(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setEngaged(false);
        }
      }}
      className={cn(
        'group/card relative flex flex-col overflow-hidden rounded-md border border-border bg-card transition-colors hover:border-foreground/30',
        className,
      )}
    >
      <LazyDemo name={entry.name} compact={compact} inert={!engaged && hoverCapable} />
      <div className={cn('flex flex-col gap-1.5 border-t border-border', compact ? 'px-4 py-3' : 'p-4')}>
        <div className="flex items-center justify-between gap-2">
          <h3 className="flex min-w-0 items-center gap-2 text-sm font-medium tracking-[-0.01em]">
            <Link
              href={href}
              className="truncate outline-none after:absolute after:inset-0 after:content-[''] focus-visible:underline"
            >
              {entry.title}
            </Link>
            {compact && <NewBadge addedAt={addedAt} />}
          </h3>
          {!compact && (
            <span className="shrink-0 text-xs uppercase text-muted-foreground">{CATEGORY_LABELS[entry.category]}</span>
          )}
        </div>
        {!compact && (
          <>
            <p className="line-clamp-2 text-xs text-muted-foreground">{entry.description}</p>
            <span className="mt-1 inline-flex items-center gap-1 text-xs uppercase tracking-[0.12em] text-muted-foreground transition-colors group-hover/card:text-foreground">
              View
              <ArrowRight className="size-3 transition-transform group-hover/card:translate-x-0.5 rtl:rotate-180" />
            </span>
          </>
        )}
      </div>
    </article>
  );
};

const PREVIEW_FRAME = 'bg-dot-grid relative flex items-center justify-center overflow-hidden p-5';

const hoverQuery = typeof window !== 'undefined' ? window.matchMedia('(hover: hover) and (pointer: fine)') : null;

const subscribeHover = (onChange: () => void) => {
  hoverQuery?.addEventListener('change', onChange);
  return () => hoverQuery?.removeEventListener('change', onChange);
};

const useHoverCapable = () => {
  return React.useSyncExternalStore(
    subscribeHover,
    () => hoverQuery?.matches ?? false,
    () => false,
  );
};

interface LazyDemoProps {
  name: string;
  inert: boolean;
  compact: boolean;
}

const LazyDemo = ({ name, inert, compact }: LazyDemoProps) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [isNear, setIsNear] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el || isNear) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsNear(true);
      },
      { rootMargin: '240px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isNear]);

  const base = useRegistryBase();

  return (
    <div ref={ref} inert={inert} className={cn(PREVIEW_FRAME, compact ? 'aspect-video' : 'h-60')}>
      <div className="mask-[linear-gradient(to_bottom,transparent,black_7%,black_93%,transparent)] relative z-10 flex max-h-full w-full items-center justify-center">
        {isNear && <RegistryDemo name={name} base={base} fallback={<DemoSkeleton />} />}
      </div>
    </div>
  );
};

const DemoSkeleton = () => {
  return <div aria-hidden className="h-9 w-2/3 animate-pulse rounded-md bg-muted-foreground/10" />;
};
