import type * as React from 'react';
import {
  Anchor,
  Aperture,
  Atom,
  Boxes,
  CircuitBoard,
  Cpu,
  Feather,
  Flame,
  Globe2,
  Layers,
  Orbit,
  Radar,
  Sailboat,
  Snowflake,
  type LucideIcon,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Marquee } from '@/registry/hirael/bases/base/components/marquee';

const ENTER =
  'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const stagger = (index: number, step = 60, offset = 0): React.CSSProperties => ({
  animationDelay: `${offset + index * step}ms`,
});

interface Logo {
  name: string;
  icon: LucideIcon;
}

const ROW_ONE: readonly Logo[] = [
  { name: 'Northwind', icon: Sailboat },
  { name: 'Halcyon', icon: Feather },
  { name: 'Meridian', icon: Globe2 },
  { name: 'Basalt', icon: Layers },
  { name: 'Corvus', icon: Radar },
  { name: 'Vantage', icon: Aperture },
  { name: 'Tessera', icon: Boxes },
];

const ROW_TWO: readonly Logo[] = [
  { name: 'Ember', icon: Flame },
  { name: 'Kelvin', icon: Snowflake },
  { name: 'Silica', icon: CircuitBoard },
  { name: 'Proton', icon: Atom },
  { name: 'Anchorage', icon: Anchor },
  { name: 'Foundry', icon: Cpu },
  { name: 'Perihelion', icon: Orbit },
];

interface LogoRowProps {
  logos: readonly Logo[];
  reverse?: boolean;
}

const LogoRow = ({ logos, reverse }: LogoRowProps) => (
  <Marquee reverse={reverse} pauseOnHover duration={reverse ? 34 : 28} gap="3rem">
    {logos.map((logo) => (
      <span
        key={logo.name}
        className="inline-flex items-center gap-2.5 text-base font-medium whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground"
      >
        <logo.icon aria-hidden className="size-5" />
        {logo.name}
      </span>
    ))}
  </Marquee>
);

const LogoCloud02 = () => {
  return (
    <section data-slot="logo-cloud" className="bg-background py-20 sm:py-28" aria-labelledby="logo-cloud-02-heading">
      <div className="container w-full">
        <div data-slot="logo-cloud-header" className="mx-auto max-w-2xl text-center">
          <p className={cn(ENTER, 'text-xs uppercase text-muted-foreground')}>In production at</p>
          <h2
            id="logo-cloud-02-heading"
            style={stagger(1)}
            className={cn(ENTER, 'mt-3 font-serif text-3xl font-medium tracking-tight sm:text-4xl')}
          >
            Fourteen teams, one component layer
          </h2>
        </div>
      </div>

      <div
        data-slot="logo-cloud-rows"
        style={stagger(2)}
        className={cn(ENTER, 'relative mt-12 flex flex-col gap-6 overflow-hidden')}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 start-0 z-10 w-16 bg-linear-to-r from-background to-transparent sm:w-32 rtl:bg-linear-to-l"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 end-0 z-10 w-16 bg-linear-to-l from-background to-transparent sm:w-32 rtl:bg-linear-to-r"
        />
        <LogoRow logos={ROW_ONE} />
        <LogoRow logos={ROW_TWO} reverse />
      </div>

      <div className="container mt-12 w-full">
        <p style={stagger(3)} className={cn(ENTER, 'text-center text-sm text-muted-foreground')}>
          From two-person studios to platform teams, they build their product screens on the same components.
        </p>
      </div>
    </section>
  );
};

export default LogoCloud02;
