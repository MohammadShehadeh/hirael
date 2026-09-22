'use client';

import * as React from 'react';
import Image from 'next/image';
import { Maximize2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  Lightbox,
  LightboxContent,
  LightboxThumbnails,
  LightboxTrigger,
  type LightboxItem,
} from '@/registry/hirael/bases/base/components/lightbox';
import { Button } from '@/registry/hirael/bases/base/ui/button';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@/registry/hirael/bases/base/ui/empty';
import { Tabs, TabsList, TabsTrigger } from '@/registry/hirael/bases/base/ui/tabs';

const ENTER =
  'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';
const SWAP =
  'animate-in fade-in slide-in-from-bottom-2 duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const stagger = (index: number, step = 60, offset = 0): React.CSSProperties => ({
  animationDelay: `${offset + index * step}ms`,
});

interface Tile {
  client: string;
  project: string;
  year: string;
  type: string;
  tag: Exclude<Filter, 'All'>;
  aspect: string;
  src: string;
}

const FILTERS = ['All', 'Web', 'Brand', 'Editorial', 'Motion', 'Print'] as const;
type Filter = (typeof FILTERS)[number];

// Placeholder photos served from hirael.com. Swap them for your own assets, or
// add the host to `images.remotePatterns` in next.config to keep them.
const IMG = {
  a: '/media/blocks/image-gallery-01/tile-a.jpg',
  b: '/media/blocks/image-gallery-01/tile-b.jpg',
  c: '/media/blocks/image-gallery-01/tile-c.jpg',
} as const;

const TILES: readonly Tile[] = [
  {
    client: 'Helix',
    project: 'Marketing site',
    year: '2026',
    type: 'Case study',
    tag: 'Web',
    aspect: 'aspect-[4/5]',
    src: IMG.a,
  },
  {
    client: 'Northwind',
    project: 'Checkout',
    year: '2026',
    type: 'Product',
    tag: 'Web',
    aspect: 'aspect-[16/10]',
    src: IMG.b,
  },
  {
    client: 'Vanta',
    project: 'Annual report',
    year: '2025',
    type: 'Editorial',
    tag: 'Editorial',
    aspect: 'aspect-square',
    src: IMG.c,
  },
  {
    client: 'Brella',
    project: 'Identity',
    year: '2025',
    type: 'Brand',
    tag: 'Brand',
    aspect: 'aspect-[3/4]',
    src: IMG.a,
  },
  {
    client: 'Quartz',
    project: 'Motion reel',
    year: '2026',
    type: 'Motion',
    tag: 'Motion',
    aspect: 'aspect-[16/10]',
    src: IMG.c,
  },
  {
    client: 'Plinth',
    project: 'Field guide',
    year: '2025',
    type: 'Editorial',
    tag: 'Editorial',
    aspect: 'aspect-[4/5]',
    src: IMG.b,
  },
  {
    client: 'Lattice',
    project: 'Product UI',
    year: '2026',
    type: 'Product',
    tag: 'Web',
    aspect: 'aspect-[4/3]',
    src: IMG.c,
  },
  {
    client: 'Mercado',
    project: 'Packaging',
    year: '2025',
    type: 'Brand',
    tag: 'Brand',
    aspect: 'aspect-square',
    src: IMG.a,
  },
];

const countFor = (filter: Filter) => (filter === 'All' ? TILES.length : TILES.filter((t) => t.tag === filter).length);

