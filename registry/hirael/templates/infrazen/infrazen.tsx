"use client";

import { MotionConfig } from "framer-motion";

import { cn } from "@/lib/utils";

import { Advantage } from "./advantage";
import { Cta } from "./cta";
import { Faq } from "./faq";
import { Features } from "./features";
import { jetbrainsMono, spaceGrotesk } from "./fonts";
import { Footer } from "./footer";
import { Hero } from "./hero";
import { Integrations } from "./integrations";
import { Navbar } from "./navbar";
import { Pricing } from "./pricing";
import { InfrazenStyles } from "./styles";
import { Trusted } from "./trusted";

export default function Infrazen() {
  return (
    <MotionConfig reducedMotion="user">
      <div
        className={cn(
          "infrazen",
          spaceGrotesk.variable,
          jetbrainsMono.variable,
          "relative min-h-svh bg-background text-foreground antialiased",
        )}
        style={{
          fontFamily:
            "var(--font-infrazen-sans), ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <InfrazenStyles />
        <Navbar />
        <main>
          <Hero />
          <Trusted />
          <Features />
          <Advantage />
          <Integrations />
          <Pricing />
          <Faq />
          <Cta />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
