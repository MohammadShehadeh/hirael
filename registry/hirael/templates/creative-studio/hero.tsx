"use client";

import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { CinematicBackground, NoiseOverlay, WordsPullUp } from "./primitives";

const NAV_ITEMS = [
  "Our story",
  "Collective",
  "Workshops",
  "Programs",
  "Inquiries",
];

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function Hero({
  videoSrc,
  posterSrc,
}: {
  videoSrc?: string;
  posterSrc?: string;
}) {
  const reduce = useReducedMotion();

  const fade = (delay: number) => ({
    initial: reduce ? false : { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.8, delay, ease: EASE_OUT_EXPO },
  });

  return (
    <section className="relative h-dvh w-full bg-black p-4 md:p-6">
      <div className="relative flex h-[calc(100dvh-2rem)] w-full flex-col overflow-hidden rounded-2xl bg-black md:h-[calc(100dvh-3rem)] md:rounded-[2rem]">
        {videoSrc ? (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={videoSrc}
            poster={posterSrc}
            autoPlay
            loop
            muted
            playsInline
          />
        ) : (
          <CinematicBackground variant="hero" />
        )}

        <NoiseOverlay className="opacity-[0.7] mix-blend-overlay" />

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60"
        />

        <nav className="absolute left-1/2 top-0 z-20 flex max-w-[calc(100%-1.5rem)] -translate-x-1/2 rounded-b-2xl bg-black md:max-w-none md:rounded-b-3xl">
          <ul
            className="flex items-center gap-5 overflow-x-auto whitespace-nowrap px-5 py-2.5 sm:gap-7 md:gap-9 md:px-9 lg:gap-11 [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: "none" }}
          >
            {NAV_ITEMS.map((item) => (
              <li key={item} className="shrink-0">
                <a
                  href="#"
                  className="text-xs text-(--cs-cream)/80 transition-colors hover:text-(--cs-cream) md:text-sm"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="relative z-10 mt-auto p-4 sm:p-6 md:p-8 lg:p-10">
          <div className="grid grid-cols-12 items-end gap-6 md:gap-8">
            <div className="col-span-12 lg:col-span-8">
              <h1 className="text-[24vw] font-medium leading-[0.85] tracking-[-0.07em] text-(--cs-cream) sm:text-[22vw] md:text-[20vw] lg:text-[18vw] xl:text-[17vw] 2xl:text-[18vw]">
                <WordsPullUp text="Hirael" showAsterisk />
              </h1>
            </div>

            <div className="col-span-12 flex flex-col gap-4 md:gap-6 lg:col-span-4">
              <motion.p
                {...fade(0.5)}
                className="max-w-md text-sm text-(--cs-ink)/70 sm:text-base"
                style={{ lineHeight: 1.3 }}
              >
                Hirael is a worldwide network of visual artists, filmmakers and
                storytellers, held together by craft and curiosity, not place or
                title.
              </motion.p>

              <motion.div {...fade(0.7)}>
                <a
                  href="#"
                  className="group inline-flex w-fit items-center gap-2 rounded-full bg-(--cs-ink) py-1.5 pe-1.5 ps-5 text-sm font-medium text-black transition-all duration-300 hover:gap-3 sm:text-base"
                >
                  Join the lab
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black transition-transform duration-300 group-hover:scale-110 sm:h-10 sm:w-10">
                    <ArrowRight className="h-4 w-4 text-(--cs-cream) rtl:rotate-180" />
                  </span>
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
