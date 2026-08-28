'use client';

import * as React from 'react';
import Image from 'next/image';
import { Languages } from 'lucide-react';
import { motion, useAnimationControls, useReducedMotion } from 'motion/react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/radix/ui/button';

import { LOREM, SECTION_IDS, type Lang, type Scene } from './primitives';

export const SCENE_IMAGE: Record<Scene, string> = {
  morning: '/media/templates/aurael/morning.jpg',
  night: '/media/templates/aurael/night.jpg',
};

const SCENES: Scene[] = ['morning', 'night'];

const COPY = {
  en: {
    toLang: 'العربية',
    brandName: 'Aurael',
    nav: ['Lorem', 'Ipsum', 'Dolor', 'Sit amet', 'Consectetur', 'Adipiscing'],
    menu: 'Menu',
    titleLead: 'Lorem ipsum dolor',
    titleAccent: 'sit amet',
    titleTrail: 'consectetur',
    body: LOREM.en.medium,
    toggleLabel: 'Day or night',
    scene: {
      morning: { label: 'Morning', note: 'Lorem ipsum' },
      night: { label: 'Night', note: 'Lorem ipsum' },
    },
    alt: {
      morning: 'A valley at first light, the lake below catching the sun',
      night: 'The same valley after dark, lit by a crescent moon',
    },
  },
  ar: {
    toLang: 'English',
    brandName: 'أورايل',
    nav: ['لوريم', 'إيبسوم', 'دولور', 'سيت أميت', 'كونسيكتيتور', 'أديبيسكينج'],
    menu: 'القائمة',
    titleLead: 'لوريم إيبسوم دولور',
    titleAccent: 'سيت أميت',
    titleTrail: 'كونسيكتيتور',
    body: LOREM.ar.medium,
    toggleLabel: 'النهار أو الليل',
    scene: {
      morning: { label: 'الصباح', note: 'لوريم إيبسوم' },
      night: { label: 'الليل', note: 'لوريم إيبسوم' },
    },
    alt: {
      morning: 'وادٍ عند أوّل الضوء، والبحيرة تحته تعكس الشمس',
      night: 'الوادي نفسه بعد الغروب، يضيئه هلال',
    },
  },
} satisfies Record<Lang, unknown>;

