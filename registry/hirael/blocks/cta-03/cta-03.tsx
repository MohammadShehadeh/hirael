"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { ArrowRight } from "lucide-react";

import { Button } from "@/registry/hirael/ui/button";

const Cta03Backdrop = dynamic(() => import("./cta-03-backdrop"), {
  ssr: false,
  loading: () => <div className="size-full bg-muted/20" />,
});

const Cta03 = () => {
  const [active, setActive] = React.useState(false);

  return (
    <section className="flex w-full items-center justify-center px-4 py-12 md:px-6">
      <div
        className="relative w-full max-w-7xl"
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => setActive(false)}
      >
        <div className="relative flex min-h-[600px] flex-col items-center justify-center overflow-hidden rounded-[48px] border border-border bg-card shadow-sm">
          <div className="pointer-events-none absolute inset-0 opacity-40 mix-blend-multiply dark:opacity-30 dark:mix-blend-screen">
            <Cta03Backdrop active={active} />
          </div>

          <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 text-center">
            <span className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-sm">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-primary" />
              </span>
              AI writing
            </span>

            <h2 className="mb-8 font-serif text-5xl font-medium leading-[1.05] tracking-tight text-foreground md:text-7xl lg:text-8xl">
              Your words,
              <br />
              <span className="text-foreground/80">only sharper.</span>
            </h2>

            <p className="mb-12 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              An AI editor that keeps your voice and tightens everything else.
              It drafts, trims, and proofs while you type.
            </p>

            <Button
              asChild
              size="lg"
              className="group h-14 rounded-full px-10 text-base transition-transform duration-300 hover:scale-105 hover:ring-4 hover:ring-primary/20 active:scale-95"
            >
              <a href="#">
                Start writing
                <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cta03;
