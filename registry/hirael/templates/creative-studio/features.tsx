"use client";

import * as React from "react";
import { ArrowRight, Check } from "lucide-react";
import { motion, useInView, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";
import { CinematicBackground, NoiseOverlay, WordsPullUp } from "./primitives";

const CREAM = "#E1E0CC";
const PRIMARY = "#DEDBC8";

const EASE_CARD: [number, number, number, number] = [0.22, 1, 0.36, 1];

function IconStoryboard({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M9 5v14M15 5v14" />
      <path d="M3 9.5h6M3 14.5h6M15 9.5h6M15 14.5h6" />
    </svg>
  );
}

function IconCritique({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M21 11.5a8 8 0 0 1-11.5 7.2L4 20l1.3-4A8 8 0 1 1 21 11.5Z" />
      <path d="m13 7 1 2.2 2.2 1-2.2 1L13 13.5 12 11.2 9.8 10.2 12 9.2Z" />
    </svg>
  );
}

function IconImmersion({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <circle cx="12" cy="12" r="2.5" />
      <path d="M7.5 7.5a6.5 6.5 0 0 0 0 9M16.5 7.5a6.5 6.5 0 0 1 0 9" />
      <path d="M4.5 4.5a11 11 0 0 0 0 15M19.5 4.5a11 11 0 0 1 0 15" />
    </svg>
  );
}

type InfoCard = {
  index: number;
  number: string;
  title: string;
  Icon: (props: { className?: string }) => React.ReactElement;
  items: string[];
};

const INFO_CARDS: InfoCard[] = [
  {
    index: 1,
    number: "01",
    title: "Project Storyboard.",
    Icon: IconStoryboard,
    items: [
      "Frame-by-frame shot planning",
      "Drag and drop scene ordering",
      "Shared boards for the whole crew",
      "Version history on every cut",
    ],
  },
  {
    index: 2,
    number: "02",
    title: "Smart Critiques.",
    Icon: IconCritique,
    items: [
      "AI analysis of pacing and tone",
      "Inline creative notes and markups",
      "Integrations with your editing tools",
    ],
  },
  {
    index: 3,
    number: "03",
    title: "Immersion Capsule.",
    Icon: IconImmersion,
    items: [
      "Notification silencing while you create",
      "Ambient soundscapes for deep focus",
      "Schedule syncing across your devices",
    ],
  },
];

function FeatureCard({
  index,
  className,
  children,
}: {
  index: number;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const reduce = useReducedMotion();
  const show = reduce || inView;
  return (
    <motion.div
      ref={ref}
      initial={reduce ? false : { scale: 0.95, opacity: 0 }}
      animate={show ? { scale: 1, opacity: 1 } : undefined}
      transition={{ duration: 0.6, delay: index * 0.15, ease: EASE_CARD }}
      className={cn("relative overflow-hidden rounded-2xl", className)}
    >
      {children}
    </motion.div>
  );
}

export function Features({ videoSrc }: { videoSrc?: string }) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-black px-4 py-20 sm:px-6 sm:py-28 md:py-32">
      <NoiseOverlay variant="bg" className="opacity-[0.15]" />

      <div className="relative mx-auto flex max-w-6xl flex-col gap-12 md:gap-16">
        <div className="flex flex-col items-center gap-1 text-center">
          <WordsPullUp
            text="Studio-grade craft for visionary creators."
            className="justify-center text-xl font-normal text-[#E1E0CC] sm:text-2xl md:text-3xl lg:text-4xl"
          />
          <WordsPullUp
            text="Built for pure vision. Powered by art."
            className="justify-center text-xl font-normal text-gray-500 sm:text-2xl md:text-3xl lg:text-4xl"
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:gap-2 md:grid-cols-2 md:gap-1 lg:grid-cols-4 lg:h-[480px]">
          <FeatureCard index={0} className="min-h-[320px] lg:h-full lg:min-h-0">
            {videoSrc ? (
              <video
                className="absolute inset-0 h-full w-full object-cover"
                src={videoSrc}
                autoPlay
                loop
                muted
                playsInline
              />
            ) : (
              <CinematicBackground variant="card" />
            )}
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"
            />
            <div className="absolute inset-x-0 bottom-0 p-5">
              <p className="text-lg font-medium" style={{ color: CREAM }}>
                Your creative canvas.
              </p>
            </div>
          </FeatureCard>

          {INFO_CARDS.map((card) => (
            <FeatureCard
              key={card.number}
              index={card.index}
              className="min-h-[300px] bg-[#212121] lg:h-full lg:min-h-0"
            >
              <div className="flex h-full flex-col gap-4 p-5">
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black/40 sm:h-12 sm:w-12">
                    <card.Icon className="h-5 w-5 text-[#DEDBC8] sm:h-6 sm:w-6" />
                  </div>
                  <span className="font-mono text-[10px] tabular-nums text-gray-500">
                    {card.number}
                  </span>
                </div>

                <h3 className="text-base font-medium" style={{ color: CREAM }}>
                  {card.title}
                </h3>

                <ul className="flex flex-col gap-2">
                  {card.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-xs text-gray-400 sm:text-sm"
                    >
                      <Check
                        className="mt-0.5 h-3.5 w-3.5 shrink-0"
                        style={{ color: PRIMARY }}
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="#"
                  className="group mt-auto inline-flex items-center gap-1.5 text-xs font-medium text-[#DEDBC8] sm:text-sm"
                >
                  Learn more
                  <ArrowRight className="h-3.5 w-3.5 -rotate-45 transition-transform duration-200 group-hover:translate-x-0.5" />
                </a>
              </div>
            </FeatureCard>
          ))}
        </div>
      </div>
    </section>
  );
}
