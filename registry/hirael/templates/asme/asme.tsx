"use client";

import { MotionConfig } from "framer-motion";

import { cn } from "@/lib/utils";

import { About } from "./about";
import { FeaturedVideo } from "./featured-video";
import { inter, instrumentSerif } from "./fonts";
import { Footer } from "./footer";
import { Hero } from "./hero";
import { Philosophy } from "./philosophy";
import { Services } from "./services";
import { AsmeStyles } from "./styles";

export default function Asme() {
  return (
    <MotionConfig reducedMotion="user">
      <main
        className={cn(
          "asme",
          inter.variable,
          instrumentSerif.variable,
          "relative min-h-svh bg-background text-foreground antialiased",
        )}
        style={{
          fontFamily: "var(--font-asme-sans), ui-sans-serif, sans-serif",
        }}
      >
        <AsmeStyles />
        <Hero />
        <About />
        <FeaturedVideo />
        <Philosophy />
        <Services />
        <Footer />
      </main>
    </MotionConfig>
  );
}
