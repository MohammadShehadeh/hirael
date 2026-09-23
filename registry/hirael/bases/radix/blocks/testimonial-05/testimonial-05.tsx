'use client';

import * as React from 'react';
import { ArrowRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/registry/hirael/bases/radix/ui/avatar';
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/registry/hirael/bases/radix/ui/carousel';

const ENTER =
  'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const stagger = (index: number, step = 60, offset = 0): React.CSSProperties => ({
  animationDelay: `${offset + index * step}ms`,
});

const SUMMARY = [
  { value: '1,000+', label: 'teams building with us' },
  { value: '38%', label: 'average cost cut' },
  { value: '4.9', label: 'average rating' },
];

interface Story {
  company: string;
  metric: string;
  outcome: string;
  /** Capped at 125 characters so every card keeps the same height. Trim the quote, never the card. */
  quote: string;
  name: string;
  role: string;
  initials: string;
  href: string;
}

const STORIES: readonly Story[] = [
  {
    company: 'Ledgerline',
    metric: '4x',
    outcome: 'faster CI',
    quote:
      'Our main pipeline went from 22 minutes to just under 6. Engineers stopped batching commits to dodge the wait.',
    name: 'Hana Sato',
    role: 'Staff engineer',
    initials: 'HS',
    href: '#',
  },
  {
    company: 'Parcelhub',
    metric: '34%',
    outcome: 'lower runner spend',
    quote: 'Runner spend dropped by a third in the first month, and nobody had to change how they work.',
    name: 'Marcus Bell',
    role: 'Head of platform',
    initials: 'MB',
    href: '#',
  },
  {
    company: 'Oakfield Health',
    metric: '0',
    outcome: 'infrastructure retries',
    quote:
      'Flaky runners used to page someone twice a week. We have not needed an infrastructure retry since we moved.',
    name: 'Layla Haddad',
    role: 'Engineering manager',
    initials: 'LH',
    href: '#',
  },
  {
    company: 'Tessellate',
    metric: '12 min',
    outcome: 'saved per pull request',
    quote: 'Cached image layers gave every reviewer back a coffee break on each pull request.',
    name: 'Jonas Weber',
    role: 'Developer productivity',
    initials: 'JW',
    href: '#',
  },
  {
    company: 'Brightwater',
    metric: '2,400',
    outcome: 'builds a day',
    quote: 'We run 2,400 builds a day across three regions and the dashboard still loads before I finish my sentence.',
    name: 'Priya Raman',
    role: 'Principal engineer',
    initials: 'PR',
    href: '#',
  },
  {
    company: 'Kiln Labs',
    metric: '3 days',
    outcome: 'to move 140 repositories',
    quote:
      'We planned a quarter for the migration. Moving 140 repositories took three days and one shared config file.',
    name: 'Tomas Lang',
    role: 'CTO',
    initials: 'TL',
    href: '#',
  },
];

const formatIndex = (index: number) => String(index + 1).padStart(2, '0');

