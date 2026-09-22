'use client';

import * as React from 'react';
import { flushSync } from 'react-dom';
import Image from 'next/image';
import { LayoutGrid, Rows3 } from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  Lightbox,
  LightboxContent,
  LightboxThumbnails,
  LightboxTrigger,
  type LightboxItem,
} from '@/registry/hirael/bases/base/components/lightbox';
import { ToggleGroup, ToggleGroupItem } from '@/registry/hirael/bases/base/ui/toggle-group';

const ENTER =
  'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const stagger = (index: number, step = 60, offset = 0): React.CSSProperties => ({
  animationDelay: `${offset + index * step}ms`,
});

type View = 'grid' | 'rows';

interface Photo {
  location: string;
  date: string;
  alt: string;
  src: string;
  thumbnail: string;
  position: string;
}

// Placeholder photos served from hirael.com. Swap them for your own assets, or
// add the host to `images.remotePatterns` in next.config to keep them.
const IMG = {
  lake: { src: '/media/blocks/image-gallery-02/lake.jpg', thumbnail: '/media/blocks/image-gallery-02/lake-thumb.jpg' },
  forest: {
    src: '/media/blocks/image-gallery-02/forest.jpg',
    thumbnail: '/media/blocks/image-gallery-02/forest-thumb.jpg',
  },
  valley: {
    src: '/media/blocks/image-gallery-02/valley.jpg',
    thumbnail: '/media/blocks/image-gallery-02/valley-thumb.jpg',
  },
  ridge: {
    src: '/media/blocks/image-gallery-02/ridge.jpg',
    thumbnail: '/media/blocks/image-gallery-02/ridge-thumb.jpg',
  },
} as const;

const PHOTOS: readonly Photo[] = [
  {
    location: 'Lago di Braies, Italy',
    date: 'June 2026',
    alt: 'A rowing boat on a green alpine lake below pale limestone peaks',
    position: '50% 50%',
    ...IMG.lake,
  },
  {
    location: 'Feldberg trail, Germany',
    date: 'October 2025',
    alt: 'A dirt path through tall pines with low sun between the trunks',
    position: '50% 50%',
    ...IMG.forest,
  },
  {
    location: 'Yosemite Valley, California',
    date: 'May 2026',
    alt: 'Granite cliffs in wildfire haze above a shallow river at dusk',
    position: '50% 50%',
    ...IMG.valley,
  },
  {
    location: 'Ceahlau Massif, Romania',
    date: 'August 2025',
    alt: 'A hiker standing on a rock outcrop above misty green ridges',
    position: '50% 50%',
    ...IMG.ridge,
  },
  {
    location: 'Braies boathouse, Italy',
    date: 'July 2026',
    alt: 'Close view of a wooden rowing boat on clear turquoise water',
    position: '30% 85%',
    ...IMG.lake,
  },
  {
    location: 'Merced River, California',
    date: 'May 2026',
    alt: 'Smooth river stones in shallow water with pines behind',
    position: '75% 80%',
    ...IMG.valley,
  },
  {
    location: 'Toaca Peak, Romania',
    date: 'August 2025',
    alt: 'Weathered rock pillars on a grassy slope in late light',
    position: '55% 75%',
    ...IMG.ridge,
  },
  {
    location: 'Titisee woods, Germany',
    date: 'November 2025',
    alt: 'Mossy tree trunks at the edge of a forest clearing',
    position: '15% 60%',
    ...IMG.forest,
  },
];

const ITEMS: LightboxItem[] = PHOTOS.map((photo) => ({
  src: photo.src,
  thumbnail: photo.thumbnail,
  alt: photo.alt,
  caption: `${photo.location}, ${photo.date}`,
}));

