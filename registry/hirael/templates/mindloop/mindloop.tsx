"use client"

import { cn } from "@/lib/utils"

import { Cta } from "./cta"
import { Footer } from "./footer"
import { inter, instrumentSerif } from "./fonts"
import { Hero } from "./hero"
import { Mission } from "./mission"
import { Navbar } from "./navbar"
import { Search } from "./search"
import { Solution } from "./solution"
import { MindloopStyles } from "./styles"

export default function Mindloop() {
  return (
    <div
      className={cn(
        "mindloop",
        inter.variable,
        instrumentSerif.variable,
        "relative min-h-svh bg-background text-foreground antialiased"
      )}
      style={{ fontFamily: "var(--font-mindloop-sans), ui-sans-serif, sans-serif" }}
    >
      <MindloopStyles />
      <Navbar />
      <Hero />
      <Search />
      <Mission />
      <Solution />
      <Cta />
      <Footer />
    </div>
  )
}
