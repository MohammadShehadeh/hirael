'use client';

import {
  ArrowRight,
  Captions,
  Compass,
  Dna,
  Gem,
  Grid2x2,
  Hexagon,
  Landmark,
  ShieldCheck,
  Store,
  Umbrella,
  type LucideIcon,
} from 'lucide-react';

import { Badge } from '@/registry/hirael/bases/base/ui/badge';
import { Button } from '@/registry/hirael/bases/base/ui/button';

interface Logo {
  name: string;
  href: string;
  icon: LucideIcon;
}

const LOGOS: readonly Logo[] = [
  { name: 'Acme', href: '#', icon: Hexagon },
  { name: 'Helix', href: '#', icon: Dna },
  { name: 'Northwind', href: '#', icon: Compass },
  { name: 'Vanta', href: '#', icon: ShieldCheck },
  { name: 'Quartz', href: '#', icon: Gem },
  { name: 'Lattice', href: '#', icon: Grid2x2 },
  { name: 'Plinth', href: '#', icon: Landmark },
  { name: 'Brella', href: '#', icon: Umbrella },
  { name: 'Verbit', href: '#', icon: Captions },
  { name: 'Mercado', href: '#', icon: Store },
];

const STATS = [
  { value: '40k', label: 'weekly installs' },
  { value: '12k', label: 'developers' },
  { value: '0', label: 'runtime deps' },
] as const;

const LogoCloud01 = () => {
  return (
    <section className="bg-background py-20 sm:py-28" aria-labelledby="logo-cloud-01-heading">
      <div className="container w-full">
        <div className="flex flex-col items-center gap-4 text-center">
          <Badge
            variant="outline"
            className="rounded-full bg-card/70 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground"
          >
            Trusted by teams shipping at scale
          </Badge>
          <h2 id="logo-cloud-01-heading" className="font-serif text-3xl font-medium tracking-tight sm:text-4xl">
            10,000+ engineers reach for Hirael
            <br className="hidden sm:inline" />
            <span className="text-muted-foreground"> when shadcn isn&apos;t enough.</span>
          </h2>
        </div>

        <ul
          aria-label="Customer logos"
          className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3 lg:grid-cols-5"
        >
          {LOGOS.map((logo) => (
            <li key={logo.name} className="bg-background">
              <a
                href={logo.href}
                aria-label={`Read ${logo.name}'s case study`}
                className="group flex h-20 items-center justify-center px-4 transition-colors hover:bg-card focus-visible:outline-none focus-visible:bg-card focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
              >
                <span className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                  <logo.icon aria-hidden className="size-4" />
                  {logo.name}
                </span>
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <dl className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground sm:gap-6">
            {STATS.map((s) => (
              <div key={s.label} className="flex items-baseline gap-1.5">
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-mono text-sm font-semibold tabular-nums text-foreground">{s.value}</dd>
                <span>{s.label}</span>
              </div>
            ))}
          </dl>
          <Button variant="link" className="group h-auto p-0" render={<a href="#" />}>
            See the case studies
            <ArrowRight className="size-3.5 transition-transform duration-150 ease-out group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default LogoCloud01;
