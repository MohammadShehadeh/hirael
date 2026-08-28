'use client';

import * as React from 'react';
import { motion, useReducedMotion } from 'motion/react';

import { cn } from '@/lib/utils';
import { Badge } from '@/registry/hirael/bases/base/ui/badge';
import { Marquee } from '@/registry/hirael/bases/base/components/marquee';

const HEADLINE = 'Ten years of building interfaces that last';

const Title = () => {
  const reduce = useReducedMotion();
  const words = HEADLINE.split(' ');
  const half = Math.floor(words.length / 2);

  return (
    <h2
      data-slot="team-title"
      className="font-serif text-4xl font-medium leading-[1.04] tracking-tight text-balance sm:text-5xl"
    >
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className={cn('me-[0.25em] inline-block', i < half ? 'text-muted-foreground' : 'text-foreground')}
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 + i * 0.08 }}
        >
          {word}
        </motion.span>
      ))}
    </h2>
  );
};

const GridPattern = () => {
  const id = React.useId();

  return (
    <div
      aria-hidden
      data-slot="grid-pattern"
      className="pointer-events-none absolute top-0 start-1/2 -mt-2 -ms-20 h-full w-full [mask-image:linear-gradient(black,transparent)]"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent [mask-image:radial-gradient(farthest-side_at_top,black,transparent)]">
        <svg className="absolute inset-0 h-full w-full fill-primary/5 stroke-primary/25 mix-blend-overlay">
          <pattern id={id} width="20" height="20" patternUnits="userSpaceOnUse" x="-12" y="4">
            <path d="M.5 20V.5H20" fill="none" />
          </pattern>
          <rect width="100%" height="100%" strokeWidth="0" fill={`url(#${id})`} />
          <svg x="-12" y="4" className="overflow-visible">
            <rect strokeWidth="0" width="21" height="21" x="180" y="20" />
            <rect strokeWidth="0" width="21" height="21" x="200" y="120" />
            <rect strokeWidth="0" width="21" height="21" x="180" y="100" />
            <rect strokeWidth="0" width="21" height="21" x="160" y="120" />
          </svg>
        </svg>
      </div>
    </div>
  );
};

interface Metric {
  label: string;
  value: string;
  subtext: string;
}

const METRICS: readonly Metric[] = [
  {
    label: 'Experience',
    value: '10+ years',
    subtext: 'Product and design systems',
  },
  { label: 'Components', value: '70+ shipped', subtext: 'Across the registry' },
  { label: 'Teams', value: '40 onboarded', subtext: 'From seed to enterprise' },
  { label: 'Locales', value: '12 supported', subtext: 'Including RTL' },
];

const COMPETENCIES = [
  'Design tokens',
  'Accessibility',
  'React 19',
  'Tailwind v4',
  'Motion design',
  'Component APIs',
  'TypeScript',
  'RTL layout',
  'Figma to code',
  'Performance',
  'Documentation',
  'Code review',
] as const;

const Chip = ({ children }: { children: React.ReactNode }) => {
  return (
    <span
      data-slot="team-chip"
      className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium whitespace-nowrap"
    >
      <span aria-hidden className="size-2.5 shrink-0 rounded-full bg-muted-foreground/50" />
      {children}
    </span>
  );
};

const MetricCard = ({ metric, index }: { metric: Metric; index: number }) => {
  const reduce = useReducedMotion();

  return (
    <motion.div
      data-slot="team-metric"
      className="rounded-lg border border-border bg-card p-4 text-center"
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: 'easeOut', delay: index * 0.12 }}
    >
      <h3 className="mb-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{metric.label}</h3>
      <p className="font-serif text-3xl font-medium text-foreground">{metric.value}</p>
      <p className="text-sm text-muted-foreground">{metric.subtext}</p>
    </motion.div>
  );
};

const Team02 = () => {
  const reduce = useReducedMotion();
  const rows = [COMPETENCIES.slice(0, 4), COMPETENCIES.slice(4, 8), COMPETENCIES.slice(8)];

  return (
    <section data-slot="team" className="bg-background py-20 sm:py-28">
      <div className="container w-full">
        <div data-slot="team-header" className="mx-auto flex max-w-2xl flex-col items-center gap-5 text-center">
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <Badge
              variant="outline"
              className="rounded-full bg-card/70 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground backdrop-blur-sm"
            >
              Experience
            </Badge>
          </motion.div>
          <Title />
          <motion.p
            data-slot="team-description"
            className="max-w-2xl text-base text-pretty text-muted-foreground sm:text-lg"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.4 }}
          >
            The person behind the registry, the numbers that describe the work, and the skills that show up in every
            component.
          </motion.p>
        </div>

        <div data-slot="team-metrics" className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {METRICS.map((metric, i) => (
            <MetricCard key={metric.label} metric={metric} index={i} />
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          <motion.article
            data-slot="team-profile"
            className="relative flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card p-6 md:px-10 md:py-8"
            initial={reduce ? false : { opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <GridPattern />
            <motion.div
              className="relative mb-4"
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
            >
              <h3 className="mb-1 text-2xl font-semibold text-foreground md:text-3xl">Layla Haddad</h3>
              <p className="text-muted-foreground">Design systems lead, Hirael</p>
            </motion.div>
            <motion.div
              className="relative flex flex-col gap-3"
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
            >
              <p className="leading-relaxed text-pretty text-muted-foreground">
                Layla spent a decade turning one-off screens into systems that other engineers actually reach for. She
                led the token migration at two product companies before starting Hirael.
              </p>
              <p className="leading-relaxed text-pretty text-muted-foreground">
                She reviews every component before it ships, usually in Arabic first, because if the RTL layout holds,
                the rest tends to follow.
              </p>
            </motion.div>
          </motion.article>

          <div
            data-slot="team-skills"
            className="relative flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card p-6 md:px-10 md:py-8"
          >
            <GridPattern />
            <motion.div
              className="relative mb-4"
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <h3 className="mb-3 text-2xl font-semibold text-foreground md:text-3xl">Core competencies</h3>
              <p className="text-pretty text-muted-foreground">
                The skills that come up in every engagement, from the first token audit to the last accessibility pass.
              </p>
            </motion.div>

            <motion.div
              data-slot="team-marquee"
              className="relative mt-auto flex flex-col gap-2 pt-6 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
            >
              {rows.map((row, i) => (
                <Marquee key={i} pauseOnHover reverse={i === 1} duration={30 + i * 5} gap="0.5rem">
                  {row.map((name) => (
                    <Chip key={name}>{name}</Chip>
                  ))}
                </Marquee>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Team02;
