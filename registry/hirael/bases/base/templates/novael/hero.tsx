'use client';

import Image from 'next/image';
import { ArrowDown } from 'lucide-react';

import { LOREM, CountUp, Reveal, type Lang } from './primitives';

const BACKDROP = '/media/templates/novael/intro-bg.jpg';

const STATS = [
  { id: 'experience', value: 17, suffix: '+' },
  { id: 'hours', value: 40, suffix: '+' },
  { id: 'projects', value: 20, suffix: '+' },
] as const;

const COPY = {
  en: {
    scrollDown: 'Lorem ipsum',
    headline: 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor',
    aboutTitle: 'Lorem ipsum dolor sit.',
    aboutText: LOREM.en.long,
    stats: {
      experience: {
        title: 'Lorem ipsum',
        text: LOREM.en.medium,
      },
      hours: {
        title: 'Dolor sit amet',
        text: LOREM.en.medium,
      },
      projects: {
        title: 'Consectetur adipiscing',
        text: LOREM.en.medium,
      },
    },
  },
  ar: {
    scrollDown: 'لوريم إيبسوم',
    headline: 'لوريم إيبسوم دولور سيت أميت كونسيكتيتور أديبيسكينج إليت سيد دو إيوسمود',
    aboutTitle: 'لوريم إيبسوم دولور سيت.',
    aboutText: LOREM.ar.long,
    stats: {
      experience: {
        title: 'لوريم إيبسوم',
        text: LOREM.ar.medium,
      },
      hours: {
        title: 'دولور سيت أميت',
        text: LOREM.ar.medium,
      },
      projects: {
        title: 'كونسيكتيتور أديبيسكينج',
        text: LOREM.ar.medium,
      },
    },
  },
} satisfies Record<Lang, unknown>;

interface HeroProps {
  lang: Lang;
}

export const Hero = ({ lang }: HeroProps) => {
  const c = COPY[lang];

  return (
    <section id="intro" className="relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24">
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="relative mx-auto max-w-5xl px-[4%] pb-40 sm:pb-56">
          <div className="absolute inset-x-0 top-[42%] bottom-0 -z-10 overflow-hidden">
            <Image src={BACKDROP} alt="" fill priority sizes="100vw" className="object-cover" />
            <div aria-hidden className="absolute inset-0 bg-black/40" />
          </div>

          <h1
            data-slot="novael-display"
            className="text-center text-3xl leading-[1.15] font-medium text-balance text-foreground sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl"
          >
            {c.headline}
            <span className="text-primary">.</span>
          </h1>

          <a
            href="#services"
            className="absolute end-0 bottom-24 hidden origin-bottom-right rotate-90 items-center gap-3 text-[10px] font-light tracking-[0.5em] text-foreground/70 uppercase transition-colors hover:text-primary lg:flex rtl:text-xs rtl:tracking-normal"
          >
            <span>{c.scrollDown}</span>
            <ArrowDown className="size-3.5 rotate-90" />
          </a>
        </div>

        <Reveal className="relative z-10 mx-auto -mt-24 w-full max-w-3xl sm:-mt-28">
          <span aria-hidden className="absolute start-1/2 top-0 h-8 w-px -translate-y-full bg-primary" />
          <div className="border border-border/60 bg-card/85 px-7 py-10 text-center backdrop-blur-sm sm:px-12 sm:py-12">
            <h2 data-slot="novael-display" className="mb-6 text-xl font-medium text-foreground sm:text-2xl">
              {c.aboutTitle}
            </h2>
            <p className="leading-relaxed font-light text-muted-foreground">{c.aboutText}</p>
          </div>
        </Reveal>

        <div className="mx-auto mt-20 grid max-w-5xl gap-10 sm:grid-cols-3 sm:gap-8">
          {STATS.map((stat, index) => (
            <Reveal key={stat.id} delay={index * 150} className="text-center sm:text-start">
              <div className="text-5xl leading-none font-medium text-primary sm:text-6xl">
                <CountUp to={stat.value} suffix={stat.suffix} />
              </div>
              <h3 className="mt-4 text-lg font-medium text-foreground">{c.stats[stat.id].title}</h3>
              <p className="mt-2 text-sm leading-relaxed font-light text-muted-foreground">{c.stats[stat.id].text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
