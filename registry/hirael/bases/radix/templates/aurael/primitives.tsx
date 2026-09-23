'use client';

import * as React from 'react';
import { motion, useReducedMotion } from 'motion/react';

import { cn } from '@/lib/utils';

export type Lang = 'en' | 'ar';

export type Scene = 'morning' | 'night';

export const SECTION_IDS = ['how-it-works', 'cases', 'about', 'careers', 'resources', 'customers'] as const;

export const SCENE_IMAGE: Record<Scene, string> = {
  morning: '/media/templates/aurael/morning.jpg',
  night: '/media/templates/aurael/night.jpg',
};

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

export const useDocumentRtl = () => {
  const subscribe = React.useCallback(() => () => {}, []);
  return React.useSyncExternalStore(
    subscribe,
    () => document.documentElement.getAttribute('dir') === 'rtl',
    () => false,
  );
};

const subscribeToDocumentClass = (onChange: () => void) => {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  return () => observer.disconnect();
};

export const useDocumentScene = () => {
  return React.useSyncExternalStore<Scene>(
    subscribeToDocumentClass,
    () => (document.documentElement.classList.contains('light') ? 'morning' : 'night'),
    () => 'night',
  );
};

interface RevealProps {
  delay?: number;
  className?: string;
  children: React.ReactNode;
}

export const Reveal = ({ delay = 0, className, children }: RevealProps) => {
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

interface BandProps {
  id: string;
  index: string;
  label: string;
  note?: string;
  lang: Lang;
  className?: string;
  children: React.ReactNode;
}

export const Band = ({ id, index, label, note, lang, className, children }: BandProps) => {
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
            <span className={cn('text-xs text-muted-foreground', lang === 'en' ? 'uppercase' : 'font-medium')}>
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

interface LeadProps {
  lang: Lang;
  className?: string;
  children: React.ReactNode;
}

export const Lead = ({ lang, className, children }: LeadProps) => {
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

interface AccentProps {
  children: React.ReactNode;
}

export const Accent = ({ children }: AccentProps) => {
  return <span className="text-muted-foreground">{children}</span>;
};
