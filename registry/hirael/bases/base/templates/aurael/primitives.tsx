'use client';

import * as React from 'react';
import { motion, useReducedMotion } from 'motion/react';

import { cn } from '@/lib/utils';

export type Lang = 'en' | 'ar';

export type Scene = 'morning' | 'night';

export const SECTION_IDS = ['how-it-works', 'cases', 'about', 'careers', 'resources', 'customers'] as const;

/** The same site at both times of day — the hero cross-fades between them and
 * the cases section shows the pair side by side. */
export const SCENE_IMAGE: Record<Scene, string> = {
  morning: '/media/templates/aurael/morning.jpg',
  night: '/media/templates/aurael/night.jpg',
};

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

export const Reveal = ({
  delay = 0,
  className,
  children,
}: {
  delay?: number;
  className?: string;
  children: React.ReactNode;
}) => {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={reduced ? { duration: 0 } : { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * The page's structural motif: a hairline-ruled band with a sticky meta rail
 * (index · label · note) on the start side and content on the end side.
 */
export const Band = ({
  id,
  index,
  label,
  note,
  lang,
  className,
  children,
}: {
  id: string;
  index: string;
  label: string;
  note?: string;
  lang: Lang;
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <section
      id={id}
      className={cn(
        'scroll-mt-20 border-t border-border bg-background px-5 transition-colors duration-500 sm:px-8 md:px-12',
        className,
      )}
    >
      <div className="mx-auto grid w-full max-w-6xl gap-x-12 gap-y-10 py-16 md:py-24 lg:grid-cols-[14rem_1fr] lg:gap-x-16">
        <Reveal className="lg:sticky lg:top-24 lg:self-start">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-muted-foreground">{index}</span>
            <span aria-hidden className="h-px w-6 bg-border" />
            <span
              className={cn(
                'text-xs text-muted-foreground',
                lang === 'en' ? 'font-mono uppercase tracking-[0.18em]' : 'font-medium',
              )}
            >
              {label}
            </span>
          </div>
          {note ? <p className="mt-5 max-w-[14rem] text-sm leading-relaxed text-muted-foreground">{note}</p> : null}
        </Reveal>
        <div className="min-w-0">{children}</div>
      </div>
    </section>
  );
};

export const Lead = ({ lang, className, children }: { lang: Lang; className?: string; children: React.ReactNode }) => {
  return (
    <h2
      data-slot="aurael-display"
      className={cn(
        'max-w-2xl text-balance text-3xl font-medium leading-[1.12] text-foreground sm:text-4xl',
        lang === 'en' ? 'tracking-tight' : 'tracking-normal',
        className,
      )}
    >
      {children}
    </h2>
  );
};

export const Accent = ({ children }: { children: React.ReactNode }) => {
  return <span className="text-muted-foreground">{children}</span>;
};
