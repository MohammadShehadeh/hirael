'use client';

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

import { Marquee } from '@/registry/hirael/bases/radix/components/marquee';

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

const LogoRow = ({ logos, reverse }: { logos: readonly Logo[]; reverse?: boolean }) => (
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
    <section className="bg-background py-20 sm:py-28" aria-labelledby="logo-cloud-02-heading">
      <div className="container w-full">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs uppercase text-muted-foreground">In production at</p>
          <h2 id="logo-cloud-02-heading" className="mt-3 font-serif text-3xl font-medium tracking-tight sm:text-4xl">
            Fourteen teams, one component layer
          </h2>
        </div>
      </div>

      <div className="relative mt-12 flex flex-col gap-6 overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 start-0 z-10 w-16 bg-gradient-to-r from-background to-transparent sm:w-32 rtl:bg-gradient-to-l"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 end-0 z-10 w-16 bg-gradient-to-l from-background to-transparent sm:w-32 rtl:bg-gradient-to-r"
        />
        <LogoRow logos={ROW_ONE} />
        <LogoRow logos={ROW_TWO} reverse />
      </div>

      <div className="container mt-12 w-full">
        <p className="text-center text-sm text-muted-foreground">
          Hover a row to hold it still. Both rows stop entirely when the visitor asks for reduced motion.
        </p>
      </div>
    </section>
  );
};

export default LogoCloud02;
