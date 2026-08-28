'use client';

import {
  CodeXml,
  Infinity as InfinityIcon,
  Network,
  Server,
  Smartphone,
  TestTubeDiagonal,
  type LucideIcon,
} from 'lucide-react';

import { LOREM, Reveal, SectionHeader, type Lang } from './primitives';

const SERVICES = [
  { id: 'frontend', icon: CodeXml },
  { id: 'backend', icon: Server },
  { id: 'mobile', icon: Smartphone },
  { id: 'qa', icon: TestTubeDiagonal },
  { id: 'devops', icon: InfinityIcon },
  { id: 'infra', icon: Network },
] as const satisfies readonly { id: string; icon: LucideIcon }[];

type ServiceId = (typeof SERVICES)[number]['id'];

const COPY = {
  en: {
    pretitle: 'Ipsum dolor',
    title: 'Lorem ipsum dolor sit amet consectetur adipiscing elit',
    items: {
      frontend: {
        title: 'Lorem ipsum',
        text: LOREM.en.medium,
      },
      backend: {
        title: 'Dolor sit amet',
        text: LOREM.en.medium,
      },
      mobile: {
        title: 'Consectetur adipiscing',
        text: LOREM.en.medium,
      },
      qa: {
        title: 'Sed eiusmod',
        text: LOREM.en.medium,
      },
      devops: {
        title: 'Tempor incididunt',
        text: LOREM.en.medium,
      },
      infra: {
        title: 'Ut labore et dolore',
        text: LOREM.en.medium,
      },
    },
  },
  ar: {
    pretitle: 'إيبسوم دولور',
    title: 'لوريم إيبسوم دولور سيت أميت كونسيكتيتور أديبيسكينج إليت',
    items: {
      frontend: {
        title: 'لوريم إيبسوم',
        text: LOREM.ar.medium,
      },
      backend: {
        title: 'دولور سيت أميت',
        text: LOREM.ar.medium,
      },
      mobile: {
        title: 'كونسيكتيتور أديبيسكينج',
        text: LOREM.ar.medium,
      },
      qa: {
        title: 'سيد إيوسمود',
        text: LOREM.ar.medium,
      },
      devops: {
        title: 'تيمبور إنسيديدنت',
        text: LOREM.ar.medium,
      },
      infra: {
        title: 'أوت لابوري إت دولوري',
        text: LOREM.ar.medium,
      },
    },
  },
} satisfies Record<Lang, { items: Record<ServiceId, { title: string; text: string }> } & Record<string, unknown>>;

export const Services = ({ lang }: { lang: Lang }) => {
  const c = COPY[lang];

  return (
    <section id="services" className="bg-(--novael-panel) py-20 sm:py-28">
      <div className="mx-auto max-w-[1440px] px-6">
        <SectionHeader lang={lang} tone="panel" pretitle={c.pretitle} title={c.title} />

        <div className="mt-14 grid gap-x-12 gap-y-10 md:grid-cols-2">
          {SERVICES.map((service, index) => {
            const Icon = service.icon;
            const copy = c.items[service.id];
            return (
              <Reveal key={service.id} delay={(index % 2) * 120} className="flex gap-6">
                <div className="shrink-0 pt-1 text-(--novael-panel-foreground)">
                  <Icon className="size-7" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 data-slot="novael-display" className="text-xl font-semibold text-(--novael-panel-foreground)">
                    {copy.title}
                  </h3>
                  <p className="mt-2 font-light leading-relaxed text-(--novael-panel-foreground)/85">{copy.text}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};