const ImageGallery01 = () => {
  const [filter, setFilter] = React.useState<Filter>('All');
  const [hasFiltered, setHasFiltered] = React.useState(false);
  const [index, setIndex] = React.useState(0);
  const tileRefs = React.useRef<(HTMLButtonElement | null)[]>([]);

  const visible = filter === 'All' ? TILES : TILES.filter((t) => t.tag === filter);
  const items: LightboxItem[] = visible.map((t) => ({
    src: t.src,
    alt: `${t.client}, ${t.project}`,
    caption: `${t.client}, ${t.project}, ${t.year}`,
  }));

  const changeFilter = (next: string) => {
    setFilter(next as Filter);
    setHasFiltered(true);
    setIndex(0);
  };

  return (
    <section
      data-slot="image-gallery"
      className="bg-background py-20 sm:py-28"
      aria-labelledby="image-gallery-01-heading"
    >
      <div className="container w-full">
        <div
          data-slot="image-gallery-header"
          className="flex flex-col gap-5 border-b border-border pb-8 sm:flex-row sm:items-end sm:justify-between sm:pb-10"
        >
          <div className="flex max-w-xl flex-col gap-4">
            <span className={cn(ENTER, 'text-xs uppercase text-muted-foreground')}>Selected work 2025-2026</span>
            <h2
              id="image-gallery-01-heading"
              style={stagger(1, 70)}
              className={cn(ENTER, 'font-serif text-4xl font-medium leading-[1.04] tracking-tight sm:text-5xl')}
            >
              A studio archive, gridded.
            </h2>
            <p style={stagger(2, 70)} className={cn(ENTER, 'text-base text-muted-foreground')}>
              Eight pieces from the last 14 months: websites, identity work, an annual report, and a motion reel. Open
              any of them to see the full frame.
            </p>
          </div>

          <Tabs
            value={filter}
            onValueChange={changeFilter}
            aria-label="Filter gallery by category"
            style={stagger(3, 70)}
            className={ENTER}
          >
            <TabsList variant="line" className="flex-wrap group-data-[orientation=horizontal]/tabs:h-auto">
              {FILTERS.map((f) => (
                <TabsTrigger key={f} value={f}>
                  <span className="uppercase">{f}</span>
                  <span className="text-[10px] tabular-nums text-muted-foreground">{countFor(f)}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {visible.length === 0 ? (
          <Empty key={filter} data-slot="image-gallery-empty" className={cn(SWAP, 'mt-10')}>
            <EmptyHeader>
              <EmptyTitle>No {filter.toLowerCase()} work yet</EmptyTitle>
              <EmptyDescription>
                Our first print catalogue goes to press in the spring. Everything else is in the archive.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button variant="outline" size="sm" onClick={() => changeFilter('All')}>
                Show all work
              </Button>
            </EmptyContent>
          </Empty>
        ) : (
          <Lightbox items={items} index={index} onIndexChange={setIndex}>
            <ul
              key={filter}
              data-slot="image-gallery-grid"
              className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4"
            >
              {visible.map((t, tileIndex) => (
                <li
                  key={`${t.client}-${t.project}`}
                  style={hasFiltered ? stagger(tileIndex, 40) : stagger(tileIndex, 50, 300)}
                  className={cn(hasFiltered ? SWAP : ENTER, 'break-inside-avoid')}
                >
                  <LightboxTrigger
                    index={tileIndex}
                    data-slot="image-gallery-tile"
                    aria-label={`${t.client}, ${t.project}. Open image ${tileIndex + 1} of ${visible.length}`}
                    render={
                      <button
                        type="button"
                        ref={(node: HTMLButtonElement | null) => {
                          tileRefs.current[tileIndex] = node;
                        }}
                        className="group block w-full cursor-zoom-in rounded-md border border-border bg-card text-start transition-colors duration-150 hover:border-foreground/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      />
                    }
                  >
                    <span className={cn('relative block overflow-hidden rounded-t-md bg-muted', t.aspect)}>
                      <Image
                        src={t.src}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 motion-reduce:transition-none"
                      />
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-0 bg-linear-to-b from-black/40 via-black/0 to-black/10"
                      />
                      <span className="absolute start-3 top-3 inline-flex items-center rounded-full border border-white/30 bg-black/20 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
                        {t.tag}
                      </span>
                      <span
                        aria-hidden
                        className="absolute end-3 top-3 inline-flex size-7 items-center justify-center rounded-sm border border-white/30 bg-black/20 text-white opacity-0 backdrop-blur-sm transition-[opacity,transform] duration-150 ease-out group-hover:scale-105 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none"
                      >
                        <Maximize2 className="size-3.5" />
                      </span>
                    </span>
                    <span className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 px-4 py-3">
                      <span className="flex min-w-0 flex-wrap items-baseline gap-x-2 text-sm tracking-[-0.01em]">
                        <span className="font-medium text-foreground">{t.client}</span>
                        <span className="text-muted-foreground">{t.project}</span>
                      </span>
                      <span className="flex shrink-0 items-center gap-2 text-xs uppercase text-muted-foreground">
                        <span className="tabular-nums">{t.year}</span>
                        <span aria-hidden className="text-border">
                          |
                        </span>
                        <span>{t.type}</span>
                      </span>
                    </span>
                  </LightboxTrigger>
                </li>
              ))}
            </ul>

            <LightboxContent finalFocus={() => tileRefs.current[index] ?? true}>
              <LightboxThumbnails />
            </LightboxContent>
          </Lightbox>
        )}
      </div>
    </section>
  );
};

export default ImageGallery01;
