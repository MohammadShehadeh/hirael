"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

import { Button, CornerTicks, GlitchText, reveal } from "./primitives";
import { ProductMock } from "./product-mock";

export function Hero() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const gridY = useTransform(scrollY, [0, 700], [0, 90]);

  return (
    <section
      id="top"
      data-slot="hero"
      className="relative overflow-hidden px-4 pb-16 pt-32 sm:px-6 sm:pt-40"
    >
      <motion.div
        aria-hidden
        style={{ y: reduce ? 0 : gridY }}
        className="pointer-events-none absolute inset-0 -top-32"
      >
        <div className="zen-grid zen-fade-edges absolute inset-0" />
        <div className="zen-dots zen-fade-edges absolute inset-0 opacity-60" />
      </motion.div>
      <div
        aria-hidden
        className="zen-glow pointer-events-none absolute inset-x-0 top-0 h-[520px]"
      />

      <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
        <motion.span
          {...reveal({ y: 12 })}
          className="zen-mono inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground"
        >
          <span className="size-1.5 rounded-full bg-[var(--zen)]" />
          Now in general availability
        </motion.span>

        <motion.h1
          {...reveal({ y: 18, delay: 0.05 })}
          className="mt-6 text-balance font-semibold leading-[1.02] tracking-tight text-foreground"
          style={{ fontSize: "clamp(2.6rem, 6.5vw, 4.75rem)" }}
        >
          Infrastructure that <GlitchText>scales itself.</GlitchText>
        </motion.h1>

        <motion.p
          {...reveal({ y: 18, delay: 0.12 })}
          className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          Infrazen runs your apps across a global network of regions, with
          autoscaling, edge caching, and observability built in. Push from git
          and watch it go live everywhere in seconds. The platform handles
          capacity, failover, and traffic.
        </motion.p>

        <motion.div
          {...reveal({ y: 18, delay: 0.18 })}
          className="mt-8 flex flex-col items-center gap-3 sm:flex-row"
        >
          <Button href="#pricing" withArrow>
            Start deploying
          </Button>
          <Button href="#" variant="ghost">
            View documentation
          </Button>
        </motion.div>

        <motion.p
          {...reveal({ y: 12, delay: 0.24 })}
          className="zen-mono mt-4 text-xs text-muted-foreground"
        >
          Free to start. No credit card. Deploy in under five minutes.
        </motion.p>
      </div>

      <motion.div
        {...reveal({ y: 32, delay: 0.28 })}
        className="relative mx-auto mt-16 max-w-5xl"
      >
        <CornerTicks />
        <ProductMock />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -bottom-px h-24 bg-gradient-to-b from-transparent to-background"
        />
      </motion.div>
    </section>
  );
}
