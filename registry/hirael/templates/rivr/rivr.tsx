"use client"

import { MotionConfig } from "framer-motion"

import { Cta } from "./cta"
import { Features } from "./features"
import { Footer } from "./footer"
import { Hero } from "./hero"
import { Metrics } from "./metrics"
import { RivrStyles } from "./styles"

export default function Rivr() {
  return (
    <div className="rivr relative min-h-svh bg-background text-foreground antialiased">
      <RivrStyles />
      <MotionConfig reducedMotion="user">
        <Hero />
        <Metrics />
        <Features />
        <Cta />
        <Footer />
      </MotionConfig>
    </div>
  )
}
