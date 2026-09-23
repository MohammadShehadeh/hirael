import type * as React from 'react';
import { Blocks, Cpu, Layers, Orbit, Radar, Route, Waves, type LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/registry/hirael/bases/base/ui/avatar';
import { Separator } from '@/registry/hirael/bases/base/ui/separator';

const ENTER =
  'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const stagger = (index: number, step = 60, offset = 0): React.CSSProperties => ({
  animationDelay: `${offset + index * step}ms`,
});

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
    <section data-slot="logo-cloud" className="bg-background py-20 sm:py-28" aria-labelledby="logo-cloud-03-heading">
      <div className="mx-auto w-full max-w-4xl px-4">
        <h2 id="logo-cloud-03-heading" className="sr-only">
          Teams building on Hirael
        </h2>

        <ul
          data-slot="logo-cloud-logos"
          aria-label="Customer logos"
          className={cn(ENTER, 'flex flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:gap-x-14')}
        >
          {LOGOS.map((logo) => (
            <li
              key={logo.name}
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <logo.icon aria-hidden className="size-4" />
              {logo.name}
            </li>
          ))}
        </ul>

        <Separator style={stagger(1)} className={cn(ENTER, 'mt-14')} />

        <figure
          data-slot="logo-cloud-quote"
          style={stagger(2)}
          className={cn(ENTER, 'mt-14 flex flex-col items-center gap-6 text-center')}
        >
          <blockquote className="max-w-2xl font-serif text-xl leading-relaxed tracking-tight text-balance sm:text-2xl">
            &ldquo;We stopped writing the same combobox for the fourth time. The registry drops real source into our
            repo, so it reviews like code we wrote and ages like it too.&rdquo;
          </blockquote>
          <figcaption className="flex items-center gap-3">
            <Avatar className="size-9">
              <AvatarFallback>
                <span className="text-xs">RK</span>
              </AvatarFallback>
            </Avatar>
            <div className="text-start">
              <p className="text-sm font-medium">Rania Khoury</p>
              <p className="text-xs text-muted-foreground">Staff engineer, Meridian</p>
            </div>
          </figcaption>
        </figure>
      </div>
    </section>
  );
};

export default LogoCloud03;
