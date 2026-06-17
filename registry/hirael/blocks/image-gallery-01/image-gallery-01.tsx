"use client";

import * as React from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import { Badge } from "@/registry/hirael/ui/badge";
import { Button } from "@/registry/hirael/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/registry/hirael/ui/empty";
import { Tabs, TabsList, TabsTrigger } from "@/registry/hirael/ui/tabs";

type Tile = {
  title: string;
  meta: string;
  tag: string;
  aspect: string;
  src: string;
};

const FILTERS = ["All", "Web", "Brand", "Editorial", "Motion"] as const;
type Filter = (typeof FILTERS)[number];

// Free-to-use photos from Unsplash. Swap these for your own assets — and
// remember to add the image host to `images.remotePatterns` in next.config.
const IMG = {
  a: "https://images.unsplash.com/photo-1502447533750-9860c1269ae3?q=80&w=687&auto=format&fit=crop",
  b: "https://images.unsplash.com/photo-1571832194445-4480b617ee01?q=80&w=880&auto=format&fit=crop",
  c: "https://images.unsplash.com/photo-1678769435037-2de940e13c89?q=80&w=750&auto=format&fit=crop",
} as const;

const TILES: readonly Tile[] = [
  {
    title: "Helix · marketing site",
    meta: "2026 · case study",
    tag: "Web",
    aspect: "aspect-[4/5]",
    src: IMG.a,
  },
  {
    title: "Northwind · checkout",
    meta: "2026 · product",
    tag: "Web",
    aspect: "aspect-[16/10]",
    src: IMG.b,
  },
  {
    title: "Vanta · annual report",
    meta: "2025 · editorial",
    tag: "Editorial",
    aspect: "aspect-square",
    src: IMG.c,
  },
  {
    title: "Brella · identity",
    meta: "2025 · brand",
    tag: "Brand",
    aspect: "aspect-[3/4]",
    src: IMG.a,
  },
  {
    title: "Quartz · motion reel",
    meta: "2026 · motion",
    tag: "Motion",
    aspect: "aspect-[16/10]",
    src: IMG.c,
  },
  {
    title: "Plinth · field guide",
    meta: "2025 · editorial",
    tag: "Editorial",
    aspect: "aspect-[4/5]",
    src: IMG.b,
  },
  {
    title: "Lattice · product UI",
    meta: "2026 · product",
    tag: "Web",
    aspect: "aspect-[4/3]",
    src: IMG.c,
  },
  {
    title: "Mercado · packaging",
    meta: "2025 · brand",
    tag: "Brand",
    aspect: "aspect-square",
    src: IMG.a,
  },
] as const;

export default function ImageGallery01() {
  const [filter, setFilter] = React.useState<Filter>("All");
  const visible =
    filter === "All" ? TILES : TILES.filter((t) => t.tag === filter);

  return (
    <section
      className="bg-background py-20 sm:py-28"
      aria-labelledby="image-gallery-01-heading"
    >
      <div className="container w-full">
        <div className="flex flex-col gap-5 border-b border-border pb-8 sm:flex-row sm:items-end sm:justify-between sm:pb-10">
          <div className="flex max-w-xl flex-col gap-4">
            <Badge variant="outline" className="w-fit">
              selected work · 2025-2026
            </Badge>
            <h2
              id="image-gallery-01-heading"
              className="font-serif text-4xl font-medium leading-[1.04] tracking-tight sm:text-5xl"
            >
              A studio archive, gridded.
            </h2>
            <p className="text-base text-muted-foreground">
              Eight pieces from the last 14 months: websites, identity work, an
              annual report, and a motion reel. More in the full archive.
            </p>
          </div>

          <Tabs
            value={filter}
            onValueChange={(v) => setFilter(v as Filter)}
            aria-label="Filter gallery by category"
          >
            <TabsList variant="line" className="flex-wrap">
              {FILTERS.map((f) => (
                <TabsTrigger key={f} value={f} className="font-mono uppercase">
                  {f}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {visible.length === 0 ? (
          <Empty className="mt-10">
            <EmptyHeader>
              <EmptyTitle>Nothing in {filter} yet</EmptyTitle>
              <EmptyDescription>
                No pieces in this archive. Switch the filter, or check back next
                quarter.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilter("All")}
              >
                Show all
              </Button>
            </EmptyContent>
          </Empty>
        ) : (
          <div className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
            {visible.map((t) => (
              <a
                key={t.title}
                href="#"
                className="group block break-inside-avoid rounded-md border border-border bg-card transition-colors hover:border-foreground/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label={t.title}
              >
                <div
                  className={`${t.aspect} relative overflow-hidden rounded-t-md bg-muted`}
                >
                  <Image
                    src={t.src}
                    alt={t.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-black/0 to-black/10"
                  />
                  <Badge
                    variant="outline"
                    className="absolute start-3 top-3 border-white/30 bg-black/20 text-white backdrop-blur-sm"
                  >
                    {t.tag}
                  </Badge>
                  <span
                    aria-hidden
                    className="absolute end-3 top-3 inline-flex size-7 items-center justify-center rounded-sm border border-white/30 bg-black/20 text-white opacity-0 backdrop-blur-sm transition-all duration-200 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 group-hover:opacity-100"
                  >
                    <ArrowUpRight className="size-3.5" />
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3 px-4 py-3">
                  <span className="truncate text-sm font-medium tracking-[-0.01em] text-foreground">
                    {t.title}
                  </span>
                  <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                    {t.meta}
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
