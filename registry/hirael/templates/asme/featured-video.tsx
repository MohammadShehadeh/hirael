"use client";

import { motion } from "motion/react";

import { reveal } from "./primitives";

const FEATURED_VIDEO_URL =
  "/media/templates/asme/featured.mp4";

export const FeaturedVideo = () => {
  return (
    <section className="overflow-hidden bg-background px-6 pb-20 pt-6 md:pb-32 md:pt-10">
      <div className="mx-auto max-w-6xl">
        <motion.div
          {...reveal({ y: 60, duration: 0.9 })}
          className="relative aspect-video overflow-hidden rounded-3xl"
        >
          <video
            className="h-full w-full object-cover"
            src={FEATURED_VIDEO_URL}
            muted
            autoPlay
            loop
            playsInline
            preload="auto"
            aria-hidden
            tabIndex={-1}
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent"
          />

          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-6 p-6 md:flex-row md:items-end md:justify-between md:p-10">
            <div className="liquid-glass max-w-md rounded-2xl p-6 md:p-8">
              <p className="mb-3 text-xs uppercase tracking-widest text-foreground/50">
                Our Approach
              </p>
              <p className="text-sm leading-relaxed text-foreground md:text-base">
                We believe in the power of curiosity-driven exploration. Every
                project starts with a question, and every answer opens a new
                door to innovation.
              </p>
            </div>

            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="liquid-glass shrink-0 self-start rounded-full px-8 py-3 text-sm font-medium text-foreground md:self-auto"
            >
              Explore more
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
