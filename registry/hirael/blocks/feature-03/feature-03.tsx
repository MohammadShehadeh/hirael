import {
  Combine,
  Languages,
  Braces,
  Palette,
  Server,
  Check,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

type Tile = {
  icon: LucideIcon;
  title: string;
  body: string;
  swatches?: boolean;
};

const TILES: readonly Tile[] = [
  {
    icon: Combine,
    title: "Dual API by default",
    body: "Every component ships a compound surface and a single-prop surface in one file. Reach for whichever fits.",
  },
  {
    icon: Languages,
    title: "RTL is built in",
    body: "Logical properties throughout, so every component works under dir=rtl with no extra config.",
  },
  {
    icon: Braces,
    title: "Typed end to end",
    body: "Strict TypeScript with generics that flow from options to onChange. No any, no manual hints.",
  },
  {
    icon: Palette,
    title: "Your theme tokens",
    body: "Reads the same CSS variables as shadcn/ui, so it re-skins live against any token system.",
    swatches: true,
  },
  {
    icon: Server,
    title: "SSR safe",
    body: "Server components by default, with 'use client' only where interactivity demands it.",
  },
];

const WRITTEN_FILES = ["button.tsx", "input.tsx", "combobox.tsx"] as const;
const SWATCHES = [
  "bg-background",
  "bg-card",
  "bg-muted",
  "bg-primary",
  "bg-foreground",
] as const;

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
              className="relative z-10 mt-8 overflow-hidden rounded-md border border-border bg-background"
            >
              <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                  components/ui
                </span>
                <div className="flex gap-1">
                  <span className="size-1.5 rounded-full bg-border" />
                  <span className="size-1.5 rounded-full bg-border" />
                  <span className="size-1.5 rounded-full bg-foreground" />
                </div>
              </div>
              <ul className="flex flex-col gap-2.5 p-4 font-mono text-[12px]">
                {WRITTEN_FILES.map((file) => (
                  <li
                    key={file}
                    className="flex items-center gap-2 text-foreground"
                  >
                    <Check className="size-3.5 shrink-0 text-muted-foreground" />
                    {file}
                  </li>
                ))}
                <li className="ps-[22px] text-muted-foreground/60">
                  + 4 more files
                </li>
              </ul>
            </div>
          </div>

          {TILES.map((tile) => {
            const Icon = tile.icon;
            return (
              <div
                key={tile.title}
                data-slot="feature-tile"
                className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 lg:col-span-2"
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
                {tile.swatches ? (
                  <div className="mt-auto flex items-center gap-1.5 pt-2">
                    {SWATCHES.map((swatch) => (
                      <span
                        key={swatch}
                        className={cn(
                          "size-5 rounded-md border border-border",
                          swatch,
                        )}
                      />
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