const ImageGallery02 = () => {
  const [view, setView] = React.useState<View>('grid');
  const [index, setIndex] = React.useState(0);
  const tileRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const transitionId = React.useId().replace(/[^a-zA-Z0-9-]/g, '');

  const changeView = (next: string) => {
    if ((next !== 'grid' && next !== 'rows') || next === view) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || typeof document.startViewTransition !== 'function') {
      setView(next);
      return;
    }
    document.startViewTransition(() => {
      flushSync(() => setView(next));
    });
  };

  return (
    <section data-slot="image-gallery" className="bg-background py-20 md:py-28">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 md:gap-12 md:px-10">
        <div
          data-slot="image-gallery-header"
          className="flex flex-col gap-6 border-b border-border pb-8 md:flex-row md:items-end md:justify-between"
        >
          <div className="flex max-w-xl flex-col gap-4">
            <span className={cn(ENTER, 'text-xs uppercase text-muted-foreground')}>Field notes</span>
            <h2
              style={stagger(1, 80)}
              className={cn(ENTER, 'text-balance text-3xl font-semibold tracking-tight sm:text-4xl')}
            >
              Four walks in one year
            </h2>
            <p style={stagger(2, 80)} className={cn(ENTER, 'text-base leading-relaxed text-muted-foreground')}>
              Photos from the Dolomites, the Black Forest, Yosemite and the Carpathians. Open any of them to see the
              full frame.
            </p>
          </div>

          <div style={stagger(3, 80)} className={cn(ENTER, 'flex items-center justify-between gap-4 md:justify-end')}>
            <span data-slot="image-gallery-count" className="text-sm tabular-nums text-muted-foreground">
              {PHOTOS.length} photos
            </span>
            <ToggleGroup
              variant="outline"
              size="sm"
              value={[view]}
              onValueChange={([next]) => next && changeView(next)}
              aria-label="Gallery layout"
              data-slot="image-gallery-view"
            >
              <ToggleGroupItem value="grid" aria-label="Grid">
                <LayoutGrid aria-hidden />
                <span className="hidden sm:inline">Grid</span>
              </ToggleGroupItem>
              <ToggleGroupItem value="rows" aria-label="Rows">
                <Rows3 aria-hidden />
                <span className="hidden sm:inline">Rows</span>
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>

        <Lightbox items={ITEMS} index={index} onIndexChange={setIndex}>
          <ul
            data-slot="image-gallery-grid"
            data-view={view}
            className={cn(
              'grid gap-3 sm:gap-4',
              view === 'grid' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2',
            )}
          >
            {PHOTOS.map((photo, photoIndex) => (
              <li key={`${photo.location}-${photo.date}`} style={stagger(photoIndex, 50, 280)} className={ENTER}>
                <LightboxTrigger
                  index={photoIndex}
                  ref={(node: HTMLButtonElement | null) => {
                    tileRefs.current[photoIndex] = node;
                  }}
                  data-slot="image-gallery-tile"
                  aria-label={`${photo.location}, ${photo.date}. Open photo ${photoIndex + 1} of ${PHOTOS.length}`}
                  style={{ viewTransitionName: `image-gallery-${transitionId}-${photoIndex}` }}
                  render={
                    <button
                      type="button"
                      className="group relative block w-full cursor-zoom-in overflow-hidden rounded-lg bg-muted outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                    />
                  }
                >
                  <span className={cn('relative block w-full', view === 'grid' ? 'aspect-square' : 'aspect-[3/2]')}>
                    <Image
                      src={photo.src}
                      alt=""
                      fill
                      sizes={
                        view === 'grid'
                          ? '(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw'
                          : '(min-width: 640px) 50vw, 100vw'
                      }
                      style={{ objectPosition: photo.position }}
                      className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] motion-reduce:transition-none"
                    />
                  </span>
                  <span
                    aria-hidden
                    data-slot="image-gallery-caption"
                    className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-1 flex-col items-start gap-0.5 bg-linear-to-t from-black/70 via-black/35 to-transparent px-3 pt-10 pb-3 text-start text-white opacity-0 transition-[opacity,transform] duration-150 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 motion-reduce:transition-none sm:px-4 sm:pb-4"
                  >
                    <span className="text-sm font-medium text-pretty">{photo.location}</span>
                    <span className="text-xs tabular-nums text-white/75">{photo.date}</span>
                  </span>
                </LightboxTrigger>
              </li>
            ))}
          </ul>

          <LightboxContent finalFocus={() => tileRefs.current[index] ?? true}>
            <LightboxThumbnails />
          </LightboxContent>
        </Lightbox>
      </div>
    </section>
  );
};

export default ImageGallery02;
