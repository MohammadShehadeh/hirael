import Link from 'next/link';
import type * as React from 'react';

import { cn } from '@/lib/utils';
import { CATEGORIES_BY_GROUP } from '@/components/block-categories';
import { SectionLabel } from '@/components/page-header';
import { BLOCKS_BY_KIND } from '@/registry/hirael/registry-meta';

const CARD_SHELL =
  'group relative flex aspect-video size-full flex-col overflow-hidden rounded-md border border-border bg-card/55 shadow-xs outline-none transition-colors hover:border-warm/45 focus-visible:border-warm focus-visible:ring-[3px] focus-visible:ring-ring/40 xl:aspect-[1.8/1] dark:bg-[radial-gradient(90%_120%_at_50%_0%,color-mix(in_oklch,var(--foreground)_8%,transparent),transparent)]';

interface BarProps {
  className?: string;
}

const Bar = ({ className }: BarProps) => {
  return <div className={cn('rounded-full bg-foreground/12', className)} />;
};

const ART: Record<string, React.ReactNode> = {
  hero: (
    <div className="flex size-full flex-col items-center justify-center gap-1.5">
      <Bar className="h-2.5 w-2/5" />
      <Bar className="h-2.5 w-1/4" />
      <Bar className="mt-0.5 h-1 w-1/2 bg-foreground/6" />
      <div className="mt-1.5 flex gap-1.5">
        <div className="h-4 w-11 rounded-sm bg-warm" />
        <div className="h-4 w-11 rounded-sm border border-border" />
      </div>
    </div>
  ),

  features: (
    <div className="grid size-full grid-cols-3">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn('flex flex-col items-center justify-center gap-1.5', i < 2 && 'border-e border-border')}
        >
          <span className={cn('size-3 rounded-sm', i === 1 ? 'bg-warm' : 'bg-foreground/12')} />
          <Bar className="h-1 w-8" />
          <Bar className="h-1 w-10 bg-foreground/6" />
        </div>
      ))}
    </div>
  ),

  process: (
    <div className="flex size-full flex-col justify-center gap-2.5 px-6">
      <div className="flex items-center">
        {[0, 1, 2].map((i) => (
          <div key={i} className={cn('flex items-center', i < 2 && 'flex-1')}>
            <span
              className={cn(
                'flex size-5 shrink-0 items-center justify-center rounded-full border text-[9px] tabular-nums',
                i === 0 ? 'border-warm text-warm' : 'border-border text-foreground/40',
              )}
            >
              {i + 1}
            </span>
            {i < 2 && <span className="h-px flex-1 bg-border" />}
          </div>
        ))}
      </div>
      <div className="flex items-start justify-between">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex w-12 flex-col items-center gap-1">
            <Bar className="h-1 w-8" />
            <Bar className="h-0.5 w-10 bg-foreground/6" />
          </div>
        ))}
      </div>
    </div>
  ),

  pricing: (
    <div className="grid size-full grid-cols-3 items-end gap-2 px-3 pb-3">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            'flex flex-col items-center gap-1.5 border-t-2 pt-2',
            i === 1 ? 'h-[76%] border-warm warm-tint' : 'h-[60%] border-border',
          )}
        >
          <Bar className="h-0.5 w-6 bg-foreground/6" />
          <Bar className={cn('h-2.5 w-8', i === 1 && 'bg-warm')} />
          <Bar className="h-0.5 w-10 bg-foreground/6" />
          <Bar className="h-0.5 w-8 bg-foreground/6" />
        </div>
      ))}
    </div>
  ),

  team: (
    <div className="flex size-full items-center justify-center gap-2.5">
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className="flex flex-col items-center gap-1.5">
          <span className={cn('rounded-full', i === 2 ? 'size-8 bg-warm' : 'size-6 bg-foreground/12')} />
          <Bar className="h-0.5 w-6 bg-foreground/6" />
        </div>
      ))}
    </div>
  ),

  stats: (
    <div className="grid size-full grid-cols-3">
      {['1.2M', '99.9%', '48ms'].map((value, i) => (
        <div
          key={value}
          className={cn('flex flex-col items-center justify-center gap-1.5', i < 2 && 'border-e border-border')}
        >
          <span className={cn('text-sm tabular-nums', i === 1 ? 'text-warm' : 'text-foreground/45')}>{value}</span>
          <Bar className="h-0.5 w-9 bg-foreground/6" />
        </div>
      ))}
    </div>
  ),

  comparison: (
    <div className="grid size-full grid-cols-2">
      <div className="flex flex-col justify-center gap-2.5 border-e border-border warm-tint px-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="size-1.5 shrink-0 rounded-full bg-warm" />
            <Bar className="h-1 flex-1" />
          </div>
        ))}
      </div>
      <div className="flex flex-col justify-center gap-2.5 px-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="h-px w-1.5 shrink-0 bg-foreground/25" />
            <Bar className="h-1 flex-1 bg-foreground/6" />
          </div>
        ))}
      </div>
    </div>
  ),

  testimonials: (
    <div className="flex size-full flex-col justify-center gap-2 px-5">
      <Bar className="h-1.5 w-full" />
      <Bar className="h-1.5 w-11/12" />
      <Bar className="h-1.5 w-3/5" />
      <div className="mt-1.5 flex items-center gap-2">
        <span className="size-5 shrink-0 rounded-full bg-warm" />
        <div className="flex flex-col gap-1">
          <Bar className="h-1 w-14" />
          <Bar className="h-0.5 w-9 bg-foreground/6" />
        </div>
      </div>
    </div>
  ),

  cta: (
    <div className="flex size-full items-center">
      <div className="flex w-full items-center justify-between gap-4 border-y border-border warm-tint px-5 py-4">
        <div className="flex flex-col gap-1.5">
          <Bar className="h-2 w-24" />
          <Bar className="h-1 w-16 bg-foreground/6" />
        </div>
        <div className="h-5 w-12 shrink-0 rounded-sm bg-warm" />
      </div>
    </div>
  ),

  newsletter: (
    <div className="flex size-full flex-col justify-center gap-2 px-7">
      <Bar className="h-2 w-2/5" />
      <Bar className="h-1 w-3/5 bg-foreground/6" />
      <div className="mt-1 flex items-center gap-1.5">
        <div className="flex h-5 flex-1 items-center gap-1 rounded-sm border border-border px-1.5">
          <span className="h-2.5 w-px bg-foreground/35" />
          <Bar className="h-1 w-14 bg-foreground/8" />
        </div>
        <div className="h-5 w-11 shrink-0 rounded-sm bg-warm" />
      </div>
      <div className="flex items-center gap-1.5">
        <span className="size-2 shrink-0 rounded-xs border border-border" />
        <Bar className="h-0.5 w-20 bg-foreground/6" />
      </div>
    </div>
  ),

  faqs: (
    <div className="flex size-full flex-col">
      <div className="flex min-h-0 flex-1 items-center justify-between gap-3 border-b border-border px-5">
        <Bar className="h-1 w-24" />
        <span className="size-1.5 shrink-0 rotate-45 border-e border-b border-foreground/35" />
      </div>
      <div className="flex min-h-0 flex-[1.7] flex-col justify-center gap-1.5 border-b border-border warm-tint px-5">
        <div className="flex items-center justify-between gap-3">
          <Bar className="h-1 w-20 bg-warm" />
          <span className="size-1.5 shrink-0 rotate-225 border-e border-b border-warm" />
        </div>
        <Bar className="h-0.5 w-full bg-foreground/6" />
        <Bar className="h-0.5 w-4/5 bg-foreground/6" />
      </div>
      <div className="flex min-h-0 flex-1 items-center justify-between gap-3 px-5">
        <Bar className="h-1 w-16" />
        <span className="size-1.5 shrink-0 rotate-45 border-e border-b border-foreground/35" />
      </div>
    </div>
  ),

  auth: (
    <div className="flex size-full flex-col justify-center gap-2 px-9 py-4">
      <div className="flex h-4 items-center rounded-sm border border-border px-2">
        <Bar className="h-1 w-16 bg-foreground/10" />
      </div>
      <div className="flex h-4 items-center gap-1 rounded-sm border border-border px-2">
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <span key={i} className="size-1 rounded-full bg-foreground/30" />
        ))}
      </div>
      <div className="h-4 rounded-sm bg-warm" />
    </div>
  ),

  header: (
    <div className="flex size-full flex-col">
      <div className="flex items-center gap-2.5 border-b border-border px-3 py-3">
        <span className="size-3 shrink-0 rounded-sm bg-foreground/25" />
        <Bar className="h-1.5 w-7 bg-foreground/20" />
        <div className="ms-2 flex items-center gap-2.5">
          <div className="flex flex-col items-center gap-1">
            <Bar className="h-1 w-6 bg-warm" />
            <span className="h-px w-6 bg-warm" />
          </div>
          <Bar className="h-1 w-5" />
          <div className="flex items-center gap-1">
            <Bar className="h-1 w-6" />
            <span className="size-1 rotate-45 border-e border-b border-foreground/30" />
          </div>
        </div>
        <div className="ms-auto h-4 w-9 shrink-0 rounded-sm border border-border" />
      </div>
      <div className="mx-auto mt-3 flex w-2/5 items-center justify-between rounded-sm border border-border px-1.5 py-1.5">
        <span className="size-2 shrink-0 rounded-xs bg-foreground/20" />
        <div className="flex flex-col gap-0.5">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-px w-3 bg-foreground/35" />
          ))}
        </div>
      </div>
    </div>
  ),

  footer: (
    <div className="flex size-full flex-col justify-end">
      <div className="flex flex-1 flex-col items-center justify-center gap-1.5">
        <Bar className="h-1.5 w-1/4 bg-foreground/6" />
      </div>
      <div className="grid grid-cols-4 gap-3 border-t border-border px-3 pt-3 pb-3">
        {[3, 3, 2, 2].map((rows, column) => (
          <div key={column} className="flex flex-col gap-1">
            <Bar className={cn('h-1 w-6', column === 0 ? 'bg-warm' : 'bg-foreground/25')} />
            {Array.from({ length: rows }).map((_, row) => (
              <Bar key={row} className="h-0.5 w-full bg-foreground/6" />
            ))}
          </div>
        ))}
      </div>
    </div>
  ),

  'not-found': (
    <div className="flex size-full flex-col items-center justify-center gap-2">
      <span className="text-display text-4xl leading-none text-foreground/15 italic">404</span>
      <div className="flex gap-1.5">
        <div className="h-4 w-11 rounded-sm bg-warm" />
        <div className="h-4 w-11 rounded-sm border border-border" />
      </div>
    </div>
  ),

  changelog: (
    <div className="relative flex size-full flex-col justify-center gap-3">
      <span aria-hidden className="absolute inset-y-3 start-5 w-px bg-foreground/15" />
      {['v6.7', 'v6.6', 'v6.5'].map((version, i) => (
        <div key={version} className="relative flex items-center gap-2.5 ps-4 pe-5">
          <span className={cn('size-2 shrink-0 rounded-full', i === 0 ? 'bg-warm' : 'bg-foreground/25')} />
          <span className="text-[9px] text-foreground/40 tabular-nums">{version}</span>
          <Bar className={cn('h-1 flex-1', i > 0 && 'bg-foreground/6')} />
        </div>
      ))}
    </div>
  ),

  blog: (
    <div className="flex size-full flex-col px-4 py-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className={cn('flex min-h-0 flex-1 items-center gap-2.5', i < 2 && 'border-b border-border')}>
          <span className={cn('h-2/3 w-6 shrink-0 rounded-sm', i === 0 ? 'bg-warm' : 'bg-foreground/10')} />
          <div className="flex flex-1 flex-col gap-1">
            <Bar className="h-1 w-full" />
            <Bar className="h-0.5 w-2/3 bg-foreground/6" />
          </div>
        </div>
      ))}
    </div>
  ),

  contact: (
    <div className="grid size-full grid-cols-[0.85fr_1.15fr]">
      <div className="flex flex-col justify-center gap-2.5 border-e border-border px-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="size-2 shrink-0 rounded-sm bg-foreground/15" />
            <Bar className="h-1 flex-1 bg-foreground/8" />
          </div>
        ))}
      </div>
      <div className="flex flex-col justify-center gap-1.5 px-4">
        <div className="h-3.5 rounded-sm border border-border" />
        <div className="h-6 rounded-sm border border-border" />
        <div className="h-4 w-14 rounded-sm bg-warm" />
      </div>
    </div>
  ),

  careers: (
    <div className="flex size-full flex-col px-5 py-3">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn('flex min-h-0 flex-1 items-center justify-between gap-3', i < 2 && 'border-b border-border')}
        >
          <div className="flex flex-col gap-1">
            <Bar className="h-1 w-20" />
            <Bar className="h-0.5 w-12 bg-foreground/6" />
          </div>
          <span className={cn('h-3.5 w-9 shrink-0 rounded-full', i === 0 ? 'bg-warm' : 'border border-border')} />
        </div>
      ))}
    </div>
  ),

  ecommerce: (
    <div className="grid size-full grid-cols-4 gap-2 px-3 py-3">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="flex flex-col gap-1">
          <div className={cn('flex-1 rounded-sm', i === 1 ? 'bg-warm' : 'bg-foreground/10')} />
          <Bar className="h-1 w-full" />
          <Bar className="h-0.5 w-1/2 bg-foreground/6" />
        </div>
      ))}
    </div>
  ),

  'image-gallery': (
    <div className="grid size-full grid-cols-4 grid-rows-3 gap-1 p-1.5">
      {['col-span-2 row-span-2', 'col-span-2', '', '', 'col-span-2', '', ''].map((span, i) => (
        <div key={i} className={cn('rounded-sm', span, i === 3 ? 'bg-warm' : 'bg-foreground/10')} />
      ))}
    </div>
  ),

  integrations: (
    <div className="flex size-full items-center justify-center">
      <div className="relative aspect-square h-[82%]">
        <span className="absolute inset-y-2 left-1/2 w-px -translate-x-1/2 bg-border" />
        <span className="absolute inset-x-2 top-1/2 h-px -translate-y-1/2 bg-border" />
        <span className="absolute inset-0 m-auto size-7 rounded-full bg-warm" />
        {[
          'top-0 left-1/2 -translate-x-1/2',
          'bottom-0 left-1/2 -translate-x-1/2',
          'left-0 top-1/2 -translate-y-1/2',
          'right-0 top-1/2 -translate-y-1/2',
        ].map((position) => (
          <span
            key={position}
            className={cn(
              'absolute flex size-5 items-center justify-center rounded-sm border border-border bg-card',
              position,
            )}
          >
            <span className="size-1.5 rounded-xs bg-foreground/20" />
          </span>
        ))}
      </div>
    </div>
  ),

  'logo-cloud': (
    <div className="flex size-full flex-col justify-center gap-2 mask-[linear-gradient(to_right,transparent,black_18%,black_82%,transparent)]">
      {[
        ['w-11', 'w-14', 'w-10', 'w-12'],
        ['w-12', 'w-9', 'w-14', 'w-11'],
      ].map((widths, row) => (
        <div key={row} className="flex justify-center gap-2">
          {widths.map((width, i) => (
            <span
              key={i}
              className={cn('h-4 shrink-0 rounded-sm', width, row === 0 && i === 1 ? 'bg-warm' : 'bg-foreground/10')}
            />
          ))}
        </div>
      ))}
    </div>
  ),

  'app-shell': (
    <div className="flex size-full">
      <div className="flex w-[22%] flex-col gap-1.5 border-e border-border p-2">
        <Bar className="h-1.5 w-2/3 bg-warm" />
        {[0, 1, 2, 3].map((i) => (
          <Bar key={i} className="h-1 w-full bg-foreground/8" />
        ))}
      </div>
      <div className="flex flex-1 flex-col">
        <div className="flex items-center justify-between gap-2 border-b border-border px-2.5 py-2">
          <Bar className="h-1 w-12" />
          <span className="size-2 shrink-0 rounded-full bg-foreground/12" />
        </div>
        <div className="grid flex-1 grid-cols-2 gap-1.5 p-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="rounded-sm bg-foreground/6" />
          ))}
        </div>
      </div>
    </div>
  ),

  dashboard: (
    <div className="flex size-full flex-col gap-2.5 p-3">
      <div className="grid grid-cols-3 gap-2.5">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex flex-col gap-1">
            <Bar className="h-0.5 w-2/3 bg-foreground/6" />
            <Bar className="h-1.5 w-full" />
          </div>
        ))}
      </div>
      <div className="flex flex-1 items-end gap-1">
        {[45, 70, 38, 82, 60, 96, 52, 74, 44, 66].map((height, i) => (
          <div
            key={i}
            className={cn('flex-1 rounded-t-xs', i === 5 ? 'bg-warm' : 'bg-foreground/12')}
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
    </div>
  ),

  cloud: (
    <div className="flex size-full flex-col px-4 py-3">
      {[0, 1, 2, 3].map((row) => (
        <div key={row} className="flex min-h-0 flex-1 items-center gap-2">
          <span className={cn('size-1.5 shrink-0 rounded-full', row === 1 ? 'bg-warm' : 'bg-foreground/20')} />
          <Bar className="h-1 w-10" />
          <span className="h-px flex-1 bg-border" />
          <div className="flex gap-0.5">
            {Array.from({ length: 6 }).map((_, cell) => (
              <span
                key={cell}
                className={cn('size-1.5 rounded-xs', (row + cell) % 3 === 0 ? 'bg-foreground/20' : 'bg-foreground/8')}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  ),

  saas: (
    <div className="flex size-full flex-col px-5 py-3">
      <div className="-mx-2 flex min-h-0 flex-1 items-center gap-2 rounded-sm warm-tint px-2">
        <span className="flex size-3 shrink-0 items-center justify-center rounded-full border border-warm">
          <span className="size-1 rounded-full bg-warm" />
        </span>
        <Bar className="h-1 w-12 bg-warm/70" />
        <span className="ms-auto text-[10px] text-warm tabular-nums">$29</span>
      </div>
      <div className="-mx-2 flex min-h-0 flex-1 items-center gap-2 px-2">
        <span className="size-3 shrink-0 rounded-full border border-border" />
        <Bar className="h-1 w-10 bg-foreground/10" />
        <span className="ms-auto text-[10px] text-foreground/35 tabular-nums">$99</span>
      </div>
      <div className="flex min-h-0 flex-1 flex-col justify-center gap-1 border-t border-border">
        <div className="flex items-baseline justify-between gap-3">
          <Bar className="h-0.5 w-10 bg-foreground/10" />
          <span className="text-[9px] text-foreground/40 tabular-nums">6.8k / 10k</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-foreground/8">
          <div className="h-full w-[68%] rounded-full bg-foreground/30" />
        </div>
      </div>
    </div>
  ),

  ai: (
    <div className="flex size-full flex-col justify-center gap-2 px-4 py-4">
      <div className="flex justify-end">
        <div className="w-1/2 rounded-md rounded-ee-xs bg-foreground/10 px-2 py-1.5">
          <Bar className="h-1 w-full bg-foreground/25" />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <Bar className="h-1 w-full" />
        <div className="flex items-center gap-1">
          <Bar className="h-1 w-2/5" />
          <span className="h-2.5 w-px bg-warm" />
        </div>
      </div>
      <div className="flex items-center gap-1.5 rounded-full border border-border px-1.5 py-1">
        <span className="rounded-full bg-foreground/8 px-1.5 py-1">
          <Bar className="h-0.5 w-5 bg-foreground/25" />
        </span>
        <Bar className="h-1 flex-1 bg-foreground/6" />
        <span className="size-3 shrink-0 rounded-full bg-foreground/20" />
      </div>
    </div>
  ),

  widgets: (
    <div className="grid size-full grid-cols-2 grid-rows-2">
      {['84%', '1.2k', '37', '99'].map((value, i) => (
        <div
          key={value}
          className={cn(
            'flex flex-col justify-center gap-1.5 px-4',
            i % 2 === 0 && 'border-e border-border',
            i < 2 && 'border-b border-border',
          )}
        >
          <Bar className="h-0.5 w-2/3 bg-foreground/6" />
          <span className={cn('text-[11px] tabular-nums', i === 0 ? 'text-warm' : 'text-foreground/40')}>{value}</span>
          <Bar className="h-0.5 w-full bg-foreground/6" />
        </div>
      ))}
    </div>
  ),
};

const FALLBACK_ART = (
  <div className="flex size-full flex-col items-center justify-center gap-1.5">
    <Bar className="h-2 w-2/5" />
    <Bar className="h-1 w-1/2 bg-foreground/6" />
    <Bar className="h-1 w-1/3 bg-foreground/6" />
  </div>
);

export const BlockShowcase = () => {
  return (
    <div className="flex flex-col gap-10 sm:gap-12">
      {CATEGORIES_BY_GROUP.map(({ group, label, categories }) => {
        const blockCount = categories.reduce(
          (sum, category) => sum + (category.blockKind ? BLOCKS_BY_KIND[category.blockKind].length : 0),
          0,
        );

        return (
          <section key={group} className="flex flex-col gap-4">
            <div className="flex items-baseline justify-between">
              <SectionLabel>{label}</SectionLabel>
              <span className="text-xs text-muted-foreground uppercase tabular-nums">{blockCount} blocks</span>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-3 xl:grid-cols-4">
              {categories.map((category) => {
                const count = category.blockKind ? BLOCKS_BY_KIND[category.blockKind].length : 0;

                return (
                  <Link
                    key={category.slug}
                    href={`/blocks/${category.slug}`}
                    aria-label={`Browse ${category.title} blocks, ${count} in total`}
                    className={CARD_SHELL}
                  >
                    <div aria-hidden className="blueprint-corners pointer-events-none absolute inset-0 opacity-20" />
                    <div className="relative z-10 flex items-baseline gap-2 px-3 pt-2.5 pb-2">
                      <h3 className="truncate text-sm font-medium tracking-tight">{category.title}</h3>
                      <span className="ms-auto text-[11px] text-muted-foreground tabular-nums">{count}</span>
                    </div>
                    <div className="relative z-10 flex-1 overflow-hidden border-t border-border/70">
                      {ART[category.slug] ?? FALLBACK_ART}
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
};