const Testimonial05 = () => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [selected, setSelected] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;
    const onSelect = () => setSelected(api.selectedScrollSnap());
    api.on('select', onSelect);
    api.on('reInit', onSelect);

    return () => {
      api.off('select', onSelect);
      api.off('reInit', onSelect);
    };
  }, [api]);

  return (
    <section data-slot="testimonial" className="overflow-hidden bg-background py-20 sm:py-28">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 md:gap-16 md:px-10">
        <div
          data-slot="testimonial-header"
          className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between lg:gap-16"
        >
          <div className="flex max-w-xl flex-col gap-4">
            <span className={cn(ENTER, 'text-xs text-muted-foreground uppercase')}>Customer stories</span>
            <h2
              style={stagger(1, 80)}
              className={cn(ENTER, 'text-3xl font-semibold tracking-tight text-balance sm:text-4xl')}
            >
              Measured by the teams who switched
            </h2>
          </div>

          <dl data-slot="testimonial-summary" className="grid grid-cols-3 border-y border-border lg:border-y-0">
            {SUMMARY.map((item, index) => (
              <div
                key={item.label}
                style={stagger(index, 70, 160)}
                className={cn(
                  ENTER,
                  'flex flex-col gap-1 py-4 pe-4 sm:pe-8 lg:py-0',
                  index > 0 && 'border-s border-border ps-4 sm:ps-8',
                )}
              >
                <dt className="order-last text-xs text-muted-foreground sm:text-sm">{item.label}</dt>
                <dd dir="ltr" className="self-start text-2xl font-semibold tracking-tight tabular-nums sm:text-3xl">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <Carousel
          setApi={setApi}
          opts={{ align: 'start', loop: true }}
          aria-label="Customer stories"
          style={stagger(0, 0, 360)}
          className={cn(ENTER, 'flex flex-col')}
        >
          <div
            data-slot="testimonial-viewport"
            className="-me-6 [mask-image:linear-gradient(to_right,black_82%,transparent)] md:me-0 rtl:[mask-image:linear-gradient(to_left,black_82%,transparent)]"
          >
            <CarouselContent>
              {STORIES.map((story, index) => (
                <CarouselItem
                  key={story.company}
                  aria-label={`${formatIndex(index)} of ${formatIndex(STORIES.length - 1)}`}
                  className="basis-[83%] sm:basis-[60%] lg:basis-[40%]"
                >
                  <figure
                    data-slot="testimonial-card"
                    className={cn(
                      'relative flex h-full flex-col gap-8 overflow-hidden rounded-xl border border-border bg-card/40 p-6 transition-colors duration-150 hover:border-foreground/20 md:p-8',
                    )}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-base font-semibold tracking-tight">{story.company}</span>
                      <span dir="ltr" className="text-xs text-muted-foreground tabular-nums">
                        {formatIndex(index)}
                      </span>
                    </div>

                    <p className="flex flex-col gap-1">
                      <span dir="ltr" className="self-start text-5xl font-semibold tracking-tight tabular-nums">
                        {story.metric}
                      </span>
                      <span className="text-sm text-primary">{story.outcome}</span>
                    </p>

                    <blockquote className="text-base leading-relaxed text-pretty text-muted-foreground">
                      {story.quote}
                    </blockquote>

                    <figcaption className="mt-auto flex flex-col gap-5 border-t border-border pt-5">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-9">
                          <AvatarFallback>{story.initials}</AvatarFallback>
                        </Avatar>
                        <div className="flex min-w-0 flex-col">
                          <span className="text-sm font-medium">{story.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {story.role}, {story.company}
                          </span>
                        </div>
                      </div>
                      <a
                        href={story.href}
                        className="group inline-flex w-fit items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline"
                      >
                        Read the case study
                        <span className="sr-only">: {story.company}</span>
                        <ArrowRight
                          aria-hidden
                          className="size-4 transition-transform duration-150 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
                        />
                      </a>
                    </figcaption>
                  </figure>
                </CarouselItem>
              ))}
            </CarouselContent>
          </div>

          <div data-slot="testimonial-controls" className="mt-8 flex items-center gap-4 sm:gap-6">
            <span dir="ltr" aria-live="polite" className="shrink-0 text-sm text-muted-foreground tabular-nums">
              <span className="text-foreground">{formatIndex(selected)}</span>
              <span className="mx-1.5 text-border">|</span>
              {formatIndex(STORIES.length - 1)}
            </span>

            <div data-slot="testimonial-progress" className="flex flex-1 gap-1.5">
              {STORIES.map((story, index) => (
                <button
                  key={story.company}
                  type="button"
                  aria-label={`Go to story ${index + 1}: ${story.company}`}
                  aria-current={index === selected || undefined}
                  onClick={() => api?.scrollTo(index)}
                  className="group/segment flex h-6 flex-1 items-center rounded-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  <span className="relative h-0.5 w-full overflow-hidden rounded-full bg-border transition-colors duration-150 group-hover/segment:bg-muted-foreground/40">
                    <span
                      className={cn(
                        'absolute inset-0 origin-left bg-foreground transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none rtl:origin-right',
                        index <= selected ? 'scale-x-100' : 'scale-x-0',
                        index < selected && 'bg-muted-foreground',
                      )}
                    />
                  </span>
                </button>
              ))}
            </div>

            <div className="flex shrink-0 gap-2">
              <CarouselPrevious className="static size-9 translate-y-0" />
              <CarouselNext className="static size-9 translate-y-0" />
            </div>
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default Testimonial05;
