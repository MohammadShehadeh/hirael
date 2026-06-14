"use client";

import { cn } from "@/lib/utils";

import { About } from "./about";
import { Features } from "./features";
import { almarai, instrumentSerif } from "./fonts";
import { Footer } from "./footer";
import { Hero } from "./hero";

export default function CreativeStudio() {
  return (
    <div
      className={cn(
        almarai.variable,
        instrumentSerif.variable,
        "bg-black text-[#DEDBC8] antialiased",
      )}
      style={{
        fontFamily: "var(--font-almarai), ui-sans-serif, system-ui, sans-serif",
      }}
    >
      <Hero />
      <About />
      <Features />
      <Footer />
    </div>
  );
}
