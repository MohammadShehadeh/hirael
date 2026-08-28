'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

export type Lang = 'en' | 'ar';

export const SECTION_IDS = ['intro', 'services', 'works', 'contact'] as const;

export type SectionId = (typeof SECTION_IDS)[number];

/**
 * Placeholder body copy. Every paragraph in the template reads from here, so
 * the filler is easy to spot and swap for real writing in one pass. The Arabic
 * side is Arabic filler rather than the Latin text, so RTL still shows real
 * glyphs, line-breaking, and the Cairo face.
 */
export const LOREM: Record<Lang, { short: string; medium: string; long: string }> = {
  en: {
    short: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    medium:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    long: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  },
  ar: {
    short: 'لوريم إيبسوم دولور سيت أميت، كونسيكتيتور أديبيسكينج إليت.',
    medium:
      'لوريم إيبسوم دولور سيت أميت، كونسيكتيتور أديبيسكينج إليت. سيد دو إيوسمود تيمبور إنسيديدنت أوت لابوري إت دولوري ماجنا أليكوا.',
    long: 'لوريم إيبسوم دولور سيت أميت، كونسيكتيتور أديبيسكينج إليت. سيد دو إيوسمود تيمبور إنسيديدنت أوت لابوري إت دولوري ماجنا أليكوا. أوت إينيم أد مينيم فينيام، كويس نوستريد إكسير سيتاشن أولامكو لابوريس نيسي.',
  },
};

/**
 * Reading direction of the surrounding document, so the template opens in
 * Arabic when the page is already RTL. Once the visitor uses the in-page
 * switcher their choice wins — nothing is written back to `<html>`.
 */
export const useDocumentRtl = () => {
  const subscribe = React.useCallback(() => () => {}, []);
  return React.useSyncExternalStore(
    subscribe,
    () => document.documentElement.getAttribute('dir') === 'rtl',
    () => false,
  );
};

/** The section currently crossing the middle of the viewport. */
export const useActiveSection = (ids: readonly string[]) => {
  const [active, setActive] = React.useState<string>(ids[0]);

  React.useEffect(() => {
    const sections = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [ids]);

  return active;
};

/** Fades and lifts its children into view the first time they are scrolled to. */
export const Reveal = ({
  className,
  delay = 0,
  children,
  ...props
}: React.ComponentProps<'div'> & { delay?: number }) => {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = React.useState(false);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: shown ? `${delay}ms` : '0ms' }}
      className={cn(
        'transition-all duration-700 ease-out will-change-transform motion-reduce:transition-none',
        shown ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

/** Counts up from zero once it is scrolled into view. */
export const CountUp = ({
  to,
  suffix = '',
  durationMs = 2000,
  className,
}: {
  to: number;
  suffix?: string;
  durationMs?: number;
  className?: string;
}) => {
  const ref = React.useRef<HTMLSpanElement | null>(null);
  const [value, setValue] = React.useState(0);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let start: number | null = null;

    const step = (timestamp: number) => {
      if (start === null) start = timestamp;
      const progress = Math.min((timestamp - start) / durationMs, 1);
      setValue(Math.round(progress * to));
      if (progress < 1) raf = requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (prefersReduced) setValue(to);
            else raf = requestAnimationFrame(step);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to, durationMs]);

  return (
    <span ref={ref} className={className}>
      {value}
      {suffix}
    </span>
  );
};

/**
 * Centered eyebrow + heading with a hairline beneath it. `tone="panel"` sits
 * on the teal services slab, where the same rule has to read against color.
 */
export const SectionHeader = ({
  pretitle,
  title,
  lang,
  tone = 'surface',
  className,
}: {
  pretitle: string;
  title: React.ReactNode;
  lang: Lang;
  tone?: 'surface' | 'panel';
  className?: string;
}) => {
  const onPanel = tone === 'panel';

  return (
    <div className={cn('relative mx-auto max-w-3xl pb-10 text-center', className)}>
      <p
        data-slot="novael-display"
        className={cn(
          // Arabic has no case and breaks up under Latin-style tracking.
          'text-sm font-semibold',
          lang === 'en' ? 'uppercase tracking-[0.3em]' : 'tracking-normal',
          onPanel ? 'text-(--novael-panel-muted)' : 'text-primary',
        )}
      >
        {pretitle}
      </p>
      <h2
        data-slot="novael-display"
        className={cn(
          'mt-4 text-balance text-[2rem] font-semibold leading-tight sm:text-4xl md:text-5xl',
          onPanel ? 'text-(--novael-panel-foreground)' : 'text-foreground',
        )}
      >
        {title}
      </h2>
      <span
        aria-hidden
        className={cn(
          'absolute bottom-0 start-1/2 h-px w-80 max-w-[80%] -translate-x-1/2 rtl:translate-x-1/2',
          onPanel ? 'bg-black/15' : 'bg-foreground/15',
        )}
      />
    </div>
  );
};
