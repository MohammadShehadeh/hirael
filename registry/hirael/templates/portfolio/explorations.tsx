"use client";

import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence, motion } from "motion/react";

import { cn } from "@/lib/utils";

import { ArrowUpRight, RingLink } from "./primitives";

const ITEMS = [
  {
    image:
      "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80",
    rotate: -4,
  },
  {
    image:
      "https://images.unsplash.com/photo-1550684376-efcbd6e3f031?auto=format&fit=crop&w=800&q=80",
    rotate: 3,
  },
  {
    image:
      "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&w=800&q=80",
    rotate: -2,
  },
  {
    image:
      "https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&w=800&q=80",
    rotate: 4,
  },
  {
    image:
      "https://images.unsplash.com/photo-1557672172-298e090bd0f1?auto=format&fit=crop&w=800&q=80",
    rotate: -3,
  },
  {
    image:
      "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=800&q=80",
    rotate: 2,
  },
];

function Card({
  image,
  rotate,
  onOpen,
}: {
  image: string;
  rotate: number;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      style={{ rotate: `${rotate}deg` }}
      className="group block w-full max-w-[320px] cursor-pointer"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        alt="Exploration"
        loading="lazy"
        className="aspect-square w-full rounded-2xl border border-[hsl(var(--stroke))] object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
      />
    </button>
  );
}

export function Explorations() {
  const sectionRef = React.useRef<HTMLDivElement>(null);
  const pinRef = React.useRef<HTMLDivElement>(null);
  const col1Ref = React.useRef<HTMLDivElement>(null);
  const col2Ref = React.useRef<HTMLDivElement>(null);
  const [active, setActive] = React.useState<string | null>(null);

  React.useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: pinRef.current,
        pinSpacing: false,
      });
      const scrub = (yPercent: number) => ({
        yPercent,
        ease: "none" as const,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      });
      gsap.to(col1Ref.current, scrub(-10));
      gsap.to(col2Ref.current, scrub(-26));
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  React.useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  return (
    <section
      ref={sectionRef}
      id="explorations"
      className="relative min-h-[300vh] overflow-clip bg-[hsl(var(--bg))]"
    >
      <div
        ref={pinRef}
        className="pointer-events-none relative z-10 flex h-svh items-center justify-center"
      >
        <div className="px-6 text-center">
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[hsl(var(--stroke))]" />
            <span className="text-xs uppercase tracking-[0.3em] text-[hsl(var(--muted))]">
              Explorations
            </span>
            <span className="h-px w-8 bg-[hsl(var(--stroke))]" />
          </div>
          <h2 className="mt-5 text-4xl font-medium leading-[1.05] tracking-tight sm:text-5xl">
            Visual{" "}
            <span className="font-display italic font-normal">playground</span>
          </h2>
          <p className="mx-auto mt-4 max-w-sm text-sm text-[hsl(var(--muted))]">
            Loose experiments, off-brief sketches and the studies that never
            shipped.
          </p>
          <div className="pointer-events-auto mt-7 flex justify-center">
            <RingLink
              href="https://dribbble.com/"
              target="_blank"
              innerClassName="bg-[hsl(var(--surface))] px-5 py-2.5 text-sm text-[hsl(var(--text))] backdrop-blur-md"
            >
              Dribbble
              <ArrowUpRight className="size-3.5 rtl:-scale-x-100" />
            </RingLink>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 z-20">
        <div className="mx-auto grid h-full max-w-[1400px] grid-cols-2 gap-12 px-6 md:gap-40">
          <div
            ref={col1Ref}
            className="flex flex-col items-center gap-[28vh] pt-[36vh]"
          >
            {ITEMS.slice(0, 3).map((item) => (
              <Card
                key={item.image}
                image={item.image}
                rotate={item.rotate}
                onOpen={() => setActive(item.image)}
              />
            ))}
          </div>
          <div
            ref={col2Ref}
            className="flex flex-col items-center gap-[28vh] pt-[64vh]"
          >
            {ITEMS.slice(3, 6).map((item) => (
              <Card
                key={item.image}
                image={item.image}
                rotate={item.rotate}
                onOpen={() => setActive(item.image)}
              />
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {active ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            role="dialog"
            aria-modal="true"
            aria-label="Exploration preview"
            onClick={() => setActive(null)}
            className={cn(
              "fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-6",
            )}
          >
            <button
              type="button"
              aria-label="Close"
              onClick={() => setActive(null)}
              className="absolute end-6 top-6 flex size-10 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:text-white"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                aria-hidden="true"
                className="size-4"
              >
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={active}
              alt="Exploration"
              onClick={(e) => e.stopPropagation()}
              className="max-h-[85vh] max-w-[90vw] rounded-2xl object-contain"
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
