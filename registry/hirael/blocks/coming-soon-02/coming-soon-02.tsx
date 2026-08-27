"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";
import { Badge } from "@/registry/hirael/ui/badge";
import { Button } from "@/registry/hirael/ui/button";
import { Sparkles } from "@/registry/hirael/components/sparkles";

const HEADLINE = "Something new is on the way";

const Headline = () => {
  const reduce = useReducedMotion();
  const words = HEADLINE.split(" ");
  const half = Math.floor(words.length / 2);

  return (
    <h1
      data-slot="coming-soon-title"
      className="max-w-3xl font-serif text-5xl font-medium leading-[1.04] tracking-tight sm:text-6xl md:text-7xl"
    >
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className={cn(
            "inline-block",
            i < half ? "text-muted-foreground" : "text-foreground",
          )}
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 + i * 0.08 }}
        >
          {word}
          {i < words.length - 1 ? " " : null}
        </motion.span>
      ))}
    </h1>
  );
};

const ComingSoon02 = () => {
  const reduce = useReducedMotion();

  return (
    <section
      data-slot="coming-soon"
      className="relative isolate flex min-h-svh flex-col items-center justify-center overflow-hidden bg-background pt-24"
    >
      <motion.div
        data-slot="coming-soon-body"
        className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center gap-5 px-6 text-center md:px-10"
        initial={reduce ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
        >
          <Badge
            variant="outline"
            data-slot="coming-soon-badge"
            className="rounded-full bg-card/70 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground backdrop-blur-sm"
          >
            Launching soon
          </Badge>
        </motion.div>

        <Headline />

        <motion.p
          data-slot="coming-soon-description"
          className="mt-2 max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg"
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          Hirael Cloud brings managed Postgres and object storage to the same
          terminal-first console you use for the registry. We are finishing the
          last pieces now.
        </motion.p>

        <motion.div
          data-slot="coming-soon-actions"
          className="mt-4 flex flex-col items-center gap-4 sm:flex-row"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <Button disabled size="lg" className="rounded-full px-7">
            Coming soon
          </Button>
        </motion.div>
      </motion.div>

      <div
        data-slot="coming-soon-horizon"
        aria-hidden
        className="relative -mt-32 h-96 w-full overflow-hidden [mask-image:radial-gradient(50%_50%,black,transparent)] after:absolute after:-start-1/2 after:top-1/2 after:aspect-[1/0.7] after:w-[200%] after:rounded-[100%] after:border-t after:border-border after:bg-card after:content-['']"
      >
        <div
          data-slot="coming-soon-horizon-glow"
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,color-mix(in_oklch,var(--primary)_40%,transparent),transparent_70%)] opacity-40"
        />
        <Sparkles
          density={0.04}
          size={1.4}
          className="[mask-image:radial-gradient(50%_50%,black,transparent_85%)]"
        />
      </div>
    </section>
  );
};

export default ComingSoon02;
