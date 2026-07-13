"use client";

import * as React from "react";
import { motion } from "motion/react";

import { reveal, Serif } from "./primitives";

const PHILOSOPHY_VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260307_083826_e938b29f-a43a-41ec-a153-3d4730578ab8.mp4";

const TEXT_BLOCKS = [
  {
    label: "Choose your space",
    body: "Every meaningful breakthrough begins at the intersection of disciplined strategy and remarkable creative vision. We operate at that crossroads, turning bold thinking into tangible outcomes that move people and reshape industries.",
  },
  {
    label: "Shape the future",
    body: "We believe that the best work emerges when curiosity meets conviction. Our process is designed to uncover hidden opportunities and translate them into experiences that resonate long after the first impression.",
  },
];

export function Philosophy() {
  return (
    <section className="overflow-hidden bg-background px-6 py-28 md:py-40">
      <div className="mx-auto max-w-6xl">
        <motion.h2
          {...reveal({ y: 40, duration: 0.8 })}
          className="mb-16 text-5xl tracking-tight text-foreground md:mb-24 md:text-7xl lg:text-8xl"
        >
          Innovation <Serif className="text-foreground/40">x</Serif> Vision
        </motion.h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
          <motion.div
            {...reveal({ x: -40, duration: 0.8, delay: 0.1 })}
            className="aspect-[4/3] overflow-hidden rounded-3xl"
          >
            <video
              className="h-full w-full object-cover"
              src={PHILOSOPHY_VIDEO_URL}
              muted
              autoPlay
              loop
              playsInline
              preload="auto"
              aria-hidden
              tabIndex={-1}
            />
          </motion.div>

          <motion.div
            {...reveal({ x: 40, duration: 0.8, delay: 0.2 })}
            className="flex flex-col justify-center"
          >
            {TEXT_BLOCKS.map((block, index) => (
              <React.Fragment key={block.label}>
                {index > 0 ? (
                  <div
                    aria-hidden
                    className="my-10 h-px w-full bg-foreground/10"
                  />
                ) : null}
                <div>
                  <p className="mb-4 text-xs uppercase tracking-widest text-foreground/40">
                    {block.label}
                  </p>
                  <p className="text-base leading-relaxed text-foreground/70 md:text-lg">
                    {block.body}
                  </p>
                </div>
              </React.Fragment>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
