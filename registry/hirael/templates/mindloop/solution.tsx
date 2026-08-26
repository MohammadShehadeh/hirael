"use client";

import { motion } from "motion/react";

import { Serif, useFadeUp } from "./primitives";

const SOLUTION_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_125119_8e5ae31c-0021-4396-bc08-f7aebeb877a2.mp4";

const FEATURES = [
  {
    title: "Curated Feed",
    description:
      "A reading feed tuned to what you care about, not what shouts loudest.",
  },
  {
    title: "Writer Tools",
    description:
      "Draft, schedule and publish in one place, with the formatting out of your way.",
  },
  {
    title: "Community",
    description:
      "Comments, replies and shared threads that turn readers into regulars.",
  },
  {
    title: "Distribution",
    description:
      "Reach inboxes, the web and answer engines from a single publish.",
  },
];

export const Solution = () => {
  const fade = useFadeUp();

  return (
    <section
      id="how-it-works"
      className="border-t border-border/30 px-8 py-32 md:px-28 md:py-44"
    >
      <div className="mx-auto max-w-6xl">
        <motion.p
          {...fade(0)}
          className="text-xs uppercase tracking-[3px] text-muted-foreground"
        >
          SOLUTION
        </motion.p>

        <motion.h2
          {...fade(0.1)}
          className="mt-6 max-w-3xl text-4xl tracking-[-1px] md:text-6xl"
        >
          The platform for <Serif>meaningful</Serif> content
        </motion.h2>

        <motion.div {...fade(0.2)} className="mt-12">
          <video
            className="aspect-[3/1] w-full rounded-2xl object-cover"
            src={SOLUTION_VIDEO}
            autoPlay
            loop
            muted
            playsInline
            aria-hidden
          />
        </motion.div>

        <div className="mt-16 grid gap-8 md:grid-cols-4">
          {FEATURES.map((feature, i) => (
            <motion.div key={feature.title} {...fade(0.1 * i)}>
              <h3 className="text-base font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
