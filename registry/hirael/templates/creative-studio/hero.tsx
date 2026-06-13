"use client"

import { ArrowRight } from "lucide-react"
import { motion, useReducedMotion } from "framer-motion"

import { CinematicBackground, NoiseOverlay, WordsPullUp } from "./primitives"

const NAV_ITEMS = ["Our story", "Collective", "Workshops", "Programs", "Inquiries"]

const CREAM = "#E1E0CC"

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1]

export function Hero({
  videoSrc,
  posterSrc,
}: {
  videoSrc?: string
  posterSrc?: string
}) {
  const reduce = useReducedMotion()

  const fade = (delay: number) => ({
    initial: reduce ? false : { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.8, delay, ease: EASE_OUT_EXPO },
  })

  return (
    <section className="h-screen w-full bg-black p-4 md:p-6">
      <div className="relative h-full w-full overflow-hidden rounded-2xl bg-black md:rounded-[2rem]">
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

        <nav className="absolute left-1/2 top-0 z-20 -translate-x-1/2 rounded-b-2xl bg-black px-4 py-2 md:px-8 md:rounded-b-3xl">
          <ul className="flex items-center gap-3 sm:gap-6 md:gap-12 lg:gap-14">
            {NAV_ITEMS.map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="text-[10px] text-[#E1E0CC]/80 transition-colors hover:text-[#E1E0CC] sm:text-xs md:text-sm"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute inset-x-0 bottom-0 z-10 p-4 sm:p-6 md:p-8 lg:p-10">
          <div className="grid grid-cols-12 items-end gap-4 md:gap-6">
            <div className="col-span-12 lg:col-span-8">
              <h1
                className="text-[26vw] font-medium leading-[0.85] tracking-[-0.07em] sm:text-[24vw] md:text-[22vw] lg:text-[20vw] xl:text-[19vw] 2xl:text-[20vw]"
                style={{ color: CREAM }}
              >
                <WordsPullUp text="Hirael" showAsterisk />
              </h1>
            </div>

            <div className="col-span-12 flex flex-col gap-4 lg:col-span-4 md:gap-6">
              <motion.p
                {...fade(0.5)}
                className="max-w-md text-xs text-[#DEDBC8]/70 sm:text-sm md:text-base"
                style={{ lineHeight: 1.2 }}
              >
                Hirael is a worldwide network of visual artists, filmmakers and
                storytellers bound not by place, status or labels but by passion
                and hunger to unlock potential through our unique perspectives.
              </motion.p>

              <motion.div {...fade(0.7)}>
                <a
                  href="#"
                  className="group inline-flex w-fit items-center gap-2 rounded-full bg-[#DEDBC8] py-1.5 pe-1.5 ps-5 text-sm font-medium text-black transition-all duration-300 hover:gap-3 sm:text-base"
                >
                  Join the lab
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black transition-transform duration-300 group-hover:scale-110 sm:h-10 sm:w-10">
                    <ArrowRight
                      className="h-4 w-4 rtl:rotate-180"
                      style={{ color: CREAM }}
                    />
                  </span>
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