export const Hero = ({
  lang,
  setLang,
  scene: selected,
  setScene,
}: {
  lang: Lang;
  setLang: (lang: Lang) => void;
  scene: Scene;
  setScene: (scene: Scene) => void;
}) => {
  // `displayScene` only differs from the selected scene mid-transition, holding
  // the outgoing image in place until the cross-fade swaps it in.
  const [displayScene, setDisplayScene] = React.useState<Scene | null>(null);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const reduced = useReducedMotion();
  const controls = useAnimationControls();
  const animatingRef = React.useRef(false);

  const c = COPY[lang];
  const scene: Scene = displayScene ?? selected;
  const other: Scene = scene === 'night' ? 'morning' : 'night';

  const goToScene = (next: Scene) => {
    if (next === selected || animatingRef.current) return;
    const current = scene;
    setScene(next);
    if (reduced) {
      setDisplayScene(null);
      return;
    }
    animatingRef.current = true;
    setDisplayScene(current);
    controls
      .start({
        y: '20%',
        scale: 1.1,
        opacity: 0.8,
        transition: { duration: 0.3, ease: [0.32, 0, 0.67, 0] },
      })
      .then(() => {
        setDisplayScene(next);
        controls.set({ y: '20%', scale: 1.1, opacity: 1 });
        return controls.start({
          y: '0%',
          scale: 1.1,
          opacity: 1,
          transition: { duration: 0.5, ease: [0.175, 0.885, 0.32, 1.4] },
        });
      })
      .then(() => {
        setDisplayScene(null);
        animatingRef.current = false;
      });
  };

  return (
    <section
      data-slot="hero"
      className="relative isolate flex min-h-[680px] w-full flex-col overflow-hidden bg-background text-foreground transition-colors duration-500 md:min-h-svh"
    >
      <div data-slot="hero-backdrop" className="absolute inset-0 -z-10 overflow-hidden">
        <div aria-hidden className="absolute inset-0 scale-[1.2] blur-2xl">
          <Image src={SCENE_IMAGE[other]} alt="" fill priority sizes="100vw" className="object-cover object-center" />
        </div>
        <motion.div
          className="absolute inset-0"
          initial={{ y: '0%', scale: 1.1, opacity: 1 }}
          animate={controls}
          style={{ willChange: 'transform, opacity' }}
        >
          <Image
            src={SCENE_IMAGE[scene]}
            alt={c.alt[scene]}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </motion.div>
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-background from-3% via-background/65 via-50% to-background/10"
        />
        <div aria-hidden className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-background/60 to-transparent" />
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_50%,transparent_35%,var(--background)_100%)] opacity-60"
        />
      </div>

      <nav
        data-slot="hero-nav"
        className="relative z-20 mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-5 py-6 transition-colors duration-500 md:px-8"
      >
        <span data-slot="aurael-display" className="truncate text-base font-medium tracking-tight">
          {c.brandName}
        </span>
        <div className="hidden items-center gap-7 text-base text-muted-foreground lg:flex">
          {c.nav.map((link, i) => (
            <a key={link} href={`#${SECTION_IDS[i]}`} className="transition-colors hover:text-foreground">
              {link}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            className="rounded-full text-muted-foreground hover:text-foreground"
          >
            <Languages className="size-4" />
            <span className="hidden text-sm font-medium sm:inline">{c.toLang}</span>
          </Button>
          <button
            type="button"
            aria-label={c.menu}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="relative z-30 flex size-9 flex-col items-center justify-center gap-1.5 text-foreground lg:hidden"
          >
            <span
              className={cn(
                'h-0.5 w-7 rounded bg-current transition-transform duration-300',
                menuOpen && 'translate-y-2 rotate-45',
              )}
            />
            <span
              className={cn('h-0.5 w-7 rounded bg-current transition-opacity duration-300', menuOpen && 'opacity-0')}
            />
            <span
              className={cn(
                'h-0.5 w-7 rounded bg-current transition-transform duration-300',
                menuOpen && '-translate-y-2 -rotate-45',
              )}
            />
          </button>
        </div>
      </nav>

      <div className="relative z-10 flex flex-1 flex-col items-center px-5 pb-12 pt-10 text-center md:pb-16">
        <h1
          data-slot="aurael-display"
          className={cn(
            'max-w-2xl text-balance text-5xl font-medium leading-[1.02] text-foreground transition-colors duration-500 sm:text-6xl md:text-7xl',
            lang === 'en' ? 'tracking-tight' : 'tracking-normal',
          )}
        >
          {c.titleLead}
          <br />
          <span className="text-muted-foreground">{c.titleAccent}</span> {c.titleTrail}
        </h1>

        <div
          data-slot="hero-scene-toggle"
          role="group"
          aria-label={c.toggleLabel}
          className="mt-auto inline-flex w-full max-w-sm items-stretch gap-1 rounded-2xl border border-border bg-card/40 p-1 backdrop-blur-md transition-colors duration-500 sm:w-auto"
        >
          {SCENES.map((key) => {
            const active = selected === key;
            const s = c.scene[key];
            return (
              <button
                key={key}
                type="button"
                data-slot="hero-scene-option"
                aria-pressed={active}
                onClick={() => goToScene(key)}
                className={cn(
                  'relative flex flex-1 flex-col items-center gap-0.5 rounded-xl px-6 py-2 transition-colors sm:flex-none sm:px-10',
                  active ? 'text-primary-foreground' : 'text-foreground hover:text-foreground/80',
                )}
              >
                {active && (
                  <motion.span
                    layoutId="aurael-scene"
                    aria-hidden
                    className="absolute inset-0 rounded-xl bg-primary shadow-sm"
                    transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative z-10 text-lg font-medium leading-tight">{s.label}</span>
                <span className={cn('relative z-10 text-[11px]', active ? 'opacity-75' : 'text-muted-foreground')}>
                  {s.note}
                </span>
              </button>
            );
          })}
        </div>

        <p className="mt-8 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground transition-colors duration-500">
          {c.body}
        </p>
      </div>

      <div
        className={cn(
          'fixed inset-0 z-10 flex flex-col items-center justify-center gap-8 bg-background transition-transform duration-300 lg:hidden',
          menuOpen ? 'translate-x-0' : 'translate-x-full rtl:-translate-x-full',
        )}
      >
        {c.nav.map((link, i) => (
          <a
            key={link}
            href={`#${SECTION_IDS[i]}`}
            onClick={() => setMenuOpen(false)}
            className="text-2xl font-semibold text-foreground"
          >
            {link}
          </a>
        ))}
      </div>
    </section>
  );
};
