'use client';

import { Blocks, Cpu, Layers, Orbit, Radar, Route, Waves, type LucideIcon } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/registry/hirael/bases/base/ui/avatar';
import { Separator } from '@/registry/hirael/bases/base/ui/separator';

interface Logo {
  name: string;
  icon: LucideIcon;
}

const LOGOS: readonly Logo[] = [
  { name: 'Meridian', icon: Route },
  { name: 'Tessera', icon: Blocks },
  { name: 'Perihelion', icon: Orbit },
  { name: 'Foundry', icon: Cpu },
  { name: 'Basalt', icon: Layers },
  { name: 'Corvus', icon: Radar },
  { name: 'Tidewater', icon: Waves },
];

const LogoCloud03 = () => {
  return (
    <section className="bg-background py-20 sm:py-28" aria-labelledby="logo-cloud-03-heading">
      <div className="container w-full max-w-4xl">
        <h2 id="logo-cloud-03-heading" className="sr-only">
          Teams building on Hirael
        </h2>

        <ul
          aria-label="Customer logos"
          className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:gap-x-14"
        >
          {LOGOS.map((logo) => (
            <li
              key={logo.name}
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground/70 transition-colors hover:text-foreground"
            >
              <logo.icon aria-hidden className="size-4" />
              {logo.name}
            </li>
          ))}
        </ul>

        <Separator className="mt-14" />

        <figure className="mt-14 flex flex-col items-center gap-6 text-center">
          <blockquote className="max-w-2xl font-serif text-xl leading-relaxed tracking-tight text-balance sm:text-2xl">
            &ldquo;We stopped writing the same combobox for the fourth time. The registry drops real source into our
            repo, so it reviews like code we wrote and ages like it too.&rdquo;
          </blockquote>
          <figcaption className="flex items-center gap-3">
            <Avatar className="size-9">
              <AvatarFallback className="text-xs">MS</AvatarFallback>
            </Avatar>
            <div className="text-start">
              <p className="text-sm font-medium">Mohammad Shehadeh</p>
              <p className="text-xs text-muted-foreground">Staff engineer, Meridian</p>
            </div>
          </figcaption>
        </figure>
      </div>
    </section>
  );
};

export default LogoCloud03;
