import {
  Combine,
  Languages,
  Braces,
  Palette,
  Server,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

type Tile = {
  icon: LucideIcon;
  title: string;
  body: string;
  className: string;
};

const TILES: readonly Tile[] = [
  {
    icon: Combine,
    title: "Dual API by default",
    body: "Every component ships a compound surface and a single-prop surface in one file. Reach for whichever fits.",
    className: "lg:col-span-2",
  },
  {
    icon: Languages,
    title: "RTL is built in",
    body: "Logical properties throughout, so every component works under dir=rtl with no extra config.",
    className: "lg:col-span-2",
  },
  {
    icon: Braces,
    title: "Typed end to end",
    body: "Strict TypeScript with generics that flow from options to onChange. No any, no manual hints.",
    className: "lg:col-span-2",
  },
  {
    icon: Palette,
    title: "Your theme tokens",
    body: "Reads the same CSS variables as shadcn/ui, so it re-skins live against any token system.",
    className: "lg:col-span-3",
  },
  {
    icon: Server,
    title: "SSR safe",
    body: "Server components by default, with 'use client' only where interactivity demands it.",
    className: "lg:col-span-3",
  },
];

export default function Feature03() {
  return (
    <section data-slot="feature" className="bg-background py-20 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-6 md:px-10">
        <div className="flex max-w-2xl flex-col gap-5">
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            why hirael
          </span>
          <h2 className="font-serif text-4xl font-medium leading-[1.04] tracking-tight sm:text-5xl">
            One system, every surface.
          </h2>
          <p className="text-base text-muted-foreground sm:text-lg">
            The decisions that hold across the whole catalog, from a single
            input to a full page template.
          </p>
        </div>

        <div
          data-slot="feature-bento"
          className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6"
        >
          <div
            data-slot="feature-tile"
            className="relative flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-card p-6 sm:col-span-2 lg:col-span-4 lg:row-span-2"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(90% 70% at 100% 0%, color-mix(in oklch, var(--primary) 10%, transparent), transparent 60%)",
              }}
            />
            <div className="relative z-10 flex flex-col gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                source you own
              </span>
              <h3 className="max-w-md text-2xl font-semibold leading-[1.1] tracking-[-0.02em] sm:text-3xl">
                Installed as plain TSX, never a black box.
              </h3>
              <p className="max-w-md text-sm text-muted-foreground">
                The CLI copies the source into your repo. No runtime package, no
                version pin, no upgrade path to fight. Edit it like it is yours,
                because it is.
              </p>
            </div>

            <div
              aria-hidden
              className="relative z-10 mt-8 rounded-md border border-border bg-background p-4"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                  components/ui
                </span>
                <div className="flex gap-1">
                  <span className="size-1.5 rounded-full bg-border" />
                  <span className="size-1.5 rounded-full bg-border" />
                  <span className="size-1.5 rounded-full bg-foreground" />
                </div>
              </div>
              <div className="mt-3 flex flex-col gap-2">
                <span className="h-2 w-2/3 rounded-full bg-foreground/15" />
                <span className="h-2 w-5/6 rounded-full bg-foreground/10" />
                <span className="h-2 w-1/2 rounded-full bg-foreground/15" />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {["button", "input", "popover", "command"].map((t) => (
                  <span
                    key={t}
                    className="rounded-sm border border-border px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {TILES.map((tile) => {
            const Icon = tile.icon;
            return (
              <div
                key={tile.title}
                data-slot="feature-tile"
                className={cn(
                  "flex flex-col gap-4 rounded-xl border border-border bg-card p-6",
                  tile.className,
                )}
              >
                <span className="inline-flex size-9 items-center justify-center rounded-md border border-border bg-background">
                  <Icon className="size-4" />
                </span>
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-base font-semibold tracking-[-0.01em]">
                    {tile.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{tile.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
