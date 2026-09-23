import * as React from 'react';

import { cn } from '@/lib/utils';
import { Badge } from '@/registry/hirael/bases/radix/ui/badge';
import { Marquee } from '@/registry/hirael/bases/radix/components/marquee';

const RISE =
  'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const RISE_SM =
  'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const HEADLINE = 'Ten years of building interfaces that last';

const Title = () => {
  const words = HEADLINE.split(' ');
  const half = Math.floor(words.length / 2);

  return (
    <h2
      data-slot="team-title"
      className="font-serif text-4xl font-medium leading-[1.04] tracking-tight text-balance sm:text-5xl"
    >
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className={cn('me-[0.25em] inline-block', RISE_SM, i < half ? 'text-muted-foreground' : 'text-foreground')}
          style={{ animationDelay: `${40 + i * 30}ms` }}
        >
          {word}
        </span>
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
      <div className="absolute inset-0 bg-linear-to-r from-primary/10 to-transparent [mask-image:radial-gradient(farthest-side_at_top,black,transparent)]">
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

interface ChipProps {
  children: React.ReactNode;
}

const Chip = ({ children }: ChipProps) => {
  return (
    <span
      data-slot="team-chip"
      className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium whitespace-nowrap"
    >
      {children}
    </span>
  );
};

interface MetricCardProps {
  metric: Metric;
  index: number;
}

const MetricCard = ({ metric, index }: MetricCardProps) => {
  return (
    <div
      data-slot="team-metric"
      className={cn('rounded-lg border border-border bg-card p-4 text-center', RISE)}
      style={{ animationDelay: `${300 + index * 50}ms` }}
    >
      <h3 className="mb-1 text-xs uppercase text-muted-foreground">{metric.label}</h3>
      <p className="font-serif text-3xl font-medium text-foreground">{metric.value}</p>
      <p className="text-sm text-muted-foreground">{metric.subtext}</p>
    </div>
  );
};

const Team02 = () => {
  const rows = [COMPETENCIES.slice(0, 4), COMPETENCIES.slice(4, 8), COMPETENCIES.slice(8)];

  return (
    <section data-slot="team" className="bg-background py-20 sm:py-28">
      <div className="container w-full">
        <div data-slot="team-header" className="mx-auto flex max-w-2xl flex-col items-center gap-5 text-center">
          <div className="animate-in fade-in zoom-in-95 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none">
            <Badge variant="outline">Experience</Badge>
          </div>
          <Title />
          <p
            data-slot="team-description"
            className={cn('max-w-2xl text-base text-pretty text-muted-foreground sm:text-lg', RISE_SM, 'delay-240')}
          >
            The person behind the registry, the numbers that describe the work, and the skills that show up in every
            component.
          </p>
        </div>

        <div data-slot="team-metrics" className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {METRICS.map((metric, i) => (
            <MetricCard key={metric.label} metric={metric} index={i} />
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          <article
            data-slot="team-profile"
            className={cn(
              'relative flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card p-6 md:px-10 md:py-8',
              RISE,
            )}
            style={{ animationDelay: '400ms' }}
          >
            <GridPattern />
            <div className="relative mb-4">
              <h3 className="mb-1 text-2xl font-semibold text-foreground md:text-3xl">Layla Haddad</h3>
              <p className="text-muted-foreground">Design systems lead, Hirael</p>
            </div>
            <div className="relative flex flex-col gap-3">
              <p className="leading-relaxed text-pretty text-muted-foreground">
                Layla spent a decade turning one-off screens into systems that other engineers actually reach for. She
                led the token migration at two product companies before starting Hirael.
              </p>
              <p className="leading-relaxed text-pretty text-muted-foreground">
                She reviews every component before it ships, usually in Arabic first, because if the RTL layout holds,
                the rest tends to follow.
              </p>
            </div>
          </article>

          <div
            data-slot="team-skills"
            className={cn(
              'relative flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card p-6 md:px-10 md:py-8',
              RISE,
            )}
            style={{ animationDelay: '460ms' }}
          >
            <GridPattern />
            <div className="relative mb-4">
              <h3 className="mb-3 text-2xl font-semibold text-foreground md:text-3xl">Core competencies</h3>
              <p className="text-pretty text-muted-foreground">
                The skills that come up in every engagement, from the first token audit to the last accessibility pass.
              </p>
            </div>

            <div
              data-slot="team-marquee"
              className="relative mt-auto flex flex-col gap-2 pt-6 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
            >
              {rows.map((row, i) => (
                <Marquee key={i} pauseOnHover reverse={i === 1} duration={30 + i * 5} gap="0.5rem">
                  {row.map((name) => (
                    <Chip key={name}>{name}</Chip>
                  ))}
                </Marquee>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Team02;
