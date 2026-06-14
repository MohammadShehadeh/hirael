"use client"

import { MotionConfig } from "framer-motion"

import { cn } from "@/lib/utils"

import { Cta } from "./cta"
import { Ecosystem } from "./ecosystem"
import { Features } from "./features"
import { inter, spaceGrotesk } from "./fonts"
import { Footer } from "./footer"
import { Hero } from "./hero"
import { Stats } from "./stats"
import { RivrStyles } from "./styles"

export default function Rivr() {
  return (
    <div
      className={cn(
        "rivr",
        inter.variable,
        spaceGrotesk.variable,
        "relative min-h-svh bg-background text-foreground antialiased"
      )}
      style={{
        fontFamily: "var(--font-rivr-sans), ui-sans-serif, system-ui, sans-serif",
      }}
    >
      <RivrStyles />
      <MotionConfig reducedMotion="user">
        <Hero />
        <Features />
        <Stats />
        <Ecosystem />
        <Cta />
        <Footer />
      </MotionConfig>
    </div>
  )
}
