'use client';

import * as React from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/base/ui/button';

const PHOTOS = [
  {
    id: 'valley',
    title: 'Valley floor at first light',
    place: 'Yosemite, California',
    alt: 'River winding through a forested valley',
  },
  {
    id: 'ridge',
    title: 'The ridge after the storm',
    place: 'Scottish Highlands',
    alt: 'Sunlit mountain ridge under clouds',
  },
  {
    id: 'lake',
    title: 'Still water at golden hour',
    place: 'Dolomites, Italy',
    alt: 'Lake reflecting mountains at sunset',
  },
  {
    id: 'forest',
    title: 'Midsummer in the old growth',
    place: 'Black Forest, Germany',
    alt: 'Sunbeams falling through a green forest',
  },
] as const;

const srcFor = (id: string) => `/media/blocks/image-gallery-03/${id}.jpg`;
const thumbFor = (id: string) => `/media/blocks/image-gallery-03/${id}-thumb.jpg`;

const twoDigits = (value: number) => String(value).padStart(2, '0');

const ImageGallery03 = () => {
  const [index, setIndex] = React.useState(0);
  const photo = PHOTOS[index];

  const step = (delta: number) => setIndex((current) => (current + delta + PHOTOS.length) % PHOTOS.length);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    event.preventDefault();
    const isRtl = getComputedStyle(event.currentTarget).direction === 'rtl';
    const isForward = event.key === 'ArrowRight' ? !isRtl : isRtl;
    step(isForward ? 1 : -1);
  };

  return (
    <section data-slot="image-gallery" className="bg-background py-20 sm:py-28">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 md:px-10">
        <header className="flex flex-col gap-4">
          <span className="text-xs text-muted-foreground uppercase">Field notes</span>
          <h2 className="max-w-2xl text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl">
            Four mornings, four places.
          </h2>
        </header>

        <figure data-slot="image-gallery-stage" className="flex flex-col gap-4">
          <div className="relative aspect-[3/2] overflow-hidden rounded-lg border border-border bg-muted">
            <Image
              key={photo.id}
              src={srcFor(photo.id)}
              alt={photo.alt}
              fill
              priority={index === 0}
              sizes="(min-width: 1024px) 60rem, 100vw"
              className="animate-in object-cover duration-500 ease-out fade-in motion-reduce:animate-none"
            />
            <Button
              variant="secondary"
              size="icon"
              aria-label="Previous photo"
              onClick={() => step(-1)}
              className="absolute start-3 top-1/2 -translate-y-1/2"
            >
              <ChevronLeft aria-hidden className="rtl:rotate-180" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              aria-label="Next photo"
              onClick={() => step(1)}
              className="absolute end-3 top-1/2 -translate-y-1/2"
            >
              <ChevronRight aria-hidden className="rtl:rotate-180" />
            </Button>
          </div>
          <figcaption aria-live="polite" className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
            <span className="flex flex-wrap items-baseline gap-x-3">
              <span className="text-base font-medium tracking-[-0.01em]">{photo.title}</span>
              <span className="text-sm text-muted-foreground">{photo.place}</span>
            </span>
            <span dir="ltr" className="text-xs text-foreground tabular-nums">
              {twoDigits(index + 1)}
              <span className="text-muted-foreground/60"> / {twoDigits(PHOTOS.length)}</span>
            </span>
          </figcaption>
        </figure>

        <ul
          data-slot="image-gallery-filmstrip"
          aria-label="Choose a photo"
          onKeyDown={handleKeyDown}
          className="grid grid-cols-4 gap-3"
        >
          {PHOTOS.map((item, itemIndex) => (
            <li key={item.id}>
              <button
                type="button"
                aria-label={`Show ${item.title}`}
                aria-current={itemIndex === index ? 'true' : undefined}
                onClick={() => setIndex(itemIndex)}
                className={cn(
                  'relative block aspect-[3/2] w-full overflow-hidden rounded-md border border-border opacity-60 transition-opacity duration-150 hover:opacity-100 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
                  'aria-[current=true]:opacity-100 aria-[current=true]:ring-2 aria-[current=true]:ring-primary aria-[current=true]:ring-offset-2 aria-[current=true]:ring-offset-background',
                )}
              >
                <Image
                  src={thumbFor(item.id)}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 14rem, 25vw"
                  className="object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default ImageGallery03;
