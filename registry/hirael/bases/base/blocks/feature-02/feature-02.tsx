'use client';

import * as React from 'react';
import { Sparkles, Zap, Shield, Compass, Layers, Cpu, type LucideIcon } from 'lucide-react';

interface Feature {
  icon: LucideIcon;
  title: string;
  body: string;
}

const FEATURES: readonly Feature[] = [
  {
    icon: Sparkles,
    title: 'Dual-API by default',
    body: 'Every component ships a compound surface and a single-prop surface in the same file. Pick whichever fits the screen.',
  },
  {
    icon: Zap,
    title: 'Built for dense data',
    body: 'Virtualization, async loading, and stable keyboard navigation are wired in, not bolted on after launch.',
  },
  {
    icon: Shield,
    title: 'Typed end-to-end',
    body: 'Strict TypeScript, no any, no implicit casts. Generics flow from options to onChange without a manual hint.',
  },
  {
    icon: Compass,
    title: 'Drop-in theme',
    body: 'Reads the same CSS variables as shadcn/ui. Re-skins live against any existing token system.',
  },
  {
    icon: Layers,
    title: 'Source you own',
    body: "Installed via CLI as plain TSX. No package pin, no upgrade path. Edit it like it's yours, because it is.",
  },
  {
    icon: Cpu,
    title: 'SSR-safe',
    body: "Server components by default, with 'use client' only where interactivity demands it. App Router native.",
  },
];

const Feature02 = () => {
  return (
    <section className="bg-background py-20 sm:py-28">
      <div className="container w-full">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-5 text-center">
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">features</span>
          <h2 className="font-serif text-4xl font-medium leading-[1.04] tracking-tight sm:text-5xl">
            Everything a real product needs, none of the rest.
          </h2>
          <p className="text-base text-muted-foreground sm:text-lg">
            Six decisions baked into every Hirael component, so you can stop making them yourself in every new repo.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="flex flex-col gap-4 rounded-md border border-border bg-card p-6">
                <div className="inline-flex size-9 items-center justify-center rounded-md border border-border bg-background">
                  <Icon className="size-4" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-base font-semibold tracking-[-0.01em]">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Feature02;
