'use client';

import { ArrowUp, Mail } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/radix/ui/button';

import { LOREM, Reveal, SectionHeader, type Lang } from './primitives';

// Repeated across the three footer columns.
const FOOTER_HEADING = 'mb-4 text-base font-semibold text-foreground';

const CONTACT = {
  email: 'hello@novael.example',
  linkedin: '#',
} as const;

const COPY = {
  en: {
    pretitle: 'Consectetur',
    title: 'Lorem ipsum dolor sit amet',
    lead: LOREM.en.long,
    cta: 'Lorem ipsum',
    findUs: 'Dolor sit amet',
    address: ['Lorem ipsum dolor 20', 'Sit amet, CA 90210', 'Consectetur adipiscing'],
    followUs: 'Sed eiusmod',
    linkedin: 'Tempor',
    contactUs: 'Incididunt',
    copyright: '© Copyright Novael, LLC',
    backToTop: 'Ut labore',
  },
  ar: {
    pretitle: 'كونسيكتيتور',
    title: 'لوريم إيبسوم دولور سيت أميت',
    lead: LOREM.ar.long,
    cta: 'لوريم إيبسوم',
    findUs: 'دولور سيت أميت',
    address: ['لوريم إيبسوم دولور ٢٠', 'سيت أميت، ٩٠٢١٠', 'كونسيكتيتور أديبيسكينج'],
    followUs: 'سيد إيوسمود',
    linkedin: 'تيمبور',
    contactUs: 'إنسيديدنت',
    copyright: '© جميع الحقوق محفوظة نوفايل',
    backToTop: 'أوت لابوري',
  },
} satisfies Record<Lang, unknown>;

export const Contact = ({ lang }: { lang: Lang }) => {
  const c = COPY[lang];
  const year = new Date().getFullYear();

  return (
    <section id="contact" className="bg-card pb-10 pt-20 sm:pt-28">
      <div className="mx-auto max-w-[1440px] px-6">
        <SectionHeader lang={lang} pretitle={c.pretitle} title={c.title} />

        <Reveal className="mx-auto mt-10 max-w-2xl text-center">
          <p className="text-lg font-light leading-relaxed text-muted-foreground">{c.lead}</p>
          <div className="mt-10">
            <Button
              asChild
              size="lg"
              className={cn('h-12 px-8', lang === 'en' ? 'text-xs uppercase tracking-[0.2em]' : 'text-sm')}
            >
              <a href={`mailto:${CONTACT.email}`}>
                <Mail className="size-4" />
                {c.cta}
              </a>
            </Button>
          </div>
        </Reveal>

        <footer className="mt-24">
          <div className="grid gap-10 border-t border-border/60 pt-12 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <h3 data-slot="novael-display" className={FOOTER_HEADING}>
                {c.findUs}
              </h3>
              <address className="font-light not-italic leading-relaxed text-muted-foreground">
                {c.address.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
            </div>

            <div>
              <h3 data-slot="novael-display" className={FOOTER_HEADING}>
                {c.followUs}
              </h3>
              <ul className="flex flex-col gap-1">
                <li>
                  <a href={CONTACT.linkedin} className="text-foreground transition-colors hover:text-primary">
                    {c.linkedin}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 data-slot="novael-display" className={FOOTER_HEADING}>
                {c.contactUs}
              </h3>
              <ul className="flex flex-col gap-1">
                <li>
                  <a href={`mailto:${CONTACT.email}`} className="text-foreground transition-colors hover:text-primary">
                    {CONTACT.email}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-6 sm:flex-row">
            <span className="text-sm text-muted-foreground">
              {c.copyright} {year}
            </span>
            <a
              href="#intro"
              className={cn(
                'group inline-flex items-center gap-3 font-light text-foreground',
                lang === 'en' ? 'text-[10px] uppercase tracking-[0.3em]' : 'text-xs tracking-normal',
              )}
            >
              <span className="flex size-9 items-center justify-center rounded-full border-2 border-primary">
                <ArrowUp className="size-4 text-primary transition-transform group-hover:-translate-y-0.5" />
              </span>
              {c.backToTop}
            </a>
          </div>
        </footer>
      </div>
    </section>
  );
};
