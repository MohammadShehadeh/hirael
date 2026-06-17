"use client";

import { motion } from "framer-motion";

import { reveal, Serif } from "./primitives";

export function About() {
  return (
    <section className="relative overflow-hidden bg-background px-6 pb-10 pt-32 md:pb-14 md:pt-44">
      <div aria-hidden className="glow-top absolute inset-0" />

      <div className="relative mx-auto max-w-5xl text-center">
        <motion.p
          {...reveal({ y: 20, duration: 0.6 })}
          className="mb-8 text-sm uppercase tracking-widest text-foreground/40"
        >
          About Us
        </motion.p>

        <motion.h2
          {...reveal({ y: 40, duration: 0.8, delay: 0.1 })}
          className="text-4xl leading-[1.1] tracking-tight text-foreground md:text-6xl lg:text-7xl"
        >
          Pioneering <Serif className="text-foreground/60">ideas</Serif> for{" "}
          <br className="hidden md:block" />
          minds that{" "}
          <Serif className="text-foreground/60">
            create, build, and inspire.
          </Serif>
        </motion.h2>
      </div>
    </section>
  );
}
