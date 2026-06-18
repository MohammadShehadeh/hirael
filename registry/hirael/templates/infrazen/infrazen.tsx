"use client";

import { MotionConfig } from "framer-motion";

import { cn } from "@/lib/utils";

import { Advantage } from "./advantage";
import { Cta } from "./cta";
import { Faq } from "./faq";
import { Features } from "./features";
import { jetbrainsMono, spaceGrotesk } from "./fonts";
import { Footer } from "./footer";
import { Gallery } from "./gallery";
import { Hero } from "./hero";
import { Integrations } from "./integrations";
import { Navbar } from "./navbar";
import { Pricing } from "./pricing";
import { SectionDivider } from "./primitives";
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
          <SectionDivider index="02" label="Features" />
          <Features />
          <SectionDivider index="03" label="Why Infrazen" />
          <Advantage />
          <SectionDivider index="04" label="Ecosystem" />
          <Integrations />
          <SectionDivider index="05" label="Gallery" />
          <Gallery />
          <SectionDivider index="06" label="Pricing" />
          <Pricing />
          <SectionDivider index="07" label="FAQ" />
          <Faq />
          <SectionDivider index="08" label="Get started" />
          <Cta />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
