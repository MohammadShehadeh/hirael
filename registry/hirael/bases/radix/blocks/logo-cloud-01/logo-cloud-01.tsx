import type * as React from 'react';
import {
  ArrowRight,
  Bird,
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
  Waves,
  type LucideIcon,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Badge } from '@/registry/hirael/bases/radix/ui/badge';
import { Button } from '@/registry/hirael/bases/radix/ui/button';

const ENTER =
  'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const stagger = (index: number): React.CSSProperties => ({ animationDelay: `${index * 60}ms` });

interface Logo {
  name: string;
  href: string;
  icon: LucideIcon;
}

/** Twelve logos, so the grid divides evenly at 2, 3 and 6 columns and never leaves an empty cell. */
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
  { name: 'Kestrel', href: '#', icon: Bird },
  { name: 'Tidewater', href: '#', icon: Waves },
];

const STATS = [
  { value: '40k', label: 'weekly installs' },
  { value: '12k', label: 'developers' },
  { value: '0', label: 'runtime deps' },
] as const;

const LogoCloud01 = () => {
  return (
    <section data-slot="logo-cloud" className="bg-background py-20 sm:py-28" aria-labelledby="logo-cloud-01-heading">
      <div className="mx-auto w-full max-w-[1480px] px-4">
        <div data-slot="logo-cloud-header" className="flex flex-col items-center gap-4 text-center">
          <Badge variant="outline" className={ENTER}>
            Customers
          </Badge>
          <h2
            id="logo-cloud-01-heading"
            style={stagger(1)}
            className={cn(ENTER, 'font-serif text-3xl font-medium tracking-tight sm:text-4xl')}
          >
            12,000 developers reach for Hirael
            <br className="hidden sm:inline" />
            <span className="text-muted-foreground"> when shadcn isn&apos;t enough.</span>
          </h2>
        </div>

        <ul
          data-slot="logo-cloud-grid"
          aria-label="Customer logos"
          style={stagger(2)}
          className={cn(
            ENTER,
            'mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3 lg:grid-cols-6',
          )}
        >
          {LOGOS.map((logo) => (
            <li key={logo.name} className="bg-background">
              <a
                href={logo.href}
                aria-label={`Read ${logo.name}'s case study`}
                className="group flex h-20 items-center justify-center px-4 transition-colors hover:bg-card focus-visible:bg-card focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-inset"
              >
                <span className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                  <logo.icon aria-hidden className="size-4" />
                  {logo.name}
                </span>
              </a>
            </li>
          ))}
        </ul>

        <div
          data-slot="logo-cloud-footer"
          style={stagger(3)}
          className={cn(ENTER, 'mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row')}
        >
          <dl className="flex items-center gap-4 text-xs text-muted-foreground uppercase sm:gap-6">
            {STATS.map((s) => (
              <div key={s.label} className="flex items-baseline gap-1.5">
                <dt className="sr-only">{s.label}</dt>
                <dd className="text-sm font-semibold text-foreground tabular-nums">{s.value}</dd>
                <span aria-hidden>{s.label}</span>
              </div>
            ))}
          </dl>
          <Button variant="link" className="group h-auto" asChild>
            <a href="#">
              See the case studies
              <ArrowRight className="size-3.5 transition-transform duration-150 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default LogoCloud01;
