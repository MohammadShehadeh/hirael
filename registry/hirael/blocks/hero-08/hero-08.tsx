"use client";

import * as React from "react";
import { Play, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";
import { Badge } from "@/registry/hirael/ui/badge";
import { Button } from "@/registry/hirael/ui/button";

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M12 2C6.48 2 2 6.58 2 12.22c0 4.5 2.87 8.32 6.84 9.67.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.7-2.78.61-3.37-1.36-3.37-1.36-.45-1.18-1.11-1.49-1.11-1.49-.91-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.9 1.56 2.35 1.11 2.92.85.09-.66.35-1.11.63-1.37-2.22-.26-4.55-1.13-4.55-5.04 0-1.11.39-2.02 1.03-2.74-.1-.26-.45-1.3.1-2.7 0 0 .84-.27 2.75 1.04A9.4 9.4 0 0 1 12 7.04c.85 0 1.7.12 2.5.34 1.9-1.31 2.74-1.04 2.74-1.04.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.74 0 3.92-2.34 4.78-4.57 5.03.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.04 10.04 0 0 0 22 12.22C22 6.58 17.52 2 12 2Z"
      />
    </svg>
  );
};

const Hero08 = () => {
  const reduceMotion = useReducedMotion();

  const item = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section
      data-slot="hero"
      className="relative z-0 min-h-180 overflow-hidden rounded-sm border border-muted bg-background pt-30"
    >
      <div
        data-slot="hero-backdrop"
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(120% 90% at 50% -10%, color-mix(in oklch, var(--primary) 16%, transparent), transparent 55%), radial-gradient(80% 70% at 80% 110%, color-mix(in oklch, var(--foreground) 10%, transparent), transparent 60%)",
        }}
      />
      <div
        data-slot="hero-grid"
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40 mask-[radial-gradient(ellipse_at_center,black_25%,transparent_75%)]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      <motion.div
        data-slot="hero-content"
        className="relative z-10 px-6"
        initial="hidden"
        animate="visible"
      >
        <div className="mx-auto mb-8 max-w-4xl space-y-4 text-center sm:mb-12 md:mb-16">
          <Badge variant="outline" className="backdrop-blur-sm">
            <Sparkles className="size-3" />
            <span className="text-xs">Design workflows visually</span>
          </Badge>

          <motion.h1
            className="font-serif text-5xl leading-[1.04] font-medium tracking-tight md:text-6xl lg:text-7xl"
            variants={item}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            One workspace for every{" "}
            <span className="text-muted-foreground italic">moving part</span>
          </motion.h1>

          <motion.p
            className="mx-auto mt-8 w-full text-base tracking-tight text-muted-foreground sm:text-lg"
            variants={item}
            transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
          >
            Build, review, and ship your work from one place. Drag to arrange,
            connect the pieces, and keep the details that matter in view.
          </motion.p>

          <motion.div
            className="mx-auto my-8 flex flex-col items-center justify-center gap-4 sm:flex-row md:max-w-md"
            variants={item}
            transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
          >
            <Button asChild size="lg">
              <a className="flex items-center gap-2" href="#">
                <GithubIcon className="size-4" />
                Connect repository
              </a>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <a className="flex items-center gap-2" href="#features">
                <Play className="size-3.5 fill-current" />
                See how it works
              </a>
            </Button>
          </motion.div>
        </div>

        <div
          data-slot="hero-preview"
          className={cn(
            "mx-auto max-w-5xl rounded-t-xl border border-b-0 border-border",
            "bg-card/60 p-2 shadow-elevated backdrop-blur-sm",
          )}
        >
          <div className="flex items-center gap-1.5 px-2 pb-2">
            <span className="size-2.5 rounded-full bg-muted" />
            <span className="size-2.5 rounded-full bg-muted" />
            <span className="size-2.5 rounded-full bg-muted" />
          </div>
          <div className="grid h-64 grid-cols-3 gap-2 rounded-lg border border-border bg-background/80 p-3">
            {[0, 1, 2].map((column) => (
              <div key={column} className="flex flex-col gap-2">
                {[0, 1, 2].map((row) => (
                  <div
                    key={row}
                    className="flex-1 rounded-md border border-border bg-muted/40"
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero08;
